/**
 * Pursuit Protocol Dashboard
 * Main dashboard for the Universal Pursuit Protocol Framework
 * TEAM Integrated Solutions Group
 */

import React, { useState, useEffect, useMemo } from 'react';
import type {
  PursuitOpportunity,
  GlobalSystemIntegrator,
  PursuitStage,
  IntelligenceModuleCode,
  DashboardMetrics,
} from '../types';
import { getPursuitEngine } from '../services/pursuitEngine';
import { getIntelligenceService } from '../services/intelligenceService';
import { PURSUIT_STAGES, MARKET_STATS } from '../constants';
import { NeuralLinkVisualization, CompactNeuralView } from './NeuralLinkVisualization';

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color = 'black' }) => (
  <div className="border border-black p-4">
    <div className="text-xs uppercase tracking-wider text-gray-600">{title}</div>
    <div className="text-2xl font-bold mt-1" style={{ color }}>{value}</div>
    {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

interface StageIndicatorProps {
  stage: PursuitStage;
  currentStage: PursuitStage;
}

const StageIndicator: React.FC<StageIndicatorProps> = ({ stage, currentStage }) => {
  const stageConfig = PURSUIT_STAGES[stage];
  const currentConfig = PURSUIT_STAGES[currentStage];
  const isActive = stage === currentStage;
  const isPast = stageConfig.number < currentConfig.number;

  return (
    <div className="flex items-center">
      <div
        className={`w-8 h-8 flex items-center justify-center border-2 font-bold text-sm
          ${isActive ? 'bg-green-600 border-green-600 text-white' :
            isPast ? 'bg-gray-800 border-gray-800 text-white' :
            'bg-white border-gray-300 text-gray-400'}`}
      >
        {stageConfig.number}
      </div>
      <div className={`ml-2 text-xs ${isActive ? 'font-bold text-green-700' : isPast ? 'text-gray-600' : 'text-gray-400'}`}>
        {stageConfig.name}
      </div>
    </div>
  );
};

// ============================================================================
// GSI TABLE
// ============================================================================

interface GSITableProps {
  gsis: GlobalSystemIntegrator[];
  onSelect: (gsi: GlobalSystemIntegrator) => void;
  selectedGSI?: GlobalSystemIntegrator;
}

const GSITable: React.FC<GSITableProps> = ({ gsis, onSelect, selectedGSI }) => (
  <div className="border border-black overflow-hidden">
    <div className="bg-red-700 text-white px-4 py-2">
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Top Global System Integrators - Target Market
      </h3>
      <p className="text-xs mt-1 opacity-90">
        Total: ${MARKET_STATS.totalRevenue}B Revenue • {(MARKET_STATS.totalHeadcount / 1000000).toFixed(1)}M+ Employees
      </p>
    </div>
    <div className="overflow-x-auto max-h-64 overflow-y-auto">
      <table className="w-full text-xs">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left font-bold border-b border-black">Rank</th>
            <th className="px-3 py-2 text-left font-bold border-b border-black">Company</th>
            <th className="px-3 py-2 text-right font-bold border-b border-black">Revenue (B)</th>
            <th className="px-3 py-2 text-right font-bold border-b border-black">Headcount</th>
            <th className="px-3 py-2 text-center font-bold border-b border-black">Tier</th>
            <th className="px-3 py-2 text-center font-bold border-b border-black">Priority</th>
          </tr>
        </thead>
        <tbody>
          {gsis.map((gsi) => (
            <tr
              key={gsi.rank}
              className={`cursor-pointer hover:bg-gray-50 transition-colors
                ${selectedGSI?.rank === gsi.rank ? 'bg-green-50' : ''}`}
              onClick={() => onSelect(gsi)}
            >
              <td className="px-3 py-2 border-b border-gray-200 font-bold">{gsi.rank}</td>
              <td className="px-3 py-2 border-b border-gray-200 font-medium">{gsi.company}</td>
              <td className="px-3 py-2 border-b border-gray-200 text-right">${gsi.revenue}B</td>
              <td className="px-3 py-2 border-b border-gray-200 text-right">
                {gsi.headcount.toLocaleString()}
              </td>
              <td className="px-3 py-2 border-b border-gray-200 text-center">
                <span className={`px-2 py-0.5 text-xs font-bold uppercase
                  ${gsi.marketSegment === 'tier1' ? 'bg-red-100 text-red-700' :
                    gsi.marketSegment === 'tier2' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'}`}>
                  {gsi.marketSegment}
                </span>
              </td>
              <td className="px-3 py-2 border-b border-gray-200 text-center">
                <span className={`px-2 py-0.5 text-xs font-bold uppercase
                  ${gsi.pursuitPriority === 'critical' ? 'bg-red-600 text-white' :
                    gsi.pursuitPriority === 'high' ? 'bg-orange-500 text-white' :
                    gsi.pursuitPriority === 'medium' ? 'bg-yellow-500 text-black' :
                    'bg-gray-400 text-white'}`}>
                  {gsi.pursuitPriority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================================================
// PURSUIT LIST
// ============================================================================

interface PursuitListProps {
  pursuits: PursuitOpportunity[];
  onSelect: (pursuit: PursuitOpportunity) => void;
  selectedPursuit?: PursuitOpportunity;
}

const PursuitList: React.FC<PursuitListProps> = ({ pursuits, onSelect, selectedPursuit }) => (
  <div className="border border-black">
    <div className="bg-green-700 text-white px-4 py-2">
      <h3 className="text-sm font-bold uppercase tracking-wider">Active Pursuits</h3>
      <p className="text-xs mt-1 opacity-90">{pursuits.length} opportunities in pipeline</p>
    </div>
    <div className="max-h-64 overflow-y-auto">
      {pursuits.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          No active pursuits. Create a new pursuit to get started.
        </div>
      ) : (
        pursuits.map((pursuit) => (
          <div
            key={pursuit.id}
            className={`px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
              ${selectedPursuit?.id === pursuit.id ? 'bg-green-50' : ''}`}
            onClick={() => onSelect(pursuit)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-sm">{pursuit.name}</div>
                <div className="text-xs text-gray-600">{pursuit.targetGSI.company}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-700">
                  ${(pursuit.estimatedValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-500">
                  {pursuit.probabilityOfWin.toFixed(0)}% win
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
                {(['engagement', 'shaping', 'solutioning', 'end_game', 'negotiation'] as PursuitStage[]).map((stage) => (
                  <div
                    key={stage}
                    className={`w-6 h-1 ${
                      PURSUIT_STAGES[stage].number <= PURSUIT_STAGES[pursuit.currentStage].number
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold uppercase
                ${pursuit.status === 'active' ? 'bg-green-100 text-green-700' :
                  pursuit.status === 'won' ? 'bg-blue-600 text-white' :
                  pursuit.status === 'lost' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'}`}>
                {pursuit.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ============================================================================
// PURSUIT DETAIL
// ============================================================================

interface PursuitDetailProps {
  pursuit: PursuitOpportunity;
  onAdvanceStage: () => void;
  onUpdateStatus: (status: PursuitOpportunity['status']) => void;
}

const PursuitDetail: React.FC<PursuitDetailProps> = ({ pursuit, onAdvanceStage, onUpdateStatus }) => {
  const intelligenceService = getIntelligenceService();
  const insights = intelligenceService.analyzeOpportunity(pursuit);

  return (
    <div className="border border-black">
      <div className="bg-gray-900 text-white px-4 py-3">
        <h3 className="font-bold">{pursuit.name}</h3>
        <p className="text-xs text-gray-400">{pursuit.targetGSI.company} • {pursuit.probablePM}</p>
      </div>

      {/* Stage Progress */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-xs uppercase tracking-wider text-gray-600 mb-3">Pursuit Stage</div>
        <div className="flex flex-wrap gap-4">
          {(['engagement', 'shaping', 'solutioning', 'end_game', 'negotiation'] as PursuitStage[]).map((stage) => (
            <StageIndicator key={stage} stage={stage} currentStage={pursuit.currentStage} />
          ))}
        </div>
        {PURSUIT_STAGES[pursuit.currentStage].number < 5 && (
          <button
            onClick={onAdvanceStage}
            className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
          >
            Advance to Next Stage
          </button>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
        <div className="bg-white p-3">
          <div className="text-xs text-gray-500">Value</div>
          <div className="font-bold text-green-700">${(pursuit.estimatedValue / 1000000).toFixed(1)}M</div>
        </div>
        <div className="bg-white p-3">
          <div className="text-xs text-gray-500">Pursuit Cost</div>
          <div className="font-bold text-red-600">${(pursuit.pursuitCost / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-white p-3">
          <div className="text-xs text-gray-500">Win Probability</div>
          <div className="font-bold">{pursuit.probabilityOfWin.toFixed(0)}%</div>
        </div>
        <div className="bg-white p-3">
          <div className="text-xs text-gray-500">Intelligence Score</div>
          <div className="font-bold text-blue-600">{pursuit.intelligenceScore}</div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs uppercase tracking-wider text-gray-600 mb-3">Intelligence Insights</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {insights.slice(0, 5).map((insight, idx) => (
            <div
              key={idx}
              className={`p-2 text-xs border-l-4
                ${insight.category === 'opportunity' ? 'border-green-500 bg-green-50' :
                  insight.category === 'risk' ? 'border-red-500 bg-red-50' :
                  insight.category === 'alert' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'}`}
            >
              <div className="flex justify-between">
                <span className="font-bold">{insight.title}</span>
                <span className="text-gray-500">{insight.moduleCode}</span>
              </div>
              <p className="text-gray-600 mt-1">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onUpdateStatus('won')}
          className="px-3 py-1 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
        >
          Mark Won
        </button>
        <button
          onClick={() => onUpdateStatus('lost')}
          className="px-3 py-1 bg-red-600 text-white text-xs font-bold hover:bg-red-700"
        >
          Mark Lost
        </button>
        <button
          onClick={() => onUpdateStatus('on_hold')}
          className="px-3 py-1 bg-gray-600 text-white text-xs font-bold hover:bg-gray-700"
        >
          Put On Hold
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CREATE PURSUIT MODAL
// ============================================================================

interface CreatePursuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; gsi: GlobalSystemIntegrator; value: number }) => void;
  gsis: GlobalSystemIntegrator[];
}

const CreatePursuitModal: React.FC<CreatePursuitModalProps> = ({ isOpen, onClose, onCreate, gsis }) => {
  const [name, setName] = useState('');
  const [selectedGSI, setSelectedGSI] = useState<GlobalSystemIntegrator | null>(null);
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedGSI && value) {
      onCreate({
        name,
        gsi: selectedGSI,
        value: parseFloat(value) * 1000000, // Convert M to actual value
      });
      setName('');
      setSelectedGSI(null);
      setValue('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black w-full max-w-md">
        <div className="bg-green-700 text-white px-4 py-3">
          <h3 className="font-bold">Create New Pursuit</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
              Pursuit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black px-3 py-2 text-sm"
              placeholder="Enter pursuit name"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
              Target GSI
            </label>
            <select
              value={selectedGSI?.rank || ''}
              onChange={(e) => setSelectedGSI(gsis.find(g => g.rank === parseInt(e.target.value)) || null)}
              className="w-full border border-black px-3 py-2 text-sm"
              required
            >
              <option value="">Select a GSI</option>
              {gsis.map((gsi) => (
                <option key={gsi.rank} value={gsi.rank}>
                  {gsi.rank}. {gsi.company} (${gsi.revenue}B)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
              Estimated Value (Millions USD)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-black px-3 py-2 text-sm"
              placeholder="e.g., 5 for $5M"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white font-bold hover:bg-green-700"
            >
              Create Pursuit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-black hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export const PursuitDashboard: React.FC = () => {
  const [pursuits, setPursuits] = useState<PursuitOpportunity[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedPursuit, setSelectedPursuit] = useState<PursuitOpportunity | null>(null);
  const [selectedGSI, setSelectedGSI] = useState<GlobalSystemIntegrator | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'neural'>('dashboard');

  const engine = useMemo(() => getPursuitEngine(), []);
  const intelligenceService = useMemo(() => getIntelligenceService(), []);

  const gsis = engine.getTargetMarket();
  const neuralLinks = intelligenceService.getNeuralLinks();

  useEffect(() => {
    setPursuits(engine.getOpportunities());
    setMetrics(engine.getDashboardMetrics());
  }, [engine]);

  const handleCreatePursuit = (data: { name: string; gsi: GlobalSystemIntegrator; value: number }) => {
    const businessUnits = engine.getBusinessUnits();
    const pursuit = engine.createPursuit({
      name: data.name,
      targetGSI: data.gsi,
      businessUnitId: businessUnits[0].id,
      estimatedValue: data.value,
      expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    setPursuits(engine.getOpportunities());
    setMetrics(engine.getDashboardMetrics());
    setSelectedPursuit(pursuit);
  };

  const handleAdvanceStage = () => {
    if (selectedPursuit) {
      const updated = engine.advanceStage(selectedPursuit.id, 'Dashboard User');
      setPursuits(engine.getOpportunities());
      setMetrics(engine.getDashboardMetrics());
      setSelectedPursuit(updated);
    }
  };

  const handleUpdateStatus = (status: PursuitOpportunity['status']) => {
    if (selectedPursuit) {
      const updated = engine.updatePursuitStatus(selectedPursuit.id, status);
      setPursuits(engine.getOpportunities());
      setMetrics(engine.getDashboardMetrics());
      setSelectedPursuit(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-mono">
      {/* Header */}
      <header className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold tracking-wider uppercase">
                Universal Pursuit Protocol
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                TEAM Integrated Solutions Group • Deep Learning - Pursuit Costs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex border border-black">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 text-sm font-bold ${
                    activeView === 'dashboard' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('neural')}
                  className={`px-4 py-2 text-sm font-bold border-l border-black ${
                    activeView === 'neural' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  Neural Network
                </button>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-bold hover:bg-green-700"
              >
                + New Pursuit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'dashboard' ? (
          <>
            {/* Metrics Row */}
            {metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                <MetricCard
                  title="Total Pipeline"
                  value={`$${(metrics.pipelineValue / 1000000).toFixed(1)}M`}
                  color="#16a34a"
                />
                <MetricCard
                  title="Active Pursuits"
                  value={metrics.activePursuits}
                  subtitle={`of ${metrics.totalOpportunities} total`}
                />
                <MetricCard
                  title="Pursuit Costs"
                  value={`$${(metrics.pursuitCosts / 1000).toFixed(0)}K`}
                  color="#dc2626"
                />
                <MetricCard
                  title="Win Rate"
                  value={`${metrics.winRate.toFixed(0)}%`}
                  color="#2563eb"
                />
                <MetricCard
                  title="Avg Cycle"
                  value={`${metrics.averageCycleTime}d`}
                  subtitle="days to close"
                />
                <MetricCard
                  title="Target Market"
                  value={`$${MARKET_STATS.totalRevenue}B`}
                  subtitle="Top 20 GSIs"
                />
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - GSI Table */}
              <div className="lg:col-span-2 space-y-6">
                <GSITable
                  gsis={gsis}
                  onSelect={setSelectedGSI}
                  selectedGSI={selectedGSI || undefined}
                />

                {/* Intelligence Modules */}
                <div className="border border-black">
                  <div className="bg-blue-700 text-white px-4 py-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Intelligence Modules - Round Robin Assignment
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200">
                    {intelligenceService.getAllModules().map((module) => (
                      <CompactNeuralView
                        key={module.code}
                        moduleCode={module.code}
                        links={neuralLinks}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Pursuits */}
              <div className="space-y-6">
                <PursuitList
                  pursuits={pursuits}
                  onSelect={setSelectedPursuit}
                  selectedPursuit={selectedPursuit || undefined}
                />

                {selectedPursuit && (
                  <PursuitDetail
                    pursuit={selectedPursuit}
                    onAdvanceStage={handleAdvanceStage}
                    onUpdateStatus={handleUpdateStatus}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          /* Neural Network View */
          <div className="space-y-6">
            <NeuralLinkVisualization
              neuralLinks={neuralLinks}
              highlightedModule={selectedGSI ? undefined : undefined}
              onModuleClick={(module) => console.log('Module clicked:', module)}
              onCodeClick={(code) => console.log('Code clicked:', code)}
            />

            {/* Network Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {intelligenceService.getAllModules().map((module) => {
                const analytics = intelligenceService.getModuleAnalytics(module.code);
                return (
                  <div key={module.code} className="border border-black p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{module.code}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        analytics.healthStatus === 'healthy' ? 'bg-green-500' :
                        analytics.healthStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="text-xs text-gray-600">{module.name}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Links</div>
                        <div className="font-bold">{analytics.activeConnections}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Strength</div>
                        <div className="font-bold">{(analytics.averageLinkStrength * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div>
              <span className="font-bold text-green-700">TEAM</span> Integrated Solutions Group
            </div>
            <div>
              Universal Pursuit Protocol v1.0 • 57 Pursuit Codes • 6 Intelligence Modules
            </div>
          </div>
        </div>
      </footer>

      {/* Create Modal */}
      <CreatePursuitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePursuit}
        gsis={gsis}
      />
    </div>
  );
};

export default PursuitDashboard;

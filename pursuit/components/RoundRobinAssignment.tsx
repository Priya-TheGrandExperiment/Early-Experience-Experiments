/**
 * Round Robin Assignment Component
 * Visualizes and manages the round robin pursuit code assignment system
 * Based on the whiteboard design: Round Robin Pursuit Codes with Probable PMs
 */

import React, { useState, useMemo } from 'react';
import type {
  IntelligenceModuleCode,
  RoundRobinAssignment as RRAssignment,
  PursuitCode,
} from '../types';
import { INTELLIGENCE_MODULES, PURSUIT_CODES, DEFAULT_NEURAL_LINK_WEIGHTS } from '../constants';

// ============================================================================
// TYPES
// ============================================================================

interface ModuleAssignment {
  module: IntelligenceModuleCode;
  pmNames: string[];
  assignedCodes: number[];
  currentPMIndex: number;
  totalAssignments: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MODULE_COLORS: Record<IntelligenceModuleCode, string> = {
  EDP: '#dc2626',
  EPL: '#2563eb',
  CRM: '#16a34a',
  ECP: '#9333ea',
  SLS: '#ea580c',
  OPS: '#0891b2',
};

const PM_POOL: Record<IntelligenceModuleCode, string[]> = {
  EDP: ['Alex Chen', 'Maria Garcia', 'James Wilson', 'Emma Thompson'],
  EPL: ['Sarah Johnson', 'Michael Brown', 'Emily Davis', 'Ryan Martinez'],
  CRM: ['David Miller', 'Jennifer Taylor', 'Robert Anderson', 'Lisa White'],
  ECP: ['Chris Thompson', 'Amanda Clark', 'Kevin Lee', 'Nicole Harris'],
  SLS: ['Mark Robinson', 'Jessica Lee', 'Daniel Harris', 'Rachel Green'],
  OPS: ['Nicole Walker', 'Kevin Lewis', 'Ashley Moore', 'Brandon Young'],
};

// ============================================================================
// ROUND ROBIN MANAGER
// ============================================================================

interface RoundRobinManagerProps {
  onAssign?: (assignment: RRAssignment) => void;
}

export const RoundRobinManager: React.FC<RoundRobinManagerProps> = ({ onAssign }) => {
  const [assignments, setAssignments] = useState<ModuleAssignment[]>(() => {
    const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];
    return modules.map((module) => ({
      module,
      pmNames: PM_POOL[module],
      assignedCodes: DEFAULT_NEURAL_LINK_WEIGHTS[module],
      currentPMIndex: 0,
      totalAssignments: 0,
    }));
  });

  const [history, setHistory] = useState<RRAssignment[]>([]);
  const [selectedModule, setSelectedModule] = useState<IntelligenceModuleCode | null>(null);

  const performAssignment = (moduleCode: IntelligenceModuleCode) => {
    const moduleIndex = assignments.findIndex((a) => a.module === moduleCode);
    if (moduleIndex === -1) return;

    const moduleAssignment = assignments[moduleIndex];
    const nextPMIndex = (moduleAssignment.currentPMIndex + 1) % moduleAssignment.pmNames.length;
    const assignedPM = moduleAssignment.pmNames[moduleAssignment.currentPMIndex];

    // Create assignment record
    const newAssignment: RRAssignment = {
      id: `rr-${Date.now()}`,
      pursuitId: `pursuit-${Date.now()}`,
      assignedModule: moduleCode,
      assignedPM,
      pursuitCodes: moduleAssignment.assignedCodes.slice(0, 5),
      assignedAt: new Date(),
    };

    // Update state
    const updatedAssignments = [...assignments];
    updatedAssignments[moduleIndex] = {
      ...moduleAssignment,
      currentPMIndex: nextPMIndex,
      totalAssignments: moduleAssignment.totalAssignments + 1,
    };

    setAssignments(updatedAssignments);
    setHistory((prev) => [newAssignment, ...prev].slice(0, 20));

    if (onAssign) {
      onAssign(newAssignment);
    }
  };

  return (
    <div className="border border-black">
      {/* Header */}
      <div className="bg-red-700 text-white px-4 py-3">
        <h2 className="font-bold uppercase tracking-wider">Round Robin Pursuit Codes</h2>
        <p className="text-xs mt-1 opacity-90">Probable PMs Assignment System</p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200">
        {assignments.map((assignment) => (
          <ModuleCard
            key={assignment.module}
            assignment={assignment}
            isSelected={selectedModule === assignment.module}
            onSelect={() => setSelectedModule(assignment.module)}
            onAssign={() => performAssignment(assignment.module)}
          />
        ))}
      </div>

      {/* Selected Module Detail */}
      {selectedModule && (
        <ModuleDetail
          assignment={assignments.find((a) => a.module === selectedModule)!}
          pursuitCodes={PURSUIT_CODES}
          onClose={() => setSelectedModule(null)}
        />
      )}

      {/* Assignment History */}
      <div className="border-t border-black">
        <div className="bg-gray-100 px-4 py-2">
          <h3 className="text-xs font-bold uppercase tracking-wider">Recent Assignments</h3>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No assignments yet. Click a module to assign.
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="px-4 py-2 border-b border-gray-100 text-xs flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: MODULE_COLORS[record.assignedModule] }}
                  />
                  <span className="font-bold">{record.assignedModule}</span>
                  <span className="text-gray-600">→</span>
                  <span>{record.assignedPM}</span>
                </div>
                <span className="text-gray-400">
                  {record.assignedAt.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODULE CARD
// ============================================================================

interface ModuleCardProps {
  assignment: ModuleAssignment;
  isSelected: boolean;
  onSelect: () => void;
  onAssign: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ assignment, isSelected, onSelect, onAssign }) => {
  const currentPM = assignment.pmNames[assignment.currentPMIndex];
  const moduleInfo = INTELLIGENCE_MODULES.find((m) => m.code === assignment.module);

  return (
    <div
      className={`bg-white p-4 cursor-pointer transition-colors ${
        isSelected ? 'ring-2 ring-inset' : ''
      }`}
      style={{ ringColor: isSelected ? MODULE_COLORS[assignment.module] : undefined }}
      onClick={onSelect}
    >
      {/* Module Header */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="px-3 py-1 text-sm font-bold text-white"
          style={{ backgroundColor: MODULE_COLORS[assignment.module] }}
        >
          {assignment.module}
        </div>
        <span className="text-xs text-gray-500">
          {assignment.totalAssignments} assigned
        </span>
      </div>

      {/* Module Name */}
      <div className="text-xs text-gray-600 mb-2">
        {moduleInfo?.name || 'Intelligence Module'}
      </div>

      {/* Current PM */}
      <div className="border border-gray-200 p-2 mb-3">
        <div className="text-xs text-gray-500 uppercase">Next PM</div>
        <div className="font-bold text-sm">{currentPM}</div>
      </div>

      {/* Pursuit Codes Preview */}
      <div className="flex flex-wrap gap-1 mb-3">
        {assignment.assignedCodes.slice(0, 6).map((code) => (
          <span
            key={code}
            className="w-6 h-6 flex items-center justify-center text-xs border"
            style={{ borderColor: MODULE_COLORS[assignment.module] }}
          >
            {code}
          </span>
        ))}
        {assignment.assignedCodes.length > 6 && (
          <span className="text-xs text-gray-400 self-center">
            +{assignment.assignedCodes.length - 6}
          </span>
        )}
      </div>

      {/* Assign Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAssign();
        }}
        className="w-full px-3 py-2 text-xs font-bold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: MODULE_COLORS[assignment.module] }}
      >
        Assign Next Pursuit
      </button>
    </div>
  );
};

// ============================================================================
// MODULE DETAIL
// ============================================================================

interface ModuleDetailProps {
  assignment: ModuleAssignment;
  pursuitCodes: PursuitCode[];
  onClose: () => void;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ assignment, pursuitCodes, onClose }) => {
  const moduleInfo = INTELLIGENCE_MODULES.find((m) => m.code === assignment.module);
  const linkedCodes = pursuitCodes.filter((code) =>
    assignment.assignedCodes.includes(code.code)
  );

  return (
    <div className="border-t border-black">
      <div
        className="px-4 py-3 flex justify-between items-center"
        style={{ backgroundColor: MODULE_COLORS[assignment.module] }}
      >
        <div className="text-white">
          <h3 className="font-bold">{assignment.module} Intelligence</h3>
          <p className="text-xs opacity-90">{moduleInfo?.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:opacity-80 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        {/* PM Rotation */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            PM Rotation Queue
          </h4>
          <div className="flex flex-wrap gap-2">
            {assignment.pmNames.map((pm, index) => (
              <div
                key={pm}
                className={`px-3 py-1 text-xs border ${
                  index === assignment.currentPMIndex
                    ? 'border-2 font-bold'
                    : 'border-gray-300 text-gray-600'
                }`}
                style={{
                  borderColor:
                    index === assignment.currentPMIndex
                      ? MODULE_COLORS[assignment.module]
                      : undefined,
                }}
              >
                {index === assignment.currentPMIndex && '→ '}
                {pm}
              </div>
            ))}
          </div>
        </div>

        {/* Linked Pursuit Codes */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Linked Pursuit Codes ({linkedCodes.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {linkedCodes.map((code) => (
              <div
                key={code.code}
                className="p-2 border text-xs"
                style={{ borderColor: MODULE_COLORS[assignment.module] }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">#{code.code}</span>
                  <span
                    className={`px-1 text-xs ${
                      code.complexity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : code.complexity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : code.complexity === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {code.complexity}
                  </span>
                </div>
                <div className="text-gray-600 mt-1 truncate">{code.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Capabilities */}
        {moduleInfo && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Capabilities
            </h4>
            <div className="flex flex-wrap gap-1">
              {moduleInfo.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-1 bg-gray-100 text-xs text-gray-700"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PURSUIT CODE GRID (57 Codes Visualization)
// ============================================================================

interface PursuitCodeGridProps {
  codes?: PursuitCode[];
  highlightedCodes?: number[];
  onCodeClick?: (code: PursuitCode) => void;
}

export const PursuitCodeGrid: React.FC<PursuitCodeGridProps> = ({
  codes = PURSUIT_CODES.slice(0, 57),
  highlightedCodes = [],
  onCodeClick,
}) => {
  // Determine which module each code is primarily linked to
  const getCodeModule = (codeNum: number): IntelligenceModuleCode => {
    const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];
    for (const module of modules) {
      if (DEFAULT_NEURAL_LINK_WEIGHTS[module].includes(codeNum)) {
        return module;
      }
    }
    return 'EDP';
  };

  return (
    <div className="border border-black">
      <div className="bg-green-800 text-white px-4 py-3">
        <h2 className="font-bold uppercase tracking-wider">Pursuit Codes</h2>
        <p className="text-xs mt-1 opacity-90">57 Codes • Neural Link System</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-10 gap-1">
          {codes.map((code) => {
            const module = getCodeModule(code.code);
            const isHighlighted = highlightedCodes.includes(code.code);

            return (
              <div
                key={code.code}
                className={`aspect-square flex items-center justify-center text-xs font-bold border cursor-pointer transition-all
                  ${isHighlighted ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                style={{
                  backgroundColor: isHighlighted ? MODULE_COLORS[module] : 'white',
                  borderColor: MODULE_COLORS[module],
                  color: isHighlighted ? 'white' : 'black',
                }}
                onClick={() => onCodeClick?.(code)}
                title={`${code.name} (${code.category})`}
              >
                {code.code}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">Linked Intelligence Modules:</div>
          <div className="flex flex-wrap gap-3">
            {(['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'] as IntelligenceModuleCode[]).map((module) => (
              <div key={module} className="flex items-center gap-1">
                <span
                  className="w-3 h-3 border"
                  style={{ borderColor: MODULE_COLORS[module] }}
                />
                <span className="text-xs">{module}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundRobinManager;

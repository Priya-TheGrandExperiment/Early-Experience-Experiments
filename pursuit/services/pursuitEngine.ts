/**
 * Universal Pursuit Protocol Engine
 * Core service for managing pursuit lifecycle, gates, and state
 * TEAM Integrated Solutions Group
 */

import type {
  PursuitOpportunity,
  PursuitStage,
  PursuitGate,
  PursuitCode,
  NeuralLink,
  PursuitProtocolState,
  PursuitAction,
  PursuitEvent,
  BusinessUnit,
  GlobalSystemIntegrator,
  IntelligenceModuleCode,
  RoundRobinAssignment,
  DashboardMetrics,
} from '../types';

import {
  PURSUIT_STAGES,
  PURSUIT_CODES,
  INTELLIGENCE_MODULES,
  BUSINESS_UNITS,
  GLOBAL_SYSTEM_INTEGRATORS,
  DEFAULT_PROTOCOL_CONFIG,
  DEFAULT_NEURAL_LINK_WEIGHTS,
  createDefaultGates,
} from '../constants';

// ============================================================================
// PURSUIT PROTOCOL ENGINE
// ============================================================================

export class PursuitProtocolEngine {
  private state: PursuitProtocolState;
  private eventLog: PursuitEvent[] = [];
  private roundRobinIndex: number = 0;

  constructor() {
    this.state = this.initializeState();
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------

  private initializeState(): PursuitProtocolState {
    const neuralLinks = this.generateNeuralLinks();

    return {
      config: DEFAULT_PROTOCOL_CONFIG,
      businessUnits: [...BUSINESS_UNITS],
      intelligenceModules: [...INTELLIGENCE_MODULES],
      pursuitCodes: [...PURSUIT_CODES],
      targetMarket: [...GLOBAL_SYSTEM_INTEGRATORS],
      activeOpportunities: [],
      roundRobinConfig: {
        enabled: true,
        moduleWeights: {
          EDP: 0.95,
          EPL: 0.88,
          CRM: 0.92,
          ECP: 0.85,
          SLS: 0.90,
          OPS: 0.87,
        },
        pursuitCodeAssignments: new Map(),
        lastAssignedIndex: 0,
        assignmentHistory: [],
      },
      neuralLinks,
      totalPursuitCost: 0,
      totalPipelineValue: 0,
      winRate: 0,
      averageDealSize: 0,
    };
  }

  private generateNeuralLinks(): NeuralLink[] {
    const links: NeuralLink[] = [];
    const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];

    modules.forEach((module) => {
      const assignedCodes = DEFAULT_NEURAL_LINK_WEIGHTS[module];
      assignedCodes.forEach((codeNum, index) => {
        links.push({
          id: `nl-${module}-${codeNum}`,
          sourceModule: module,
          targetPursuitCode: codeNum,
          linkStrength: 0.5 + (Math.random() * 0.5), // 0.5-1.0
          linkType: index < 4 ? 'primary' : index < 8 ? 'secondary' : 'tertiary',
          isActive: true,
        });
      });
    });

    return links;
  }

  // --------------------------------------------------------------------------
  // STATE ACCESSORS
  // --------------------------------------------------------------------------

  getState(): PursuitProtocolState {
    return { ...this.state };
  }

  getOpportunities(): PursuitOpportunity[] {
    return [...this.state.activeOpportunities];
  }

  getOpportunityById(id: string): PursuitOpportunity | undefined {
    return this.state.activeOpportunities.find((opp) => opp.id === id);
  }

  getTargetMarket(): GlobalSystemIntegrator[] {
    return [...this.state.targetMarket];
  }

  getPursuitCodes(): PursuitCode[] {
    return [...this.state.pursuitCodes];
  }

  getNeuralLinks(): NeuralLink[] {
    return [...this.state.neuralLinks];
  }

  getBusinessUnits(): BusinessUnit[] {
    return [...this.state.businessUnits];
  }

  // --------------------------------------------------------------------------
  // PURSUIT LIFECYCLE MANAGEMENT
  // --------------------------------------------------------------------------

  createPursuit(params: {
    name: string;
    targetGSI: GlobalSystemIntegrator;
    businessUnitId: string;
    estimatedValue: number;
    expectedCloseDate: Date;
  }): PursuitOpportunity {
    const businessUnit = this.state.businessUnits.find((bu) => bu.id === params.businessUnitId);
    if (!businessUnit) {
      throw new Error(`Business unit ${params.businessUnitId} not found`);
    }

    const id = `pursuit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const gates = createDefaultGates();

    // Auto-assign pursuit codes based on GSI
    const assignedCodes = this.state.pursuitCodes.filter((code) =>
      params.targetGSI.assignedPursuitCodes.includes(code.code)
    );

    // Generate neural links for this pursuit
    const activeNeuralLinks = this.state.neuralLinks.filter((link) =>
      assignedCodes.some((code) => code.code === link.targetPursuitCode)
    );

    // Round robin PM assignment
    const assignment = this.performRoundRobinAssignment(id, assignedCodes);

    const pursuit: PursuitOpportunity = {
      id,
      name: params.name,
      targetGSI: params.targetGSI,
      currentStage: 'engagement',
      gates,
      assignedPursuitCodes: assignedCodes,
      activeNeuralLinks,
      businessUnit,
      estimatedValue: params.estimatedValue,
      pursuitCost: this.calculatePursuitCost(assignedCodes),
      probabilityOfWin: this.calculateInitialProbability(params.targetGSI),
      probablePM: assignment.assignedPM,
      assignmentMethod: 'round_robin',
      createdAt: new Date(),
      lastUpdated: new Date(),
      expectedCloseDate: params.expectedCloseDate,
      status: 'active',
      intelligenceScore: this.calculateIntelligenceScore(activeNeuralLinks),
    };

    this.state.activeOpportunities.push(pursuit);
    this.updateAnalytics();
    this.logEvent('PURSUIT_CREATED', id, { name: params.name, gsi: params.targetGSI.company });

    return pursuit;
  }

  advanceStage(pursuitId: string, approver: string): PursuitOpportunity {
    const pursuit = this.getOpportunityById(pursuitId);
    if (!pursuit) {
      throw new Error(`Pursuit ${pursuitId} not found`);
    }

    const currentStageNum = PURSUIT_STAGES[pursuit.currentStage].number;
    if (currentStageNum >= 5) {
      throw new Error('Pursuit is already at final stage');
    }

    // Approve current gate
    const currentGate = pursuit.gates.find((g) => g.stage === pursuit.currentStage);
    if (currentGate) {
      currentGate.gateStatus = 'approved';
      currentGate.approvedBy = approver;
      currentGate.approvedAt = new Date();
    }

    // Move to next stage
    const stages: PursuitStage[] = ['engagement', 'shaping', 'solutioning', 'end_game', 'negotiation'];
    const nextStage = stages[currentStageNum];

    const nextGate = pursuit.gates.find((g) => g.stage === nextStage);
    if (nextGate) {
      nextGate.gateStatus = 'in_progress';
    }

    // Update pursuit
    const updatedPursuit = {
      ...pursuit,
      currentStage: nextStage,
      lastUpdated: new Date(),
      probabilityOfWin: this.recalculateProbability(pursuit, nextStage),
    };

    this.updatePursuit(pursuitId, updatedPursuit);
    this.logEvent('STAGE_ADVANCED', pursuitId, { from: pursuit.currentStage, to: nextStage, approver });

    return updatedPursuit;
  }

  updatePursuitStatus(pursuitId: string, status: PursuitOpportunity['status']): PursuitOpportunity {
    const pursuit = this.getOpportunityById(pursuitId);
    if (!pursuit) {
      throw new Error(`Pursuit ${pursuitId} not found`);
    }

    const updatedPursuit = {
      ...pursuit,
      status,
      lastUpdated: new Date(),
    };

    this.updatePursuit(pursuitId, updatedPursuit);
    this.updateAnalytics();
    this.logEvent('STATUS_UPDATED', pursuitId, { status });

    return updatedPursuit;
  }

  // --------------------------------------------------------------------------
  // ROUND ROBIN ASSIGNMENT
  // --------------------------------------------------------------------------

  private performRoundRobinAssignment(pursuitId: string, codes: PursuitCode[]): RoundRobinAssignment {
    const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];
    const assignedModule = modules[this.roundRobinIndex % modules.length];

    // Generate PM name based on module
    const pmNames: Record<IntelligenceModuleCode, string[]> = {
      EDP: ['Alex Chen', 'Maria Garcia', 'James Wilson'],
      EPL: ['Sarah Johnson', 'Michael Brown', 'Emily Davis'],
      CRM: ['David Miller', 'Jennifer Taylor', 'Robert Anderson'],
      ECP: ['Lisa Martinez', 'Chris Thompson', 'Amanda White'],
      SLS: ['Mark Robinson', 'Jessica Lee', 'Daniel Harris'],
      OPS: ['Nicole Clark', 'Kevin Lewis', 'Rachel Walker'],
    };

    const moduleIndex = this.roundRobinIndex % pmNames[assignedModule].length;
    const assignedPM = pmNames[assignedModule][moduleIndex];

    const assignment: RoundRobinAssignment = {
      id: `rr-${Date.now()}`,
      pursuitId,
      assignedModule,
      assignedPM,
      pursuitCodes: codes.map((c) => c.code),
      assignedAt: new Date(),
    };

    this.state.roundRobinConfig.assignmentHistory.push(assignment);
    this.roundRobinIndex++;

    return assignment;
  }

  // --------------------------------------------------------------------------
  // COST & PROBABILITY CALCULATIONS
  // --------------------------------------------------------------------------

  private calculatePursuitCost(codes: PursuitCode[]): number {
    return codes.reduce((total, code) => total + code.estimatedCost, 0);
  }

  private calculateInitialProbability(gsi: GlobalSystemIntegrator): number {
    const baseProbability = {
      critical: 35,
      high: 30,
      medium: 25,
      low: 20,
    };

    const tierBonus = {
      tier1: 10,
      tier2: 5,
      tier3: 0,
    };

    return baseProbability[gsi.pursuitPriority] + tierBonus[gsi.marketSegment];
  }

  private recalculateProbability(pursuit: PursuitOpportunity, newStage: PursuitStage): number {
    const stageMultiplier: Record<PursuitStage, number> = {
      engagement: 1.0,
      shaping: 1.15,
      solutioning: 1.35,
      end_game: 1.55,
      negotiation: 1.75,
    };

    const baseProbability = this.calculateInitialProbability(pursuit.targetGSI);
    return Math.min(95, baseProbability * stageMultiplier[newStage]);
  }

  private calculateIntelligenceScore(links: NeuralLink[]): number {
    if (links.length === 0) return 0;
    const totalStrength = links.reduce((sum, link) => sum + link.linkStrength, 0);
    return Math.round((totalStrength / links.length) * 100);
  }

  // --------------------------------------------------------------------------
  // ANALYTICS
  // --------------------------------------------------------------------------

  private updateAnalytics(): void {
    const active = this.state.activeOpportunities.filter((o) => o.status === 'active');
    const won = this.state.activeOpportunities.filter((o) => o.status === 'won');
    const closed = this.state.activeOpportunities.filter((o) => o.status === 'won' || o.status === 'lost');

    this.state.totalPipelineValue = active.reduce((sum, o) => sum + o.estimatedValue, 0);
    this.state.totalPursuitCost = this.state.activeOpportunities.reduce((sum, o) => sum + o.pursuitCost, 0);
    this.state.winRate = closed.length > 0 ? (won.length / closed.length) * 100 : 0;
    this.state.averageDealSize =
      won.length > 0 ? won.reduce((sum, o) => sum + o.estimatedValue, 0) / won.length : 0;
  }

  getDashboardMetrics(): DashboardMetrics {
    const active = this.state.activeOpportunities.filter((o) => o.status === 'active');

    const moduleUtilization: Record<IntelligenceModuleCode, number> = {
      EDP: 0, EPL: 0, CRM: 0, ECP: 0, SLS: 0, OPS: 0,
    };

    const stageDistribution: Record<PursuitStage, number> = {
      engagement: 0, shaping: 0, solutioning: 0, end_game: 0, negotiation: 0,
    };

    active.forEach((pursuit) => {
      stageDistribution[pursuit.currentStage]++;
      pursuit.activeNeuralLinks.forEach((link) => {
        moduleUtilization[link.sourceModule]++;
      });
    });

    // Normalize module utilization
    const totalLinks = Object.values(moduleUtilization).reduce((a, b) => a + b, 0);
    if (totalLinks > 0) {
      (Object.keys(moduleUtilization) as IntelligenceModuleCode[]).forEach((key) => {
        moduleUtilization[key] = Math.round((moduleUtilization[key] / totalLinks) * 100);
      });
    }

    return {
      totalOpportunities: this.state.activeOpportunities.length,
      activePursuits: active.length,
      pipelineValue: this.state.totalPipelineValue,
      pursuitCosts: this.state.totalPursuitCost,
      winRate: this.state.winRate,
      averageCycleTime: 90, // days (would calculate from historical data)
      moduleUtilization,
      stageDistribution,
    };
  }

  // --------------------------------------------------------------------------
  // EVENT LOGGING
  // --------------------------------------------------------------------------

  private logEvent(type: string, pursuitId: string | undefined, details: Record<string, unknown>): void {
    this.eventLog.push({
      id: `evt-${Date.now()}`,
      type,
      pursuitId,
      timestamp: new Date(),
      actor: 'system',
      details,
    });
  }

  getEventLog(): PursuitEvent[] {
    return [...this.eventLog];
  }

  // --------------------------------------------------------------------------
  // STATE UPDATES
  // --------------------------------------------------------------------------

  private updatePursuit(pursuitId: string, updatedPursuit: PursuitOpportunity): void {
    const index = this.state.activeOpportunities.findIndex((o) => o.id === pursuitId);
    if (index !== -1) {
      this.state.activeOpportunities[index] = updatedPursuit;
    }
  }

  // --------------------------------------------------------------------------
  // DISPATCH ACTIONS
  // --------------------------------------------------------------------------

  dispatch(action: PursuitAction): void {
    switch (action.type) {
      case 'CREATE_PURSUIT':
        // Handled by createPursuit method
        break;
      case 'ADVANCE_STAGE':
        this.advanceStage(action.payload.pursuitId, 'system');
        break;
      case 'UPDATE_PURSUIT_STATUS':
        this.updatePursuitStatus(action.payload.pursuitId, action.payload.status);
        break;
      case 'ACTIVATE_NEURAL_LINK':
        this.activateNeuralLink(action.payload.linkId);
        break;
      default:
        console.warn('Unknown action type:', action);
    }
  }

  private activateNeuralLink(linkId: string): void {
    const link = this.state.neuralLinks.find((l) => l.id === linkId);
    if (link) {
      link.isActive = true;
      this.logEvent('NEURAL_LINK_ACTIVATED', undefined, { linkId });
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let engineInstance: PursuitProtocolEngine | null = null;

export const getPursuitEngine = (): PursuitProtocolEngine => {
  if (!engineInstance) {
    engineInstance = new PursuitProtocolEngine();
  }
  return engineInstance;
};

export const resetPursuitEngine = (): void => {
  engineInstance = null;
};

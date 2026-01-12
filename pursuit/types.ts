/**
 * Universal Pursuit Protocol Framework - Type Definitions
 * Based on TEAM Integrated Solutions Group Design (10/13/23)
 * Deep Learning - Pursuit Costs Architecture
 */

// ============================================================================
// PURSUIT STAGES (1-5 Gate Process)
// ============================================================================

export type PursuitStage =
  | 'engagement'      // Stage 1: Initial engagement with prospect
  | 'shaping'         // Stage 2: Shaping the opportunity
  | 'solutioning'     // Stage 3: Building the solution
  | 'end_game'        // Stage 4: End game / final negotiations
  | 'negotiation';    // Stage 5: Contract negotiation

export interface PursuitGate {
  stage: PursuitStage;
  stageNumber: number;
  name: string;
  description: string;
  requiredApprovals: string[];
  completionCriteria: string[];
  gateStatus: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'bypassed';
  approvedBy?: string;
  approvedAt?: Date;
}

// ============================================================================
// INTELLIGENCE MODULES (Neural Link System)
// ============================================================================

export type IntelligenceModuleCode =
  | 'EDP'   // Enterprise Data Platform Intelligence
  | 'EPL'   // Enterprise Platform Intelligence
  | 'CRM'   // Customer Relationship Management Intelligence
  | 'ECP'   // Enterprise Cloud Platform Intelligence
  | 'SLS'   // Sales Intelligence
  | 'OPS';  // Operations Intelligence

export interface IntelligenceModule {
  code: IntelligenceModuleCode;
  name: string;
  description: string;
  capabilities: string[];
  dataFeeds: string[];
  neuralWeight: number; // 0-1, strength of connection
  isActive: boolean;
}

export interface NeuralLink {
  id: string;
  sourceModule: IntelligenceModuleCode;
  targetPursuitCode: number;
  linkStrength: number; // 0-1
  linkType: 'primary' | 'secondary' | 'tertiary';
  isActive: boolean;
}

// ============================================================================
// PURSUIT CODES (57-Code System)
// ============================================================================

export interface PursuitCode {
  code: number;        // 1-57
  category: PursuitCodeCategory;
  name: string;
  description: string;
  linkedModules: IntelligenceModuleCode[];
  estimatedCost: number;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  requiredStage: PursuitStage;
}

export type PursuitCodeCategory =
  | 'strategy'
  | 'technical'
  | 'commercial'
  | 'delivery'
  | 'governance'
  | 'integration';

// ============================================================================
// BUSINESS UNITS
// ============================================================================

export type BusinessUnitType = 'BU' | 'ISG_SL';

export interface BusinessUnit {
  id: string;
  type: BusinessUnitType;
  name: string;
  marketFocus: string;
  salesCapacity: number;
  activeOpportunities: number;
  opsAllocation: number;      // Ops resource allocation %
  intelligenceAccess: IntelligenceModuleCode[];
}

// ============================================================================
// GLOBAL SYSTEM INTEGRATORS (Target Market)
// ============================================================================

export interface GlobalSystemIntegrator {
  rank: number;
  company: string;
  revenue: number;        // in billions USD
  headcount: number;
  marketSegment: 'tier1' | 'tier2' | 'tier3';
  primaryServices: string[];
  geographicReach: string[];
  pursuitPriority: 'critical' | 'high' | 'medium' | 'low';
  assignedPursuitCodes: number[];
}

// ============================================================================
// PURSUIT OPPORTUNITY
// ============================================================================

export interface PursuitOpportunity {
  id: string;
  name: string;
  targetGSI: GlobalSystemIntegrator;
  currentStage: PursuitStage;
  gates: PursuitGate[];
  assignedPursuitCodes: PursuitCode[];
  activeNeuralLinks: NeuralLink[];
  businessUnit: BusinessUnit;

  // Financials
  estimatedValue: number;
  pursuitCost: number;
  probabilityOfWin: number;  // 0-100%

  // Round Robin Assignment
  probablePM: string;
  assignmentMethod: 'round_robin' | 'manual' | 'ai_optimized';

  // Timeline
  createdAt: Date;
  lastUpdated: Date;
  expectedCloseDate: Date;

  // Status
  status: 'active' | 'won' | 'lost' | 'abandoned' | 'on_hold';
  intelligenceScore: number; // 0-100, AI-calculated score
}

// ============================================================================
// ROUND ROBIN ASSIGNMENT SYSTEM
// ============================================================================

export interface RoundRobinConfig {
  enabled: boolean;
  moduleWeights: Record<IntelligenceModuleCode, number>;
  pursuitCodeAssignments: Map<number, IntelligenceModuleCode>;
  lastAssignedIndex: number;
  assignmentHistory: RoundRobinAssignment[];
}

export interface RoundRobinAssignment {
  id: string;
  pursuitId: string;
  assignedModule: IntelligenceModuleCode;
  assignedPM: string;
  pursuitCodes: number[];
  assignedAt: Date;
  performanceScore?: number;
}

// ============================================================================
// PURSUIT PROTOCOL ENGINE
// ============================================================================

export interface PursuitProtocolConfig {
  organizationName: string;
  maxConcurrentPursuits: number;
  gateApprovalRequired: boolean;
  neuralLinkThreshold: number; // minimum strength for activation
  costTrackingEnabled: boolean;
  aiOptimizationEnabled: boolean;
}

export interface PursuitProtocolState {
  config: PursuitProtocolConfig;
  businessUnits: BusinessUnit[];
  intelligenceModules: IntelligenceModule[];
  pursuitCodes: PursuitCode[];
  targetMarket: GlobalSystemIntegrator[];
  activeOpportunities: PursuitOpportunity[];
  roundRobinConfig: RoundRobinConfig;
  neuralLinks: NeuralLink[];

  // Analytics
  totalPursuitCost: number;
  totalPipelineValue: number;
  winRate: number;
  averageDealSize: number;
}

// ============================================================================
// EVENTS & ACTIONS
// ============================================================================

export type PursuitAction =
  | { type: 'CREATE_PURSUIT'; payload: Partial<PursuitOpportunity> }
  | { type: 'ADVANCE_STAGE'; payload: { pursuitId: string; toStage: PursuitStage } }
  | { type: 'APPROVE_GATE'; payload: { pursuitId: string; stage: PursuitStage; approver: string } }
  | { type: 'ASSIGN_PURSUIT_CODE'; payload: { pursuitId: string; codeId: number } }
  | { type: 'ACTIVATE_NEURAL_LINK'; payload: { linkId: string } }
  | { type: 'UPDATE_INTELLIGENCE'; payload: { moduleCode: IntelligenceModuleCode; data: Partial<IntelligenceModule> } }
  | { type: 'ROUND_ROBIN_ASSIGN'; payload: { pursuitId: string } }
  | { type: 'UPDATE_PURSUIT_STATUS'; payload: { pursuitId: string; status: PursuitOpportunity['status'] } }
  | { type: 'CALCULATE_COSTS'; payload: { pursuitId: string } };

export interface PursuitEvent {
  id: string;
  type: string;
  pursuitId?: string;
  timestamp: Date;
  actor: string;
  details: Record<string, unknown>;
}

// ============================================================================
// DASHBOARD & VISUALIZATION
// ============================================================================

export interface DashboardMetrics {
  totalOpportunities: number;
  activePursuits: number;
  pipelineValue: number;
  pursuitCosts: number;
  winRate: number;
  averageCycleTime: number;
  moduleUtilization: Record<IntelligenceModuleCode, number>;
  stageDistribution: Record<PursuitStage, number>;
}

export interface NeuralLinkVisualization {
  nodes: Array<{
    id: string;
    type: 'module' | 'pursuit_code';
    label: string;
    x: number;
    y: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
    strength: number;
  }>;
}

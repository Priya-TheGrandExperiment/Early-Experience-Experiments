/**
 * Intelligence Module Service
 * Manages the 6 core intelligence modules: EDP, EPL, CRM, ECP, SLS, OPS
 * Provides neural link optimization and real-time intelligence feeds
 */

import type {
  IntelligenceModule,
  IntelligenceModuleCode,
  NeuralLink,
  PursuitOpportunity,
  PursuitCode,
  GlobalSystemIntegrator,
} from '../types';

import { INTELLIGENCE_MODULES, PURSUIT_CODES, DEFAULT_NEURAL_LINK_WEIGHTS } from '../constants';

// ============================================================================
// INTELLIGENCE ANALYSIS TYPES
// ============================================================================

export interface IntelligenceInsight {
  moduleCode: IntelligenceModuleCode;
  category: 'opportunity' | 'risk' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedPursuitCodes: number[];
  timestamp: Date;
}

export interface ModuleAnalytics {
  moduleCode: IntelligenceModuleCode;
  activeConnections: number;
  averageLinkStrength: number;
  processingLoad: number;
  insights: IntelligenceInsight[];
  healthStatus: 'healthy' | 'degraded' | 'offline';
}

export interface NeuralNetworkState {
  totalNodes: number;
  totalEdges: number;
  averageStrength: number;
  activeModules: number;
  networkHealth: number; // 0-100
}

// ============================================================================
// INTELLIGENCE MODULE SERVICE
// ============================================================================

export class IntelligenceModuleService {
  private modules: Map<IntelligenceModuleCode, IntelligenceModule>;
  private neuralLinks: NeuralLink[];
  private insightCache: Map<string, IntelligenceInsight[]>;

  constructor() {
    this.modules = new Map();
    this.insightCache = new Map();
    this.neuralLinks = [];
    this.initializeModules();
  }

  private initializeModules(): void {
    INTELLIGENCE_MODULES.forEach((module) => {
      this.modules.set(module.code, { ...module });
    });
    this.generateNeuralLinks();
  }

  private generateNeuralLinks(): void {
    const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];

    modules.forEach((module) => {
      const assignedCodes = DEFAULT_NEURAL_LINK_WEIGHTS[module];
      assignedCodes.forEach((codeNum, index) => {
        this.neuralLinks.push({
          id: `nl-${module}-${codeNum}`,
          sourceModule: module,
          targetPursuitCode: codeNum,
          linkStrength: 0.5 + Math.random() * 0.5,
          linkType: index < 4 ? 'primary' : index < 8 ? 'secondary' : 'tertiary',
          isActive: true,
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // MODULE ACCESSORS
  // --------------------------------------------------------------------------

  getModule(code: IntelligenceModuleCode): IntelligenceModule | undefined {
    return this.modules.get(code);
  }

  getAllModules(): IntelligenceModule[] {
    return Array.from(this.modules.values());
  }

  getNeuralLinks(): NeuralLink[] {
    return [...this.neuralLinks];
  }

  getLinksForModule(moduleCode: IntelligenceModuleCode): NeuralLink[] {
    return this.neuralLinks.filter((link) => link.sourceModule === moduleCode);
  }

  getLinksForPursuitCode(codeNum: number): NeuralLink[] {
    return this.neuralLinks.filter((link) => link.targetPursuitCode === codeNum);
  }

  // --------------------------------------------------------------------------
  // INTELLIGENCE ANALYSIS
  // --------------------------------------------------------------------------

  analyzeOpportunity(opportunity: PursuitOpportunity): IntelligenceInsight[] {
    const insights: IntelligenceInsight[] = [];
    const now = new Date();

    // EDP Analysis - Market & Data Intelligence
    if (this.isModuleActive('EDP')) {
      insights.push({
        moduleCode: 'EDP',
        category: 'opportunity',
        title: 'Market Position Analysis',
        description: `${opportunity.targetGSI.company} shows strong growth trajectory with ${opportunity.targetGSI.revenue}B revenue`,
        confidence: 85,
        priority: opportunity.targetGSI.pursuitPriority === 'critical' ? 'high' : 'medium',
        relatedPursuitCodes: [1, 5, 10, 15],
        timestamp: now,
      });
    }

    // EPL Analysis - Platform Intelligence
    if (this.isModuleActive('EPL')) {
      insights.push({
        moduleCode: 'EPL',
        category: 'recommendation',
        title: 'Solution Alignment',
        description: `Recommended solution architecture matches ${opportunity.targetGSI.primaryServices.slice(0, 3).join(', ')} capabilities`,
        confidence: 78,
        priority: 'medium',
        relatedPursuitCodes: [11, 16, 21],
        timestamp: now,
      });
    }

    // CRM Analysis - Relationship Intelligence
    if (this.isModuleActive('CRM')) {
      const relationshipScore = Math.floor(50 + Math.random() * 40);
      insights.push({
        moduleCode: 'CRM',
        category: relationshipScore > 70 ? 'opportunity' : 'risk',
        title: 'Relationship Health',
        description: `Stakeholder engagement score: ${relationshipScore}% based on ${opportunity.targetGSI.headcount.toLocaleString()} employee network`,
        confidence: relationshipScore,
        priority: relationshipScore < 60 ? 'high' : 'low',
        relatedPursuitCodes: [3, 7, 12, 17],
        timestamp: now,
      });
    }

    // ECP Analysis - Cloud Intelligence
    if (this.isModuleActive('ECP')) {
      insights.push({
        moduleCode: 'ECP',
        category: 'recommendation',
        title: 'Cloud Strategy Alignment',
        description: `Cloud migration opportunity identified for ${opportunity.targetGSI.geographicReach.join(', ')} regions`,
        confidence: 72,
        priority: 'medium',
        relatedPursuitCodes: [4, 8, 13, 18],
        timestamp: now,
      });
    }

    // SLS Analysis - Sales Intelligence
    if (this.isModuleActive('SLS')) {
      insights.push({
        moduleCode: 'SLS',
        category: 'alert',
        title: 'Deal Velocity',
        description: `Current stage: ${opportunity.currentStage}. Win probability: ${opportunity.probabilityOfWin.toFixed(1)}%`,
        confidence: 90,
        priority: opportunity.probabilityOfWin < 40 ? 'high' : 'medium',
        relatedPursuitCodes: [1, 4, 9, 14, 19],
        timestamp: now,
      });
    }

    // OPS Analysis - Operations Intelligence
    if (this.isModuleActive('OPS')) {
      insights.push({
        moduleCode: 'OPS',
        category: 'recommendation',
        title: 'Resource Optimization',
        description: `Estimated pursuit cost: $${(opportunity.pursuitCost / 1000).toFixed(1)}K. ROI potential: ${((opportunity.estimatedValue / opportunity.pursuitCost) * 100).toFixed(0)}%`,
        confidence: 82,
        priority: 'low',
        relatedPursuitCodes: [2, 5, 10, 15, 20],
        timestamp: now,
      });
    }

    return insights;
  }

  analyzeGSI(gsi: GlobalSystemIntegrator): IntelligenceInsight[] {
    const insights: IntelligenceInsight[] = [];
    const now = new Date();

    insights.push({
      moduleCode: 'EDP',
      category: 'opportunity',
      title: `${gsi.company} Market Analysis`,
      description: `Rank #${gsi.rank} GSI with $${gsi.revenue}B revenue and ${gsi.headcount.toLocaleString()} employees. Priority: ${gsi.pursuitPriority}`,
      confidence: 95,
      priority: gsi.pursuitPriority === 'critical' ? 'critical' : 'high',
      relatedPursuitCodes: gsi.assignedPursuitCodes.slice(0, 5),
      timestamp: now,
    });

    if (gsi.marketSegment === 'tier1') {
      insights.push({
        moduleCode: 'SLS',
        category: 'alert',
        title: 'Tier 1 Strategic Account',
        description: `${gsi.company} is a Tier 1 strategic target requiring executive-level engagement`,
        confidence: 100,
        priority: 'critical',
        relatedPursuitCodes: [1, 2, 3],
        timestamp: now,
      });
    }

    return insights;
  }

  // --------------------------------------------------------------------------
  // MODULE ANALYTICS
  // --------------------------------------------------------------------------

  getModuleAnalytics(moduleCode: IntelligenceModuleCode): ModuleAnalytics {
    const module = this.modules.get(moduleCode);
    const links = this.getLinksForModule(moduleCode);

    const avgStrength = links.length > 0
      ? links.reduce((sum, l) => sum + l.linkStrength, 0) / links.length
      : 0;

    return {
      moduleCode,
      activeConnections: links.filter((l) => l.isActive).length,
      averageLinkStrength: avgStrength,
      processingLoad: Math.random() * 100,
      insights: this.insightCache.get(moduleCode) || [],
      healthStatus: module?.isActive ? 'healthy' : 'offline',
    };
  }

  getAllModuleAnalytics(): ModuleAnalytics[] {
    const codes: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];
    return codes.map((code) => this.getModuleAnalytics(code));
  }

  getNeuralNetworkState(): NeuralNetworkState {
    const activeLinks = this.neuralLinks.filter((l) => l.isActive);
    const activeModules = Array.from(this.modules.values()).filter((m) => m.isActive);

    const avgStrength = activeLinks.length > 0
      ? activeLinks.reduce((sum, l) => sum + l.linkStrength, 0) / activeLinks.length
      : 0;

    return {
      totalNodes: this.modules.size + PURSUIT_CODES.length,
      totalEdges: this.neuralLinks.length,
      averageStrength: avgStrength,
      activeModules: activeModules.length,
      networkHealth: Math.round(avgStrength * 100),
    };
  }

  // --------------------------------------------------------------------------
  // LINK OPTIMIZATION
  // --------------------------------------------------------------------------

  optimizeLinks(pursuitCodes: PursuitCode[]): NeuralLink[] {
    const codeNums = pursuitCodes.map((c) => c.code);
    const relevantLinks = this.neuralLinks.filter((l) => codeNums.includes(l.targetPursuitCode));

    // Boost link strength for relevant codes
    relevantLinks.forEach((link) => {
      link.linkStrength = Math.min(1, link.linkStrength * 1.1);
    });

    return relevantLinks;
  }

  strengthenLink(linkId: string, boost: number = 0.1): void {
    const link = this.neuralLinks.find((l) => l.id === linkId);
    if (link) {
      link.linkStrength = Math.min(1, link.linkStrength + boost);
    }
  }

  weakenLink(linkId: string, reduction: number = 0.1): void {
    const link = this.neuralLinks.find((l) => l.id === linkId);
    if (link) {
      link.linkStrength = Math.max(0.1, link.linkStrength - reduction);
    }
  }

  // --------------------------------------------------------------------------
  // MODULE STATE MANAGEMENT
  // --------------------------------------------------------------------------

  activateModule(code: IntelligenceModuleCode): void {
    const module = this.modules.get(code);
    if (module) {
      module.isActive = true;
    }
  }

  deactivateModule(code: IntelligenceModuleCode): void {
    const module = this.modules.get(code);
    if (module) {
      module.isActive = false;
    }
  }

  isModuleActive(code: IntelligenceModuleCode): boolean {
    return this.modules.get(code)?.isActive ?? false;
  }

  // --------------------------------------------------------------------------
  // PURSUIT CODE RECOMMENDATIONS
  // --------------------------------------------------------------------------

  recommendPursuitCodes(gsi: GlobalSystemIntegrator, stage: string): PursuitCode[] {
    const baseRecommendations = gsi.assignedPursuitCodes;
    const allCodes = PURSUIT_CODES;

    // Filter codes relevant to the current stage
    const stageRelevantCodes = allCodes.filter((code) =>
      baseRecommendations.includes(code.code) ||
      code.requiredStage === stage
    );

    // Sort by complexity (simpler first for early stages, complex for later)
    return stageRelevantCodes.sort((a, b) => {
      const complexityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      return complexityOrder[a.complexity] - complexityOrder[b.complexity];
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let serviceInstance: IntelligenceModuleService | null = null;

export const getIntelligenceService = (): IntelligenceModuleService => {
  if (!serviceInstance) {
    serviceInstance = new IntelligenceModuleService();
  }
  return serviceInstance;
};

export const resetIntelligenceService = (): void => {
  serviceInstance = null;
};

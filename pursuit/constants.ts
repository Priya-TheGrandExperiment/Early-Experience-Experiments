/**
 * Universal Pursuit Protocol Framework - Constants
 * TEAM Integrated Solutions Group
 * Target Market: Top 20 Global System Integrators ($448.7B, 4M+ employees)
 */

import type {
  GlobalSystemIntegrator,
  IntelligenceModule,
  IntelligenceModuleCode,
  PursuitCode,
  PursuitCodeCategory,
  PursuitGate,
  PursuitStage,
  BusinessUnit,
  PursuitProtocolConfig,
} from './types';

// ============================================================================
// PURSUIT STAGES CONFIGURATION
// ============================================================================

export const PURSUIT_STAGES: Record<PursuitStage, { number: number; name: string; description: string }> = {
  engagement: {
    number: 1,
    name: 'Engagement',
    description: 'Initial contact and qualification with target account',
  },
  shaping: {
    number: 2,
    name: 'Shaping',
    description: 'Shaping the opportunity and understanding requirements',
  },
  solutioning: {
    number: 3,
    name: 'Solutioning',
    description: 'Building and presenting the technical solution',
  },
  end_game: {
    number: 4,
    name: 'End Game',
    description: 'Final positioning and competitive differentiation',
  },
  negotiation: {
    number: 5,
    name: 'Negotiation',
    description: 'Contract negotiation and deal closure',
  },
};

export const createDefaultGates = (): PursuitGate[] => {
  return Object.entries(PURSUIT_STAGES).map(([stage, config]) => ({
    stage: stage as PursuitStage,
    stageNumber: config.number,
    name: `Gate ${config.number}: ${config.name}`,
    description: config.description,
    requiredApprovals: ['Business Unit Lead', 'Pursuit Manager'],
    completionCriteria: [],
    gateStatus: 'pending' as const,
  }));
};

// ============================================================================
// INTELLIGENCE MODULES (6 Core Modules)
// ============================================================================

export const INTELLIGENCE_MODULES: IntelligenceModule[] = [
  {
    code: 'EDP',
    name: 'Enterprise Data Platform Intelligence',
    description: 'AI-powered data analytics and market intelligence for pursuit optimization',
    capabilities: [
      'Market trend analysis',
      'Competitor intelligence',
      'Win/loss pattern recognition',
      'Pricing optimization',
      'Deal scoring',
    ],
    dataFeeds: ['CRM data', 'Market reports', 'Financial data', 'News feeds'],
    neuralWeight: 0.95,
    isActive: true,
  },
  {
    code: 'EPL',
    name: 'Enterprise Platform Intelligence',
    description: 'Platform capability matching and technical solution intelligence',
    capabilities: [
      'Solution matching',
      'Technical fit analysis',
      'Integration assessment',
      'Platform recommendation',
      'Architecture optimization',
    ],
    dataFeeds: ['Technical requirements', 'Platform capabilities', 'Integration specs'],
    neuralWeight: 0.88,
    isActive: true,
  },
  {
    code: 'CRM',
    name: 'Customer Relationship Management Intelligence',
    description: 'Customer engagement and relationship intelligence system',
    capabilities: [
      'Stakeholder mapping',
      'Engagement tracking',
      'Relationship scoring',
      'Communication optimization',
      'Customer sentiment analysis',
    ],
    dataFeeds: ['Contact interactions', 'Email exchanges', 'Meeting notes', 'Social data'],
    neuralWeight: 0.92,
    isActive: true,
  },
  {
    code: 'ECP',
    name: 'Enterprise Cloud Platform Intelligence',
    description: 'Cloud solution intelligence and deployment optimization',
    capabilities: [
      'Cloud architecture design',
      'Cost optimization',
      'Migration planning',
      'Multi-cloud strategy',
      'Security assessment',
    ],
    dataFeeds: ['Cloud usage data', 'Infrastructure metrics', 'Cost reports'],
    neuralWeight: 0.85,
    isActive: true,
  },
  {
    code: 'SLS',
    name: 'Sales Intelligence',
    description: 'Sales strategy and execution intelligence system',
    capabilities: [
      'Sales forecasting',
      'Pipeline management',
      'Win probability scoring',
      'Resource allocation',
      'Competitive positioning',
    ],
    dataFeeds: ['Sales data', 'Pipeline metrics', 'Team performance'],
    neuralWeight: 0.90,
    isActive: true,
  },
  {
    code: 'OPS',
    name: 'Operations Intelligence',
    description: 'Operational efficiency and delivery intelligence',
    capabilities: [
      'Resource optimization',
      'Delivery planning',
      'Risk assessment',
      'Quality metrics',
      'Process automation',
    ],
    dataFeeds: ['Operational data', 'Resource utilization', 'Project metrics'],
    neuralWeight: 0.87,
    isActive: true,
  },
];

// ============================================================================
// TOP 20 GLOBAL SYSTEM INTEGRATORS (Target Market)
// ============================================================================

export const GLOBAL_SYSTEM_INTEGRATORS: GlobalSystemIntegrator[] = [
  {
    rank: 1,
    company: 'Accenture',
    revenue: 64.1,
    headcount: 738000,
    marketSegment: 'tier1',
    primaryServices: ['Strategy', 'Consulting', 'Digital', 'Technology', 'Operations'],
    geographicReach: ['Global'],
    pursuitPriority: 'critical',
    assignedPursuitCodes: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30],
  },
  {
    rank: 2,
    company: 'Deloitte',
    revenue: 59.5,
    headcount: 430000,
    marketSegment: 'tier1',
    primaryServices: ['Audit', 'Consulting', 'Financial Advisory', 'Risk Advisory', 'Tax'],
    geographicReach: ['Global'],
    pursuitPriority: 'critical',
    assignedPursuitCodes: [1, 2, 3, 6, 7, 11, 16, 21, 26, 31],
  },
  {
    rank: 3,
    company: 'IBM Global Services',
    revenue: 55.9,
    headcount: 350000,
    marketSegment: 'tier1',
    primaryServices: ['Cloud', 'AI', 'Security', 'Consulting', 'Infrastructure'],
    geographicReach: ['Global'],
    pursuitPriority: 'critical',
    assignedPursuitCodes: [1, 2, 4, 8, 12, 17, 22, 27, 32, 37],
  },
  {
    rank: 4,
    company: 'TCS',
    revenue: 27.9,
    headcount: 608000,
    marketSegment: 'tier1',
    primaryServices: ['IT Services', 'Consulting', 'Digital Solutions', 'BPO'],
    geographicReach: ['Global'],
    pursuitPriority: 'high',
    assignedPursuitCodes: [1, 3, 5, 9, 13, 18, 23, 28, 33, 38],
  },
  {
    rank: 5,
    company: 'PwC',
    revenue: 25.4,
    headcount: 328000,
    marketSegment: 'tier1',
    primaryServices: ['Assurance', 'Advisory', 'Tax', 'Consulting'],
    geographicReach: ['Global'],
    pursuitPriority: 'high',
    assignedPursuitCodes: [2, 4, 6, 10, 14, 19, 24, 29, 34, 39],
  },
  {
    rank: 6,
    company: 'Capgemini',
    revenue: 23.6,
    headcount: 340000,
    marketSegment: 'tier1',
    primaryServices: ['Consulting', 'Technology', 'Digital', 'Outsourcing'],
    geographicReach: ['Global'],
    pursuitPriority: 'high',
    assignedPursuitCodes: [3, 5, 7, 11, 15, 20, 25, 30, 35, 40],
  },
  {
    rank: 7,
    company: 'Cognizant',
    revenue: 19.4,
    headcount: 347500,
    marketSegment: 'tier2',
    primaryServices: ['Digital', 'Technology', 'Consulting', 'Operations'],
    geographicReach: ['Global'],
    pursuitPriority: 'high',
    assignedPursuitCodes: [4, 6, 8, 12, 16, 21, 26, 31, 36, 41],
  },
  {
    rank: 8,
    company: 'Infosys',
    revenue: 18.2,
    headcount: 343000,
    marketSegment: 'tier2',
    primaryServices: ['Digital', 'Engineering', 'Consulting', 'Operations'],
    geographicReach: ['Global'],
    pursuitPriority: 'high',
    assignedPursuitCodes: [5, 7, 9, 13, 17, 22, 27, 32, 37, 42],
  },
  {
    rank: 9,
    company: 'NTT Data',
    revenue: 17.8,
    headcount: 190000,
    marketSegment: 'tier2',
    primaryServices: ['IT Services', 'BPO', 'Consulting', 'Digital'],
    geographicReach: ['Global'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [6, 8, 10, 14, 18, 23, 28, 33, 38, 43],
  },
  {
    rank: 10,
    company: 'DXC Technology',
    revenue: 14.4,
    headcount: 130000,
    marketSegment: 'tier2',
    primaryServices: ['IT Services', 'Consulting', 'Infrastructure'],
    geographicReach: ['Global'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [7, 9, 11, 15, 19, 24, 29, 34, 39, 44],
  },
  {
    rank: 11,
    company: 'Wipro',
    revenue: 11.2,
    headcount: 250000,
    marketSegment: 'tier2',
    primaryServices: ['IT Services', 'Consulting', 'BPO', 'Engineering'],
    geographicReach: ['Global'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [8, 10, 12, 16, 20, 25, 30, 35, 40, 45],
  },
  {
    rank: 12,
    company: 'HCL Technologies',
    revenue: 12.6,
    headcount: 225000,
    marketSegment: 'tier2',
    primaryServices: ['IT Services', 'Engineering', 'Products'],
    geographicReach: ['Global'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [9, 11, 13, 17, 21, 26, 31, 36, 41, 46],
  },
  {
    rank: 13,
    company: 'Tech Mahindra',
    revenue: 6.5,
    headcount: 158000,
    marketSegment: 'tier3',
    primaryServices: ['IT Services', 'Telecom', 'Digital', 'BPO'],
    geographicReach: ['Global'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [10, 12, 14, 18, 22, 27, 32, 37, 42, 47],
  },
  {
    rank: 14,
    company: 'Atos',
    revenue: 10.8,
    headcount: 105000,
    marketSegment: 'tier2',
    primaryServices: ['Digital', 'Decarbonization', 'Big Data', 'Security'],
    geographicReach: ['Europe', 'Americas', 'APAC'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [11, 13, 15, 19, 23, 28, 33, 38, 43, 48],
  },
  {
    rank: 15,
    company: 'CGI',
    revenue: 12.9,
    headcount: 91500,
    marketSegment: 'tier2',
    primaryServices: ['Consulting', 'Systems Integration', 'Managed Services'],
    geographicReach: ['Americas', 'Europe', 'APAC'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [12, 14, 16, 20, 24, 29, 34, 39, 44, 49],
  },
  {
    rank: 16,
    company: 'Fujitsu',
    revenue: 25.7,
    headcount: 124000,
    marketSegment: 'tier1',
    primaryServices: ['Technology Solutions', 'Services', 'Device Solutions'],
    geographicReach: ['Japan', 'EMEA', 'Americas', 'APAC'],
    pursuitPriority: 'high',
    assignedPursuitCodes: [13, 15, 17, 21, 25, 30, 35, 40, 45, 50],
  },
  {
    rank: 17,
    company: 'Kyndryl',
    revenue: 16.1,
    headcount: 90000,
    marketSegment: 'tier2',
    primaryServices: ['Infrastructure', 'Cloud', 'Digital Workplace'],
    geographicReach: ['Global'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [14, 16, 18, 22, 26, 31, 36, 41, 46, 51],
  },
  {
    rank: 18,
    company: 'Leidos',
    revenue: 14.4,
    headcount: 47000,
    marketSegment: 'tier2',
    primaryServices: ['Defense', 'Intelligence', 'Civil', 'Health'],
    geographicReach: ['Americas', 'Europe', 'APAC'],
    pursuitPriority: 'medium',
    assignedPursuitCodes: [15, 17, 19, 23, 27, 32, 37, 42, 47, 52],
  },
  {
    rank: 19,
    company: 'SAIC',
    revenue: 7.5,
    headcount: 26000,
    marketSegment: 'tier3',
    primaryServices: ['National Security', 'IT Modernization', 'Space'],
    geographicReach: ['Americas'],
    pursuitPriority: 'low',
    assignedPursuitCodes: [16, 18, 20, 24, 28, 33, 38, 43, 48, 53],
  },
  {
    rank: 20,
    company: 'Unisys',
    revenue: 2.0,
    headcount: 16000,
    marketSegment: 'tier3',
    primaryServices: ['Digital Workplace', 'Cloud', 'Enterprise Computing'],
    geographicReach: ['Global'],
    pursuitPriority: 'low',
    assignedPursuitCodes: [17, 19, 21, 25, 29, 34, 39, 44, 49, 54],
  },
];

// ============================================================================
// 57 PURSUIT CODES
// ============================================================================

const generatePursuitCodes = (): PursuitCode[] => {
  const categories: PursuitCodeCategory[] = ['strategy', 'technical', 'commercial', 'delivery', 'governance', 'integration'];
  const stages: PursuitStage[] = ['engagement', 'shaping', 'solutioning', 'end_game', 'negotiation'];
  const modules: IntelligenceModuleCode[] = ['EDP', 'EPL', 'CRM', 'ECP', 'SLS', 'OPS'];

  const pursuitCodes: PursuitCode[] = [];

  // Strategy Codes (1-10)
  const strategyNames = [
    'Market Entry Strategy', 'Competitive Positioning', 'Value Proposition', 'Account Planning',
    'Partnership Strategy', 'Go-to-Market Plan', 'Brand Positioning', 'Thought Leadership',
    'Innovation Strategy', 'Digital Transformation',
  ];

  // Technical Codes (11-20)
  const technicalNames = [
    'Solution Architecture', 'Technical Assessment', 'Integration Design', 'Cloud Migration',
    'Security Framework', 'Data Architecture', 'API Strategy', 'DevOps Implementation',
    'AI/ML Integration', 'Infrastructure Design',
  ];

  // Commercial Codes (21-30)
  const commercialNames = [
    'Pricing Strategy', 'Deal Structure', 'Contract Framework', 'Revenue Model',
    'Cost Optimization', 'Value Engineering', 'ROI Analysis', 'Business Case',
    'Financial Modeling', 'Investment Justification',
  ];

  // Delivery Codes (31-40)
  const deliveryNames = [
    'Delivery Model', 'Resource Planning', 'Timeline Management', 'Quality Assurance',
    'Risk Mitigation', 'Change Management', 'Stakeholder Management', 'Communication Plan',
    'Knowledge Transfer', 'Continuous Improvement',
  ];

  // Governance Codes (41-50)
  const governanceNames = [
    'Governance Framework', 'Compliance Assessment', 'Regulatory Requirements', 'Audit Trail',
    'Policy Alignment', 'Ethics Review', 'Security Compliance', 'Data Privacy',
    'Vendor Management', 'Service Level Agreement',
  ];

  // Integration Codes (51-57)
  const integrationNames = [
    'System Integration', 'Process Integration', 'Data Integration', 'Platform Integration',
    'Ecosystem Integration', 'Partner Integration', 'Legacy Integration',
  ];

  const allNames = [...strategyNames, ...technicalNames, ...commercialNames, ...deliveryNames, ...governanceNames, ...integrationNames];

  for (let i = 1; i <= 57; i++) {
    const categoryIndex = Math.floor((i - 1) / 10);
    const category = categories[Math.min(categoryIndex, categories.length - 1)];
    const stageIndex = Math.floor((i - 1) / 12);
    const stage = stages[Math.min(stageIndex, stages.length - 1)];

    // Assign 2-3 modules per code based on code number
    const linkedModules: IntelligenceModuleCode[] = [
      modules[(i - 1) % 6],
      modules[(i + 1) % 6],
    ];
    if (i % 3 === 0) {
      linkedModules.push(modules[(i + 2) % 6]);
    }

    pursuitCodes.push({
      code: i,
      category,
      name: allNames[i - 1] || `Pursuit Code ${i}`,
      description: `${allNames[i - 1] || 'Custom pursuit'} optimization and execution framework`,
      linkedModules,
      estimatedCost: 10000 + (i * 500) + (Math.random() * 5000),
      complexity: i <= 15 ? 'low' : i <= 35 ? 'medium' : i <= 50 ? 'high' : 'critical',
      requiredStage: stage,
    });
  }

  return pursuitCodes;
};

export const PURSUIT_CODES: PursuitCode[] = generatePursuitCodes();

// ============================================================================
// BUSINESS UNITS
// ============================================================================

export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    id: 'bu-001',
    type: 'BU',
    name: 'BU Market Sales',
    marketFocus: 'Enterprise accounts across all verticals',
    salesCapacity: 150,
    activeOpportunities: 45,
    opsAllocation: 30,
    intelligenceAccess: ['EDP', 'CRM', 'SLS'],
  },
  {
    id: 'isg-001',
    type: 'ISG_SL',
    name: 'ISG SL Market Sales',
    marketFocus: 'Integrated Solutions Group - Service Lines',
    salesCapacity: 120,
    activeOpportunities: 38,
    opsAllocation: 40,
    intelligenceAccess: ['EPL', 'ECP', 'OPS', 'SLS'],
  },
];

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_PROTOCOL_CONFIG: PursuitProtocolConfig = {
  organizationName: 'TEAM Integrated Solutions Group',
  maxConcurrentPursuits: 100,
  gateApprovalRequired: true,
  neuralLinkThreshold: 0.5,
  costTrackingEnabled: true,
  aiOptimizationEnabled: true,
};

// ============================================================================
// MARKET STATISTICS
// ============================================================================

export const MARKET_STATS = {
  totalRevenue: 448.7, // Billion USD
  totalHeadcount: 4000000,
  top10Revenue: 322.2,
  top10Headcount: 3805000,
  averageRevenue: 22.4,
  averageHeadcount: 200000,
  tier1Count: 6,
  tier2Count: 10,
  tier3Count: 4,
};

// ============================================================================
// NEURAL LINK WEIGHTS (Default Assignments)
// ============================================================================

export const DEFAULT_NEURAL_LINK_WEIGHTS: Record<IntelligenceModuleCode, number[]> = {
  EDP: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  EPL: [2, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
  CRM: [3, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57],
  ECP: [4, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53],
  SLS: [1, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54],
  OPS: [2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
};

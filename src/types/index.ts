export type IndustryType = 
  | 'finance' 
  | 'banking-retail'
  | 'healthcare' 
  | 'pharma-lifesciences'
  | 'technology' 
  | 'cybersecurity-mssp'
  | 'government-federal' 
  | 'government-state'
  | 'legal-lawfirm'
  | 'manufacturing' 
  | 'retail-ecommerce'
  | 'energy-utilities'
  | 'higher-education'
  | 'telecom-media';

export type DeploymentStage = 
  | 'planning' 
  | 'pilot' 
  | 'scaling' 
  | 'mature';

export type UseCaseType = 
  | 'internal-knowledge' 
  | 'customer-support' 
  | 'financial-legal' 
  | 'hr-employee' 
  | 'code-devops' 
  | 'healthcare-clinical';

export type BuildPlatformType = 
  | 'm365-copilot' 
  | 'copilot-studio' 
  | 'azure-openai' 
  | 'power-platform-ai' 
  | 'hybrid-multi';

export type DeploymentPlatformType = 
  | 'teams' 
  | 'web-public' 
  | 'm365-apps' 
  | 'enterprise-intranet' 
  | 'api-backend'
  | 'mail-automation';

export type UserCountTier = 
  | 'pilot' 
  | 'department' 
  | 'enterprise' 
  | 'global';

export type DataSensitivityLevel = 
  | 'highly-confidential' 
  | 'internal-confidential' 
  | 'public-general';

export type UserAccessType = 
  | 'authenticated-entra' 
  | 'anonymous-public' 
  | 'partner-b2b' 
  | 'elevated-privileged';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface BusinessScenario {
  id: string;
  name: string;
  department: string;
  description: string;
  useCase: UseCaseType;
  buildPlatform: BuildPlatformType;
  deploymentPlatform: DeploymentPlatformType;
  userCountTier: UserCountTier;
  dataSensitivityLevel: DataSensitivityLevel;
  dataSource: string;
  userAccessType: UserAccessType;
  containsPii: boolean;
  containsFinancial: boolean;
  containsPhi: boolean;
  containsSecrets: boolean;
}

export interface ScenarioValidationResult {
  status: 'approved' | 'conditional' | 'blocked';
  score: number;
  summary: string;
  criticalGaps: string[];
  mandatoryControls: {
    name: string;
    description: string;
    msTool: string;
    implemented: boolean;
  }[];
  regulatoryImpact: string[];
  architectureRecommendation: string;
}

export interface BusinessProfile {
  orgName: string;
  industry: IndustryType;
  employeeCount: number;
  stage: DeploymentStage;
  // Active Scenario definition:
  activeScenario: BusinessScenario;
  useCase: UseCaseType;
  buildPlatform: BuildPlatformType;
  deploymentPlatform: DeploymentPlatformType;
  userCountTier: UserCountTier;
  dataSensitivityLevel: DataSensitivityLevel;
  workloads: {
    m365Copilot: boolean;
    copilotStudio: boolean;
    azureOpenAI: boolean;
    githubCopilot: boolean;
    powerPlatformAI: boolean;
  };
  dataTypes: {
    pii: boolean;
    phi: boolean;
    pci: boolean;
    ipSourceCode: boolean;
    executiveComms: boolean;
    customerData: boolean;
  };
  sharepointHygiene: 'sprawling' | 'moderate' | 'curated';
  hasSensitivityLabels: boolean;
  hasDlpForAi: boolean;
  hasContentSafety: boolean;
  hasPimEnforced: boolean;
  hasAgentAuditLogged: boolean;
}

export interface RedFlag {
  id: string;
  title: string;
  category: 'Data Oversharing' | 'Prompt & Exfiltration' | 'Sensitivity Gaps' | 'Agent Governance' | 'Identity & RBAC' | 'Compliance & Audit';
  severity: SeverityLevel;
  likelihood: number; // 1 to 5
  impact: number;     // 1 to 5
  description: string;
  triggerCondition: (profile: BusinessProfile) => boolean;
  impactedRegulations: string[];
  vulnerabilityScenario: string;
  mitigationBlueprint: {
    solutionName: string;
    actionSteps: string[];
    microsoftTech: string[];
    powershellSnippet?: string;
  };
}

export interface GovernancePillar {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  overview: string;
  capabilities: {
    name: string;
    description: string;
    statusRecommendation: string;
    keyControls: string[];
    msFeature: string;
  }[];
  architectureNotes: string[];
  bestPractices: string[];
  verificationChecklist: string[];
}

export interface PolicySnippet {
  id: string;
  title: string;
  category: 'Purview DLP' | 'Sensitivity Labels' | 'SharePoint SAM' | 'Azure AI Guardrails' | 'Copilot Studio Telemetry' | 'Entra ID PIM';
  language: 'powershell' | 'json' | 'kql' | 'bash';
  description: string;
  code: string;
}

export interface DimensionScore {
  name: string;
  current: number;
  target: number;
  benchmark: number;
}

export interface MicrosoftDocReference {
  id: string;
  title: string;
  category: 'Purview & DLP' | 'Content Safety & Guardrails' | 'Copilot Studio & Power Platform' | 'Identity & Zero Trust' | 'Compliance & Privacy';
  docUrl: string;
  description: string;
  keyGuidance: string;
  applicableWorkloads: string[];
  relevantStandards: string[];
}

export interface SimulationRemediationStep {
  service: string;
  stepTitle: string;
  configurationAction: string;
  codeSnippet?: {
    language: 'powershell' | 'json' | 'kql';
    label: string;
    code: string;
  };
  msLearnDocUrl: string;
}

export interface SimulationThreatVector {
  id: string;
  title: string;
  category: 'Indirect Prompt Injection' | 'Direct Jailbreak' | 'Excessive Agency & Tool Misuse' | 'Data Exfiltration' | 'Denial of Wallet' | 'System Prompt Leakage';
  owaspId: string;
  applicablePlatforms?: (BuildPlatformType | DeploymentPlatformType)[];
  applicableUseCases?: UseCaseType[];
  simulatedInputText: string;
  description: string;
  
  vulnerableOutcome: {
    status: 'EXPLOITED' | 'UNPROTECTED';
    severity: 'critical' | 'high';
    stepByStepTrace: string[];
    consequence: string;
    sampleAgentOutput: string;
  };
  
  hardenedOutcome: {
    status: 'BLOCKED' | 'SANITIZED';
    interceptingService: string;
    ruleTriggered: string;
    stepByStepTrace: string[];
    safeAgentOutput: string;
  };

  remediationSteps: SimulationRemediationStep[];
}


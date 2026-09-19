import React, { useState } from 'react';
import { 
  BusinessProfile, 
  IndustryType, 
  DeploymentStage,
  UseCaseType,
  BuildPlatformType,
  DeploymentPlatformType,
  UserCountTier,
  DataSensitivityLevel,
  BusinessScenario
} from '../../types';
import { DEFAULT_SCENARIOS, validateBusinessScenario } from '../../data/governanceData';
import { ScenarioBuilderModal } from './ScenarioBuilderModal';
import { 
  Sparkles, 
  Cpu, 
  Globe, 
  Users, 
  ShieldAlert, 
  Check, 
  Building, 
  Database, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  PlusCircle,
  FileEdit,
  AlertOctagon,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface BusinessProfilerProps {
  profile: BusinessProfile;
  onChange: (updated: BusinessProfile) => void;
  postureScore: number;
  onGenerate?: () => void;
}

export const BusinessProfiler: React.FC<BusinessProfilerProps> = ({
  profile,
  onChange,
  postureScore,
  onGenerate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Validate the active scenario using the validation engine
  const validationResult = validateBusinessScenario(profile.activeScenario, profile);

  // When a user selects a scenario template
  const handleSelectScenarioTemplate = (scenario: BusinessScenario) => {
    setIsGenerating(true);
    const updated: BusinessProfile = {
      ...profile,
      activeScenario: scenario,
      useCase: scenario.useCase,
      buildPlatform: scenario.buildPlatform,
      deploymentPlatform: scenario.deploymentPlatform,
      userCountTier: scenario.userCountTier,
      dataSensitivityLevel: scenario.dataSensitivityLevel,
      dataTypes: {
        ...profile.dataTypes,
        pii: scenario.containsPii,
        pci: scenario.containsFinancial,
        phi: scenario.containsPhi,
        ipSourceCode: scenario.containsSecrets,
      }
    };

    onChange(updated);
    setFeedbackMsg(`Loaded & Validated Scenario: "${scenario.name}"`);
    setTimeout(() => {
      setIsGenerating(false);
      if (onGenerate) onGenerate();
    }, 350);
  };

  // When a user saves custom scenario from modal
  const handleCustomScenarioSaved = (customScenario: BusinessScenario) => {
    setIsGenerating(true);
    const updated: BusinessProfile = {
      ...profile,
      activeScenario: customScenario,
      useCase: customScenario.useCase,
      buildPlatform: customScenario.buildPlatform,
      deploymentPlatform: customScenario.deploymentPlatform,
      userCountTier: customScenario.userCountTier,
      dataSensitivityLevel: customScenario.dataSensitivityLevel,
      dataTypes: {
        ...profile.dataTypes,
        pii: customScenario.containsPii,
        pci: customScenario.containsFinancial,
        phi: customScenario.containsPhi,
        ipSourceCode: customScenario.containsSecrets,
      }
    };

    onChange(updated);
    setFeedbackMsg(`Custom Scenario "${customScenario.name}" successfully integrated & validated across portal!`);
    setTimeout(() => {
      setIsGenerating(false);
      if (onGenerate) onGenerate();
    }, 400);
  };

  // Synchronize scenario with individual parameter changes
  const handleParamChange = (key: keyof BusinessScenario, value: any) => {
    const updatedScenario = {
      ...profile.activeScenario,
      [key]: value,
    };
    onChange({
      ...profile,
      activeScenario: updatedScenario,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Dedicated Business Scenario Banner & Validator */}
      <div className="bg-white dark:bg-slate-900/95 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Business Scenario Intelligence & Compliance Gate</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Active Business Scenario: {profile.activeScenario.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Department: <strong className="text-slate-900 dark:text-white">{profile.activeScenario.department}</strong> • 
              Data Source: <span className="font-mono text-cyan-600 dark:text-cyan-300">{profile.activeScenario.dataSource}</span> • 
              Audience: <span className="capitalize font-medium text-slate-700 dark:text-slate-200">{profile.activeScenario.userAccessType.replace('-', ' ')}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add / Input Custom Scenario</span>
            </button>
          </div>
        </div>

        {/* Real-time Scenario Security Clearance & Pre-Deployment Gates */}
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          validationResult.status === 'blocked'
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-800 dark:text-rose-200'
            : validationResult.status === 'conditional'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-800 dark:text-amber-200'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                validationResult.status === 'blocked'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : validationResult.status === 'conditional'
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {validationResult.status === 'blocked' ? '🛑 Pre-Deployment Gate: BLOCKED' : validationResult.status === 'conditional' ? '⚠️ Conditional Clearance' : '✅ Cleared for Production'}
              </span>
              <span className="text-xs font-mono font-semibold">Security Score: {validationResult.score}/100</span>
            </div>
            <p className="text-xs font-medium leading-relaxed opacity-95">
              {validationResult.summary}
            </p>
          </div>

          {validationResult.criticalGaps.length > 0 && (
            <div className="text-right shrink-0">
              <span className="text-[11px] font-mono text-rose-700 dark:text-rose-300 font-bold block">
                {validationResult.criticalGaps.length} Critical Security Gaps
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Remediation required before release</span>
            </div>
          )}
        </div>

        {/* Detailed Scenario Description */}
        <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <FileEdit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Scenario Workflow & Objective</span>
          </div>
          <p className="leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
            "{profile.activeScenario.description}"
          </p>
        </div>

        {/* Scenario Template Switcher Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Switch Pre-configured Scenario:</span>
          {DEFAULT_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleSelectScenarioTemplate(scen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                profile.activeScenario.id === scen.id
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-slate-800'
              }`}
            >
              {scen.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Core 5-Option User Input Configuration Panel */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-blue-600/30 shadow-xl space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Scenario Architectural Tuning (5 Core Controls)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust use case, build platform, channel, user scale, and sensitivity to immediately validate the security boundary.
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
            Auto-Sync Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Input 1: Use Case */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>1. Use Case</span>
            </label>
            <select
              value={profile.useCase}
              onChange={(e) => handleParamChange('useCase', e.target.value as UseCaseType)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="internal-knowledge">🏢 Enterprise Search & Synthesis</option>
              <option value="customer-support">💬 Customer Support & Public Bot</option>
              <option value="financial-legal">⚖️ Financial & Legal Contract Ops</option>
              <option value="hr-employee">👥 HR & Employee Operations</option>
              <option value="code-devops">💻 DevOps & Code Completion</option>
              <option value="healthcare-clinical">🏥 Clinical & Patient Intake</option>
            </select>
          </div>

          {/* Input 2: Build Platform */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>2. Build Platform</span>
            </label>
            <select
              value={profile.buildPlatform}
              onChange={(e) => handleParamChange('buildPlatform', e.target.value as BuildPlatformType)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="m365-copilot">🤖 Microsoft 365 Copilot Native</option>
              <option value="copilot-studio">🧩 Copilot Studio Custom Agents</option>
              <option value="azure-openai">⚡ Azure OpenAI / AI Foundry RAG</option>
              <option value="power-platform-ai">⚙️ Power Platform AI Builder</option>
              <option value="hybrid-multi">🌐 Hybrid Multi-Platform Fabric</option>
            </select>
          </div>

          {/* Input 3: Deployment Platform */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>3. Target Deployment</span>
            </label>
            <select
              value={profile.deploymentPlatform}
              onChange={(e) => handleParamChange('deploymentPlatform', e.target.value as DeploymentPlatformType)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="teams">💬 Microsoft Teams & Channels</option>
              <option value="web-public">🌍 Public Website (Anonymous)</option>
              <option value="m365-apps">📄 M365 Desktop Office Apps</option>
              <option value="enterprise-intranet">🏢 Intranet & Mobile App</option>
              <option value="api-backend">🔌 Headless API / Microservice</option>
            </select>
          </div>

          {/* Input 4: Target User Scale */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>4. Target Scale</span>
            </label>
            <select
              value={profile.userCountTier}
              onChange={(e) => handleParamChange('userCountTier', e.target.value as UserCountTier)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="pilot">🧪 Pilot (&lt; 500 Seats)</option>
              <option value="department">👥 Department (500 - 2.5k Seats)</option>
              <option value="enterprise">🏢 Enterprise (2.5k - 20k Seats)</option>
              <option value="global">🌐 Global (20k+ Seats)</option>
            </select>
          </div>

          {/* Input 5: Data Sensitivity Level */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>5. Sensitivity</span>
            </label>
            <select
              value={profile.dataSensitivityLevel}
              onChange={(e) => handleParamChange('dataSensitivityLevel', e.target.value as DataSensitivityLevel)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="highly-confidential">🔴 Highly Confidential (PII, Financials)</option>
              <option value="internal-confidential">🟡 Internal Business Confidential</option>
              <option value="public-general">🟢 Public / General Information</option>
            </select>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* 3. Mandatory Security Controls Checklist for this Scenario */}
      <div className="bg-white dark:bg-slate-900/80 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Scenario Pre-Deployment Security Gate Verification</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {validationResult.mandatoryControls.filter(c => c.implemented).length} of {validationResult.mandatoryControls.length} Controls Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {validationResult.mandatoryControls.map((ctrl, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                ctrl.implemented
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${ctrl.implemented ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{ctrl.name}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{ctrl.description}</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-cyan-700 dark:text-cyan-300 font-mono inline-block mt-1 border border-slate-200 dark:border-slate-800">
                  Required: {ctrl.msTool}
                </span>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded shrink-0 ${
                ctrl.implemented
                  ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
              }`}>
                {ctrl.implemented ? 'ACTIVE' : 'MISSING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Scenario Builder Modal */}
      <ScenarioBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveScenario={handleCustomScenarioSaved}
        initialScenario={profile.activeScenario}
      />
    </div>
  );
};

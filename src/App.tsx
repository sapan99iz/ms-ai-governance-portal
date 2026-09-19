import React, { useState, useMemo, useEffect } from 'react';
import { 
  DEFAULT_PROFILES, 
  DEFAULT_SCENARIOS,
  RED_FLAGS_CATALOG, 
  GOVERNANCE_PILLARS, 
  POLICY_SNIPPETS 
} from './data/governanceData';
import { BusinessProfile, RedFlag, DimensionScore, BusinessScenario, UseCaseType } from './types';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/Landing/LandingHero';
import { RedFlagDetector } from './components/RiskEngine/RedFlagDetector';
import { RadarPostureChart } from './components/Visualizations/RadarPostureChart';
import { RiskHeatmap } from './components/Visualizations/RiskHeatmap';
import { SecurityTopology } from './components/Architecture/SecurityTopology';
import { AgentThreatSimulator } from './components/Simulation/AgentThreatSimulator';
import { GovernanceBlueprint } from './components/Governance/GovernanceBlueprint';
import { PolicyPlaybook } from './components/Toolkit/PolicyPlaybook';
import { MicrosoftDocsHub } from './components/References/MicrosoftDocsHub';
import { ExecutiveSummaryModal } from './components/Report/ExecutiveSummaryModal';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  BookOpen,
  ChevronRight,
  RotateCcw,
  Sliders,
  Layers,
  Building2,
  Download,
  AlertOctagon,
  Linkedin,
  Globe
} from 'lucide-react';

export function App() {
  // Navigation & Flow Stage
  const [portalStage, setPortalStage] = useState<'landing' | 'workspace'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Selected Profile & Scenario
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILES.finance);
  const [selectedScenario, setSelectedScenario] = useState<BusinessScenario>(DEFAULT_SCENARIOS[0]);

  // Section interactive states
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [blueprintPillar, setBlueprintPillar] = useState<string>('purview');
  const [playbookCategory, setPlaybookCategory] = useState<string>('all');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('aegis_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('aegis_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Switch preset profile
  const handlePresetSelect = (key: string) => {
    if (DEFAULT_PROFILES[key]) {
      const p = DEFAULT_PROFILES[key];
      setProfile(p);
      setSelectedScenario(p.activeScenario);
      setSelectedFlagId(null);
    }
  };

  // Handle scenario change from Landing or Modal
  const handleScenarioChange = (scenario: BusinessScenario) => {
    setSelectedScenario(scenario);
    setProfile((prev) => ({
      ...prev,
      activeScenario: scenario,
      useCase: scenario.useCase,
      buildPlatform: scenario.buildPlatform,
      deploymentPlatform: scenario.deploymentPlatform,
      userCountTier: scenario.userCountTier,
      dataSensitivityLevel: scenario.dataSensitivityLevel,
      dataTypes: {
        ...prev.dataTypes,
        pii: scenario.containsPii,
        pci: scenario.containsFinancial,
        phi: scenario.containsPhi,
        ipSourceCode: scenario.containsSecrets,
      }
    }));
  };

  // Switch use case dynamically
  const handleUseCaseSwitch = (useCase: UseCaseType) => {
    setSelectedScenario((prev) => ({
      ...prev,
      useCase,
      name: `${prev.name.split(' (')[0]} (${useCase.replace('-', ' ').toUpperCase()})`
    }));
    setProfile((prev) => ({
      ...prev,
      useCase
    }));
  };

  // Submit from landing into workspace
  const handleEnterWorkspace = () => {
    setPortalStage('workspace');
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Evaluate active red flags dynamically based on current profile
  const detectedRedFlags = useMemo(() => {
    return RED_FLAGS_CATALOG.filter((flag) => flag.triggerCondition(profile));
  }, [profile]);

  // Calculate 6 Dimension Scores based on user inputs
  const dimensions: DimensionScore[] = useMemo(() => {
    // 1. Data Sensitivity & Labels
    let labelsScore = 20;
    if (profile.hasSensitivityLabels) labelsScore += 60;
    if (profile.sharepointHygiene === 'curated') labelsScore += 20;
    else if (profile.sharepointHygiene === 'moderate') labelsScore += 10;
    if (profile.dataSensitivityLevel === 'highly-confidential' && !profile.hasSensitivityLabels) {
      labelsScore = Math.max(10, labelsScore - 15);
    }

    // 2. GenAI DLP & Exfiltration
    let dlpScore = 20;
    if (profile.hasDlpForAi) dlpScore += 65;
    if (profile.hasSensitivityLabels) dlpScore += 10;
    if (profile.deploymentPlatform === 'web-public' && !profile.hasDlpForAi) {
      dlpScore = Math.max(10, dlpScore - 10);
    }

    // 3. Prompt Safety & Guardrails
    let guardrailsScore = 20;
    if (profile.hasContentSafety) guardrailsScore += 70;
    if (profile.hasDlpForAi) guardrailsScore += 10;
    if (profile.deploymentPlatform === 'web-public' && !profile.hasContentSafety) {
      guardrailsScore = Math.max(5, guardrailsScore - 20);
    }

    // 4. Copilot Studio Telemetry & Connector Governance
    let telemetryScore = 20;
    if (profile.hasAgentAuditLogged) telemetryScore += 65;
    if (profile.hasDlpForAi) telemetryScore += 15;
    if (profile.buildPlatform === 'copilot-studio' && !profile.hasAgentAuditLogged) {
      telemetryScore = Math.max(10, telemetryScore - 15);
    }

    // 5. Identity & PIM / RBAC
    let identityScore = 30;
    if (profile.hasPimEnforced) identityScore += 55;
    if (profile.deploymentPlatform === 'teams') identityScore += 10;
    if (profile.userCountTier === 'global' && !profile.hasPimEnforced) {
      identityScore = Math.max(15, identityScore - 15);
    }

    // 6. SharePoint & Oversharing Protection
    let sharepointScore = profile.sharepointHygiene === 'curated' ? 90 : profile.sharepointHygiene === 'moderate' ? 60 : 25;
    if (profile.hasPimEnforced) sharepointScore = Math.min(100, sharepointScore + 10);
    if (profile.buildPlatform === 'm365-copilot' && profile.sharepointHygiene === 'sprawling') {
      sharepointScore = 20;
    }

    return [
      { name: 'Data Labels & RMS', current: Math.min(100, labelsScore), target: 95, benchmark: 60 },
      { name: 'GenAI DLP Policies', current: Math.min(100, dlpScore), target: 90, benchmark: 45 },
      { name: 'Content Guardrails', current: Math.min(100, guardrailsScore), target: 90, benchmark: 55 },
      { name: 'Agent Telemetry & Logs', current: Math.min(100, telemetryScore), target: 85, benchmark: 40 },
      { name: 'Zero Trust & PIM', current: Math.min(100, identityScore), target: 95, benchmark: 65 },
      { name: 'SharePoint Access (SAM)', current: Math.min(100, sharepointScore), target: 90, benchmark: 50 },
    ];
  }, [profile]);

  // Overall Posture Score
  const postureScore = useMemo(() => {
    const sum = dimensions.reduce((acc, d) => acc + d.current, 0);
    return Math.round(sum / dimensions.length);
  }, [dimensions]);

  const criticalCount = detectedRedFlags.filter((f) => f.severity === 'critical').length;

  const navigateToBlueprint = (pillarId: string) => {
    setBlueprintPillar(pillarId);
    setCurrentTab('blueprint');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPlaybook = (cat: string) => {
    setPlaybookCategory(cat);
    setCurrentTab('playbook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFlagFromHeatmap = (flagId: string) => {
    setSelectedFlagId(flagId);
    setCurrentTab('dashboard');
    // Smooth scroll down to red flag section if on dashboard
    const el = document.getElementById('red-flags-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamically generated scenario insights based on inputs
  const scenarioIntelligence = useMemo(() => {
    const useCaseName = profile.useCase.replace('-', ' ').toUpperCase();
    const buildName = profile.buildPlatform.replace('-', ' ').toUpperCase();
    const deployName = profile.deploymentPlatform.replace('-', ' ').toUpperCase();

    let primaryThreat = 'Data oversharing and legacy SharePoint permissions sprawl.';
    let topRecommendation = 'Deploy SharePoint Advanced Management (SAM) Restricted Site Access immediately.';
    let regulationFocus = 'GDPR & ISO 27001';

    if (profile.deploymentPlatform === 'mail-automation' || profile.activeScenario?.deploymentPlatform === 'mail-automation') {
      primaryThreat = 'Indirect prompt injection embedded in inbound email bodies/PDFs and unmonitored outbound AI email replies without Purview encryption.';
      topRecommendation = 'Deploy Azure AI Content Safety Prompt Shields on the email trigger, enforce Power Platform connector DLP, and mandate Purview RMS encryption on outbound mail.';
      regulationFocus = 'OWASP Top 10 for LLMs (LLM01), Exchange Online Security & GDPR Art. 32';
    } else if (profile.deploymentPlatform === 'web-public') {
      primaryThreat = 'Anonymous public prompt injection, jailbreaks, and denial-of-wallet attacks.';
      topRecommendation = 'Configure Azure AI Content Safety Prompt Shields + Azure Front Door WAF rate limiting.';
      regulationFocus = 'OWASP Top 10 for LLMs & EU AI Act Art. 15';
    } else if (profile.useCase === 'healthcare-clinical') {
      primaryThreat = 'Clinical health record (PHI) contamination and patient identifier leakage into generative responses.';
      topRecommendation = 'Sign Microsoft BAA, deploy HIPAA custom SITs, and quarantine clinical repositories with Purview Information Barriers.';
      regulationFocus = 'HIPAA Security & Privacy Rules';
    } else if (profile.useCase === 'financial-legal') {
      primaryThreat = 'Material Non-Public Information (MNPI) or M&A contract clause cross-pollination.';
      topRecommendation = 'Deploy Purview Ethical Walls between Advisory & Trading desks with mandatory RMS encryption.';
      regulationFocus = 'SEC Rule 10b-5 & FINRA Rule 3110';
    } else if (profile.buildPlatform === 'copilot-studio' || profile.buildPlatform === 'power-platform-ai') {
      primaryThreat = 'Citizen makers binding autonomous agents to unapproved public HTTP connectors.';
      topRecommendation = 'Enforce Power Platform DLP connector isolation (Block generic HTTP/Webhooks) and log Dataverse transcripts.';
      regulationFocus = 'SOC 2 Type II & NIST AI RMF';
    }

    return {
      title: `${selectedScenario.name} (${buildName} via ${deployName})`,
      primaryThreat,
      topRecommendation,
      regulationFocus,
      userScope: `${profile.employeeCount.toLocaleString()} Users (${profile.userCountTier.toUpperCase()})`,
      sensitivityTag: profile.dataSensitivityLevel.replace('-', ' ').toUpperCase()
    };
  }, [profile, selectedScenario]);

  // If user is in landing mode, show LandingHero intake
  if (portalStage === 'landing') {
    return (
      <LandingHero
        selectedScenario={selectedScenario}
        onSelectScenario={handleScenarioChange}
        onSubmit={handleEnterWorkspace}
        profile={profile}
        onUpdateProfile={setProfile}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectProfilePreset={handlePresetSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050b14] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Top Enterprise Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        setProfileByPreset={handlePresetSelect}
        score={postureScore}
        criticalCount={criticalCount}
        onOpenReport={() => setIsReportOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSwitchScenario={() => setPortalStage('landing')}
        activeScenarioName={selectedScenario.name}
      />

      {/* Persistent Flow Breadcrumb & Scenario Header Banner */}
      <section className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent dark:from-blue-950/40 dark:via-indigo-950/30 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-cyan-300 font-extrabold uppercase tracking-wider text-[10px]">
              Assessed Scenario
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {selectedScenario.name}
            </span>
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              {selectedScenario.department}
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
            <button
              type="button"
              onClick={() => setPortalStage('landing')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
              <span>Switch Use Case</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CISO Brief</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Section 1: Risk Assessment & Heatmap + Red Flags */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Section 1: Scenario Intelligence & Threat Risk Assessment
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time risk scoring, 6-dimension posture spider chart, Microsoft AI risk exposure heatmap, and prioritized red flags.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                Live Dynamic Analysis
              </span>
            </div>

            {/* Dynamically Generated Scenario Intelligence Card */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-indigo-500/40 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Dynamically Generated Scenario Intelligence
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {scenarioIntelligence.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    Scope: <strong className="text-slate-900 dark:text-white">{scenarioIntelligence.userScope}</strong>
                  </span>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded border ${
                    profile.dataSensitivityLevel === 'highly-confidential' 
                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' 
                      : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }`}>
                    {scenarioIntelligence.sensitivityTag}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('simulation');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5 cursor-pointer ml-1"
                    title="Simulate adversarial attack vectors and parallel Microsoft guardrails for this scenario"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test in Threat Simulator</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Primary Threat Vector</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {scenarioIntelligence.primaryThreat}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Immediate Microsoft Action</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {scenarioIntelligence.topRecommendation}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Regulatory Framework Impact</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Critical compliance mandates: <strong>{scenarioIntelligence.regulationFocus}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Top Stat KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Compliance Readiness</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {postureScore >= 80 ? 'Production Ready' : postureScore >= 50 ? 'Gaps Detected' : 'High Risk'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Overall Index: {postureScore}%</div>
                </div>
                <div className={`p-3 rounded-xl ${postureScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'}`}>
                  {postureScore >= 80 ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Content Safety & DLP</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {profile.hasContentSafety && profile.hasDlpForAi ? 'Shields On' : 'Partial / Exposed'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {profile.hasContentSafety ? 'Prompt Shields Active' : 'No Jailbreak Defense'}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${profile.hasContentSafety && profile.hasDlpForAi ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'} border border-slate-200 dark:border-slate-800`}>
                  <AlertOctagon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Deployed Architecture</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 capitalize">
                    {profile.buildPlatform.split('-')[0]}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 capitalize">Channel: {profile.deploymentPlatform}</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Identity & RBAC Mode</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {profile.hasPimEnforced ? 'Zero Trust' : 'Permissive'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {profile.hasPimEnforced ? 'PIM & MFA Enforced' : 'Standing Admins Risk'}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${profile.hasPimEnforced ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'} border border-slate-200 dark:border-slate-800`}>
                  <Lock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Visualizations: Spider Radar Chart + Microsoft AI Risk Exposure Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Radar Chart Card (5 cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>6-Dimension Posture Radar</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Interactive SVG</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click any dimension chip or label to explore its meaning, Microsoft controls, and target baselines.
                  </p>
                </div>

                <div className="py-2 flex justify-center w-full">
                  <RadarPostureChart dimensions={dimensions} width={360} height={280} />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Lowest Maturity Area:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {[...dimensions].sort((a, b) => a.current - b.current)[0]?.name}
                  </span>
                </div>
              </div>

              {/* Microsoft AI Risk Exposure Heatmap Card (7 cols) */}
              <div className="lg:col-span-7">
                <RiskHeatmap
                  redFlags={detectedRedFlags}
                  selectedFlagId={selectedFlagId}
                  onSelectFlag={handleSelectFlagFromHeatmap}
                />
              </div>
            </div>

            {/* Red Flag Detector (Integrated into Section 1) */}
            <div id="red-flags-section" className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Prioritized Security Red Flags ({detectedRedFlags.length} Triggered)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed technical root causes, potential attack scenarios, and Microsoft Purview / Content Safety remediations.
                </p>
              </div>

              <RedFlagDetector
                redFlags={detectedRedFlags}
                allCatalogFlags={RED_FLAGS_CATALOG}
                selectedFlagId={selectedFlagId}
                onSelectFlag={setSelectedFlagId}
                onNavigateToBlueprint={navigateToBlueprint}
              />
            </div>

            {/* Step 1 to Step 2 Guided Transition Bar */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-5 rounded-2xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80">Next Flow Step</div>
                <h4 className="text-base font-extrabold">
                  Explore Section 2: End-to-End Security Topology & Pipeline Architecture
                </h4>
                <p className="text-xs opacity-90 max-w-xl">
                  Inspect the interactive 7-stage prompt security pipeline: from Entra ID Zero Trust to Purview DLP and Audit logging.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('topology');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Proceed to Section 2: Security Topology</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Security Topology (Interactive Visual Architecture) */}
        {currentTab === 'topology' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Section 2: End-to-End Security Pipeline Topology
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interactive 7-stage prompt flow: Entra ID Zero Trust $\rightarrow$ Prompt Shields $\rightarrow$ Purview DLP $\rightarrow$ Grounded LLM $\rightarrow$ Audit.
                  </p>
                </div>
              </div>
            </div>

            <SecurityTopology scenario={selectedScenario} profile={profile} />

            {/* Step 2 to Step 3 Transition Bar */}
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-5 rounded-2xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80">Next Flow Step</div>
                <h4 className="text-base font-extrabold">
                  Explore Section 3: Scenario Adversarial Threat Simulator &amp; Guardrail Sandbox
                </h4>
                <p className="text-xs opacity-90 max-w-xl">
                  Simulate realistic adversarial attack vectors tailored to your scenario and evaluate side-by-side Microsoft guardrail interception.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('simulation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Proceed to Section 3: Threat Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Adversarial Threat Simulator & Guardrail Sandbox */}
        {currentTab === 'simulation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Section 3: Scenario Adversarial Threat Simulator &amp; Guardrail Sandbox
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interactive side-by-side simulation: test how your active scenario can be bypassed under default settings, and verify parallel Microsoft guardrail blocks.
                  </p>
                </div>
              </div>
            </div>

            <AgentThreatSimulator
              scenario={selectedScenario}
              profile={profile}
              onNavigateToBlueprint={navigateToBlueprint}
              onNavigateToPlaybook={navigateToPlaybook}
              onSelectUseCase={handleUseCaseSwitch}
            />

            {/* Step 3 to Step 4 Transition Bar */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 rounded-2xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80">Next Flow Step</div>
                <h4 className="text-base font-extrabold">
                  Explore Section 4: Dedicated Microsoft Governance Blueprint
                </h4>
                <p className="text-xs opacity-90 max-w-xl">
                  Inspect the 4 core pillars: Purview AI Hub, Azure AI Content Safety with live guardrails, Copilot Studio maker controls, and Zero Trust RBAC.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('blueprint');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Proceed to Section 4: Governance Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 4: Dedicated Governance Blueprint */}
        {currentTab === 'blueprint' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Section 4: Dedicated Microsoft Governance Blueprint
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Detailed security implementation controls across Purview, Content Safety, Copilot Studio, and RBAC with interactive prompt guardrail simulator.
                  </p>
                </div>
              </div>
            </div>

            <GovernanceBlueprint
              scenario={selectedScenario}
              profile={profile}
              initialPillarId={blueprintPillar}
              onNavigateToPlaybook={navigateToPlaybook}
            />

            {/* Step 4 to Step 5 Transition Bar */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 rounded-2xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80">Next Flow Step</div>
                <h4 className="text-base font-extrabold">
                  Explore Section 5: Enterprise Policy Scripts &amp; Playbook
                </h4>
                <p className="text-xs opacity-90 max-w-xl">
                  Automate compliance deployment with production-ready PowerShell, KQL, and REST API commands.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('playbook');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Proceed to Section 5: Policy Scripts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 5: Policy & Script Playbook */}
        {currentTab === 'playbook' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                  5
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Section 5: Enterprise Policy Scripts &amp; Automation Playbook
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Production-grade PowerShell, KQL audit queries, and REST APIs for automated compliance enforcement.
                  </p>
                </div>
              </div>
            </div>

            <PolicyPlaybook 
              scenario={selectedScenario}
              profile={profile}
              initialCategory={playbookCategory} 
            />

            {/* Step 5 to Step 6 Transition Bar */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-5 rounded-2xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80">Final Flow Step</div>
                <h4 className="text-base font-extrabold">
                  Explore Section 6: Official Microsoft Learn Compliance &amp; Regulatory Hub
                </h4>
                <p className="text-xs opacity-90 max-w-xl">
                  Access 17+ official Microsoft Learn documentation links, ISO 42001, and NIST AI RMF mappings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('docs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-slate-100 font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Proceed to Section 6: Official MS Docs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 6: Official Microsoft Documentation Hub */}
        {currentTab === 'docs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  6
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Section 6: Official Microsoft Documentation &amp; Regulatory Compliance Directory
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct Microsoft Learn documentation citations, ISO 42001 &amp; NIST AI RMF alignments, and verified implementation quotes.
                  </p>
                </div>
              </div>
            </div>

            <MicrosoftDocsHub 
              scenario={selectedScenario}
              profile={profile}
            />

            {/* Bottom Executive Brief Callout */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 justify-center sm:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Assessment & Governance Blueprint Completed</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Ready to present findings to leadership? Export the complete CISO Executive Brief as PDF or print.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate CISO Executive Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPortalStage('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <span>Evaluate Another Scenario</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CISO Executive Brief Modal */}
      <ExecutiveSummaryModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        profile={profile}
        redFlags={detectedRedFlags}
        postureScore={postureScore}
        dimensions={dimensions}
      />

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                AegisAI • Enterprise Microsoft AI Governance Engine
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            {/* By Sapan Patel - AI Agent Developer & Solution Architect */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>By <strong className="text-slate-900 dark:text-white font-bold">Sapan Patel</strong> — AI Agent Developer &amp; Solution Architect</span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Microsoft AI Ecosystem</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href="https://sapanpatel1230.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors hover:underline"
                title="Sapan Patel Portfolio"
              >
                <Globe className="w-3 h-3" />
                <span>Portfolio</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href="https://www.linkedin.com/in/sapan-patel-807321222/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors hover:underline"
                title="Sapan Patel on LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500 flex-wrap justify-center sm:justify-end">
            <span>Purview AI Hub</span>
            <span>•</span>
            <span>Azure AI Content Safety</span>
            <span>•</span>
            <span>Copilot Studio Analytics</span>
            <span>•</span>
            <span>SharePoint SAM RSA</span>
            <span>•</span>
            <span>Entra ID PIM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;

import React, { useState } from 'react';
import { 
  BusinessScenario, 
  BusinessProfile, 
  DimensionScore,
  IndustryType 
} from '../../types';
import { DEFAULT_SCENARIOS, validateBusinessScenario } from '../../data/governanceData';
import { AegisLogo } from '../Common/AegisLogo';
import { ScenarioBuilderModal } from '../Assessment/ScenarioBuilderModal';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Globe, 
  Users, 
  Database, 
  Lock, 
  Layers, 
  FileCode, 
  BookOpen,
  Sun,
  Moon,
  ChevronRight,
  Linkedin,
  ExternalLink,
  Sliders,
  Compass,
  FileText
} from 'lucide-react';

interface LandingHeroProps {
  selectedScenario: BusinessScenario;
  onSelectScenario: (scenario: BusinessScenario) => void;
  onSubmit: () => void;
  profile: BusinessProfile;
  onUpdateProfile: (profile: BusinessProfile) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSelectProfilePreset: (presetKey: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  selectedScenario,
  onSelectScenario,
  onSubmit,
  profile,
  onUpdateProfile,
  theme,
  onToggleTheme,
  onSelectProfilePreset,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validate the currently selected scenario
  const validationResult = validateBusinessScenario(selectedScenario, profile);

  const handleSelectScenario = (scen: BusinessScenario) => {
    onSelectScenario(scen);
    onUpdateProfile({
      ...profile,
      activeScenario: scen,
      useCase: scen.useCase,
      buildPlatform: scen.buildPlatform,
      deploymentPlatform: scen.deploymentPlatform,
      userCountTier: scen.userCountTier,
      dataSensitivityLevel: scen.dataSensitivityLevel,
      dataTypes: {
        ...profile.dataTypes,
        pii: scen.containsPii,
        pci: scen.containsFinancial,
        phi: scen.containsPhi,
        ipSourceCode: scen.containsSecrets,
      }
    });
    // Automatically route to further steps (workspace dashboard & blueprint)
    onSubmit();
  };

  const handleSaveCustomScenario = (customScen: BusinessScenario) => {
    handleSelectScenario(customScen);
  };

  const scenarioIcons: Record<string, string> = {
    'scen-finance-ma': '💼',
    'scen-cust-web': '🌐',
    'scen-health-clinical': '🏥',
    'scen-devops-copilot': '⚡',
    'scen-hr-payroll': '👥',
    'scen-mail-triage': '✉️',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060c18] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <AegisLogo size="sm" showSubtitle={true} />

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              {/* Enterprise Profile Quick Preset */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-100 dark:bg-slate-900 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-xs shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium hidden md:inline">Industry:</span>
                <select
                  aria-label="Select industry profile"
                  value={profile.industry}
                  onChange={(e) => onSelectProfilePreset(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs max-w-[125px] sm:max-w-[170px] truncate"
                >
                  <option value="finance" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Finance (Tier 1 Bank)</option>
                  <option value="banking-retail" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Banking &amp; Wealth</option>
                  <option value="healthcare" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Healthcare &amp; Hospital</option>
                  <option value="pharma-lifesciences" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Pharma &amp; Life Sciences</option>
                  <option value="technology" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tech &amp; Cloud SaaS</option>
                  <option value="cybersecurity-mssp" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cyber MSSP &amp; SOC</option>
                  <option value="government-federal" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Federal Gov &amp; Defense</option>
                  <option value="legal-lawfirm" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Legal &amp; Law Firm</option>
                  <option value="manufacturing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Manufacturing</option>
                  <option value="retail-ecommerce" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Retail &amp; E-Commerce</option>
                  <option value="energy-utilities" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Energy &amp; Utilities</option>
                  <option value="higher-education" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Higher Education</option>
                  <option value="telecom-media" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Telecom &amp; Media</option>
                </select>
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 transition-all shrink-0 cursor-pointer shadow-sm"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>

            {/* Built by Sapan Patel + LinkedIn + Portfolio (hidden on extra small to prevent header clutter) */}
            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium select-none">
              <span>Built by <strong className="text-slate-900 dark:text-white font-bold">Sapan Patel</strong></span>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero & Intake Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span>Microsoft AI Security, Compliance & Governance Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Assess, Detect & Secure Your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              Microsoft AI Ecosystem
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Analyze enterprise requirements against Microsoft Purview, Azure AI Content Safety, and Copilot Studio policies. Detect critical security red flags and automatically generate production-ready Zero Trust blueprints.
          </p>
        </div>

        {/* Step 1: Select from 5 Pre-Filled Scenarios or Add Custom */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black">
                  1
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Select a Use Case to Automatically Generate Assessment &amp; Blueprint
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                Click any scenario below to automatically launch its Risk Heatmap, 7-Stage Topology, Threat Simulator, and Governance Blueprint.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Custom Business Use Case</span>
            </button>
          </div>

          {/* 5 Pre-filled Scenarios Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_SCENARIOS.map((scen, idx) => {
              const isSelected = selectedScenario.id === scen.id;
              const emoji = scenarioIcons[scen.id] || '🤖';

              return (
                <div
                  key={scen.id}
                  onClick={() => handleSelectScenario(scen)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left group ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-600 dark:border-cyan-400 shadow-xl ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-2xl p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                          {emoji}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                            Scenario 0{idx + 1} • {scen.department}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                            {scen.name}
                          </h3>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="p-1 rounded-full bg-blue-600 text-white shrink-0 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 group-hover:border-blue-500" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {scen.description}
                    </p>
                  </div>

                  {/* Badges & Meta */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {scen.buildPlatform.replace('-', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        via {scen.deploymentPlatform}
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        scen.dataSensitivityLevel === 'highly-confidential'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      }`}>
                        {scen.dataSensitivityLevel.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Sensitivity Tags */}
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Data:</span>
                      {scen.containsPii && <span className="font-semibold text-amber-600 dark:text-amber-400">PII</span>}
                      {scen.containsFinancial && <span className="font-semibold text-emerald-600 dark:text-emerald-400">• Financial</span>}
                      {scen.containsPhi && <span className="font-semibold text-rose-600 dark:text-rose-400">• HIPAA PHI</span>}
                      {scen.containsSecrets && <span className="font-semibold text-purple-600 dark:text-purple-400">• Secrets/IP</span>}
                    </div>

                    {/* Launch Action Indicator */}
                    <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-cyan-400 group-hover:text-blue-500 dark:group-hover:text-cyan-300">
                      <span>Launch Assessment &amp; Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 6th Card: Custom Use Case Builder Trigger */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-400 bg-white/50 dark:bg-slate-900/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[190px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                + Create Custom Use Case
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Configure your own Department, Build Tool, LLM RAG pipelines, Entra ID access, and sensitive data types.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Scenario Detailed Live Preview & Submit Action */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-950/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black">
                2
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <span>Active Scenario Assessment Preview:</span>
                <span className="text-blue-600 dark:text-cyan-400 font-mono">
                  "{selectedScenario.name}"
                </span>
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                validationResult.score >= 70
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              }`}>
                Risk Readiness: {validationResult.score}%
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {validationResult.criticalGaps.length} Action Gaps Flagged
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Architecture & Build</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white capitalize block">
                  {selectedScenario.buildPlatform.replace('-', ' ')}
                </span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">
                  Channel: {selectedScenario.deploymentPlatform}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Target Department & Scale</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {selectedScenario.department}
                </span>
                <span className="text-slate-500 text-[11px] mt-0.5 block capitalize">
                  Scale: {selectedScenario.userCountTier} users
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Data Sensitivity</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white capitalize block">
                  {selectedScenario.dataSensitivityLevel.replace('-', ' ')}
                </span>
                <span className="text-slate-500 text-[11px] mt-0.5 block truncate">
                  Source: {selectedScenario.dataSource}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Identity & Authentication</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white capitalize block">
                  {selectedScenario.userAccessType.replace('-', ' ')}
                </span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">
                  {selectedScenario.userAccessType === 'anonymous-public' ? '⚠️ Zero Trust Gap' : 'Entra ID Governed'}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 justify-center sm:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Ready to view the complete 5-section enterprise governance blueprint?</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submitting generates Risk Heatmap, 7-Stage Security Topology, 4-Pillar Blueprint, Policy Playbooks & Microsoft Docs.
                </p>
              </div>

              <button
                type="button"
                onClick={onSubmit}
                className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>🚀 Run Assessment &amp; Generate Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Downstream Portal Sections Preview */}
        <div className="space-y-4 pt-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What This Portal Generates for Your Scenario
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A comprehensive 6-stage security, compliance, and threat simulation architecture tailored to Microsoft AI:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Risk Heatmap &amp; Red Flags</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                5x5 probability vs impact matrix &amp; 12 OWASP/Purview red flags with attack scenarios.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Security Topology</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Interactive 7-stage prompt security pipeline: Zero Trust Entra ID to Audit logging.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-blue-300 dark:border-blue-800/60 text-left space-y-2 shadow-sm bg-gradient-to-b from-blue-50/50 dark:from-blue-950/30 to-transparent">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                <span>Threat Simulator</span>
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Side-by-side prompt sandbox: simulate bypass attacks vs parallel Microsoft guardrail blocks.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Governance Blueprint</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Dedicated Microsoft Purview, Content Safety, Copilot Studio &amp; RBAC controls.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center font-bold">
                5
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Policy Scripts Playbook</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Searchable PowerShell, KQL, and REST API snippets ready for automated deployment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-bold">
                6
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Official MS Docs Hub</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Direct links to 17+ official Microsoft Learn compliance guides, ISO 42001 &amp; NIST mappings.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Landing Footer: By Sapan Patel - AI Agent Developer & Solution Architect */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-6 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              By <strong className="text-slate-900 dark:text-white font-bold">Sapan Patel</strong> — AI Agent Developer &amp; Solution Architect
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center space-x-1 text-slate-600 dark:text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1" />
              Microsoft AI Ecosystem
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <a
              href="https://sapanpatel1230.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors hover:underline"
              title="Sapan Patel Portfolio"
            >
              <Globe className="w-4 h-4" />
              <span>Portfolio</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="https://www.linkedin.com/in/sapan-patel-807321222/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors hover:underline"
              title="Sapan Patel on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Scenario Builder Modal */}
      <ScenarioBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveScenario={handleSaveCustomScenario}
        initialScenario={selectedScenario}
      />
    </div>
  );
};

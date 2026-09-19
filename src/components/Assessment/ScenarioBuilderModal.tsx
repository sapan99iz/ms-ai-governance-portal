import React, { useState } from 'react';
import { 
  BusinessScenario, 
  UseCaseType, 
  BuildPlatformType, 
  DeploymentPlatformType, 
  UserCountTier, 
  DataSensitivityLevel,
  UserAccessType
} from '../../types';
import { DEFAULT_SCENARIOS } from '../../data/governanceData';
import { 
  X, 
  Sparkles, 
  Building2, 
  Database, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  Layers, 
  Check,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface ScenarioBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScenario: (scenario: BusinessScenario) => void;
  initialScenario?: BusinessScenario;
}

export const ScenarioBuilderModal: React.FC<ScenarioBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveScenario,
  initialScenario,
}) => {
  const [scenario, setScenario] = useState<BusinessScenario>(
    initialScenario || {
      id: `scen-custom-${Date.now()}`,
      name: 'Automated Loan Approval & Document Synthesizer',
      department: 'Consumer Lending & Retail Banking',
      description: 'Copilot Studio and Azure OpenAI agent processing customer loan applications, parsing bank statements from SharePoint, and querying credit bureaus via custom REST APIs.',
      useCase: 'financial-legal',
      buildPlatform: 'copilot-studio',
      deploymentPlatform: 'teams',
      userCountTier: 'enterprise',
      dataSensitivityLevel: 'highly-confidential',
      dataSource: 'SharePoint Online Customer Folders, Azure SQL DB, Equifax Credit Bureau API',
      userAccessType: 'authenticated-entra',
      containsPii: true,
      containsFinancial: true,
      containsPhi: false,
      containsSecrets: true,
    }
  );

  if (!isOpen) return null;

  const loadTemplate = (template: BusinessScenario) => {
    setScenario({
      ...template,
      id: `scen-custom-${Date.now()}`,
      name: `${template.name} (Custom Copy)`,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveScenario(scenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-glow">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Define & Validate Custom Business Scenario</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  AI Validation Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Input your specific business use case, data sources, and architecture to validate against Microsoft Purview, DLP, and RBAC rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Template Picker Strip */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Or Load an Enterprise Scenario Template:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_SCENARIOS.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-300 text-xs border border-slate-800 transition-all text-left"
                >
                  {tmpl.name.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Scenario Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>1. Scenario Identification & Business Purpose</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scenario Name *</label>
                <input
                  type="text"
                  required
                  value={scenario.name}
                  onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
                  placeholder="e.g. Executive M&A Deal Room Copilot"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department / Business Unit</label>
                <input
                  type="text"
                  value={scenario.department}
                  onChange={(e) => setScenario({ ...scenario, department: e.target.value })}
                  placeholder="e.g. Legal, Finance, HR, Commercial Sales"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Business Objective & Scenario Workflow *
              </label>
              <textarea
                rows={3}
                required
                value={scenario.description}
                onChange={(e) => setScenario({ ...scenario, description: e.target.value })}
                placeholder="Describe how users will interact with AI, what data is queried, and what tasks the agent performs..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Section 2: Architectural Coordinates */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>2. Technology Stack & Platform Selections</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Use Case Family</label>
                <select
                  value={scenario.useCase}
                  onChange={(e) => setScenario({ ...scenario, useCase: e.target.value as UseCaseType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  <option value="internal-knowledge" className="bg-slate-900 text-white">Enterprise Knowledge & Search</option>
                  <option value="customer-support" className="bg-slate-900 text-white">Customer Support & Public Bot</option>
                  <option value="financial-legal" className="bg-slate-900 text-white">Financial Operations & Legal</option>
                  <option value="hr-employee" className="bg-slate-900 text-white">HR & Employee Self-Service</option>
                  <option value="code-devops" className="bg-slate-900 text-white">DevOps & Code Generation</option>
                  <option value="healthcare-clinical" className="bg-slate-900 text-white">Clinical & Patient Intake</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Build Platform</label>
                <select
                  value={scenario.buildPlatform}
                  onChange={(e) => setScenario({ ...scenario, buildPlatform: e.target.value as BuildPlatformType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  <option value="power-platform-ai" className="bg-slate-900 text-white">Power Automate Flow & Copilot Studio Agent</option>
                  <option value="copilot-studio" className="bg-slate-900 text-white">Copilot Studio Custom Agent</option>
                  <option value="m365-copilot" className="bg-slate-900 text-white">Microsoft 365 Copilot Native</option>
                  <option value="azure-openai" className="bg-slate-900 text-white">Azure OpenAI / AI Foundry</option>
                  <option value="hybrid-multi" className="bg-slate-900 text-white">Hybrid Multi-Workload</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Deployment Channel</label>
                <select
                  value={scenario.deploymentPlatform}
                  onChange={(e) => setScenario({ ...scenario, deploymentPlatform: e.target.value as DeploymentPlatformType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  <option value="mail-automation" className="bg-slate-900 text-white">Exchange Online / Email-Triggered Flow (Power Automate)</option>
                  <option value="teams" className="bg-slate-900 text-white">Microsoft Teams & Channels</option>
                  <option value="web-public" className="bg-slate-900 text-white">Public Website (Anonymous)</option>
                  <option value="m365-apps" className="bg-slate-900 text-white">M365 Desktop Apps (Word, PPT)</option>
                  <option value="enterprise-intranet" className="bg-slate-900 text-white">Intranet & Mobile App</option>
                  <option value="api-backend" className="bg-slate-900 text-white">Headless API / Microservice</option>
                </select>
              </div>
            </div>

            {scenario.deploymentPlatform === 'mail-automation' && (
              <div className="bg-blue-950/40 border border-blue-800/60 p-2.5 rounded-xl text-[11px] text-cyan-300 flex items-start space-x-2">
                <span className="text-base">✉️</span>
                <div>
                  <strong className="text-white block">Mail-Triggered Flow & Agent Architecture Selected:</strong>
                  Triggered on Exchange Online Shared Mailbox arrival. Passes email body & attachments to AI agent with Purview Email DLP & Defender Safe Attachments.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Audience Access Mode</label>
                <select
                  value={scenario.userAccessType}
                  onChange={(e) => setScenario({ ...scenario, userAccessType: e.target.value as UserAccessType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  <option value="authenticated-entra" className="bg-slate-900 text-white">Authenticated Entra ID Employees (SSO + MFA)</option>
                  <option value="anonymous-public" className="bg-slate-900 text-white">Anonymous Unauthenticated Public Web Users</option>
                  <option value="partner-b2b" className="bg-slate-900 text-white">Partner / Contractor External B2B Guests</option>
                  <option value="elevated-privileged" className="bg-slate-900 text-white">Elevated Privileged Admins / Engineers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Concurrency / Seats</label>
                <select
                  value={scenario.userCountTier}
                  onChange={(e) => setScenario({ ...scenario, userCountTier: e.target.value as UserCountTier })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  <option value="pilot" className="bg-slate-900 text-white">Pilot Cohort (&lt; 500 users)</option>
                  <option value="department" className="bg-slate-900 text-white">Departmental (500 - 2,500 users)</option>
                  <option value="enterprise" className="bg-slate-900 text-white">Enterprise-wide (2,500 - 20,000 users)</option>
                  <option value="global" className="bg-slate-900 text-white">Global Enterprise (20,000+ users)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Data Assets & Sensitivity Check */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>3. Grounding Data Repositories & Data Sensitivity</span>
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Data Sources Connected (SharePoint sites, databases, APIs)
              </label>
              <input
                type="text"
                value={scenario.dataSource}
                onChange={(e) => setScenario({ ...scenario, dataSource: e.target.value })}
                placeholder="e.g. SharePoint Executive Sites, Dataverse, Salesforce API, SAP ERP"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Select Sensitive Data Classes Ingested:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'containsPii', label: 'Customer PII (SSN, Email)', reg: 'GDPR' },
                  { key: 'containsFinancial', label: 'Financials / MNPI', reg: 'SEC / PCI' },
                  { key: 'containsPhi', label: 'Health PHI / EHR', reg: 'HIPAA' },
                  { key: 'containsSecrets', label: 'API Keys / Source Code', reg: 'SOC 2' },
                ].map((item) => {
                  const checked = Boolean(scenario[item.key as keyof BusinessScenario]);
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setScenario({ ...scenario, [item.key]: !checked })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        checked
                          ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          checked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 ml-5 block mt-0.5">{item.reg}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Validate Scenario & Recalculate Portal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

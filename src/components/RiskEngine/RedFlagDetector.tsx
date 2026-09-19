import React, { useState } from 'react';
import { RedFlag } from '../../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Copy, 
  Terminal, 
  Scale, 
  Wrench,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface RedFlagDetectorProps {
  redFlags: RedFlag[];
  allCatalogFlags: RedFlag[];
  selectedFlagId: string | null;
  onSelectFlag: (flagId: string | null) => void;
  onNavigateToBlueprint: (pillarId: string) => void;
}

export const RedFlagDetector: React.FC<RedFlagDetectorProps> = ({
  redFlags,
  allCatalogFlags,
  selectedFlagId,
  onSelectFlag,
  onNavigateToBlueprint,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(selectedFlagId || (redFlags[0]?.id ?? null));
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  // Sync expandedId when selectedFlagId changes from outside
  React.useEffect(() => {
    if (selectedFlagId) {
      setExpandedId(selectedFlagId);
    }
  }, [selectedFlagId]);

  const criticalCount = redFlags.filter((f) => f.severity === 'critical').length;
  const highCount = redFlags.filter((f) => f.severity === 'high').length;
  const mediumCount = redFlags.filter((f) => f.severity === 'medium').length;

  const filteredFlags = redFlags.filter((flag) => {
    const matchesSev = severityFilter === 'all' || flag.severity === severityFilter;
    const matchesCat = categoryFilter === 'all' || flag.category === categoryFilter;
    return matchesSev && matchesCat;
  });

  const categories = Array.from(new Set(allCatalogFlags.map((f) => f.category)));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const getPillarForFlag = (category: string) => {
    if (category === 'Sensitivity Gaps' || category === 'Data Oversharing') return 'purview';
    if (category === 'Prompt & Exfiltration') return 'guardrails';
    if (category === 'Agent Governance' || category === 'Compliance & Audit') return 'copilot-studio';
    return 'rbac';
  };

  return (
    <div className="space-y-6">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Card 1: Total Detected */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Total Detected Red Flags</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-baseline space-x-2">
            <span>{redFlags.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">of {allCatalogFlags.length} evaluated</span>
          </div>
        </div>

        {/* Card 2: Critical */}
        <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-sm">
          <div className="text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Critical Vulnerabilities</span>
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-200 mt-1 flex items-baseline justify-between">
            <span>{criticalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
              Immediate Action
            </span>
          </div>
        </div>

        {/* Card 3: High Severity */}
        <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-sm">
          <div className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>High Severity Gaps</span>
          </div>
          <div className="text-2xl font-black text-amber-800 dark:text-amber-200 mt-1 flex items-baseline justify-between">
            <span>{highCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
              Remediation Needed
            </span>
          </div>
        </div>

        {/* Card 4: Medium */}
        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-sm">
          <div className="text-xs text-blue-700 dark:text-blue-300 font-bold flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Medium / Operational</span>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-200 mt-1 flex items-baseline justify-between">
            <span>{mediumCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
              Policy Controls
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Filter Severity:</span>
          {['all', 'critical', 'high', 'medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                severityFilter === sev
                  ? sev === 'critical'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : sev === 'high'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Red Flag List */}
      <div className="space-y-4">
        {filteredFlags.length === 0 ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No Red Flags In This View!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Your active Microsoft security controls successfully mitigate all threats under this filter.
            </p>
          </div>
        ) : (
          filteredFlags.map((flag) => {
            const isExpanded = expandedId === flag.id;
            const isCopied = copiedScriptId === flag.id;

            return (
              <div
                key={flag.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  flag.severity === 'critical'
                    ? isExpanded
                      ? 'bg-white dark:bg-slate-900 border-rose-500 shadow-lg'
                      : 'bg-white dark:bg-slate-900/80 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                    : isExpanded
                    ? 'bg-white dark:bg-slate-900 border-amber-500 shadow-md'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => {
                    const newId = isExpanded ? null : flag.id;
                    setExpandedId(newId);
                    onSelectFlag(newId);
                  }}
                  className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="mt-0.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                          flag.severity === 'critical'
                            ? 'bg-rose-600 text-white'
                            : flag.severity === 'high'
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{flag.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {flag.category}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          L:{flag.likelihood}/5 × I:{flag.impact}/5 (Risk: {flag.likelihood * flag.impact}/25)
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {flag.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {flag.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded cursor-pointer">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Deep-Dive Details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 p-5 space-y-4">
                    {/* Attack / Leakage Scenario */}
                    <div className="bg-rose-50 dark:bg-rose-950/25 rounded-lg p-4 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                      <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Real-World Vulnerability / Exploitation Scenario</span>
                      </div>
                      <p className="text-xs text-rose-950 dark:text-rose-100/90 leading-relaxed font-sans">
                        {flag.vulnerabilityScenario}
                      </p>
                    </div>

                    {/* Impacted Regulations */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Impacted Regulatory & Security Frameworks</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {flag.impactedRegulations.map((reg) => (
                          <span
                            key={reg}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-mono text-xs border border-slate-200 dark:border-slate-700 font-semibold"
                          >
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mitigation Blueprint */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          <Wrench className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Remediation Solution: {flag.mitigationBlueprint.solutionName}</span>
                        </div>
                        <button
                          onClick={() => onNavigateToBlueprint(getPillarForFlag(flag.category))}
                          className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold cursor-pointer"
                        >
                          <span>Open Blueprint</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Action Implementation Steps:
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {flag.mitigationBlueprint.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack Required */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Microsoft Stack:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {flag.mitigationBlueprint.microsoftTech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] border border-slate-200 dark:border-slate-700 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* PowerShell / Code Remediation */}
                      {flag.mitigationBlueprint.powershellSnippet && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                              <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="font-semibold">Remediation Script (PowerShell / Graph)</span>
                            </div>
                            <button
                              onClick={() => handleCopy(flag.id, flag.mitigationBlueprint.powershellSnippet!)}
                              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-mono transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Script</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="bg-slate-900 dark:bg-slate-950 p-3 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                            {flag.mitigationBlueprint.powershellSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

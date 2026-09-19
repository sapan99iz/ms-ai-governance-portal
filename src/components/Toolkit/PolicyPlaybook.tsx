import React, { useState, useEffect } from 'react';
import { POLICY_SNIPPETS } from '../../data/governanceData';
import { PolicySnippet, BusinessScenario, BusinessProfile } from '../../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Search, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2,
  FolderLock,
  Sparkles,
  Filter
} from 'lucide-react';

interface PolicyPlaybookProps {
  initialCategory?: string;
  scenario?: BusinessScenario;
  profile?: BusinessProfile;
}

export const PolicyPlaybook: React.FC<PolicyPlaybookProps> = ({ 
  initialCategory = 'all',
  scenario,
  profile
}) => {
  const isMailAutomation = scenario?.deploymentPlatform === 'mail-automation' || scenario?.buildPlatform === 'power-platform-ai';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [onlyScenarioRelevant, setOnlyScenarioRelevant] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(() => {
    if (isMailAutomation) return 'power-automate-flow-dlp-mail';
    return POLICY_SNIPPETS[0].id;
  });
  const [mobileTab, setMobileTab] = useState<'list' | 'code'>('list');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isMailAutomation) {
      setSelectedSnippetId('power-automate-flow-dlp-mail');
    }
  }, [isMailAutomation]);

  const categories = ['all', 'Purview DLP', 'SharePoint SAM', 'Copilot Studio Telemetry', 'Azure AI Guardrails'];

  // Identify whether snippet is tailored for this scenario
  const isSnippetTailored = (snippet: PolicySnippet) => {
    if (!scenario) return false;
    if (isMailAutomation) {
      return snippet.id === 'power-automate-flow-dlp-mail' || 
             snippet.id === 'exchange-ai-mail-encryption' || 
             snippet.id === 'power-platform-dlp-isolation';
    }
    if (scenario.buildPlatform === 'm365-copilot') {
      return snippet.id === 'sam-rsa-lockdown' || snippet.id === 'purview-copilot-audit' || snippet.id === 'purview-dlp-rule';
    }
    if (scenario.deploymentPlatform === 'web-public' || scenario.buildPlatform === 'azure-openai') {
      return snippet.id === 'content-safety-jailbreak';
    }
    return false;
  };

  const filteredSnippets = POLICY_SNIPPETS.filter((s) => {
    if (onlyScenarioRelevant && !isSnippetTailored(s)) return false;
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedSnippet = POLICY_SNIPPETS.find((s) => s.id === selectedSnippetId) || filteredSnippets[0] || POLICY_SNIPPETS[0];

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (snippet: PolicySnippet) => {
    const extension = snippet.language === 'powershell' ? 'ps1' : snippet.language === 'kql' ? 'kql' : 'json';
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${snippet.id}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Active Scenario Context Banner */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
                <Terminal className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Production-Ready Implementation Scripts
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Policy & Script Automation Playbook
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified PowerShell cmdlets, Microsoft Purview DLP definitions, and KQL audit queries.
            </p>
          </div>

          {/* Quick Scenario Relevancy Toggle Button */}
          {scenario && (
            <button
              type="button"
              onClick={() => setOnlyScenarioRelevant(!onlyScenarioRelevant)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer self-start md:self-auto ${
                onlyScenarioRelevant
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>
                {onlyScenarioRelevant ? `Filtered: ${scenario.name}` : `Filter Tailored for "${scenario.name}"`}
              </span>
            </button>
          )}
        </div>

        {/* Filter Categories Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOnlyScenarioRelevant(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat && !onlyScenarioRelevant
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Scripts' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search scripts by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Mode Switcher (< lg) */}
      <div className="flex lg:hidden items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
            mobileTab === 'list'
              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          📋 Script Catalog ({filteredSnippets.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
            mobileTab === 'code'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          💻 Code &amp; Config ({selectedSnippet.language.toUpperCase()})
        </button>
      </div>

      {/* Main 2-Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Scripts List */}
        <div className={`${mobileTab === 'code' ? 'hidden lg:block' : 'block'} lg:col-span-5 space-y-3 max-h-[620px] overflow-y-auto pr-1`}>
          {filteredSnippets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              No policy scripts match your filter.
            </div>
          ) : (
            filteredSnippets.map((snippet) => {
              const isSelected = selectedSnippet.id === snippet.id;
              const isTailored = isSnippetTailored(snippet);

              return (
                <div
                  key={snippet.id}
                  onClick={() => {
                    setSelectedSnippetId(snippet.id);
                    setMobileTab('code');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-400 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {snippet.category}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {isTailored && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          🎯 Active Scenario Match
                        </span>
                      )}
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {snippet.language}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {snippet.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {snippet.description}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column (7 cols): Selected Script Code Viewer */}
        <div className={`${mobileTab === 'list' ? 'hidden lg:flex' : 'flex'} lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex-col justify-between`}>
          <div>
            <div className="bg-slate-100 dark:bg-slate-950/80 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setMobileTab('list')}
                    className="lg:hidden text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline"
                  >
                    ← Back to List
                  </button>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {selectedSnippet.category} • {selectedSnippet.language.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedSnippet.title}
                </h4>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedSnippet.id, selectedSnippet.code)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
                >
                  {copiedId === selectedSnippet.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(selectedSnippet)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                  title="Download script file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedSnippet.description}
            </div>

            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[440px] leading-relaxed">
              <pre>{selectedSnippet.code}</pre>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Verified against Microsoft 365 Purview & Power Platform cmdlets</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Tested & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

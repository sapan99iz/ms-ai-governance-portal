import React, { useState } from 'react';
import { MICROSOFT_OFFICIAL_DOCS } from '../../data/governanceData';
import { MicrosoftDocReference, BusinessScenario, BusinessProfile } from '../../types';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  Scale, 
  Filter,
  Sparkles,
  Lock,
  Cpu,
  FileCheck
} from 'lucide-react';

interface MicrosoftDocsHubProps {
  scenario?: BusinessScenario;
  profile?: BusinessProfile;
}

export const MicrosoftDocsHub: React.FC<MicrosoftDocsHubProps> = ({ scenario, profile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyScenarioRelevant, setOnlyScenarioRelevant] = useState<boolean>(false);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  const categories = [
    'all',
    'Purview & DLP',
    'Content Safety & Guardrails',
    'Copilot Studio & Power Platform',
    'Identity & Zero Trust',
    'Compliance & Privacy'
  ];

  const isDocTailored = (doc: MicrosoftDocReference) => {
    if (!scenario) return false;
    const isMail = scenario.deploymentPlatform === 'mail-automation' || scenario.buildPlatform === 'power-platform-ai';
    if (isMail) {
      return doc.id === 'ms-doc-power-automate-dlp' || 
             doc.id === 'ms-doc-exchange-mail-ai-dlp' || 
             doc.id === 'ms-doc-content-safety-overview' || 
             doc.id === 'ms-doc-content-safety-prompt-shields' ||
             doc.id === 'ms-doc-copilot-studio-dlp' ||
             doc.applicableWorkloads.some(w => w.includes('Power Automate') || w.includes('Exchange'));
    }
    if (scenario.buildPlatform === 'm365-copilot') {
      return doc.applicableWorkloads.some(w => w.includes('Microsoft 365 Copilot') || w.includes('M365'));
    }
    if (scenario.deploymentPlatform === 'web-public') {
      return doc.category === 'Content Safety & Guardrails' || doc.applicableWorkloads.some(w => w.includes('Copilot Studio'));
    }
    if (scenario.useCase === 'healthcare-clinical') {
      return doc.id === 'ms-doc-cloud-hipaa-fedramp' || doc.relevantStandards.some(s => s.includes('HIPAA'));
    }
    return false;
  };

  const filteredDocs = MICROSOFT_OFFICIAL_DOCS.filter((doc) => {
    if (onlyScenarioRelevant && !isDocTailored(doc)) return false;
    const matchesCat = activeCategory === 'all' || doc.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.keyGuidance.toLowerCase().includes(q) ||
      doc.relevantStandards.some(s => s.toLowerCase().includes(q)) ||
      doc.applicableWorkloads.some(w => w.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedDocId(id);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Purview & DLP': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60';
      case 'Content Safety & Guardrails': return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/60';
      case 'Copilot Studio & Power Platform': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60';
      case 'Identity & Zero Trust': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60';
      case 'Compliance & Privacy': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Active Scenario Context */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Microsoft Learn Verified Technical Guidance
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Official Microsoft Documentation & Standards Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Authoritative references, ISO/IEC 42001, and NIST AI RMF regulatory mappings.
            </p>
          </div>

          {/* Scenario Tailored Filter Toggle */}
          {scenario && (
            <button
              type="button"
              onClick={() => setOnlyScenarioRelevant(!onlyScenarioRelevant)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer self-start md:self-auto ${
                onlyScenarioRelevant
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
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

        {/* Category Filters Bar */}
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
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Documentation' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, regulations, APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            No official Microsoft documentation references match your active filter.
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isTailored = isDocTailored(doc);

            return (
              <div
                key={doc.id}
                className={`bg-white dark:bg-slate-900/80 rounded-2xl p-5 border-2 flex flex-col justify-between transition-all hover:shadow-lg ${
                  isTailored
                    ? 'border-emerald-500/60 dark:border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>

                    {isTailored && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        🎯 Active Match
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Key Microsoft Guidance:
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{doc.keyGuidance}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                  {/* Workloads & Standards */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1">
                      {doc.applicableWorkloads.map((workload, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {workload}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {doc.relevantStandards.map((std, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Direct Link & Copy */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(doc.id, doc.docUrl)}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedDocId === doc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={doc.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                    >
                      <span>Open Microsoft Learn</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

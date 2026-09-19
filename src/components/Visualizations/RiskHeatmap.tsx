import React, { useState } from 'react';
import { RedFlag } from '../../types';
import { AlertOctagon, Flame, ChevronRight, X } from 'lucide-react';

interface RiskHeatmapProps {
  redFlags: RedFlag[];
  selectedFlagId: string | null;
  onSelectFlag: (flagId: string) => void;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  redFlags,
  selectedFlagId,
  onSelectFlag,
}) => {
  // 5x5 grid coordinates: y = Impact (5 down to 1), x = Likelihood (1 to 5)
  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];
  const [activeCell, setActiveCell] = useState<{ impact: number; likelihood: number } | null>(null);

  const getCellColor = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 16) return 'bg-rose-100/70 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800/80 hover:bg-rose-200 dark:hover:bg-rose-900/70 text-rose-900 dark:text-rose-200';
    if (score >= 10) return 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200';
    if (score >= 6) return 'bg-yellow-100/50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200';
    return 'bg-emerald-100/40 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200';
  };

  const impactLabels: Record<number, string> = {
    5: 'Catastrophic (5)',
    4: 'Critical (4)',
    3: 'Moderate (3)',
    2: 'Minor (2)',
    1: 'Negligible (1)',
  };

  const likelihoodLabels: Record<number, string> = {
    1: 'Rare (1)',
    2: 'Unlikely (2)',
    3: 'Possible (3)',
    4: 'Likely (4)',
    5: 'Almost Certain (5)',
  };

  const activeCellFlags = activeCell
    ? redFlags.filter((f) => f.impact === activeCell.impact && f.likelihood === activeCell.likelihood)
    : [];

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Microsoft AI Risk Exposure Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive risk matrix plotting Likelihood vs. Regulatory Impact for active red flags.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-800">
            {redFlags.length} Active Threats Plotted
          </span>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-[11px] font-mono text-center text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/50 py-1.5 px-3 rounded-lg border border-blue-200 dark:border-blue-900/60 flex items-center justify-center space-x-1.5 select-none">
        <span>↔</span>
        <span>Swipe horizontally to inspect all 5 Likelihood columns</span>
      </div>

      {/* Heatmap Grid Container - Compact and optimized space */}
      <div className="relative flex pt-1">
        {/* Y-Axis Label */}
        <div className="flex items-center justify-center mr-1 sm:mr-2 select-none">
          <span className="-rotate-90 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Impact Severity →
          </span>
        </div>

        <div className="flex-1 overflow-x-auto pb-1 touch-pan-x overscroll-contain">
          <div className="min-w-[440px]">
            {rows.map((impact) => (
              <div key={impact} className="flex items-stretch space-x-1.5 mb-1.5">
                {/* Impact Row Label */}
                <div className="w-20 sm:w-24 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-right pr-2 flex items-center justify-end select-none">
                  {impactLabels[impact].split(' ')[0]}
                </div>

                {/* Columns for Likelihood */}
                {cols.map((likelihood) => {
                  const flagsInCell = redFlags.filter(
                    (f) => f.impact === impact && f.likelihood === likelihood
                  );
                  const hasFlags = flagsInCell.length > 0;
                  const isSelected = flagsInCell.some((f) => f.id === selectedFlagId);
                  const isCellActive = activeCell?.impact === impact && activeCell?.likelihood === likelihood;

                  return (
                    <div
                      key={`${impact}-${likelihood}`}
                      onClick={() => {
                        if (hasFlags) {
                          setActiveCell(isCellActive ? null : { impact, likelihood });
                        }
                      }}
                      className={`flex-1 min-h-[46px] rounded-lg border transition-all p-1 flex flex-wrap content-center items-center justify-center gap-1 cursor-pointer relative ${getCellColor(
                        impact,
                        likelihood
                      )} ${
                        isSelected || isCellActive
                          ? 'ring-2 ring-blue-500 dark:ring-cyan-400 scale-[1.02] z-10 shadow-md'
                          : ''
                      }`}
                    >
                      {hasFlags ? (
                        flagsInCell.map((flag) => (
                          <button
                            key={flag.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectFlag(flag.id);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono shadow-sm transition-transform hover:scale-110 whitespace-nowrap cursor-pointer ${
                              flag.severity === 'critical'
                                ? 'bg-rose-600 text-white'
                                : flag.severity === 'high'
                                ? 'bg-amber-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                            title={`${flag.id}: ${flag.title}`}
                          >
                            {flag.id}
                          </button>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600 select-none">·</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* X-Axis Header */}
            <div className="flex items-center space-x-1.5 mt-1.5 pl-20 sm:pl-24">
              {cols.map((likelihood) => (
                <div 
                  key={likelihood} 
                  className="flex-1 text-center text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 select-none"
                >
                  {likelihood === 5 ? 'Certain' : likelihoodLabels[likelihood].split(' ')[0]}
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 pl-20 sm:pl-24 select-none">
              Likelihood of Occurrence →
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Active Cell Drawer */}
      {activeCell && activeCellFlags.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950/90 rounded-xl border border-blue-300 dark:border-blue-500/50 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 dark:text-cyan-400">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>
                Threats at Impact: {impactLabels[activeCell.impact]} × Likelihood: {likelihoodLabels[activeCell.likelihood]}
              </span>
            </div>
            <button
              onClick={() => setActiveCell(null)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeCellFlags.map((flag) => (
              <div
                key={flag.id}
                onClick={() => onSelectFlag(flag.id)}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white">
                      {flag.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {flag.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{flag.description}</p>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Fix: {flag.mitigationBlueprint.solutionName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Flag Quick Preview */}
      {selectedFlagId && !activeCell && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950/90 rounded-xl border border-blue-300 dark:border-blue-500/40 text-xs">
          {(() => {
            const flag = redFlags.find((f) => f.id === selectedFlagId);
            if (!flag) return null;
            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{flag.id}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{flag.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase font-bold">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-1">{flag.description}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Recommended Fix: {flag.mitigationBlueprint.solutionName}
                  </p>
                </div>
                <button
                  onClick={() => onSelectFlag(flag.id)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 shadow transition-all self-start sm:self-auto cursor-pointer"
                >
                  View Attack Scenario
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

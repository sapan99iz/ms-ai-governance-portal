import React, { useState } from 'react';
import { DimensionScore } from '../../types';
import { Sparkles } from 'lucide-react';

interface RadarProps {
  dimensions: DimensionScore[];
  width?: number;
  height?: number;
}

const DIMENSION_METADATA: Record<string, {
  category: string;
  meaning: string;
  microsoftControl: string;
  remediationTip: string;
}> = {
  'Data Labels & RMS': {
    category: 'Information Protection',
    meaning: 'Governs which enterprise documents models can reference. Microsoft Purview sensitivity labels with Rights Management (RMS) encrypt documents so unauthorized Copilot queries cannot ground on confidential data.',
    microsoftControl: 'Microsoft Purview Information Protection (MPIP) + Auto-Labeling Policies',
    remediationTip: 'Deploy auto-labeling policies across SharePoint and OneDrive; block AI grounding on unclassified documents.',
  },
  'GenAI DLP Policies': {
    category: 'Data Loss Prevention',
    meaning: 'Inspects real-time employee prompts and AI generated responses for sensitive info types (PII, SSNs, credit cards, proprietary code) and blocks data exfiltration.',
    microsoftControl: 'Microsoft Purview DLP for Generative AI & Copilot Studio',
    remediationTip: 'Enable "Block user prompt and assistant response" rules for High and Very High confidence SITs.',
  },
  'Content Guardrails': {
    category: 'AI Safety & Defense',
    meaning: 'Protects the foundation model against adversarial attacks including direct/indirect prompt injection, jailbreaks, toxic discourse, and ungrounded hallucinations.',
    microsoftControl: 'Azure AI Content Safety + Copilot Studio Prompt Shields & Groundedness Checks',
    remediationTip: 'Enforce strict input/output prompt shields with Groundedness API threshold >= 0.7.',
  },
  'Agent Telemetry & Logs': {
    category: 'Auditing & Observability',
    meaning: 'Captures full tamper-evident audit trails of every prompt, LLM reasoning chain, tool execution, and third-party connector call for forensics and compliance discovery.',
    microsoftControl: 'Microsoft Purview Audit (Premium) + Dataverse ConversationTranscript Logging',
    remediationTip: 'Enable 1-year retention on Purview Audit events and turn on Dataverse transcript logging for all environments.',
  },
  'Zero Trust & PIM': {
    category: 'Identity & Access Control',
    meaning: 'Eliminates permanent standing admin privileges. Enforces Just-in-Time (JIT) role elevation, phishing-resistant MFA, and Managed Identity authentication for agent connectors.',
    microsoftControl: 'Microsoft Entra ID Privileged Identity Management (PIM) + Conditional Access',
    remediationTip: 'Require Entra PIM approvals for Power Platform / Copilot Studio admins and eliminate static API keys.',
  },
  'SharePoint Access (SAM)': {
    category: 'Data Access Governance',
    meaning: 'Stops "accidental oversharing" where Copilot surfaces sensitive internal documents that were improperly shared with "Everyone except external users".',
    microsoftControl: 'SharePoint Advanced Management (SAM) + Restricted SharePoint Search',
    remediationTip: 'Run SAM data access governance reports and restrict tenant-wide search indexing to curated sites.',
  }
};

export const RadarPostureChart: React.FC<RadarProps> = ({
  dimensions,
  width = 380,
  height = 300,
}) => {
  // Lowest maturity area starts as default active dimension so user immediately gets value
  const lowestDimIndex = dimensions.reduce((lowestIdx, curr, idx, arr) => 
    curr.current < arr[lowestIdx].current ? idx : lowestIdx, 0
  );

  const [selectedDimIndex, setSelectedDimIndex] = useState<number | null>(lowestDimIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedDimIndex;
  const activeDim = activeIndex !== null ? dimensions[activeIndex] : null;
  const activeMeta = activeDim ? DIMENSION_METADATA[activeDim.name] : null;

  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = (size / 2) - 46;

  const totalPoints = dimensions.length;
  const angleStep = (Math.PI * 2) / totalPoints;

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to convert polar to cartesian
  const getCoordinates = (valueRatio: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = centerX + radius * valueRatio * Math.cos(angle);
    const y = centerY + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Generate path string for an array of ratios (0 to 1)
  const generatePolygonPath = (ratios: number[]) => {
    return ratios
      .map((r, i) => {
        const { x, y } = getCoordinates(r, i);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .concat('Z')
      .join(' ');
  };

  const currentRatios = dimensions.map((d) => d.current / 100);
  const targetRatios = dimensions.map((d) => d.target / 100);
  const benchmarkRatios = dimensions.map((d) => d.benchmark / 100);

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Interactive Dimension Quick Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2 w-full max-w-md">
        {dimensions.map((dim, idx) => {
          const isSelected = activeIndex === idx;
          const isCritical = dim.current < 50;
          return (
            <button
              key={dim.name}
              type="button"
              onClick={() => setSelectedDimIndex(selectedDimIndex === idx ? null : idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                  : isCritical
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:border-rose-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <span>{dim.name.split(' ')[0]}</span>
              <span className={`px-1 py-0.2 rounded text-[9px] font-mono ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : isCritical 
                  ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
              }`}>
                {dim.current}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main SVG Radar Spider Chart */}
      <div className="relative py-1 w-full flex justify-center overflow-hidden">
        <svg 
          viewBox={`-35 -25 ${width + 70} ${height + 50}`} 
          className="w-full max-w-[360px] h-auto overflow-visible select-none"
        >
          {/* Concentric Grid Polygons with Light & Dark theme support */}
          {levels.map((level, i) => {
            const gridRatios = new Array(totalPoints).fill(level);
            const gridPath = generatePolygonPath(gridRatios);
            return (
              <g key={i}>
                <path
                  d={gridPath}
                  className={`transition-colors duration-200 ${
                    i % 2 === 0
                      ? 'fill-slate-100/60 dark:fill-slate-800/40 stroke-slate-300 dark:stroke-slate-700'
                      : 'fill-slate-50/70 dark:fill-slate-900/60 stroke-slate-300 dark:stroke-slate-700'
                  }`}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={centerX + 4}
                  y={centerY - radius * level - 2}
                  className="fill-slate-500 dark:fill-slate-400 text-[9px] font-mono font-semibold"
                >
                  {Math.round(level * 100)}%
                </text>
              </g>
            );
          })}

          {/* Radial Axis Lines */}
          {dimensions.map((dim, i) => {
            const { x, y } = getCoordinates(1.0, i);
            const isAxisActive = activeIndex === i;
            return (
              <line
                key={`line-${dim.name}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                className={`transition-all duration-200 ${
                  isAxisActive 
                    ? 'stroke-blue-500 dark:stroke-cyan-400 stroke-2' 
                    : 'stroke-slate-300 dark:stroke-slate-700 stroke-1'
                }`}
              />
            );
          })}

          {/* Benchmark Area (Industry Avg) */}
          <path
            d={generatePolygonPath(benchmarkRatios)}
            className="fill-slate-400/15 stroke-slate-400 dark:stroke-slate-500"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Target Area (Recommended Target 85-95%) */}
          <path
            d={generatePolygonPath(targetRatios)}
            className="fill-emerald-500/10 stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth="1.8"
          />

          {/* Current Posture Area */}
          <path
            d={generatePolygonPath(currentRatios)}
            className="fill-blue-600/35 dark:fill-blue-500/30 stroke-blue-600 dark:stroke-cyan-400 transition-all duration-500 ease-out"
            strokeWidth="2.5"
          />

          {/* Active Highlight Ray/Sector if dimension is active */}
          {activeIndex !== null && (
            <g>
              {(() => {
                const { x, y } = getCoordinates(dimensions[activeIndex].current / 100, activeIndex);
                return (
                  <circle
                    cx={x}
                    cy={y}
                    r="9"
                    className="fill-blue-500/30 stroke-blue-500 animate-ping"
                  />
                );
              })()}
            </g>
          )}

          {/* Data Points on Current Posture */}
          {dimensions.map((dim, i) => {
            const { x, y } = getCoordinates(dim.current / 100, i);
            const isPointActive = activeIndex === i;
            return (
              <g 
                key={`point-${i}`} 
                className="cursor-pointer"
                onClick={() => setSelectedDimIndex(selectedDimIndex === i ? null : i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isPointActive ? 6.5 : 4.5}
                  className={`transition-all duration-200 ${
                    isPointActive
                      ? 'fill-cyan-400 stroke-blue-700 stroke-2'
                      : 'fill-blue-600 stroke-white dark:stroke-slate-900 stroke-2'
                  }`}
                />
              </g>
            );
          })}

          {/* Category Outer Text Labels (HIGH CONTRAST IN BOTH LIGHT & DARK) */}
          {dimensions.map((dim, i) => {
            const labelCoord = getCoordinates(1.23, i);
            const isLabelActive = activeIndex === i;
            return (
              <g 
                key={`label-${dim.name}`}
                className="cursor-pointer"
                onClick={() => setSelectedDimIndex(selectedDimIndex === i ? null : i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[10px] sm:text-[11px] font-bold tracking-tight transition-all select-none ${
                    isLabelActive
                      ? 'fill-blue-600 dark:fill-cyan-300 font-extrabold underline'
                      : 'fill-slate-900 dark:fill-slate-100 hover:fill-blue-600 dark:hover:fill-cyan-400'
                  }`}
                >
                  {dim.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-700 dark:text-slate-300 mt-1 mb-2 font-medium">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-300 dark:ring-blue-900" />
          <span>Current Posture</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-1 bg-emerald-500 rounded" />
          <span>Target Baseline (85%+)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-0.5 border-t border-dashed border-slate-500" />
          <span>Industry Average</span>
        </div>
      </div>

      {/* Interactive Dimension Deep-Dive Callout Box (Explains What It Actually Means) */}
      {activeDim && activeMeta && (
        <div className="w-full mt-2 bg-blue-50/90 dark:bg-slate-950/90 border border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 shadow-sm text-left animate-in fade-in duration-200 space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-blue-200/80 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-blue-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400 block">
                  {activeMeta.category} Dimension Explained
                </span>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {activeDim.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                activeDim.current >= 80
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : activeDim.current >= 50
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              }`}>
                Current: {activeDim.current}% (Target: {activeDim.target}%)
              </span>
            </div>
          </div>

          {/* Meaning Description */}
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-semibold">What This Means: </strong>
            {activeMeta.meaning}
          </p>

          {/* Key Microsoft Security Control & Remediation Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-white/80 dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-blue-700 dark:text-cyan-400 font-bold block mb-0.5">
                Key Microsoft Control:
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {activeMeta.microsoftControl}
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold block mb-0.5">
                Immediate Action:
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {activeMeta.remediationTip}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

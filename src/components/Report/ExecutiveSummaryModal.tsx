import React from 'react';
import { BusinessProfile, RedFlag, DimensionScore } from '../../types';
import { COMPLIANCE_FRAMEWORKS } from '../../data/governanceData';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Calendar,
  Building,
  Scale
} from 'lucide-react';

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  redFlags: RedFlag[];
  postureScore: number;
  dimensions: DimensionScore[];
}

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({
  isOpen,
  onClose,
  profile,
  redFlags,
  postureScore,
  dimensions,
}) => {
  if (!isOpen) return null;

  const criticalFlags = redFlags.filter((f) => f.severity === 'critical');
  const highFlags = redFlags.filter((f) => f.severity === 'high');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Executive CISO Brief: Microsoft AI Security & Compliance Posture
              </h3>
              <p className="text-xs text-slate-400">
                Generated for {profile.orgName} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-6 sm:p-8 space-y-8 print:p-0 print:text-black">
          {/* Executive Overview Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs uppercase font-mono font-bold text-blue-400">
                Confidential Enterprise Security Brief
              </div>
              <h4 className="text-xl font-extrabold text-white">
                {profile.orgName}
              </h4>
              <p className="text-xs text-slate-300">
                Industry: <span className="capitalize font-semibold text-white">{profile.industry}</span> • 
                Enterprise Scope: <span className="font-semibold text-white">{profile.employeeCount.toLocaleString()} Users</span> • 
                Adoption Phase: <span className="capitalize font-semibold text-white">{profile.stage}</span>
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900 px-4 py-3 rounded-xl border border-slate-700 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Current Posture</div>
                <div className={`text-2xl font-black ${postureScore >= 80 ? 'text-emerald-400' : postureScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {postureScore} / 100
                </div>
              </div>
              <div className={`w-3 h-10 rounded-full ${postureScore >= 80 ? 'bg-emerald-500' : postureScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
            </div>
          </div>

          {/* Key Findings & Critical Red Flags */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Critical Security Findings Requiring Board-Level Prioritization</span>
            </h5>

            {criticalFlags.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800 text-xs text-emerald-300">
                No critical red flags currently detected. Baseline controls are actively enforced.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {criticalFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-3.5 rounded-lg bg-slate-950 border border-rose-900/60 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white">
                          CRITICAL
                        </span>
                        <span className="text-xs font-bold text-white">{flag.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">{flag.description}</p>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        Remediation: {flag.mitigationBlueprint.solutionName} ({flag.mitigationBlueprint.microsoftTech.join(', ')})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Governance Dimensions Scores */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Governance Maturity by Security Dimension</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dimensions.map((dim) => (
                <div key={dim.name} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">{dim.name}</span>
                    <span className="font-mono text-blue-400 font-bold">{dim.current}% / Target: {dim.target}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        dim.current >= 80 ? 'bg-emerald-500' : dim.current >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${dim.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Compliance Alignment Matrix */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Regulatory Alignment & Framework Readiness</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPLIANCE_FRAMEWORKS.map((fw) => (
                <div key={fw.name} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{fw.name}</div>
                      <div className="text-[10px] text-slate-400">{fw.fullName}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                      {fw.coverage}% Aligned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 90-Day Implementation Roadmap */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Recommended 90-Day Remediation & Hardening Roadmap</span>
            </h5>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-blue-900 text-blue-300 shrink-0">
                  Days 1-30
                </span>
                <div>
                  <h6 className="text-xs font-bold text-white">SharePoint Quarantine & Identity Hardening</h6>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deploy SharePoint Advanced Management (SAM) Restricted Site Access on C-suite, HR, and M&A sites. Enforce Entra ID Conditional Access requiring compliant devices and FIDO2 MFA for Copilot access.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-indigo-900 text-indigo-300 shrink-0">
                  Days 31-60
                </span>
                <div>
                  <h6 className="text-xs font-bold text-white">Purview Sensitivity Labels & GenAI DLP Rollout</h6>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Activate 4-tier Purview label taxonomy with automated Copilot inheritance and Rights Management (RMS) encryption. Deploy Purview DLP policies blocking credentials and PII in prompts.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-emerald-900 text-emerald-300 shrink-0">
                  Days 61-90
                </span>
                <div>
                  <h6 className="text-xs font-bold text-white">Copilot Studio ALM & Sentinel Telemetry Stream</h6>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enforce Power Platform DLP connector rules blocking unapproved HTTP endpoints. Stream `CopilotInteractions` Unified Audit Log and Dataverse conversation transcripts into Microsoft Sentinel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>AegisAI Enterprise Microsoft AI Security Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

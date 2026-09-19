import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Download, 
  Building2, 
  Sliders, 
  BookOpen, 
  Sun, 
  Moon,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Linkedin,
  Globe,
  Zap
} from 'lucide-react';
import { BusinessProfile, BusinessScenario } from '../types';
import { AegisLogo } from './Common/AegisLogo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: BusinessProfile;
  setProfileByPreset: (presetKey: string) => void;
  score: number;
  criticalCount: number;
  onOpenReport: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSwitchScenario?: () => void;
  activeScenarioName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  setProfileByPreset,
  score,
  criticalCount,
  onOpenReport,
  theme,
  onToggleTheme,
  onSwitchScenario,
  activeScenarioName,
}) => {
  const getScoreBadge = () => {
    if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
    if (score >= 50) return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 animate-pulse-slow';
  };

  const navItems = [
    { id: 'dashboard', label: '1. Risk Assessment & Heatmap', shortLabel: '1. Risk & Heatmap', icon: Sliders, badge: criticalCount > 0 ? `${criticalCount} alert` : null },
    { id: 'topology', label: '2. Security Topology & Architecture', shortLabel: '2. Security Topology', icon: Building2 },
    { id: 'simulation', label: '3. Threat Simulator & Sandbox', shortLabel: '3. Threat Simulator', icon: Zap },
    { id: 'blueprint', label: '4. Zero Trust Governance Blueprint', shortLabel: '4. Governance Blueprint', icon: Shield },
    { id: 'playbook', label: '5. Policy Scripts & Playbooks', shortLabel: '5. Policy Playbooks', icon: FileText },
    { id: 'docs', label: '6. Official Microsoft Docs Hub', shortLabel: '6. Official MS Docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-md transition-colors duration-200">
      {/* Tier 1: Top Brand & Action Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Brand with AegisLogo */}
          <div className="flex items-center space-x-3 shrink-0">
            <AegisLogo size="sm" showSubtitle={true} />
          </div>

          {/* Right Action Controls: Profile, Score, Theme, Export + Attribution */}
          <div className="flex flex-col items-end shrink-0 py-1">
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Enterprise Profile Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-xs shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden sm:inline">Profile:</span>
                <select
                  aria-label="Select enterprise profile"
                  value={profile.industry}
                  onChange={(e) => setProfileByPreset(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[160px] md:max-w-[190px] text-xs truncate"
                >
                  <optgroup label="Financial Services & Banking" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option value="finance" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Finance (Tier 1 Bank)</option>
                    <option value="banking-retail" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Banking & Wealth</option>
                  </optgroup>
                  <optgroup label="Healthcare & Life Sciences" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option value="healthcare" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Healthcare (Hospital)</option>
                    <option value="pharma-lifesciences" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Pharma & Life Sciences</option>
                  </optgroup>
                  <optgroup label="Technology & Cyber Defense" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option value="technology" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tech & Cloud SaaS</option>
                    <option value="cybersecurity-mssp" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cyber MSSP & SOC</option>
                  </optgroup>
                  <optgroup label="Government & Public Sector" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option value="government-federal" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Federal Gov & Defense</option>
                    <option value="government-state" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">State & Local Gov</option>
                  </optgroup>
                  <optgroup label="Industry & Regulated Sectors" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option value="legal-lawfirm" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Legal & Law Firm</option>
                    <option value="manufacturing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Manufacturing</option>
                    <option value="retail-ecommerce" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Retail & E-Commerce</option>
                    <option value="energy-utilities" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Energy & Utilities</option>
                    <option value="higher-education" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Higher Education</option>
                    <option value="telecom-media" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Telecom & Media</option>
                  </optgroup>
                </select>
              </div>

              {/* Score Pill */}
              <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold shrink-0 shadow-sm ${getScoreBadge()}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                <span>{score}/100</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shrink-0 shadow-sm"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {/* Export CISO Report CTA */}
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95 shrink-0 cursor-pointer"
                title="Open CISO Executive Report"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">CISO Brief</span>
              </button>
            </div>

            {/* Built by Sapan Patel + LinkedIn + Portfolio */}
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium select-none">
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
      </div>

      {/* Tier 2: Dedicated Primary Navigation Tab Strip (Zero Collision Guarantee) */}
      <nav aria-label="Portal Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1.5 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{item.label}</span>
                <span className="inline md:hidden">{item.shortLabel}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    isActive ? 'bg-rose-500 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

import React, { useState } from 'react';
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
  Zap,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleMobileNavSelect = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-md transition-colors duration-200">
      {/* Tier 1: Top Brand & Action Controls Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Brand with AegisLogo */}
          <div className="flex items-center space-x-2 shrink-0 min-w-0">
            <AegisLogo size="sm" showSubtitle={true} />
          </div>

          {/* Desktop Right Action Controls (>= sm) */}
          <div className="hidden sm:flex flex-col items-end shrink-0 py-1">
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Enterprise Profile Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-xs shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden md:inline">Profile:</span>
                <select
                  aria-label="Select enterprise profile"
                  value={profile.industry}
                  onChange={(e) => setProfileByPreset(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer max-w-[140px] md:max-w-[190px] text-xs truncate"
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

          {/* Mobile Right Action Controls (< sm) */}
          <div className="flex sm:hidden items-center space-x-1.5 shrink-0">
            {/* Mobile Score Pill */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-[11px] font-bold ${getScoreBadge()}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              <span>{score}%</span>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-800/80 transition-all cursor-pointer shadow-sm"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Header Attribution & Social Strip (< sm) */}
      <div className="sm:hidden px-3.5 py-1 bg-slate-50/95 dark:bg-slate-950/95 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <span>Architected by</span>
          <a
            href="https://sapanpatel1230.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
          >
            Sapan Patel
          </a>
        </div>
        <div className="flex items-center space-x-2 text-[10.5px]">
          <a
            href="https://www.linkedin.com/in/sapan-patel-807321222/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center space-x-0.5 font-semibold"
            title="Sapan Patel LinkedIn"
          >
            <Linkedin className="w-3 h-3" />
            <span>LinkedIn</span>
          </a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a
            href="https://sapanpatel1230.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center space-x-0.5 font-semibold"
            title="Sapan Patel Portfolio"
          >
            <Globe className="w-3 h-3" />
            <span>Portfolio</span>
          </a>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Over Menu (< sm) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[85px] bottom-0 z-50 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-2xl space-y-4 max-h-[calc(100vh-90px)] overflow-y-auto">
            {/* Active Scenario Card & Switch Action */}
            {activeScenarioName && (
              <div className="bg-blue-50/80 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400">
                  Current Assessment
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {activeScenarioName}
                </div>
                {onSwitchScenario && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onSwitchScenario();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                    <span>Switch Business Scenario</span>
                  </button>
                )}
              </div>
            )}

            {/* Profile Preset Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Industry Profile Preset:
              </label>
              <select
                aria-label="Select enterprise profile"
                value={profile.industry}
                onChange={(e) => {
                  setProfileByPreset(e.target.value);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs p-2.5 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="finance">Finance (Tier 1 Bank)</option>
                <option value="banking-retail">Banking & Wealth</option>
                <option value="healthcare">Healthcare (Hospital)</option>
                <option value="pharma-lifesciences">Pharma & Life Sciences</option>
                <option value="technology">Tech & Cloud SaaS</option>
                <option value="cybersecurity-mssp">Cyber MSSP & SOC</option>
                <option value="government-federal">Federal Gov & Defense</option>
                <option value="government-state">State & Local Gov</option>
                <option value="legal-lawfirm">Legal & Law Firm</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail-ecommerce">Retail & E-Commerce</option>
                <option value="energy-utilities">Energy & Utilities</option>
                <option value="higher-education">Higher Education</option>
                <option value="telecom-media">Telecom & Media</option>
              </select>
            </div>

            {/* CISO Executive Brief CTA Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenReport();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Open CISO Executive Report</span>
            </button>

            {/* Quick Section Navigation List */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Jump to Section
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleMobileNavSelect(item.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md font-bold'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-rose-600 text-white shrink-0 ml-1">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Author Info & Links */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-center text-xs">
              <div className="text-slate-600 dark:text-slate-400 font-medium">
                Built by <strong className="text-slate-900 dark:text-white font-bold">Sapan Patel</strong>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <a
                  href="https://sapanpatel1230.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/sapan-patel-807321222/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tier 2: Dedicated Primary Navigation Tab Strip (Zero Collision Guarantee) */}
      <nav aria-label="Portal Navigation" className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1.5 sm:space-x-2 py-2 overflow-x-auto scrollbar-none touch-pan-x overscroll-contain">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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

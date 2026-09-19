import React from 'react';

interface AegisLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const AegisLogo: React.FC<AegisLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center space-x-3 select-none">
      {/* Precision Microsoft Security Shield SVG Icon */}
      <div className={`relative ${iconSize} rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-[1.5px] shadow-glow flex items-center justify-center shrink-0`}>
        <div className="w-full h-full rounded-[10px] bg-slate-950 dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
          {/* Subtle grid background inside logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-cyan-500/20" />
          
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-cyan-400 relative z-10 filter drop-shadow"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Security Shield */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#aegisGrad)" fillOpacity="0.3" />
            {/* Internal Circuit / Lock Core */}
            <path d="M12 8v4" stroke="#00f2fe" strokeWidth="2" />
            <circle cx="12" cy="15" r="1.5" fill="#00f2fe" stroke="none" />
            <path d="M9 11.5l3-3.5 3 3.5" stroke="#38bdf8" strokeWidth="1.5" />
            <defs>
              <linearGradient id="aegisGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0078D4" />
                <stop offset="1" stopColor="#00F2FE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className={`font-black ${titleSize} tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap`}>
            Aegis<span className="text-blue-600 dark:text-cyan-400">AI</span>
          </span>
          <span className="hidden min-[420px]:inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-700/50 uppercase tracking-widest whitespace-nowrap">
            MS AI Security
          </span>
        </div>
        {showSubtitle && (
          <span className="hidden sm:inline-block text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
            Microsoft Purview • Content Safety • Zero Trust RBAC
          </span>
        )}
      </div>
    </div>
  );
};

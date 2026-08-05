import { Dna } from 'lucide-react';

export default function Logo({ size = 'md', collapsed = false, className = '' }) {
  const iconSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${iconSizes[size]} rounded-2xl bg-gradient-to-br from-primary-500 via-accent-500 to-primary-700 flex items-center justify-center shadow-lg shadow-accent-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
        <Dna className="w-5 h-5 text-white animate-pulse-soft" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-black tracking-tight bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 bg-clip-text text-transparent`}>
            MediCore
          </span>
          <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest -mt-1">
            DNA & Health Tech
          </span>
        </div>
      )}
    </div>
  );
}

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'increase', icon: Icon, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: { bg: 'bg-primary-500/10 dark:bg-primary-500/20 border-primary-500/30', icon: 'text-primary-500', bar: 'border-t-primary-500', glow: 'shadow-primary-500/10' },
    accent: { bg: 'bg-accent-500/10 dark:bg-accent-500/20 border-accent-500/30', icon: 'text-accent-500', bar: 'border-t-accent-500', glow: 'shadow-accent-500/10' },
    warning: { bg: 'bg-warning-500/10 dark:bg-warning-500/20 border-warning-500/30', icon: 'text-warning-500', bar: 'border-t-warning-500', glow: 'shadow-warning-500/10' },
    danger: { bg: 'bg-danger-500/10 dark:bg-danger-500/20 border-danger-500/30', icon: 'text-danger-500', bar: 'border-t-danger-500', glow: 'shadow-danger-500/10' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className={`stat-card border-t-4 ${colors.bar} ${colors.glow} animate-slide-up relative group`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{title}</p>
          <p className="text-3xl font-extrabold text-surface-900 dark:text-surface-50 tracking-tight group-hover:scale-[1.02] transition-transform duration-200 origin-left">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${changeType === 'increase' ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'bg-danger-500/10 text-danger-600 dark:text-danger-400'}`}>
                {changeType === 'increase' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {change}
              </span>
              <span className="text-xs text-surface-400 dark:text-surface-500">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${colors.bg} border p-3.5 rounded-2xl shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}

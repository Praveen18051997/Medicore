import { Loader2 } from 'lucide-react';

export function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
      <p className="text-sm text-surface-500">{message}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title = 'No data found', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-surface-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 animate-pulse-soft">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 bg-surface-200 dark:bg-surface-700 rounded-lg" />
          <div className="h-8 w-20 bg-surface-200 dark:bg-surface-700 rounded-lg" />
          <div className="h-3 w-32 bg-surface-200 dark:bg-surface-700 rounded-lg" />
        </div>
        <div className="w-12 h-12 bg-surface-200 dark:bg-surface-700 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="glass-card overflow-hidden animate-pulse-soft">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="h-9 w-64 bg-surface-200 dark:bg-surface-700 rounded-xl" />
      </div>
      <div className="divide-y divide-surface-100 dark:divide-surface-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={`h-4 bg-surface-200 dark:bg-surface-700 rounded ${c === 0 ? 'w-20' : 'w-24'} flex-shrink-0`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

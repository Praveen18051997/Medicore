import { getInitials } from '../../utils/helpers';

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img src={src} alt={name} className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-surface-700 ${className}`} />
    );
  }

  const colors = [
    'bg-primary-500', 'bg-accent-500', 'bg-warning-500', 'bg-danger-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-surface-700 ${className}`}>
      {getInitials(name)}
    </div>
  );
}

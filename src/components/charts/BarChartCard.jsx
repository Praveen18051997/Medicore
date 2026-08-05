import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

export default function BarChartCard({ data, dataKey, xKey = 'name', title, color = '#06b6d4', height = 300 }) {
  const { isDark } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-3 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="glass-card p-6 animate-slide-up w-full max-w-full overflow-hidden">
      {title && <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

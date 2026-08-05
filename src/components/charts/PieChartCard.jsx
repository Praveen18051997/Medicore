import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#f83b3b', '#8b5cf6', '#ec4899', '#34d399', '#22d3ee'];

export default function PieChartCard({ data, dataKey = 'value', nameKey = 'name', title, height = 300 }) {
  const { isDark } = useTheme();

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-3 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-500 mb-1">{payload[0].name}</p>
        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{payload[0].value}</p>
      </div>
    );
  };

  const renderLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-surface-600 dark:text-surface-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="glass-card p-6 animate-slide-up w-full max-w-full overflow-hidden">
      {title && <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} strokeWidth={0}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

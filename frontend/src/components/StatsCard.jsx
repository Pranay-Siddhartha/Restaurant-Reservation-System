import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    trend: 'text-indigo-600',
  },
  green: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    trend: 'text-emerald-400',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    trend: 'text-red-400',
  },
  blue: {
    bg: 'bg-gray-50',
    text: 'text-gray-400',
    icon: 'text-gray-400',
    trend: 'text-gray-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    trend: 'text-amber-400',
  },
};

export default function StatsCard({ title, value, icon: Icon, trend, color = 'indigo' }) {
  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass p-6 hover:shadow-glass-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && trend !== null && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <HiArrowUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <HiArrowDown className="w-4 h-4 text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}

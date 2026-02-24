import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, changeType = 'up', icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue:   'bg-brand-500/10 text-brand-400',
    green:  'bg-emerald-500/10 text-emerald-400',
    yellow: 'bg-amber-500/10 text-amber-400',
    red:    'bg-red-500/10 text-red-400',
  }

  return (
    <div className="card hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-medium ${
            changeType === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {changeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white font-mono">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  )
}
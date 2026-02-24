import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Table from '../components/ui/Table'
import { analyticsData } from '../data/mockData'

const pageColumns = [
  { key: 'page',   label: 'Page',     render: (v) => <span className="font-mono text-xs text-brand-400">{v}</span> },
  { key: 'views',  label: 'Views',    render: (v) => <span className="font-mono text-white">{v.toLocaleString()}</span> },
  { key: 'bounce', label: 'Bounce Rate' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value.toLocaleString()} visitors</p>
      </div>
    )
  }
  return null
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Site performance this week</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors chart */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Daily Visitors</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.visitors} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#1a8af7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-white">Weekly Summary</h3>
          {[
            { label: 'Total Visitors',    value: '13,700', pct: 78 },
            { label: 'Page Views',        value: '42,300', pct: 91 },
            { label: 'Avg. Session Time', value: '3m 42s',  pct: 55 },
            { label: 'Conversion Rate',   value: '4.2%',    pct: 42 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white font-mono font-semibold">{item.value}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full">
                <div
                  className="h-1.5 bg-brand-500 rounded-full transition-all"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">Top Pages</h3>
        <Table columns={pageColumns} data={analyticsData.topPages} />
      </div>
    </div>
  )
}
import { useState } from 'react'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { ordersData } from '../data/mockData'

const columns = [
  { key: 'id',       label: 'Order ID',  render: (v) => <span className="font-mono text-xs text-brand-400">{v}</span> },
  { key: 'customer', label: 'Customer',  render: (v) => <span className="text-white">{v}</span> },
  { key: 'product',  label: 'Product' },
  { key: 'amount',   label: 'Amount',    render: (v) => <span className="font-mono font-semibold text-white">{v}</span> },
  {
    key: 'status', label: 'Status',
    render: (v) => (
      <Badge variant={v === 'Completed' ? 'success' : v === 'Pending' ? 'warning' : 'danger'}>
        {v}
      </Badge>
    )
  },
  { key: 'date', label: 'Date', render: (v) => <span className="text-gray-500 text-xs">{v}</span> },
]

const statusOptions = ['All', 'Completed', 'Pending', 'Failed']

export default function Orders() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? ordersData : ordersData.filter((o) => o.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">{ordersData.length} total orders</p>
        </div>
        <button className="btn-primary">Export CSV</button>
      </div>

      <div className="card">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-gray-800/50 rounded-lg p-1 w-fit">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === s
                  ? 'bg-gray-700 text-white shadow'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Table columns={columns} data={filtered} />
      </div>
    </div>
  )
}
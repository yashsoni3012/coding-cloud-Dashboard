import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import StatCard from '../components/ui/Statcard'
import RevenueChart from '../components/charts/RevenueChart'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { revenueData, ordersData } from '../data/mockData'

const stats = [
  { title: 'Total Revenue',  value: '$103,290', change: '+12.5%', icon: DollarSign,   color: 'blue'   },
  { title: 'Total Users',    value: '8,492',    change: '+8.2%',  icon: Users,         color: 'green'  },
  { title: 'Orders',         value: '1,283',    change: '+4.6%',  icon: ShoppingCart,  color: 'yellow' },
  { title: 'Growth Rate',    value: '24.8%',    change: '+2.1%',  icon: TrendingUp,    color: 'blue'   },
]

const recentOrderCols = [
  { key: 'id',       label: 'Order ID',  render: (v) => <span className="font-mono text-xs text-brand-400">{v}</span> },
  { key: 'customer', label: 'Customer' },
  { key: 'amount',   label: 'Amount',   render: (v) => <span className="font-mono font-semibold text-white">{v}</span> },
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Revenue Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">Monthly revenue for 2024</p>
          </div>
          <select className="input text-xs">
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
        <RevenueChart data={revenueData} />
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest 6 transactions</p>
          </div>
          <a href="/orders" className="btn-secondary text-xs">View All</a>
        </div>
        <Table columns={recentOrderCols} data={ordersData.slice(0, 5)} />
      </div>
    </div>
  )
}
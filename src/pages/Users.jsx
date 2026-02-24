import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { usersData } from '../data/mockData'

const columns = [
  {
    key: 'name', label: 'User',
    render: (v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
          {v.charAt(0)}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{v}</p>
          <p className="text-gray-500 text-xs">{row.email}</p>
        </div>
      </div>
    )
  },
  { key: 'role', label: 'Role', render: (v) => <Badge variant="info">{v}</Badge> },
  {
    key: 'status', label: 'Status',
    render: (v) => <Badge variant={v === 'Active' ? 'success' : 'default'}>{v}</Badge>
  },
  { key: 'joined', label: 'Joined', render: (v) => <span className="text-gray-500 text-xs">{v}</span> },
  {
    key: 'id', label: 'Actions',
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Edit</button>
        <span className="text-gray-700">|</span>
        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
      </div>
    )
  },
]

export default function Users() {
  const [search, setSearch] = useState('')

  const filtered = usersData.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="text-sm text-gray-500 mt-0.5">{usersData.length} total users</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={15} />
          Add User
        </button>
      </div>

      {/* Table card */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 w-full text-xs"
            />
          </div>
          <select className="input text-xs">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </div>
        <Table columns={columns} data={filtered} />
      </div>
    </div>
  )
}
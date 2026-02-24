export const revenueData = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 41000 },
  { month: 'Mar', revenue: 38000 },
  { month: 'Apr', revenue: 52000 },
  { month: 'May', revenue: 61000 },
  { month: 'Jun', revenue: 55000 },
  { month: 'Jul', revenue: 70000 },
  { month: 'Aug', revenue: 68000 },
  { month: 'Sep', revenue: 82000 },
  { month: 'Oct', revenue: 79000 },
  { month: 'Nov', revenue: 91000 },
  { month: 'Dec', revenue: 103000 },
]

export const usersData = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@example.com',  role: 'Admin',  status: 'Active',   joined: 'Jan 12, 2024' },
  { id: 2, name: 'Rahul Mehta',   email: 'rahul@example.com',   role: 'Editor', status: 'Active',   joined: 'Feb 3, 2024'  },
  { id: 3, name: 'Anita Patel',   email: 'anita@example.com',   role: 'Viewer', status: 'Inactive', joined: 'Mar 19, 2024' },
  { id: 4, name: 'Karan Verma',   email: 'karan@example.com',   role: 'Editor', status: 'Active',   joined: 'Apr 7, 2024'  },
  { id: 5, name: 'Sunita Joshi',  email: 'sunita@example.com',  role: 'Viewer', status: 'Active',   joined: 'Apr 22, 2024' },
  { id: 6, name: 'Dev Kapoor',    email: 'dev@example.com',     role: 'Admin',  status: 'Active',   joined: 'May 1, 2024'  },
]

export const ordersData = [
  { id: '#ORD-001', customer: 'Priya Sharma',  product: 'Pro Plan',    amount: '$299', status: 'Completed', date: 'Dec 1, 2024'  },
  { id: '#ORD-002', customer: 'Rahul Mehta',   product: 'Starter Plan', amount: '$99',  status: 'Pending',   date: 'Dec 2, 2024'  },
  { id: '#ORD-003', customer: 'Anita Patel',   product: 'Pro Plan',    amount: '$299', status: 'Failed',    date: 'Dec 3, 2024'  },
  { id: '#ORD-004', customer: 'Karan Verma',   product: 'Enterprise',  amount: '$999', status: 'Completed', date: 'Dec 4, 2024'  },
  { id: '#ORD-005', customer: 'Sunita Joshi',  product: 'Pro Plan',    amount: '$299', status: 'Completed', date: 'Dec 5, 2024'  },
  { id: '#ORD-006', customer: 'Dev Kapoor',    product: 'Starter Plan', amount: '$99',  status: 'Pending',   date: 'Dec 6, 2024'  },
]

export const analyticsData = {
  visitors: [
    { day: 'Mon', count: 1200 },
    { day: 'Tue', count: 1900 },
    { day: 'Wed', count: 1500 },
    { day: 'Thu', count: 2200 },
    { day: 'Fri', count: 2800 },
    { day: 'Sat', count: 1700 },
    { day: 'Sun', count: 1100 },
  ],
  topPages: [
    { page: '/dashboard', views: 8200, bounce: '24%' },
    { page: '/products',  views: 5400, bounce: '31%' },
    { page: '/pricing',   views: 4100, bounce: '18%' },
    { page: '/blog',      views: 3300, bounce: '42%' },
    { page: '/contact',   views: 1900, bounce: '55%' },
  ],
}
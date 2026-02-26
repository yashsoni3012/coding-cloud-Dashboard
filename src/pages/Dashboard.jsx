// import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
// import StatCard from '../components/ui/Statcard'
// import RevenueChart from '../components/charts/RevenueChart'
// import Table from '../components/ui/Table'
// import Badge from '../components/ui/Badge'
// import { revenueData, ordersData } from '../data/mockData'

// const stats = [
//   { title: 'Total Revenue',  value: '$103,290', change: '+12.5%', icon: DollarSign,   color: 'blue'   },
//   { title: 'Total Users',    value: '8,492',    change: '+8.2%',  icon: Users,         color: 'green'  },
//   { title: 'Orders',         value: '1,283',    change: '+4.6%',  icon: ShoppingCart,  color: 'yellow' },
//   { title: 'Growth Rate',    value: '24.8%',    change: '+2.1%',  icon: TrendingUp,    color: 'blue'   },
// ]

// const recentOrderCols = [
//   { key: 'id',       label: 'Order ID',  render: (v) => <span className="font-mono text-xs text-brand-400">{v}</span> },
//   { key: 'customer', label: 'Customer' },
//   { key: 'amount',   label: 'Amount',   render: (v) => <span className="font-mono font-semibold text-white">{v}</span> },
//   {
//     key: 'status', label: 'Status',
//     render: (v) => (
//       <Badge variant={v === 'Completed' ? 'success' : v === 'Pending' ? 'warning' : 'danger'}>
//         {v}
//       </Badge>
//     )
//   },
//   { key: 'date', label: 'Date', render: (v) => <span className="text-gray-500 text-xs">{v}</span> },
// ]

// export default function Dashboard() {
//   return (
//     <div className="space-y-6">
//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((s) => (
//           <StatCard key={s.title} {...s} />
//         ))}
//       </div>

//       {/* Revenue Chart */}
//       <div className="card">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-base font-semibold text-white">Revenue Overview</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Monthly revenue for 2024</p>
//           </div>
//           <select className="input text-xs">
//             <option>2024</option>
//             <option>2023</option>
//           </select>
//         </div>
//         <RevenueChart data={revenueData} />
//       </div>

//       {/* Recent Orders */}
//       <div className="card">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-base font-semibold text-white">Recent Orders</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Latest 6 transactions</p>
//           </div>
//           <a href="/orders" className="btn-secondary text-xs">View All</a>
//         </div>
//         <Table columns={recentOrderCols} data={ordersData.slice(0, 5)} />
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  BookOpen,
  Layers,
  Hash,
  Mail,
  Users,
  HelpCircle,
  FileText,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    categories: 0,
    courses: 0,
    modules: 0,
    topics: 0,
    contacts: 0,
    enrolls: 0,
    faqs: 0,
    blogs: 0,
    testimonials: 0,
  });

  const fetchAllStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all endpoints in parallel
      const [
        categoriesRes,
        coursesRes,
        modulesRes,
        topicsRes,
        contactsRes,
        enrollsRes,
        faqsRes,
        blogsRes,
        testimonialsRes,
      ] = await Promise.allSettled([
        fetch("https://codingcloud.pythonanywhere.com/category/"),
        fetch("https://codingcloud.pythonanywhere.com/course/"),
        fetch("https://codingcloud.pythonanywhere.com/modules/"),
        fetch("https://codingcloud.pythonanywhere.com/topics/"),
        fetch("https://codingcloud.pythonanywhere.com/contacts/"),
        fetch("https://codingcloud.pythonanywhere.com/enroll/"),
        fetch("https://codingcloud.pythonanywhere.com/faqs/"),
        fetch("https://codingcloud.pythonanywhere.com/blogs/"),
        fetch("https://codingcloud.pythonanywhere.com/testimonials/"),
      ]);

      // Process categories
      if (categoriesRes.status === "fulfilled" && categoriesRes.value.ok) {
        const data = await categoriesRes.value.json();
        stats.categories = Array.isArray(data)
          ? data.length
          : data.data?.length || 0;
      }

      // Process courses
      if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
        const data = await coursesRes.value.json();
        stats.courses = Array.isArray(data)
          ? data.length
          : data.data?.length || 0;
      }

      // Process modules
      if (modulesRes.status === "fulfilled" && modulesRes.value.ok) {
        const data = await modulesRes.value.json();
        stats.modules = Array.isArray(data)
          ? data.length
          : data.data?.length || 0;
      }

      // Process topics
      if (topicsRes.status === "fulfilled" && topicsRes.value.ok) {
        const data = await topicsRes.value.json();
        stats.topics = Array.isArray(data)
          ? data.length
          : data.data?.length || 0;
      }

      // Process contacts
      if (contactsRes.status === "fulfilled" && contactsRes.value.ok) {
        const data = await contactsRes.value.json();
        stats.contacts = Array.isArray(data)
          ? data.length
          : data.data?.length || 0;
      }

      // Process enrolls
      if (enrollsRes.status === "fulfilled" && enrollsRes.value.ok) {
        const data = await enrollsRes.value.json();
        stats.enrolls = Array.isArray(data)
          ? data.length
          : data.data?.length || 0;
      }

      // Process faqs
      if (faqsRes.status === "fulfilled" && faqsRes.value.ok) {
        const data = await faqsRes.value.json();
        stats.faqs = Array.isArray(data) ? data.length : data.data?.length || 0;
      }

      // Process blogs
      if (blogsRes.status === "fulfilled" && blogsRes.value.ok) {
        const data = await blogsRes.value.json();
        const blogsData = data.data || data;
        stats.blogs = Array.isArray(blogsData) ? blogsData.length : 0;
      }

      // Process testimonials
      if (testimonialsRes.status === "fulfilled" && testimonialsRes.value.ok) {
        const data = await testimonialsRes.value.json();
        const testimonialsData = data.data || data;
        stats.testimonials = Array.isArray(testimonialsData)
          ? testimonialsData.length
          : 0;
      }

      setStats({ ...stats });
    } catch (err) {
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  const dashboardCards = [
    {
      id: "categories",
      title: "Categories",
      value: stats.categories,
      icon: LayoutGrid,
      color: "bg-violet-50 text-violet-600",
      hoverColor: "hover:bg-violet-50",
      borderColor: "border-violet-200",
      path: "/category",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      id: "courses",
      title: "Courses",
      value: stats.courses,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      hoverColor: "hover:bg-blue-50",
      borderColor: "border-blue-200",
      path: "/course",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      id: "modules",
      title: "Modules",
      value: stats.modules,
      icon: Layers,
      color: "bg-emerald-50 text-emerald-600",
      hoverColor: "hover:bg-emerald-50",
      borderColor: "border-emerald-200",
      path: "/modules",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: "topics",
      title: "Topics",
      value: stats.topics,
      icon: Hash,
      color: "bg-amber-50 text-amber-600",
      hoverColor: "hover:bg-amber-50",
      borderColor: "border-amber-200",
      path: "/topics",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      id: "contacts",
      title: "Contacts",
      value: stats.contacts,
      icon: Mail,
      color: "bg-rose-50 text-rose-600",
      hoverColor: "hover:bg-rose-50",
      borderColor: "border-rose-200",
      path: "/contact",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      id: "enrolls",
      title: "Enrollments",
      value: stats.enrolls,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
      hoverColor: "hover:bg-indigo-50",
      borderColor: "border-indigo-200",
      path: "/enroll",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      id: "faqs",
      title: "FAQs",
      value: stats.faqs,
      icon: HelpCircle,
      color: "bg-cyan-50 text-cyan-600",
      hoverColor: "hover:bg-cyan-50",
      borderColor: "border-cyan-200",
      path: "/faq",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      id: "blogs",
      title: "Blogs",
      value: stats.blogs,
      icon: FileText,
      color: "bg-orange-50 text-orange-600",
      hoverColor: "hover:bg-orange-50",
      borderColor: "border-orange-200",
      path: "/blogs",
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: "testimonials",
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      color: "bg-teal-50 text-teal-600",
      hoverColor: "hover:bg-teal-50",
      borderColor: "border-teal-200",
      path: "/testimonials",
      gradient: "from-teal-500 to-green-600",
    },
  ];

  // Calculate total items
  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Something went wrong
          </h3>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button
            onClick={fetchAllStats}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutGrid size={24} className="text-violet-600" />
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              </div>
              <p className="text-slate-500 text-sm">
                Welcome to your admin dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Admin Dashboard
            </h2>
            <p className="text-violet-100 text-sm sm:text-base max-w-2xl">
              Manage all your content from one central location. Track
              categories, courses, modules, topics, and more.
            </p>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${card.color}`}>
                      <IconComponent size={22} />
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-violet-600 transition-colors">
                      <span className="text-xs font-medium">View all</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    {card.title}
                  </h3>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-slate-900">
                      {card.value}
                    </p>
                    <div
                      className={`h-1 w-16 bg-gradient-to-r ${card.gradient} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>
                </div>

                {/* Progress bar (percentage of total) */}
                <div className="h-1 w-full bg-slate-100">
                  <div
                    className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-300`}
                    style={{
                      width:
                        totalItems > 0
                          ? `${(card.value / totalItems) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Recent Activity Placeholder */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-violet-600 rounded-full" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Add New Category",
                  path: "/add-category",
                  icon: LayoutGrid,
                },
                {
                  label: "Add New Course",
                  path: "/add-course",
                  icon: BookOpen,
                },
                { label: "Add New Blog", path: "/add-blog", icon: FileText },
                {
                  label: "Add New Testimonial",
                  path: "/add-testimonial",
                  icon: MessageSquare,
                },
              ].map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-50 rounded-lg">
                        <ActionIcon size={16} className="text-violet-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {action.label}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-slate-400 group-hover:text-violet-600 transition-colors"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">API Connection</span>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Last Updated</span>
                <span className="text-sm text-slate-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Records</span>
                <span className="text-sm font-semibold text-slate-900">
                  {totalItems}
                </span>
              </div>
              <div className="pt-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}

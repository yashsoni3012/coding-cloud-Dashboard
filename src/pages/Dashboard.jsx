// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   LayoutGrid,
//   BookOpen,
//   Layers,
//   Hash,
//   Mail,
//   Users,
//   HelpCircle,
//   FileText,
//   MessageSquare,
//   ArrowRight,
//   RefreshCw,
//   AlertCircle,
//   X,
// } from "lucide-react";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({
//     categories: 0,
//     courses: 0,
//     modules: 0,
//     topics: 0,
//     contacts: 0,
//     enrolls: 0,
//     faqs: 0,
//     blogs: 0,
//     testimonials: 0,
//   });

//   const fetchAllStats = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Fetch all endpoints in parallel
//       const [
//         categoriesRes,
//         coursesRes,
//         modulesRes,
//         topicsRes,
//         contactsRes,
//         enrollsRes,
//         faqsRes,
//         blogsRes,
//         testimonialsRes,
//       ] = await Promise.allSettled([
//         fetch("https://codingcloud.pythonanywhere.com/category/"),
//         fetch("https://codingcloud.pythonanywhere.com/course/"),
//         fetch("https://codingcloud.pythonanywhere.com/modules/"),
//         fetch("https://codingcloud.pythonanywhere.com/topics/"),
//         fetch("https://codingcloud.pythonanywhere.com/contacts/"),
//         fetch("https://codingcloud.pythonanywhere.com/enroll/"),
//         fetch("https://codingcloud.pythonanywhere.com/faqs/"),
//         fetch("https://codingcloud.pythonanywhere.com/blogs/"),
//         fetch("https://codingcloud.pythonanywhere.com/testimonials/"),
//       ]);

//       // Process categories
//       if (categoriesRes.status === "fulfilled" && categoriesRes.value.ok) {
//         const data = await categoriesRes.value.json();
//         stats.categories = Array.isArray(data)
//           ? data.length
//           : data.data?.length || 0;
//       }

//       // Process courses
//       if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
//         const data = await coursesRes.value.json();
//         stats.courses = Array.isArray(data)
//           ? data.length
//           : data.data?.length || 0;
//       }

//       // Process modules
//       if (modulesRes.status === "fulfilled" && modulesRes.value.ok) {
//         const data = await modulesRes.value.json();
//         stats.modules = Array.isArray(data)
//           ? data.length
//           : data.data?.length || 0;
//       }

//       // Process topics
// if (topicsRes.status === "fulfilled" && topicsRes.value.ok) {
//   const data = await topicsRes.value.json();

//   if (typeof data.count === "number") {
//     stats.topics = data.count;
//   } else if (Array.isArray(data.data)) {
//     stats.topics = data.data.reduce(
//       (total, module) => total + (module.topics?.length || 0),
//       0
//     );
//   } else {
//     stats.topics = 0;
//   }
// }

//       // Process contacts
//       if (contactsRes.status === "fulfilled" && contactsRes.value.ok) {
//         const data = await contactsRes.value.json();
//         stats.contacts = Array.isArray(data)
//           ? data.length
//           : data.data?.length || 0;
//       }

//       // Process enrolls
//       if (enrollsRes.status === "fulfilled" && enrollsRes.value.ok) {
//         const data = await enrollsRes.value.json();
//         stats.enrolls = Array.isArray(data)
//           ? data.length
//           : data.data?.length || 0;
//       }

//       // Process faqs
//       if (faqsRes.status === "fulfilled" && faqsRes.value.ok) {
//         const data = await faqsRes.value.json();
//         stats.faqs = Array.isArray(data) ? data.length : data.data?.length || 0;
//       }

//       // Process blogs
//       if (blogsRes.status === "fulfilled" && blogsRes.value.ok) {
//         const data = await blogsRes.value.json();
//         const blogsData = data.data || data;
//         stats.blogs = Array.isArray(blogsData) ? blogsData.length : 0;
//       }

//       // Process testimonials
//       // Process testimonials
//      // Process testimonials
// if (testimonialsRes.status === "fulfilled" && testimonialsRes.value.ok) {
//   const data = await testimonialsRes.value.json();

//   console.log("Testimonials API:", data);

//   if (Array.isArray(data.testimonials)) {
//     stats.testimonials = data.testimonials.length;
//   } 
//   else if (Array.isArray(data.data)) {
//     stats.testimonials = data.data.length;
//   } 
//   else if (Array.isArray(data)) {
//     stats.testimonials = data.length;
//   } 
//   else {
//     stats.testimonials = 0;
//   }
// }
//       setStats({ ...stats });
//     } catch (err) {
//       setError("Failed to load dashboard statistics. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllStats();
//   }, []);

//   const dashboardCards = [
//     {
//       id: "categories",
//       title: "Categories",
//       value: stats.categories,
//       icon: LayoutGrid,
//       color: "bg-violet-50 text-violet-600",
//       hoverColor: "hover:bg-violet-50",
//       borderColor: "border-violet-200",
//       path: "/category",
//       gradient: "from-violet-500 to-purple-600",
//     },
//     {
//       id: "courses",
//       title: "Courses",
//       value: stats.courses,
//       icon: BookOpen,
//       color: "bg-blue-50 text-blue-600",
//       hoverColor: "hover:bg-blue-50",
//       borderColor: "border-blue-200",
//       path: "/course",
//       gradient: "from-blue-500 to-cyan-600",
//     },
//     {
//       id: "modules",
//       title: "Modules",
//       value: stats.modules,
//       icon: Layers,
//       color: "bg-emerald-50 text-emerald-600",
//       hoverColor: "hover:bg-emerald-50",
//       borderColor: "border-emerald-200",
//       path: "/modules",
//       gradient: "from-emerald-500 to-teal-600",
//     },
//     {
//       id: "topics",
//       title: "Topics",
//       value: stats.topics,
//       icon: Hash,
//       color: "bg-amber-50 text-amber-600",
//       hoverColor: "hover:bg-amber-50",
//       borderColor: "border-amber-200",
//       path: "/topics",
//       gradient: "from-amber-500 to-orange-600",
//     },
//     {
//       id: "contacts",
//       title: "Contacts",
//       value: stats.contacts,
//       icon: Mail,
//       color: "bg-rose-50 text-rose-600",
//       hoverColor: "hover:bg-rose-50",
//       borderColor: "border-rose-200",
//       path: "/contact",
//       gradient: "from-rose-500 to-pink-600",
//     },
//     {
//       id: "enrolls",
//       title: "Enrollments",
//       value: stats.enrolls,
//       icon: Users,
//       color: "bg-indigo-50 text-indigo-600",
//       hoverColor: "hover:bg-indigo-50",
//       borderColor: "border-indigo-200",
//       path: "/enroll",
//       gradient: "from-indigo-500 to-purple-600",
//     },
//     {
//       id: "faqs",
//       title: "FAQs",
//       value: stats.faqs,
//       icon: HelpCircle,
//       color: "bg-cyan-50 text-cyan-600",
//       hoverColor: "hover:bg-cyan-50",
//       borderColor: "border-cyan-200",
//       path: "/faq",
//       gradient: "from-cyan-500 to-blue-600",
//     },
//     {
//       id: "blogs",
//       title: "Blogs",
//       value: stats.blogs,
//       icon: FileText,
//       color: "bg-orange-50 text-orange-600",
//       hoverColor: "hover:bg-orange-50",
//       borderColor: "border-orange-200",
//       path: "/blogs",
//       gradient: "from-orange-500 to-red-600",
//     },
//     {
//       id: "testimonials",
//       title: "Testimonials",
//       value: stats.testimonials,
//       icon: MessageSquare,
//       color: "bg-teal-50 text-teal-600",
//       hoverColor: "hover:bg-teal-50",
//       borderColor: "border-teal-200",
//       path: "/testimonials",
//       gradient: "from-teal-500 to-green-600",
//     },
//   ];

//   // Calculate total items
//   const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
//           <p className="mt-4 text-slate-500 text-sm font-medium">
//             Loading dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
//           <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//             <X size={24} className="text-red-500" />
//           </div>
//           <h3 className="text-lg font-semibold text-slate-900 mb-1">
//             Something went wrong
//           </h3>
//           <p className="text-slate-500 text-sm mb-5">{error}</p>
//           <button
//             onClick={fetchAllStats}
//             className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Welcome Banner */}
//         <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg mb-8 overflow-hidden">
//           <div className="px-6 py-6 sm:px-8 sm:py-8 text-white">
//             <h2 className="text-xl sm:text-3xl font-bold mb-2">
//               Welcome, Coding Cloud
//             </h2>
//             <p className="text-violet-100 text-sm sm:text-base max-w-2xl">
//               Manage all your content from one central location. Track
//               categories, courses, modules, topics, and more.
//             </p>
//           </div>
//         </div>

//         {/* Stats Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {dashboardCards.map((card) => {
//             const IconComponent = card.icon;
//             return (
//               <div
//                 key={card.id}
//                 onClick={() => navigate(card.path)}
//                 className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
//               >
//                 <div className="p-5">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className={`p-3 rounded-xl ${card.color}`}>
//                       <IconComponent size={22} />
//                     </div>
//                     <div className="flex items-center gap-1 text-slate-400 group-hover:text-violet-600 transition-colors">
//                       <span className="text-xs font-medium">View all</span>
//                       <ArrowRight size={14} />
//                     </div>
//                   </div>

//                   <h3 className="text-sm font-medium text-slate-500 mb-1">
//                     {card.title}
//                   </h3>
//                   <div className="flex items-end justify-between">
//                     <p className="text-2xl font-bold text-slate-900">
//                       {card.value}
//                     </p>
//                     <div
//                       className={`h-1 w-16 bg-gradient-to-r ${card.gradient} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`}
//                     />
//                   </div>
//                 </div>

//                 {/* Progress bar (percentage of total) */}
//                 <div className="h-1 w-full bg-slate-100">
//                   <div
//                     className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-300`}
//                     style={{
//                       width:
//                         totalItems > 0
//                           ? `${(card.value / totalItems) * 100}%`
//                           : "0%",
//                     }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Quick Actions Section */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Recent Activity Placeholder */}
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//             <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
//               <div className="w-1.5 h-1.5 bg-violet-600 rounded-full" />
//               Quick Actions
//             </h3>
//             <div className="space-y-2">
//               {[
//                 {
//                   label: "Add New Category",
//                   path: "/add-category",
//                   icon: LayoutGrid,
//                 },
//                 {
//                   label: "Add New Course",
//                   path: "/add-course",
//                   icon: BookOpen,
//                 },
//                 { label: "Add New Blog", path: "/add-blog", icon: FileText },
//                 {
//                   label: "Add New Testimonial",
//                   path: "/add-testimonial",
//                   icon: MessageSquare,
//                 },
//               ].map((action, index) => {
//                 const ActionIcon = action.icon;
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => navigate(action.path)}
//                     className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-violet-50 rounded-lg">
//                         <ActionIcon size={16} className="text-violet-600" />
//                       </div>
//                       <span className="text-sm font-medium text-slate-700">
//                         {action.label}
//                       </span>
//                     </div>
//                     <ArrowRight
//                       size={14}
//                       className="text-slate-400 group-hover:text-violet-600 transition-colors"
//                     />
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* System Status */}
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//             <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
//               <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
//               System Status
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-600">API Connection</span>
//                 <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
//                   Connected
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-600">Last Updated</span>
//                 <span className="text-sm text-slate-500">
//                   {new Date().toLocaleTimeString()}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-600">Total Records</span>
//                 <span className="text-sm font-semibold text-slate-900">
//                   {totalItems}
//                 </span>
//               </div>
//               <div className="pt-2">
//                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
//                     style={{ width: "100%" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom spacing */}
//         <div className="h-8" />
//       </div>
//     </div>
//   );
// }


import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries, useQueryClient } from "@tanstack/react-query";
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
  X,
} from "lucide-react";

// API base
const BASE_URL = "https://codingcloud.pythonanywhere.com";

// Query functions for each endpoint
const fetchCategoriesCount = async () => {
  const res = await fetch(`${BASE_URL}/category/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return Array.isArray(data) ? data.length : data.data?.length || 0;
};

const fetchCoursesCount = async () => {
  const res = await fetch(`${BASE_URL}/course/`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  const data = await res.json();
  return Array.isArray(data) ? data.length : data.data?.length || 0;
};

const fetchModulesCount = async () => {
  const res = await fetch(`${BASE_URL}/modules/`);
  if (!res.ok) throw new Error("Failed to fetch modules");
  const data = await res.json();
  return Array.isArray(data) ? data.length : data.data?.length || 0;
};

const fetchTopicsCount = async () => {
  const res = await fetch(`${BASE_URL}/topics/`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  const data = await res.json();
  // Try to get count from various response structures
  if (typeof data.count === "number") return data.count;
  if (Array.isArray(data.data)) {
    return data.data.reduce((total, module) => total + (module.topics?.length || 0), 0);
  }
  return 0;
};

const fetchContactsCount = async () => {
  const res = await fetch(`${BASE_URL}/contacts/`);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  const data = await res.json();
  return Array.isArray(data) ? data.length : data.data?.length || 0;
};

const fetchEnrollsCount = async () => {
  const res = await fetch(`${BASE_URL}/enroll/`);
  if (!res.ok) throw new Error("Failed to fetch enrolls");
  const data = await res.json();
  return Array.isArray(data) ? data.length : data.data?.length || 0;
};

const fetchFaqsCount = async () => {
  const res = await fetch(`${BASE_URL}/faqs/`);
  if (!res.ok) throw new Error("Failed to fetch FAQs");
  const data = await res.json();
  return Array.isArray(data) ? data.length : data.data?.length || 0;
};

const fetchBlogsCount = async () => {
  const res = await fetch(`${BASE_URL}/blogs/`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const data = await res.json();
  const blogsData = data.data || data;
  return Array.isArray(blogsData) ? blogsData.length : 0;
};

const fetchTestimonialsCount = async () => {
  const res = await fetch(`${BASE_URL}/testimonials/`);
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  const data = await res.json();
  // Testimonials can be in different structures
  if (Array.isArray(data.testimonials)) return data.testimonials.length;
  if (Array.isArray(data.data)) return data.data.length;
  if (Array.isArray(data)) return data.length;
  return 0;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Run all queries in parallel
  const queries = useQueries({
    queries: [
      { queryKey: ["categoriesCount"], queryFn: fetchCategoriesCount },
      { queryKey: ["coursesCount"], queryFn: fetchCoursesCount },
      { queryKey: ["modulesCount"], queryFn: fetchModulesCount },
      { queryKey: ["topicsCount"], queryFn: fetchTopicsCount },
      { queryKey: ["contactsCount"], queryFn: fetchContactsCount },
      { queryKey: ["enrollsCount"], queryFn: fetchEnrollsCount },
      { queryKey: ["faqsCount"], queryFn: fetchFaqsCount },
      { queryKey: ["blogsCount"], queryFn: fetchBlogsCount },
      { queryKey: ["testimonialsCount"], queryFn: fetchTestimonialsCount },
    ],
  });

  // Combined loading/error states
  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;

  // Build stats object from query data
  const stats = useMemo(
    () => ({
      categories: queries[0]?.data ?? 0,
      courses: queries[1]?.data ?? 0,
      modules: queries[2]?.data ?? 0,
      topics: queries[3]?.data ?? 0,
      contacts: queries[4]?.data ?? 0,
      enrolls: queries[5]?.data ?? 0,
      faqs: queries[6]?.data ?? 0,
      blogs: queries[7]?.data ?? 0,
      testimonials: queries[8]?.data ?? 0,
    }),
    queries.map((q) => q.data) // re-run when any data changes
  );

  // Refresh all queries (used by retry button)
  const refreshAll = () => {
    queries.forEach((q) => q.refetch());
  };

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

  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);

  if (isLoading) {
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
          <p className="text-slate-500 text-sm mb-5">{error.message}</p>
          <button
            onClick={refreshAll}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 text-white">
            <h2 className="text-xl sm:text-3xl font-bold mb-2">
              Welcome, Coding Cloud
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
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search, Plus, Edit, Trash2, AlertCircle, CheckCircle,
//   X, FileText, Image as ImageIcon, Calendar, Eye,
//   Filter, ChevronDown, RefreshCw, SortAsc, SortDesc,
// } from "lucide-react";

// export default function Blogs() {
//   const navigate = useNavigate();

//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "display_id", direction: "desc" });
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({ status: "all" });

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [blogToDelete, setBlogToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState("");
//   const [deleteError, setDeleteError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");
//       if (response.ok) {
//         const blogsData = await response.json();
//         const actualBlogs = blogsData.data || blogsData;
//         const blogsList = Array.isArray(actualBlogs) ? actualBlogs : [];
//         const blogsWithDisplayIds = blogsList.map((blog, index) => ({
//           ...blog,
//           display_id: index + 1,
//         }));
//         setBlogs(blogsWithDisplayIds);
//         setFilteredBlogs(blogsWithDisplayIds);
//       } else {
//         setError("Failed to fetch blog data.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchBlogs(); }, []);

//   useEffect(() => {
//     let result = [...blogs];

//     if (searchTerm) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter((blog) =>
//         (blog.title && blog.title.toLowerCase().includes(q)) ||
//         (blog.short_description && blog.short_description.toLowerCase().includes(q)) ||
//         (blog.status && blog.status.toLowerCase().includes(q)) ||
//         (blog.content && blog.content.toLowerCase().includes(q)) ||
//         blog.display_id.toString().includes(q)
//       );
//     }

//     if (filters.status !== "all") {
//       result = result.filter((blog) => {
//         const status = blog.status?.toLowerCase() || "draft";
//         return filters.status === status;
//       });
//     }

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "display_id") { aVal = a.display_id || 0; bVal = b.display_id || 0; }
//       else if (sortConfig.key === "title") { aVal = a.title?.toLowerCase() || ""; bVal = b.title?.toLowerCase() || ""; }
//       else if (sortConfig.key === "publish_date") { aVal = a.publish_date || ""; bVal = b.publish_date || ""; }
//       else if (sortConfig.key === "status") { aVal = a.status?.toLowerCase() || ""; bVal = b.status?.toLowerCase() || ""; }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     setFilteredBlogs(result);
//     setCurrentPage(1);
//   }, [searchTerm, filters, sortConfig, blogs]);

//   const handleSort = (key) => {
//     setSortConfig((cur) => ({ key, direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc" }));
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
//     return sortConfig.direction === "asc"
//       ? <SortAsc size={13} className="text-violet-500" />
//       : <SortDesc size={13} className="text-violet-500" />;
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

//   const handleDeleteClick = (e, blog) => {
//     e.stopPropagation();
//     setBlogToDelete(blog);
//     setShowDeleteModal(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!blogToDelete) return;
//     setDeleteLoading(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/blogs/${blogToDelete.id}/`,
//         { method: "DELETE" }
//       );
//       if (response.ok || response.status === 204) {
//         setDeleteSuccess("Blog deleted successfully!");
//         fetchBlogs();
//         setTimeout(() => { setShowDeleteModal(false); setBlogToDelete(null); setDeleteSuccess(""); }, 1500);
//       } else {
//         try {
//           const data = await response.json();
//           setDeleteError(data.message || "Failed to delete blog.");
//         } catch { setDeleteError(`HTTP Error: ${response.status}`); }
//       }
//     } catch { setDeleteError("Network error. Please try again."); }
//     finally { setDeleteLoading(false); }
//   };

//   const getStatusStyles = (status) => {
//     const s = status?.toLowerCase();
//     if (s === "published" || s === "active") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
//     return "bg-amber-50 text-amber-700 border border-amber-200";
//   };

//   const activeFiltersCount = [
//     filters.status !== "all",
//     sortConfig.key !== "display_id" || sortConfig.direction !== "desc",
//   ].filter(Boolean).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
//           <p className="mt-4 text-slate-500 text-base font-medium">Loading blogs…</p>
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
//           <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
//           <p className="text-slate-500 text-base mb-5">{error}</p>
//           <button onClick={() => window.location.reload()} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-base font-medium">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* ── Header ── */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             <FileText size={20} className="text-violet-600" />
//             <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
//             <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
//               {blogs.length}
//             </span>
//           </div>
//           <p className="text-slate-500 text-base">Manage your blog posts and articles</p>
//         </div>

//         {/* ── Toolbar (single line) ── */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

//             {/* Search */}
//             <div className="relative flex-1 min-w-0">
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search by title, description, status or ID…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* Filter toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-medium transition-all whitespace-nowrap ${
//                 showFilters || activeFiltersCount > 0
//                   ? "border-violet-400 bg-violet-50 text-violet-700"
//                   : "border-slate-200 text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">{activeFiltersCount}</span>
//               )}
//               <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
//             </button>

//             {/* Add Blog */}
//             <button
//               onClick={() => navigate("/add-blog")}
//               className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium whitespace-nowrap shadow-sm shadow-violet-200"
//             >
//               <Plus size={16} />
//               Add Blog
//             </button>
//           </div>

//           {/* Expandable filter panel */}
//           {showFilters && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({ status: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="published">Published</option>
//                   <option value="draft">Draft</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Items Per Page</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
//                 >
//                   <option value={5}>5 per page</option>
//                   <option value={10}>10 per page</option>
//                   <option value={25}>25 per page</option>
//                   <option value={50}>50 per page</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Table / Empty state ── */}
//         {filteredBlogs.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
//             <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <FileText size={28} className="text-slate-400" />
//             </div>
//             <h3 className="text-base font-semibold text-slate-800 mb-1">No blogs found</h3>
//             <p className="text-slate-400 text-base mb-5">
//               {searchTerm || filters.status !== "all"
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first blog post."}
//             </p>
//             <button
//               onClick={() => navigate("/add-blog")}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium"
//             >
//               <Plus size={15} /> Add Blog
//             </button>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[700px]">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-14"
//                       onClick={() => handleSort("display_id")}
//                     >
//                       <span className="flex items-center gap-1"># {getSortIcon("display_id")}</span>
//                     </th>
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-14">
//                       Image
//                     </th>
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
//                       onClick={() => handleSort("title")}
//                     >
//                       <span className="flex items-center gap-1">Title {getSortIcon("title")}</span>
//                     </th>
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
//                       Description
//                     </th>
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
//                       onClick={() => handleSort("publish_date")}
//                     >
//                       <span className="flex items-center gap-1">Date {getSortIcon("publish_date")}</span>
//                     </th>
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
//                       onClick={() => handleSort("status")}
//                     >
//                       <span className="flex items-center gap-1">Status {getSortIcon("status")}</span>
//                     </th>
//                     <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {paginatedBlogs.map((blog, index) => (
//                     <tr
//                       key={blog.id}
//                       className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
//                       onClick={() => { setSelectedBlog(blog); setShowViewModal(true); }}
//                     >
//                       {/* # */}
//                       <td className="px-5 py-4 text-base font-semibold text-slate-400">
//                         {indexOfFirstItem + index + 1}
//                       </td>

//                       {/* Image */}
//                       <td className="px-5 py-4">
//                         <div className="w-11 h-11 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0">
//                           {blog.featured_image ? (
//                             <img
//                               src={`https://codingcloud.pythonanywhere.com${blog.featured_image}`}
//                               alt={blog.title}
//                               className="w-full h-full object-cover"
//                               onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80?text=?"; }}
//                             />
//                           ) : (
//                             <ImageIcon size={16} className="text-slate-400" />
//                           )}
//                         </div>
//                       </td>

//                       {/* Title */}
//                       <td className="px-5 py-4">
//                         <div>
//                           <span className="text-base font-semibold text-slate-800 line-clamp-1 block max-w-[200px]">
//                             {blog.title}
//                           </span>
//                           {/* Show description on small screens */}
//                           <span className="text-xs text-slate-400 lg:hidden line-clamp-1 max-w-[200px] block mt-0.5">
//                             {blog.short_description || blog.content?.substring(0, 80) || "No description"}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Description */}
//                       <td className="px-5 py-4 hidden lg:table-cell">
//                         <span className="text-base text-slate-400 line-clamp-1 max-w-[220px] block">
//                           {blog.short_description || blog.content?.substring(0, 100) || (
//                             <span className="italic">No description</span>
//                           )}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="px-5 py-4 hidden md:table-cell">
//                         {blog.publish_date ? (
//                           <div className="inline-flex items-center gap-1.5 text-base text-slate-500">
//                             <Calendar size={13} className="text-slate-400 flex-shrink-0" />
//                             {new Date(blog.publish_date).toLocaleDateString()}
//                           </div>
//                         ) : (
//                           <span className="text-slate-300 text-base">—</span>
//                         )}
//                       </td>

//                       {/* Status */}
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyles(blog.status)}`}>
//                           {blog.status || "Draft"}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center justify-end gap-1.5">
//                           <button
//                             onClick={(e) => { e.stopPropagation(); setSelectedBlog(blog); setShowViewModal(true); }}
//                             className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
//                             title="View"
//                           >
//                             <Eye size={15} />
//                           </button>
//                           <button
//                             onClick={(e) => { e.stopPropagation(); navigate(`/edit-blog/${blog.id}`, { state: { blog } }); }}
//                             className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
//                             title="Edit"
//                           >
//                             <Edit size={15} />
//                           </button>
//                           <button
//                             onClick={(e) => handleDeleteClick(e, blog)}
//                             className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
//                             title="Delete"
//                           >
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <span className="text-xs text-slate-400 font-medium">
//                 Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredBlogs.length)}</span> of <span className="text-slate-700 font-semibold">{filteredBlogs.length}</span> blogs
//               </span>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
//                 >
//                   ← Prev
//                 </button>
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                     let page = i + 1;
//                     if (totalPages > 5) {
//                       if (currentPage <= 3) page = i + 1;
//                       else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
//                       else page = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
//                           currentPage === page
//                             ? "bg-violet-600 text-white shadow-sm"
//                             : "text-slate-500 hover:bg-slate-200"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
//                 >
//                   Next →
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── View Blog Modal ── */}
//       {showViewModal && selectedBlog && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden max-h-[90vh] flex flex-col">

//             <button
//               onClick={() => setShowViewModal(false)}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10"
//             >
//               <X size={16} />
//             </button>

//             {/* Featured Image banner */}
//             <div className="w-full h-44 bg-slate-100 flex-shrink-0 overflow-hidden">
//               {selectedBlog.featured_image ? (
//                 <img
//                   src={`https://codingcloud.pythonanywhere.com${selectedBlog.featured_image}`}
//                   alt={selectedBlog.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x200?text=No+Image"; }}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <ImageIcon size={40} className="text-slate-300" />
//                 </div>
//               )}
//             </div>

//             <div className="p-6 overflow-y-auto flex-1">
//               {/* Title + status */}
//               <div className="flex items-start justify-between gap-3 mb-5">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">{selectedBlog.title}</h2>
//                 </div>
//                 <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusStyles(selectedBlog.status)}`}>
//                   {selectedBlog.status || "Draft"}
//                 </span>
//               </div>

//               {/* Publish date */}
//               {selectedBlog.publish_date && (
//                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
//                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
//                     <Calendar size={11} className="text-violet-500" /> Publish Date
//                   </p>
//                   <p className="text-base font-semibold text-slate-800">
//                     {new Date(selectedBlog.publish_date).toLocaleDateString("en-US", {
//                       year: "numeric", month: "long", day: "numeric",
//                     })}
//                   </p>
//                 </div>
//               )}

//               {/* Short description */}
//               {selectedBlog.short_description && (
//                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
//                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Short Description</p>
//                   <p className="text-base text-slate-600 leading-relaxed">{selectedBlog.short_description}</p>
//                 </div>
//               )}

//               {/* Content */}
//               <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Content</p>
//                 <div className="max-h-52 overflow-y-auto">
//                   <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
//                     {selectedBlog.content || "No content available."}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => { setShowViewModal(false); navigate(`/edit-blog/${selectedBlog.id}`, { state: { blog: selectedBlog } }); }}
//                 className="px-5 py-2 bg-violet-600 text-white text-base font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
//               >
//                 <Edit size={14} /> Edit Blog
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {showDeleteModal && blogToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
//             onClick={() => !deleteLoading && setShowDeleteModal(false)}
//           />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
//             <button
//               onClick={() => !deleteLoading && setShowDeleteModal(false)}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
//             >
//               <X size={16} />
//             </button>

//             <div className="flex items-start gap-4">
//               <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
//                 <AlertCircle size={22} className="text-red-500" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Blog</h3>
//                 <p className="text-base text-slate-500">
//                   Are you sure you want to delete <span className="font-semibold text-slate-700">"{blogToDelete.title}"</span>? This action cannot be undone.
//                 </p>
//               </div>
//             </div>

//             {deleteSuccess && (
//               <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
//                 <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
//                 <p className="text-base text-emerald-700">{deleteSuccess}</p>
//               </div>
//             )}
//             {deleteError && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
//                 <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
//                 <p className="text-base text-red-600">{deleteError}</p>
//               </div>
//             )}

//             <div className="mt-6 flex gap-3 justify-end">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 disabled={deleteLoading}
//                 className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={deleteLoading}
//                 className="px-5 py-2 bg-red-600 text-white text-base font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//               >
//                 {deleteLoading ? (
//                   <>
//                     <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Deleting…
//                   </>
//                 ) : (
//                   <><Trash2 size={14} /> Delete</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toasts from "../pages/Toasts";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  FileText,
  Image as ImageIcon,
  Calendar,
  Eye,
  Filter,
  ChevronDown,
  SortAsc,
  SortDesc,
  User,
  Tag,
  Layers,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BASE_URL = "https://codingcloud.pythonanywhere.com";

export default function Blogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "display_id",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: "all" });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/blogs/`);
      if (response.ok) {
        const blogsData = await response.json();
        const actualBlogs = blogsData.data || blogsData;
        const blogsList = Array.isArray(actualBlogs) ? actualBlogs : [];
        const blogsWithDisplayIds = blogsList.map((blog, index) => ({
          ...blog,
          display_id: index + 1,
        }));
        setBlogs(blogsWithDisplayIds);
        setFilteredBlogs(blogsWithDisplayIds);
      } else {
        setError("Failed to fetch blog data.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = [...blogs];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (blog) =>
          (blog.title && blog.title.toLowerCase().includes(q)) ||
          (blog.short_description &&
            blog.short_description.toLowerCase().includes(q)) ||
          (blog.status && blog.status.toLowerCase().includes(q)) ||
          (blog.content && blog.content.toLowerCase().includes(q)) ||
          blog.display_id.toString().includes(q),
      );
    }

    if (filters.status !== "all") {
      result = result.filter((blog) => {
        const status = blog.status?.toLowerCase() || "draft";
        return filters.status === status;
      });
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") {
        aVal = a.display_id || 0;
        bVal = b.display_id || 0;
      } else if (sortConfig.key === "title") {
        aVal = a.title?.toLowerCase() || "";
        bVal = b.title?.toLowerCase() || "";
      } else if (sortConfig.key === "publish_date") {
        aVal = a.publish_date || "";
        bVal = b.publish_date || "";
      } else if (sortConfig.key === "status") {
        aVal = a.status?.toLowerCase() || "";
        bVal = b.status?.toLowerCase() || "";
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredBlogs(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, blogs]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({
      key,
      direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col)
      return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} style={{ color: "#7c3aed" }} />
    ) : (
      <SortDesc size={13} style={{ color: "#7c3aed" }} />
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handleDeleteClick = (e, blog) => {
    e.stopPropagation();
    setBlogToDelete(blog);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const response = await fetch(`${BASE_URL}/blogs/${blogToDelete.id}/`, {
        method: "DELETE",
      });
      if (response.ok || response.status === 204) {
        setShowDeleteModal(false);
        setBlogToDelete(null);
        setToast({
          show: true,
          message: "Blog deleted successfully!",
          type: "error",
        });
        fetchBlogs();
      } else {
        try {
          const data = await response.json();
          setToast({
            show: true,
            message: data.message || "Failed to delete blog",
            type: "error",
          });
        } catch {
          setDeleteError(`HTTP Error: ${response.status}`);
        }
      }
    } catch {
      setToast({
        show: true,
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "published" || s === "active")
      return {
        background: "#ecfdf5",
        color: "#047857",
        border: "1px solid #a7f3d0",
      };
    if (s === "scheduled")
      return {
        background: "#dbeafe",
        color: "#1e40af",
        border: "1px solid #bfdbfe",
      };
    return {
      background: "#fffbeb",
      color: "#b45309",
      border: "1px solid #fde68a",
    };
  };

  const activeFiltersCount = [
    filters.status !== "all",
    sortConfig.key !== "display_id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const avatarColors = [
    "#7c3aed",
    "#2563eb",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];
  const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
  const getInitials = (title) =>
    title ? title.slice(0, 2).toUpperCase() : "BL";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {toast.show && (
          <Toasts
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        )}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #ede9fe",
              borderTopColor: "#7c3aed",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              marginTop: 14,
              color: "#94a3b8",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Loading blogs…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            padding: 32,
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#fef2f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <X size={22} color="#ef4444" />
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            Something went wrong
          </h3>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .blog-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .blog-row { transition: background 0.13s; cursor: pointer; }
        .blog-row:hover { background: #fafafa; }
        .blog-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .blog-action-btn:hover { background: #ede9fe; color: #7c3aed; }
        .blog-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .blog-th-btn:hover { color: #475569; }
        .blog-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .blog-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .blog-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .blog-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .blog-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .blog-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .blog-search::placeholder { color: #cbd5e1; }
        .blog-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .blog-select:focus { border-color: #7c3aed; }
        .blog-filter-btn { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.13s; font-family: inherit; white-space: nowrap; }
        .blog-filter-btn.active { border-color: #7c3aed; background: #ede9fe; color: #7c3aed; }
        .blog-filter-btn:hover { background: #f1f5f9; }
        .blog-add-btn { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border: none; border-radius: 10px; background: #7c3aed; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.13s; font-family: inherit; white-space: nowrap; box-shadow: 0 2px 8px rgba(124,58,237,0.25); }
        .blog-add-btn:hover { background: #6d28d9; }
        .blog-close-btn { padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
        .blog-close-btn:hover { background: #f1f5f9; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 5,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
              }}
            >
              <FileText size={17} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Blogs
            </h1>
            <span
              style={{
                padding: "3px 11px",
                background: "#ede9fe",
                color: "#6d28d9",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 99,
              }}
            >
              {blogs.length}
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#94a3b8",
              margin: 0,
              paddingLeft: 48,
            }}
          >
            Manage your blog posts and articles
          </p>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "14px 18px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Search */}
            <div
              style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#cbd5e1",
                  pointerEvents: "none",
                }}
              />
              <input
                className="blog-search"
                type="text"
                placeholder="Search by title, description, status or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                    padding: 2,
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              className={`blog-filter-btn ${showFilters || activeFiltersCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span
                  style={{
                    marginLeft: 2,
                    background: "#7c3aed",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 20,
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                style={{
                  transition: "transform 0.2s",
                  transform: showFilters ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {/* Add Blog */}
            <button
              className="blog-add-btn"
              onClick={() => navigate("/add-blog")}
            >
              <Plus size={16} />
              Add Blog
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid #f1f5f9",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {/* <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Status</label>
                <select
                  className="blog-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ status: e.target.value })}
                  style={{ width: "100%" }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div> */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    marginBottom: 6,
                  }}
                >
                  Items per page
                </label>
                <select
                  className="blog-select"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  style={{ width: "100%" }}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Gap */}
        <div style={{ height: 20 }} />

        {/* Table / Empty state */}
        {filteredBlogs.length === 0 ? (
          <div
            className="blog-animate"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: "64px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                background: "#f1f5f9",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <FileText size={27} color="#cbd5e1" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 6px",
              }}
            >
              No blogs found
            </h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || filters.status !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first blog post."}
            </p>
            {searchTerm || filters.status !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ status: "all" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/add-blog")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Plus size={15} /> Add Blog
              </button>
            )}
          </div>
        ) : (
          <div
            className="blog-animate"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 800,
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      background: "#fafafa",
                    }}
                  >
                    <th
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        width: 56,
                      }}
                    >
                      <button
                        className="blog-th-btn"
                        onClick={() => handleSort("display_id")}
                      >
                        # <SortIcon col="display_id" />
                      </button>
                    </th>
                    <th
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        width: 60,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Image
                      </span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="blog-th-btn"
                        onClick={(s) => handleSort("title")}
                      >
                        Title <SortIcon col="title" />
                      </button>
                    </th>
                    <th
                      style={{ padding: "14px 18px", textAlign: "left" }}
                      className="hidden lg:table-cell"
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Description
                      </span>
                    </th>
                    <th
                      style={{ padding: "14px 18px", textAlign: "left" }}
                      className="hidden md:table-cell"
                    >
                      <button
                        className="blog-th-btn"
                        onClick={() => handleSort("publish_date")}
                      >
                        Date <SortIcon col="publish_date" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="blog-th-btn"
                        onClick={() => handleSort("status")}
                      >
                        Status <SortIcon col="status" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBlogs.map((blog, index) => {
                    const color = getColor(blog.id);
                    return (
                      <tr
                        key={blog.id}
                        className="blog-row"
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                        onClick={() => {
                          setSelectedBlog(blog);
                          setShowViewModal(true);
                        }}
                      >
                        {/* # */}
                        <td
                          style={{
                            padding: "15px 18px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#cbd5e1",
                            verticalAlign: "top",
                          }}
                        >
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Image */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: "#f1f5f9",
                              overflow: "hidden",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {blog.featured_image ? (
                              <img
                                src={`${BASE_URL}${blog.featured_image}`}
                                alt={blog.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  e.target.parentNode.innerHTML =
                                    '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15L16 10L5 21"/></svg></div>';
                                }}
                              />
                            ) : (
                              <ImageIcon size={16} color="#94a3b8" />
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {/* <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(blog.title)}
                            </div> */}
                            <div>
                              <span
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#1e293b",
                                  display: "block",
                                  maxWidth: 200,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {blog.title}
                              </span>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#94a3b8",
                                  display: "block",
                                  marginTop: 1,
                                }}
                                className="lg:hidden"
                              >
                                {blog.short_description ||
                                  blog.content?.substring(0, 60) ||
                                  "No description"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description (desktop) */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                          className="hidden lg:table-cell"
                        >
                          <span
                            style={{
                              fontSize: 14,
                              color: "#94a3b8",
                              display: "block",
                              maxWidth: 250,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {blog.short_description ||
                              blog.content?.substring(0, 100) || (
                                <span style={{ fontStyle: "italic" }}>
                                  No description
                                </span>
                              )}
                          </span>
                        </td>

                        {/* Date */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                          className="hidden md:table-cell"
                        >
                          {blog.publish_date ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontSize: 14,
                                color: "#64748b",
                              }}
                            >
                              <Calendar size={13} color="#94a3b8" />
                              {new Date(blog.publish_date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>
                              —
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 10px",
                              ...getStatusStyles(blog.status),
                              fontSize: 12.5,
                              fontWeight: 600,
                              borderRadius: 99,
                            }}
                          >
                            {blog.status || "Draft"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 2,
                            }}
                          >
                            <button
                              className="blog-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBlog(blog);
                                setShowViewModal(true);
                              }}
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="blog-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-blog/${blog.id}`, {
                                  state: { blog },
                                });
                              }}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              className="blog-action-btn"
                              onClick={(e) => handleDeleteClick(e, blog)}
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                padding: "13px 18px",
                background: "#fafafa",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span
                style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}
              >
                Showing{" "}
                <strong style={{ color: "#475569" }}>
                  {indexOfFirstItem + 1}–
                  {Math.min(indexOfLastItem, filteredBlogs.length)}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "#475569" }}>
                  {filteredBlogs.length}
                </strong>{" "}
                blogs
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button
                  className="blog-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`blog-page-btn${currentPage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="blog-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Blog Modal (Enhanced) ── */}
      {showViewModal && selectedBlog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowViewModal(false)}
          />
          <div
            className="blog-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxWidth: 720,
              width: "100%",
              zIndex: 10,
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() => setShowViewModal(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                padding: 6,
                borderRadius: 8,
                display: "flex",
                zIndex: 10,
              }}
            >
              <X size={15} />
            </button>

            {/* Featured Image banner */}
            <div
              style={{
                width: "100%",
                height: 180,
                background: "#f1f5f9",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {selectedBlog.featured_image ? (
                <img
                  src={`${BASE_URL}${selectedBlog.featured_image}`}
                  alt={selectedBlog.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x180?text=No+Image";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageIcon size={48} color="#cbd5e1" />
                </div>
              )}
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              {/* Avatar + Title + Status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: getColor(selectedBlog.id),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(selectedBlog.title)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 4,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {selectedBlog.title}
                    </h2>
                    <span
                      style={{
                        padding: "4px 10px",
                        ...getStatusStyles(selectedBlog.status),
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 99,
                      }}
                    >
                      {selectedBlog.status || "Draft"}
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>
                    Blog #{selectedBlog.display_id}
                  </p>
                </div>
              </div>

              {/* Author & Date */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {selectedBlog.author && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <User size={14} color="#94a3b8" />
                    <span style={{ fontSize: 14, color: "#475569" }}>
                      {selectedBlog.author}
                    </span>
                  </div>
                )}
                {selectedBlog.publish_date && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Calendar size={14} color="#94a3b8" />
                    <span style={{ fontSize: 14, color: "#475569" }}>
                      {new Date(selectedBlog.publish_date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {selectedBlog.categories &&
                selectedBlog.categories.length > 0 && (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 14,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "#94a3b8",
                        margin: "0 0 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Layers size={11} color="#7c3aed" /> Categories
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {selectedBlog.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            background: "#ede9fe",
                            color: "#6d28d9",
                            border: "1px solid #ddd6fe",
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 99,
                          }}
                        >
                          {cat.name || cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Tags */}
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      margin: "0 0 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Tag size={11} color="#059669" /> Tags
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedBlog.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "4px 10px",
                          background: "#d1fae5",
                          color: "#047857",
                          border: "1px solid #a7f3d0",
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 99,
                        }}
                      >
                        #{tag.name || tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Short description */}
              {selectedBlog.short_description && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      margin: "0 0 6px",
                    }}
                  >
                    Short Description
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {selectedBlog.short_description}
                  </p>
                </div>
              )}

              {/* Full content */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    margin: "0 0 8px",
                  }}
                >
                  Content
                </p>
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    fontSize: 14,
                    color: "#475569",
                    lineHeight: 1.65,
                  }}
                >
                  {selectedBlog.content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                    />
                  ) : (
                    <p style={{ fontStyle: "italic", color: "#94a3b8" }}>
                      No content available.
                    </p>
                  )}
                </div>
              </div>

              {/* Meta information */}
              {(selectedBlog.meta_title ||
                selectedBlog.meta_description ||
                selectedBlog.meta_keywords) && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      margin: "0 0 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Globe size={11} color="#7c3aed" /> SEO & Meta
                  </p>
                  {selectedBlog.meta_title && (
                    <div style={{ marginBottom: 8 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#64748b",
                          margin: "0 0 2px",
                        }}
                      >
                        Meta Title
                      </p>
                      <p style={{ fontSize: 13, color: "#1e293b", margin: 0 }}>
                        {selectedBlog.meta_title}
                      </p>
                    </div>
                  )}
                  {selectedBlog.meta_description && (
                    <div style={{ marginBottom: 8 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#64748b",
                          margin: "0 0 2px",
                        }}
                      >
                        Meta Description
                      </p>
                      <p style={{ fontSize: 13, color: "#1e293b", margin: 0 }}>
                        {selectedBlog.meta_description}
                      </p>
                    </div>
                  )}
                  {selectedBlog.meta_keywords && (
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#64748b",
                          margin: "0 0 2px",
                        }}
                      >
                        Meta Keywords
                      </p>
                      <p style={{ fontSize: 13, color: "#1e293b", margin: 0 }}>
                        {selectedBlog.meta_keywords}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px",
                background: "#f8fafc",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                className="blog-close-btn"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-blog/${selectedBlog.id}`, {
                    state: { blog: selectedBlog },
                  });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Edit size={14} /> Edit Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && blogToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div
            className="blog-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxWidth: 400,
              width: "100%",
              zIndex: 10,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}
                >
                  Delete Blog
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                  Are you sure you want to delete "
                  <strong style={{ color: "#1e293b" }}>
                    {blogToDelete.title}
                  </strong>
                  "? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: "#fef2f2",
                  border: "1px solid #fee2e2",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={15} color="#ef4444" />
                <span style={{ fontSize: 14, color: "#b91c1c" }}>
                  {deleteError}
                </span>
              </div>
            )}

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                className="blog-close-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                style={{ opacity: deleteLoading ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: deleteLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: deleteLoading ? 0.6 : 1,
                }}
              >
                {deleteLoading ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #fff",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Search,
//     Plus,
//     Edit,
//     Trash2,
//     AlertCircle,
//     CheckCircle,
//     X,
//     FileText,
//     Image as ImageIcon,
//     Calendar
// } from "lucide-react";

// export default function Blogs() {
//     const navigate = useNavigate();

//     // State for data
//     const [blogs, setBlogs] = useState([]);
//     const [filteredBlogs, setFilteredBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // UI State
//     const [searchTerm, setSearchTerm] = useState("");

//     // Modal states
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [blogToDelete, setBlogToDelete] = useState(null);
//     const [deleteLoading, setDeleteLoading] = useState(false);
//     const [deleteSuccess, setDeleteSuccess] = useState("");
//     const [deleteError, setDeleteError] = useState("");

//     // Fetch initial data
//     const fetchBlogs = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");

//             if (response.ok) {
//                 const blogsData = await response.json();
//                 const actualBlogs = blogsData.data || blogsData;
//                 const blogsList = Array.isArray(actualBlogs) ? actualBlogs : [];
//                 setBlogs(blogsList);
//                 setFilteredBlogs(blogsList);
//             } else {
//                 setError("Failed to fetch blog data.");
//             }
//         } catch (err) {
//             setError("Network error. Please try again.");
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBlogs();
//     }, []);

//     // Filter based on search
//     useEffect(() => {
//         if (searchTerm) {
//             const lowerSearch = searchTerm.toLowerCase();
//             const filtered = blogs.filter((blog) => {
//                 return (
//                     (blog.title && blog.title.toLowerCase().includes(lowerSearch)) ||
//                     (blog.short_description && blog.short_description.toLowerCase().includes(lowerSearch)) ||
//                     (blog.status && blog.status.toLowerCase().includes(lowerSearch))
//                 );
//             });
//             setFilteredBlogs(filtered);
//         } else {
//             setFilteredBlogs(blogs);
//         }
//     }, [searchTerm, blogs]);

//     // Delete handlers
//     const handleDeleteClick = (blog) => {
//         setBlogToDelete(blog);
//         setShowDeleteModal(true);
//         setDeleteError("");
//         setDeleteSuccess("");
//     };

//     const handleDeleteConfirm = async () => {
//         if (!blogToDelete) return;

//         setDeleteLoading(true);
//         setDeleteError("");
//         setDeleteSuccess("");

//         try {
//             const response = await fetch(
//                 `https://codingcloud.pythonanywhere.com/blogs/${blogToDelete.id}/`,
//                 {
//                     method: "DELETE",
//                 }
//             );

//             if (response.ok || response.status === 204) {
//                 setDeleteSuccess("Blog deleted successfully!");
//                 fetchBlogs(); // Refresh list
//                 setTimeout(() => {
//                     setShowDeleteModal(false);
//                     setBlogToDelete(null);
//                     setDeleteSuccess("");
//                 }, 1500);
//             } else {
//                 try {
//                     const data = await response.json();
//                     setDeleteError(data.message || "Failed to delete blog.");
//                 } catch {
//                     setDeleteError(`HTTP Error: ${response.status}`);
//                 }
//             }
//         } catch (err) {
//             console.error("Error deleting blog:", err);
//             setDeleteError("Network error. Please try again.");
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     const handleEdit = (blog) => {
//         navigate(`/edit-blog/${blog.id}`, { state: { blog } });
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <div className="relative">
//                     <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//                     <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
//                         Loading Blogs...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <div className="text-center">
//                     <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//                         <X size={32} className="text-red-500" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                         Oops! Something went wrong
//                     </h3>
//                     <p className="text-gray-500 mb-4">{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
//                     <p className="text-gray-500 text-sm mt-1">
//                         Manage your blog posts and articles
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     <button
//                         onClick={() => navigate("/add-blog")}
//                         className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
//                     >
//                         <Plus size={18} />
//                         <span className="hidden sm:inline font-medium">Add Blog</span>
//                         <span className="sm:hidden font-medium">Add</span>
//                     </button>
//                 </div>
//             </div>

//             {/* Search Bar */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
//                 <div className="relative">
//                     <Search
//                         size={18}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Search by title, description, or status..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                     {searchTerm && (
//                         <button
//                             onClick={() => setSearchTerm("")}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                         >
//                             <X size={16} />
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Blogs List */}
//             {filteredBlogs.length === 0 ? (
//                 <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
//                     <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//                         <FileText size={32} className="text-gray-400" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                         No Blogs found
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                         Try adjusting your search or add a new blog post.
//                     </p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredBlogs.map((blog) => (
//                         <div key={blog.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
//                             {/* Image Header */}
//                             <div className="h-48 bg-gray-100 relative overflow-hidden group">
//                                 {blog.featured_image ? (
//                                     <img
//                                         src={`https://codingcloud.pythonanywhere.com${blog.featured_image}`}
//                                         alt={blog.title}
//                                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
//                                         }}
//                                     />
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                         <ImageIcon size={48} className="opacity-50" />
//                                     </div>
//                                 )}
//                                 <div className="absolute top-3 right-3 flex gap-2">
//                                     <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm
//                         ${blog.status === 'Published' || blog.status === 'Active'
//                                             ? 'bg-green-100/90 text-green-800 border border-green-200/50'
//                                             : 'bg-yellow-100/90 text-yellow-800 border border-yellow-200/50'}`}>
//                                         {blog.status || 'Draft'}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Content */}
//                             <div className="p-5 flex-1 flex flex-col">
//                                 <div className="flex items-start justify-between gap-2 mb-2">
//                                     <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
//                                         {blog.title}
//                                     </h3>
//                                 </div>

//                                 <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
//                                     {blog.short_description || blog.content?.substring(0, 100) || "No description provided."}
//                                 </p>

//                                 {blog.publish_date && (
//                                     <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-medium">
//                                         <Calendar size={14} />
//                                         <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
//                                     </div>
//                                 )}

//                                 {/* Actions */}
//                                 <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
//                                     <button
//                                         onClick={() => handleEdit(blog)}
//                                         className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center gap-2"
//                                     >
//                                         <Edit size={16} />
//                                         Edit
//                                     </button>
//                                     <button
//                                         onClick={() => handleDeleteClick(blog)}
//                                         className="px-3 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center justify-center"
//                                         aria-label="Delete blog"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && blogToDelete && (
//                 <div
//                     className="fixed inset-0 z-50 overflow-y-auto"
//                     aria-labelledby="delete-modal-title"
//                     role="dialog"
//                     aria-modal="true"
//                 >
//                     <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//                         <div
//                             className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
//                             onClick={() => !deleteLoading && setShowDeleteModal(false)}
//                             aria-hidden="true"
//                         />

//                         <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
//                             <div className="p-6">
//                                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
//                                     <AlertCircle size={32} className="text-red-600" />
//                                 </div>

//                                 <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
//                                     Delete Blog
//                                 </h3>

//                                 <p className="text-sm text-gray-500 text-center mb-6">
//                                     Are you sure you want to delete the blog post{" "}
//                                     <span className="font-semibold text-gray-900 border-b border-gray-300 pb-0.5">
//                                         "{blogToDelete.title}"
//                                     </span>
//                                     ? This action cannot be undone.
//                                 </p>

//                                 {deleteSuccess && (
//                                     <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//                                         <CheckCircle size={16} className="text-green-600" />
//                                         <p className="text-sm text-green-600">{deleteSuccess}</p>
//                                     </div>
//                                 )}

//                                 {deleteError && (
//                                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//                                         <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
//                                         <p className="text-sm text-red-600">{deleteError}</p>
//                                     </div>
//                                 )}

//                                 <div className="grid grid-cols-2 gap-3 mt-2">
//                                     <button
//                                         onClick={() => setShowDeleteModal(false)}
//                                         disabled={deleteLoading}
//                                         className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleDeleteConfirm}
//                                         disabled={deleteLoading}
//                                         className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
//                                     >
//                                         {deleteLoading ? (
//                                             <>
//                                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                                 Deleting...
//                                             </>
//                                         ) : (
//                                             "Delete Blog"
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Edit, Trash2, AlertCircle, CheckCircle,
  X, FileText, Image as ImageIcon, Calendar, Eye,
  Filter, ChevronDown, RefreshCw, SortAsc, SortDesc,
} from "lucide-react";

export default function Blogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "display_id", direction: "desc" });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: "all" });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");
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

  useEffect(() => { fetchBlogs(); }, []);

  useEffect(() => {
    let result = [...blogs];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((blog) =>
        (blog.title && blog.title.toLowerCase().includes(q)) ||
        (blog.short_description && blog.short_description.toLowerCase().includes(q)) ||
        (blog.status && blog.status.toLowerCase().includes(q)) ||
        (blog.content && blog.content.toLowerCase().includes(q)) ||
        blog.display_id.toString().includes(q)
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
      if (sortConfig.key === "display_id") { aVal = a.display_id || 0; bVal = b.display_id || 0; }
      else if (sortConfig.key === "title") { aVal = a.title?.toLowerCase() || ""; bVal = b.title?.toLowerCase() || ""; }
      else if (sortConfig.key === "publish_date") { aVal = a.publish_date || ""; bVal = b.publish_date || ""; }
      else if (sortConfig.key === "status") { aVal = a.status?.toLowerCase() || ""; bVal = b.status?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredBlogs(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, blogs]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({ key, direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc" }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} className="text-violet-500" />
      : <SortDesc size={13} className="text-violet-500" />;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ status: "all" });
    setSortConfig({ key: "display_id", direction: "desc" });
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
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/blogs/${blogToDelete.id}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setDeleteSuccess("Blog deleted successfully!");
        fetchBlogs();
        setTimeout(() => { setShowDeleteModal(false); setBlogToDelete(null); setDeleteSuccess(""); }, 1500);
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete blog.");
        } catch { setDeleteError(`HTTP Error: ${response.status}`); }
      }
    } catch { setDeleteError("Network error. Please try again."); }
    finally { setDeleteLoading(false); }
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "published" || s === "active") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  const activeFiltersCount = [
    filters.status !== "all",
    sortConfig.key !== "display_id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-medium">Loading blogs…</p>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {blogs.length}
            </span>
          </div>
          <p className="text-slate-500 text-sm">Manage your blog posts and articles</p>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, description, status or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
              title="Reset filters"
            >
              <RefreshCw size={15} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Add Blog */}
            <button
              onClick={() => navigate("/add-blog")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium whitespace-nowrap shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Add Blog
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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

        {/* ── Table / Empty state ── */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No blogs found</h3>
            <p className="text-slate-400 text-sm mb-5">
              {searchTerm || filters.status !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first blog post."}
            </p>
            <button
              onClick={() => navigate("/add-blog")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium"
            >
              <Plus size={15} /> Add Blog
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-14"
                      onClick={() => handleSort("display_id")}
                    >
                      <span className="flex items-center gap-1"># {getSortIcon("display_id")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-14">
                      Image
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("title")}
                    >
                      <span className="flex items-center gap-1">Title {getSortIcon("title")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                      Description
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
                      onClick={() => handleSort("publish_date")}
                    >
                      <span className="flex items-center gap-1">Date {getSortIcon("publish_date")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("status")}
                    >
                      <span className="flex items-center gap-1">Status {getSortIcon("status")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBlogs.map((blog, index) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedBlog(blog); setShowViewModal(true); }}
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Image */}
                      <td className="px-5 py-4">
                        <div className="w-11 h-11 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0">
                          {blog.featured_image ? (
                            <img
                              src={`https://codingcloud.pythonanywhere.com${blog.featured_image}`}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80?text=?"; }}
                            />
                          ) : (
                            <ImageIcon size={16} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-5 py-4">
                        <div>
                          <span className="text-sm font-semibold text-slate-800 line-clamp-1 block max-w-[200px]">
                            {blog.title}
                          </span>
                          {/* Show description on small screens */}
                          <span className="text-xs text-slate-400 lg:hidden line-clamp-1 max-w-[200px] block mt-0.5">
                            {blog.short_description || blog.content?.substring(0, 80) || "No description"}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-400 line-clamp-1 max-w-[220px] block">
                          {blog.short_description || blog.content?.substring(0, 100) || (
                            <span className="italic">No description</span>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {blog.publish_date ? (
                          <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                            {new Date(blog.publish_date).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyles(blog.status)}`}>
                          {blog.status || "Draft"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedBlog(blog); setShowViewModal(true); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit-blog/${blog.id}`, { state: { blog } }); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, blog)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredBlogs.length)}</span> of <span className="text-slate-700 font-semibold">{filteredBlogs.length}</span> blogs
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage <= 3) page = i + 1;
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                      else page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-violet-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Blog Modal ── */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden max-h-[90vh] flex flex-col">

            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10"
            >
              <X size={16} />
            </button>

            {/* Featured Image banner */}
            <div className="w-full h-44 bg-slate-100 flex-shrink-0 overflow-hidden">
              {selectedBlog.featured_image ? (
                <img
                  src={`https://codingcloud.pythonanywhere.com${selectedBlog.featured_image}`}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x200?text=No+Image"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={40} className="text-slate-300" />
                </div>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Title + status */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedBlog.title}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">Blog #{selectedBlog.display_id}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusStyles(selectedBlog.status)}`}>
                  {selectedBlog.status || "Draft"}
                </span>
              </div>

              {/* Publish date */}
              {selectedBlog.publish_date && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar size={11} className="text-violet-500" /> Publish Date
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(selectedBlog.publish_date).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Short description */}
              {selectedBlog.short_description && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Short Description</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedBlog.short_description}</p>
                </div>
              )}

              {/* Content */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Content</p>
                <div className="max-h-52 overflow-y-auto">
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedBlog.content || "No content available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowViewModal(false); navigate(`/edit-blog/${selectedBlog.id}`, { state: { blog: selectedBlog } }); }}
                className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
              >
                <Edit size={14} /> Edit Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
            <button
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Blog</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete <span className="font-semibold text-slate-700">"{blogToDelete.title}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700">{deleteSuccess}</p>
              </div>
            )}
            {deleteError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <><Trash2 size={14} /> Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
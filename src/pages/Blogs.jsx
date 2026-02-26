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
    Search,
    Plus,
    Edit,
    Trash2,
    AlertCircle,
    CheckCircle,
    X,
    FileText,
    Image as ImageIcon,
    Calendar,
    Eye,
    Filter,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    SortAsc,
    SortDesc,
    Tag,
    User
} from "lucide-react";

export default function Blogs() {
    const navigate = useNavigate();

    // State for data
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: "all", // 'all', 'published', 'draft'
    });

    // View Modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [deleteError, setDeleteError] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch initial data
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");

            if (response.ok) {
                const blogsData = await response.json();
                const actualBlogs = blogsData.data || blogsData;
                const blogsList = Array.isArray(actualBlogs) ? actualBlogs : [];
                
                // Add display_id for sequential numbering
                const blogsWithDisplayIds = blogsList.map((blog, index) => ({
                    ...blog,
                    display_id: index + 1
                }));
                
                setBlogs(blogsWithDisplayIds);
                setFilteredBlogs(blogsWithDisplayIds);
            } else {
                setError("Failed to fetch blog data.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Filter and sort blogs
    useEffect(() => {
        let result = [...blogs];

        // Apply search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter((blog) => {
                return (
                    (blog.title && blog.title.toLowerCase().includes(lowerSearch)) ||
                    (blog.short_description && blog.short_description.toLowerCase().includes(lowerSearch)) ||
                    (blog.status && blog.status.toLowerCase().includes(lowerSearch)) ||
                    (blog.content && blog.content.toLowerCase().includes(lowerSearch)) ||
                    blog.display_id.toString().includes(lowerSearch)
                );
            });
        }

        // Apply status filter
        if (filters.status !== "all") {
            result = result.filter((blog) => {
                const status = blog.status?.toLowerCase() || 'draft';
                return filters.status === status;
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === "display_id") {
                aValue = a.display_id || 0;
                bValue = b.display_id || 0;
            } else if (sortConfig.key === "title") {
                aValue = a.title?.toLowerCase() || "";
                bValue = b.title?.toLowerCase() || "";
            } else if (sortConfig.key === "publish_date") {
                aValue = a.publish_date || "";
                bValue = b.publish_date || "";
            } else if (sortConfig.key === "status") {
                aValue = a.status?.toLowerCase() || "";
                bValue = b.status?.toLowerCase() || "";
            }

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        setFilteredBlogs(result);
        setCurrentPage(1);
    }, [searchTerm, filters, sortConfig, blogs]);

    // Handle sort
    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
        }));
    };

    // Get sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <SortAsc size={14} className="text-gray-400" />;
        return sortConfig.direction === "asc"
            ? <SortAsc size={14} className="text-indigo-600" />
            : <SortDesc size={14} className="text-indigo-600" />;
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setFilters({ status: "all" });
        setSortConfig({ key: "id", direction: "desc" });
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

    // Modal handlers
    const handleView = (blog) => {
        setSelectedBlog(blog);
        setShowViewModal(true);
    };

    const handleEdit = (blog) => {
        navigate(`/edit-blog/${blog.id}`, { state: { blog } });
    };

    const handleDeleteClick = (blog) => {
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
                {
                    method: "DELETE",
                }
            );

            if (response.ok || response.status === 204) {
                setDeleteSuccess("Blog deleted successfully!");
                fetchBlogs(); // Refresh list
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setBlogToDelete(null);
                    setDeleteSuccess("");
                }, 1500);
            } else {
                try {
                    const data = await response.json();
                    setDeleteError(data.message || "Failed to delete blog.");
                } catch {
                    setDeleteError(`HTTP Error: ${response.status}`);
                }
            }
        } catch (err) {
            console.error("Error deleting blog:", err);
            setDeleteError("Network error. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Stats
    const publishedCount = blogs.filter(b => b.status?.toLowerCase() === 'published' || b.status?.toLowerCase() === 'active').length;
    const draftCount = blogs.filter(b => !b.status || b.status?.toLowerCase() === 'draft').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading Blogs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <X size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blogs</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage your blog posts and articles
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/add-blog")}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span>Add Blog</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search by title, description, status, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                                showFilters
                                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* Reset Button */}
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Items Per Page
                                </label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                {/* Blogs Table */}
                {filteredBlogs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <FileText size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Blogs found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filters.status !== "all"
                                ? "Try adjusting your filters"
                                : "Get started by adding your first blog post"}
                        </p>
                        <button
                            onClick={() => navigate("/add-blog")}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Blog
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-16"
                                                onClick={() => handleSort('display_id')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    # {getSortIcon('display_id')}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Title {getSortIcon('title')}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('publish_date')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Date {getSortIcon('publish_date')}
                                                </div>
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('status')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Status {getSortIcon('status')}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedBlogs.map((blog) => (
                                            <tr
                                                key={blog.id}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => handleView(blog)}
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    #{blog.display_id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                                        {blog.featured_image ? (
                                                            <img
                                                                src={`https://codingcloud.pythonanywhere.com${blog.featured_image}`}
                                                                alt={blog.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ImageIcon size={16} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {blog.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-500 max-w-xs line-clamp-1">
                                                        {blog.short_description || blog.content?.substring(0, 100) || "No description"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {blog.publish_date ? (
                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            {new Date(blog.publish_date).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                        blog.status === 'Published' || blog.status === 'Active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {blog.status || 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleView(blog);
                                                            }}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(blog);
                                                            }}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit Blog"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(blog);
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Blog"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBlogs.length)} of {filteredBlogs.length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* View Blog Modal */}
            {showViewModal && selectedBlog && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowViewModal(false)}
                            aria-hidden="true"
                        />

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Blog Details
                                    </h3>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Featured Image */}
                                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        {selectedBlog.featured_image ? (
                                            <img
                                                src={`https://codingcloud.pythonanywhere.com${selectedBlog.featured_image}`}
                                                alt={selectedBlog.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/800x200?text=Blog+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Header with Info */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {selectedBlog.title}
                                            </h2>
                                            <p className="text-sm text-gray-500">ID: #{selectedBlog.display_id}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            selectedBlog.status === 'Published' || selectedBlog.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {selectedBlog.status || 'Draft'}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    {selectedBlog.publish_date && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                                <Calendar size={16} />
                                                <span className="text-xs font-medium text-gray-500">Publish Date</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(selectedBlog.publish_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {/* Short Description */}
                                    {selectedBlog.short_description && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Short Description</h4>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                {selectedBlog.short_description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Full Content */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {selectedBlog.content || "No content available."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        navigate(`/edit-blog/${selectedBlog.id}`, {
                                            state: { blog: selectedBlog }
                                        });
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Blog
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowViewModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && blogToDelete && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => !deleteLoading && setShowDeleteModal(false)}
                            aria-hidden="true"
                        />

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Delete Blog
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete the blog post "{blogToDelete.title}"? 
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                        {deleteSuccess && (
                                            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <p className="text-sm text-green-600">{deleteSuccess}</p>
                                            </div>
                                        )}
                                        {deleteError && (
                                            <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                                                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                                                <p className="text-sm text-red-600">{deleteError}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Deleting...
                                        </div>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleteLoading}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
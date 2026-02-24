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
    Calendar
} from "lucide-react";

export default function Blogs() {
    const navigate = useNavigate();

    // State for data
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [deleteError, setDeleteError] = useState("");

    // Fetch initial data
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");

            if (response.ok) {
                const blogsData = await response.json();
                const actualBlogs = blogsData.data || blogsData;
                const blogsList = Array.isArray(actualBlogs) ? actualBlogs : [];
                setBlogs(blogsList);
                setFilteredBlogs(blogsList);
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

    // Filter based on search
    useEffect(() => {
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = blogs.filter((blog) => {
                return (
                    (blog.title && blog.title.toLowerCase().includes(lowerSearch)) ||
                    (blog.short_description && blog.short_description.toLowerCase().includes(lowerSearch)) ||
                    (blog.status && blog.status.toLowerCase().includes(lowerSearch))
                );
            });
            setFilteredBlogs(filtered);
        } else {
            setFilteredBlogs(blogs);
        }
    }, [searchTerm, blogs]);

    // Delete handlers
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

    const handleEdit = (blog) => {
        navigate(`/edit-blog/${blog.id}`, { state: { blog } });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
                        Loading Blogs...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <X size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your blog posts and articles
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/add-blog")}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline font-medium">Add Blog</span>
                        <span className="sm:hidden font-medium">Add</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by title, description, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            </div>

            {/* Blogs List */}
            {filteredBlogs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <FileText size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Blogs found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Try adjusting your search or add a new blog post.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            {/* Image Header */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden group">
                                {blog.featured_image ? (
                                    <img
                                        src={`https://codingcloud.pythonanywhere.com${blog.featured_image}`}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon size={48} className="opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm
                        ${blog.status === 'Published' || blog.status === 'Active'
                                            ? 'bg-green-100/90 text-green-800 border border-green-200/50'
                                            : 'bg-yellow-100/90 text-yellow-800 border border-yellow-200/50'}`}>
                                        {blog.status || 'Draft'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                                        {blog.title}
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                                    {blog.short_description || blog.content?.substring(0, 100) || "No description provided."}
                                </p>

                                {blog.publish_date && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-medium">
                                        <Calendar size={14} />
                                        <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(blog)}
                                        className="px-3 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center justify-center"
                                        aria-label="Delete blog"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && blogToDelete && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="delete-modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
                            onClick={() => !deleteLoading && setShowDeleteModal(false)}
                            aria-hidden="true"
                        />

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="p-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                    <AlertCircle size={32} className="text-red-600" />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                    Delete Blog
                                </h3>

                                <p className="text-sm text-gray-500 text-center mb-6">
                                    Are you sure you want to delete the blog post{" "}
                                    <span className="font-semibold text-gray-900 border-b border-gray-300 pb-0.5">
                                        "{blogToDelete.title}"
                                    </span>
                                    ? This action cannot be undone.
                                </p>

                                {deleteSuccess && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                        <CheckCircle size={16} className="text-green-600" />
                                        <p className="text-sm text-green-600">{deleteSuccess}</p>
                                    </div>
                                )}

                                {deleteError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                        <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                                        <p className="text-sm text-red-600">{deleteError}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={deleteLoading}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        disabled={deleteLoading}
                                        className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete Blog"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

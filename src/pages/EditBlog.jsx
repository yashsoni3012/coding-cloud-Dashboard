import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    X,
    FileText,
    AlertCircle,
    CheckCircle,
    Image as ImageIcon,
    Calendar,
    Tag
} from "lucide-react";

export default function EditBlog() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const locationState = location.state;
    const fileInputRef = useRef(null);

    // State for form data exactly matching API requirements
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        slug: "",
        short_description: "",
        status: "", // default
        publish_date: "", // YYYY-MM-DD
        meta_title: "",
        meta_descrtiption: "", // spelled this way as per the API doc
        meta_keyword: "",
        hashtag: "",
        featured_image: null,
    });

    // UI States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);

    // Status Options
    const statusOptions = ["Drafts", "Published", "Archived"];

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                let blogData = null;

                if (locationState && locationState.blog) {
                    blogData = locationState.blog;
                } else {
                    const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");
                    if (response.ok) {
                        const dataRes = await response.json();
                        const listData = dataRes.data || dataRes;
                        blogData = Array.isArray(listData) ? listData.find(b => b.id === parseInt(id)) : null;
                    }
                }

                if (blogData) {
                    setFormData({
                        title: blogData.title || "",
                        content: blogData.content || "",
                        slug: blogData.slug || "",
                        short_description: blogData.short_description || "",
                        status: blogData.status || "Drafts",
                        publish_date: blogData.publish_date ? blogData.publish_date.split('T')[0] : "",
                        meta_title: blogData.meta_title || "",
                        meta_descrtiption: blogData.meta_descrtiption || "",
                        meta_keyword: blogData.meta_keyword || "",
                        hashtag: blogData.hashtag || "",
                        featured_image: null, // Only set File object on explicit change
                    });

                    if (blogData.featured_image) {
                        const fullImageUrl = `https://codingcloud.pythonanywhere.com${blogData.featured_image}`;
                        setImagePreview(fullImageUrl);
                        setOriginalImage(fullImageUrl);
                    }
                } else {
                    setError("Blog not found.");
                }
            } catch (err) {
                console.error("Error fetching blog details:", err);
                setError("Failed to load blog details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, locationState]);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                featured_image: file,
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            featured_image: null,
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const restoreOriginalImage = () => {
        setFormData((prev) => ({
            ...prev,
            featured_image: null,
        }));
        setImagePreview(originalImage);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Validate form
    const validateForm = () => {
        if (!formData.title.trim()) return "Title is required";
        if (!formData.content.trim()) return "Content is required";
        if (!formData.slug.trim()) return "Slug is required";
        if (!formData.status) return "Status is required";
        if (!formData.publish_date) return "Publish date is required";
        return "";
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = new FormData();
            payload.append("title", formData.title.trim());
            payload.append("content", formData.content.trim());
            payload.append("slug", formData.slug.trim());

            if (formData.short_description !== undefined) {
                payload.append("short_description", formData.short_description.trim());
            }

            payload.append("status", formData.status);

            // Keep date format robust
            const formattedDate = formData.publish_date.includes('T') ? formData.publish_date : `${formData.publish_date}T00:00:00Z`;
            payload.append("publish_date", formattedDate);

            if (formData.meta_title !== undefined) payload.append("meta_title", formData.meta_title.trim());
            if (formData.meta_descrtiption !== undefined) payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
            if (formData.meta_keyword !== undefined) payload.append("meta_keyword", formData.meta_keyword.trim());
            if (formData.hashtag !== undefined) payload.append("hashtag", formData.hashtag.trim());

            // Only append if it's explicitly a new image.
            if (formData.featured_image && formData.featured_image instanceof File) {
                payload.append("featured_image", formData.featured_image);
            }

            const response = await fetch(
                `https://codingcloud.pythonanywhere.com/blogs/${id}/`,
                {
                    method: "PATCH",
                    body: payload,
                }
            );

            // If the response is not ok, parse error
            if (!response.ok) {
                let errorMessage;
                try {
                    const errorText = await response.text();
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
                } catch {
                    errorMessage = `HTTP error ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            setSuccess("Blog updated successfully!");

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/blogs");
            }, 2000);

        } catch (err) {
            console.error("Error updating blog:", err);
            setError(
                err.message ||
                "Failed to update blog. Please check your connection."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
                        Loading detail...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/blogs")}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        type="button"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Update existing blog post article
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/blogs")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <X size={18} />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update Blog
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={16} className="text-red-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-red-800">Error</h4>
                        <p className="text-red-600 text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-green-800">Success!</h4>
                        <p className="text-green-600 text-sm mt-0.5">{success}</p>
                    </div>
                </div>
            )}

            {/* Main Form Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">

                        {/* General Info */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-indigo-600" />
                                    <h2 className="font-semibold text-gray-900">General Information</h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Blog Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter the title of the blog post"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Slug / URL Path <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={(e) => {
                                            // Enforce lowercase and hyphens
                                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                                            setFormData(prev => ({ ...prev, slug: val }));
                                        }}
                                        placeholder="e.g., how-to-learn-react"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                {/* Short Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Short Description
                                    </label>
                                    <textarea
                                        name="short_description"
                                        value={formData.short_description}
                                        onChange={handleInputChange}
                                        rows={2}
                                        placeholder="A brief summary of the blog post"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Main Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Content <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        rows={10}
                                        placeholder="Write the full content of the blog post here..."
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Meta Information Section */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Tag size={18} className="text-indigo-600" />
                                    <h2 className="font-semibold text-gray-900">SEO & Meta Fields</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* meta_descrtiption intentionally misspelled to match backend API format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Meta Description
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_descrtiption"
                                        value={formData.meta_descrtiption}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Meta Keywords
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_keyword"
                                        value={formData.meta_keyword}
                                        onChange={handleInputChange}
                                        placeholder="comma, separated, keywords"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Hashtags
                                    </label>
                                    <input
                                        type="text"
                                        name="hashtag"
                                        value={formData.hashtag}
                                        onChange={handleInputChange}
                                        placeholder="#coding #cloud"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">

                        {/* Publishing Options */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-indigo-600" />
                                    <h2 className="font-semibold text-gray-900">Publishing</h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Publish Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="publish_date"
                                        value={formData.publish_date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <ImageIcon size={18} className="text-indigo-600" />
                                    <h2 className="font-semibold text-gray-900">Featured Image</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <div
                                    className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${formData.featured_image ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100/50'
                                        }`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            handleImageChange({ target: { files: e.dataTransfer.files } });
                                        }
                                    }}
                                >
                                    <div className="space-y-1 text-center w-full">
                                        {imagePreview ? (
                                            <div className="relative w-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="mx-auto h-40 w-full object-cover rounded-md shadow-sm border border-gray-200"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                                                    }}
                                                />
                                                <div className="mt-3 flex justify-center gap-2">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="cursor-pointer bg-white border border-gray-300 rounded-md font-medium text-indigo-600 hover:text-indigo-500 hover:bg-gray-50 px-3 py-1.5 text-xs transition-colors"
                                                    >
                                                        <span onClick={triggerFileInput}>Change</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            ref={fileInputRef}
                                                            onChange={handleImageChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    {formData.featured_image && originalImage && (
                                                        <button
                                                            type="button"
                                                            onClick={restoreOriginalImage}
                                                            className="bg-white border border-gray-300 rounded-md font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 text-xs transition-colors"
                                                        >
                                                            Restore
                                                        </button>
                                                    )}
                                                    {!formData.featured_image && (
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="bg-white border border-gray-300 rounded-md font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 text-xs transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600 justify-center mt-4">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-2 py-0.5"
                                                    >
                                                        <span onClick={triggerFileInput}>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            ref={fileInputRef}
                                                            onChange={handleImageChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1 flex items-center">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    PNG, JPG or WEBP up to 5MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Submit Button (Mobile) */}
                <div className="block sm:hidden">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update Blog
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

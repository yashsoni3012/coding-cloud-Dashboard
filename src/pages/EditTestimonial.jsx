import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Star,
    User,
    MessageSquare,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle2,
    Upload,
    Trash2,
    X,
    Layers,
    ChevronDown,
} from "lucide-react";

export default function EditTestimonial() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        review: "",
        rating: 5,
        image: null,
        category: "",
        existingImage: null,
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        fetchTestimonial();
        fetchCategories();
    }, [id]);

    const fetchTestimonial = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://codingcloud.pythonanywhere.com/testimonials/${id}/`);
            if (response.ok) {
                const data = await response.json();
                const testimonial = data.data || data;
                setFormData({
                    name: testimonial.name || "",
                    review: testimonial.review || "",
                    rating: testimonial.rating || 5,
                    image: null,
                    category: testimonial.category || testimonial.category_id || "",
                    existingImage: testimonial.image || null,
                });
                if (testimonial.image && !testimonial.image.includes("default.jpg")) {
                    const imageUrl = testimonial.image.startsWith("http")
                        ? testimonial.image
                        : `https://codingcloud.pythonanywhere.com${testimonial.image}`;
                    setImagePreview(imageUrl);
                }
            } else {
                setFetchError("Failed to fetch testimonial details.");
            }
        } catch (err) {
            console.error("Error fetching testimonial:", err);
            setFetchError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await fetch("https://codingcloud.pythonanywhere.com/category/");
            const data = await response.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (err) {
            console.error("Category fetch error:", err);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rating" || name === "category" ? parseInt(value) || 0 : value,
        }));
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) { setError("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)"); return; }
            if (file.size > 5 * 1024 * 1024) { setError("Image size should be less than 5MB"); return; }
            setFormData((prev) => ({ ...prev, image: file }));
            setImageChanged(true);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageChange({ target: { files: [file] } });
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: null, existingImage: null }));
        setImagePreview(null);
        setImageChanged(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validateForm = () => {
        if (!formData.name.trim()) { setError("Name is required"); return false; }
        if (!formData.review.trim()) { setError("Review is required"); return false; }
        if (formData.rating < 1 || formData.rating > 5) { setError("Rating must be between 1 and 5"); return false; }
        return true;
    };

    const handleRatingClick = (rating) => setFormData((prev) => ({ ...prev, rating }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        setError("");
        setSuccess("");
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name.trim());
            formDataToSend.append("review", formData.review.trim());
            formDataToSend.append("rating", formData.rating.toString());
            formDataToSend.append("category_id", formData.category.toString());
            if (imageChanged) {
                if (formData.image) formDataToSend.append("image", formData.image);
                else formDataToSend.append("image", "");
            }
            const response = await fetch(`https://codingcloud.pythonanywhere.com/testimonials/${id}/`, { method: "PATCH", body: formDataToSend });
            const responseText = await response.text();
            let data;
            try { data = JSON.parse(responseText); } catch { throw new Error("Server returned invalid response"); }
            if (response.ok) {
                setSuccess("Testimonial updated successfully!");
                setTimeout(() => navigate("/testimonials"), 1500);
            } else {
                setError(data.message || data.error || "Failed to update testimonial. Please try again.");
            }
        } catch (err) {
            console.error("Error updating testimonial:", err);
            setError(err.message || "Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const isNewImage = formData.image instanceof File;
    const selectedCategory = categories.find((c) => c.id === formData.category);

    // ── Loading State ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-medium">Loading testimonial…</p>
                </div>
            </div>
        );
    }

    // ── Fetch Error State ──
    if (fetchError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-2">Failed to load testimonial</h3>
                    <p className="text-sm text-gray-500 mb-6">{fetchError}</p>
                    <button
                        onClick={() => navigate("/testimonials")}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all"
                    >
                        Back to Testimonials
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Header ── */}
            <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit Testimonial</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">ID: {id} · Update customer feedback</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    Update Testimonial
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Error Alert */}
                {error && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <div className="flex-1">
                            <p className="font-semibold">Error</p>
                            <p className="mt-0.5">{error}</p>
                        </div>
                        <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700">
                        <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
                        <span className="font-medium">{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Name Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Full name of the person giving the testimonial</p>
                            </div>
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* ── Rating Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Star size={16} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Rating <span className="text-red-500">*</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">Click a star to update the rating</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingClick(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-0.5 hover:scale-110 transition-transform outline-none"
                                    >
                                        <Star
                                            size={28}
                                            fill={star <= (hoveredRating || formData.rating) ? "#fbbf24" : "none"}
                                            color={star <= (hoveredRating || formData.rating) ? "#fbbf24" : "#d1d5db"}
                                            className="transition-all"
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700 ml-1">
                                {formData.rating} / 5
                            </span>
                            <span className={`ml-auto px-3 py-1 text-xs font-semibold rounded-full ${
                                formData.rating === 5 ? "bg-emerald-100 text-emerald-700" :
                                formData.rating === 4 ? "bg-green-100 text-green-700" :
                                formData.rating === 3 ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                            }`}>
                                {formData.rating === 5 ? "Excellent" : formData.rating === 4 ? "Good" : formData.rating === 3 ? "Average" : formData.rating === 2 ? "Poor" : "Very Poor"}
                            </span>
                        </div>
                    </div>

                    {/* ── Review Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MessageSquare size={16} className="text-violet-600" />
                            </div>
                            <div>
                                <label htmlFor="review" className="block text-sm font-semibold text-gray-800">
                                    Review <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Customer's feedback about the course</p>
                            </div>
                        </div>
                        <textarea
                            id="review"
                            name="review"
                            value={formData.review}
                            onChange={handleChange}
                            placeholder="Write the customer's review…"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
                            required
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">{formData.review.length} characters</p>
                    </div>

                    {/* ── Category Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Layers size={16} className="text-pink-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">Course / Category</label>
                                <p className="text-xs text-gray-400 mt-0.5">Select the associated course or category</p>
                            </div>
                        </div>

                        {categoriesLoading ? (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
                                <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
                                Loading categories…
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">— Select a category —</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                {selectedCategory && (
                                    <div className="mt-3 flex items-center gap-2 p-3 bg-pink-50 border border-pink-100 rounded-xl">
                                        <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Layers size={12} className="text-pink-500" />
                                        </div>
                                        <p className="text-xs text-pink-700">
                                            <span className="font-semibold">Selected:</span> {selectedCategory.name}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── Profile Image Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <ImageIcon size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Profile Image</p>
                                <p className="text-xs text-gray-400 mt-0.5">Optional · Change or remove existing image</p>
                            </div>
                        </div>

                        {!imagePreview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
                                    dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${dragOver ? "bg-indigo-100" : "bg-gray-100"}`}>
                                    <Upload size={20} className={dragOver ? "text-indigo-500" : "text-gray-400"} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                    {dragOver ? "Drop your image here!" : "Click to upload or drag & drop"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    <span className="text-indigo-500 font-medium">Browse files</span> · PNG, JPG, GIF, WEBP up to 5MB
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-5">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200 shadow-sm"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/96?text=Error"; }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                <div className="min-w-0">
                                    {isNewImage ? (
                                        <>
                                            <p className="text-xs font-semibold text-emerald-600 mb-0.5">✓ New image selected — will replace existing</p>
                                            <p className="text-xs text-gray-400 truncate">{formData.image?.name}</p>
                                            <p className="text-xs text-gray-400">{formData.image ? (formData.image.size / 1024).toFixed(1) + " KB" : ""}</p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-500 font-medium mb-1">Current image</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* ── Live Preview Card ── */}
                    {(formData.name || formData.review) && (
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-4">Preview</p>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                                <div className="flex items-center gap-3 mb-3">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => { e.target.onerror = null; }} />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <User size={16} className="text-indigo-500" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {formData.name || <span className="text-gray-400 font-normal italic">Customer Name</span>}
                                        </p>
                                        {selectedCategory && (
                                            <p className="text-xs text-gray-400 truncate">{selectedCategory.name}</p>
                                        )}
                                    </div>
                                    <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={12} fill={s <= formData.rating ? "#fbbf24" : "none"} color={s <= formData.rating ? "#fbbf24" : "#d1d5db"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                    {formData.review || <span className="italic text-gray-400">No review written yet…</span>}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Mobile Submit ── */}
                    <div className="sm:hidden">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Update Testimonial
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
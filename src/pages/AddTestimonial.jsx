import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    HelpCircle,
    Layers,
    ChevronDown,
} from "lucide-react";

export default function AddTestimonial() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        review: "",
        rating: 5,
        image: null,
        course: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setCoursesLoading(true);
            const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
            if (!response.ok) throw new Error("Failed to fetch courses");
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setCourses(data.data);
                if (data.data.length > 0) {
                    setFormData((prev) => ({ ...prev, course: data.data[0].id }));
                }
            } else {
                throw new Error("Invalid courses format");
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
            setCoursesError("Failed to load courses. Please refresh the page.");
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rating" || name === "course" ? parseInt(value) || 0 : value,
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
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validateForm = () => {
        if (!formData.name.trim()) { setError("Name is required"); return false; }
        if (!formData.review.trim()) { setError("Review is required"); return false; }
        if (formData.rating < 1 || formData.rating > 5) { setError("Rating must be between 1 and 5"); return false; }
        if (!formData.course) { setError("Please select a course"); return false; }
        return true;
    };

    const handleRatingClick = (rating) => setFormData((prev) => ({ ...prev, rating }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name.trim());
            formDataToSend.append("review", formData.review.trim());
            formDataToSend.append("rating", formData.rating.toString());
            formDataToSend.append("course_id", formData.course.toString());
            if (formData.image) formDataToSend.append("image", formData.image);

            const response = await fetch("https://codingcloud.pythonanywhere.com/testimonials/", { method: "POST", body: formDataToSend });
            const responseText = await response.text();
            let data;
            try { data = JSON.parse(responseText); } catch { throw new Error("Server returned invalid response"); }

            if (response.ok) {
                setSuccess("Testimonial added successfully!");
                setFormData({ name: "", review: "", rating: 5, image: null, course: courses.length > 0 ? courses[0].id : "" });
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setTimeout(() => navigate("/testimonials"), 1500);
            } else {
                setError(data.message || data.error || "Failed to add testimonial. Please try again.");
            }
        } catch (err) {
            console.error("Error adding testimonial:", err);
            setError(err.message || "Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const selectedCourse = courses.find((c) => c.id === formData.course);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Header ── */}
            <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Add New Testimonial</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Create a customer testimonial</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                       
                        <button
                            onClick={handleSubmit}
                            disabled={loading || coursesLoading || !formData.course}
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    Save Testimonial
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Courses Error */}
                {coursesError && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <div className="flex-1">
                            <p className="font-semibold">Error</p>
                            <p className="mt-0.5">{coursesError}</p>
                        </div>
                        <button onClick={() => setCoursesError("")} className="text-red-400 hover:text-red-600 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <span className="flex-1">{error}</span>
                        <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
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
                                <label htmlFor="name" className="block text-base font-semibold text-gray-800">
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
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
                                <p className="text-base font-semibold text-gray-800">
                                    Rating <span className="text-red-500">*</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">Click a star to set the rating</p>
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
                            <span className="text-base font-semibold text-gray-700 ml-1">
                                {formData.rating} / 5
                            </span>
                            <span className={`ml-auto px-3 py-1 text-xs font-semibold rounded-full ${
                                formData.rating === 5 ? "bg-emerald-100 text-emerald-700" :
                                formData.rating >= 4 ? "bg-green-100 text-green-700" :
                                formData.rating >= 3 ? "bg-yellow-100 text-yellow-700" :
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
                                <label htmlFor="review" className="block text-base font-semibold text-gray-800">
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
                            required
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">{formData.review.length} characters</p>
                    </div>

                    {/* ── Course Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Layers size={16} className="text-pink-500" />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800">
                                    Course <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Select the course this testimonial is for</p>
                            </div>
                        </div>

                        {coursesLoading ? (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-500">
                                <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
                                Loading courses…
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">— Select a course —</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.name} ({course.category_details?.name || "No Category"})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                {selectedCourse && (
                                    <div className="mt-3 flex items-center gap-2 p-3 bg-pink-50 border border-pink-100 rounded-xl">
                                        <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Layers size={12} className="text-pink-500" />
                                        </div>
                                        <p className="text-xs text-pink-700">
                                            <span className="font-semibold">Selected:</span> {selectedCourse.name}
                                            {selectedCourse.category_details?.name && (
                                                <span className="text-pink-400 ml-1">· {selectedCourse.category_details.name}</span>
                                            )}
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
                                <p className="text-base font-semibold text-gray-800">Profile Image</p>
                                <p className="text-xs text-gray-400 mt-0.5">Optional · PNG, JPG, GIF, WEBP up to 5MB</p>
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
                                <p className="text-base font-semibold text-gray-700 mb-1">
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
                                    <p className="text-base font-semibold text-gray-800 truncate">{formData.image?.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formData.image ? (formData.image.size / 1024).toFixed(1) + " KB" : ""}
                                    </p>
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

                    {/* ── Mobile Submit ── */}
                    <div className="sm:hidden">
                        <button
                            type="submit"
                            disabled={loading || coursesLoading || !formData.course}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Testimonial
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
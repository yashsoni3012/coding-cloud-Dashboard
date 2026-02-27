// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     ArrowLeft,
//     Save,
//     X,
//     FolderPlus,
//     HelpCircle,
//     CheckCircle,
//     AlertCircle,
//     Image as ImageIcon,
//     Upload,
// } from "lucide-react";

// export default function AddCategory() {
//     const navigate = useNavigate();
//     const fileInputRef = useRef(null);

//     // State for form data
//     const [formData, setFormData] = useState({
//         name: "",
//         text: "",
//         image: null,
//     });

//     // UI States
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);

//     // Handle text input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//         setError("");
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (!file.type.startsWith("image/")) {
//                 setError("Please select a valid image file");
//                 return;
//             }

//             setFormData((prev) => ({
//                 ...prev,
//                 image: file,
//             }));

//             // Create preview URL
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//             setError("");
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     const removeImage = () => {
//         setFormData((prev) => ({
//             ...prev,
//             image: null,
//         }));
//         setImagePreview(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     // Validate form
//     const validateForm = () => {
//         if (!formData.name.trim()) {
//             return "Category name is required";
//         }
//         return "";
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validate
//         const validationError = validateForm();
//         if (validationError) {
//             setError(validationError);
//             return;
//         }

//         setSaving(true);
//         setError("");
//         setSuccess("");

//         try {
//             // Create FormData object since we are likely sending a file
//             const payload = new FormData();
//             payload.append("name", formData.name.trim());

//             if (formData.text.trim()) {
//                 payload.append("text", formData.text.trim());
//             }

//             if (formData.image) {
//                 payload.append("image", formData.image);
//             }

//             const response = await fetch(
//                 "https://codingcloud.pythonanywhere.com/category/",
//                 {
//                     method: "POST",
//                     body: payload, // Browser automatically sets Content-Type to multipart/form-data
//                 }
//             );

//             // If the response is not ok, try to get the error details
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 let errorMessage;
//                 try {
//                     const errorData = JSON.parse(errorText);
//                     errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
//                 } catch {
//                     errorMessage = errorText || `HTTP error ${response.status}`;
//                 }
//                 throw new Error(errorMessage);
//             }

//             setSuccess("Category created successfully!");

//             // Reset form
//             setFormData({
//                 name: "",
//                 text: "",
//                 image: null,
//             });
//             setImagePreview(null);
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = '';
//             }

//             // Redirect after 2 seconds
//             setTimeout(() => {
//                 navigate("/categories");
//             }, 2000);

//         } catch (err) {
//             console.error("Error creating category:", err);
//             setError(
//                 err.message ||
//                 "Failed to create category. Please check the API endpoint."
//             );
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <div className="space-y-6 pb-12">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => navigate("/categories")}
//                         className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//                         type="button"
//                     >
//                         <ArrowLeft size={20} className="text-gray-600" />
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
//                         <p className="text-gray-500 text-sm mt-1">
//                             Create a new category with an image and description
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex gap-3">
//                     <button
//                         type="button"
//                         onClick={() => navigate("/categories")}
//                         className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
//                     >
//                         <X size={18} />
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={saving}
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
//                     >
//                         {saving ? (
//                             <>
//                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 Saving...
//                             </>
//                         ) : (
//                             <>
//                                 <Save size={18} />
//                                 Save Category
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* Messages */}
//             {error && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
//                     <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <AlertCircle size={16} className="text-red-600" />
//                     </div>
//                     <div>
//                         <h4 className="font-medium text-red-800">Error</h4>
//                         <p className="text-red-600 text-sm mt-0.5">{error}</p>
//                     </div>
//                 </div>
//             )}

//             {success && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-pulse">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <CheckCircle size={16} className="text-green-600" />
//                     </div>
//                     <div>
//                         <h4 className="font-medium text-green-800">Success!</h4>
//                         <p className="text-green-600 text-sm mt-0.5">{success}</p>
//                     </div>
//                 </div>
//             )}

//             {/* Main Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    

//                     <div className="p-6 space-y-6">
//                         {/* Category Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Category Name <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 placeholder="e.g., IT and Software, Graphic Design"
//                                 className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                 required
//                             />
//                         </div>

//                         {/* Category Text/Description */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Category Description
//                             </label>
//                             <textarea
//                                 name="text"
//                                 value={formData.text}
//                                 onChange={handleInputChange}
//                                 rows={4}
//                                 placeholder="Enter a brief description for this category..."
//                                 className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
//                             ></textarea>
//                         </div>

//                         {/* Category Image Upload */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Category Image
//                             </label>

//                             <div
//                                 className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${imagePreview ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100/50'
//                                     }`}
//                                 onDragOver={(e) => e.preventDefault()}
//                                 onDrop={(e) => {
//                                     e.preventDefault();
//                                     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//                                         handleImageChange({ target: { files: e.dataTransfer.files } });
//                                     }
//                                 }}
//                             >
//                                 <div className="space-y-1 text-center w-full">
//                                     {imagePreview ? (
//                                         <div className="relative w-full max-w-sm mx-auto">
//                                             <img
//                                                 src={imagePreview}
//                                                 alt="Preview"
//                                                 className="mx-auto h-48 w-full object-cover rounded-md shadow-sm border border-gray-200"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={removeImage}
//                                                 className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200 transition-colors shadow-sm"
//                                             >
//                                                 <X size={16} />
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//                                             <div className="flex text-sm text-gray-600 justify-center mt-4">
//                                                 <label
//                                                     htmlFor="file-upload"
//                                                     className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-0.5"
//                                                 >
//                                                     <span onClick={triggerFileInput}>Upload a file</span>
//                                                     <input
//                                                         id="file-upload"
//                                                         name="file-upload"
//                                                         type="file"
//                                                         className="sr-only"
//                                                         ref={fileInputRef}
//                                                         onChange={handleImageChange}
//                                                         accept="image/*"
//                                                     />
//                                                 </label>
//                                                 <p className="pl-1">or drag and drop</p>
//                                             </div>
//                                             <p className="text-xs text-gray-500 mt-2">
//                                                 PNG, JPG, GIF up to 5MB
//                                             </p>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Submit Button (Mobile) */}
//                 <div className="block sm:hidden">
//                     <button
//                         type="submit"
//                         disabled={saving}
//                         className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                     >
//                         {saving ? (
//                             <>
//                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 Saving...
//                             </>
//                         ) : (
//                             <>
//                                 <Save size={18} />
//                                 Save Category
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, ImagePlus, CheckCircle2, AlertCircle, Tag, FileText, Link2 } from "lucide-react";

export default function AddCategory() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({ 
        name: "", 
        text: "", 
        image: null,
        slug: "" 
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    // Auto-generate slug from name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-'); // Replace multiple hyphens with single hyphen
    };

    const handleNameChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            name: value,
            // Auto-generate slug only if slug field is empty or if it was previously auto-generated
            slug: prev.slug === generateSlug(prev.name) || !prev.slug ? generateSlug(value) : prev.slug
        }));
        setError("");
    };

    const processFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) { setError("Please select a valid image file"); return; }
        if (file.size > 5 * 1024 * 1024) { setError("Image must be less than 5MB"); return; }
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setError("");
    };

    const handleImageChange = (e) => processFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        processFile(e.dataTransfer.files[0]);
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) { setError("Category name is required"); return; }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = new FormData();
            payload.append("name", formData.name.trim());
            if (formData.text.trim()) payload.append("text", formData.text.trim());
            if (formData.image) payload.append("image", formData.image);
            if (formData.slug.trim()) payload.append("slug", formData.slug.trim());

            const response = await fetch("https://codingcloud.pythonanywhere.com/category/", { method: "POST", body: payload });
            if (!response.ok) throw new Error("Failed to create category");

            setSuccess("Category created successfully!");
            setTimeout(() => navigate("/category"),);
        } catch (err) {
            setError(err.message || "Failed to create category");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Header ── */}
            <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                    {/* Left: back + title */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/category")}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back</span>
                        </button>

                        <div className="w-px h-6 bg-gray-200" />

                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Add Category</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Create a new content category</p>
                        </div>
                    </div>

                    {/* Right: save button (desktop only) */}
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                Save Category
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Error Alert */}
                {error && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700">
                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Category Name Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Tag size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Choose a clear, descriptive name</p>
                            </div>
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder="e.g., Web Development, Design, Marketing…"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* ── Slug Card (New Field) ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Link2 size={16} className="text-amber-600" />
                            </div>
                            <div>
                                <label htmlFor="slug" className="block text-sm font-semibold text-gray-800">
                                    Slug
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">URL-friendly version of the name (auto-generated from name)</p>
                            </div>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                            <input
                                id="slug"
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder="web-development"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Slug is used in URLs. Only lowercase letters, numbers, and hyphens allowed.
                        </p>
                    </div>

                    {/* ── Description Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText size={16} className="text-violet-600" />
                            </div>
                            <div>
                                <label htmlFor="text" className="block text-sm font-semibold text-gray-800">
                                    Description
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Optional — give context about this category</p>
                            </div>
                        </div>
                        <textarea
                            id="text"
                            name="text"
                            value={formData.text}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Write a brief description about this category…"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
                        />
                        <p className="text-xs text-gray-400 text-right mt-2">{formData.text.length} characters</p>
                    </div>

                    {/* ── Image Upload Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <ImagePlus size={16} className="text-pink-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Cover Image</p>
                                <p className="text-xs text-gray-400 mt-0.5">Optional — PNG, JPG, GIF · Max 5MB</p>
                            </div>
                        </div>

                        {!imagePreview ? (
                            <div
                                onClick={triggerFileInput}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none ${
                                    dragOver
                                        ? "border-indigo-400 bg-indigo-50"
                                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                                }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${
                                    dragOver ? "bg-indigo-100" : "bg-gray-100"
                                }`}>
                                    <Upload size={22} className={dragOver ? "text-indigo-500" : "text-gray-400"} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                    {dragOver ? "Drop your image here!" : "Click to upload or drag & drop"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    <span className="text-indigo-500 font-medium">Browse files</span> · PNG, JPG, GIF up to 5MB
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-h-72 object-cover block"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
                                {/* File name at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 pointer-events-none">
                                    <p className="text-xs text-white/80 font-medium truncate">{formData.image?.name}</p>
                                </div>
                                {/* Change button */}
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
                                >
                                    Change
                                </button>
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
                                >
                                    <X size={15} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    

                    {/* ── Mobile Submit Button ── */}
                    <div className="sm:hidden">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Create Category
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
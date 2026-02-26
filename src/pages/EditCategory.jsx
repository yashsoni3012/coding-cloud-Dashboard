// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//     ArrowLeft,
//     Save,
//     X,
//     FolderOpen,
//     HelpCircle,
//     CheckCircle,
//     AlertCircle,
//     Image as ImageIcon,
//     Upload,
// } from "lucide-react";

// export default function EditCategory() {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const location = useLocation();
//     const locationState = location.state;
//     const fileInputRef = useRef(null);

//     // State for form data
//     const [formData, setFormData] = useState({
//         name: "",
//         text: "",
//         image: null,
//     });

//     // UI States
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const [originalImage, setOriginalImage] = useState(null);

//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 setLoading(true);
//                 let categoryData = null;

//                 // Try getting from state
//                 if (locationState && locationState.category) {
//                     categoryData = locationState.category;
//                 } else {
//                     // Need to fetch individual or from list
//                     const response = await fetch("https://codingcloud.pythonanywhere.com/category/");
//                     if (response.ok) {
//                         const listData = await response.json();
//                         categoryData = listData.find(c => c.id === parseInt(id));
//                     }
//                 }

//                 if (categoryData) {
//                     setFormData({
//                         name: categoryData.name || "",
//                         text: categoryData.text || "",
//                         image: null, // Keep null until user uploads new
//                     });
//                     if (categoryData.image) {
//                         const fullImageUrl = `https://codingcloud.pythonanywhere.com${categoryData.image}`;
//                         setImagePreview(fullImageUrl);
//                         setOriginalImage(fullImageUrl);
//                     }
//                 } else {
//                     setError("Category not found.");
//                 }

//             } catch (err) {
//                 console.error("Error fetching category:", err);
//                 setError("Failed to load category details. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCategory();
//     }, [id, locationState]);

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

//     const restoreOriginalImage = () => {
//         setFormData((prev) => ({
//             ...prev,
//             image: null,
//         }));
//         setImagePreview(originalImage);
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
//             const payload = new FormData();
//             payload.append("name", formData.name.trim());

//             if (formData.text !== undefined && formData.text !== null) {
//                 payload.append("text", formData.text.trim());
//             }

//             // ONLY append image if a new file was actually selected
//             if (formData.image && formData.image instanceof File) {
//                 payload.append("image", formData.image);
//             }

//             const response = await fetch(
//                 `https://codingcloud.pythonanywhere.com/category/${id}/`,
//                 {
//                     method: "PATCH",
//                     body: payload,
//                 }
//             );

//             // If the response is not ok, try to get the error details
//             if (!response.ok) {
//                 let errorMessage;
//                 try {
//                     const errorText = await response.text();
//                     const errorData = JSON.parse(errorText);
//                     errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
//                 } catch {
//                     errorMessage = `HTTP error ${response.status}`;
//                 }
//                 throw new Error(errorMessage);
//             }

//             setSuccess("Category updated successfully!");

//             // Redirect after 2 seconds
//             setTimeout(() => {
//                 navigate("/categories");
//             }, 2000);

//         } catch (err) {
//             console.error("Error updating category:", err);
//             setError(
//                 err.message ||
//                 "Failed to update category. Please check your connection."
//             );
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <div className="relative">
//                     <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//                     <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
//                         Loading category details...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 pb-12">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => navigate("/categories")}
//                         className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//                         type="button"
//                     >
//                         <ArrowLeft size={20} className="text-gray-600" />
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
//                         <p className="text-gray-500 text-sm mt-1">
//                             Update category details and image
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
//                                 Updating...
//                             </>
//                         ) : (
//                             <>
//                                 <Save size={18} />
//                                 Update Category
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
//                                 className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
//                                 className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
//                             ></textarea>
//                         </div>

//                         {/* Category Image Upload */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                                 Category Image
//                             </label>

//                             <div
//                                 className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${formData.image ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100/50'
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
//                                                 onError={(e) => {
//                                                     e.target.onerror = null;
//                                                     e.target.src = 'https://via.placeholder.com/400x300?text=Error';
//                                                 }}
//                                             />
//                                             <div className="mt-2 flex justify-center gap-2">
//                                                 <label
//                                                     htmlFor="file-upload"
//                                                     className="cursor-pointer bg-white border border-gray-300 rounded-md font-medium text-indigo-600 hover:text-indigo-500 hover:bg-gray-50 px-3 py-1 text-xs transition-colors"
//                                                 >
//                                                     <span onClick={triggerFileInput}>Change Image</span>
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
//                                                 {formData.image && originalImage && (
//                                                     <button
//                                                         type="button"
//                                                         onClick={restoreOriginalImage}
//                                                         className="bg-white border border-gray-300 rounded-md font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-1 text-xs transition-colors"
//                                                     >
//                                                         Restore Original
//                                                     </button>
//                                                 )}
//                                                 {!formData.image && (
//                                                     <button
//                                                         type="button"
//                                                         onClick={removeImage}
//                                                         className="bg-white border border-gray-300 rounded-md font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 text-xs transition-colors"
//                                                     >
//                                                         Remove Image
//                                                     </button>
//                                                 )}
//                                             </div>
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
//                                 Updating...
//                             </>
//                         ) : (
//                             <>
//                                 <Save size={18} />
//                                 Update Category
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    X,
    Upload,
    RefreshCw,
} from "lucide-react";

export default function EditCategory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const locationState = location.state;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        text: "",
        image: null,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                let categoryData = null;

                if (locationState && locationState.category) {
                    categoryData = locationState.category;
                } else {
                    const response = await fetch("https://codingcloud.pythonanywhere.com/category/");
                    if (response.ok) {
                        const listData = await response.json();
                        categoryData = listData.find(c => c.id === parseInt(id));
                    }
                }

                if (categoryData) {
                    setFormData({
                        name: categoryData.name || "",
                        text: categoryData.text || "",
                        image: null,
                    });
                    if (categoryData.image) {
                        const fullImageUrl = `https://codingcloud.pythonanywhere.com${categoryData.image}`;
                        setImagePreview(fullImageUrl);
                        setOriginalImage(fullImageUrl);
                    }
                } else {
                    setError("Category not found.");
                }
            } catch (err) {
                setError("Failed to load category details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id, locationState]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB");
                return;
            }

            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const restoreOriginalImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(originalImage);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Category name is required");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = new FormData();
            payload.append("name", formData.name.trim());
            if (formData.text?.trim()) payload.append("text", formData.text.trim());
            if (formData.image instanceof File) payload.append("image", formData.image);

            const response = await fetch(
                `https://codingcloud.pythonanywhere.com/category/${id}/`,
                { method: "PATCH", body: payload }
            );

            if (!response.ok) throw new Error("Failed to update category");

            setSuccess("Category updated successfully!");
            setTimeout(() => navigate("/categories"), 1500);
        } catch (err) {
            setError(err.message || "Failed to update category");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading category details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/categories")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Category</h1>
                                <p className="text-sm text-gray-500 hidden sm:block">Update category details</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span className="hidden sm:inline">Update</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <X size={14} className="text-red-600" />
                        </div>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Save size={14} className="text-green-600" />
                        </div>
                        <p className="text-sm text-green-600">{success}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Web Development, Design, Marketing"
                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Description
                        </label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Write a brief description about this category..."
                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Category Image
                        </label>

                        {!imagePreview ? (
                            <div
                                onClick={triggerFileInput}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-700 font-medium mb-1">Click to upload</p>
                                <p className="text-sm text-gray-500">PNG, JPG, GIF (max 5MB)</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                                        }}
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <Upload size={16} />
                                        Change Image
                                    </button>

                                    {formData.image && originalImage && (
                                        <button
                                            type="button"
                                            onClick={restoreOriginalImage}
                                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <RefreshCw size={16} />
                                            Restore Original
                                        </button>
                                    )}

                                    {!formData.image && originalImage && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <X size={16} />
                                            Remove Image
                                        </button>
                                    )}

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                {formData.image && (
                                    <p className="text-xs text-green-600">
                                        ✓ New image selected (will replace existing)
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Submit Button */}
                    <div className="block sm:hidden">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Update Category
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
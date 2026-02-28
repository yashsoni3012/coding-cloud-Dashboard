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
//                     <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-base whitespace-nowrap">
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
//                         <p className="text-gray-500 text-base mt-1">
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
//                         <p className="text-red-600 text-base mt-0.5">{error}</p>
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
//                         <p className="text-green-600 text-base mt-0.5">{success}</p>
//                     </div>
//                 </div>
//             )}

//             {/* Main Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

//                     <div className="p-6 space-y-6">
//                         {/* Category Name */}
//                         <div>
//                             <label className="block text-base font-medium text-gray-700 mb-1.5">
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
//                             <label className="block text-base font-medium text-gray-700 mb-1.5">
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
//                             <label className="block text-base font-medium text-gray-700 mb-1.5">
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
//                                             <div className="flex text-base text-gray-600 justify-center mt-4">
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
  ImagePlus,
  AlertCircle,
  Tag,
  FileText,
} from "lucide-react";
import Toasts from "../pages/Toasts"; // 👈 import Toasts

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const locationState = location.state;
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null); // for delayed navigation

  const [formData, setFormData] = useState({ name: "", text: "", image: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  }); // 👈 toast state
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Clear timeout if component unmounts while waiting
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        let categoryData = null;

        if (locationState && locationState.category) {
          categoryData = locationState.category;
        } else {
          const response = await fetch(
            "https://codingcloud.pythonanywhere.com/category/",
          );
          if (response.ok) {
            const listData = await response.json();
            categoryData = listData.find((c) => c.id === parseInt(id));
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

  const processFile = (file) => {
    if (!file) return;
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

  const restoreOriginalImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(originalImage);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    // Clear any pending navigation
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setSaving(true);
    setError("");
    setToast({ ...toast, show: false }); // hide any previous toast

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      if (formData.text?.trim()) payload.append("text", formData.text.trim());
      if (formData.image instanceof File)
        payload.append("image", formData.image);

      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/category/${id}/`,
        { method: "PATCH", body: payload },
      );

      if (!response.ok) throw new Error("Failed to update category");

      // Show success toast
      setToast({
        show: true,
        message: "Category updated successfully!",
        type: "success",
      });

      // Navigate after a short delay (so the toast is visible)
      timeoutRef.current = setTimeout(() => {
        navigate("/category");
      }, 1500); // 1.5 seconds
    } catch (err) {
      setError(err.message || "Failed to update category");
      setSaving(false);
    }
    // On success, saving remains true → button stays disabled during the delay
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/category/${categoryId}/`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete category");

      // Show success toast (red background = type "error")
      setToast({
        show: true,
        message: "Category deleted successfully!",
        type: "error", // because our Toasts uses red for error
      });

      // Optionally refresh the list after a short delay
      setTimeout(() => {
        // fetch categories again or remove from local state
        // e.g., setCategories(prev => prev.filter(c => c.id !== categoryId));
      }, 1500); // match toast duration or navigate away
    } catch (err) {
      // handle error (maybe show a different toast)
    }
  };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-base text-gray-500 font-medium">
            Loading category details…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Toast ── */}
      {toast.show && (
      <Toasts
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    )}

      {/* ── Header ── */}
      <header className="top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: back + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/category")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="w-px h-6 bg-gray-200" />

            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Edit Category
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Update category details
              </p>
            </div>
          </div>

          {/* Right: update button (desktop only) */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <Save size={15} />
                Update Category
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0 text-red-500"
            />
            <span>{error}</span>
          </div>
        )}

        {/* Success Toast is now used instead of inline alert */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Category Name Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Tag size={16} className="text-indigo-600" />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-base font-semibold text-gray-800"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Choose a clear, descriptive name
                </p>
              </div>
            </div>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Web Development, Design, Marketing…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              required
            />
          </div>

          {/* ── Description Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-violet-600" />
              </div>
              <div>
                <label
                  htmlFor="text"
                  className="block text-base font-semibold text-gray-800"
                >
                  Description
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Optional — give context about this category
                </p>
              </div>
            </div>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows={4}
              placeholder="Write a brief description about this category…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-2">
              {formData.text.length} characters
            </p>
          </div>

          {/* ── Image Upload Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ImagePlus size={16} className="text-pink-500" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  Cover Image
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Optional — PNG, JPG, GIF · Max 5MB
                </p>
              </div>
            </div>

            {!imagePreview ? (
              /* ── Empty: drag & drop zone ── */
              <div
                onClick={triggerFileInput}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none ${
                  dragOver
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${
                    dragOver ? "bg-indigo-100" : "bg-gray-100"
                  }`}
                >
                  <Upload
                    size={22}
                    className={dragOver ? "text-indigo-500" : "text-gray-400"}
                  />
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">
                  {dragOver
                    ? "Drop your image here!"
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-gray-400">
                  <span className="text-indigo-500 font-medium">
                    Browse files
                  </span>{" "}
                  · PNG, JPG, GIF up to 5MB
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
              /* ── Preview ── */
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-72 object-cover block"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Error";
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />

                  {/* File name / status badge at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 pointer-events-none">
                    {formData.image ? (
                      <p className="text-xs text-emerald-300 font-semibold">
                        ✓ New image selected — will replace existing
                      </p>
                    ) : (
                      <p className="text-xs text-white/70 font-medium">
                        Current image
                      </p>
                    )}
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

                {/* Action buttons row */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Upload size={14} />
                    Change Image
                  </button>

                  {formData.image && originalImage && (
                    <button
                      type="button"
                      onClick={restoreOriginalImage}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-all border border-gray-200"
                    >
                      <RefreshCw size={14} />
                      Restore Original
                    </button>
                  )}

                  {!formData.image && originalImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-semibold transition-all"
                    >
                      <X size={14} />
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Live Preview Summary ── */}
          {(formData.name || formData.text || imagePreview) && (
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">
                Preview
              </p>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white shadow-sm"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Tag size={18} className="text-indigo-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-800 truncate">
                    {formData.name || (
                      <span className="text-gray-400 font-normal italic">
                        Untitled Category
                      </span>
                    )}
                  </p>
                  {formData.text && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {formData.text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Mobile Submit Button ── */}
          <div className="sm:hidden">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Category
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

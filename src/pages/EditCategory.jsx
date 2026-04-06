

// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   Upload,
//   RefreshCw,
//   ImagePlus,
//   AlertCircle,
//   Tag,
//   FileText,
//   Link2,
// } from "lucide-react";
// import Toasts from "../pages/Toasts";

// // Fetch function for a single category (uses location state if available, otherwise fetches all)
// const fetchCategory = async (id, locationState) => {
//   if (locationState && locationState.category) {
//     return locationState.category;
//   }
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/category/",
//   );
//   if (!response.ok) throw new Error("Failed to load categories");
//   const listData = await response.json();
//   const category = listData.find((c) => c.id === parseInt(id));
//   if (!category) throw new Error("Category not found");
//   return category;
// };

// // Update mutation function
// const updateCategory = async ({ id, formData }) => {
//   const response = await fetch(
//     `https://codingcloudapi.codingcloud.co.in/category/${id}/`,
//     { method: "PATCH", body: formData },
//   );
//   if (!response.ok) {
//     const data = await response.json().catch(() => ({}));
//     // Handle structured field errors
//     if (data.errors) {
//       const backendErrors = {};
//       Object.keys(data.errors).forEach((key) => {
//         backendErrors[key] = data.errors[key].join(", ");
//       });
//       throw {
//         message: "Please correct the errors below",
//         errors: backendErrors,
//       };
//     }
//     let message =
//       data.message ||
//       data.detail ||
//       "Enter a valid slug consisting of letters, numbers, underscores or hyphens.";
//     if (data.slug && data.slug.length > 0) message = data.slug[0];
//     else if (data.name && data.name.length > 0) message = data.name[0];
//     throw new Error(message);
//   }
//   return response.json();
// };

// const getImageUrl = (path) => {
//   if (!path) return "";

//   // If already full URL
//   if (path.startsWith("http")) return path;

//   return `https://codingcloudapi.codingcloud.co.in${path}`;
// };
// export default function EditCategory() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const locationState = location.state;
//   const queryClient = useQueryClient();
//   const fileInputRef = useRef(null);
//   const timeoutRef = useRef(null);

//   // --- TanStack Query: fetch category ---
//   const {
//     data: categoryData,
//     isLoading,
//     error: queryError,
//   } = useQuery({
//     queryKey: ["category", id],
//     queryFn: () => fetchCategory(id, locationState),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   // --- TanStack Mutation: update category ---
//   const mutation = useMutation({
//     mutationFn: updateCategory,
//     onSuccess: () => {
//       // Invalidate both the list and this specific category
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//       queryClient.invalidateQueries({ queryKey: ["category", id] });
//       setToast({
//         show: true,
//         message: "Category updated successfully!",
//         type: "success",
//       });
//       timeoutRef.current = setTimeout(() => {
//         navigate("/category");
//       }, 1500);
//     },
//     onError: (err) => {
//       if (err.errors) {
//         setFieldErrors(err.errors);
//         setError("Please correct the errors below");
//       } else {
//         setError(err.message || "Update failed");
//       }
//     },
//     onSettled: () => {
//       setSaving(false);
//     },
//   });

//   // Local state (unchanged)
//   const [formData, setFormData] = useState({
//     name: "",
//     text: "",
//     slug: "",
//     image: null,
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [originalImage, setOriginalImage] = useState(null);
//   const [dragOver, setDragOver] = useState(false);

//   // Update local form when data is fetched
//   useEffect(() => {
//     if (categoryData) {
//       setFormData({
//         name: categoryData.name || "",
//         text: categoryData.text || "",
//         slug: categoryData.slug || "",
//         image: null,
//       });
//       if (categoryData.image) {
//         const fullImageUrl = getImageUrl(categoryData.image);
//         console.log("Image URL:", fullImageUrl); // 👈 add this
//         setImagePreview(fullImageUrl);
//         setOriginalImage(fullImageUrl);
//       }
//     }
//   }, [categoryData]);

//   // Cleanup timeout
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   const generateSlug = (name) => {
//     return name
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/--+/g, "-");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//     setError("");
//   };

//   const handleNameChange = (e) => {
//     const value = e.target.value;
//     if (!/^[A-Za-z\s,-]*$/.test(value)) return;

//     setFormData((prev) => {
//       const shouldAutoGenerate =
//         !prev.slug || prev.slug === generateSlug(prev.name);
//       return {
//         ...prev,
//         name: value,
//         slug: shouldAutoGenerate ? generateSlug(value) : prev.slug,
//       };
//     });

//     if (fieldErrors.name) {
//       setFieldErrors((prev) => ({ ...prev, name: undefined }));
//     }
//     setError("");
//   };

//   const processFile = (file) => {
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       setError("Please select a valid image file");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image must be less than 5MB");
//       return;
//     }
//     setFormData((prev) => ({ ...prev, image: file }));
//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);
//     setError("");
//   };

//   const handleImageChange = (e) => processFile(e.target.files[0]);
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     processFile(e.dataTransfer.files[0]);
//   };
//   const triggerFileInput = () => fileInputRef.current?.click();
//   const removeImage = () => {
//     setFormData((prev) => ({ ...prev, image: null }));
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };
//   const restoreOriginalImage = () => {
//     setFormData((prev) => ({ ...prev, image: null }));
//     setImagePreview(originalImage);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name.trim()) {
//       errors.name = "Category name is required";
//     } else if (!/^[A-Za-z\s,-]+$/.test(formData.name.trim())) {
//       errors.name =
//         "Category name can contain letters, spaces, comma (,) and hyphen (-)";
//     }
//     if (!formData.text.trim()) {
//       errors.text = "Description is required";
//     }
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       const missingFields = Object.keys(fieldErrors).join(", ");
//       setToast({
//         show: true,
//         message: `Please fill required fields: ${missingFields}`,
//         type: "error",
//       });
//       return;
//     }

//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     setSaving(true);
//     setError("");
//     setToast({ ...toast, show: false });

//     const payload = new FormData();
//     payload.append("name", formData.name.trim());
//     payload.append("text", formData.text.trim());
//     payload.append("slug", formData.slug?.trim() || "");
//     if (formData.image instanceof File) payload.append("image", formData.image);

//     mutation.mutate({ id, formData: payload });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-base text-gray-500 font-medium">
//             Loading category details…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (queryError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
//           <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle size={20} className="text-red-500" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-900 mb-2">Error</h3>
//           <p className="text-gray-500 mb-6">{queryError.message}</p>
//           <button
//             onClick={() => navigate("/category")}
//             className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {toast.show && (
//         <Toasts
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}

//       <header className=" top-0 z-10 bg-white border-b border-gray-200 shadow-sm sticky">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate("/category")}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
//             >
//               <ArrowLeft size={16} />
//               <span className="hidden sm:inline">Back</span>
//             </button>
//             <div className="w-px h-6 bg-gray-200" />
//             <div>
//               <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
//                 Edit Category
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {saving ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                 Updating…
//               </>
//             ) : (
//               <>
//                 <Save size={15} />
//                 Update Category
//               </>
//             )}
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
//         {error && (
//           <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
//             <AlertCircle
//               size={18}
//               className="mt-0.5 flex-shrink-0 text-red-500"
//             />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Name Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                 <Tag size={16} className="text-indigo-600" />
//               </div>
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-base font-semibold text-gray-800"
//                 >
//                   Category Name <span className="text-red-500">*</span>
//                 </label>
//               </div>
//             </div>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleNameChange}
//               placeholder="e.g., Web Development, Design, Marketing…"
//               className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                 fieldErrors.name ? "border-red-500" : "border-gray-200"
//               }`}
//               required
//             />
//             {fieldErrors.name && (
//               <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
//             )}
//           </div>

//           {/* Slug Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                 <Link2 size={16} className="text-amber-600" />
//               </div>
//               <div>
//                 <label
//                   htmlFor="slug"
//                   className="block text-base font-semibold text-gray-800"
//                 >
//                   Slug
//                 </label>
//               </div>
//             </div>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
//                 /
//               </span>
//               <input
//                 id="slug"
//                 type="text"
//                 name="slug"
//                 value={formData.slug}
//                 onChange={handleInputChange}
//                 placeholder="web-development"
//                 className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                   fieldErrors.slug ? "border-red-500" : "border-gray-200"
//                 }`}
//               />
//             </div>
//             {fieldErrors.slug && (
//               <p className="text-xs text-red-500 mt-1">{fieldErrors.slug}</p>
//             )}
//           </div>

//           {/* Description Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                 <FileText size={16} className="text-violet-600" />
//               </div>
//               <div>
//                 <label
//                   htmlFor="text"
//                   className="block text-base font-semibold text-gray-800"
//                 >
//                   Description <span className="text-red-500">*</span>
//                 </label>
//               </div>
//             </div>
//             <textarea
//               id="text"
//               name="text"
//               value={formData.text}
//               onChange={handleInputChange}
//               rows={4}
//               placeholder="Write a brief description about this category…"
//               className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none ${
//                 fieldErrors.text ? "border-red-500" : "border-gray-200"
//               }`}
//             />
//             {fieldErrors.text && (
//               <p className="text-xs text-red-500 mt-1">{fieldErrors.text}</p>
//             )}
//             <p className="text-xs text-gray-400 text-right mt-2">
//               {formData.text.length} characters
//             </p>
//           </div>

//           {/* Image Upload Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                 <ImagePlus size={16} className="text-pink-500" />
//               </div>
//               <div>
//                 <p className="text-base font-semibold text-gray-800">
//                   Cover Image
//                 </p>
//               </div>
//             </div>

//             {!imagePreview ? (
//               <div
//                 onClick={triggerFileInput}
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   setDragOver(true);
//                 }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleDrop}
//                 className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none ${
//                   dragOver
//                     ? "border-indigo-400 bg-indigo-50"
//                     : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
//                 }`}
//               >
//                 <div
//                   className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${
//                     dragOver ? "bg-indigo-100" : "bg-gray-100"
//                   }`}
//                 >
//                   <Upload
//                     size={22}
//                     className={dragOver ? "text-indigo-500" : "text-gray-400"}
//                   />
//                 </div>
//                 <p className="text-base font-semibold text-gray-700 mb-1">
//                   {dragOver
//                     ? "Drop your image here!"
//                     : "Click to upload or drag & drop"}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   <span className="text-indigo-500 font-medium">
//                     Browse files
//                   </span>{" "}
//                   · PNG, JPG, GIF up to 5MB
//                 </p>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full max-h-72 object-cover block"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src =
//                         "https://via.placeholder.com/400x300?text=Image+Error";
//                     }}
//                   />
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 pointer-events-none">
//                     {formData.image ? (
//                       <p className="text-xs text-emerald-300 font-semibold">
//                         ✓ New image selected — will replace existing
//                       </p>
//                     ) : (
//                       <p className="text-xs text-white/70 font-medium">
//                         Current image
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     onClick={removeImage}
//                     className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
//                   >
//                     <X size={15} />
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                     accept="image/*"
//                     className="hidden"
//                   />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-all"
//                   >
//                     <Upload size={14} />
//                     Change Image
//                   </button>
//                   {formData.image && originalImage && (
//                     <button
//                       type="button"
//                       onClick={restoreOriginalImage}
//                       className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-all border border-gray-200"
//                     >
//                       <RefreshCw size={14} />
//                       Restore Original
//                     </button>
//                   )}
//                   {!formData.image && originalImage && (
//                     <button
//                       type="button"
//                       onClick={removeImage}
//                       className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-semibold transition-all"
//                     >
//                       <X size={14} />
//                       Remove Image
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile Submit Button */}
//           <div className="sm:hidden">
//             <button
//               type="submit"
//               disabled={saving}
//               className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {saving ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   Updating…
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   Update Category
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Link2,
} from "lucide-react";
import Toasts from "../pages/Toasts";

// Fetch function for a single category (uses location state if available, otherwise fetches all)
const fetchCategory = async (id, locationState) => {
  if (locationState && locationState.category) {
    return locationState.category;
  }
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/category/",
  );
  if (!response.ok) throw new Error("Failed to load categories");
  const listData = await response.json();
  const category = listData.find((c) => c.id === parseInt(id));
  if (!category) throw new Error("Category not found");
  return category;
};

// Update mutation function
const updateCategory = async ({ id, formData }) => {
  const response = await fetch(
    `https://codingcloudapi.codingcloud.co.in/category/${id}/`,
    { method: "PATCH", body: formData },
  );
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Handle structured field errors
    if (data.errors) {
      const backendErrors = {};
      Object.keys(data.errors).forEach((key) => {
        backendErrors[key] = data.errors[key].join(", ");
      });
      throw {
        message: "Please correct the errors below",
        errors: backendErrors,
      };
    }
    let message =
      data.message ||
      data.detail ||
      "Enter a valid slug consisting of letters, numbers, underscores or hyphens.";
    if (data.slug && data.slug.length > 0) message = data.slug[0];
    else if (data.name && data.name.length > 0) message = data.name[0];
    throw new Error(message);
  }
  return response.json();
};

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://codingcloudapi.codingcloud.co.in${path}`;
};

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const locationState = location.state;
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  // --- TanStack Query: fetch category ---
  const {
    data: categoryData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id, locationState),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // --- TanStack Mutation: update category ---
  const mutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      setToast({
        show: true,
        message: "Category updated successfully!",
        type: "success",
      });
      timeoutRef.current = setTimeout(() => {
        navigate("/category");
      }, 1500);
    },
    onError: (err) => {
      if (err.errors) {
        setFieldErrors(err.errors);
        setError("Please correct the errors below");
      } else {
        setError(err.message || "Update failed");
      }
    },
    onSettled: () => {
      setSaving(false);
    },
  });

  // Local state
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    slug: "",
    image: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Update local form when data is fetched
  useEffect(() => {
    if (categoryData) {
      setFormData({
        name: categoryData.name || "",
        text: categoryData.text || "",
        slug: categoryData.slug || "",
        image: null,
      });
      if (categoryData.image) {
        const fullImageUrl = getImageUrl(categoryData.image);
        setImagePreview(fullImageUrl);
        setOriginalImage(fullImageUrl);
      }
      // Determine if slug was manually edited (compare with auto-generated from name)
      const autoSlug = generateSlug(categoryData.name || "");
      setSlugManuallyEdited(categoryData.slug !== autoSlug);
    }
  }, [categoryData]);

  // Auto-generate slug from title when name changes and slug not manually edited
  useEffect(() => {
    if (!slugManuallyEdited && formData.name) {
      const newSlug = generateSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
      if (fieldErrors.slug) {
        setFieldErrors((prev) => ({ ...prev, slug: undefined }));
      }
    }
  }, [formData.name, slugManuallyEdited]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove special chars except spaces and hyphens
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setError("");
  };

  // Allow any characters in name (%, -, ,, (, ), /, etc.)
  const handleNameChange = (e) => {
    const value = e.target.value; // No filtering – all characters allowed

    setFormData((prev) => ({
      ...prev,
      name: value,
      // Only auto-update slug if not manually edited
      slug: !slugManuallyEdited ? generateSlug(value) : prev.slug,
    }));

    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
    setError("");
  };

  const handleSlugChange = (e) => {
    const rawValue = e.target.value;
    const sanitized = rawValue
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({ ...prev, slug: sanitized }));
    setSlugManuallyEdited(true);
    if (fieldErrors.slug) {
      setFieldErrors((prev) => ({ ...prev, slug: undefined }));
    }
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

  const validateForm = () => {
    const errors = {};
    // Only check for empty; any characters are allowed
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    if (!formData.text.trim()) {
      errors.text = "Description is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const missingFields = Object.keys(fieldErrors).join(", ");
      setToast({
        show: true,
        message: `Please fill required fields: ${missingFields}`,
        type: "error",
      });
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSaving(true);
    setError("");
    setToast({ ...toast, show: false });

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("text", formData.text.trim());
    payload.append("slug", formData.slug?.trim() || "");
    if (formData.image instanceof File) payload.append("image", formData.image);

    mutation.mutate({ id, formData: payload });
  };

  if (isLoading) {
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

  if (queryError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-6">{queryError.message}</p>
          <button
            onClick={() => navigate("/category")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
            </div>
          </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0 text-red-500"
            />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Card */}
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
                  Special characters (%, -, ,, (, ), /) are allowed
                </p>
              </div>
            </div>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Cars & Trucks, 50% Off, (Premium) – Luxury"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                fieldErrors.name ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Slug Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Link2 size={16} className="text-amber-600" />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="block text-base font-semibold text-gray-800"
                >
                  Slug
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Auto-generated from name (special characters removed)
                </p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                /
              </span>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="web-development"
                className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                  fieldErrors.slug ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {slugManuallyEdited ? (
                <span className="text-amber-600">✏️ Manually edited — auto‑update disabled</span>
              ) : (
                <span className="text-emerald-600">✨ Auto‑generated from name</span>
              )}
            </p>
            {fieldErrors.slug && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.slug}</p>
            )}
          </div>

          {/* Description Card */}
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
                  Description <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows={4}
              placeholder="Write a brief description about this category…"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none ${
                fieldErrors.text ? "border-red-500" : "border-gray-200"
              }`}
            />
            {fieldErrors.text && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.text}</p>
            )}
            <p className="text-xs text-gray-400 text-right mt-2">
              {formData.text.length} characters
            </p>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ImagePlus size={16} className="text-pink-500" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  Cover Image
                </p>
              </div>
            </div>

            {!imagePreview ? (
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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
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
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
                  >
                    Change
                  </button>
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

          {/* Mobile Submit Button */}
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
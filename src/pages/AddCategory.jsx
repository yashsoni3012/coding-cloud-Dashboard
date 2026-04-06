// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   Upload,
//   ImagePlus,
//   Tag,
//   FileText,
//   Link2,
//   AlertCircle,
// } from "lucide-react";
// import Toasts from "../pages/Toasts";

// // Mutation function for creating a category
// const createCategory = async (formData) => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/category/",
//     {
//       method: "POST",
//       body: formData,
//     },
//   );

//   if (!response.ok) {
//     const data = await response.json().catch(() => ({}));
//     throw new Error(data.message || data.detail || "Failed to create category");
//   }

//   return response.json();
// };

// export default function AddCategory() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const fileInputRef = useRef(null);
//   const timeoutRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     text: "",
//     image: null,
//     slug: "",
//   });
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [dragOver, setDragOver] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   // --- TanStack Mutation ---
//   const mutation = useMutation({
//     mutationFn: createCategory,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//       setToast({
//         show: true,
//         message: "Category created successfully!",
//         type: "success",
//       });
//       timeoutRef.current = setTimeout(() => {
//         navigate("/category");
//       }, 1400);
//     },
//     onError: (err) => {
//       setError(err.message || "Failed to create category");
//     },
//   });

//   // Generate URL-friendly slug from name (removes special characters)
// const generateSlug = (name) => {
//   return name
//     .toLowerCase()
//     .trim()
//     .replace(/&/g, "and")        // convert & → and
//     .replace(/[^\w\s-]/g, "")    // remove all special chars
//     .replace(/\s+/g, "-")
//     .replace(/--+/g, "-");
// };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//     setError("");
//   };

//   // Allow any characters in name, but auto-update slug if not manually edited
// const handleNameChange = (e) => {
//   let value = e.target.value;

//   // ✅ Allow only specific characters while typing
//   const filteredValue = value.replace(/[^a-zA-Z0-9\s&,\-\/()]/g, "");

//   setFormData((prev) => ({
//     ...prev,
//     name: filteredValue,
//     slug:
//       prev.slug === generateSlug(prev.name) || !prev.slug
//         ? generateSlug(filteredValue)
//         : prev.slug,
//   }));

//   if (fieldErrors.name) {
//     setFieldErrors((prev) => ({ ...prev, name: undefined }));
//   }

//   setError("");
// };

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

// const validateForm = () => {
//   const errors = {};

//   // ✅ Only allow letters, numbers, space and (& - , / () )
//   const validPattern = /^[a-zA-Z0-9\s&,\-\/()]+$/;

//   if (!formData.name.trim()) {
//     errors.name = "Category name is required";
//   } else if (!validPattern.test(formData.name)) {
//     errors.name =
//       "Only letters, numbers and (&, -, , , /, ()) characters are allowed";
//   }

//   if (!formData.text.trim()) {
//     errors.text = "Description is required";
//   }

//   setFieldErrors(errors);
//   return Object.keys(errors).length === 0;
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setToast({
//         show: true,
//         message: `Please fill required fields`,
//         type: "error",
//       });
//       return;
//     }

//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     setError("");

//     const payload = new FormData();
//     // Send the name exactly as typed (special characters preserved)
//     payload.append("name", formData.name.trim());
//     payload.append("text", formData.text.trim());
//     if (formData.image) payload.append("image", formData.image);
//     payload.append("slug", formData.slug.trim() || generateSlug(formData.name));

//     mutation.mutate(payload);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {toast.show && (
//         <Toasts
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}

//       {/* Header */}
//       <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
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
//                 Add Category
//               </h1>
//             </div>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={mutation.isPending}
//             className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {mutation.isPending ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               <>
//                 <Save size={15} />
//                 Save Category
//               </>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
//         {/* Error Alert */}
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
//           {/* Category Name Card */}
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
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   Special characters (&, -, /, ()) are allowed
//                 </p>
//               </div>
//             </div>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleNameChange}
//               placeholder="e.g., Cars & Trucks, SUVs / Crossovers, (Premium) – Luxury"
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
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   Auto-generated from name (special characters removed)
//                 </p>
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
//                 placeholder="cars-and-trucks"
//                 className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//               />
//             </div>
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
//               <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full max-h-72 object-cover block"
//                 />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 pointer-events-none">
//                   <p className="text-xs text-white/80 font-medium truncate">
//                     {formData.image?.name}
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={triggerFileInput}
//                   className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
//                 >
//                   Change
//                 </button>
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
//                 >
//                   <X size={15} />
//                 </button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Mobile Submit Button */}
//           <div className="sm:hidden">
//             <button
//               type="submit"
//               disabled={mutation.isPending}
//               className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {mutation.isPending ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   Creating…
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   Create Category
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// } 

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  ImagePlus,
  Tag,
  FileText,
  Link2,
  AlertCircle,
} from "lucide-react";
import Toasts from "../pages/Toasts";

// Mutation function for creating a category
const createCategory = async (formData) => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/category/",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.detail || "Failed to create category");
  }

  return response.json();
};

export default function AddCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    image: null,
    slug: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // --- TanStack Mutation ---
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setToast({
        show: true,
        message: "Category created successfully!",
        type: "success",
      });
      timeoutRef.current = setTimeout(() => {
        navigate("/category");
      }, 1400);
    },
    onError: (err) => {
      setError(err.message || "Failed to create category");
    },
  });

  // Generate URL-friendly slug from name (removes special characters, keeps alphanumeric + hyphens)
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
    let value = e.target.value; // No filtering – special characters preserved

    setFormData((prev) => ({
      ...prev,
      name: value,
      slug:
        prev.slug === generateSlug(prev.name) || !prev.slug
          ? generateSlug(value)
          : prev.slug,
    }));

    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        show: true,
        message: `Please fill required fields`,
        type: "error",
      });
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setError("");

    const payload = new FormData();
    // Send the name exactly as typed (special characters preserved)
    payload.append("name", formData.name.trim());
    payload.append("text", formData.text.trim());
    if (formData.image) payload.append("image", formData.image);
    payload.append("slug", formData.slug.trim() || generateSlug(formData.name));

    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Header */}
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
                Add Category
              </h1>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
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

      {/* Main Content */}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name Card */}
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
                onChange={handleInputChange}
                placeholder="cars-and-trucks"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 pointer-events-none">
                  <p className="text-xs text-white/80 font-medium truncate">
                    {formData.image?.name}
                  </p>
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
            )}
          </div>

          {/* Mobile Submit Button */}
          <div className="sm:hidden">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
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
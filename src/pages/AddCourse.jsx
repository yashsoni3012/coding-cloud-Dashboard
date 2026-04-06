// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Editor } from "@tinymce/tinymce-react";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   Upload,
//   FileText,
//   Clock,
//   BookOpen,
//   Users,
//   Signal,
//   Globe,
//   Award,
//   ChevronDown,
//   ImagePlus,
//   AlertCircle,
//   Tag,
//   BookMarked,
//   Search,
//   Sparkles,
// } from "lucide-react";
// import Toasts from "../pages/Toasts";

// // Fetch categories function
// const fetchCategories = async () => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/category/",
//   );
//   if (!response.ok) throw new Error("Failed to load categories");
//   const data = await response.json();
//   return data.data || [];
// };

// // Create course mutation function
// const createCourse = async (formData) => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/course/",
//     {
//       method: "POST",
//       body: formData,
//     },
//   );

//   let data;
//   const contentType = response.headers.get("content-type");
//   if (contentType && contentType.includes("application/json")) {
//     data = await response.json();
//   } else {
//     data = { message: await response.text() };
//   }

//   if (!response.ok && response.status !== 201) {
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
//     const errorMsg =
//       data.message ||
//       data.detail ||
//       data.error ||
//       data.non_field_errors?.[0] ||
//       "Failed to create course.";
//     throw new Error(errorMsg);
//   }
//   return data;
// };

// export default function AddCourse() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const timeoutRef = useRef(null);

//   // ⚙️ Adjust this constant based on your backend limit (if known)
//   const MAX_DESCRIPTION_LENGTH = 10000;

//   const [error, setError] = useState("");
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   // --- TanStack Query: fetch categories with caching ---
//   const {
//     data: categories = [],
//     isLoading: loadingCategories,
//     error: categoriesError,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//   });

//   // Show categories loading error if needed (matches original behavior)
//   useEffect(() => {
//     if (categoriesError) {
//       setError("Failed to load categories");
//     }
//   }, [categoriesError]);

//   // --- TanStack Mutation: create course ---
//   const mutation = useMutation({
//     mutationFn: createCourse,
//     onSuccess: () => {
//       // Invalidate courses list so it refreshes
//       queryClient.invalidateQueries({ queryKey: ["courses"] });
//       setToast({
//         show: true,
//         message: "Course created successfully!",
//         type: "success",
//       });
//       timeoutRef.current = setTimeout(() => {
//         navigate("/course");
//       }, 1500);
//     },
//     onError: (err) => {
//       if (err.errors) {
//         setFieldErrors(err.errors);
//         setToast({
//           show: true,
//           message: "Please correct the errors below",
//           type: "error",
//         });
//       } else {
//         setError(err.message || "Failed to create course.");
//       }
//     },
//     onSettled: () => {
//       setLoading(false);
//     },
//   });

//   // Clear timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   const [formData, setFormData] = useState({
//     name: "",
//     slug: "",
//     category: "",
//     text: "",
//     short_description: "",
//     duration: "",
//     lecture: "",
//     students: "",
//     level: "",
//     language: "",
//     certificate: "No",
//     featured: false,
//     kids_course: false,
//     meta_title: "",
//     meta_description: "",
//     keywords: "",
//     image: null,
//     banner_img: null,
//     pdf_file: null,
//     icon: null,
//     image2: null,
//   });

//   const [imagePreview, setImagePreview] = useState("");
//   const [bannerPreview, setBannerPreview] = useState("");
//   const [iconPreview, setIconPreview] = useState("");
//   const [image2Preview, setImage2Preview] = useState("");
//   const [pdfName, setPdfName] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false); // for button state
//   const [editorMode, setEditorMode] = useState("tinymce");

//   // 🟥 RED BORDER LOGIC: Clear error for a field when user types
// const handleInputChange = (e) => {
//   const { name, value } = e.target;

//   // Only allow numbers for students
//   if (name === "students") {
//     const numericValue = value.replace(/[^0-9]/g, "");
//     setFormData((prev) => ({ ...prev, students: numericValue }));
//   } else {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }

//   // Clear error
//   if (fieldErrors[name]) {
//     setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//   }

//   // Slug logic
//   if (name === "name" && !formData.slug) {
//     const generatedSlug = value
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-|-$/g, "");
//     setFormData((prev) => ({ ...prev, slug: generatedSlug }));
//   }
// };

//   // Handle toggle changes for boolean fields
//   const handleToggleChange = (name, checked) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }));
//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   // 🟥 Clear file field error when a file is selected
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     const file = files[0];
//     if (file) {
//       const maxSize = name === "pdf_file" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
//         return;
//       }
//       if (name === "pdf_file" && file.type !== "application/pdf") {
//         setError("Please upload a valid PDF file");
//         return;
//       }
//       if (name !== "pdf_file" && !file.type.startsWith("image/")) {
//         setError("Please upload a valid image file");
//         return;
//       }
//       setFormData((prev) => ({ ...prev, [name]: file }));
//       if (name === "image") setImagePreview(URL.createObjectURL(file));
//       else if (name === "banner_img")
//         setBannerPreview(URL.createObjectURL(file));
//       else if (name === "icon") setIconPreview(URL.createObjectURL(file));
//       else if (name === "image2") setImage2Preview(URL.createObjectURL(file));
//       else if (name === "pdf_file") setPdfName(file.name);

//       // Clear error for this file field
//       if (fieldErrors[name]) {
//         setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//       }

//       setError("");
//     }
//   };

//   // 🟥 Clear error when file is removed
//   const removeFile = (field) => {
//     setFormData((prev) => ({ ...prev, [field]: null }));
//     if (field === "image") {
//       setImagePreview("");
//       document.getElementById("image-upload").value = "";
//     } else if (field === "banner_img") {
//       setBannerPreview("");
//       document.getElementById("banner-upload").value = "";
//     } else if (field === "icon") {
//       setIconPreview("");
//       document.getElementById("icon-upload").value = "";
//     } else if (field === "image2") {
//       setImage2Preview("");
//       document.getElementById("image2-upload").value = "";
//     } else if (field === "pdf_file") {
//       setPdfName("");
//       document.getElementById("pdf-upload").value = "";
//     }

//     if (fieldErrors[field]) {
//       setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
//     }
//   };

//   // 🟥 Validate all required fields
//   const validateForm = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = "Course name is required";
//     }

//     if (!formData.slug.trim()) {
//       errors.slug = "Course slug is required";
//     }

//     if (!formData.category) {
//       errors.category = "Category is required";
//     }

//     if (!formData.text.trim()) {
//       errors.text = "Description is required";
//     }

//     if (formData.text.length > MAX_DESCRIPTION_LENGTH) {
//       errors.text = `Description must be under ${MAX_DESCRIPTION_LENGTH} characters`;
//     }

//     if (!formData.short_description.trim()) {
//       errors.short_description = "Short description is required";
//     }

//     if (!formData.meta_title.trim()) {
//       errors.meta_title = "Meta title is required";
//     }

//     if (!formData.meta_description.trim()) {
//       errors.meta_description = "Meta description is required";
//     }

//     if (!formData.keywords.trim()) {
//       errors.keywords = "Keywords are required";
//     }

//     // ✅ Duration validation
//     if (formData.duration) {
//       const durationNumber = parseFloat(formData.duration);

//       if (durationNumber < 0) {
//         errors.duration = "Duration cannot be negative";
//       }
//     }

//     // File fields
//     if (!formData.image) errors.image = "Course image is required";
//     if (!formData.banner_img) errors.banner_img = "Banner image is required";
//     if (!formData.pdf_file) errors.pdf_file = "Syllabus PDF is required";
//     if (!formData.icon) errors.icon = "Course icon is required";
//     if (!formData.image2) errors.image2 = "Additional image is required";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Helper to build a user‑friendly list of empty fields
//   const getEmptyFieldsList = (errors) => {
//     const fieldLabels = {
//       name: "Course name",
//       slug: "Course slug",
//       category: "Category",
//       text: "Description",
//       short_description: "Short description",
//       meta_title: "Meta title",
//       meta_description: "Meta description",
//       keywords: "Keywords",
//       image: "Course image",
//       banner_img: "Banner image",
//       pdf_file: "Syllabus PDF",
//       icon: "Course icon",
//       image2: "Additional image",
//     };
//     return Object.keys(errors)
//       .map((key) => fieldLabels[key] || key)
//       .join(", ");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       const missingFields = getEmptyFieldsList(fieldErrors);
//       setToast({
//         show: true,
//         message: `Please fill required fields`,
//         type: "error",
//       });
//       return;
//     }

//     if (timeoutRef.current) clearTimeout(timeoutRef.current);

//     setLoading(true);
//     setError("");
//     setToast({ ...toast, show: false });

//     try {
//       const submitData = new FormData();
//       submitData.append("name", formData.name);
//       submitData.append("slug", formData.slug);
//       submitData.append("category", formData.category);
//       submitData.append("text", formData.text);
//       if (formData.short_description)
//         submitData.append("short_description", formData.short_description);

//       // ✅ FIX: Add duration to FormData
//       if (formData.duration) submitData.append("duration", formData.duration);

//       if (formData.lecture) submitData.append("lecture", formData.lecture);
//       if (formData.students) {
//   if (!/^\d+$/.test(formData.students)) {
//     errors.students = "Students must be a number";
//   }
// }
//       if (formData.level) submitData.append("level", formData.level);
//       if (formData.language) submitData.append("language", formData.language);
//       submitData.append("certificate", formData.certificate);
//       submitData.append("featured", formData.featured.toString());
//       submitData.append("kids_course", formData.kids_course.toString());
//       if (formData.meta_title)
//         submitData.append("meta_title", formData.meta_title);
//       if (formData.meta_description)
//         submitData.append("meta_description", formData.meta_description);
//       if (formData.keywords) submitData.append("keywords", formData.keywords);
//       if (formData.image) submitData.append("image", formData.image);
//       if (formData.banner_img)
//         submitData.append("banner_img", formData.banner_img);
//       if (formData.pdf_file) submitData.append("pdf_file", formData.pdf_file);
//       if (formData.icon) submitData.append("icon", formData.icon);
//       if (formData.image2) submitData.append("image2", formData.image2);

//       // Use mutation instead of manual fetch
//       mutation.mutate(submitData);
//     } catch (err) {
//       // This catch block is unlikely to run because mutation handles errors, but kept for safety
//       console.error("Unexpected error:", err);
//       setError("Network error. Please check your connection.");
//       setLoading(false);
//     }
//   };

//   // Generate short description from main description (plain text)
//   const generateShortDescription = () => {
//     const plainText = formData.text.replace(/<[^>]*>/g, "");
//     const truncated = plainText.slice(0, 200);
//     setFormData((prev) => ({ ...prev, short_description: truncated }));
//     if (fieldErrors.short_description) {
//       setFieldErrors((prev) => ({ ...prev, short_description: undefined }));
//     }
//     setToast({
//       show: true,
//       message: "Short description generated from main description",
//       type: "success",
//     });
//   };

//   // 🟥 Clear text error when editor content changes
//   const handleEditorChange = (content) => {
//     setFormData((prev) => ({ ...prev, text: content }));
//     if (fieldErrors.text) {
//       setFieldErrors((prev) => ({ ...prev, text: undefined }));
//     }
//   };

//   // ── Reusable Image Upload Box with error styling ──
//   const ImageUploadBox = ({
//     preview,
//     onRemove,
//     inputId,
//     inputName,
//     label,
//     hint,
//     iconBg,
//     iconColor,
//     error,
//   }) => (
//     <div
//       className={`bg-white rounded-2xl border shadow-sm p-6 ${
//         error ? "border-red-500" : "border-gray-200"
//       }`}
//     >
//       <div className="flex items-center gap-3 mb-4">
//         <div
//           className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
//         >
//           <ImagePlus size={16} className={iconColor} />
//         </div>
//         <div>
//           <p className="text-base font-semibold text-gray-800">{label}</p>
//           <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
//         </div>
//       </div>

//       {!preview ? (
//         <div
//           onClick={() => document.getElementById(inputId)?.click()}
//           className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all select-none"
//         >
//           <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
//             <Upload size={20} className="text-gray-400" />
//           </div>
//           <p className="text-base font-semibold text-gray-700 mb-1">
//             Click to upload
//           </p>
//           <p className="text-xs text-gray-400">
//             <span className="text-indigo-500 font-medium">Browse files</span>
//           </p>
//         </div>
//       ) : (
//         <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
//           <img
//             src={preview}
//             alt="preview"
//             className="w-full max-h-48 object-cover block"
//           />
//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
//           <button
//             type="button"
//             onClick={onRemove}
//             className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
//           >
//             <X size={15} />
//           </button>
//           <button
//             type="button"
//             onClick={() => document.getElementById(inputId)?.click()}
//             className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
//           >
//             Change
//           </button>
//         </div>
//       )}
//       <input
//         type="file"
//         name={inputName}
//         accept="image/*"
//         onChange={handleFileChange}
//         className="hidden"
//         id={inputId}
//       />
//     </div>
//   );

//   // ── PDF Upload Box with error styling ──
//   const PdfUploadBox = ({ error }) => (
//     <div
//       className={`bg-white rounded-2xl border shadow-sm p-6 ${
//         error ? "border-red-500" : "border-gray-200"
//       }`}
//     >
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
//           <FileText size={16} className="text-red-500" />
//         </div>
//         <div>
//           <p className="text-base font-semibold text-gray-800">
//             Syllabus PDF <span className="text-red-500">*</span>
//           </p>
//         </div>
//       </div>

//       {!pdfName ? (
//         <div
//           onClick={() => document.getElementById("pdf-upload")?.click()}
//           className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all select-none"
//         >
//           <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
//             <Upload size={20} className="text-indigo-500" />
//           </div>
//           <p className="text-base font-semibold text-gray-700 mb-1">
//             Upload Syllabus
//           </p>
//           <p className="text-xs text-gray-400">
//             <span className="text-indigo-500 font-medium">Browse files</span>
//           </p>
//         </div>
//       ) : (
//         <div className="relative flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
//           <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
//             <FileText size={18} className="text-indigo-600" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-base font-semibold text-gray-800 truncate">
//               {pdfName}
//             </p>
//             <p className="text-xs text-indigo-500 mt-0.5">
//               PDF · Ready to upload
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => removeFile("pdf_file")}
//             className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
//           >
//             <X size={15} />
//           </button>
//         </div>
//       )}
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//       <input
//         type="file"
//         name="pdf_file"
//         accept=".pdf"
//         onChange={handleFileChange}
//         id="pdf-upload"
//         className="hidden"
//       />
//     </div>
//   );

//   // ── Toggle Switch Component ──
//   const ToggleSwitch = ({ label, description, name, checked, onChange }) => (
//     <div className="flex items-center justify-between py-2">
//       <div>
//         <p className="text-sm font-semibold text-gray-700">{label}</p>
//         {description && <p className="text-xs text-gray-400">{description}</p>}
//       </div>
//       <button
//         type="button"
//         role="switch"
//         aria-checked={checked}
//         onClick={() => onChange(name, !checked)}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//           checked ? "bg-indigo-600" : "bg-gray-200"
//         }`}
//       >
//         <span
//           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//             checked ? "translate-x-6" : "translate-x-1"
//           }`}
//         />
//       </button>
//     </div>
//   );

//   // ── Section Header ──
//   const SectionHeader = ({
//     icon: Icon,
//     label,
//     iconBg,
//     iconColor,
//     description,
//     required = false,
//   }) => (
//     <div className="flex items-center gap-3 pt-2">
//       <div
//         className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
//       >
//         <Icon size={16} className={iconColor} />
//       </div>

//       <div>
//         <p className="text-base font-bold text-gray-800">
//           {label}
//           {required && <span className="text-red-400 ml-1">*</span>}
//         </p>

//         {description && <p className="text-xs text-gray-400">{description}</p>}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Toast */}
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
//               onClick={() => navigate("/course")}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
//             >
//               <ArrowLeft size={16} />
//               <span className="hidden sm:inline">Back</span>
//             </button>
//             <div className="w-px h-6 bg-gray-200" />
//             <div>
//               <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
//                 Create New Course
//               </h1>
//             </div>
//           </div>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               <>
//                 <Save size={15} />
//                 Save Course
//               </>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
//         {/* Error Alert */}
//         {error && (
//           <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
//             <AlertCircle
//               size={18}
//               className="mt-0.5 flex-shrink-0 text-red-500"
//             />
//             <span className="flex-1">{error}</span>
//             <button
//               onClick={() => setError("")}
//               className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         )}

//         {/* Categories loading (using query's loading state) */}
//         {loadingCategories && (
//           <div className="flex items-center gap-3 p-4 mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-base text-indigo-600">
//             <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
//             Loading categories…
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* SECTION 1 — Basic Information */}
//           <SectionHeader
//             icon={Tag}
//             label="Basic Information"
//             iconBg="bg-indigo-50"
//             iconColor="text-indigo-600"
//           />

//           {/* Course Name */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="name"
//               className="block text-base font-semibold text-gray-800 mb-1"
//               required
//             >
//               Course Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="e.g., Advanced React Development 2024"
//               className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                 fieldErrors.name ? "border-red-500" : "border-gray-200"
//               }`}
//               required
//             />
//             {fieldErrors.name && (
//               <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
//             )}
//           </div>

//           {/* Slug */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="slug"
//               className="block text-base font-semibold text-gray-800 mb-1"
//               required
//             >
//               Course Slug <span className="text-red-500">*</span>
//             </label>
//             <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
//               <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 font-medium border-r border-gray-200 whitespace-nowrap">
//                 /course/
//               </span>
//               <input
//                 id="slug"
//                 type="text"
//                 name="slug"
//                 value={formData.slug}
//                 onChange={handleInputChange}
//                 placeholder="advanced-react-development-2024"
//                 className={`flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all ${
//                   fieldErrors.slug ? "border-red-500" : ""
//                 }`}
//                 required
//               />
//             </div>
//             {fieldErrors.slug && (
//               <p className="text-xs text-red-500 mt-1">{fieldErrors.slug}</p>
//             )}
//           </div>

//           {/* Category */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="category"
//               className="block text-base font-semibold text-gray-800 mb-1"
//               required
//             >
//               Category <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none ${
//                   fieldErrors.category ? "border-red-500" : "border-gray-200"
//                 }`}
//                 required
//               >
//                 <option value="">Select a category</option>
//                 {Array.isArray(categories) &&
//                   categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//               </select>
//               <ChevronDown
//                 size={16}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//             </div>
//             {fieldErrors.category && (
//               <p className="text-xs text-red-500 mt-1">
//                 {fieldErrors.category}
//               </p>
//             )}
//           </div>

//           {/* Description with tabs */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center justify-between mb-4">
//               <label
//                 htmlFor="text"
//                 className="block text-base font-semibold text-gray-800"
//               >
//                 Description <span className="text-red-500">*</span>
//               </label>

//               {/* Tab Switcher */}
//               <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
//                 <button
//                   type="button"
//                   onClick={() => setEditorMode("tinymce")}
//                   className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                     editorMode === "tinymce"
//                       ? "bg-white text-indigo-600 shadow-sm"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   TinyMCE
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setEditorMode("html")}
//                   className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                     editorMode === "html"
//                       ? "bg-white text-indigo-600 shadow-sm"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   HTML
//                 </button>
//               </div>
//             </div>

//             {/* Conditional Editor */}
//             {editorMode === "tinymce" ? (
//               <div
//                 className={`border rounded-xl overflow-hidden ${
//                   fieldErrors.text ? "border-red-500" : "border-gray-200"
//                 }`}
//               >
//                 <Editor
//                   apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j"
//                   value={formData.text}
//                   onEditorChange={handleEditorChange}
//                   init={{
//                     height: 400,
//                     menubar: true,
//                     plugins: [
//                       "advlist",
//                       "autolink",
//                       "lists",
//                       "link",
//                       "image",
//                       "charmap",
//                       "preview",
//                       "anchor",
//                       "searchreplace",
//                       "visualblocks",
//                       "code",
//                       "fullscreen",
//                       "insertdatetime",
//                       "media",
//                       "table",
//                       "help",
//                       "wordcount",
//                     ],
//                     toolbar:
//                       "undo redo | blocks | " +
//                       "bold italic forecolor | alignleft aligncenter " +
//                       "alignright alignjustify | bullist numlist outdent indent | " +
//                       "removeformat | code | help",
//                     content_style:
//                       "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
//                     placeholder: "Write a detailed description of your course…",
//                   }}
//                 />
//               </div>
//             ) : (
//               <textarea
//                 value={formData.text}
//                 onChange={(e) => {
//                   setFormData((prev) => ({ ...prev, text: e.target.value }));
//                   if (fieldErrors.text) {
//                     setFieldErrors((prev) => ({ ...prev, text: undefined }));
//                   }
//                 }}
//                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                   fieldErrors.text ? "border-red-500" : "border-gray-200"
//                 }`}
//                 rows={12}
//                 placeholder="<!-- Write HTML here -->"
//               />
//             )}
//             {fieldErrors.text && (
//               <p className="text-xs text-red-500 mt-1">{fieldErrors.text}</p>
//             )}
//           </div>

//           {/* Short Description with auto‑generate button */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center justify-between mb-1">
//               <label
//                 htmlFor="short_description"
//                 className="block text-base font-semibold text-gray-800"
//               >
//                 Short Description <span className="text-red-500">*</span>
//               </label>
//               <button
//                 type="button"
//                 onClick={generateShortDescription}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-all"
//                 title="Generate from main description"
//               >
//                 <Sparkles size={14} />
//                 Generate
//               </button>
//             </div>
//             <input
//               id="short_description"
//               type="text"
//               name="short_description"
//               value={formData.short_description}
//               onChange={handleInputChange}
//               placeholder="e.g., Learn React from scratch in 40 hours"
//               className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                 fieldErrors.short_description
//                   ? "border-red-500"
//                   : "border-gray-200"
//               }`}
//             />
//             {fieldErrors.short_description && (
//               <p className="text-xs text-red-500 mt-1">
//                 {fieldErrors.short_description}
//               </p>
//             )}
//           </div>

//           {/* SECTION 2 — Course Details */}
//           <SectionHeader
//             icon={BookMarked}
//             label="Course Details"
//             iconBg="bg-violet-50"
//             iconColor="text-violet-600"
//           />

//           {/* Duration / Lectures / Students */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//               {[
//                 {
//                   icon: Clock,
//                   label: "Duration",
//                   name: "duration",
//                   placeholder: "e.g., 40",
//                   bg: "bg-blue-50",
//                   color: "text-blue-500",
//                 },
//                 {
//                   icon: BookOpen,
//                   label: "Lectures",
//                   name: "lecture",
//                   placeholder: "e.g., 98",
//                   bg: "bg-emerald-50",
//                   color: "text-emerald-500",
//                 },
//                 {
//                   icon: Users,
//                   label: "Students",
//                   name: "students",
//                   placeholder: "e.g., 1,000+",
//                   bg: "bg-orange-50",
//                   color: "text-orange-500",
//                 },
//               ].map((field) => (
//                 <div key={field.name}>
//                   <div className="flex items-center gap-2 mb-2">
//                     <div
//                       className={`w-6 h-6 ${field.bg} rounded-md flex items-center justify-center`}
//                     >
//                       <field.icon size={12} className={field.color} />
//                     </div>
//                     <label className="text-xs font-semibold text-gray-700">
//                       {field.label}
//                     </label>
//                   </div>

//                   <input
//                     type="number"
//                     min={0}
//                     name={field.name}
//                     value={formData[field.name]}
//                     onChange={handleInputChange}
//                     placeholder={field.placeholder}
//                     className={`w-full px-3 py-2.5 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                       fieldErrors[field.name]
//                         ? "border-red-500"
//                         : "border-gray-200"
//                     }`}
//                   />

//                   {fieldErrors[field.name] && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {fieldErrors[field.name]}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Level / Language / Certificate */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//               {/* Level */}
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-6 h-6 bg-purple-50 rounded-md flex items-center justify-center">
//                     <Signal size={12} className="text-purple-500" />
//                   </div>
//                   <label className="text-xs font-semibold text-gray-700">
//                     Difficulty Level
//                   </label>
//                 </div>
//                 <div className="relative">
//                   <select
//                     name="level"
//                     value={formData.level}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none"
//                   >
//                     <option value="">Select Level</option>
//                     <option value="Beginner">Beginner</option>
//                     <option value="Intermediate">Intermediate</option>
//                     <option value="Advanced">Advanced</option>
//                     <option value="All Levels">All Levels</option>
//                   </select>
//                   <ChevronDown
//                     size={14}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                   />
//                 </div>
//               </div>

//               {/* Language */}
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-6 h-6 bg-teal-50 rounded-md flex items-center justify-center">
//                     <Globe size={12} className="text-teal-500" />
//                   </div>
//                   <label className="text-xs font-semibold text-gray-700">
//                     Language
//                   </label>
//                 </div>
//                 <input
//                   type="text"
//                   name="language"
//                   value={formData.language}
//                   onChange={handleInputChange}
//                   placeholder="e.g., English"
//                   className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                 />
//               </div>

//               {/* Certificate */}
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-6 h-6 bg-yellow-50 rounded-md flex items-center justify-center">
//                     <Award size={12} className="text-yellow-500" />
//                   </div>
//                   <label className="text-xs font-semibold text-gray-700">
//                     Certificate <span className="text-red-500">*</span>
//                   </label>
//                 </div>
//                 <div className="flex gap-2">
//                   {["No", "Yes"].map((val) => (
//                     <label
//                       key={val}
//                       className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 rounded-xl cursor-pointer transition-all text-xs font-semibold ${
//                         formData.certificate === val
//                           ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                           : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="certificate"
//                         value={val}
//                         checked={formData.certificate === val}
//                         onChange={handleInputChange}
//                         className="hidden"
//                       />
//                       {val === "Yes" ? <Award size={12} /> : <X size={12} />}
//                       {val}
//                     </label>
//                   ))}
//                 </div>
//                 {fieldErrors.certificate && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {fieldErrors.certificate}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Additional Options: Featured & Kids Course */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
//                 <Sparkles size={16} className="text-amber-500" />
//               </div>
//               <div>
//                 <p className="text-base font-semibold text-gray-800">
//                   Additional Options
//                 </p>
//               </div>
//             </div>
//             <div className="space-y-3 divide-y divide-gray-100">
//               <ToggleSwitch
//                 label="Featured Course"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleToggleChange}
//               />
//               <ToggleSwitch
//                 label="Kids Course"
//                 name="kids_course"
//                 checked={formData.kids_course}
//                 onChange={handleToggleChange}
//               />
//             </div>
//           </div>

//           {/* SECTION 3 — Media Files */}
//           <SectionHeader
//             icon={ImagePlus}
//             label="Media Files"
//             iconBg="bg-pink-50"
//             iconColor="text-pink-500"
//             required={true}
//           />

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <ImageUploadBox
//               preview={imagePreview}
//               onRemove={() => removeFile("image")}
//               inputId="image-upload"
//               inputName="image"
//               label="Course Image"
//               iconBg="bg-pink-50"
//               iconColor="text-pink-500"
//               error={!!fieldErrors.image}
//             />
//             <ImageUploadBox
//               preview={bannerPreview}
//               onRemove={() => removeFile("banner_img")}
//               inputId="banner-upload"
//               inputName="banner_img"
//               label="Banner Image "
//               iconBg="bg-indigo-50"
//               iconColor="text-indigo-500"
//               error={!!fieldErrors.banner_img}
//             />
//             <ImageUploadBox
//               preview={iconPreview}
//               onRemove={() => removeFile("icon")}
//               inputId="icon-upload"
//               inputName="icon"
//               label="Course Icon "
//               iconBg="bg-violet-50"
//               iconColor="text-violet-500"
//               error={!!fieldErrors.icon}
//             />
//             <ImageUploadBox
//               preview={image2Preview}
//               onRemove={() => removeFile("image2")}
//               inputId="image2-upload"
//               inputName="image2"
//               label="Additional Image "
//               iconBg="bg-orange-50"
//               iconColor="text-orange-500"
//               error={!!fieldErrors.image2}
//             />
//             <PdfUploadBox error={fieldErrors.pdf_file} />
//           </div>

//           {/* SECTION 4 — SEO & Metadata */}
//           <SectionHeader
//             icon={Search}
//             label="SEO & Metadata"
//             iconBg="bg-emerald-50"
//             iconColor="text-emerald-600"
//           />

//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//             {/* Meta Title */}
//             <div>
//               <label
//                 htmlFor="meta_title"
//                 className="block text-base font-semibold text-gray-800 mb-1"
//               >
//                 Meta Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="meta_title"
//                 type="text"
//                 name="meta_title"
//                 value={formData.meta_title}
//                 onChange={handleInputChange}
//                 placeholder="SEO optimized title for your course"
//                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                   fieldErrors.meta_title ? "border-red-500" : "border-gray-200"
//                 }`}
//               />
//               {fieldErrors.meta_title && (
//                 <p className="text-xs text-red-500 mt-1">
//                   {fieldErrors.meta_title}
//                 </p>
//               )}
//               <p className="text-xs text-gray-400 text-right mt-1">
//                 {formData.meta_title.length} / 60
//               </p>
//             </div>

//             <div className="h-px bg-gray-100" />

//             {/* Meta Description */}
//             <div>
//               <label
//                 htmlFor="meta_description"
//                 className="block text-base font-semibold text-gray-800 mb-1"
//               >
//                 Meta Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 id="meta_description"
//                 name="meta_description"
//                 value={formData.meta_description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 placeholder="Brief description for search engines…"
//                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none ${
//                   fieldErrors.meta_description
//                     ? "border-red-500"
//                     : "border-gray-200"
//                 }`}
//               />
//               {fieldErrors.meta_description && (
//                 <p className="text-xs text-red-500 mt-1">
//                   {fieldErrors.meta_description}
//                 </p>
//               )}
//               <p className="text-xs text-gray-400 text-right mt-1">
//                 {formData.meta_description.length} / 160
//               </p>
//             </div>

//             <div className="h-px bg-gray-100" />

//             {/* Keywords */}
//             <div>
//               <label
//                 htmlFor="keywords"
//                 className="block text-base font-semibold text-gray-800 mb-1"
//               >
//                 Keywords <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="keywords"
//                 type="text"
//                 name="keywords"
//                 value={formData.keywords}
//                 onChange={handleInputChange}
//                 placeholder="react, javascript, web development, frontend"
//                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                   fieldErrors.keywords ? "border-red-500" : "border-gray-200"
//                 }`}
//               />
//               {fieldErrors.keywords && (
//                 <p className="text-xs text-red-500 mt-1">
//                   {fieldErrors.keywords}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Mobile Submit */}
//           <div className="sm:hidden">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   Creating…
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   Create Course
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
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  FileText,
  Clock,
  BookOpen,
  Users,
  Signal,
  Globe,
  Award,
  ChevronDown,
  ImagePlus,
  AlertCircle,
  Tag,
  BookMarked,
  Search,
  Sparkles,
} from "lucide-react";
import Toasts from "../pages/Toasts";

// Fetch categories function
const fetchCategories = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/category/",
  );
  if (!response.ok) throw new Error("Failed to load categories");
  const data = await response.json();
  return data.data || [];
};

// Create course mutation function
const createCourse = async (formData) => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/course/",
    {
      method: "POST",
      body: formData,
    },
  );

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok && response.status !== 201) {
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
    const errorMsg =
      data.message ||
      data.detail ||
      data.error ||
      data.non_field_errors?.[0] ||
      "Failed to create course.";
    throw new Error(errorMsg);
  }
  return data;
};

export default function AddCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  // ⚙️ Adjust this constant based on your backend limit (if known)
  const MAX_DESCRIPTION_LENGTH = 10000;

  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // --- TanStack Query: fetch categories with caching ---
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Show categories loading error if needed (matches original behavior)
  useEffect(() => {
    if (categoriesError) {
      setError("Failed to load categories");
    }
  }, [categoriesError]);

  // --- TanStack Mutation: create course ---
  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      // Invalidate courses list so it refreshes
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setToast({
        show: true,
        message: "Course created successfully!",
        type: "success",
      });
      timeoutRef.current = setTimeout(() => {
        navigate("/course");
      }, 1500);
    },
    onError: (err) => {
      if (err.errors) {
        setFieldErrors(err.errors);
        setToast({
          show: true,
          message: "Please correct the errors below",
          type: "error",
        });
      } else {
        setError(err.message || "Failed to create course.");
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    text: "",
    short_description: "",
    duration: "",
    lecture: "",
    students: "",
    level: "",
    language: "",
    certificate: "No",
    featured: false,
    kids_course: false,
    meta_title: "",
    meta_description: "",
    keywords: "",
    image: null,
    banner_img: null,
    pdf_file: null,
    icon: null,
    image2: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [image2Preview, setImage2Preview] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false); // for button state
  const [editorMode, setEditorMode] = useState("tinymce");

  // 🟥 RED BORDER LOGIC: Clear error for a field when user types
// const handleInputChange = (e) => {
//   const { name, value } = e.target;

//   // 🚫 Remove + character (for both typing & paste)
//   let sanitizedValue = value.replace(/\+/g, "");

//   // ✅ Students → only numbers
//   if (name === "students") {
//     sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "");
//   }

//   // ✅ Update state
//   setFormData((prev) => ({
//     ...prev,
//     [name]: sanitizedValue,
//   }));

//   // ✅ Clear field error if exists
//   if (fieldErrors[name]) {
//     setFieldErrors((prev) => ({
//       ...prev,
//       [name]: undefined,
//     }));
//   }

//   // ✅ Auto-generate slug (only if empty)
//   if (name === "name" && !formData.slug) {
//     const generatedSlug = sanitizedValue
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-|-$/g, "");

//     setFormData((prev) => ({
//       ...prev,
//       slug: generatedSlug,
//     }));
//   }
// };

const handleInputChange = (e) => {
  const { name, value } = e.target;

  // 🚫 Remove + character
  let sanitizedValue = value.replace(/\+/g, "");

  // ✅ Students → only numbers
  if (name === "students") {
    sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "");
  }

  // ✅ Generate slug if name changes
  let updatedData = {
    [name]: sanitizedValue,
  };

  if (name === "name") {
    const generatedSlug = sanitizedValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    updatedData.slug = generatedSlug;
  }

  // ✅ Update state
  setFormData((prev) => ({
    ...prev,
    ...updatedData,
  }));

  // ✅ Clear field error
  if (fieldErrors[name]) {
    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }
};
  // Handle toggle changes for boolean fields
  const handleToggleChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 🟥 Clear file field error when a file is selected
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const maxSize = name === "pdf_file" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      if (name === "pdf_file" && file.type !== "application/pdf") {
        setError("Please upload a valid PDF file");
        return;
      }
      if (name !== "pdf_file" && !file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (name === "image") setImagePreview(URL.createObjectURL(file));
      else if (name === "banner_img")
        setBannerPreview(URL.createObjectURL(file));
      else if (name === "icon") setIconPreview(URL.createObjectURL(file));
      else if (name === "image2") setImage2Preview(URL.createObjectURL(file));
      else if (name === "pdf_file") setPdfName(file.name);

      // Clear error for this file field
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
      }

      setError("");
    }
  };

  const blockPlusKey = (e) => {
  if (e.key === "+") {
    e.preventDefault();
  }
};

  // 🟥 Clear error when file is removed
  const removeFile = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    if (field === "image") {
      setImagePreview("");
      document.getElementById("image-upload").value = "";
    } else if (field === "banner_img") {
      setBannerPreview("");
      document.getElementById("banner-upload").value = "";
    } else if (field === "icon") {
      setIconPreview("");
      document.getElementById("icon-upload").value = "";
    } else if (field === "image2") {
      setImage2Preview("");
      document.getElementById("image2-upload").value = "";
    } else if (field === "pdf_file") {
      setPdfName("");
      document.getElementById("pdf-upload").value = "";
    }

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 🟥 Validate all required fields
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Course name is required";
    }

    if (!formData.slug.trim()) {
      errors.slug = "Course slug is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.text.trim()) {
      errors.text = "Description is required";
    }

    if (formData.text.length > MAX_DESCRIPTION_LENGTH) {
      errors.text = `Description must be under ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (!formData.short_description.trim()) {
      errors.short_description = "Short description is required";
    }

    if (!formData.meta_title.trim()) {
      errors.meta_title = "Meta title is required";
    }

    if (!formData.meta_description.trim()) {
      errors.meta_description = "Meta description is required";
    }

    if (!formData.keywords.trim()) {
      errors.keywords = "Keywords are required";
    }

    // ✅ Duration validation
    if (formData.duration) {
      const durationNumber = parseFloat(formData.duration);
      if (isNaN(durationNumber)) {
        errors.duration = "Duration must be a number";
      } else if (durationNumber < 0) {
        errors.duration = "Duration cannot be negative";
      }
    }

    // ✅ Students validation (must be a number if provided)
    if (formData.students && !/^\d+$/.test(formData.students)) {
      errors.students = "Students must be a number";
    }

    // File fields
    if (!formData.image) errors.image = "Course image is required";
    if (!formData.banner_img) errors.banner_img = "Banner image is required";
    if (!formData.pdf_file) errors.pdf_file = "Syllabus PDF is required";
    if (!formData.icon) errors.icon = "Course icon is required";
    if (!formData.image2) errors.image2 = "Additional image is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper to build a user‑friendly list of empty fields
  const getEmptyFieldsList = (errors) => {
    const fieldLabels = {
      name: "Course name",
      slug: "Course slug",
      category: "Category",
      text: "Description",
      short_description: "Short description",
      meta_title: "Meta title",
      meta_description: "Meta description",
      keywords: "Keywords",
      image: "Course image",
      banner_img: "Banner image",
      pdf_file: "Syllabus PDF",
      icon: "Course icon",
      image2: "Additional image",
    };
    return Object.keys(errors)
      .map((key) => fieldLabels[key] || key)
      .join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const missingFields = getEmptyFieldsList(fieldErrors);
      setToast({
        show: true,
        message: `Please fill required fields`,
        type: "error",
      });
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoading(true);
    setError("");
    setToast({ ...toast, show: false });

    try {
      const submitData = new FormData();

      // Basic Information
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      submitData.append("category", formData.category);
      submitData.append("text", formData.text);
      if (formData.short_description)
        submitData.append("short_description", formData.short_description);

      // ✅ Course Details - Fixed: Added all fields properly
      if (formData.duration) submitData.append("duration", formData.duration);
      if (formData.lecture) submitData.append("lecture", formData.lecture);
      if (formData.students) submitData.append("students", formData.students);
      if (formData.level) submitData.append("level", formData.level);
      if (formData.language) submitData.append("language", formData.language);

      // ✅ Fixed: Convert certificate to boolean (backend expects true/false)
      const certificateBoolean = formData.certificate === "Yes";
      submitData.append("certificate", certificateBoolean.toString());

      // Toggle fields
      submitData.append("featured", formData.featured.toString());
      submitData.append("kids_course", formData.kids_course.toString());

      // SEO & Metadata
      if (formData.meta_title)
        submitData.append("meta_title", formData.meta_title);
      if (formData.meta_description)
        submitData.append("meta_description", formData.meta_description);
      if (formData.keywords) submitData.append("keywords", formData.keywords);

      // Media Files
      if (formData.image) submitData.append("image", formData.image);
      if (formData.banner_img)
        submitData.append("banner_img", formData.banner_img);
      if (formData.pdf_file) submitData.append("pdf_file", formData.pdf_file);
      if (formData.icon) submitData.append("icon", formData.icon);
      if (formData.image2) submitData.append("image2", formData.image2);

      // Use mutation instead of manual fetch
      mutation.mutate(submitData);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  // Generate short description from main description (plain text)
  const generateShortDescription = () => {
    const plainText = formData.text.replace(/<[^>]*>/g, "");
    const truncated = plainText.slice(0, 200);
    setFormData((prev) => ({ ...prev, short_description: truncated }));
    if (fieldErrors.short_description) {
      setFieldErrors((prev) => ({ ...prev, short_description: undefined }));
    }
    setToast({
      show: true,
      message: "Short description generated from main description",
      type: "success",
    });
  };

  // 🟥 Clear text error when editor content changes
  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, text: content }));
    if (fieldErrors.text) {
      setFieldErrors((prev) => ({ ...prev, text: undefined }));
    }
  };

  // ── Reusable Image Upload Box with error styling ──
  const ImageUploadBox = ({
    preview,
    onRemove,
    inputId,
    inputName,
    label,
    hint,
    iconBg,
    iconColor,
    error,
  }) => (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-6 ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <ImagePlus size={16} className={iconColor} />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
        </div>
      </div>

      {!preview ? (
        <div
          onClick={() => document.getElementById(inputId)?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Upload size={20} className="text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">
            Click to upload
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-indigo-500 font-medium">Browse files</span>
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-48 object-cover block"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
          >
            <X size={15} />
          </button>
          <button
            type="button"
            onClick={() => document.getElementById(inputId)?.click()}
            className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
          >
            Change
          </button>
        </div>
      )}
      <input
        type="file"
        name={inputName}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={inputId}
      />
    </div>
  );

  // ── PDF Upload Box with error styling ──
  const PdfUploadBox = ({ error }) => (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-6 ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-red-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">
            Syllabus PDF <span className="text-red-500">*</span>
          </p>
        </div>
      </div>

      {!pdfName ? (
        <div
          onClick={() => document.getElementById("pdf-upload")?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <Upload size={20} className="text-indigo-500" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">
            Upload Syllabus
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-indigo-500 font-medium">Browse files</span>
          </p>
        </div>
      ) : (
        <div className="relative flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-800 truncate">
              {pdfName}
            </p>
            <p className="text-xs text-indigo-500 mt-0.5">
              PDF · Ready to upload
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeFile("pdf_file")}
            className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input
        type="file"
        name="pdf_file"
        accept=".pdf"
        onChange={handleFileChange}
        id="pdf-upload"
        className="hidden"
      />
    </div>
  );

  // ── Toggle Switch Component ──
  const ToggleSwitch = ({ label, description, name, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(name, !checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  // ── Section Header ──
  const SectionHeader = ({
    icon: Icon,
    label,
    iconBg,
    iconColor,
    description,
    required = false,
  }) => (
    <div className="flex items-center gap-3 pt-2">
      <div
        className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={16} className={iconColor} />
      </div>

      <div>
        <p className="text-base font-bold text-gray-800">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </p>

        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
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
              onClick={() => navigate("/course")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Create New Course
              </h1>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
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
                Save Course
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0 text-red-500"
            />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Categories loading (using query's loading state) */}
        {loadingCategories && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-base text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
            Loading categories…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1 — Basic Information */}
          <SectionHeader
            icon={Tag}
            label="Basic Information"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          {/* Course Name */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="name"
              className="block text-base font-semibold text-gray-800 mb-1"
              required
            >
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Advanced React Development 2024"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                fieldErrors.name ? "border-red-500" : "border-gray-200"
              }`}
              required
               onKeyDown={blockPlusKey}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="slug"
              className="block text-base font-semibold text-gray-800 mb-1"
              required
            >
              Course Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 font-medium border-r border-gray-200 whitespace-nowrap">
                /course/
              </span>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="advanced-react-development-2024"
                className={`flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all ${
                  fieldErrors.slug ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            {fieldErrors.slug && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.slug}</p>
            )}
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="category"
              className="block text-base font-semibold text-gray-800 mb-1"
              required
            >
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none ${
                  fieldErrors.category ? "border-red-500" : "border-gray-200"
                }`}
                required
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
            {fieldErrors.category && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.category}
              </p>
            )}
          </div>

          {/* Description with tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <label
                htmlFor="text"
                className="block text-base font-semibold text-gray-800"
              >
                Description <span className="text-red-500">*</span>
              </label>

              {/* Tab Switcher */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setEditorMode("tinymce")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    editorMode === "tinymce"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  TinyMCE
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("html")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    editorMode === "html"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  HTML
                </button>
              </div>
            </div>

            {/* Conditional Editor */}
            {editorMode === "tinymce" ? (
              <div
                className={`border rounded-xl overflow-hidden ${
                  fieldErrors.text ? "border-red-500" : "border-gray-200"
                }`}
              >
                <Editor
                  apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j"
                  value={formData.text}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | code | help",
                    content_style:
                      "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
                    placeholder: "Write a detailed description of your course…",
                  }}
                />
              </div>
            ) : (
              <textarea
                value={formData.text}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, text: e.target.value }));
                  if (fieldErrors.text) {
                    setFieldErrors((prev) => ({ ...prev, text: undefined }));
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                  fieldErrors.text ? "border-red-500" : "border-gray-200"
                }`}
                rows={12}
                placeholder="<!-- Write HTML here -->"
              />
            )}
            {fieldErrors.text && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.text}</p>
            )}
          </div>

          {/* Short Description with auto‑generate button */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="short_description"
                className="block text-base font-semibold text-gray-800"
              >
                Short Description <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateShortDescription}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-all"
                title="Generate from main description"
              >
                <Sparkles size={14} />
                Generate
              </button>
            </div>
            <input
              id="short_description"
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              placeholder="e.g., Learn React from scratch in 40 hours"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                fieldErrors.short_description
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
            {fieldErrors.short_description && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.short_description}
              </p>
            )}
          </div>

          {/* SECTION 2 — Course Details */}
          <SectionHeader
            icon={BookMarked}
            label="Course Details"
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />

          {/* Duration / Lectures / Students */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  icon: Clock,
                  label: "Duration",
                  name: "duration",
                  placeholder: "e.g., 40",
                  bg: "bg-blue-50",
                  color: "text-blue-500",
                },
                {
                  icon: BookOpen,
                  label: "Lectures",
                  name: "lecture",
                  placeholder: "e.g., 98",
                  bg: "bg-emerald-50",
                  color: "text-emerald-500",
                },
                {
                  icon: Users,
                  label: "Students",
                  name: "students",
                  placeholder: "e.g., 1000",
                  bg: "bg-orange-50",
                  color: "text-orange-500",
                },
              ].map((field) => (
                <div key={field.name}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 ${field.bg} rounded-md flex items-center justify-center`}
                    >
                      <field.icon size={12} className={field.color} />
                    </div>
                    <label className="text-xs font-semibold text-gray-700">
                      {field.label}
                    </label>
                  </div>

                  <input
                    type="number"
                    min={0}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2.5 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                      fieldErrors[field.name]
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {fieldErrors[field.name] && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Level / Language / Certificate */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Level */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-purple-50 rounded-md flex items-center justify-center">
                    <Signal size={12} className="text-purple-500" />
                  </div>
                  <label className="text-xs font-semibold text-gray-700">
                    Difficulty Level
                  </label>
                </div>
                <div className="relative">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Language */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-teal-50 rounded-md flex items-center justify-center">
                    <Globe size={12} className="text-teal-500" />
                  </div>
                  <label className="text-xs font-semibold text-gray-700">
                    Language
                  </label>
                </div>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g., English"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>

              {/* Certificate */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-yellow-50 rounded-md flex items-center justify-center">
                    <Award size={12} className="text-yellow-500" />
                  </div>
                  <label className="text-xs font-semibold text-gray-700">
                    Certificate <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  {["No", "Yes"].map((val) => (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 rounded-xl cursor-pointer transition-all text-xs font-semibold ${
                        formData.certificate === val
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="certificate"
                        value={val}
                        checked={formData.certificate === val}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      {val === "Yes" ? <Award size={12} /> : <X size={12} />}
                      {val}
                    </label>
                  ))}
                </div>
                {fieldErrors.certificate && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.certificate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Options: Featured & Kids Course */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  Additional Options
                </p>
              </div>
            </div>
            <div className="space-y-3 divide-y divide-gray-100">
              <ToggleSwitch
                label="Featured Course"
                name="featured"
                checked={formData.featured}
                onChange={handleToggleChange}
              />
              <ToggleSwitch
                label="Kids Course"
                name="kids_course"
                checked={formData.kids_course}
                onChange={handleToggleChange}
              />
            </div>
          </div>

          {/* SECTION 3 — Media Files */}
          <SectionHeader
            icon={ImagePlus}
            label="Media Files"
            iconBg="bg-pink-50"
            iconColor="text-pink-500"
            required={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImageUploadBox
              preview={imagePreview}
              onRemove={() => removeFile("image")}
              inputId="image-upload"
              inputName="image"
              label="Course Image"
              iconBg="bg-pink-50"
              iconColor="text-pink-500"
              error={!!fieldErrors.image}
            />
            <ImageUploadBox
              preview={bannerPreview}
              onRemove={() => removeFile("banner_img")}
              inputId="banner-upload"
              inputName="banner_img"
              label="Banner Image "
              iconBg="bg-indigo-50"
              iconColor="text-indigo-500"
              error={!!fieldErrors.banner_img}
            />
            <ImageUploadBox
              preview={iconPreview}
              onRemove={() => removeFile("icon")}
              inputId="icon-upload"
              inputName="icon"
              label="Course Icon "
              iconBg="bg-violet-50"
              iconColor="text-violet-500"
              error={!!fieldErrors.icon}
            />
            <ImageUploadBox
              preview={image2Preview}
              onRemove={() => removeFile("image2")}
              inputId="image2-upload"
              inputName="image2"
              label="Additional Image "
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
              error={!!fieldErrors.image2}
            />
            <PdfUploadBox error={fieldErrors.pdf_file} />
          </div>

          {/* SECTION 4 — SEO & Metadata */}
          <SectionHeader
            icon={Search}
            label="SEO & Metadata"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            {/* Meta Title */}
            <div>
              <label
                htmlFor="meta_title"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Meta Title <span className="text-red-500">*</span>
              </label>
              <input
                id="meta_title"
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO optimized title for your course"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                  fieldErrors.meta_title ? "border-red-500" : "border-gray-200"
                }`}
              />
              {fieldErrors.meta_title && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.meta_title}
                </p>
              )}
              <p className="text-xs text-gray-400 text-right mt-1">
                {formData.meta_title.length} / 60
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Meta Description */}
            <div>
              <label
                htmlFor="meta_description"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description for search engines…"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none ${
                  fieldErrors.meta_description
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
              {fieldErrors.meta_description && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.meta_description}
                </p>
              )}
              <p className="text-xs text-gray-400 text-right mt-1">
                {formData.meta_description.length} / 160
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Keywords */}
            <div>
              <label
                htmlFor="keywords"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Keywords <span className="text-red-500">*</span>
              </label>
              <input
                id="keywords"
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="react, javascript, web development, frontend"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                  fieldErrors.keywords ? "border-red-500" : "border-gray-200"
                }`}
              />
              {fieldErrors.keywords && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.keywords}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Submit */}
          <div className="sm:hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

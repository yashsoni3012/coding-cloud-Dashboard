// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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
//   CheckCircle2,
//   AlertCircle,
//   Tag,
//   BookMarked,
//   Search,
// } from "lucide-react";

// export default function AddCourse() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           "https://codingcloud.pythonanywhere.com/category/",
//         );
//         const data = await response.json();

//         // ✅ FIX
//         setCategories(data.data || []);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setError("Failed to load categories");
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const [formData, setFormData] = useState({
//     name: "",
//     slug: "",
//     category: "",
//     text: "",
//     duration: "",
//     lecture: "",
//     students: "",
//     level: "",
//     language: "",
//     certificate: "No",
//     meta_title: "",
//     meta_description: "",
//     keywords: "",
//     image: null,
//     banner_img: null,
//     pdf_file: null,
//     icon: null,
//   });

//   const [imagePreview, setImagePreview] = useState("");
//   const [bannerPreview, setBannerPreview] = useState("");
//   const [iconPreview, setIconPreview] = useState("");
//   const [pdfName, setPdfName] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === "name" && !formData.slug) {
//       const generatedSlug = value
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/^-|-$/g, "");
//       setFormData((prev) => ({ ...prev, slug: generatedSlug }));
//     }
//   };

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
//       else if (name === "pdf_file") setPdfName(file.name);
//       setError("");
//     }
//   };

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
//     } else if (field === "pdf_file") {
//       setPdfName("");
//       document.getElementById("pdf-upload").value = "";
//     }
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) return "Course name is required";
//     if (!formData.slug.trim()) return "Course slug is required";
//     if (!formData.category) return "Category is required";
//     if (!formData.text.trim()) return "Description is required";
//     return "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       const submitData = new FormData();
//       submitData.append("name", formData.name);
//       submitData.append("slug", formData.slug);
//       submitData.append("category", formData.category);
//       submitData.append("text", formData.text);
//       if (formData.duration) submitData.append("duration", formData.duration);
//       if (formData.lecture) submitData.append("lecture", formData.lecture);
//       if (formData.students) submitData.append("students", formData.students);
//       if (formData.level) submitData.append("level", formData.level);
//       if (formData.language) submitData.append("language", formData.language);
//       submitData.append("certificate", formData.certificate);
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

//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/course/",
//         {
//           method: "POST",
//           body: submitData,
//         },
//       );
//       const data = await response.json();
//       if (response.ok || response.status === 201) {
//         setSuccess("Course created successfully!");
//         setTimeout(() => navigate("/course"), 2000);
//       } else {
//         setError(data.message || data.detail || "Failed to create course.");
//       }
//     } catch (err) {
//       setError("Network error. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Reusable Image Upload Box ──
//   const ImageUploadBox = ({
//     preview,
//     onRemove,
//     inputId,
//     inputName,
//     label,
//     hint,
//     iconBg,
//     iconColor,
//   }) => (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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
//             <span className="text-indigo-500 font-medium">Browse files</span> ·{" "}
//             {hint}
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

//   // ── PDF Upload Box ──
//   const PdfUploadBox = () => (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
//           <FileText size={16} className="text-red-500" />
//         </div>
//         <div>
//           <p className="text-base font-semibold text-gray-800">Syllabus PDF</p>
//           <p className="text-xs text-gray-400 mt-0.5">
//             Optional — PDF only · Max 10MB
//           </p>
//         </div>
//       </div>

//       {!pdfName ? (
//         <div
//           onClick={() => document.getElementById("pdf-upload")?.click()}
//           className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-red-200 hover:bg-red-50/40 transition-all select-none"
//         >
//           <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
//             <Upload size={20} className="text-red-400" />
//           </div>
//           <p className="text-base font-semibold text-gray-700 mb-1">
//             Upload Syllabus
//           </p>
//           <p className="text-xs text-gray-400">
//             <span className="text-red-400 font-medium">Browse files</span> · PDF
//             only up to 10MB
//           </p>
//         </div>
//       ) : (
//         <div className="relative flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
//           <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
//             <FileText size={18} className="text-red-600" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-base font-semibold text-gray-800 truncate">
//               {pdfName}
//             </p>
//             <p className="text-xs text-red-400 mt-0.5">PDF · Ready to upload</p>
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

//   // ── Section Header ──
//   const SectionHeader = ({
//     icon: Icon,
//     label,
//     iconBg,
//     iconColor,
//     description,
//   }) => (
//     <div className="flex items-center gap-3 pt-2">
//       <div
//         className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
//       >
//         <Icon size={16} className={iconColor} />
//       </div>
//       <div>
//         <p className="text-base font-bold text-gray-800">{label}</p>
//         {description && <p className="text-xs text-gray-400">{description}</p>}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ── Header ── */}
//       <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
//               <p className="text-xs text-gray-400 hidden sm:block">
//                 Add a new course to your platform
//               </p>
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

//       {/* ── Main ── */}
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

//         {/* Success Alert */}
//         {success && (
//           <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
//             <CheckCircle2
//               size={18}
//               className="mt-0.5 flex-shrink-0 text-emerald-500"
//             />
//             <span>{success}</span>
//           </div>
//         )}

//         {/* Categories loading */}
//         {loadingCategories && (
//           <div className="flex items-center gap-3 p-4 mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-base text-indigo-600">
//             <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
//             Loading categories…
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* ════════════════════════════════
//                         SECTION 1 — Basic Information
//                     ════════════════════════════════ */}
//           <SectionHeader
//             icon={Tag}
//             label="Basic Information"
//             description="Core details about your course"
//             iconBg="bg-indigo-50"
//             iconColor="text-indigo-600"
//           />

//           {/* Course Name */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="name"
//               className="block text-base font-semibold text-gray-800 mb-1"
//             >
//               Course Name <span className="text-red-500">*</span>
//             </label>
//             <p className="text-xs text-gray-400 mb-3">
//               Give your course a clear, descriptive title
//             </p>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="e.g., Advanced React Development 2024"
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//               required
//             />
//           </div>

//           {/* Slug */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="slug"
//               className="block text-base font-semibold text-gray-800 mb-1"
//             >
//               Course Slug <span className="text-red-500">*</span>
//             </label>
//             <p className="text-xs text-gray-400 mb-3">
//               Auto-generated from course name — you can customize it
//             </p>
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
//                 className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all"
//                 required
//               />
//             </div>
//           </div>

//           {/* Category */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="category"
//               className="block text-base font-semibold text-gray-800 mb-1"
//             >
//               Category <span className="text-red-500">*</span>
//             </label>
//             <p className="text-xs text-gray-400 mb-3">
//               Select the category that best fits your course
//             </p>
//             <div className="relative">
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none"
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
//           </div>

//           {/* Description */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//             <label
//               htmlFor="text"
//               className="block text-base font-semibold text-gray-800 mb-1"
//             >
//               Description <span className="text-red-500">*</span>
//             </label>
//             <p className="text-xs text-gray-400 mb-3">
//               Minimum 50 characters recommended for better SEO
//             </p>
//             <textarea
//               id="text"
//               name="text"
//               value={formData.text}
//               onChange={handleInputChange}
//               rows={5}
//               placeholder="Write a detailed description of your course…"
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
//               required
//             />
//             <p className="text-xs text-gray-400 text-right mt-2">
//               {formData.text.length} characters
//             </p>
//           </div>

//           {/* ════════════════════════════════
//                         SECTION 2 — Course Details
//                     ════════════════════════════════ */}
//           <SectionHeader
//             icon={BookMarked}
//             label="Course Details"
//             description="Duration, lectures, audience and difficulty"
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
//                   placeholder: "e.g., 40 hours",
//                   bg: "bg-blue-50",
//                   color: "text-blue-500",
//                 },
//                 {
//                   icon: BookOpen,
//                   label: "Lectures",
//                   name: "lecture",
//                   placeholder: "e.g., 98 lectures",
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
//                     type="text"
//                     name={field.name}
//                     value={formData[field.name]}
//                     onChange={handleInputChange}
//                     placeholder={field.placeholder}
//                     className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                   />
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
//                     Certificate
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
//               </div>
//             </div>
//           </div>

//           {/* ════════════════════════════════
//                         SECTION 3 — Media Files
//                     ════════════════════════════════ */}
//           <SectionHeader
//             icon={ImagePlus}
//             label="Media Files"
//             description="Images, icons, and course syllabus"
//             iconBg="bg-pink-50"
//             iconColor="text-pink-500"
//           />

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <ImageUploadBox
//               preview={imagePreview}
//               onRemove={() => removeFile("image")}
//               inputId="image-upload"
//               inputName="image"
//               label="Course Image"
//               hint="Optional — PNG, JPG · Max 5MB"
//               iconBg="bg-pink-50"
//               iconColor="text-pink-500"
//             />
//             <ImageUploadBox
//               preview={bannerPreview}
//               onRemove={() => removeFile("banner_img")}
//               inputId="banner-upload"
//               inputName="banner_img"
//               label="Banner Image"
//               hint="Optional — PNG, JPG · Max 5MB"
//               iconBg="bg-indigo-50"
//               iconColor="text-indigo-500"
//             />
//             <ImageUploadBox
//               preview={iconPreview}
//               onRemove={() => removeFile("icon")}
//               inputId="icon-upload"
//               inputName="icon"
//               label="Course Icon"
//               hint="Optional — PNG, JPG · Max 2MB"
//               iconBg="bg-violet-50"
//               iconColor="text-violet-500"
//             />
//             <PdfUploadBox />
//           </div>

//           {/* ════════════════════════════════
//                         SECTION 4 — SEO & Metadata
//                     ════════════════════════════════ */}
//           <SectionHeader
//             icon={Search}
//             label="SEO & Metadata"
//             description="Help search engines find your course"
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
//                 Meta Title
//               </label>
//               <p className="text-xs text-gray-400 mb-2">
//                 Recommended: 50–60 characters
//               </p>
//               <input
//                 id="meta_title"
//                 type="text"
//                 name="meta_title"
//                 value={formData.meta_title}
//                 onChange={handleInputChange}
//                 placeholder="SEO optimized title for your course"
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//               />
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
//                 Meta Description
//               </label>
//               <p className="text-xs text-gray-400 mb-2">
//                 Recommended: 150–160 characters
//               </p>
//               <textarea
//                 id="meta_description"
//                 name="meta_description"
//                 value={formData.meta_description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 placeholder="Brief description for search engines…"
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
//               />
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
//                 Keywords
//               </label>
//               <p className="text-xs text-gray-400 mb-2">
//                 Comma-separated keywords for better searchability
//               </p>
//               <input
//                 id="keywords"
//                 type="text"
//                 name="keywords"
//                 value={formData.keywords}
//                 onChange={handleInputChange}
//                 placeholder="react, javascript, web development, frontend"
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//               />
//             </div>
//           </div>

//           {/* ── Mobile Submit ── */}
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


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  CheckCircle2,
  AlertCircle,
  Tag,
  BookMarked,
  Search,
} from "lucide-react";

export default function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://codingcloud.pythonanywhere.com/category/",
        );
        const data = await response.json();

        // ✅ FIX
        setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    text: "",
    duration: "",
    lecture: "",
    students: "",
    level: "",
    language: "",
    certificate: "No",
    meta_title: "",
    meta_description: "",
    keywords: "",
    image: null,
    banner_img: null,
    pdf_file: null,
    icon: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [pdfName, setPdfName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name" && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

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
      else if (name === "pdf_file") setPdfName(file.name);
      setError("");
    }
  };

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
    } else if (field === "pdf_file") {
      setPdfName("");
      document.getElementById("pdf-upload").value = "";
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Course name is required";
    if (!formData.slug.trim()) return "Course slug is required";
    if (!formData.category) return "Category is required";
    if (!formData.text.trim()) return "Description is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      submitData.append("category", formData.category);
      submitData.append("text", formData.text); // rich text content
      if (formData.duration) submitData.append("duration", formData.duration);
      if (formData.lecture) submitData.append("lecture", formData.lecture);
      if (formData.students) submitData.append("students", formData.students);
      if (formData.level) submitData.append("level", formData.level);
      if (formData.language) submitData.append("language", formData.language);
      submitData.append("certificate", formData.certificate);
      if (formData.meta_title)
        submitData.append("meta_title", formData.meta_title);
      if (formData.meta_description)
        submitData.append("meta_description", formData.meta_description);
      if (formData.keywords) submitData.append("keywords", formData.keywords);
      if (formData.image) submitData.append("image", formData.image);
      if (formData.banner_img)
        submitData.append("banner_img", formData.banner_img);
      if (formData.pdf_file) submitData.append("pdf_file", formData.pdf_file);
      if (formData.icon) submitData.append("icon", formData.icon);

      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/course/",
        {
          method: "POST",
          body: submitData,
        },
      );
      const data = await response.json();
      if (response.ok || response.status === 201) {
        setSuccess("Course created successfully!");
        setTimeout(() => navigate("/course"), 2000);
      } else {
        setError(data.message || data.detail || "Failed to create course.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reusable Image Upload Box ──
  const ImageUploadBox = ({
    preview,
    onRemove,
    inputId,
    inputName,
    label,
    hint,
    iconBg,
    iconColor,
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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
            <span className="text-indigo-500 font-medium">Browse files</span> ·{" "}
            {hint}
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

  // ── PDF Upload Box ──
  const PdfUploadBox = () => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-red-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">Syllabus PDF</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Optional — PDF only · Max 10MB
          </p>
        </div>
      </div>

      {!pdfName ? (
        <div
          onClick={() => document.getElementById("pdf-upload")?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-red-200 hover:bg-red-50/40 transition-all select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
            <Upload size={20} className="text-red-400" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">
            Upload Syllabus
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-red-400 font-medium">Browse files</span> · PDF
            only up to 10MB
          </p>
        </div>
      ) : (
        <div className="relative flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-800 truncate">
              {pdfName}
            </p>
            <p className="text-xs text-red-400 mt-0.5">PDF · Ready to upload</p>
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

  // ── Section Header ──
  const SectionHeader = ({
    icon: Icon,
    label,
    iconBg,
    iconColor,
    description,
  }) => (
    <div className="flex items-center gap-3 pt-2">
      <div
        className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <p className="text-base font-bold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
              <p className="text-xs text-gray-400 hidden sm:block">
                Add a new course to your platform
              </p>
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

      {/* ── Main ── */}
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

        {/* Success Alert */}
        {success && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 flex-shrink-0 text-emerald-500"
            />
            <span>{success}</span>
          </div>
        )}

        {/* Categories loading */}
        {loadingCategories && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-base text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
            Loading categories…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ════════════════════════════════
                        SECTION 1 — Basic Information
                    ════════════════════════════════ */}
          <SectionHeader
            icon={Tag}
            label="Basic Information"
            description="Core details about your course"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          {/* Course Name */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="name"
              className="block text-base font-semibold text-gray-800 mb-1"
            >
              Course Name <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Give your course a clear, descriptive title
            </p>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Advanced React Development 2024"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              required
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="slug"
              className="block text-base font-semibold text-gray-800 mb-1"
            >
              Course Slug <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Auto-generated from course name — you can customize it
            </p>
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
                className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="category"
              className="block text-base font-semibold text-gray-800 mb-1"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Select the category that best fits your course
            </p>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none"
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
          </div>

          {/* Description with TinyMCE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label
              htmlFor="text"
              className="block text-base font-semibold text-gray-800 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Minimum 50 characters recommended for better SEO
            </p>
            <Editor
              apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j"
              value={formData.text}
              onEditorChange={(content) =>
                setFormData((prev) => ({ ...prev, text: content }))
              }
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                  "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                  "insertdatetime", "media", "table", "help", "wordcount"
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
                placeholder: "Write a detailed description of your course…",
              }}
            />
            <p className="text-xs text-gray-400 text-right mt-2">
              {formData.text.length} characters
            </p>
          </div>

          {/* ════════════════════════════════
                        SECTION 2 — Course Details
                    ════════════════════════════════ */}
          <SectionHeader
            icon={BookMarked}
            label="Course Details"
            description="Duration, lectures, audience and difficulty"
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
                  placeholder: "e.g., 40 hours",
                  bg: "bg-blue-50",
                  color: "text-blue-500",
                },
                {
                  icon: BookOpen,
                  label: "Lectures",
                  name: "lecture",
                  placeholder: "e.g., 98 lectures",
                  bg: "bg-emerald-50",
                  color: "text-emerald-500",
                },
                {
                  icon: Users,
                  label: "Students",
                  name: "students",
                  placeholder: "e.g., 1,000+",
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
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                  />
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
                    Certificate
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
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
                        SECTION 3 — Media Files
                    ════════════════════════════════ */}
          <SectionHeader
            icon={ImagePlus}
            label="Media Files"
            description="Images, icons, and course syllabus"
            iconBg="bg-pink-50"
            iconColor="text-pink-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImageUploadBox
              preview={imagePreview}
              onRemove={() => removeFile("image")}
              inputId="image-upload"
              inputName="image"
              label="Course Image"
              hint="Optional — PNG, JPG · Max 5MB"
              iconBg="bg-pink-50"
              iconColor="text-pink-500"
            />
            <ImageUploadBox
              preview={bannerPreview}
              onRemove={() => removeFile("banner_img")}
              inputId="banner-upload"
              inputName="banner_img"
              label="Banner Image"
              hint="Optional — PNG, JPG · Max 5MB"
              iconBg="bg-indigo-50"
              iconColor="text-indigo-500"
            />
            <ImageUploadBox
              preview={iconPreview}
              onRemove={() => removeFile("icon")}
              inputId="icon-upload"
              inputName="icon"
              label="Course Icon"
              hint="Optional — PNG, JPG · Max 2MB"
              iconBg="bg-violet-50"
              iconColor="text-violet-500"
            />
            <PdfUploadBox />
          </div>

          {/* ════════════════════════════════
                        SECTION 4 — SEO & Metadata
                    ════════════════════════════════ */}
          <SectionHeader
            icon={Search}
            label="SEO & Metadata"
            description="Help search engines find your course"
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
                Meta Title
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Recommended: 50–60 characters
              </p>
              <input
                id="meta_title"
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO optimized title for your course"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
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
                Meta Description
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Recommended: 150–160 characters
              </p>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description for search engines…"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
              />
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
                Keywords
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Comma-separated keywords for better searchability
              </p>
              <input
                id="keywords"
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="react, javascript, web development, frontend"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* ── Mobile Submit ── */}
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
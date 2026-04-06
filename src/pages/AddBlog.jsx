// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Editor } from "@tinymce/tinymce-react";
// import Toasts from "../pages/Toasts";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   FileText,
//   AlertCircle,
//   CheckCircle2,
//   Image as ImageIcon,
//   Calendar,
//   Tag,
//   HelpCircle,
//   Globe,
//   Hash,
//   ChevronDown,
//   Info,
//   Link,
//   Search,
//   Upload,
//   ImagePlus,
//   Sparkles,
// } from "lucide-react";

// // API function to create a blog
// const createBlog = async (formData) => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/blogs/",
//     { method: "POST", body: formData },
//   );

//   if (!response.ok) {
//     const errorText = await response.text();
//     let errorMessage;
//     try {
//       const errorData = JSON.parse(errorText);
//       if (errorData.errors) {
//         const backendErrors = {};
//         Object.keys(errorData.errors).forEach((key) => {
//           backendErrors[key] = errorData.errors[key].join(", ");
//         });
//         throw new Error(JSON.stringify(backendErrors));
//       }
//       errorMessage =
//         errorData.message || errorData.detail || JSON.stringify(errorData);
//     } catch {
//       errorMessage = errorText || `HTTP error ${response.status}`;
//     }
//     throw new Error(errorMessage);
//   }

//   return response.json();
// };

// // Helper: generate slug from title
// const generateSlugFromTitle = (title) => {
//   return title
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "")
//     .substring(0, 100); // limit length
// };

// export default function AddBlog() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const fileInputRef = useRef(null);
//   const editorRef = useRef(null);

//   const [editorMode, setEditorMode] = useState("tinymce");
//   const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     slug: "",
//     short_description: "",
//     status: "Drafts",
//     publish_date: new Date().toISOString().split("T")[0],
//     meta_title: "",
//     meta_descrtiption: "",
//     meta_keyword: "",
//     hashtag: "",
//     featured_image: null,
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   // Auto-generate slug from title when title changes and slug not manually edited
//   useEffect(() => {
//     if (!slugManuallyEdited && formData.title) {
//       const newSlug = generateSlugFromTitle(formData.title);
//       setFormData((prev) => ({ ...prev, slug: newSlug }));
//       // Clear slug error if any
//       if (fieldErrors.slug) {
//         setFieldErrors((prev) => ({ ...prev, slug: undefined }));
//       }
//     }
//   }, [formData.title, slugManuallyEdited]);

//   // React Query mutation
//   const mutation = useMutation({
//     mutationFn: createBlog,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["blogs"] });
//       setToast({
//         show: true,
//         message: "Blog added successfully!",
//         type: "success",
//       });
//       setTimeout(() => navigate("/blogs"), 2000);
//     },
//     onError: (err) => {
//       let errorMsg = err.message;
//       try {
//         const parsed = JSON.parse(errorMsg);
//         if (typeof parsed === "object") {
//           setFieldErrors(parsed);
//           setToast({
//             show: true,
//             message: "Please correct the errors below",
//             type: "error",
//           });
//           return;
//         }
//       } catch {
//         // Not JSON, treat as regular error
//       }
//       setToast({
//         show: true,
//         message: errorMsg,
//         type: "error",
//       });
//     },
//   });

//   const statusOptions = ["Drafts", "Published", "Scheduled"];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error for this field when user types
//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//     setError("");
//   };

//   const handleSlugChange = (e) => {
//     const rawValue = e.target.value;
//     // Sanitize slug: lowercase, replace spaces/non-alphanumeric with hyphens
//     const sanitized = rawValue
//       .toLowerCase()
//       .replace(/[^a-z0-9-]/g, "-")
//       .replace(/-+/g, "-")
//       .replace(/^-|-$/g, "");
//     setFormData((prev) => ({ ...prev, slug: sanitized }));
//     setSlugManuallyEdited(true); // user manually edited, stop auto updates
//     if (fieldErrors.slug) {
//       setFieldErrors((prev) => ({ ...prev, slug: undefined }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }
//       setFormData((prev) => ({ ...prev, featured_image: file }));
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//       setError("");
//       if (fieldErrors.featured_image) {
//         setFieldErrors((prev) => ({ ...prev, featured_image: undefined }));
//       }
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleImageChange({ target: { files: [file] } });
//   };

//   const triggerFileInput = () => fileInputRef.current?.click();

//   const removeImage = () => {
//     setFormData((prev) => ({ ...prev, featured_image: null }));
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (!formData.featured_image) {
//       setFieldErrors((prev) => ({
//         ...prev,
//         featured_image: "Featured image is required",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.title.trim()) errors.title = "Title is required";
//     if (!formData.content.trim()) errors.content = "Content is required";
//     if (!formData.slug.trim()) errors.slug = "Slug is required";
//     if (!formData.status) errors.status = "Status is required";
//     if (!formData.publish_date)
//       errors.publish_date = "Publish date is required";
//     if (!formData.hashtag.trim()) errors.hashtag = "Hashtag is required";
//     if (!formData.featured_image)
//       errors.featured_image = "Featured image is required";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setToast({
//         show: true,
//         message: "Please fill all required fields",
//         type: "error",
//       });
//       return;
//     }

//     const payload = new FormData();
//     payload.append("title", formData.title.trim());
//     payload.append("content", formData.content.trim());
//     payload.append("slug", formData.slug.trim());
//     payload.append("short_description", formData.short_description.trim());
//     payload.append("status", formData.status);
//     const formattedDate = formData.publish_date.includes("T")
//       ? formData.publish_date
//       : `${formData.publish_date}T00:00:00Z`;
//     payload.append("publish_date", formattedDate);
//     payload.append("meta_title", formData.meta_title.trim());
//     payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
//     payload.append("meta_keyword", formData.meta_keyword.trim());
//     payload.append("hashtag", formData.hashtag.trim());
//     if (formData.featured_image instanceof File)
//       payload.append("featured_image", formData.featured_image);

//     mutation.mutate(payload);
//   };

//   const SectionHeader = ({
//     icon: Icon,
//     label,
//     iconBg,
//     iconColor,
//     description,
//     badge,
//   }) => (
//     <div className="flex items-center gap-3 pt-2">
//       <div
//         className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
//       >
//         <Icon size={16} className={iconColor} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <p className="text-base font-bold text-gray-800">{label}</p>
//           {badge && (
//             <span className="text-xs text-gray-400 font-normal">{badge}</span>
//           )}
//         </div>
//         {description && <p className="text-xs text-gray-400">{description}</p>}
//       </div>
//     </div>
//   );

//   const statusColor = {
//     Published: "bg-emerald-100 text-emerald-700",
//     Scheduled: "bg-blue-100 text-blue-700",
//     Drafts: "bg-gray-100 text-gray-600",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {toast.show && (
//         <Toasts
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast((prev) => ({ ...prev, show: false }))}
//         />
//       )}
//       <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate("/blogs")}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
//             >
//               <ArrowLeft size={16} />
//               <span className="hidden sm:inline">Back</span>
//             </button>
//             <div className="w-px h-6 bg-gray-200" />
//             <div>
//               <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
//                 Add New Blog
//               </h1>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleSubmit}
//               disabled={mutation.isPending}
//               className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {mutation.isPending ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   Saving…
//                 </>
//               ) : (
//                 <>
//                   <Save size={15} />
//                   Save Blog
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
//         {error && (
//           <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
//             <AlertCircle
//               size={18}
//               className="mt-0.5 flex-shrink-0 text-red-500"
//             />
//             <div className="flex-1">
//               <p className="font-semibold">Error</p>
//               <p className="mt-0.5">{error}</p>
//             </div>
//             <button
//               onClick={() => setError("")}
//               className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         )}

//         {success && (
//           <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
//             <CheckCircle2
//               size={18}
//               className="flex-shrink-0 text-emerald-500"
//             />
//             <span className="flex-1 font-medium">{success}</span>
//             <span className="text-emerald-400 text-xs">
//               Redirecting to blogs…
//             </span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* LEFT COLUMN */}
//             <div className="lg:col-span-2 space-y-5">
//               <SectionHeader
//                 icon={FileText}
//                 label="General Information"
//                 iconBg="bg-indigo-50"
//                 iconColor="text-indigo-600"
//               />

//               {/* Title */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <label
//                   htmlFor="title"
//                   className="block text-base font-semibold text-gray-800 mb-1"
//                 >
//                   Blog Title <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <FileText
//                     size={16}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                   />
//                   <input
//                     id="title"
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Enter the title of the blog post"
//                     className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                       fieldErrors.title ? "border-red-500" : "border-gray-200"
//                     }`}
//                     required
//                   />
//                 </div>
//                 {fieldErrors.title && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {fieldErrors.title}
//                   </p>
//                 )}
//               </div>

//               {/* Slug with auto-generation */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <label
//                   htmlFor="slug"
//                   className="block text-base font-semibold text-gray-800 mb-1"
//                 >
//                   Slug / URL Path <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
//                   <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 font-medium border-r border-gray-200 whitespace-nowrap">
//                     /blog/
//                   </span>
//                   <input
//                     id="slug"
//                     type="text"
//                     name="slug"
//                     value={formData.slug}
//                     onChange={handleSlugChange}
//                     placeholder="auto-generated-from-title"
//                     className={`flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all ${
//                       fieldErrors.slug ? "border-red-500" : ""
//                     }`}
//                     required
//                   />
//                 </div>

//                 {fieldErrors.slug && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {fieldErrors.slug}
//                   </p>
//                 )}
//               </div>

//               {/* Short Description */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <label
//                   htmlFor="short_description"
//                   className="block text-base font-semibold text-gray-800 mb-1"
//                 >
//                   Short Description
//                 </label>
//                 <textarea
//                   id="short_description"
//                   name="short_description"
//                   value={formData.short_description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   placeholder="A brief summary of the blog post…"
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
//                 />
//                 <p className="text-xs text-gray-400 text-right mt-1">
//                   {formData.short_description.length} characters
//                 </p>
//               </div>

//               {/* Content with tabs */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-base font-semibold text-gray-800">
//                     Content <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
//                     <button
//                       type="button"
//                       onClick={() => setEditorMode("tinymce")}
//                       className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                         editorMode === "tinymce"
//                           ? "bg-white text-indigo-600 shadow-sm"
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       TinyMCE
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setEditorMode("html")}
//                       className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                         editorMode === "html"
//                           ? "bg-white text-indigo-600 shadow-sm"
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       HTML
//                     </button>
//                   </div>
//                 </div>

//                 {editorMode === "tinymce" ? (
//                   <div
//                     className={`border rounded-xl overflow-hidden ${fieldErrors.content ? "border-red-500" : "border-gray-200"}`}
//                   >
//                     <Editor
//                       apiKey="f45j826wq94pn0e0xseucsvqi8k7xug5idltalwrry8pevjm"
//                       onInit={(evt, editor) => (editorRef.current = editor)}
//                       value={formData.content}
//                       onEditorChange={(content) => {
//                         setFormData((prev) => ({ ...prev, content }));
//                         if (fieldErrors.content) {
//                           setFieldErrors((prev) => ({
//                             ...prev,
//                             content: undefined,
//                           }));
//                         }
//                       }}
//                       init={{
//                         height: 500,
//                         menubar: true,
//                         plugins: [
//                           "advlist",
//                           "autolink",
//                           "lists",
//                           "link",
//                           "image",
//                           "charmap",
//                           "preview",
//                           "anchor",
//                           "searchreplace",
//                           "visualblocks",
//                           "code",
//                           "fullscreen",
//                           "insertdatetime",
//                           "media",
//                           "table",
//                           "help",
//                           "wordcount",
//                         ],
//                         toolbar:
//                           "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
//                           "alignright alignjustify | bullist numlist outdent indent | removeformat | code | help",
//                         content_style:
//                           "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
//                         placeholder:
//                           "Write the full content of the blog post here…",
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <textarea
//                     value={formData.content}
//                     onChange={(e) => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         content: e.target.value,
//                       }));
//                       if (fieldErrors.content) {
//                         setFieldErrors((prev) => ({
//                           ...prev,
//                           content: undefined,
//                         }));
//                       }
//                     }}
//                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                       fieldErrors.content ? "border-red-500" : "border-gray-200"
//                     }`}
//                     rows={16}
//                     placeholder="<!-- Write HTML here -->"
//                   />
//                 )}
//                 {fieldErrors.content && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {fieldErrors.content}
//                   </p>
//                 )}
//               </div>

//               {/* SEO & Metadata */}
//               <SectionHeader
//                 icon={Search}
//                 label="SEO & Metadata"
//                 iconBg="bg-emerald-50"
//                 iconColor="text-emerald-600"
//               />
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <Globe size={13} className="text-gray-400" />
//                     <label
//                       htmlFor="meta_title"
//                       className="text-base font-semibold text-gray-800"
//                     >
//                       Meta Title
//                     </label>
//                   </div>
//                   <input
//                     id="meta_title"
//                     type="text"
//                     name="meta_title"
//                     value={formData.meta_title}
//                     onChange={handleInputChange}
//                     placeholder="SEO title for the blog"
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                   />
//                   <p className="text-xs text-gray-400 text-right mt-1">
//                     {formData.meta_title.length} / 60
//                   </p>
//                 </div>
//                 <div className="h-px bg-gray-100" />
//                 <div>
//                   <label
//                     htmlFor="meta_descrtiption"
//                     className="block text-base font-semibold text-gray-800 mb-1"
//                   >
//                     Meta Description
//                   </label>
//                   <textarea
//                     id="meta_descrtiption"
//                     name="meta_descrtiption"
//                     value={formData.meta_descrtiption}
//                     onChange={handleInputChange}
//                     rows={3}
//                     placeholder="SEO description for search engines…"
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
//                   />
//                   <p className="text-xs text-gray-400 text-right mt-1">
//                     {formData.meta_descrtiption.length} / 160
//                   </p>
//                 </div>
//                 <div className="h-px bg-gray-100" />
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <Tag size={13} className="text-gray-400" />
//                     <label
//                       htmlFor="meta_keyword"
//                       className="text-base font-semibold text-gray-800"
//                     >
//                       Meta Keywords
//                     </label>
//                   </div>
//                   <input
//                     id="meta_keyword"
//                     type="text"
//                     name="meta_keyword"
//                     value={formData.meta_keyword}
//                     onChange={handleInputChange}
//                     placeholder="coding, cloud, blog, tutorial"
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                   />
//                 </div>
//                 <div className="h-px bg-gray-100" />
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <Hash size={13} className="text-gray-400" />
//                     <label
//                       htmlFor="hashtag"
//                       className="text-base font-semibold text-gray-800"
//                     >
//                       Hashtags <span className="text-red-500">*</span>
//                     </label>
//                   </div>
//                   <input
//                     id="hashtag"
//                     type="text"
//                     name="hashtag"
//                     value={formData.hashtag}
//                     onChange={handleInputChange}
//                     placeholder="#coding #cloud #blog"
//                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                       fieldErrors.hashtag ? "border-red-500" : "border-gray-200"
//                     }`}
//                   />
//                   {fieldErrors.hashtag && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {fieldErrors.hashtag}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT COLUMN */}
//             <div className="space-y-5">
//               <SectionHeader
//                 icon={Calendar}
//                 label="Publishing"
//                 iconBg="bg-amber-50"
//                 iconColor="text-amber-600"
//               />
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//                 <div>
//                   <label
//                     htmlFor="status"
//                     className="block text-base font-semibold text-gray-800 mb-1"
//                   >
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="status"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer ${
//                         fieldErrors.status
//                           ? "border-red-500"
//                           : "border-gray-200"
//                       }`}
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown
//                       size={16}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                     />
//                   </div>
//                   {fieldErrors.status && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {fieldErrors.status}
//                     </p>
//                   )}
//                 </div>
//                 <div className="h-px bg-gray-100" />
//                 <div>
//                   <label
//                     htmlFor="publish_date"
//                     className="block text-base font-semibold text-gray-800 mb-1"
//                   >
//                     Publish Date <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="publish_date"
//                     type="date"
//                     name="publish_date"
//                     value={formData.publish_date}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                       fieldErrors.publish_date
//                         ? "border-red-500"
//                         : "border-gray-200"
//                     }`}
//                     required
//                   />
//                   {fieldErrors.publish_date && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {fieldErrors.publish_date}
//                     </p>
//                   )}
//                 </div>
//                 <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
//                   <p className="text-xs text-gray-400 mb-2 font-medium">
//                     Preview
//                   </p>
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span
//                       className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[formData.status] || "bg-gray-100 text-gray-600"}`}
//                     >
//                       {formData.status}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {formData.publish_date
//                         ? new Date(formData.publish_date).toLocaleDateString(
//                             "en-US",
//                             {
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                             },
//                           )
//                         : "—"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <SectionHeader
//                 icon={ImagePlus}
//                 label="Featured Image"
//                 iconBg="bg-pink-50"
//                 iconColor="text-pink-500"
//               />
//               <div
//                 className={`bg-white rounded-2xl border shadow-sm p-6 ${
//                   fieldErrors.featured_image
//                     ? "border-red-500"
//                     : "border-gray-200"
//                 }`}
//               >
//                 {!imagePreview ? (
//                   <div
//                     onClick={triggerFileInput}
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       setDragOver(true);
//                     }}
//                     onDragLeave={() => setDragOver(false)}
//                     onDrop={handleDrop}
//                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
//                       dragOver
//                         ? "border-indigo-400 bg-indigo-50"
//                         : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
//                     }`}
//                   >
//                     <div
//                       className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${dragOver ? "bg-indigo-100" : "bg-gray-100"}`}
//                     >
//                       <Upload
//                         size={20}
//                         className={
//                           dragOver ? "text-indigo-500" : "text-gray-400"
//                         }
//                       />
//                     </div>
//                     <p className="text-base font-semibold text-gray-700 mb-1">
//                       {dragOver
//                         ? "Drop your image here!"
//                         : "Click to upload or drag & drop"}
//                     </p>

//                     <p className="text-xs text-indigo-600 font-medium">
//                       Browse files
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-full max-h-56 object-cover block"
//                     />
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 pointer-events-none">
//                       <p className="text-xs text-white/80 font-medium truncate">
//                         {formData.featured_image?.name}
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         triggerFileInput();
//                       }}
//                       className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
//                     >
//                       Change
//                     </button>
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeImage();
//                       }}
//                       className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
//                     >
//                       <X size={15} />
//                     </button>
//                   </div>
//                 )}
//                 {fieldErrors.featured_image && (
//                   <p className="text-xs text-red-500 mt-2">
//                     {fieldErrors.featured_image}
//                   </p>
//                 )}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="sm:hidden mt-4">
//             <button
//               type="submit"
//               disabled={mutation.isPending}
//               className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {mutation.isPending ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   Saving…
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   Save Blog
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
import { Editor } from "@tinymce/tinymce-react";
import Toasts from "../pages/Toasts";
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Tag,
  Globe,
  Hash,
  ChevronDown,
  Search,
  Upload,
  ImagePlus,
} from "lucide-react";

// API function to create a blog
const createBlog = async (formData) => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/blogs/",
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.errors) {
        const backendErrors = {};
        Object.keys(errorData.errors).forEach((key) => {
          backendErrors[key] = errorData.errors[key].join(", ");
        });
        throw new Error(JSON.stringify(backendErrors));
      }
      errorMessage =
        errorData.message || errorData.detail || JSON.stringify(errorData);
    } catch {
      errorMessage = errorText || `HTTP error ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Helper: generate slug from title
const generateSlugFromTitle = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
};

export default function AddBlog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  const [editorMode, setEditorMode] = useState("tinymce");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    short_description: "",
    status: "Drafts",
    publish_date: "", // optional, empty by default
    meta_title: "",
    meta_descrtiption: "",
    meta_keyword: "",
    hashtag: "",
    featured_image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Auto-generate slug from title when title changes and slug not manually edited
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      const newSlug = generateSlugFromTitle(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
      if (fieldErrors.slug) {
        setFieldErrors((prev) => ({ ...prev, slug: undefined }));
      }
    }
  }, [formData.title, slugManuallyEdited]);

  // React Query mutation
  const mutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setToast({
        show: true,
        message: "Blog added successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/blogs"), 2000);
    },
    onError: (err) => {
      let errorMsg = err.message;
      try {
        const parsed = JSON.parse(errorMsg);
        if (typeof parsed === "object") {
          setFieldErrors(parsed);
          setToast({
            show: true,
            message: "Please correct the errors below",
            type: "error",
          });
          return;
        }
      } catch {
        // Not JSON, treat as regular error
      }
      setToast({
        show: true,
        message: errorMsg,
        type: "error",
      });
    },
  });

  const statusOptions = ["Drafts", "Published", "Scheduled"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      setFormData((prev) => ({ ...prev, featured_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError("");
      if (fieldErrors.featured_image) {
        setFieldErrors((prev) => ({ ...prev, featured_image: undefined }));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange({ target: { files: [file] } });
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featured_image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Only validate required fields: title, content, slug, status, hashtag
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    if (!formData.slug.trim()) errors.slug = "Slug is required";
    if (!formData.status) errors.status = "Status is required";
    if (!formData.hashtag.trim()) errors.hashtag = "Hashtag is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        show: true,
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("content", formData.content.trim());
    payload.append("slug", formData.slug.trim());
    payload.append("status", formData.status);
    payload.append("hashtag", formData.hashtag.trim());

    // Optional fields – only append if they have a value
    if (formData.short_description.trim())
      payload.append("short_description", formData.short_description.trim());
    if (formData.publish_date) {
      const formattedDate = formData.publish_date.includes("T")
        ? formData.publish_date
        : `${formData.publish_date}T00:00:00Z`;
      payload.append("publish_date", formattedDate);
    }
    if (formData.meta_title.trim())
      payload.append("meta_title", formData.meta_title.trim());
    if (formData.meta_descrtiption.trim())
      payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
    if (formData.meta_keyword.trim())
      payload.append("meta_keyword", formData.meta_keyword.trim());
    if (formData.featured_image instanceof File)
      payload.append("featured_image", formData.featured_image);

    mutation.mutate(payload);
  };

  const SectionHeader = ({ icon: Icon, label, iconBg, iconColor, description, badge }) => (
    <div className="flex items-center gap-3 pt-2">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-gray-800">{label}</p>
          {badge && <span className="text-xs text-gray-400 font-normal">{badge}</span>}
        </div>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  );

  const statusColor = {
    Published: "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Drafts: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Add New Blog
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
                  Save Blog
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
            <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
            <span className="flex-1 font-medium">{success}</span>
            <span className="text-emerald-400 text-xs">Redirecting to blogs…</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-5">
              <SectionHeader
                icon={FileText}
                label="General Information"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
              />

              {/* Title */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label htmlFor="title" className="block text-base font-semibold text-gray-800 mb-1">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter the title of the blog post"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                      fieldErrors.title ? "border-red-500" : "border-gray-200"
                    }`}
                    required
                  />
                </div>
                {fieldErrors.title && <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>}
              </div>

              {/* Slug */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label htmlFor="slug" className="block text-base font-semibold text-gray-800 mb-1">
                  Slug / URL Path <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
                  <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 border-r border-gray-200 whitespace-nowrap">
                    /blog/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="auto-generated-from-title"
                    className={`flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all ${
                      fieldErrors.slug ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
              
                {fieldErrors.slug && <p className="text-xs text-red-500 mt-1">{fieldErrors.slug}</p>}
              </div>

              {/* Short Description (optional) */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label htmlFor="short_description" className="block text-base font-semibold text-gray-800 mb-1">
                  Short Description <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </label>
                <textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="A brief summary of the blog post…"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{formData.short_description.length} characters</p>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-base font-semibold text-gray-800">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setEditorMode("tinymce")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        editorMode === "tinymce" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      TinyMCE
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("html")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        editorMode === "html" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      HTML
                    </button>
                  </div>
                </div>

                {editorMode === "tinymce" ? (
                  <div className={`border rounded-xl overflow-hidden ${fieldErrors.content ? "border-red-500" : "border-gray-200"}`}>
                    <Editor
                      apiKey="f45j826wq94pn0e0xseucsvqi8k7xug5idltalwrry8pevjm"
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      value={formData.content}
                      onEditorChange={(content) => {
                        setFormData((prev) => ({ ...prev, content }));
                        if (fieldErrors.content) setFieldErrors((prev) => ({ ...prev, content: undefined }));
                      }}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                          "insertdatetime", "media", "table", "help", "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | removeformat | code | help",
                        content_style: "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
                        placeholder: "Write the full content of the blog post here…",
                      }}
                    />
                  </div>
                ) : (
                  <textarea
                    value={formData.content}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, content: e.target.value }));
                      if (fieldErrors.content) setFieldErrors((prev) => ({ ...prev, content: undefined }));
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                      fieldErrors.content ? "border-red-500" : "border-gray-200"
                    }`}
                    rows={16}
                    placeholder="<!-- Write HTML here -->"
                  />
                )}
                {fieldErrors.content && <p className="text-xs text-red-500 mt-1">{fieldErrors.content}</p>}
              </div>

              {/* SEO & Metadata (all optional) */}
              <SectionHeader
                icon={Search}
                label="SEO & Metadata"
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={13} className="text-gray-400" />
                    <label htmlFor="meta_title" className="text-base font-semibold text-gray-800">
                      Meta Title <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                    </label>
                  </div>
                  <input
                    id="meta_title"
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title for the blog"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{formData.meta_title.length} / 60</p>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <label htmlFor="meta_descrtiption" className="block text-base font-semibold text-gray-800 mb-1">
                    Meta Description <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="meta_descrtiption"
                    name="meta_descrtiption"
                    value={formData.meta_descrtiption}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="SEO description for search engines…"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{formData.meta_descrtiption.length} / 160</p>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={13} className="text-gray-400" />
                    <label htmlFor="meta_keyword" className="text-base font-semibold text-gray-800">
                      Meta Keywords <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                    </label>
                  </div>
                  <input
                    id="meta_keyword"
                    type="text"
                    name="meta_keyword"
                    value={formData.meta_keyword}
                    onChange={handleInputChange}
                    placeholder="coding, cloud, blog, tutorial"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              <SectionHeader icon={Calendar} label="Publishing" iconBg="bg-amber-50" iconColor="text-amber-600" />
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <div>
                  <label htmlFor="status" className="block text-base font-semibold text-gray-800 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer ${
                        fieldErrors.status ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {fieldErrors.status && <p className="text-xs text-red-500 mt-1">{fieldErrors.status}</p>}
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <label htmlFor="publish_date" className="block text-base font-semibold text-gray-800 mb-1">
                    Publish Date <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                  </label>
                  <input
                    id="publish_date"
                    type="date"
                    name="publish_date"
                    value={formData.publish_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Preview</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[formData.status] || "bg-gray-100 text-gray-600"}`}>
                      {formData.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formData.publish_date ? new Date(formData.publish_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }) : "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Image (optional) */}
              <SectionHeader icon={ImagePlus} label="Featured Image" iconBg="bg-pink-50" iconColor="text-pink-500" />
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                {!imagePreview ? (
                  <div
                    onClick={triggerFileInput}
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
                    <p className="text-xs text-indigo-600 font-medium">Browse files</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB (optional)</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover block" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 pointer-events-none">
                      <p className="text-xs text-white/80 font-medium truncate">{formData.featured_image?.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                      className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Hashtag (required) */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Hash size={13} className="text-gray-400" />
                  <label htmlFor="hashtag" className="text-base font-semibold text-gray-800">
                    Hashtags <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  id="hashtag"
                  type="text"
                  name="hashtag"
                  value={formData.hashtag}
                  onChange={handleInputChange}
                  placeholder="#coding #cloud #blog"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                    fieldErrors.hashtag ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.hashtag && <p className="text-xs text-red-500 mt-1">{fieldErrors.hashtag}</p>}
              </div>
            </div>
          </div>

          <div className="sm:hidden mt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Blog
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
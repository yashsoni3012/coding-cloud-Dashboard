// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//     ArrowLeft,
//     Save,
//     X,
//     FileText,
//     AlertCircle,
//     CheckCircle2,
//     Image as ImageIcon,
//     Calendar,
//     Tag,
//     HelpCircle,
//     Globe,
//     Hash,
//     ChevronDown,
//     Link,
//     Search,
//     Upload,
//     ImagePlus,
// } from "lucide-react";

// export default function EditBlog() {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const location = useLocation();
//     const locationState = location.state;
//     const fileInputRef = useRef(null);

//     const [formData, setFormData] = useState({
//         title: "",
//         content: "",
//         slug: "",
//         short_description: "",
//         status: "",
//         publish_date: "",
//         meta_title: "",
//         meta_descrtiption: "",
//         meta_keyword: "",
//         hashtag: "",
//         featured_image: null,
//     });

//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const [originalImage, setOriginalImage] = useState(null);
//     const [dragOver, setDragOver] = useState(false);

//     const statusOptions = ["Drafts", "Published", "Scheduled"];

//     useEffect(() => {
//         const fetchBlog = async () => {
//             try {
//                 setLoading(true);
//                 let blogData = null;

//                 if (locationState && locationState.blog) {
//                     blogData = locationState.blog;
//                 } else {
//                     const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");
//                     if (response.ok) {
//                         const dataRes = await response.json();
//                         const listData = dataRes.data || dataRes;
//                         blogData = Array.isArray(listData)
//                             ? listData.find((b) => b.id === parseInt(id))
//                             : null;
//                     }
//                 }

//                 if (blogData) {
//                     setFormData({
//                         title: blogData.title || "",
//                         content: blogData.content || "",
//                         slug: blogData.slug || "",
//                         short_description: blogData.short_description || "",
//                         status: blogData.status || "Drafts",
//                         publish_date: blogData.publish_date ? blogData.publish_date.split("T")[0] : "",
//                         meta_title: blogData.meta_title || "",
//                         meta_descrtiption: blogData.meta_descrtiption || "",
//                         meta_keyword: blogData.meta_keyword || "",
//                         hashtag: blogData.hashtag || "",
//                         featured_image: null,
//                     });
//                     if (blogData.featured_image) {
//                         const fullImageUrl = `https://codingcloud.pythonanywhere.com${blogData.featured_image}`;
//                         setImagePreview(fullImageUrl);
//                         setOriginalImage(fullImageUrl);
//                     }
//                 } else {
//                     setError("Blog not found.");
//                 }
//             } catch (err) {
//                 console.error("Error fetching blog details:", err);
//                 setError("Failed to load blog details.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchBlog();
//     }, [id, locationState]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setError("");
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (!file.type.startsWith("image/")) { setError("Please select a valid image file"); return; }
//             setFormData((prev) => ({ ...prev, featured_image: file }));
//             const reader = new FileReader();
//             reader.onloadend = () => setImagePreview(reader.result);
//             reader.readAsDataURL(file);
//             setError("");
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setDragOver(false);
//         const file = e.dataTransfer.files?.[0];
//         if (file) handleImageChange({ target: { files: [file] } });
//     };

//     const triggerFileInput = () => fileInputRef.current?.click();

//     const removeImage = () => {
//         setFormData((prev) => ({ ...prev, featured_image: null }));
//         setImagePreview(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//     };

//     const restoreOriginalImage = () => {
//         setFormData((prev) => ({ ...prev, featured_image: null }));
//         setImagePreview(originalImage);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//     };

//     const validateForm = () => {
//         if (!formData.title.trim()) return "Title is required";
//         if (!formData.content.trim()) return "Content is required";
//         if (!formData.slug.trim()) return "Slug is required";
//         if (!formData.status) return "Status is required";
//         if (!formData.publish_date) return "Publish date is required";
//         return "";
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationError = validateForm();
//         if (validationError) { setError(validationError); return; }
//         setSaving(true);
//         setError("");
//         setSuccess("");
//         try {
//             const payload = new FormData();
//             payload.append("title", formData.title.trim());
//             payload.append("content", formData.content.trim());
//             payload.append("slug", formData.slug.trim());
//             if (formData.short_description !== undefined) payload.append("short_description", formData.short_description.trim());
//             payload.append("status", formData.status);
//             const formattedDate = formData.publish_date.includes("T") ? formData.publish_date : `${formData.publish_date}T00:00:00Z`;
//             payload.append("publish_date", formattedDate);
//             if (formData.meta_title !== undefined) payload.append("meta_title", formData.meta_title.trim());
//             if (formData.meta_descrtiption !== undefined) payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
//             if (formData.meta_keyword !== undefined) payload.append("meta_keyword", formData.meta_keyword.trim());
//             if (formData.hashtag !== undefined) payload.append("hashtag", formData.hashtag.trim());
//             if (formData.featured_image && formData.featured_image instanceof File) payload.append("featured_image", formData.featured_image);

//             const response = await fetch(`https://codingcloud.pythonanywhere.com/blogs/${id}/`, { method: "PATCH", body: payload });
//             if (!response.ok) {
//                 let errorMessage;
//                 try {
//                     const errorText = await response.text();
//                     const errorData = JSON.parse(errorText);
//                     errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
//                 } catch { errorMessage = `HTTP error ${response.status}`; }
//                 throw new Error(errorMessage);
//             }
//             setSuccess("Blog updated successfully!");
//             setTimeout(() => navigate("/blogs"), 2000);
//         } catch (err) {
//             console.error("Error updating blog:", err);
//             setError(err.message || "Failed to update blog. Please check your connection.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const isNewImage = formData.featured_image instanceof File;

//     const statusColor = {
//         Published: "bg-emerald-100 text-emerald-700",
//         Scheduled: "bg-blue-100 text-blue-700",
//         Drafts: "bg-gray-100 text-gray-600",
//     };

//     const SectionHeader = ({ icon: Icon, label, iconBg, iconColor, description, badge }) => (
//         <div className="flex items-center gap-3 pt-2">
//             <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
//                 <Icon size={16} className={iconColor} />
//             </div>
//             <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                     <p className="text-base font-bold text-gray-800">{label}</p>
//                     {badge && <span className="text-xs text-gray-400 font-normal">{badge}</span>}
//                 </div>
//                 {description && <p className="text-xs text-gray-400">{description}</p>}
//             </div>
//         </div>
//     );

//     // ── Loading State ──
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
//                     <p className="text-base text-gray-500 font-medium">Loading blog details…</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">

//             {/* ── Header ── */}
//             <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
//                         >
//                             <ArrowLeft size={16} />
//                             <span className="hidden sm:inline">Back</span>
//                         </button>
//                         <div className="w-px h-6 bg-gray-200" />
//                         <div>
//                             <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit Blog</h1>
//                             <p className="text-xs text-gray-400 hidden sm:block">ID: {id} · Update blog post</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-2">
                        
//                         <button
//                             onClick={handleSubmit}
//                             disabled={saving}
//                             className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {saving ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                     Updating…
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save size={15} />
//                                     Update Blog
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* ── Main ── */}
//             <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

//                 {/* Error Alert */}
//                 {error && (
//                     <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
//                         <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
//                         <div className="flex-1">
//                             <p className="font-semibold">Error</p>
//                             <p className="mt-0.5">{error}</p>
//                         </div>
//                         <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
//                             <X size={16} />
//                         </button>
//                     </div>
//                 )}

//                 {/* Success Alert */}
//                 {success && (
//                     <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
//                         <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
//                         <span className="flex-1 font-medium">{success}</span>
//                         <span className="text-emerald-400 text-xs">Redirecting to blogs…</span>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                         {/* ══════════════════════════════════════
//                             LEFT COLUMN — Main Content (2/3)
//                         ══════════════════════════════════════ */}
//                         <div className="lg:col-span-2 space-y-5">

//                             {/* ── General Information ── */}
//                             <SectionHeader
//                                 icon={FileText}
//                                 label="General Information"
//                                 description="Title, slug, description and full content"
//                                 iconBg="bg-indigo-50"
//                                 iconColor="text-indigo-600"
//                             />

//                             {/* Title */}
//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                                 <label htmlFor="title" className="block text-base font-semibold text-gray-800 mb-1">
//                                     Blog Title <span className="text-red-500">*</span>
//                                 </label>
//                                 <p className="text-xs text-gray-400 mb-3">Give your blog post a clear, engaging title</p>
//                                 <div className="relative">
//                                     <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                                     <input
//                                         id="title"
//                                         type="text"
//                                         name="title"
//                                         value={formData.title}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter the title of the blog post"
//                                         className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Slug */}
//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                                 <label htmlFor="slug" className="block text-base font-semibold text-gray-800 mb-1">
//                                     Slug / URL Path <span className="text-red-500">*</span>
//                                 </label>
//                                 <p className="text-xs text-gray-400 mb-3">URL-friendly identifier for this post</p>
//                                 <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
//                                     <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 font-medium border-r border-gray-200 whitespace-nowrap">
//                                         /blog/
//                                     </span>
//                                     <input
//                                         id="slug"
//                                         type="text"
//                                         name="slug"
//                                         value={formData.slug}
//                                         onChange={(e) => {
//                                             const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
//                                             setFormData((prev) => ({ ...prev, slug: val }));
//                                         }}
//                                         placeholder="how-to-learn-react"
//                                         className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all"
//                                         required
//                                     />
//                                 </div>
//                                 <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
//                                     <Link size={11} />
//                                     Final URL: /blog/{formData.slug || "your-slug"}
//                                 </p>
//                             </div>

//                             {/* Short Description */}
//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                                 <label htmlFor="short_description" className="block text-base font-semibold text-gray-800 mb-1">
//                                     Short Description
//                                 </label>
//                                 <p className="text-xs text-gray-400 mb-3">A brief summary shown in blog listings</p>
//                                 <textarea
//                                     id="short_description"
//                                     name="short_description"
//                                     value={formData.short_description}
//                                     onChange={handleInputChange}
//                                     rows={3}
//                                     placeholder="A brief summary of the blog post…"
//                                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
//                                 />
//                                 <p className="text-xs text-gray-400 text-right mt-1">{formData.short_description.length} characters</p>
//                             </div>

//                             {/* Main Content */}
//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                                 <label htmlFor="content" className="block text-base font-semibold text-gray-800 mb-1">
//                                     Content <span className="text-red-500">*</span>
//                                 </label>
//                                 <p className="text-xs text-gray-400 mb-3">Write the full content of your blog post</p>
//                                 <textarea
//                                     id="content"
//                                     name="content"
//                                     value={formData.content}
//                                     onChange={handleInputChange}
//                                     rows={14}
//                                     placeholder="Write the full content of the blog post here…"
//                                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y font-mono"
//                                     required
//                                 />
//                                 <p className="text-xs text-gray-400 text-right mt-1">{formData.content.length} characters</p>
//                             </div>

//                             {/* ── SEO & Metadata ── */}
//                             <SectionHeader
//                                 icon={Search}
//                                 label="SEO & Metadata"
//                                 description="Help search engines find your blog post"
//                                 iconBg="bg-emerald-50"
//                                 iconColor="text-emerald-600"
//                                 badge="(Optional)"
//                             />

//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//                                 {/* Meta Title */}
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-1">
//                                         <Globe size={13} className="text-gray-400" />
//                                         <label htmlFor="meta_title" className="text-base font-semibold text-gray-800">Meta Title</label>
//                                     </div>
//                                     <p className="text-xs text-gray-400 mb-2">Recommended: 50–60 characters</p>
//                                     <input
//                                         id="meta_title"
//                                         type="text"
//                                         name="meta_title"
//                                         value={formData.meta_title}
//                                         onChange={handleInputChange}
//                                         placeholder="SEO title for the blog"
//                                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                                     />
//                                     <p className="text-xs text-gray-400 text-right mt-1">{formData.meta_title.length} / 60</p>
//                                 </div>

//                                 <div className="h-px bg-gray-100" />

//                                 {/* Meta Description */}
//                                 <div>
//                                     <label htmlFor="meta_descrtiption" className="block text-base font-semibold text-gray-800 mb-1">Meta Description</label>
//                                     <p className="text-xs text-gray-400 mb-2">Recommended: 150–160 characters</p>
//                                     <textarea
//                                         id="meta_descrtiption"
//                                         name="meta_descrtiption"
//                                         value={formData.meta_descrtiption}
//                                         onChange={handleInputChange}
//                                         rows={3}
//                                         placeholder="SEO description for search engines…"
//                                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
//                                     />
//                                     <p className="text-xs text-gray-400 text-right mt-1">{formData.meta_descrtiption.length} / 160</p>
//                                 </div>

//                                 <div className="h-px bg-gray-100" />

//                                 {/* Meta Keywords */}
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-1">
//                                         <Tag size={13} className="text-gray-400" />
//                                         <label htmlFor="meta_keyword" className="text-base font-semibold text-gray-800">Meta Keywords</label>
//                                     </div>
//                                     <p className="text-xs text-gray-400 mb-2">Comma-separated keywords for SEO</p>
//                                     <input
//                                         id="meta_keyword"
//                                         type="text"
//                                         name="meta_keyword"
//                                         value={formData.meta_keyword}
//                                         onChange={handleInputChange}
//                                         placeholder="coding, cloud, blog, tutorial"
//                                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                                     />
//                                 </div>

//                                 <div className="h-px bg-gray-100" />

//                                 {/* Hashtags */}
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-1">
//                                         <Hash size={13} className="text-gray-400" />
//                                         <label htmlFor="hashtag" className="text-base font-semibold text-gray-800">Hashtags</label>
//                                     </div>
//                                     <p className="text-xs text-gray-400 mb-2">Space-separated hashtags for social media</p>
//                                     <input
//                                         id="hashtag"
//                                         type="text"
//                                         name="hashtag"
//                                         value={formData.hashtag}
//                                         onChange={handleInputChange}
//                                         placeholder="#coding #cloud #blog"
//                                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* ══════════════════════════════════════
//                             RIGHT COLUMN — Sidebar (1/3)
//                         ══════════════════════════════════════ */}
//                         <div className="space-y-5">

//                             {/* ── Publishing Card ── */}
//                             <SectionHeader
//                                 icon={Calendar}
//                                 label="Publishing"
//                                 description="Status and publish date"
//                                 iconBg="bg-amber-50"
//                                 iconColor="text-amber-600"
//                             />

//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//                                 {/* Status */}
//                                 <div>
//                                     <label htmlFor="status" className="block text-base font-semibold text-gray-800 mb-1">
//                                         Status <span className="text-red-500">*</span>
//                                     </label>
//                                     <p className="text-xs text-gray-400 mb-2">Choose the publication state</p>
//                                     <div className="relative">
//                                         <select
//                                             id="status"
//                                             name="status"
//                                             value={formData.status}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
//                                         >
//                                             {statusOptions.map((status) => (
//                                                 <option key={status} value={status}>{status}</option>
//                                             ))}
//                                         </select>
//                                         <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                                     </div>
//                                 </div>

//                                 <div className="h-px bg-gray-100" />

//                                 {/* Publish Date */}
//                                 <div>
//                                     <label htmlFor="publish_date" className="block text-base font-semibold text-gray-800 mb-1">
//                                         Publish Date <span className="text-red-500">*</span>
//                                     </label>
//                                     <p className="text-xs text-gray-400 mb-2">When should this post go live?</p>
//                                     <input
//                                         id="publish_date"
//                                         type="date"
//                                         name="publish_date"
//                                         value={formData.publish_date}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                                         required
//                                     />
//                                 </div>

//                                 {/* Status Preview Badge */}
//                                 {formData.status && (
//                                     <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
//                                         <p className="text-xs text-gray-400 mb-2 font-medium">Preview</p>
//                                         <div className="flex items-center gap-2 flex-wrap">
//                                             <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[formData.status] || "bg-gray-100 text-gray-600"}`}>
//                                                 {formData.status}
//                                             </span>
//                                             <span className="text-xs text-gray-500">
//                                                 {formData.publish_date
//                                                     ? new Date(formData.publish_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
//                                                     : "—"}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* ── Featured Image Card ── */}
//                             <SectionHeader
//                                 icon={ImagePlus}
//                                 label="Featured Image"
//                                 description="Change or restore existing image"
//                                 iconBg="bg-pink-50"
//                                 iconColor="text-pink-500"
//                             />

//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                                 {!imagePreview ? (
//                                     /* ── No image: upload zone ── */
//                                     <div
//                                         onClick={triggerFileInput}
//                                         onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                                         onDragLeave={() => setDragOver(false)}
//                                         onDrop={handleDrop}
//                                         className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
//                                             dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
//                                         }`}
//                                     >
//                                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${dragOver ? "bg-indigo-100" : "bg-gray-100"}`}>
//                                             <Upload size={20} className={dragOver ? "text-indigo-500" : "text-gray-400"} />
//                                         </div>
//                                         <p className="text-base font-semibold text-gray-700 mb-1">
//                                             {dragOver ? "Drop your image here!" : "Click to upload or drag & drop"}
//                                         </p>
//                                         <p className="text-xs text-gray-400">
//                                             <span className="text-indigo-500 font-medium">Browse files</span> · PNG, JPG, WEBP up to 5MB
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     /* ── Has image: preview ── */
//                                     <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
//                                         <img
//                                             src={imagePreview}
//                                             alt="Preview"
//                                             className="w-full max-h-56 object-cover block"
//                                             onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x300?text=Error"; }}
//                                         />
//                                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />

//                                         {/* Image state label */}
//                                         <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
//                                             {isNewImage ? (
//                                                 <p className="text-xs text-emerald-300 font-semibold">✓ New image selected — will replace existing</p>
//                                             ) : (
//                                                 <p className="text-xs text-white/70 font-medium">Current image</p>
//                                             )}
//                                         </div>

//                                         {/* Change button */}
//                                         <button
//                                             type="button"
//                                             onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
//                                             className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
//                                         >
//                                             Change
//                                         </button>

//                                         {/* Restore button — only when a new file has been chosen */}
//                                         {isNewImage && originalImage && (
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => { e.stopPropagation(); restoreOriginalImage(); }}
//                                                 className="absolute top-3 right-12 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-600 hover:bg-white shadow-sm transition-all"
//                                             >
//                                                 Restore
//                                             </button>
//                                         )}

//                                         {/* Remove button — only when showing original */}
//                                         {!isNewImage && (
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => { e.stopPropagation(); removeImage(); }}
//                                                 className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
//                                             >
//                                                 <X size={15} />
//                                             </button>
//                                         )}

//                                         {/* Close (cancel new selection) button — when new image chosen */}
//                                         {isNewImage && (
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => { e.stopPropagation(); removeImage(); }}
//                                                 className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
//                                             >
//                                                 <X size={15} />
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}
//                                 <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                             </div>

                            
//                         </div>
//                     </div>

                   

//                     {/* ── Mobile Submit ── */}
//                     <div className="sm:hidden mt-4">
//                         <button
//                             type="submit"
//                             disabled={saving}
//                             className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                         >
//                             {saving ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                     Updating…
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save size={16} />
//                                     Update Blog
//                                 </>
//                             )}
//                         </button>
//                     </div>

//                 </form>
//             </main>
//         </div>
//     );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
    ArrowLeft,
    Save,
    X,
    FileText,
    AlertCircle,
    CheckCircle2,
    Image as ImageIcon,
    Calendar,
    Tag,
    HelpCircle,
    Globe,
    Hash,
    ChevronDown,
    Link,
    Search,
    Upload,
    ImagePlus,
} from "lucide-react";

export default function EditBlog() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const locationState = location.state;
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        slug: "",
        short_description: "",
        status: "",
        publish_date: "",
        meta_title: "",
        meta_descrtiption: "",
        meta_keyword: "",
        hashtag: "",
        featured_image: null,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const statusOptions = ["Drafts", "Published", "Scheduled"];

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                let blogData = null;

                if (locationState && locationState.blog) {
                    blogData = locationState.blog;
                } else {
                    const response = await fetch("https://codingcloud.pythonanywhere.com/blogs/");
                    if (response.ok) {
                        const dataRes = await response.json();
                        const listData = dataRes.data || dataRes;
                        blogData = Array.isArray(listData)
                            ? listData.find((b) => b.id === parseInt(id))
                            : null;
                    }
                }

                if (blogData) {
                    setFormData({
                        title: blogData.title || "",
                        content: blogData.content || "",
                        slug: blogData.slug || "",
                        short_description: blogData.short_description || "",
                        status: blogData.status || "Drafts",
                        publish_date: blogData.publish_date ? blogData.publish_date.split("T")[0] : "",
                        meta_title: blogData.meta_title || "",
                        meta_descrtiption: blogData.meta_descrtiption || "",
                        meta_keyword: blogData.meta_keyword || "",
                        hashtag: blogData.hashtag || "",
                        featured_image: null,
                    });
                    if (blogData.featured_image) {
                        const fullImageUrl = `https://codingcloud.pythonanywhere.com${blogData.featured_image}`;
                        setImagePreview(fullImageUrl);
                        setOriginalImage(fullImageUrl);
                    }
                } else {
                    setError("Blog not found.");
                }
            } catch (err) {
                console.error("Error fetching blog details:", err);
                setError("Failed to load blog details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, locationState]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) { setError("Please select a valid image file"); return; }
            setFormData((prev) => ({ ...prev, featured_image: file }));
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

    const triggerFileInput = () => fileInputRef.current?.click();

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, featured_image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const restoreOriginalImage = () => {
        setFormData((prev) => ({ ...prev, featured_image: null }));
        setImagePreview(originalImage);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validateForm = () => {
        if (!formData.title.trim()) return "Title is required";
        if (!formData.content.trim()) return "Content is required";
        if (!formData.slug.trim()) return "Slug is required";
        if (!formData.status) return "Status is required";
        if (!formData.publish_date) return "Publish date is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) { setError(validationError); return; }
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const payload = new FormData();
            payload.append("title", formData.title.trim());
            payload.append("content", formData.content.trim());
            payload.append("slug", formData.slug.trim());
            if (formData.short_description !== undefined) payload.append("short_description", formData.short_description.trim());
            payload.append("status", formData.status);
            const formattedDate = formData.publish_date.includes("T") ? formData.publish_date : `${formData.publish_date}T00:00:00Z`;
            payload.append("publish_date", formattedDate);
            if (formData.meta_title !== undefined) payload.append("meta_title", formData.meta_title.trim());
            if (formData.meta_descrtiption !== undefined) payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
            if (formData.meta_keyword !== undefined) payload.append("meta_keyword", formData.meta_keyword.trim());
            if (formData.hashtag !== undefined) payload.append("hashtag", formData.hashtag.trim());

            // Handle image: if new file, append it; if removed, send empty string to clear
            if (formData.featured_image && formData.featured_image instanceof File) {
                payload.append("featured_image", formData.featured_image);
            } else if (imagePreview === null && originalImage) {
                payload.append("featured_image", "");
            }

            const response = await fetch(`https://codingcloud.pythonanywhere.com/blogs/${id}/`, { method: "PATCH", body: payload });
            if (!response.ok) {
                let errorMessage;
                try {
                    const errorText = await response.text();
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
                } catch { errorMessage = `HTTP error ${response.status}`; }
                throw new Error(errorMessage);
            }
            setSuccess("Blog updated successfully!");
            setTimeout(() => navigate("/blogs"), 2000);
        } catch (err) {
            console.error("Error updating blog:", err);
            setError(err.message || "Failed to update blog. Please check your connection.");
        } finally {
            setSaving(false);
        }
    };

    const isNewImage = formData.featured_image instanceof File;

    const statusColor = {
        Published: "bg-emerald-100 text-emerald-700",
        Scheduled: "bg-blue-100 text-blue-700",
        Drafts: "bg-gray-100 text-gray-600",
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-base text-gray-500 font-medium">Loading blog details…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit Blog</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">ID: {id} · Update blog post</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                                    Update Blog
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Error Alert */}
                {error && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
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
                    <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
                        <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
                        <span className="flex-1 font-medium">{success}</span>
                        <span className="text-emerald-400 text-xs">Redirecting to blogs…</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN — Main Content (2/3) */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* General Information */}
                            <SectionHeader
                                icon={FileText}
                                label="General Information"
                                description="Title, slug, description and full content"
                                iconBg="bg-indigo-50"
                                iconColor="text-indigo-600"
                            />

                            {/* Title */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <label htmlFor="title" className="block text-base font-semibold text-gray-800 mb-1">
                                    Blog Title <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mb-3">Give your blog post a clear, engaging title</p>
                                <div className="relative">
                                    <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter the title of the blog post"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Slug */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <label htmlFor="slug" className="block text-base font-semibold text-gray-800 mb-1">
                                    Slug / URL Path <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mb-3">URL-friendly identifier for this post</p>
                                <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                                    <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 font-medium border-r border-gray-200 whitespace-nowrap">
                                        /blog/
                                    </span>
                                    <input
                                        id="slug"
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={(e) => {
                                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                                            setFormData((prev) => ({ ...prev, slug: val }));
                                        }}
                                        placeholder="how-to-learn-react"
                                        className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                                <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                                    <Link size={11} />
                                    Final URL: /blog/{formData.slug || "your-slug"}
                                </p>
                            </div>

                            {/* Short Description */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <label htmlFor="short_description" className="block text-base font-semibold text-gray-800 mb-1">
                                    Short Description
                                </label>
                                <p className="text-xs text-gray-400 mb-3">A brief summary shown in blog listings</p>
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

                            {/* Main Content with TinyMCE */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <label htmlFor="content" className="block text-base font-semibold text-gray-800 mb-1">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mb-3">Write the full content of your blog post</p>
                                <Editor
                                    apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j" // Your TinyMCE API key
                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                    value={formData.content}
                                    onEditorChange={(content) =>
                                        setFormData((prev) => ({ ...prev, content }))
                                    }
                                    init={{
                                        height: 500,
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
                                        placeholder: "Write the full content of the blog post here…",
                                    }}
                                />
                                <p className="text-xs text-gray-400 text-right mt-1">{formData.content.length} characters</p>
                            </div>

                            {/* SEO & Metadata */}
                            <SectionHeader
                                icon={Search}
                                label="SEO & Metadata"
                                description="Help search engines find your blog post"
                                iconBg="bg-emerald-50"
                                iconColor="text-emerald-600"
                                badge="(Optional)"
                            />

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                {/* Meta Title */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe size={13} className="text-gray-400" />
                                        <label htmlFor="meta_title" className="text-base font-semibold text-gray-800">Meta Title</label>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Recommended: 50–60 characters</p>
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

                                {/* Meta Description */}
                                <div>
                                    <label htmlFor="meta_descrtiption" className="block text-base font-semibold text-gray-800 mb-1">Meta Description</label>
                                    <p className="text-xs text-gray-400 mb-2">Recommended: 150–160 characters</p>
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

                                {/* Meta Keywords */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag size={13} className="text-gray-400" />
                                        <label htmlFor="meta_keyword" className="text-base font-semibold text-gray-800">Meta Keywords</label>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Comma-separated keywords for SEO</p>
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

                                <div className="h-px bg-gray-100" />

                                {/* Hashtags */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Hash size={13} className="text-gray-400" />
                                        <label htmlFor="hashtag" className="text-base font-semibold text-gray-800">Hashtags</label>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Space-separated hashtags for social media</p>
                                    <input
                                        id="hashtag"
                                        type="text"
                                        name="hashtag"
                                        value={formData.hashtag}
                                        onChange={handleInputChange}
                                        placeholder="#coding #cloud #blog"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN — Sidebar (1/3) */}
                        <div className="space-y-5">

                            {/* Publishing Card */}
                            <SectionHeader
                                icon={Calendar}
                                label="Publishing"
                                description="Status and publish date"
                                iconBg="bg-amber-50"
                                iconColor="text-amber-600"
                            />

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-base font-semibold text-gray-800 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mb-2">Choose the publication state</p>
                                    <div className="relative">
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Publish Date */}
                                <div>
                                    <label htmlFor="publish_date" className="block text-base font-semibold text-gray-800 mb-1">
                                        Publish Date <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mb-2">When should this post go live?</p>
                                    <input
                                        id="publish_date"
                                        type="date"
                                        name="publish_date"
                                        value={formData.publish_date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                                        required
                                    />
                                </div>

                                {/* Status Preview Badge */}
                                {formData.status && (
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                                        <p className="text-xs text-gray-400 mb-2 font-medium">Preview</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[formData.status] || "bg-gray-100 text-gray-600"}`}>
                                                {formData.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formData.publish_date
                                                    ? new Date(formData.publish_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Featured Image Card */}
                            <SectionHeader
                                icon={ImagePlus}
                                label="Featured Image"
                                description="Change or restore existing image"
                                iconBg="bg-pink-50"
                                iconColor="text-pink-500"
                            />

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                {!imagePreview ? (
                                    /* No image: upload zone */
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
                                        <p className="text-xs text-gray-400">
                                            <span className="text-indigo-500 font-medium">Browse files</span> · PNG, JPG, WEBP up to 5MB
                                        </p>
                                    </div>
                                ) : (
                                    /* Has image: preview */
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full max-h-56 object-cover block"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x300?text=Error"; }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />

                                        {/* Image state label */}
                                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                                            {isNewImage ? (
                                                <p className="text-xs text-emerald-300 font-semibold">✓ New image selected — will replace existing</p>
                                            ) : (
                                                <p className="text-xs text-white/70 font-medium">Current image</p>
                                            )}
                                        </div>

                                        {/* Change button */}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                                            className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
                                        >
                                            Change
                                        </button>

                                        {/* Restore button — only when a new file has been chosen */}
                                        {isNewImage && originalImage && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); restoreOriginalImage(); }}
                                                className="absolute top-3 right-12 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-600 hover:bg-white shadow-sm transition-all"
                                            >
                                                Restore
                                            </button>
                                        )}

                                        {/* Remove button — only when showing original */}
                                        {!isNewImage && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
                                            >
                                                <X size={15} />
                                            </button>
                                        )}

                                        {/* Close (cancel new selection) button — when new image chosen */}
                                        {isNewImage && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
                                            >
                                                <X size={15} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Submit */}
                    <div className="sm:hidden mt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Update Blog
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
// // import { useState, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //     ArrowLeft,
// //     Save,
// //     X,
// //     FileText,
// //     AlertCircle,
// //     CheckCircle,
// //     Image as ImageIcon,
// //     Calendar,
// //     Tag,
// //     HelpCircle
// // } from "lucide-react";

// // export default function AddBlog() {
// //     const navigate = useNavigate();
// //     const fileInputRef = useRef(null);

// //     // State for form data exactly matching API requirements
// //     const [formData, setFormData] = useState({
// //         title: "",
// //         content: "",
// //         slug: "",
// //         short_description: "",
// //         status: "Drafts", // default
// //         publish_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
// //         meta_title: "",
// //         meta_descrtiption: "", // spelled this way as per the API doc
// //         meta_keyword: "",
// //         hashtag: "",
// //         featured_image: null,
// //     });

// //     // UI States
// //     const [saving, setSaving] = useState(false);
// //     const [error, setError] = useState("");
// //     const [success, setSuccess] = useState("");
// //     const [imagePreview, setImagePreview] = useState(null);

// //     // Status Options
// //     const statusOptions = ["Drafts", "Published", "Scheduled"];

// //     // Styles matching AddCourse component
// //     const inputStyle = {
// //         width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb",
// //         borderRadius: 10, fontSize: 13, color: "#111827", background: "#f9fafb",
// //         outline: "none", boxSizing: "border-box", fontFamily: "inherit",
// //         transition: "border-color 0.15s, background 0.15s",
// //     };

// //     const labelStyle = {
// //         display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6
// //     };

// //     const sectionStyle = {
// //         background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
// //         overflow: "hidden", marginBottom: 20,
// //     };

// //     const sectionHeaderStyle = {
// //         padding: "16px 24px", borderBottom: "1px solid #f3f4f6", background: "#fafafa",
// //         display: "flex", alignItems: "center", gap: 10,
// //     };

// //     const sectionDotStyle = (color) => ({
// //         width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0,
// //     });

// //     // Handle text input changes
// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({
// //             ...prev,
// //             [name]: value,
// //         }));
// //         setError("");
// //     };

// //     // Handle image selection
// //     const handleImageChange = (e) => {
// //         const file = e.target.files[0];
// //         if (file) {
// //             if (!file.type.startsWith("image/")) {
// //                 setError("Please select a valid image file");
// //                 return;
// //             }

// //             setFormData((prev) => ({
// //                 ...prev,
// //                 featured_image: file,
// //             }));

// //             // Create preview URL
// //             const reader = new FileReader();
// //             reader.onloadend = () => {
// //                 setImagePreview(reader.result);
// //             };
// //             reader.readAsDataURL(file);
// //             setError("");
// //         }
// //     };

// //     const triggerFileInput = () => {
// //         fileInputRef.current?.click();
// //     };

// //     const removeImage = () => {
// //         setFormData((prev) => ({
// //             ...prev,
// //             featured_image: null,
// //         }));
// //         setImagePreview(null);
// //         if (fileInputRef.current) {
// //             fileInputRef.current.value = '';
// //         }
// //     };

// //     // Validate form
// //     const validateForm = () => {
// //         if (!formData.title.trim()) return "Title is required";
// //         if (!formData.content.trim()) return "Content is required";
// //         if (!formData.slug.trim()) return "Slug is required";
// //         if (!formData.status) return "Status is required";
// //         if (!formData.publish_date) return "Publish date is required";
// //         if (!formData.featured_image) return "Featured image is required";
// //         return "";
// //     };

// //     // Handle form submission
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         // Validate
// //         const validationError = validateForm();
// //         if (validationError) {
// //             setError(validationError);
// //             return;
// //         }

// //         setSaving(true);
// //         setError("");
// //         setSuccess("");

// //         try {
// //             const payload = new FormData();
// //             payload.append("title", formData.title.trim());
// //             payload.append("content", formData.content.trim());
// //             payload.append("slug", formData.slug.trim());
// //             payload.append("short_description", formData.short_description.trim());
// //             payload.append("status", formData.status);

// //             // Ensure publish date includes time if required, or let backend handle format parsing.
// //             // Based on sample: "2026-09-05T00:00:00Z"
// //             const formattedDate = formData.publish_date.includes('T') ? formData.publish_date : `${formData.publish_date}T00:00:00Z`;
// //             payload.append("publish_date", formattedDate);

// //             payload.append("meta_title", formData.meta_title.trim());
// //             payload.append("meta_descrtiption", formData.meta_descrtiption.trim()); // Matching API spelling
// //             payload.append("meta_keyword", formData.meta_keyword.trim());
// //             payload.append("hashtag", formData.hashtag.trim());

// //             if (formData.featured_image instanceof File) {
// //                 payload.append("featured_image", formData.featured_image);
// //             }

// //             const response = await fetch(
// //                 "https://codingcloud.pythonanywhere.com/blogs/",
// //                 {
// //                     method: "POST",
// //                     body: payload, // Sending FormData (multipart/form-data)
// //                 }
// //             );

// //             // If the response is not ok, parse error
// //             if (!response.ok) {
// //                 let errorMessage;
// //                 try {
// //                     const errorText = await response.text();
// //                     const errorData = JSON.parse(errorText);
// //                     errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
// //                 } catch {
// //                     errorMessage = `HTTP error ${response.status}`;
// //                 }
// //                 throw new Error(errorMessage);
// //             }

// //             setSuccess("Blog created successfully!");

// //             // Redirect after 2 seconds
// //             setTimeout(() => {
// //                 navigate("/blogs");
// //             }, 2000);

// //         } catch (err) {
// //             console.error("Error creating blog:", err);
// //             setError(
// //                 err.message ||
// //                 "Failed to create blog. Please check your connection."
// //             );
// //         } finally {
// //             setSaving(false);
// //         }
// //     };

// //     return (
// //         <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "24px 20px" }}>
// //             <style>{`
// //                 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
// //                 input:focus, textarea:focus, select:focus {
// //                     border-color: #2563eb !important;
// //                     background: #fff !important;
// //                     box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
// //                 }
// //                 .form-input:hover { border-color: #c7d2fe; }
// //                 @keyframes spin { to { transform: rotate(360deg); } }

// //                 @media (max-width: 1024px) {
// //                     .blog-grid { grid-template-columns: 1fr !important; }
// //                 }
// //             `}</style>

// //             {/* ── Header ── */}
// //             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
// //                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
// //                     <button onClick={() => navigate(-1)} type="button"
// //                         style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
// //                         <ArrowLeft size={18} color="#374151" />
// //                     </button>
// //                     <div>
// //                         <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Add New Blog</h1>
// //                         <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Create a new blog post article</p>
// //                     </div>
// //                 </div>

// //                 <div style={{ display: "flex", gap: 10 }}>
// //                     <button type="button" onClick={() => navigate(-1)}
// //                         style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
// //                         <X size={15} /> Cancel
// //                     </button>
// //                     <button onClick={handleSubmit} disabled={saving}
// //                         style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 10, background: saving ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", minWidth: 130, justifyContent: "center" }}>
// //                         {saving ? (
// //                             <>
// //                                 <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
// //                                 Saving...
// //                             </>
// //                         ) : (
// //                             <><Save size={15} /> Save Blog</>
// //                         )}
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* ── Alerts ── */}
// //             {error && (
// //                 <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
// //                     <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
// //                         <AlertCircle size={14} color="#dc2626" />
// //                     </div>
// //                     <div>
// //                         <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: 0 }}>Error</p>
// //                         <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>{error}</p>
// //                     </div>
// //                     <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={14} /></button>
// //                 </div>
// //             )}

// //             {success && (
// //                 <div style={{ marginBottom: 16, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
// //                     <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
// //                         <CheckCircle size={14} color="#16a34a" />
// //                     </div>
// //                     <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", margin: 0 }}>✓ {success}</p>
// //                 </div>
// //             )}

// //             <form onSubmit={handleSubmit}>
// //                 <div style={{
// //                     display: "grid",
// //                     gridTemplateColumns: "2fr 1fr",
// //                     gap: 20,
// //                 }} className="blog-grid">

// //                     {/* Left Column - Main Content */}
// //                     <div>
// //                         {/* ── General Information ── */}
// //                         <div style={sectionStyle}>
// //                             <div style={{ padding: 24 }}>
// //                                 {/* Title */}
// //                                 <div style={{ marginBottom: 20 }}>
// //                                     <label style={labelStyle}>
// //                                         Blog Title <span style={{ color: "#ef4444" }}>*</span>
// //                                     </label>
// //                                     <input
// //                                         className="form-input"
// //                                         type="text"
// //                                         name="title"
// //                                         value={formData.title}
// //                                         onChange={handleInputChange}
// //                                         placeholder="Enter the title of the blog post"
// //                                         style={inputStyle}
// //                                         required
// //                                     />
// //                                 </div>

// //                                 {/* Slug */}
// //                                 <div style={{ marginBottom: 20 }}>
// //                                     <label style={labelStyle}>
// //                                         Slug / URL Path <span style={{ color: "#ef4444" }}>*</span>
// //                                     </label>
// //                                     <div style={{ display: "flex", alignItems: "center" }}>
// //                                         <span style={{ padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", fontWeight: 500 }}>
// //                                             /blog/
// //                                         </span>
// //                                         <input
// //                                             className="form-input"
// //                                             type="text"
// //                                             name="slug"
// //                                             value={formData.slug}
// //                                             onChange={(e) => {
// //                                                 // Enforce lowercase and hyphens
// //                                                 const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
// //                                                 setFormData(prev => ({ ...prev, slug: val }));
// //                                             }}
// //                                             placeholder="how-to-learn-react"
// //                                             style={{ ...inputStyle, borderRadius: "0 10px 10px 0", flex: 1 }}
// //                                             required
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 {/* Short Description */}
// //                                 <div style={{ marginBottom: 20 }}>
// //                                     <label style={labelStyle}>
// //                                         Short Description
// //                                     </label>
// //                                     <textarea
// //                                         name="short_description"
// //                                         value={formData.short_description}
// //                                         onChange={handleInputChange}
// //                                         rows={2}
// //                                         placeholder="A brief summary of the blog post"
// //                                         style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
// //                                     />
// //                                 </div>

// //                                 {/* Main Content */}
// //                                 <div>
// //                                     <label style={labelStyle}>
// //                                         Content <span style={{ color: "#ef4444" }}>*</span>
// //                                     </label>
// //                                     <textarea
// //                                         name="content"
// //                                         value={formData.content}
// //                                         onChange={handleInputChange}
// //                                         rows={10}
// //                                         placeholder="Write the full content of the blog post here..."
// //                                         style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 200 }}
// //                                         required
// //                                     />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* ── SEO & Meta Fields ── */}
// //                         <div style={sectionStyle}>
// //                             <div style={sectionHeaderStyle}>
// //                                 <div style={sectionDotStyle("#8b5cf6")} />
// //                                 <div>
// //                                     <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>SEO & Meta Fields</p>
// //                                     <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>For search engine optimization (optional)</p>
// //                                 </div>
// //                             </div>

// //                             <div style={{ padding: 24 }}>
// //                                 {/* Meta Title */}
// //                                 <div style={{ marginBottom: 16 }}>
// //                                     <label style={labelStyle}>Meta Title</label>
// //                                     <input
// //                                         className="form-input"
// //                                         type="text"
// //                                         name="meta_title"
// //                                         value={formData.meta_title}
// //                                         onChange={handleInputChange}
// //                                         placeholder="SEO title for the blog"
// //                                         style={inputStyle}
// //                                     />
// //                                 </div>

// //                                 {/* Meta Description (misspelled to match API) */}
// //                                 <div style={{ marginBottom: 16 }}>
// //                                     <label style={labelStyle}>Meta Description</label>
// //                                     <textarea
// //                                         name="meta_descrtiption"
// //                                         value={formData.meta_descrtiption}
// //                                         onChange={handleInputChange}
// //                                         rows={3}
// //                                         placeholder="SEO description for search engines"
// //                                         style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
// //                                     />
// //                                 </div>

// //                                 {/* Meta Keywords */}
// //                                 <div style={{ marginBottom: 16 }}>
// //                                     <label style={labelStyle}>Meta Keywords</label>
// //                                     <input
// //                                         className="form-input"
// //                                         type="text"
// //                                         name="meta_keyword"
// //                                         value={formData.meta_keyword}
// //                                         onChange={handleInputChange}
// //                                         placeholder="comma, separated, keywords"
// //                                         style={inputStyle}
// //                                     />
// //                                 </div>

// //                                 {/* Hashtags */}
// //                                 <div>
// //                                     <label style={labelStyle}>Hashtags</label>
// //                                     <input
// //                                         className="form-input"
// //                                         type="text"
// //                                         name="hashtag"
// //                                         value={formData.hashtag}
// //                                         onChange={handleInputChange}
// //                                         placeholder="#coding #cloud"
// //                                         style={inputStyle}
// //                                     />
// //                                     <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
// //                                         Space-separated hashtags for social media
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Right Column - Sidebar */}
// //                     <div>
// //                         {/* ── Publishing ── */}
// //                         <div style={sectionStyle}>
// //                             <div style={sectionHeaderStyle}>
// //                                 <div style={sectionDotStyle("#f59e0b")} />
// //                                 <div>
// //                                     <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Publishing</p>
// //                                     <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Status and scheduling</p>
// //                                 </div>
// //                             </div>

// //                             <div style={{ padding: 24 }}>
// //                                 {/* Status */}
// //                                 <div style={{ marginBottom: 20 }}>
// //                                     <label style={labelStyle}>
// //                                         Status <span style={{ color: "#ef4444" }}>*</span>
// //                                     </label>
// //                                     <div style={{ position: "relative" }}>
// //                                         <select
// //                                             name="status"
// //                                             value={formData.status}
// //                                             onChange={handleInputChange}
// //                                             style={{
// //                                                 ...inputStyle,
// //                                                 appearance: "none",
// //                                                 cursor: "pointer",
// //                                                 paddingRight: 36
// //                                             }}
// //                                         >
// //                                             {statusOptions.map(status => (
// //                                                 <option key={status} value={status}>{status}</option>
// //                                             ))}
// //                                         </select>
// //                                         <div style={{
// //                                             position: "absolute",
// //                                             right: 12,
// //                                             top: "50%",
// //                                             transform: "translateY(-50%)",
// //                                             pointerEvents: "none",
// //                                             color: "#9ca3af"
// //                                         }}>
// //                                             <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                                 <path d="M6 9l6 6 6-6" />
// //                                             </svg>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 {/* Publish Date */}
// //                                 <div>
// //                                     <label style={labelStyle}>
// //                                         Publish Date <span style={{ color: "#ef4444" }}>*</span>
// //                                     </label>
// //                                     <input
// //                                         type="date"
// //                                         name="publish_date"
// //                                         value={formData.publish_date}
// //                                         onChange={handleInputChange}
// //                                         style={inputStyle}
// //                                         required
// //                                     />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* ── Featured Image ── */}
// //                         <div style={sectionStyle}>
// //                             <div style={sectionHeaderStyle}>
// //                                 <div style={sectionDotStyle("#10b981")} />
// //                                 <div>
// //                                     <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Featured Image</p>
// //                                     <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Required *</p>
// //                                 </div>
// //                             </div>

// //                             <div style={{ padding: 24 }}>
// //                                 <div>
// //                                     <label style={labelStyle}>Upload Image <span style={{ color: "#ef4444" }}>*</span></label>
// //                                     <div style={{
// //                                         border: imagePreview ? "1.5px solid #d1d5db" : "1.5px dashed #d1d5db",
// //                                         borderRadius: 12,
// //                                         padding: imagePreview ? "16px" : "24px 16px",
// //                                         textAlign: "center",
// //                                         background: imagePreview ? "#fff" : "#f9fafb",
// //                                         position: "relative",
// //                                         transition: "border-color 0.15s",
// //                                         cursor: "pointer"
// //                                     }}
// //                                     onClick={triggerFileInput}
// //                                     onDragOver={(e) => e.preventDefault()}
// //                                     onDrop={(e) => {
// //                                         e.preventDefault();
// //                                         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// //                                             handleImageChange({ target: { files: e.dataTransfer.files } });
// //                                         }
// //                                     }}>
// //                                         {imagePreview ? (
// //                                             <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
// //                                                 <img
// //                                                     src={imagePreview}
// //                                                     alt="Preview"
// //                                                     style={{
// //                                                         width: "100%",
// //                                                         maxHeight: 200,
// //                                                         borderRadius: 10,
// //                                                         boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
// //                                                         objectFit: "cover"
// //                                                     }}
// //                                                 />
// //                                                 <button
// //                                                     type="button"
// //                                                     onClick={(e) => { e.stopPropagation(); removeImage(); }}
// //                                                     style={{
// //                                                         position: "absolute",
// //                                                         top: -8,
// //                                                         right: -8,
// //                                                         width: 26,
// //                                                         height: 26,
// //                                                         borderRadius: "50%",
// //                                                         background: "#ef4444",
// //                                                         border: "none",
// //                                                         cursor: "pointer",
// //                                                         display: "flex",
// //                                                         alignItems: "center",
// //                                                         justifyContent: "center",
// //                                                         boxShadow: "0 2px 6px rgba(239,68,68,0.4)"
// //                                                     }}>
// //                                                     <X size={12} color="#fff" />
// //                                                 </button>
// //                                                 <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8 }}>
// //                                                     <span style={{ fontSize: 11, color: "#2563eb", cursor: "pointer" }}>Click to change</span>
// //                                                 </div>
// //                                             </div>
// //                                         ) : (
// //                                             <>
// //                                                 <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
// //                                                     <ImageIcon size={20} color="#2563eb" />
// //                                                 </div>
// //                                                 <p style={{ fontSize: 13, color: "#374151", margin: "0 0 4px", fontWeight: 500 }}>Click to upload</p>
// //                                                 <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px" }}>PNG, JPG or WEBP up to 5MB</p>
// //                                                 <label htmlFor="image-upload"
// //                                                     style={{ display: "inline-block", padding: "7px 18px", background: "#2563eb", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
// //                                                     Browse File
// //                                                 </label>
// //                                             </>
// //                                         )}
// //                                         <input
// //                                             ref={fileInputRef}
// //                                             id="image-upload"
// //                                             type="file"
// //                                             accept="image/*"
// //                                             onChange={handleImageChange}
// //                                             style={{ display: "none" }}
// //                                         />
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </form>
// //         </div>
// //     );
// // }

// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
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
// } from "lucide-react";

// export default function AddBlog() {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

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

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [dragOver, setDragOver] = useState(false);

//   const statusOptions = ["Drafts", "Published", "Scheduled"];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError("");
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
//   };

//   const validateForm = () => {
//     if (!formData.title.trim()) return "Title is required";
//     if (!formData.content.trim()) return "Content is required";
//     if (!formData.slug.trim()) return "Slug is required";
//     if (!formData.status) return "Status is required";
//     if (!formData.publish_date) return "Publish date is required";
//     if (!formData.featured_image) return "Featured image is required";
//     return "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       const payload = new FormData();
//       payload.append("title", formData.title.trim());
//       payload.append("content", formData.content.trim());
//       payload.append("slug", formData.slug.trim());
//       payload.append("short_description", formData.short_description.trim());
//       payload.append("status", formData.status);
//       const formattedDate = formData.publish_date.includes("T")
//         ? formData.publish_date
//         : `${formData.publish_date}T00:00:00Z`;
//       payload.append("publish_date", formattedDate);
//       payload.append("meta_title", formData.meta_title.trim());
//       payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
//       payload.append("meta_keyword", formData.meta_keyword.trim());
//       payload.append("hashtag", formData.hashtag.trim());
//       if (formData.featured_image instanceof File)
//         payload.append("featured_image", formData.featured_image);

//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/blogs/",
//         { method: "POST", body: payload },
//       );
//       if (!response.ok) {
//         let errorMessage;
//         try {
//           const errorText = await response.text();
//           const errorData = JSON.parse(errorText);
//           errorMessage =
//             errorData.message || errorData.detail || JSON.stringify(errorData);
//         } catch {
//           errorMessage = `HTTP error ${response.status}`;
//         }
//         throw new Error(errorMessage);
//       }
//       setSuccess("Blog created successfully!");
//       setTimeout(() => navigate("/blogs"), 2000);
//     } catch (err) {
//       console.error("Error creating blog:", err);
//       setError(
//         err.message || "Failed to create blog. Please check your connection.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Section Header component ──
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
//       {/* ── Header ── */}
//       <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
//               <p className="text-xs text-gray-400 hidden sm:block">
//                 Create a new blog post article
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleSubmit}
//               disabled={saving}
//               className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {saving ? (
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

//       {/* ── Main ── */}
//       <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
//         {/* Error Alert */}
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

//         {/* Success Alert */}
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
//             {/* ══════════════════════════════════════
//                             LEFT COLUMN — Main Content (2/3)
//                         ══════════════════════════════════════ */}
//             <div className="lg:col-span-2 space-y-5">
//               {/* ── General Information ── */}
//               <SectionHeader
//                 icon={FileText}
//                 label="General Information"
//                 description="Title, slug, description and full content"
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
//                 <p className="text-xs text-gray-400 mb-3">
//                   Give your blog post a clear, engaging title
//                 </p>
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
//                     className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Slug */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <label
//                   htmlFor="slug"
//                   className="block text-base font-semibold text-gray-800 mb-1"
//                 >
//                   Slug / URL Path <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-xs text-gray-400 mb-3">
//                   URL-friendly identifier for this post
//                 </p>
//                 <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
//                   <span className="inline-flex items-center px-4 py-3 bg-gray-100 text-xs text-gray-500 font-medium border-r border-gray-200 whitespace-nowrap">
//                     /blog/
//                   </span>
//                   <input
//                     id="slug"
//                     type="text"
//                     name="slug"
//                     value={formData.slug}
//                     onChange={(e) => {
//                       const val = e.target.value
//                         .toLowerCase()
//                         .replace(/[^a-z0-9-]/g, "-");
//                       setFormData((prev) => ({ ...prev, slug: val }));
//                     }}
//                     placeholder="how-to-learn-react"
//                     className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 text-base placeholder-gray-400 outline-none focus:bg-white transition-all"
//                     required
//                   />
//                 </div>
//                 <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
//                   <Link size={11} />
//                   Final URL: /blog/{formData.slug || "your-slug"}
//                 </p>
//               </div>

//               {/* Short Description */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <label
//                   htmlFor="short_description"
//                   className="block text-base font-semibold text-gray-800 mb-1"
//                 >
//                   Short Description
//                 </label>
//                 <p className="text-xs text-gray-400 mb-3">
//                   A brief summary shown in blog listings
//                 </p>
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

//               {/* Main Content */}
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <label
//                   htmlFor="content"
//                   className="block text-base font-semibold text-gray-800 mb-1"
//                 >
//                   Content <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-xs text-gray-400 mb-3">
//                   Write the full content of your blog post
//                 </p>
//                 <textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleInputChange}
//                   rows={14}
//                   placeholder="Write the full content of the blog post here…"
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y font-mono"
//                   required
//                 />
//                 <p className="text-xs text-gray-400 text-right mt-1">
//                   {formData.content.length} characters
//                 </p>
//               </div>

//               {/* ── SEO & Metadata ── */}
//               <SectionHeader
//                 icon={Search}
//                 label="SEO & Metadata"
//                 description="Help search engines find your blog post"
//                 iconBg="bg-emerald-50"
//                 iconColor="text-emerald-600"
//                 badge="(Optional)"
//               />

//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//                 {/* Meta Title */}
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
//                   <p className="text-xs text-gray-400 mb-2">
//                     Recommended: 50–60 characters
//                   </p>
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

//                 {/* Meta Description */}
//                 <div>
//                   <label
//                     htmlFor="meta_descrtiption"
//                     className="block text-base font-semibold text-gray-800 mb-1"
//                   >
//                     Meta Description
//                   </label>
//                   <p className="text-xs text-gray-400 mb-2">
//                     Recommended: 150–160 characters
//                   </p>
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

//                 {/* Meta Keywords */}
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
//                   <p className="text-xs text-gray-400 mb-2">
//                     Comma-separated keywords for SEO
//                   </p>
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

//                 {/* Hashtags */}
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <Hash size={13} className="text-gray-400" />
//                     <label
//                       htmlFor="hashtag"
//                       className="text-base font-semibold text-gray-800"
//                     >
//                       Hashtags
//                     </label>
//                   </div>
//                   <p className="text-xs text-gray-400 mb-2">
//                     Space-separated hashtags for social media
//                   </p>
//                   <input
//                     id="hashtag"
//                     type="text"
//                     name="hashtag"
//                     value={formData.hashtag}
//                     onChange={handleInputChange}
//                     placeholder="#coding #cloud #blog"
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* ══════════════════════════════════════
//                             RIGHT COLUMN — Sidebar (1/3)
//                         ══════════════════════════════════════ */}
//             <div className="space-y-5">
//               {/* ── Publishing Card ── */}
//               <SectionHeader
//                 icon={Calendar}
//                 label="Publishing"
//                 description="Status and publish date"
//                 iconBg="bg-amber-50"
//                 iconColor="text-amber-600"
//               />

//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
//                 {/* Status */}
//                 <div>
//                   <label
//                     htmlFor="status"
//                     className="block text-base font-semibold text-gray-800 mb-1"
//                   >
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <p className="text-xs text-gray-400 mb-2">
//                     Choose the publication state
//                   </p>
//                   <div className="relative">
//                     <select
//                       id="status"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
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
//                 </div>

//                 <div className="h-px bg-gray-100" />

//                 {/* Publish Date */}
//                 <div>
//                   <label
//                     htmlFor="publish_date"
//                     className="block text-base font-semibold text-gray-800 mb-1"
//                   >
//                     Publish Date <span className="text-red-500">*</span>
//                   </label>
//                   <p className="text-xs text-gray-400 mb-2">
//                     When should this post go live?
//                   </p>
//                   <input
//                     id="publish_date"
//                     type="date"
//                     name="publish_date"
//                     value={formData.publish_date}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
//                     required
//                   />
//                 </div>

//                 {/* Status Preview Badge */}
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
//                             { year: "numeric", month: "short", day: "numeric" },
//                           )
//                         : "—"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* ── Featured Image Card ── */}
//               <SectionHeader
//                 icon={ImagePlus}
//                 label="Featured Image"
//                 description="Required — displayed at top of post"
//                 iconBg="bg-pink-50"
//                 iconColor="text-pink-500"
//               />

//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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
//                     <p className="text-xs text-gray-400">
//                       <span className="text-indigo-500 font-medium">
//                         Browse files
//                       </span>{" "}
//                       · PNG, JPG, WEBP up to 5MB
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

//           {/* ── Mobile Submit ── */}
//           <div className="sm:hidden mt-4">
//             <button
//               type="submit"
//               disabled={saving}
//               className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {saving ? (
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

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Toasts from "../pages/Toasts"; // adjust path if needed
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
  Info,
  Link,
  Search,
  Upload,
  ImagePlus,
} from "lucide-react";

export default function AddBlog() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    short_description: "",
    status: "Drafts",
    publish_date: new Date().toISOString().split("T")[0],
    meta_title: "",
    meta_descrtiption: "",
    meta_keyword: "",
    hashtag: "",
    featured_image: null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const statusOptions = ["Drafts", "Published", "Scheduled"];

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

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.content.trim()) return "Content is required";
    if (!formData.slug.trim()) return "Slug is required";
    if (!formData.status) return "Status is required";
    if (!formData.publish_date) return "Publish date is required";
    if (!formData.featured_image) return "Featured image is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("content", formData.content.trim()); // rich text content
      payload.append("slug", formData.slug.trim());
      payload.append("short_description", formData.short_description.trim());
      payload.append("status", formData.status);
      const formattedDate = formData.publish_date.includes("T")
        ? formData.publish_date
        : `${formData.publish_date}T00:00:00Z`;
      payload.append("publish_date", formattedDate);
      payload.append("meta_title", formData.meta_title.trim());
      payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
      payload.append("meta_keyword", formData.meta_keyword.trim());
      payload.append("hashtag", formData.hashtag.trim());
      if (formData.featured_image instanceof File)
        payload.append("featured_image", formData.featured_image);

      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/blogs/",
        { method: "POST", body: payload },
      );
      if (!response.ok) {
        let errorMessage;
        try {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          errorMessage = `HTTP error ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      setToast({
        show: true,
        message: "Blog added successfully!",
        type: "success",
      });

      setTimeout(() => navigate("/blogs"), 2000);
      setTimeout(() => navigate("/blogs"), 2000);
    } catch (err) {
      console.error("Error creating blog:", err);
      setToast({
        show: true,
        message: err.message || "Failed to create blog",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Section Header component ──
  const SectionHeader = ({
    icon: Icon,
    label,
    iconBg,
    iconColor,
    description,
    badge,
  }) => (
    <div className="flex items-center gap-3 pt-2">
      <div
        className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={16} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-gray-800">{label}</p>
          {badge && (
            <span className="text-xs text-gray-400 font-normal">{badge}</span>
          )}
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
      {/* ── Header ── */}
      <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
              <p className="text-xs text-gray-400 hidden sm:block">
                Create a new blog post article
              </p>
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

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0 text-red-500"
            />
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
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
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
            <CheckCircle2
              size={18}
              className="flex-shrink-0 text-emerald-500"
            />
            <span className="flex-1 font-medium">{success}</span>
            <span className="text-emerald-400 text-xs">
              Redirecting to blogs…
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ══════════════════════════════════════
                            LEFT COLUMN — Main Content (2/3)
                        ══════════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-5">
              {/* ── General Information ── */}
              <SectionHeader
                icon={FileText}
                label="General Information"
                description="Title, slug, description and full content"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
              />

              {/* Title */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label
                  htmlFor="title"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Give your blog post a clear, engaging title
                </p>
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
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
                <label
                  htmlFor="slug"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Slug / URL Path <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  URL-friendly identifier for this post
                </p>
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
                      const val = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-");
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
                <label
                  htmlFor="short_description"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Short Description
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  A brief summary shown in blog listings
                </p>
                <textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="A brief summary of the blog post…"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-y"
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.short_description.length} characters
                </p>
              </div>

              {/* Main Content with TinyMCE */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label
                  htmlFor="content"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Write the full content of your blog post
                </p>
                <Editor
                  apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j" // Replace with your actual TinyMCE API key
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  value={formData.content}
                  onEditorChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  init={{
                    height: 500,
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
                      "removeformat | help",
                    content_style:
                      "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
                    placeholder:
                      "Write the full content of the blog post here…",
                  }}
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              {/* ── SEO & Metadata ── */}
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
                    <label
                      htmlFor="meta_title"
                      className="text-base font-semibold text-gray-800"
                    >
                      Meta Title
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Recommended: 50–60 characters
                  </p>
                  <input
                    id="meta_title"
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title for the blog"
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
                    htmlFor="meta_descrtiption"
                    className="block text-base font-semibold text-gray-800 mb-1"
                  >
                    Meta Description
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Recommended: 150–160 characters
                  </p>
                  <textarea
                    id="meta_descrtiption"
                    name="meta_descrtiption"
                    value={formData.meta_descrtiption}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="SEO description for search engines…"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">
                    {formData.meta_descrtiption.length} / 160
                  </p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Meta Keywords */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={13} className="text-gray-400" />
                    <label
                      htmlFor="meta_keyword"
                      className="text-base font-semibold text-gray-800"
                    >
                      Meta Keywords
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Comma-separated keywords for SEO
                  </p>
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
                    <label
                      htmlFor="hashtag"
                      className="text-base font-semibold text-gray-800"
                    >
                      Hashtags
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Space-separated hashtags for social media
                  </p>
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

            {/* ══════════════════════════════════════
                            RIGHT COLUMN — Sidebar (1/3)
                        ══════════════════════════════════════ */}
            <div className="space-y-5">
              {/* ── Publishing Card ── */}
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
                  <label
                    htmlFor="status"
                    className="block text-base font-semibold text-gray-800 mb-1"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Choose the publication state
                  </p>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Publish Date */}
                <div>
                  <label
                    htmlFor="publish_date"
                    className="block text-base font-semibold text-gray-800 mb-1"
                  >
                    Publish Date <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    When should this post go live?
                  </p>
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
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-2 font-medium">
                    Preview
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        statusColor[formData.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formData.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formData.publish_date
                        ? new Date(formData.publish_date).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Featured Image Card ── */}
              <SectionHeader
                icon={ImagePlus}
                label="Featured Image"
                description="Required — displayed at top of post"
                iconBg="bg-pink-50"
                iconColor="text-pink-500"
              />

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                {!imagePreview ? (
                  <div
                    onClick={triggerFileInput}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
                      dragOver
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${
                        dragOver ? "bg-indigo-100" : "bg-gray-100"
                      }`}
                    >
                      <Upload
                        size={20}
                        className={
                          dragOver ? "text-indigo-500" : "text-gray-400"
                        }
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
                      · PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-56 object-cover block"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 pointer-events-none">
                      <p className="text-xs text-white/80 font-medium truncate">
                        {formData.featured_image?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput();
                      }}
                      className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 hover:bg-white shadow-sm transition-all"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ── Mobile Submit ── */}
          <div className="sm:hidden mt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
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

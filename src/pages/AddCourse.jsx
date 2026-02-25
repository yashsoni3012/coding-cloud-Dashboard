// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   Upload,
//   Image,
//   FileText,
//   Clock,
//   BookOpen,
//   Users,
//   Signal,
//   Globe,
//   Award,
//   ChevronDown,
//   HelpCircle,
// } from "lucide-react";

// export default function AddCourse() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);
//   const [activeSection, setActiveSection] = useState("basic");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           "https://codingcloud.pythonanywhere.com/category/",
//         );
//         const data = await response.json();
//         setCategories(data);
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
//       setFormData((prev) => ({ ...prev, [name]: file }));
//       if (name === "image") setImagePreview(URL.createObjectURL(file));
//       else if (name === "banner_img")
//         setBannerPreview(URL.createObjectURL(file));
//       else if (name === "icon") setIconPreview(URL.createObjectURL(file));
//       else if (name === "pdf_file") setPdfName(file.name);
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

//   // Enhanced styles with larger fonts
//   const inputStyle = {
//     width: "100%",
//     padding: "10px 14px",
//     border: "1.5px solid #e2e8f0",
//     borderRadius: 14,
//     fontSize: "16px",
//     color: "#1e293b",
//     background: "#ffffff",
//     outline: "none",
//     boxSizing: "border-box",
//     fontFamily: "inherit",
//     transition: "all 0.2s ease",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: "14px",
//     fontWeight: 600,
//     color: "#334155",
//     marginBottom: "8px",
//     letterSpacing: "-0.01em",
//   };

//   const sectionStyle = {
//     background: "#ffffff",
//     borderRadius: 24,
//     boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
//     overflow: "hidden",
//     marginBottom: "28px",
//     border: "1px solid #f1f5f9",
//   };

//   const sectionHeaderStyle = {
//     padding: "20px 28px",
//     borderBottom: "1px solid #f1f5f9",
//     background: "#fafcff",
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   };

//   const sectionDotStyle = (color) => ({
//     width: 12,
//     height: 12,
//     borderRadius: "50%",
//     background: color,
//     flexShrink: 0,
//     boxShadow: `0 0 0 3px ${color}20`,
//   });

//   const UploadBox = ({
//     preview,
//     onRemove,
//     inputId,
//     inputName,
//     accept,
//     label,
//     hint,
//     isSmall,
//   }) => (
//     <div>
//       <label style={labelStyle}>{label}</label>
//       <div
//         style={{
//           border: "2px dashed #cbd5e1",
//           borderRadius: 20,
//           padding: isSmall ? "28px 20px" : "32px 20px",
//           textAlign: "center",
//           background: "#f8fafc",
//           position: "relative",
//           transition: "all 0.2s ease",
//           cursor: "pointer",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#94a3b8")}
//         onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
//       >
//         {preview ? (
//           <div style={{ position: "relative", display: "inline-block" }}>
//             <img
//               src={preview}
//               alt="preview"
//               style={{
//                 maxHeight: isSmall ? 120 : 180,
//                 borderRadius: 16,
//                 boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
//               }}
//             />
//             <button
//               type="button"
//               onClick={onRemove}
//               style={{
//                 position: "absolute",
//                 top: -10,
//                 right: -10,
//                 width: 34,
//                 height: 34,
//                 borderRadius: "50%",
//                 background: "#ef4444",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
//               }}
//             >
//               <X size={16} color="#fff" />
//             </button>
//           </div>
//         ) : (
//           <>
//             <div
//               style={{
//                 width: 64,
//                 height: 64,
//                 borderRadius: 20,
//                 background: "#e0f2fe",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 16px",
//               }}
//             >
//               <Upload size={28} color="#0284c7" />
//             </div>
//             <p
//               style={{
//                 fontSize: "17px",
//                 color: "#1e293b",
//                 margin: "0 0 8px",
//                 fontWeight: 600,
//               }}
//             >
//               Click to upload {label}
//             </p>
//             <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px" }}>
//               {hint}
//             </p>
//             <label
//               htmlFor={inputId}
//               style={{
//                 display: "inline-block",
//                 padding: "12px 28px",
//                 background: "#0284c7",
//                 color: "#fff",
//                 borderRadius: 14,
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//                 boxShadow: "0 4px 12px rgba(2,132,199,0.2)",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "#0369a1")}
//               onMouseLeave={(e) => (e.target.style.background = "#0284c7")}
//             >
//               Browse Files
//             </label>
//           </>
//         )}
//         <input
//           type="file"
//           name={inputName}
//           accept={accept}
//           onChange={handleFileChange}
//           className="hidden"
//           id={inputId}
//           style={{ display: "none" }}
//         />
//       </div>
//     </div>
//   );

//   const PdfBox = () => (
//     <div>
//       <label style={labelStyle}>Syllabus PDF</label>
//       <div
//         style={{
//           border: "2px dashed #cbd5e1",
//           borderRadius: 20,
//           padding: "32px 20px",
//           textAlign: "center",
//           background: "#f8fafc",
//           cursor: "pointer",
//           transition: "all 0.2s ease",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#94a3b8")}
//         onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
//       >
//         {pdfName ? (
//           <div style={{ position: "relative", display: "inline-block" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 16,
//                 padding: "16px 24px",
//                 background: "#ffffff",
//                 borderRadius: 16,
//                 boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//               }}
//             >
//               <div
//                 style={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 12,
//                   background: "#fee2e2",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <FileText size={24} color="#ef4444" />
//               </div>
//               <span
//                 style={{
//                   fontSize: "16px",
//                   fontWeight: 500,
//                   color: "#1e293b",
//                   maxWidth: 180,
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {pdfName}
//               </span>
//             </div>
//             <button
//               type="button"
//               onClick={() => removeFile("pdf_file")}
//               style={{
//                 position: "absolute",
//                 top: -10,
//                 right: -10,
//                 width: 34,
//                 height: 34,
//                 borderRadius: "50%",
//                 background: "#ef4444",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
//               }}
//             >
//               <X size={16} color="#fff" />
//             </button>
//           </div>
//         ) : (
//           <>
//             <div
//               style={{
//                 width: 64,
//                 height: 64,
//                 borderRadius: 20,
//                 background: "#fee2e2",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 16px",
//               }}
//             >
//               <FileText size={28} color="#ef4444" />
//             </div>
//             <p
//               style={{
//                 fontSize: "17px",
//                 color: "#1e293b",
//                 margin: "0 0 8px",
//                 fontWeight: 600,
//               }}
//             >
//               Upload Course Syllabus
//             </p>
//             <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px" }}>
//               PDF only, up to 10MB
//             </p>
//             <label
//               htmlFor="pdf-upload"
//               style={{
//                 display: "inline-block",
//                 padding: "12px 28px",
//                 background: "#0284c7",
//                 color: "#fff",
//                 borderRadius: 14,
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//                 boxShadow: "0 4px 12px rgba(2,132,199,0.2)",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "#0369a1")}
//               onMouseLeave={(e) => (e.target.style.background = "#0284c7")}
//             >
//               Browse PDF
//             </label>
//           </>
//         )}
//         <input
//           type="file"
//           name="pdf_file"
//           accept=".pdf"
//           onChange={handleFileChange}
//           id="pdf-upload"
//           style={{ display: "none" }}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
//         background: "#f8fafc",
//         minHeight: "100vh",
//         padding: "32px 28px",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         input:focus, textarea:focus, select:focus { 
//           border-color: #0284c7 !important; 
//           background: #ffffff !important; 
//           box-shadow: 0 0 0 4px rgba(2,132,199,0.15) !important;
//         }
        
//         .form-input:hover { 
//           border-color: #94a3b8 !important; 
//         }
        
//         @media (max-width: 768px) {
//           .details-grid { grid-template-columns: 1fr !important; }
//           .media-grid { grid-template-columns: 1fr !important; }
//           .header-actions { flex-direction: column !important; width: 100% !important; }
//           .header-actions button { width: 100% !important; }
//         }
        
//         @media (max-width: 640px) {
//           .section-tabs { 
//             overflow-x: auto;
//             padding-bottom: 8px;
//           }
//         }
//       `}</style>

//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: 16,
//           marginBottom: 32,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <button
//             onClick={() => navigate("/course")}
//             type="button"
//             style={{
//               width: 48,
//               height: 48,
//               borderRadius: 16,
//               border: "1.5px solid #e2e8f0",
//               background: "#ffffff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
//               transition: "all 0.2s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
//           >
//             <ArrowLeft size={22} color="#1e293b" />
//           </button>
//           <div>
//             <h1
//               style={{
//                 fontSize: "32px",
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//                 lineHeight: 1.2,
//                 letterSpacing: "-0.02em",
//               }}
//             >
//               Create New Course
//             </h1>
           
//           </div>
//         </div>

//         <div className="header-actions" style={{ display: "flex", gap: 12 }}>
//           <button
//             type="button"
//             onClick={() => navigate("/course")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "14px 24px",
//               border: "1.5px solid #e2e8f0",
//               borderRadius: 16,
//               background: "#ffffff",
//               color: "#475569",
//               fontSize: "16px",
//               fontWeight: 600,
//               cursor: "pointer",
//               transition: "all 0.2s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//               e.currentTarget.style.borderColor = "#cbd5e1";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//               e.currentTarget.style.borderColor = "#e2e8f0";
//             }}
//           >
//             <X size={18} /> Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "14px 28px",
//               border: "none",
//               borderRadius: 16,
//               background: loading ? "#7dd3fc" : "#0284c7",
//               color: "#fff",
//               fontSize: "16px",
//               fontWeight: 600,
//               cursor: loading ? "not-allowed" : "pointer",
//               minWidth: 160,
//               justifyContent: "center",
//               transition: "all 0.2s ease",
//               boxShadow: loading ? "none" : "0 6px 14px rgba(2,132,199,0.25)",
//             }}
//             onMouseEnter={(e) => {
//               if (!loading) e.currentTarget.style.background = "#0369a1";
//             }}
//             onMouseLeave={(e) => {
//               if (!loading) e.currentTarget.style.background = "#0284c7";
//             }}
//           >
//             {loading ? (
//               <>
//                 <div
//                   style={{
//                     width: 18,
//                     height: 18,
//                     border: "2px solid rgba(255,255,255,0.4)",
//                     borderTopColor: "#fff",
//                     borderRadius: "50%",
//                     animation: "spin 0.8s linear infinite",
//                   }}
//                 />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save size={18} /> Save Course
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Alerts */}
//       {error && (
//         <div
//           style={{
//             marginBottom: 24,
//             padding: "16px 20px",
//             background: "#fef2f2",
//             border: "1.5px solid #fecaca",
//             borderRadius: 20,
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//           }}
//         >
//           <div
//             style={{
//               width: 44,
//               height: 44,
//               borderRadius: "50%",
//               background: "#fee2e2",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             <X size={20} color="#dc2626" />
//           </div>
//           <div style={{ flex: 1 }}>
//             <p
//               style={{
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 color: "#b91c1c",
//                 margin: 0,
//               }}
//             >
//               Error
//             </p>
//             <p style={{ fontSize: "15px", color: "#ef4444", margin: "4px 0 0" }}>
//               {error}
//             </p>
//           </div>
//           <button
//             onClick={() => setError("")}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "#9ca3af",
//               padding: "4px",
//             }}
//           >
//             <X size={18} />
//           </button>
//         </div>
//       )}
      
//       {success && (
//         <div
//           style={{
//             marginBottom: 24,
//             padding: "16px 20px",
//             background: "#f0fdf4",
//             border: "1.5px solid #bbf7d0",
//             borderRadius: 20,
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//           }}
//         >
//           <div
//             style={{
//               width: 44,
//               height: 44,
//               borderRadius: "50%",
//               background: "#dcfce7",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             <Save size={20} color="#16a34a" />
//           </div>
//           <p
//             style={{
//               fontSize: "16px",
//               fontWeight: 600,
//               color: "#166534",
//               margin: 0,
//             }}
//           >
//             ✓ {success}
//           </p>
//         </div>
//       )}

//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      

//       <form onSubmit={handleSubmit}>
//         {/* Basic Information */}
//         <div style={sectionStyle} id="basic">
//           <div style={sectionHeaderStyle}>
//             <div style={sectionDotStyle("#2563eb")} />
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontWeight: 700,
//                   fontSize: "20px",
//                   color: "#0f172a",
//                 }}
//               >
//                 Basic Information
//               </p>
             
//             </div>
//           </div>
//           <div style={{ padding: "28px" }}>
//             {/* Name */}
//             <div style={{ marginBottom: 24 }}>
//               <label style={labelStyle}>
//                 Course Name <span style={{ color: "#ef4444", fontSize: "18px" }}>*</span>
//               </label>
//               <input
//                 className="form-input"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Advanced React Development 2024"
//                 style={inputStyle}
//                 required
//               />
//             </div>

//             {/* Slug */}
//             <div style={{ marginBottom: 24 }}>
//               <label style={labelStyle}>
//                 Course Slug <span style={{ color: "#ef4444", fontSize: "18px" }}>*</span>
//               </label>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <span
//                   style={{
//                     padding: "14px 18px",
//                     background: "#f1f5f9",
//                     border: "1.5px solid #e2e8f0",
//                     borderRight: "none",
//                     borderRadius: "14px 0 0 14px",
//                     fontSize: "16px",
//                     color: "#475569",
//                     whiteSpace: "nowrap",
//                     fontWeight: 500,
//                   }}
//                 >
//                   /course/
//                 </span>
//                 <input
//                   className="form-input"
//                   type="text"
//                   name="slug"
//                   value={formData.slug}
//                   onChange={handleInputChange}
//                   placeholder="advanced-react-development-2024"
//                   style={{
//                     ...inputStyle,
//                     borderRadius: "0 14px 14px 0",
//                     flex: 1,
//                   }}
//                   required
//                 />
//               </div>
//               <p style={{ fontSize: "14px", color: "#64748b", marginTop: 8 }}>
//                 Auto-generated from course name. You can customize it.
//               </p>
//             </div>

//             {/* Category */}
//             <div style={{ marginBottom: 24 }}>
//               <label style={labelStyle}>
//                 Category <span style={{ color: "#ef4444", fontSize: "18px" }}>*</span>
//               </label>
//               <div style={{ position: "relative" }}>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   style={{ ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: "48px" }}
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown
//                   size={20}
//                   color="#64748b"
//                   style={{
//                     position: "absolute",
//                     right: 16,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     pointerEvents: "none",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label style={labelStyle}>
//                 Course Description <span style={{ color: "#ef4444", fontSize: "18px" }}>*</span>
//               </label>
//               <textarea
//                 name="text"
//                 value={formData.text}
//                 onChange={handleInputChange}
//                 rows={5}
//                 placeholder="Write a detailed description of your course..."
//                 style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
//                 required
//               />
//               <p style={{ fontSize: "14px", color: "#64748b", marginTop: 8 }}>
//                 Minimum 50 characters recommended for better SEO
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Course Details */}
//         <div style={sectionStyle} id="details">
//           <div style={sectionHeaderStyle}>
//             <div style={sectionDotStyle("#8b5cf6")} />
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontWeight: 700,
//                   fontSize: "20px",
//                   color: "#0f172a",
//                 }}
//               >
//                 Course Details
//               </p>
//               <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#64748b" }}>
//                 Additional information about your course (optional)
//               </p>
//             </div>
//           </div>
//           <div style={{ padding: "28px" }}>
//             <div
//               className="details-grid"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3, 1fr)",
//                 gap: 24,
//               }}
//             >
//               {[
//                 {
//                   icon: Clock,
//                   label: "Duration",
//                   name: "duration",
//                   placeholder: "e.g., 40 hours",
//                 },
//                 {
//                   icon: BookOpen,
//                   label: "Lectures",
//                   name: "lecture",
//                   placeholder: "e.g., 98 lectures",
//                 },
//                 {
//                   icon: Users,
//                   label: "Students",
//                   name: "students",
//                   placeholder: "e.g., 1,000+",
//                 },
//               ].map((field) => (
//                 <div key={field.name}>
//                   <label style={labelStyle}>
//                     <field.icon
//                       size={16}
//                       style={{
//                         display: "inline",
//                         marginRight: 8,
//                         verticalAlign: "middle",
//                         color: "#64748b",
//                       }}
//                     />
//                     {field.label}
//                   </label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     name={field.name}
//                     value={formData[field.name]}
//                     onChange={handleInputChange}
//                     placeholder={field.placeholder}
//                     style={inputStyle}
//                   />
//                 </div>
//               ))}

//               {/* Level */}
//               <div>
//                 <label style={labelStyle}>
//                   <Signal
//                     size={16}
//                     style={{
//                       display: "inline",
//                       marginRight: 8,
//                       verticalAlign: "middle",
//                       color: "#64748b",
//                     }}
//                   />
//                   Difficulty Level
//                 </label>
//                 <div style={{ position: "relative" }}>
//                   <select
//                     name="level"
//                     value={formData.level}
//                     onChange={handleInputChange}
//                     style={{
//                       ...inputStyle,
//                       appearance: "none",
//                       cursor: "pointer",
//                       paddingRight: "48px",
//                     }}
//                   >
//                     <option value="">Select Level</option>
//                     <option value="Beginner">Beginner</option>
//                     <option value="Intermediate">Intermediate</option>
//                     <option value="Advanced">Advanced</option>
//                     <option value="All Levels">All Levels</option>
//                   </select>
//                   <ChevronDown
//                     size={20}
//                     color="#64748b"
//                     style={{
//                       position: "absolute",
//                       right: 16,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Language */}
//               <div>
//                 <label style={labelStyle}>
//                   <Globe
//                     size={16}
//                     style={{
//                       display: "inline",
//                       marginRight: 8,
//                       verticalAlign: "middle",
//                       color: "#64748b",
//                     }}
//                   />
//                   Language
//                 </label>
//                 <input
//                   className="form-input"
//                   type="text"
//                   name="language"
//                   value={formData.language}
//                   onChange={handleInputChange}
//                   placeholder="e.g., English"
//                   style={inputStyle}
//                 />
//               </div>

//               {/* Certificate */}
//               <div>
//                 <label style={labelStyle}>
//                   <Award
//                     size={16}
//                     style={{
//                       display: "inline",
//                       marginRight: 8,
//                       verticalAlign: "middle",
//                       color: "#64748b",
//                     }}
//                   />
//                   Certificate
//                 </label>
//                 <div style={{ display: "flex", gap: 12 }}>
//                   {["No", "Yes"].map((val) => (
//                     <label
//                       key={val}
//                       style={{
//                         flex: 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 8,
//                         padding: "14px",
//                         border: `2px solid ${formData.certificate === val ? "#0284c7" : "#e2e8f0"}`,
//                         borderRadius: 14,
//                         cursor: "pointer",
//                         background: formData.certificate === val ? "#f0f9ff" : "#ffffff",
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         color: formData.certificate === val ? "#0284c7" : "#475569",
//                         transition: "all 0.2s ease",
//                       }}
//                     >
//                       <input
//                         type="radio"
//                         name="certificate"
//                         value={val}
//                         checked={formData.certificate === val}
//                         onChange={handleInputChange}
//                         style={{ display: "none" }}
//                       />
//                       {val === "Yes" ? <Award size={18} /> : <X size={18} />}
//                       {val}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Media Files */}
//         <div style={sectionStyle} id="media">
//           <div style={sectionHeaderStyle}>
//             <div style={sectionDotStyle("#f59e0b")} />
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontWeight: 700,
//                   fontSize: "20px",
//                   color: "#0f172a",
//                 }}
//               >
//                 Media Files
//               </p>
//               <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#64748b" }}>
//                 Upload course images and materials (optional but recommended)
//               </p>
//             </div>
//           </div>
//           <div style={{ padding: "28px" }}>
//             <div
//               className="media-grid"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 24,
//               }}
//             >
//               <UploadBox
//                 preview={imagePreview}
//                 onRemove={() => removeFile("image")}
//                 inputId="image-upload"
//                 inputName="image"
//                 accept="image/*"
//                 label="Course Image"
//                 hint="PNG, JPG, WebP up to 5MB"
//               />
//               <UploadBox
//                 preview={bannerPreview}
//                 onRemove={() => removeFile("banner_img")}
//                 inputId="banner-upload"
//                 inputName="banner_img"
//                 accept="image/*"
//                 label="Banner Image"
//                 hint="PNG, JPG, WebP up to 5MB"
//               />
//               <UploadBox
//                 preview={iconPreview}
//                 onRemove={() => removeFile("icon")}
//                 inputId="icon-upload"
//                 inputName="icon"
//                 accept="image/*"
//                 label="Course Icon"
//                 hint="PNG, JPG up to 2MB"
//                 isSmall
//               />
//               <PdfBox />
//             </div>
//           </div>
//         </div>

//         {/* SEO & Metadata */}
//         <div style={sectionStyle} id="seo">
//           <div style={sectionHeaderStyle}>
//             <div style={sectionDotStyle("#10b981")} />
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontWeight: 700,
//                   fontSize: "20px",
//                   color: "#0f172a",
//                 }}
//               >
//                 SEO & Metadata
//               </p>
//               <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#64748b" }}>
//                 Improve your course visibility in search engines (optional)
//               </p>
//             </div>
//           </div>
//           <div style={{ padding: "28px" }}>
//             <div style={{ marginBottom: 24 }}>
//               <label style={labelStyle}>Meta Title</label>
//               <input
//                 className="form-input"
//                 type="text"
//                 name="meta_title"
//                 value={formData.meta_title}
//                 onChange={handleInputChange}
//                 placeholder="SEO optimized title for your course"
//                 style={inputStyle}
//               />
//               <p style={{ fontSize: "14px", color: "#64748b", marginTop: 8 }}>
//                 Recommended length: 50-60 characters
//               </p>
//             </div>
//             <div style={{ marginBottom: 24 }}>
//               <label style={labelStyle}>Meta Description</label>
//               <textarea
//                 name="meta_description"
//                 value={formData.meta_description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 placeholder="Brief description for search engines"
//                 style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
//               />
//               <p style={{ fontSize: "14px", color: "#64748b", marginTop: 8 }}>
//                 Recommended length: 150-160 characters
//               </p>
//             </div>
//             <div>
//               <label style={labelStyle}>Keywords</label>
//               <input
//                 className="form-input"
//                 type="text"
//                 name="keywords"
//                 value={formData.keywords}
//                 onChange={handleInputChange}
//                 placeholder="react, javascript, web development, frontend"
//                 style={inputStyle}
//               />
//               <p style={{ fontSize: "14px", color: "#64748b", marginTop: 8 }}>
//                 Comma-separated keywords for better searchability
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: 16,
//             paddingTop: 12,
//             paddingBottom: 24,
//           }}
//         >
//           <button
//             type="button"
//             onClick={() => navigate("/course")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "14px 32px",
//               border: "1.5px solid #e2e8f0",
//               borderRadius: 16,
//               background: "#ffffff",
//               color: "#475569",
//               fontSize: "16px",
//               fontWeight: 600,
//               cursor: "pointer",
//               transition: "all 0.2s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//               e.currentTarget.style.borderColor = "#cbd5e1";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//               e.currentTarget.style.borderColor = "#e2e8f0";
//             }}
//           >
//             <X size={18} /> Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "14px 36px",
//               border: "none",
//               borderRadius: 16,
//               background: loading ? "#7dd3fc" : "#0284c7",
//               color: "#fff",
//               fontSize: "16px",
//               fontWeight: 600,
//               cursor: loading ? "not-allowed" : "pointer",
//               minWidth: 180,
//               justifyContent: "center",
//               transition: "all 0.2s ease",
//               boxShadow: loading ? "none" : "0 8px 20px rgba(2,132,199,0.3)",
//             }}
//             onMouseEnter={(e) => {
//               if (!loading) e.currentTarget.style.background = "#0369a1";
//             }}
//             onMouseLeave={(e) => {
//               if (!loading) e.currentTarget.style.background = "#0284c7";
//             }}
//           >
//             {loading ? (
//               <>
//                 <div
//                   style={{
//                     width: 18,
//                     height: 18,
//                     border: "2px solid rgba(255,255,255,0.4)",
//                     borderTopColor: "#fff",
//                     borderRadius: "50%",
//                     animation: "spin 0.8s linear infinite",
//                   }}
//                 />
//                 Saving Course...
//               </>
//             ) : (
//               <>
//                 <Save size={18} /> Create Course
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Image as ImageIcon,
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
          "https://codingcloud.pythonanywhere.com/category/"
        );
        const data = await response.json();
        setCategories(data);
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
      // File size validation
      const maxSize = name === "pdf_file" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // File type validation
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
      else if (name === "banner_img") setBannerPreview(URL.createObjectURL(file));
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
      submitData.append("text", formData.text);
      if (formData.duration) submitData.append("duration", formData.duration);
      if (formData.lecture) submitData.append("lecture", formData.lecture);
      if (formData.students) submitData.append("students", formData.students);
      if (formData.level) submitData.append("level", formData.level);
      if (formData.language) submitData.append("language", formData.language);
      submitData.append("certificate", formData.certificate);
      if (formData.meta_title) submitData.append("meta_title", formData.meta_title);
      if (formData.meta_description) submitData.append("meta_description", formData.meta_description);
      if (formData.keywords) submitData.append("keywords", formData.keywords);
      if (formData.image) submitData.append("image", formData.image);
      if (formData.banner_img) submitData.append("banner_img", formData.banner_img);
      if (formData.pdf_file) submitData.append("pdf_file", formData.pdf_file);
      if (formData.icon) submitData.append("icon", formData.icon);

      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/course/",
        {
          method: "POST",
          body: submitData,
        }
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

  const UploadBox = ({ preview, onRemove, inputId, inputName, label, hint }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        onClick={() => !preview && document.getElementById(inputId)?.click()}
        className={`border-2 border-dashed rounded-xl p-6 transition-all ${
          preview 
            ? "border-indigo-300 bg-indigo-50/30" 
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer"
        }`}
      >
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="preview"
              className="max-h-40 rounded-lg shadow-md mx-auto"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium mb-1">Click to upload</p>
            <p className="text-sm text-gray-500">{hint}</p>
          </div>
        )}
        <input
          type="file"
          name={inputName}
          accept={inputName === "pdf_file" ? ".pdf" : "image/*"}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
        />
      </div>
    </div>
  );

  const PdfBox = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Syllabus PDF</label>
      <div
        onClick={() => !pdfName && document.getElementById("pdf-upload")?.click()}
        className={`border-2 border-dashed rounded-xl p-6 transition-all ${
          pdfName 
            ? "border-indigo-300 bg-indigo-50/30" 
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer"
        }`}
      >
        {pdfName ? (
          <div className="relative inline-block">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                {pdfName}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeFile("pdf_file"); }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-red-600" />
            </div>
            <p className="text-gray-700 font-medium mb-1">Upload Syllabus</p>
            <p className="text-sm text-gray-500">PDF only, up to 10MB</p>
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
    </div>
  );

  const Section = ({ title, description, icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${icon} shadow-lg`} />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/course")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Create New Course
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Add a new course to your platform
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span className="hidden sm:inline">Save</span>
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
            <p className="text-sm text-red-600 flex-1">{error}</p>
            <button onClick={() => setError("")} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Save size={14} className="text-green-600" />
            </div>
            <p className="text-sm text-green-600">✓ {success}</p>
          </div>
        )}

        {/* Loading Categories */}
        {loadingCategories && (
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Section title="Basic Information" description="Essential course details" icon="bg-blue-500">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Advanced React Development 2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600">
                    /course/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="advanced-react-development-2024"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-r-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Auto-generated from course name. You can customize it.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Write a detailed description of your course..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 50 characters recommended for better SEO
                </p>
              </div>
            </div>
          </Section>

          {/* Course Details */}
          <Section title="Course Details" description="Additional information (optional)" icon="bg-purple-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Clock, label: "Duration", name: "duration", placeholder: "e.g., 40 hours" },
                { icon: BookOpen, label: "Lectures", name: "lecture", placeholder: "e.g., 98 lectures" },
                { icon: Users, label: "Students", name: "students", placeholder: "e.g., 1,000+" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <field.icon size={16} className="inline mr-1 text-gray-500" />
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Signal size={16} className="inline mr-1 text-gray-500" />
                  Difficulty Level
                </label>
                <div className="relative">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} className="inline mr-1 text-gray-500" />
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g., English"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award size={16} className="inline mr-1 text-gray-500" />
                  Certificate
                </label>
                <div className="flex gap-3">
                  {["No", "Yes"].map((val) => (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.certificate === val
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
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
                      {val === "Yes" ? <Award size={16} /> : <X size={16} />}
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Media Files */}
          <Section title="Media Files" description="Upload images and materials (optional)" icon="bg-orange-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadBox
                preview={imagePreview}
                onRemove={() => removeFile("image")}
                inputId="image-upload"
                inputName="image"
                label="Course Image"
                hint="PNG, JPG, WebP up to 5MB"
              />
              <UploadBox
                preview={bannerPreview}
                onRemove={() => removeFile("banner_img")}
                inputId="banner-upload"
                inputName="banner_img"
                label="Banner Image"
                hint="PNG, JPG, WebP up to 5MB"
              />
              <UploadBox
                preview={iconPreview}
                onRemove={() => removeFile("icon")}
                inputId="icon-upload"
                inputName="icon"
                label="Course Icon"
                hint="PNG, JPG up to 2MB"
              />
              <PdfBox />
            </div>
          </Section>

          {/* SEO & Metadata */}
          <Section title="SEO & Metadata" description="Improve search visibility (optional)" icon="bg-green-500">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO optimized title for your course"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Recommended length: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Brief description for search engines"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">Recommended length: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="react, javascript, web development, frontend"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Comma-separated keywords for better searchability</p>
              </div>
            </div>
          </Section>

          {/* Mobile Submit Button */}
          <div className="block sm:hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
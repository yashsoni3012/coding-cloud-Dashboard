// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   BookOpen,
//   HelpCircle,
//   CheckCircle,
//   AlertCircle,
//   Edit,
//   Layers,
// } from "lucide-react";

// export default function EditModule() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Categories state
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);

//   // Form state matching API format
//   const [formData, setFormData] = useState({
//     name: "",
//     course_data: "",
//   });

//   // Fetch all categories/courses
//   const fetchCategories = async () => {
//     try {
//       setLoadingCategories(true);
//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/course/",
//       );
//       const data = await response.json();

//       if (data.success) {
//         // Extract unique courses with ID and name
//         const courseList = data.data.map((course) => ({
//           id: course.id,
//           name: course.name,
//           category: course.category_details?.name || "Uncategorized",
//         }));
//         setCategories(courseList);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   // Fetch module data
//   useEffect(() => {
//     const fetchModuleData = async () => {
//       try {
//         setLoading(true);

//         // Fetch categories first
//         await fetchCategories();

//         // Then fetch module details
//         const response = await fetch(
//           `https://codingcloud.pythonanywhere.com/modules/${id}/`,
//         );
//         const data = await response.json();

//         if (data.success) {
//           const module = data.data;
//           setFormData({
//             name: module.name || "",
//             course_data: module.course_data?.toString() || "",
//           });
//         } else {
//           setError("Failed to fetch module details");
//         }
//       } catch (err) {
//         console.error("Error fetching module:", err);
//         setError("Network error. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchModuleData();
//     }
//   }, [id]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     setError("");
//   };

//   // Validate form
//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       return "Module name is required";
//     }
//     if (!formData.course_data) {
//       return "Please select a course";
//     }
//     return "";
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Prepare data for API
//       const submitData = {
//         name: formData.name.trim(),
//         course_data: parseInt(formData.course_data),
//       };

//       console.log("Updating module data:", submitData);

//       // Make API request (PATCH request for update)
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/modules/${id}/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(submitData),
//         },
//       );

//       const data = await response.json();
//       console.log("API Response:", data);

//       if (response.ok || response.status === 200) {
//         setSuccess("Module updated successfully!");
//         // Redirect after 2 seconds
//         setTimeout(() => {
//           navigate("/modules");
//         }, 2000);
//       } else {
//         setError(
//           data.message ||
//             data.detail ||
//             "Failed to update module. Please try again.",
//         );
//       }
//     } catch (err) {
//       console.error("Error updating module:", err);
//       setError("Network error. Please check your connection and try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Get selected course name for display
//   const getSelectedCourseName = () => {
//     const selected = categories.find(
//       (c) => c.id === parseInt(formData.course_data),
//     );
//     return selected ? selected.name : "Unknown Course";
//   };

//   // Styles matching AddCourse component
//   const inputStyle = {
//     width: "100%",
//     padding: "10px 14px",
//     border: "1px solid #e5e7eb",
//     borderRadius: 10,
//     fontSize: 13,
//     color: "#111827",
//     background: "#f9fafb",
//     outline: "none",
//     boxSizing: "border-box",
//     fontFamily: "inherit",
//     transition: "border-color 0.15s, background 0.15s",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#374151",
//     marginBottom: 6,
//   };

//   const sectionStyle = {
//     background: "#fff",
//     borderRadius: 16,
//     boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//     overflow: "hidden",
//     marginBottom: 20,
//   };

//   const sectionHeaderStyle = {
//     padding: "16px 24px",
//     borderBottom: "1px solid #f3f4f6",
//     background: "#fafafa",
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//   };

//   const sectionDotStyle = (color) => ({
//     width: 8,
//     height: 8,
//     borderRadius: "50%",
//     background: color,
//     flexShrink: 0,
//   });

//   if (loading) {
//     return (
//       <div
//         style={{
//           fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//           background: "#f4f5f7",
//           minHeight: "100vh",
//           padding: "24px 20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//           @keyframes spin { to { transform: rotate(360deg); } }
//         `}</style>
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               width: 50,
//               height: 50,
//               border: "3px solid #e5e7eb",
//               borderTopColor: "#2563eb",
//               borderRadius: "50%",
//               animation: "spin 0.8s linear infinite",
//               margin: "0 auto 16px",
//             }}
//           />
//           <p style={{ fontSize: 13, color: "#6b7280" }}>
//             Loading module data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//         background: "#f4f5f7",
//         minHeight: "100vh",
//         padding: "24px 20px",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         input:focus, textarea:focus, select:focus { 
//           border-color: #2563eb !important; 
//           background: #fff !important; 
//           box-shadow: 0 0 0 3px rgba(37,99,235,0.08); 
//         }
//         .form-input:hover { border-color: #c7d2fe; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       {/* ── Header ── */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: 12,
//           marginBottom: 24,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <button
//             onClick={() => navigate("/modules")}
//             type="button"
//             style={{
//               width: 38,
//               height: 38,
//               borderRadius: 10,
//               border: "1px solid #e5e7eb",
//               background: "#fff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//             }}
//           >
//             <ArrowLeft size={18} color="#374151" />
//           </button>
//           <div>
//             <h1
//               style={{
//                 fontSize: 20,
//                 fontWeight: 700,
//                 color: "#111827",
//                 margin: 0,
//               }}
//             >
//               Edit Module
//             </h1>
           
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10 }}>
//           <button
//             type="button"
//             onClick={() => navigate("/modules")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "9px 18px",
//               border: "1px solid #e5e7eb",
//               borderRadius: 10,
//               background: "#fff",
//               color: "#374151",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             <X size={15} /> Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "9px 20px",
//               border: "none",
//               borderRadius: 10,
//               background: saving ? "#93c5fd" : "#2563eb",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: saving ? "not-allowed" : "pointer",
//               minWidth: 140,
//               justifyContent: "center",
//             }}
//           >
//             {saving ? (
//               <>
//                 <div
//                   style={{
//                     width: 14,
//                     height: 14,
//                     border: "2px solid rgba(255,255,255,0.4)",
//                     borderTopColor: "#fff",
//                     borderRadius: "50%",
//                     animation: "spin 0.8s linear infinite",
//                   }}
//                 />
//                 Updating...
//               </>
//             ) : (
//               <>
//                 <Save size={15} /> Update Module
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ── Alerts ── */}
//       {error && (
//         <div
//           style={{
//             marginBottom: 16,
//             padding: "12px 16px",
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: 12,
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//           }}
//         >
//           <div
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: "50%",
//               background: "#fee2e2",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             <X size={14} color="#dc2626" />
//           </div>
//           <div>
//             <p
//               style={{
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: "#dc2626",
//                 margin: 0,
//               }}
//             >
//               Error
//             </p>
//             <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>
//               {error}
//             </p>
//           </div>
//           <button
//             onClick={() => setError("")}
//             style={{
//               marginLeft: "auto",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "#9ca3af",
//             }}
//           >
//             <X size={14} />
//           </button>
//         </div>
//       )}

//       {success && (
//         <div
//           style={{
//             marginBottom: 16,
//             padding: "12px 16px",
//             background: "#f0fdf4",
//             border: "1px solid #bbf7d0",
//             borderRadius: 12,
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//           }}
//         >
//           <div
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: "50%",
//               background: "#dcfce7",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             <CheckCircle size={14} color="#16a34a" />
//           </div>
//           <p
//             style={{
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#16a34a",
//               margin: 0,
//             }}
//           >
//             ✓ {success}
//           </p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* ── Module Information ── */}
//         <div style={sectionStyle}>
//           <div style={sectionHeaderStyle}>
//             <div style={sectionDotStyle("#2563eb")} />
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontWeight: 700,
//                   fontSize: 14,
//                   color: "#111827",
//                 }}
//               >
//                 Module Information
//               </p>
             
//             </div>
//           </div>

//           <div style={{ padding: 24 }}>
//             {/* Module Name */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={labelStyle}>
//                 Module Name <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <input
//                 className="form-input"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Introduction to Python, Module 1 - Basics"
//                 style={inputStyle}
//                 required
//               />
             
//             </div>

//             {/* Course Selection Dropdown */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={labelStyle}>
//                 <Layers
//                   size={12}
//                   style={{
//                     display: "inline",
//                     marginRight: 5,
//                     verticalAlign: "middle",
//                     color: "#6b7280",
//                   }}
//                 />
//                 Select Course <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <select
//                 name="course_data"
//                 value={formData.course_data}
//                 onChange={handleInputChange}
//                 style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
//                 required
//                 disabled={loadingCategories}
//               >
//                 <option value="">-- Select a course --</option>
//                 {categories.map((course) => (
//                   <option key={course.id} value={course.id}>
//                     {course.id}: {course.name} ({course.category})
//                   </option>
//                 ))}
//               </select>

//               {loadingCategories && (
//                 <p
//                   style={{
//                     fontSize: 11,
//                     color: "#9ca3af",
//                     marginTop: 8,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 5,
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 12,
//                       height: 12,
//                       border: "2px solid #e5e7eb",
//                       borderTopColor: "#2563eb",
//                       borderRadius: "50%",
//                       animation: "spin 0.8s linear infinite",
//                     }}
//                   />
//                   Loading courses...
//                 </p>
//               )}

//             </div>
//           </div>
//         </div>

        
//       </form>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
    ArrowLeft,
    Save,
    X,
    Layers,
    ChevronDown,
    Info,
    Tag,
    BookOpen,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import Toasts from "./Toasts";

export default function EditModule() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // ------------------------------------------------------------------------
    // Editor mode: "tinymce" or "html"
    // ------------------------------------------------------------------------
    const [editorMode, setEditorMode] = useState("tinymce");

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        descriptions: "",
        course_data: "",
    });

    // Toast state
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
            const data = await response.json();
            if (data.success) {
                const courseList = data.data.map((course) => ({
                    id: course.id,
                    name: course.name,
                    category: course.category_details?.name || "Uncategorized",
                }));
                setCategories(courseList);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                setLoading(true);
                await fetchCategories();
                const response = await fetch(`https://codingcloud.pythonanywhere.com/modules/${id}/`);
                const data = await response.json();
                if (data.success) {
                    const module = data.data;
                    setFormData({
                        name: module.name || "",
                        descriptions: module.descriptions || "",
                        course_data: module.course_data?.toString() || "",
                    });
                } else {
                    showToast("Failed to fetch module details", "error");
                }
            } catch (err) {
                showToast("Network error. Please try again.", "error");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchModuleData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Module name is required";
        }

        if (!formData.course_data) {
            errors.course_data = "Course selection is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            const missingFields = Object.keys(fieldErrors).join(", ");
            showToast(`Please fill required fields: ${missingFields}`, "error");
            return;
        }

        setSaving(true);
        try {
            const descriptionsValue = formData.descriptions.trim() === ""
                ? null
                : formData.descriptions.trim();

            const submitData = {
                name: formData.name.trim(),
                descriptions: descriptionsValue,
                course_data: parseInt(formData.course_data),
            };

            const response = await fetch(`https://codingcloud.pythonanywhere.com/modules/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (response.ok || response.status === 200) {
                showToast("Module updated successfully!", "success");
                setTimeout(() => navigate("/modules"), 2000);
            } else {
                // Handle structured field errors from backend
                if (data.errors) {
                    const backendErrors = {};
                    Object.keys(data.errors).forEach((key) => {
                        backendErrors[key] = data.errors[key].join(", ");
                    });
                    setFieldErrors(backendErrors);
                    showToast("Please correct the errors below", "error");
                } else {
                    showToast(data.message || data.detail || "Failed to update module.", "error");
                }
            }
        } catch (err) {
            showToast("Network error. Please check your connection.", "error");
        } finally {
            setSaving(false);
        }
    };

    const selectedCourse = categories.find((c) => c.id === parseInt(formData.course_data));

    // ── Loading State ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-base text-gray-500 font-medium">Loading module data…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Toast notification */}
            {toast.show && (
                <Toasts
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            {/* ── Header ── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/modules")}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit Module</h1>
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
                                Update Module
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Module Details Card (Name + Description) ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Tag size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-base font-semibold text-gray-800">
                                    Module Details <span className="text-red-500">*</span>
                                </label>
                            </div>
                        </div>

                        {/* Module Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Module Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Introduction to Python, Module 1 - Basics"
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                                    fieldErrors.name ? "border-red-500" : "border-gray-200"
                                }`}
                                required
                            />
                            {fieldErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                            )}
                        </div>

                        {/* Description - with tabs */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="descriptions" className="block text-sm font-medium text-gray-700">
                                    Description
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
                                <div className={`border rounded-xl overflow-hidden ${
                                    fieldErrors.descriptions ? "border-red-500" : "border-gray-200"
                                }`}>
                                    <Editor
                                        apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j"
                                        onInit={(evt, editor) => (editorRef.current = editor)}
                                        value={formData.descriptions}
                                        onEditorChange={(content) => {
                                            setFormData((prev) => ({ ...prev, descriptions: content }));
                                            if (fieldErrors.descriptions) {
                                                setFieldErrors((prev) => ({ ...prev, descriptions: undefined }));
                                            }
                                        }}
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
                                            placeholder:
                                                "Provide a brief overview of what this module covers…",
                                        }}
                                    />
                                </div>
                            ) : (
                                <textarea
                                    value={formData.descriptions}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, descriptions: e.target.value }));
                                        if (fieldErrors.descriptions) {
                                            setFieldErrors((prev) => ({ ...prev, descriptions: undefined }));
                                        }
                                    }}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                                        fieldErrors.descriptions ? "border-red-500" : "border-gray-200"
                                    }`}
                                    rows={12}
                                    placeholder="<!-- Write HTML here -->"
                                />
                            )}

                        </div>
                    </div>

                    {/* ── Course Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen size={16} className="text-violet-600" />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800">
                                    Select Course <span className="text-red-500">*</span>
                                </label>
                            </div>
                        </div>

                        {/* Loading courses inline */}
                        {loadingCategories && (
                            <div className="flex items-center gap-2 mb-3 text-xs text-indigo-600">
                                <div className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                                Loading courses…
                            </div>
                        )}

                        <div className="relative">
                            <select
                                name="course_data"
                                value={formData.course_data}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
                                    fieldErrors.course_data ? "border-red-500" : "border-gray-200"
                                }`}
                                required
                                disabled={loadingCategories}
                            >
                                <option value="">— Select a course —</option>
                                {categories.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.id}: {course.name} ({course.category})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {fieldErrors.course_data && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.course_data}</p>
                        )}

                        
                    </div>

                    {/* ── Mobile Submit ── */}
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
                                    Update Module
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
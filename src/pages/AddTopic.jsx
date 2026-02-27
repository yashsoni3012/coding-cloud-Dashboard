// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   BookOpen,
//   HelpCircle,
//   CheckCircle,
//   AlertCircle,
//   Layers,
//   BookMarked,
// } from "lucide-react";

// export default function AddTopic() {
//   const navigate = useNavigate();

//   // State for form data
//   const [formData, setFormData] = useState({
//     module_id: "",
//     name: "",
//   });

//   // State for API data
//   const [modules, setModules] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [filteredModules, setFilteredModules] = useState([]);

//   // UI States
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("");

//   // Fetch modules and courses on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch modules
//         const modulesResponse = await fetch(
//           "https://codingcloud.pythonanywhere.com/modules/",
//         );
//         const modulesData = await modulesResponse.json();
//         console.log("Modules API response:", modulesData);

//         // Fetch courses
//         const coursesResponse = await fetch(
//           "https://codingcloud.pythonanywhere.com/course/",
//         );
//         const coursesData = await coursesResponse.json();
//         console.log("Courses API response:", coursesData);

//         if (modulesData.success) {
//           setModules(modulesData.data);
//           setFilteredModules(modulesData.data);
//         } else {
//           setError("Failed to load modules");
//         }

//         if (coursesData.success) {
//           setCourses(coursesData.data);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load modules or courses. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter modules when course is selected
//   useEffect(() => {
//     if (selectedCourse) {
//       const filtered = modules.filter(
//         (module) => module.course_data === parseInt(selectedCourse),
//       );
//       setFilteredModules(filtered);

//       // Reset module selection if current selection doesn't belong to selected course
//       if (formData.module_id) {
//         const selectedModule = modules.find(
//           (m) => m.id === parseInt(formData.module_id),
//         );
//         if (
//           selectedModule &&
//           selectedModule.course_data !== parseInt(selectedCourse)
//         ) {
//           setFormData((prev) => ({ ...prev, module_id: "" }));
//         }
//       }
//     } else {
//       setFilteredModules(modules);
//     }
//   }, [selectedCourse, modules, formData.module_id]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError("");
//   };

//   // Handle course selection
//   const handleCourseChange = (e) => {
//     setSelectedCourse(e.target.value);
//   };

//   // Validate form
//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       return "Topic name is required";
//     }
//     if (!formData.module_id) {
//       return "Please select a module";
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
//       const moduleId = parseInt(formData.module_id);
//       const topicName = formData.name.trim();

//       // Based on available endpoints, it seems the correct pattern is /topics/
//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/topics/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             module: parseInt(formData.module_id),
//             name: formData.name.trim(),
//           }),
//         },
//       );

//       console.log("Response status:", response.status);

//       // If the response is not ok, try to get the error details
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.log("Error response:", errorText);

//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage =
//             errorData.message || errorData.detail || JSON.stringify(errorData);
//         } catch {
//           errorMessage = errorText || `HTTP error ${response.status}`;
//         }

//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       console.log("Success response:", data);

//       setSuccess("Topic created successfully!");

//       // Reset form
//       setFormData({
//         module_id: "",
//         name: "",
//       });
//       setSelectedCourse("");

//       // Redirect after 2 seconds
//       setTimeout(() => {
//         navigate("/topics");
//       }, 2000);
//     } catch (err) {
//       console.error("Error creating topic:", err);
//       setError(
//         err.message || "Failed to create topic. Please check the API endpoint.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Get module details for display
//   const getModuleDetails = (moduleId) => {
//     const module = modules.find((m) => m.id === parseInt(moduleId));
//     if (!module) return null;

//     const course = courses.find((c) => c.id === module.course_data);
//     return {
//       moduleName: module.name,
//       courseName: course?.name || "Unknown Course",
//       courseId: module.course_data,
//     };
//   };

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
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "60vh",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               width: 48,
//               height: 48,
//               border: "3px solid #e5e7eb",
//               borderTopColor: "#2563eb",
//               borderRadius: "50%",
//               animation: "spin 0.8s linear infinite",
//               margin: "0 auto 12px",
//             }}
//           />
//           <p
//             style={{
//               color: "#6b7280",
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             Loading modules and courses...
//           </p>
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
//         input:focus, select:focus { border-color: #2563eb !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
//         .form-input:hover, select:hover { border-color: #c7d2fe; }
//         @media (max-width: 640px) {
//           .header-actions { flex-direction: column !important; }
//         }
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
//             onClick={() => navigate("/topics")}
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
//               Add New Topic
//             </h1>
//             <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>
//               Create a new topic for a module
//             </p>
//           </div>
//         </div>

//         <div className="header-actions" style={{ display: "flex", gap: 10 }}>
//           <button
//             type="button"
//             onClick={() => navigate("/topics")}
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
//               minWidth: 130,
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
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save size={15} /> Save Topic
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
//             <AlertCircle size={14} color="#dc2626" />
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
//         {/* ── Topic Information ── */}
//         <div style={sectionStyle}>
//           <div style={{ padding: 24 }}>
//             {/* Topic Name */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={labelStyle}>
//                 Topic Name <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <input
//                 className="form-input"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Introduction to React, HTML Basics, JavaScript Fundamentals"
//                 style={inputStyle}
//                 required
//               />
//             </div>

//             {/* Course Selection */}
//             <div style={{ marginBottom: 20 }}>
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
//                 value={selectedCourse}
//                 onChange={handleCourseChange}
//                 style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
//               >
//                 <option value="">-- First select a course --</option>
//                 {courses.map((course) => (
//                   <option key={course.id} value={course.id}>
//                     {course.id}: {course.name} (
//                     {course.category_details?.name || "No Category"})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Module Selection */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={labelStyle}>
//                 <BookOpen
//                   size={12}
//                   style={{
//                     display: "inline",
//                     marginRight: 5,
//                     verticalAlign: "middle",
//                     color: "#6b7280",
//                   }}
//                 />
//                 Select Module <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <select
//                 name="module_id"
//                 value={formData.module_id}
//                 onChange={handleInputChange}
//                 style={{
//                   ...inputStyle,
//                   appearance: "none",
//                   cursor: selectedCourse ? "pointer" : "not-allowed",
//                   opacity: selectedCourse ? 1 : 0.6,
//                 }}
//                 disabled={!selectedCourse}
//               >
//                 <option value="">-- Select a module --</option>
//                 {filteredModules.map((module) => (
//                   <option key={module.id} value={module.id}>
//                     {module.id}: {module.name}
//                   </option>
//                 ))}
//               </select>
//               {!selectedCourse && (
//                 <p style={{ fontSize: 11, color: "#d97706", marginTop: 5 }}>
//                   ⚠️ Please select a course first to see available modules
//                 </p>
//               )}
//               {selectedCourse && filteredModules.length === 0 && (
//                 <p style={{ fontSize: 11, color: "#d97706", marginTop: 5 }}>
//                   ⚠️ No modules found for this course
//                 </p>
//               )}
//             </div>

//             {/* Selected Information Preview */}
//             {formData.module_id && (
//               <div
//                 style={{
//                   background: "#eff6ff",
//                   borderRadius: 10,
//                   padding: 16,
//                   marginTop: 8,
//                   border: "1px solid #dbeafe",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: "#1e40af",
//                     margin: "0 0 8px",
//                   }}
//                 >
//                   Selected Information:
//                 </p>
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 4 }}
//                 >
//                   <p style={{ fontSize: 12, color: "#2563eb", margin: 0 }}>
//                     <span style={{ fontWeight: 500 }}>Topic:</span>{" "}
//                     {formData.name || "Not specified"}
//                   </p>
//                   <p style={{ fontSize: 12, color: "#2563eb", margin: 0 }}>
//                     <span style={{ fontWeight: 500 }}>Module:</span>{" "}
//                     {getModuleDetails(formData.module_id)?.moduleName}
//                   </p>
//                   <p style={{ fontSize: 12, color: "#2563eb", margin: 0 }}>
//                     <span style={{ fontWeight: 500 }}>Course:</span>{" "}
//                     {getModuleDetails(formData.module_id)?.courseName} (ID:{" "}
//                     {getModuleDetails(formData.module_id)?.courseId})
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
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
    BookOpen,
    AlertCircle,
    Layers,
    CheckCircle2,
    Tag,
    ChevronDown,
    BookMarked,
} from "lucide-react";

export default function AddTopic() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ module_id: "", name: "" });
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredModules, setFilteredModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const modulesResponse = await fetch("https://codingcloud.pythonanywhere.com/modules/");
                const modulesData = await modulesResponse.json();
                const coursesResponse = await fetch("https://codingcloud.pythonanywhere.com/course/");
                const coursesData = await coursesResponse.json();

                if (modulesData.success) {
                    setModules(modulesData.data);
                    setFilteredModules(modulesData.data);
                } else {
                    setError("Failed to load modules");
                }
                if (coursesData.success) setCourses(coursesData.data);
            } catch (err) {
                setError("Failed to load modules or courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            const filtered = modules.filter((module) => module.course_data === parseInt(selectedCourse));
            setFilteredModules(filtered);
            if (formData.module_id) {
                const selectedModule = modules.find((m) => m.id === parseInt(formData.module_id));
                if (selectedModule && selectedModule.course_data !== parseInt(selectedCourse)) {
                    setFormData((prev) => ({ ...prev, module_id: "" }));
                }
            }
        } else {
            setFilteredModules(modules);
        }
    }, [selectedCourse, modules, formData.module_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleCourseChange = (e) => setSelectedCourse(e.target.value);

    const validateForm = () => {
        if (!formData.name.trim()) return "Topic name is required";
        if (!formData.module_id) return "Please select a module";
        return "";
    };

    const getModuleDetails = (moduleId) => {
        const module = modules.find((m) => m.id === parseInt(moduleId));
        if (!module) return null;
        const course = courses.find((c) => c.id === module.course_data);
        return {
            moduleName: module.name,
            courseName: course?.name || "Unknown Course",
            courseId: module.course_data,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) { setError(validationError); return; }
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const response = await fetch("https://codingcloud.pythonanywhere.com/topics/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ module: parseInt(formData.module_id), name: formData.name.trim() }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
                } catch {
                    errorMessage = errorText || `HTTP error ${response.status}`;
                }
                throw new Error(errorMessage);
            }
            setSuccess("Topic created successfully!");
            setFormData({ module_id: "", name: "" });
            setSelectedCourse("");
            setTimeout(() => navigate("/topics"), 2000);
        } catch (err) {
            setError(err.message || "Failed to create topic. Please check the API endpoint.");
        } finally {
            setSaving(false);
        }
    };

    const moduleDetails = formData.module_id ? getModuleDetails(formData.module_id) : null;

    // ── Loading State ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-medium">Loading modules and courses…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Header ── */}
            <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/topics")}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Add New Topic</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Create a new topic for a module</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                Save Topic
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Error Alert */}
                {error && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <span className="flex-1">{error}</span>
                        <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700">
                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Topic Name Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Tag size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                                    Topic Name <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Enter a clear and descriptive name for the topic</p>
                            </div>
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Introduction to React, HTML Basics, JavaScript Fundamentals"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* ── Course Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Layers size={16} className="text-violet-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Select Course <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Filter modules by selecting a course first</p>
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="">— First select a course —</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} ({course.category_details?.name || "No Category"})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* ── Module Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen size={16} className="text-pink-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Select Module <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {!selectedCourse
                                        ? "Select a course above to see available modules"
                                        : filteredModules.length === 0
                                        ? "No modules found for this course"
                                        : "Choose the module this topic belongs to"}
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                name="module_id"
                                value={formData.module_id}
                                onChange={handleInputChange}
                                disabled={!selectedCourse}
                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    !selectedCourse ? "bg-gray-100" : "bg-gray-50 focus:bg-white"
                                }`}
                            >
                                <option value="">— Select a module —</option>
                                {filteredModules.map((module) => (
                                    <option key={module.id} value={module.id}>{module.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Contextual hints */}
                        {!selectedCourse && (
                            <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-2">
                                <AlertCircle size={12} />
                                Please select a course first to see available modules
                            </p>
                        )}
                        {selectedCourse && filteredModules.length === 0 && (
                            <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-2">
                                <AlertCircle size={12} />
                                No modules found for this course
                            </p>
                        )}
                    </div>

                    {/* ── Live Preview Card ── */}
                    {(formData.name || moduleDetails) && (
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">Preview</p>
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <BookMarked size={18} className="text-indigo-500" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <p className="text-sm font-bold text-gray-800 truncate">
                                        {formData.name || <span className="text-gray-400 font-normal italic">Untitled Topic</span>}
                                    </p>
                                    {moduleDetails && (
                                        <>
                                            <p className="text-xs text-gray-500 truncate">
                                                <span className="font-medium text-gray-600">Module:</span> {moduleDetails.moduleName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                <span className="font-medium text-gray-600">Course:</span> {moduleDetails.courseName}
                                                <span className="text-gray-400 ml-1">(ID: {moduleDetails.courseId})</span>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Mobile Submit ── */}
                    <div className="sm:hidden">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Topic
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
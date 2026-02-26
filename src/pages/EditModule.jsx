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

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Layers,
  ChevronDown,
  Info,
} from "lucide-react";

export default function EditModule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    course_data: "",
  });

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
            course_data: module.course_data?.toString() || "",
          });
        } else {
          setError("Failed to fetch module details");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchModuleData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Module name is required";
    if (!formData.course_data) return "Please select a course";
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
      const submitData = { name: formData.name.trim(), course_data: parseInt(formData.course_data) };
      const response = await fetch(`https://codingcloud.pythonanywhere.com/modules/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await response.json();
      if (response.ok || response.status === 200) {
        setSuccess("Module updated successfully!");
        setTimeout(() => navigate("/modules"), 2000);
      } else {
        setError(data.message || data.detail || "Failed to update module. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const getSelectedCourseName = () => {
    const selected = categories.find((c) => c.id === parseInt(formData.course_data));
    return selected ? selected.name : "Unknown Course";
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-gray-800 mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading module data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/modules")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Module</h1>
                <p className="text-xs text-gray-500 hidden sm:block">ID: {id} • Update module information</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Updating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">Update</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X size={12} className="text-red-600" />
            </div>
            <p className="text-xs text-red-600 flex-1">{error}</p>
            <button onClick={() => setError("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Save size={12} className="text-green-600" />
            </div>
            <p className="text-xs text-green-600">✓ {success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Module Name */}
          <div>
            <label className={labelClass}>
              Module Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to Python, Module 1 - Basics"
              className={inputClass}
              required
            />
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Info size={11} className="text-gray-400" />
              Enter a descriptive name for the module
            </p>
          </div>

          {/* Course Selection */}
          <div>
            <label className={labelClass}>
              <Layers size={13} className="inline mr-1 text-gray-500" />
              Select Course <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="course_data"
                value={formData.course_data}
                onChange={handleInputChange}
                className={inputClass + " appearance-none disabled:opacity-50 disabled:cursor-not-allowed"}
                required
                disabled={loadingCategories}
              >
                <option value="">-- Select a course --</option>
                {categories.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id}: {course.name} ({course.category})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {loadingCategories && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500">Loading courses...</p>
              </div>
            )}

            {formData.course_data && !loadingCategories && (
              <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-700">
                  <span className="font-semibold">Selected Course:</span> {getSelectedCourseName()}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Submit Button */}
          <div className="block sm:hidden">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
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
      </div>
    </div>
  );
}
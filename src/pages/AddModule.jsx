// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   BookOpen,
//   HelpCircle,
//   AlertCircle,
//   CheckCircle,
//   Layers,
//   Hash,
//   Info,
// } from "lucide-react";

// export default function AddModule() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Form state matching API format
//   const [formData, setFormData] = useState({
//     name: "",
//     course_data: ""
//   });

//   // Fetch courses for dropdown (optional - you can let user enter ID directly)
//   const [courses, setCourses] = useState([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);

//   // Fetch available courses (optional feature)
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoadingCourses(true);
//         const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
//         const data = await response.json();
        
//         if (data.success) {
//           // Extract unique course IDs with names
//           const courseList = data.data.map(course => ({
//             id: course.id,
//             name: course.name
//           }));
//           setCourses(courseList);
//         }
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//       } finally {
//         setLoadingCourses(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
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
//       return "Course ID is required";
//     }
//     if (isNaN(formData.course_data) || parseInt(formData.course_data) <= 0) {
//       return "Please enter a valid Course ID";
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

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Prepare data for API
//       const submitData = {
//         name: formData.name.trim(),
//         course_data: parseInt(formData.course_data)
//       };

//       console.log("Submitting module data:", submitData);

//       // Make API request
//       const response = await fetch("https://codingcloud.pythonanywhere.com/modules/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submitData)
//       });

//       const data = await response.json();
//       console.log("API Response:", data);

//       if (response.ok || response.status === 201) {
//         setSuccess("Module created successfully!");
//         // Reset form
//         setFormData({
//           name: "",
//           course_data: ""
//         });
//         // Redirect after 2 seconds
//         setTimeout(() => {
//           navigate("/modules");
//         }, 2000);
//       } else {
//         setError(data.message || data.detail || "Failed to create module. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error creating module:", err);
//       setError("Network error. Please check your connection and try again.");
//     } finally {
//       setLoading(false);
//     }
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

//   return (
//     <div style={{
//       fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//       background: "#f4f5f7",
//       minHeight: "100vh",
//       padding: "24px 20px"
//     }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         input:focus, textarea:focus, select:focus {
//           border-color: #2563eb !important;
//           background: #fff !important;
//           box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
//         }
//         .form-input:hover {
//           border-color: #c7d2fe;
//         }
//         @media (max-width: 640px) {
//           .header-actions {
//             flex-direction: column !important;
//             width: 100%;
//           }
//           .header-actions button {
//             width: 100%;
//           }
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>

//       {/* Header */}
//       <div style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         flexWrap: "wrap",
//         gap: 12,
//         marginBottom: 24
//       }}>
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
//               boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
//             }}
//           >
//             <ArrowLeft size={18} color="#374151" />
//           </button>
//           <div>
//             <h1 style={{
//               fontSize: 20,
//               fontWeight: 700,
//               color: "#111827",
//               margin: 0
//             }}>Add New Module</h1>
//             <p style={{
//               fontSize: 12,
//               color: "#9ca3af",
//               margin: "2px 0 0"
//             }}>Create a new module for your course</p>
//           </div>
//         </div>

//         <div className="header-actions" style={{ display: "flex", gap: 10 }}>
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
//               cursor: "pointer"
//             }}
//           >
//             <X size={15} /> Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "9px 20px",
//               border: "none",
//               borderRadius: 10,
//               background: loading ? "#93c5fd" : "#2563eb",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: loading ? "not-allowed" : "pointer",
//               minWidth: 130,
//               justifyContent: "center"
//             }}
//           >
//             {loading ? (
//               <>
//                 <div style={{
//                   width: 14,
//                   height: 14,
//                   border: "2px solid rgba(255,255,255,0.4)",
//                   borderTopColor: "#fff",
//                   borderRadius: "50%",
//                   animation: "spin 0.8s linear infinite"
//                 }} />
//                 Saving...
//               </>
//             ) : (
//               <><Save size={15} /> Save Module</>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div style={{
//           marginBottom: 16,
//           padding: "12px 16px",
//           background: "#fef2f2",
//           border: "1px solid #fecaca",
//           borderRadius: 12,
//           display: "flex",
//           alignItems: "center",
//           gap: 10
//         }}>
//           <div style={{
//             width: 30,
//             height: 30,
//             borderRadius: "50%",
//             background: "#fee2e2",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexShrink: 0
//           }}>
//             <AlertCircle size={14} color="#dc2626" />
//           </div>
//           <div>
//             <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: 0 }}>Error</p>
//             <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>{error}</p>
//           </div>
//           <button
//             onClick={() => setError("")}
//             style={{
//               marginLeft: "auto",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "#9ca3af"
//             }}
//           >
//             <X size={14} />
//           </button>
//         </div>
//       )}

//       {/* Success Alert */}
//       {success && (
//         <div style={{
//           marginBottom: 16,
//           padding: "12px 16px",
//           background: "#f0fdf4",
//           border: "1px solid #bbf7d0",
//           borderRadius: 12,
//           display: "flex",
//           alignItems: "center",
//           gap: 10
//         }}>
//           <div style={{
//             width: 30,
//             height: 30,
//             borderRadius: "50%",
//             background: "#dcfce7",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexShrink: 0
//           }}>
//             <CheckCircle size={14} color="#16a34a" />
//           </div>
//           <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", margin: 0 }}>
//             ✓ {success}
//           </p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* Module Information Section */}
//         <div style={sectionStyle}>
//           <div style={sectionHeaderStyle}>
//             <div style={sectionDotStyle("#2563eb")} />
//             <div>
//               <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
//                 Module Information
//               </p>
//               <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
//                 Required fields are marked with *
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
//                 placeholder="e.g., Module 1 - Introduction to Python"
//                 style={inputStyle}
//                 required
//               />
//               <p style={{
//                 fontSize: 11,
//                 color: "#9ca3af",
//                 marginTop: 5,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4
//               }}>
//                 <Info size={10} /> Enter a descriptive name for the module
//               </p>
//             </div>

//             {/* OR Option 2: Course Dropdown (Optional) - KEPT AS ORIGINAL */}
//             {courses.length > 0 && (
//               <div style={{
//                 marginTop: 16,
//                 paddingTop: 20,
//                 borderTop: "1px solid #f3f4f6"
//               }}>
//                 <label style={labelStyle}>
//                   <BookOpen size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
//                   Or select from existing course:
//                 </label>
//                 <select
//                   onChange={(e) => {
//                     if (e.target.value) {
//                       setFormData(prev => ({
//                         ...prev,
//                         course_data: e.target.value
//                       }));
//                     }
//                   }}
//                   style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
//                 >
//                   <option value="">-- Select a course --</option>
//                   {courses.map(course => (
//                     <option key={course.id} value={course.id}>
//                       {course.id}: {course.name}
//                     </option>
//                   ))}
//                 </select>
//                 <p style={{
//                   fontSize: 11,
//                   color: "#9ca3af",
//                   marginTop: 5
//                 }}>
//                   Select from list to auto-fill Course ID
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

      

//         {/* Footer Actions */}
//         <div style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: 10,
//           paddingTop: 4
//         }}>
       
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
  Info,
  ChevronDown,
} from "lucide-react";

export default function AddModule() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    course_data: ""
  });

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
        const data = await response.json();
        if (data.success) {
          const courseList = data.data.map(course => ({ id: course.id, name: course.name }));
          setCourses(courseList);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Module name is required";
    if (!formData.course_data) return "Course ID is required";
    if (isNaN(formData.course_data) || parseInt(formData.course_data) <= 0) return "Please enter a valid Course ID";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const submitData = { name: formData.name.trim(), course_data: parseInt(formData.course_data) };
      const response = await fetch("https://codingcloud.pythonanywhere.com/modules/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
      const data = await response.json();
      if (response.ok || response.status === 201) {
        setSuccess("Module created successfully!");
        setFormData({ name: "", course_data: "" });
        setTimeout(() => navigate("/modules"), 2000);
      } else {
        setError(data.message || data.detail || "Failed to create module. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-gray-800 mb-1.5";

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
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Module</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Create a new module for your course</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">Save</span>
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
        {loadingCourses && (
          <div className="mb-4 text-center py-2">
            <div className="inline-block w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-2"></div>
            <span className="text-xs text-gray-500">Loading courses...</span>
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
              placeholder="e.g., Module 1 - Introduction to Python"
              className={inputClass}
              required
            />
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Info size={11} className="text-gray-400" />
              Enter a descriptive name for the module
            </p>
          </div>

          {/* Course Dropdown */}
          {courses.length > 0 && (
            <div>
              <label className={labelClass}>
                <BookOpen size={13} className="inline mr-1 text-gray-500" />
                Or select from existing course
              </label>
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) setFormData(prev => ({ ...prev, course_data: e.target.value }));
                  }}
                  className={inputClass + " appearance-none"}
                >
                  <option value="">-- Select a course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.id}: {course.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Select from list to auto-fill Course ID</p>
            </div>
          )}

          {/* Mobile Submit Button */}
          <div className="block sm:hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Module
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
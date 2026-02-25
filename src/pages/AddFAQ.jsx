// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   FileText,
//   HelpCircle,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// export default function AddFAQ() {
//   const navigate = useNavigate();

//   // State for form data
//   const [formData, setFormData] = useState({
//     course: "", // string ID that we parsing to int later
//     question: "",
//     answer: "",
//   });

//   // Data state
//   const [courses, setCourses] = useState([]);
//   const [loadingCourses, setLoadingCourses] = useState(true);

//   // UI States
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch(
//           "https://codingcloud.pythonanywhere.com/course/",
//         );
//         if (response.ok) {
//           const data = await response.json();
//           // Assuming course data comes inside a "data" property if wrapped, otherwise use directly
//           setCourses(data.data || data);
//         } else {
//           setError("Failed to fetch available courses.");
//         }
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//         setError("Network error when loading courses.");
//       } finally {
//         setLoadingCourses(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // Handle text input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError("");
//   };

//   // Validate form
//   const validateForm = () => {
//     if (!formData.course) {
//       return "Please select a course";
//     }
//     if (!formData.question.trim()) {
//       return "Question is required";
//     }
//     if (!formData.answer.trim()) {
//       return "Answer is required";
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
//       const payload = {
//         course: parseInt(formData.course),
//         question: formData.question.trim(),
//         answer: formData.answer.trim(),
//       };

//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/faqs/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       // If the response is not ok, try to get the error details
//       if (!response.ok) {
//         const errorText = await response.text();
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

//       setSuccess("FAQ created successfully!");

//       // Reset form
//       setFormData({
//         course: "",
//         question: "",
//         answer: "",
//       });

//       // Redirect after 2 seconds
//       setTimeout(() => {
//         navigate("/faqs");
//       }, 2000);
//     } catch (err) {
//       console.error("Error creating FAQ:", err);
//       setError(
//         err.message || "Failed to create FAQ. Please check the API endpoint.",
//       );
//     } finally {
//       setSaving(false);
//     }
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
//                 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//                 input:focus, textarea:focus, select:focus { 
//                     border-color: #2563eb !important; 
//                     background: #fff !important; 
//                     box-shadow: 0 0 0 3px rgba(37,99,235,0.08); 
//                 }
//                 .form-input:hover { border-color: #c7d2fe; }
//                 @keyframes spin { to { transform: rotate(360deg); } }
//             `}</style>

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
//             onClick={() => navigate(-1)}
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
//               Add New FAQ
//             </h1>
           
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10 }}>
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
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
//             disabled={saving || loadingCourses}
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
//               cursor: saving || loadingCourses ? "not-allowed" : "pointer",
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
//                 <Save size={15} /> Save FAQ
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
//         {/* ── FAQ Information ── */}
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
//                 FAQ Information
//               </p>
              
//             </div>
//           </div>

//           <div style={{ padding: 24 }}>
//             {/* Associated Course */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={labelStyle}>
//                 Related Course <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <div style={{ position: "relative" }}>
//                 <select
//                   name="course"
//                   value={formData.course}
//                   onChange={handleInputChange}
//                   disabled={loadingCourses}
//                   style={{
//                     ...inputStyle,
//                     appearance: "none",
//                     cursor: loadingCourses ? "not-allowed" : "pointer",
//                     background: loadingCourses ? "#f3f4f6" : "#f9fafb",
//                     paddingRight: 36,
//                   }}
//                   required
//                 >
//                   <option value="" disabled>
//                     {loadingCourses ? "Loading courses..." : "Select a Course"}
//                   </option>
//                   {courses.map((course) => (
//                     <option key={course.id} value={course.id}>
//                       {course.name} (ID: {course.id})
//                     </option>
//                   ))}
//                 </select>
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: 12,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     pointerEvents: "none",
//                     color: "#9ca3af",
//                   }}
//                 >
//                   <svg
//                     width={16}
//                     height={16}
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path d="M6 9l6 6 6-6" />
//                   </svg>
//                 </div>
//               </div>

//               {loadingCourses && (
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

//             {/* Question */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={labelStyle}>
//                 Question <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <input
//                 className="form-input"
//                 type="text"
//                 name="question"
//                 value={formData.question}
//                 onChange={handleInputChange}
//                 placeholder="e.g., What is Python used for?"
//                 style={inputStyle}
//                 required
//               />
//             </div>

//             {/* Answer */}
//             <div>
//               <label style={labelStyle}>
//                 Answer <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <textarea
//                 name="answer"
//                 value={formData.answer}
//                 onChange={handleInputChange}
//                 rows={5}
//                 placeholder="Enter the comprehensive answer here..."
//                 style={{
//                   ...inputStyle,
//                   resize: "vertical",
//                   lineHeight: 1.6,
//                   minHeight: 120,
//                 }}
//                 required
//               />
//             </div>
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
  FileText,
  HelpCircle,
  ChevronDown,
  Info,
} from "lucide-react";

export default function AddFAQ() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    course: "", // string ID that we parsing to int later
    question: "",
    answer: "",
  });

  // Data state
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // UI States
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://codingcloud.pythonanywhere.com/course/"
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming course data comes inside a "data" property if wrapped, otherwise use directly
          setCourses(data.data || data);
        } else {
          setError("Failed to fetch available courses.");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Network error when loading courses.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Validate form
  const validateForm = () => {
    if (!formData.course) {
      return "Please select a course";
    }
    if (!formData.question.trim()) {
      return "Question is required";
    }
    if (!formData.answer.trim()) {
      return "Answer is required";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        course: parseInt(formData.course),
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };

      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/faqs/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // If the response is not ok, try to get the error details
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          errorMessage = errorText || `HTTP error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      setSuccess("FAQ created successfully!");

      // Reset form
      setFormData({
        course: "",
        question: "",
        answer: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/faqs");
      }, 2000);
    } catch (err) {
      console.error("Error creating FAQ:", err);
      setError(
        err.message || "Failed to create FAQ. Please check the API endpoint."
      );
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title, description, icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${icon} shadow-sm`} />
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Add New FAQ
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Create a frequently asked question for a course
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || loadingCourses}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {saving ? (
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
            <button onClick={() => setError("")} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
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
          {/* FAQ Information Section */}
          <Section title="FAQ Information" description="Create a new frequently asked question" icon="bg-blue-500">
            <div className="space-y-5">
              {/* Associated Course */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Related Course <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    disabled={loadingCourses}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="" disabled>
                      {loadingCourses ? "Loading courses..." : "Select a Course"}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} (ID: {course.id})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {loadingCourses && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-500">Loading courses...</p>
                  </div>
                )}
              </div>

              {/* Question */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="e.g., What is Python used for?"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Enter the comprehensive answer here..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <Info size={12} className="text-gray-400" />
                  Provide a clear and detailed answer to help students
                </p>
              </div>
            </div>
          </Section>

          

          {/* Mobile Submit Button */}
          <div className="block sm:hidden">
            <button
              type="submit"
              disabled={saving || loadingCourses}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create FAQ
                </>
              )}
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
}
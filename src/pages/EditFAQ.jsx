// import { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   X,
//   FileText,
//   HelpCircle,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// export default function EditFAQ() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const location = useLocation();
//   const locationState = location.state;

//   // State for form data
//   const [formData, setFormData] = useState({
//     course: "", // string ID that we parsing to int later
//     question: "",
//     answer: "",
//   });

//   // Data state
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // UI States
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // Fetch courses for the dropdown
//         let fetchedCourses = [];
//         const coursesResponse = await fetch(
//           "https://codingcloud.pythonanywhere.com/course/",
//         );
//         if (coursesResponse.ok) {
//           const coursesData = await coursesResponse.json();
//           fetchedCourses = coursesData.data || coursesData;
//           setCourses(fetchedCourses);
//         } else {
//           setError("Failed to fetch available courses.");
//         }

//         // Fetch FAQ data
//         let faqData = null;
//         if (locationState && locationState.faq) {
//           faqData = locationState.faq;
//         } else {
//           // Need to fetch individual or from list
//           const faqsResponse = await fetch(
//             "https://codingcloud.pythonanywhere.com/faqs/",
//           );
//           if (faqsResponse.ok) {
//             const listDataRes = await faqsResponse.json();
//             const listData = listDataRes.data || listDataRes;
//             faqData = Array.isArray(listData)
//               ? listData.find((f) => f.id === parseInt(id))
//               : null;
//           }
//         }

//         if (faqData) {
//           setFormData({
//             course: faqData.course?.toString() || "",
//             question: faqData.question || "",
//             answer: faqData.answer || "",
//           });
//         } else {
//           setError((prev) =>
//             prev ? prev + " FAQ not found." : "FAQ not found.",
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [id, locationState]);

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
//         `https://codingcloud.pythonanywhere.com/faqs/${id}/`,
//         {
//           method: "PATCH", // Use PATCH for partial/full updates natively
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

//       setSuccess("FAQ updated successfully!");

//       // Redirect after 2 seconds
//       setTimeout(() => {
//         navigate("/faqs");
//       }, 2000);
//     } catch (err) {
//       console.error("Error updating FAQ:", err);
//       setError(
//         err.message || "Failed to update FAQ. Please check your connection.",
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
//                     @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//                     @keyframes spin { to { transform: rotate(360deg); } }
//                 `}</style>
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
//             Loading FAQ details...
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
//               Edit FAQ
//             </h1>
//             <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>
//               Update the frequently asked question
//             </p>
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
//             disabled={saving || !formData.course}
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
//               cursor: saving || !formData.course ? "not-allowed" : "pointer",
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
//                 <Save size={15} /> Update FAQ
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
//               <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
//                 Required fields are marked with *
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
//                   style={{
//                     ...inputStyle,
//                     appearance: "none",
//                     cursor: "pointer",
//                     paddingRight: 36,
//                   }}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select a Course
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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    X,
    ChevronDown,
    Info,
    Layers,
    HelpCircle,
    MessageSquare,
    AlertCircle,
} from "lucide-react";
import Toasts from "./Toasts"; // <-- import toast component

export default function EditFAQ() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const locationState = location.state;

    const [formData, setFormData] = useState({ course: "", question: "", answer: "" });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                // Fetch courses
                let fetchedCourses = [];
                const coursesResponse = await fetch("https://codingcloud.pythonanywhere.com/course/");
                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    fetchedCourses = coursesData.data || coursesData;
                    setCourses(fetchedCourses);
                } else {
                    showToast("Failed to fetch available courses.", "error");
                }

                // Fetch FAQ data
                let faqData = null;
                if (locationState && locationState.faq) {
                    faqData = locationState.faq;
                } else {
                    const faqsResponse = await fetch("https://codingcloud.pythonanywhere.com/faqs/");
                    if (faqsResponse.ok) {
                        const listDataRes = await faqsResponse.json();
                        const listData = listDataRes.data || listDataRes;
                        faqData = Array.isArray(listData)
                            ? listData.find((f) => f.id === parseInt(id))
                            : null;
                    }
                }

                if (faqData) {
                    setFormData({
                        course: faqData.course?.toString() || "",
                        question: faqData.question || "",
                        answer: faqData.answer || "",
                    });
                } else {
                    showToast("FAQ not found.", "error");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                showToast("Failed to load details. Please try again.", "error");
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [id, locationState]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.course) return "Please select a course";
        if (!formData.question.trim()) return "Question is required";
        if (!formData.answer.trim()) return "Answer is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            showToast(validationError, "error");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                course: parseInt(formData.course),
                question: formData.question.trim(),
                answer: formData.answer.trim(),
            };
            const response = await fetch(`https://codingcloud.pythonanywhere.com/faqs/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
            showToast("FAQ updated successfully!", "success");
            setTimeout(() => navigate("/faq"), 2000);
        } catch (err) {
            console.error("Error updating FAQ:", err);
            showToast(err.message || "Failed to update FAQ. Please check your connection.", "error");
        } finally {
            setSaving(false);
        }
    };

    const selectedCourse = courses.find((c) => c.id === parseInt(formData.course));

    // ── Loading State ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-base text-gray-500 font-medium">Loading FAQ details…</p>
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
            <header className=" top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit FAQ</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">ID: {id} · Update frequently asked question</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !formData.course}
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
                                Update FAQ
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Removed inline error/success alerts — now using toast */}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Course Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Layers size={16} className="text-violet-600" />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800">
                                    Related Course <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Select the course this FAQ belongs to</p>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                                required
                            >
                                <option value="" disabled>— Select a Course —</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} (ID: {course.id})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Selected course confirmation badge */}
                        {selectedCourse && (
                            <div className="mt-3 flex items-center gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                                <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Layers size={12} className="text-violet-600" />
                                </div>
                                <p className="text-xs text-violet-700">
                                    <span className="font-semibold">Selected:</span> {selectedCourse.name}
                                    <span className="text-violet-400 ml-1">· ID: {selectedCourse.id}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Question Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <HelpCircle size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <label htmlFor="question" className="block text-base font-semibold text-gray-800">
                                    Question <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Write a clear, concise question students might ask</p>
                            </div>
                        </div>
                        <input
                            id="question"
                            type="text"
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            placeholder="e.g., What is Python used for?"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* ── Answer Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MessageSquare size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <label htmlFor="answer" className="block text-base font-semibold text-gray-800">
                                    Answer <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Provide a clear and detailed answer to help students</p>
                            </div>
                        </div>
                        <textarea
                            id="answer"
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Enter the comprehensive answer here…"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
                            required
                        />
                        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                            <Info size={11} />
                            Provide a clear and detailed answer to help students · {formData.answer.length} characters
                        </p>
                    </div>

                    {/* ── Live Preview Card ── */}
                    {(formData.question || formData.answer || selectedCourse) && (
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">Preview</p>
                            <div className="space-y-3">
                                {selectedCourse && (
                                    <p className="text-xs text-indigo-500 font-medium">
                                        Course: {selectedCourse.name}
                                    </p>
                                )}
                                <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <HelpCircle size={11} className="text-indigo-600" />
                                    </div>
                                    <p className="text-base font-semibold text-gray-800">
                                        {formData.question || <span className="text-gray-400 font-normal italic">No question entered…</span>}
                                    </p>
                                </div>
                                {formData.answer && (
                                    <div className="pl-7">
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{formData.answer}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Mobile Submit ── */}
                    <div className="sm:hidden">
                        <button
                            type="submit"
                            disabled={saving || !formData.course}
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
                                    Update FAQ
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Editor } from "@tinymce/tinymce-react";
// import {
//     ArrowLeft,
//     Save,
//     X,
//     BookOpen,
//     Info,
//     ChevronDown,
//     Tag,
//     Layers,
//     Sparkles,
//     AlertCircle,
// } from "lucide-react";
// import Toasts from "./Toasts";

// export default function AddModule() {
//     const navigate = useNavigate();
//     const editorRef = useRef(null);

//     const [loading, setLoading] = useState(false);
//     const [fieldErrors, setFieldErrors] = useState({});
//     const [formData, setFormData] = useState({
//         name: "",
//         descriptions: "",
//         course_data: "",
//     });

//     // ------------------------------------------------------------------------
//     // Editor mode: "tinymce" or "html"
//     // ------------------------------------------------------------------------
//     const [editorMode, setEditorMode] = useState("tinymce");

//     const [courses, setCourses] = useState([]);
//     const [loadingCourses, setLoadingCourses] = useState(false);

//     // Toast state
//     const [toast, setToast] = useState({
//         show: false,
//         message: "",
//         type: "success",
//     });

//     const showToast = (message, type = "success") => {
//         setToast({ show: true, message, type });
//     };

//     const closeToast = () => {
//         setToast((prev) => ({ ...prev, show: false }));
//     };

//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 setLoadingCourses(true);
//                 const response = await fetch("https://codingcloudapi.codingcloud.co.in/course/");
//                 const data = await response.json();
//                 if (data.success) {
//                     const courseList = data.data.map((course) => ({ id: course.id, name: course.name }));
//                     setCourses(courseList);
//                 }
//             } catch (err) {
//                 console.error("Error fetching courses:", err);
//             } finally {
//                 setLoadingCourses(false);
//             }
//         };
//         fetchCourses();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         // Clear error for this field when user types
//         if (fieldErrors[name]) {
//             setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
//         }
//     };

//     const validateForm = () => {
//         const errors = {};

//         if (!formData.name.trim()) {
//             errors.name = "Module name is required";
//         }

//         if (!formData.course_data) {
//             errors.course_data = "Course selection is required";
//         } else if (isNaN(formData.course_data) || parseInt(formData.course_data) <= 0) {
//             errors.course_data = "Please select a valid course";
//         }

//         setFieldErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             const missingFields = Object.keys(fieldErrors).join(", ");
//             showToast(`Please fill required fields`, "error");
//             return;
//         }

//         setLoading(true);

//         try {
//             const descriptionsValue = formData.descriptions.trim() === ""
//                 ? null
//                 : formData.descriptions.trim();

//             const submitData = {
//                 name: formData.name.trim(),
//                 descriptions: descriptionsValue,
//                 course_data: parseInt(formData.course_data),
//             };

//             const response = await fetch("https://codingcloudapi.codingcloud.co.in/modules/", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(submitData),
//             });

//             const data = await response.json();

//             if (response.ok || response.status === 201) {
//                 showToast("Module created successfully!", "success");
//                 setFormData({ name: "", descriptions: "", course_data: "" });
//                 setTimeout(() => navigate("/modules"), 2000);
//             } else {
//                 // Handle structured field errors from backend
//                 if (data.errors) {
//                     const backendErrors = {};
//                     Object.keys(data.errors).forEach((key) => {
//                         backendErrors[key] = data.errors[key].join(", ");
//                     });
//                     setFieldErrors(backendErrors);
//                     showToast("Please correct the errors below", "error");
//                 } else {
//                     showToast(data.message || data.detail || "Failed to create module.", "error");
//                 }
//             }
//         } catch (err) {
//             showToast("Network error. Please check your connection.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Selected course name for preview (optional, can be used)
//     const selectedCourse = courses.find((c) => String(c.id) === String(formData.course_data));

//     return (
//         <div className="min-h-screen bg-gray-50">

//             {/* Toast notification */}
//             {toast.show && (
//                 <Toasts
//                     message={toast.message}
//                     type={toast.type}
//                     onClose={closeToast}
//                 />
//             )}

//             {/* ── Header ── */}
//             <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={() => navigate("/modules")}
//                             className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
//                         >
//                             <ArrowLeft size={16} />
//                             <span className="hidden sm:inline">Back</span>
//                         </button>
//                         <div className="w-px h-6 bg-gray-200" />
//                         <div>
//                             <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Add New Module</h1>
//                         </div>
//                     </div>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {loading ? (
//                             <>
//                                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                 Saving…
//                             </>
//                         ) : (
//                             <>
//                                 <Save size={15} />
//                                 Save Module
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </header>

//             {/* ── Main ── */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

//                 {/* Courses loading */}
//                 {loadingCourses && (
//                     <div className="flex items-center gap-3 p-4 mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-base text-indigo-600">
//                         <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
//                         Loading courses…
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-5">

//                     {/* ── Course Selection Card ── */}
//                     {courses.length > 0 && (
//                         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                                     <BookOpen size={16} className="text-violet-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-base font-semibold text-gray-800">
//                                         Select Course <span className="text-red-500">*</span>
//                                     </label>
//                                 </div>
//                             </div>

//                             <div className="relative">
//                                 <select
//                                     value={formData.course_data}
//                                     onChange={(e) => {
//                                         setFormData((prev) => ({ ...prev, course_data: e.target.value }));
//                                         if (fieldErrors.course_data) {
//                                             setFieldErrors((prev) => ({ ...prev, course_data: undefined }));
//                                         }
//                                     }}
//                                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none ${
//                                         fieldErrors.course_data ? "border-red-500" : "border-gray-200"
//                                     }`}
//                                 >
//                                     <option value="">— Select a course —</option>
//                                     {courses.map((course) => (
//                                         <option key={course.id} value={course.id}>
//                                             {course.id}: {course.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                             </div>
//                             {fieldErrors.course_data && (
//                                 <p className="text-xs text-red-500 mt-1">{fieldErrors.course_data}</p>
//                             )}
//                         </div>
//                     )}

//                     {/* ── Module Details Card (Name + Description) ── */}
//                     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                                 <Tag size={16} className="text-indigo-600" />
//                             </div>
//                             <div>
//                                 <label htmlFor="name" className="block text-base font-semibold text-gray-800">
//                                     Module Details
//                                 </label>
//                             </div>
//                         </div>

//                         {/* Module Name */}
//                         <div className="mb-4">
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Module Name <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 id="name"
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 placeholder="e.g., Module 1 - Introduction to Python"
//                                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                                     fieldErrors.name ? "border-red-500" : "border-gray-200"
//                                 }`}
//                                 required
//                             />
//                             {fieldErrors.name && (
//                                 <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
//                             )}
//                         </div>

//                         {/* Description - with tabs */}
//                         <div>
//                             <div className="flex items-center justify-between mb-2">
//                                 <label htmlFor="descriptions" className="block text-sm font-medium text-gray-700">
//                                     Description
//                                 </label>

//                                 {/* Tab Switcher */}
//                                 <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
//                                     <button
//                                         type="button"
//                                         onClick={() => setEditorMode("tinymce")}
//                                         className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                                             editorMode === "tinymce"
//                                                 ? "bg-white text-indigo-600 shadow-sm"
//                                                 : "text-gray-600 hover:text-gray-900"
//                                         }`}
//                                     >
//                                         TinyMCE
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setEditorMode("html")}
//                                         className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                                             editorMode === "html"
//                                                 ? "bg-white text-indigo-600 shadow-sm"
//                                                 : "text-gray-600 hover:text-gray-900"
//                                         }`}
//                                     >
//                                         HTML
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Conditional Editor */}
//                             {editorMode === "tinymce" ? (
//                                 <div className={`border rounded-xl overflow-hidden ${
//                                     fieldErrors.descriptions ? "border-red-500" : "border-gray-200"
//                                 }`}>
//                                     <Editor
//                                         apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j"
//                                         onInit={(evt, editor) => (editorRef.current = editor)}
//                                         value={formData.descriptions}
//                                         onEditorChange={(content) => {
//                                             setFormData((prev) => ({ ...prev, descriptions: content }));
//                                             if (fieldErrors.descriptions) {
//                                                 setFieldErrors((prev) => ({ ...prev, descriptions: undefined }));
//                                             }
//                                         }}
//                                         init={{
//                                             height: 400,
//                                             menubar: true,
//                                             plugins: [
//                                                 "advlist",
//                                                 "autolink",
//                                                 "lists",
//                                                 "link",
//                                                 "image",
//                                                 "charmap",
//                                                 "preview",
//                                                 "anchor",
//                                                 "searchreplace",
//                                                 "visualblocks",
//                                                 "code",
//                                                 "fullscreen",
//                                                 "insertdatetime",
//                                                 "media",
//                                                 "table",
//                                                 "help",
//                                                 "wordcount",
//                                             ],
//                                             toolbar:
//                                                 "undo redo | blocks | " +
//                                                 "bold italic forecolor | alignleft aligncenter " +
//                                                 "alignright alignjustify | bullist numlist outdent indent | " +
//                                                 "removeformat | code | help",
//                                             content_style:
//                                                 "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; }",
//                                             placeholder:
//                                                 "Provide a brief overview of what this module covers…",
//                                         }}
//                                     />
//                                 </div>
//                             ) : (
//                                 <textarea
//                                     value={formData.descriptions}
//                                     onChange={(e) => {
//                                         setFormData((prev) => ({ ...prev, descriptions: e.target.value }));
//                                         if (fieldErrors.descriptions) {
//                                             setFieldErrors((prev) => ({ ...prev, descriptions: undefined }));
//                                         }
//                                     }}
//                                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
//                                         fieldErrors.descriptions ? "border-red-500" : "border-gray-200"
//                                     }`}
//                                     rows={12}
//                                     placeholder="<!-- Write HTML here -->"
//                                 />
//                             )}

//                         </div>
//                     </div>

//                     {/* ── Mobile Submit ── */}
//                     <div className="sm:hidden">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                         >
//                             {loading ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                     Creating…
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save size={16} />
//                                     Create Module
//                                 </>
//                             )}
//                         </button>
//                     </div>

//                 </form>
//             </main>
//         </div>
//     );
// }

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import {
  ArrowLeft,
  Save,
  X,
  BookOpen,
  Info,
  ChevronDown,
  Tag,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Toasts from "./Toasts";

// Fetch courses
const fetchCourses = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/course/",
  );
  const data = await response.json();

  // ✅ Always ensure array
  const coursesArray = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
      ? data.data
      : [];

  return coursesArray.map((course) => ({
    id: course.id,
    name: course.name,
  }));
};
// Create module mutation
const createModule = async (moduleData) => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/modules/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(moduleData),
    },
  );
  const data = await response.json();
  if (!response.ok && response.status !== 201) {
    if (data.errors) {
      const backendErrors = {};
      Object.keys(data.errors).forEach((key) => {
        backendErrors[key] = data.errors[key].join(", ");
      });
      throw {
        message: "Please correct the errors below",
        errors: backendErrors,
      };
    }
    throw new Error(data.message || data.detail || "Failed to create module.");
  }
  return data;
};

export default function AddModule() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    descriptions: "",
    course_data: "",
  });

  // ------------------------------------------------------------------------
  // Editor mode: "tinymce" or "html"
  // ------------------------------------------------------------------------
  const [editorMode, setEditorMode] = useState("tinymce");

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

  // --- TanStack Query: fetch courses ---
  const {
    data: courses = [],
    isLoading: loadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // Show error if courses fail to load
  if (coursesError) {
    showToast("Failed to load courses", "error");
  }

  // --- TanStack Mutation: create module ---
  const mutation = useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      // Invalidate modules list so it refreshes
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      showToast("Module created successfully!", "success");
      setFormData({ name: "", descriptions: "", course_data: "" });
      setTimeout(() => navigate("/modules"), 2000);
    },
    onError: (err) => {
      if (err.errors) {
        setFieldErrors(err.errors);
        showToast("Please correct the errors below", "error");
      } else {
        showToast(err.message || "Failed to create module.", "error");
      }
    },
  });

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
    } else if (
      isNaN(formData.course_data) ||
      parseInt(formData.course_data) <= 0
    ) {
      errors.course_data = "Please select a valid course";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fill required fields", "error");
      return;
    }

    const descriptionsValue =
      formData.descriptions.trim() === "" ? null : formData.descriptions.trim();

    const submitData = {
      name: formData.name.trim(),
      descriptions: descriptionsValue,
      course_data: parseInt(formData.course_data),
    };

    mutation.mutate(submitData);
  };

  // Selected course name for preview (optional, can be used)
  const selectedCourse = Array.isArray(courses)
    ? courses.find((c) => String(c.id) === String(formData.course_data))
    : null;

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
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
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
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Add New Module
              </h1>
            </div>
          </div>
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
                Save Module
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {/* Courses loading */}
        {loadingCourses && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-base text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0" />
            Loading courses…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Course Selection Card ── */}
          {courses.length > 0 && (
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

              <div className="relative">
                <select
                  value={formData.course_data}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      course_data: e.target.value,
                    }));
                    if (fieldErrors.course_data) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        course_data: undefined,
                      }));
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none ${
                    fieldErrors.course_data
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">— Select a course —</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {fieldErrors.course_data && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.course_data}
                </p>
              )}
            </div>
          )}

          {/* ── Module Details Card (Name + Description) ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Tag size={16} className="text-indigo-600" />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-base font-semibold text-gray-800"
                >
                  Module Details
                </label>
              </div>
            </div>

            {/* Module Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Module Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Module 1 - Introduction to Python"
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
                <label
                  htmlFor="descriptions"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <div
                  className={`border rounded-xl overflow-hidden ${
                    fieldErrors.descriptions
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <Editor
                    apiKey="x5ikrjt2xexo2x73y0uzybqhbjq29owf8drai57qhtew5e0j"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    value={formData.descriptions}
                    onEditorChange={(content) => {
                      setFormData((prev) => ({
                        ...prev,
                        descriptions: content,
                      }));
                      if (fieldErrors.descriptions) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          descriptions: undefined,
                        }));
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
                    setFormData((prev) => ({
                      ...prev,
                      descriptions: e.target.value,
                    }));
                    if (fieldErrors.descriptions) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        descriptions: undefined,
                      }));
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base font-mono placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                    fieldErrors.descriptions
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  rows={12}
                  placeholder="<!-- Write HTML here -->"
                />
              )}
            </div>
          </div>

          {/* ── Mobile Submit ── */}
          <div className="sm:hidden">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
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
      </main>
    </div>
  );
}

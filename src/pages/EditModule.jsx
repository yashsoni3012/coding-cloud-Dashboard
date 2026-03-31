// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Editor } from "@tinymce/tinymce-react";
// import {
//     ArrowLeft,
//     Save,
//     X,
//     Layers,
//     ChevronDown,
//     Info,
//     Tag,
//     BookOpen,
//     Sparkles,
//     AlertCircle,
// } from "lucide-react";
// import Toasts from "./Toasts";

// export default function EditModule() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const editorRef = useRef(null);

//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [fieldErrors, setFieldErrors] = useState({});

//     // ------------------------------------------------------------------------
//     // Editor mode: "tinymce" or "html"
//     // ------------------------------------------------------------------------
//     const [editorMode, setEditorMode] = useState("tinymce");

//     const [categories, setCategories] = useState([]);
//     const [loadingCategories, setLoadingCategories] = useState(false);

//     const [formData, setFormData] = useState({
//         name: "",
//         descriptions: "",
//         course_data: "",
//     });

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

//     const fetchCategories = async () => {
//         try {
//             setLoadingCategories(true);
//             const response = await fetch("https://codingcloudapi.codingcloud.co.in/course/");
//             const data = await response.json();
//             if (data.success) {
//                 const courseList = data.data.map((course) => ({
//                     id: course.id,
//                     name: course.name,
//                     category: course.category_details?.name || "Uncategorized",
//                 }));
//                 setCategories(courseList);
//             }
//         } catch (err) {
//             console.error("Error fetching categories:", err);
//         } finally {
//             setLoadingCategories(false);
//         }
//     };

//     useEffect(() => {
//         const fetchModuleData = async () => {
//             try {
//                 setLoading(true);
//                 await fetchCategories();
//                 const response = await fetch(`https://codingcloudapi.codingcloud.co.in/modules/${id}/`);
//                 const data = await response.json();
//                 if (data.success) {
//                     const module = data.data;
//                     setFormData({
//                         name: module.name || "",
//                         descriptions: module.descriptions || "",
//                         course_data: module.course_data?.toString() || "",
//                     });
//                 } else {
//                     showToast("Failed to fetch module details", "error");
//                 }
//             } catch (err) {
//                 showToast("Network error. Please try again.", "error");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (id) fetchModuleData();
//     }, [id]);

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
//         }

//         setFieldErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             const missingFields = Object.keys(fieldErrors).join(", ");
//             showToast(`Please fill required fields: ${missingFields}`, "error");
//             return;
//         }

//         setSaving(true);
//         try {
//             const descriptionsValue = formData.descriptions.trim() === ""
//                 ? null
//                 : formData.descriptions.trim();

//             const submitData = {
//                 name: formData.name.trim(),
//                 descriptions: descriptionsValue,
//                 course_data: parseInt(formData.course_data),
//             };

//             const response = await fetch(`https://codingcloudapi.codingcloud.co.in/modules/${id}/`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(submitData),
//             });

//             const data = await response.json();

//             if (response.ok || response.status === 200) {
//                 showToast("Module updated successfully!", "success");
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
//                     showToast(data.message || data.detail || "Failed to update module.", "error");
//                 }
//             }
//         } catch (err) {
//             showToast("Network error. Please check your connection.", "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const selectedCourse = categories.find((c) => c.id === parseInt(formData.course_data));

//     // ── Loading State ──
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
//                     <p className="text-base text-gray-500 font-medium">Loading module data…</p>
//                 </div>
//             </div>
//         );
//     }

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
//                             <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit Module</h1>
//                         </div>
//                     </div>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={saving}
//                         className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {saving ? (
//                             <>
//                                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                 Updating…
//                             </>
//                         ) : (
//                             <>
//                                 <Save size={15} />
//                                 Update Module
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </header>

//             {/* ── Main ── */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

//                 <form onSubmit={handleSubmit} className="space-y-5">

//                     {/* ── Module Details Card (Name + Description) ── */}
//                     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                                 <Tag size={16} className="text-indigo-600" />
//                             </div>
//                             <div>
//                                 <label htmlFor="name" className="block text-base font-semibold text-gray-800">
//                                     Module Details <span className="text-red-500">*</span>
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
//                                 placeholder="e.g., Introduction to Python, Module 1 - Basics"
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

//                     {/* ── Course Selection Card ── */}
//                     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                                 <BookOpen size={16} className="text-violet-600" />
//                             </div>
//                             <div>
//                                 <label className="block text-base font-semibold text-gray-800">
//                                     Select Course <span className="text-red-500">*</span>
//                                 </label>
//                             </div>
//                         </div>

//                         {/* Loading courses inline */}
//                         {loadingCategories && (
//                             <div className="flex items-center gap-2 mb-3 text-xs text-indigo-600">
//                                 <div className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
//                                 Loading courses…
//                             </div>
//                         )}

//                         <div className="relative">
//                             <select
//                                 name="course_data"
//                                 value={formData.course_data}
//                                 onChange={handleInputChange}
//                                 className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
//                                     fieldErrors.course_data ? "border-red-500" : "border-gray-200"
//                                 }`}
//                                 required
//                                 disabled={loadingCategories}
//                             >
//                                 <option value="">— Select a course —</option>
//                                 {categories.map((course) => (
//                                     <option key={course.id} value={course.id}>
//                                         {course.id}: {course.name} ({course.category})
//                                     </option>
//                                 ))}
//                             </select>
//                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                         </div>

//                         {fieldErrors.course_data && (
//                             <p className="text-xs text-red-500 mt-1">{fieldErrors.course_data}</p>
//                         )}

//                     </div>

//                     {/* ── Mobile Submit ── */}
//                     <div className="sm:hidden">
//                         <button
//                             type="submit"
//                             disabled={saving}
//                             className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                         >
//                             {saving ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                                     Updating…
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save size={16} />
//                                     Update Module
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
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Fetch courses (called categories in original)
const fetchCourses = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/course/",
  );
  const data = await response.json();
  if (!data.success) throw new Error("Failed to load courses");
  return data.data.map((course) => ({
    id: course.id,
    name: course.name,
    category: course.category_details?.name || "Uncategorized",
  }));
};

// Fetch single module
const fetchModule = async (id) => {
  const response = await fetch(
    `https://codingcloudapi.codingcloud.co.in/modules/${id}/`,
  );
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch module details");
  return data.data;
};

// Update module mutation
const updateModule = async ({ id, data }) => {
  const response = await fetch(
    `https://codingcloudapi.codingcloud.co.in/modules/${id}/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  const result = await response.json();
  if (!response.ok && response.status !== 200) {
    if (result.errors) {
      const backendErrors = {};
      Object.keys(result.errors).forEach((key) => {
        backendErrors[key] = result.errors[key].join(", ");
      });
      throw {
        message: "Please correct the errors below",
        errors: backendErrors,
      };
    }
    throw new Error(
      result.message || result.detail || "Failed to update module.",
    );
  }
  return result;
};

export default function EditModule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [editorMode, setEditorMode] = useState("tinymce");

  // Local form state
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

  // --- TanStack Query: fetch courses ---
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // --- TanStack Query: fetch module data ---
  const {
    data: moduleData,
    isLoading: moduleLoading,
    error: moduleError,
  } = useQuery({
    queryKey: ["module", id],
    queryFn: () => fetchModule(id),
    enabled: !!id,
  });

  // Populate form when module data arrives
  useEffect(() => {
    if (moduleData) {
      setFormData({
        name: moduleData.name || "",
        descriptions: moduleData.descriptions || "",
        course_data: moduleData.course_data?.toString() || "",
      });
    }
  }, [moduleData]);

  // Show errors if any query fails
  useEffect(() => {
    if (coursesError) showToast("Failed to load courses", "error");
    if (moduleError) showToast("Failed to load module details", "error");
  }, [coursesError, moduleError]);

  // --- TanStack Mutation: update module ---
  const mutation = useMutation({
    mutationFn: updateModule,
    onSuccess: () => {
      // Invalidate both the list and this specific module
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module", id] });
      showToast("Module updated successfully!", "success");
      setTimeout(() => navigate("/modules"), 2000);
    },
    onError: (err) => {
      if (err.errors) {
        setFieldErrors(err.errors);
        showToast("Please correct the errors below", "error");
      } else {
        showToast(err.message || "Failed to update module.", "error");
      }
    },
    onSettled: () => {
      // setSaving(false) is handled in the button disable state using mutation.isPending
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const descriptionsValue =
      formData.descriptions.trim() === "" ? null : formData.descriptions.trim();

    const submitData = {
      name: formData.name.trim(),
      descriptions: descriptionsValue,
      course_data: parseInt(formData.course_data),
    };

    mutation.mutate({ id, data: submitData });
  };

  const selectedCourse = categories.find(
    (c) => c.id === parseInt(formData.course_data),
  );

  // Combined loading state
  const loading = moduleLoading || loadingCategories;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-base text-gray-500 font-medium">
            Loading module data…
          </p>
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
                Edit Module
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
                <label
                  htmlFor="name"
                  className="block text-base font-semibold text-gray-800"
                >
                  Module Details <span className="text-red-500">*</span>
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

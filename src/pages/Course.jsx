// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen, Clock, Users, Globe, Award, Search, Filter, X,
//   Download, Edit, Trash2, AlertCircle, CheckCircle, ChevronDown,
//   Plus, ArrowUpRight, SortAsc, SortDesc, RefreshCw, Eye,
// } from "lucide-react";

// const ITEMS_PER_PAGE = 10;

// // ── Circular Progress (stat cards) ──
// function CircularProgress({ pct, size = 48 }) {
//   const r = 18;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (pct / 100) * circ;
//   return (
//     <svg width={size} height={size} viewBox="0 0 44 44">
//       <circle cx="22" cy="22" r={r} fill="none" stroke="#ede9fe" strokeWidth="4" />
//       <circle
//         cx="22" cy="22" r={r} fill="none" stroke="#7c3aed" strokeWidth="4"
//         strokeDasharray={circ} strokeDashoffset={offset}
//         strokeLinecap="round" transform="rotate(-90 22 22)"
//       />
//     </svg>
//   );
// }

// export default function Courses() {
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [languages, setLanguages] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     category: "all",
//     level: "all",
//     language: "all",
//     certificate: "all",
//   });

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [courseToDelete, setCourseToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState("");
//   const [deleteError, setDeleteError] = useState("");
//   const [toastError, setToastError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);

//   // ── Fetch ──
//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
//       const data = await response.json();
//       if (data.success) {
//         const list = data.data;
//         setCourses(list);
//         setFilteredCourses(list);
//         // Build category + language lists
//         const catMap = new Map();
//         list.forEach((c) => {
//           if (c.category_details?.id) catMap.set(c.category_details.id, c.category_details);
//         });
//         setCategories([...catMap.values()]);
//         setLanguages([...new Set(list.map((c) => c.language).filter(Boolean))]);
//       } else {
//         setError("Failed to fetch courses");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCourses(); }, []);

//   // ── Filter + Sort ──
//   useEffect(() => {
//     let result = [...courses];

//     if (searchTerm) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter(
//         (c) =>
//           c.name?.toLowerCase().includes(q) ||
//           c.text?.toLowerCase().includes(q) ||
//           c.category_details?.name?.toLowerCase().includes(q)
//       );
//     }

//     if (filters.category !== "all") {
//       result = result.filter((c) => c.category_details?.id === parseInt(filters.category));
//     }
//     if (filters.level !== "all") {
//       result = result.filter((c) => c.level?.toLowerCase() === filters.level.toLowerCase());
//     }
//     if (filters.language !== "all") {
//       result = result.filter((c) => c.language?.toLowerCase() === filters.language.toLowerCase());
//     }
//     if (filters.certificate !== "all") {
//       result = result.filter((c) => {
//         const hasCert = c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";
//         return filters.certificate === "yes" ? hasCert : !hasCert;
//       });
//     }

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "id") { aVal = a.id || 0; bVal = b.id || 0; }
//       else if (sortConfig.key === "name") { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
//       else if (sortConfig.key === "students") { aVal = parseInt(a.students) || 0; bVal = parseInt(b.students) || 0; }
//       else if (sortConfig.key === "category") { aVal = a.category_details?.name?.toLowerCase() || ""; bVal = b.category_details?.name?.toLowerCase() || ""; }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     setFilteredCourses(result);
//     setCurrentPage(1);
//   }, [searchTerm, filters, sortConfig, courses]);

//   const handleSort = (key) => {
//     setSortConfig((cur) => ({ key, direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc" }));
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
//     return sortConfig.direction === "asc"
//       ? <SortAsc size={13} className="text-violet-500" />
//       : <SortDesc size={13} className="text-violet-500" />;
//   };

  
//   // ── Delete (optimistic) ──
//   const handleDeleteClick = (e, course) => {
//     e.stopPropagation();
//     setCourseToDelete(course);
//     setShowDeleteModal(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!courseToDelete) return;
//     const courseId = courseToDelete.id;
//     // Optimistic remove
//     setCourses((prev) => prev.filter((c) => c.id !== courseId));
//     setShowDeleteModal(false);
//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/course/${courseId}/`,
//         { method: "DELETE" }
//       );
//       if (!response.ok && response.status !== 204) {
//         await fetchCourses();
//         setToastError("Failed to delete course. Data restored.");
//         setTimeout(() => setToastError(""), 3000);
//       }
//     } catch {
//       await fetchCourses();
//       setToastError("Network error. Please try again.");
//       setTimeout(() => setToastError(""), 3000);
//     }
//   };

//   // ── Helpers ──
//   const getLevelStyles = (level) => {
//     switch (level?.toLowerCase()) {
//       case "beginner": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
//       case "intermediate": return "bg-amber-50 text-amber-700 border border-amber-200";
//       case "hard":
//       case "advanced": return "bg-red-50 text-red-700 border border-red-200";
//       default: return "bg-violet-50 text-violet-700 border border-violet-200";
//     }
//   };

//   const hasCert = (c) => c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";

//   const activeFiltersCount = [
//     filters.category !== "all",
//     filters.level !== "all",
//     filters.language !== "all",
//     filters.certificate !== "all",
//     sortConfig.key !== "id" || sortConfig.direction !== "desc",
//   ].filter(Boolean).length;

//   // ── Pagination ──
//   const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
//   const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
//   const paginatedCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

//   // ── Stat cards ──
//   const totalStudents = courses.reduce((acc, c) => acc + (parseInt(c.students) || 0), 0);
//   const certCount = courses.filter(hasCert).length;
  

//   // ── Loading ──
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
//           <p className="mt-4 text-slate-500 text-base font-medium">Loading courses…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
//           <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//             <X size={24} className="text-red-500" />
//           </div>
//           <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
//           <p className="text-slate-500 text-base mb-5">{error}</p>
//           <button onClick={() => window.location.reload()} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-base font-medium">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Toast error */}
//       {toastError && (
//         <div className="fixed top-5 right-5 z-[100] bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
//           <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
//           <p className="text-base text-red-600">{toastError}</p>
//           <button onClick={() => setToastError("")} className="ml-2 text-red-400 hover:text-red-600"><X size={13} /></button>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* ── Header ── */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             <BookOpen size={20} className="text-violet-600" />
//             <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
//             <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
//               {courses.length}
//             </span>
//           </div>
//           <p className="text-slate-500 text-base">Manage your course catalogue</p>
//         </div>

        
//         {/* ── Toolbar ── */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

//             {/* Search */}
//             <div className="relative flex-1 min-w-0">
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search by name, description or category…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* Filter toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-medium transition-all whitespace-nowrap ${
//                 showFilters || activeFiltersCount > 0
//                   ? "border-violet-400 bg-violet-50 text-violet-700"
//                   : "border-slate-200 text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">{activeFiltersCount}</span>
//               )}
//               <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
//             </button>

            

//             {/* Add Course */}
//             <button
//               onClick={() => navigate("/add-course")}
//               className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium whitespace-nowrap shadow-sm shadow-violet-200"
//             >
//               <Plus size={16} />
//               Add Course
//             </button>
//           </div>

//           {/* Expandable filters */}
//           {showFilters && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
//                 <select
//                   value={filters.category}
//                   onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Level</label>
//                 <select
//                   value={filters.level}
//                   onChange={(e) => setFilters({ ...filters, level: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
//                 >
//                   <option value="all">All Levels</option>
//                   <option value="beginner">Beginner</option>
//                   <option value="intermediate">Intermediate</option>
//                   <option value="hard">Advanced</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Language</label>
//                 <select
//                   value={filters.language}
//                   onChange={(e) => setFilters({ ...filters, language: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
//                 >
//                   <option value="all">All Languages</option>
//                   {languages.map((l) => (
//                     <option key={l} value={l}>{l}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Certificate</label>
//                 <select
//                   value={filters.certificate}
//                   onChange={(e) => setFilters({ ...filters, certificate: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
//                 >
//                   <option value="all">All</option>
//                   <option value="yes">With Certificate</option>
//                   <option value="no">Without Certificate</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Table / Empty state ── */}
//         {filteredCourses.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
//             <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <BookOpen size={28} className="text-slate-400" />
//             </div>
//             <h3 className="text-base font-semibold text-slate-800 mb-1">No courses found</h3>
//             <p className="text-slate-400 text-base mb-5">
//               {searchTerm || Object.values(filters).some((v) => v !== "all")
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first course."}
//             </p>
//             <button
//               onClick={() => navigate("/add-course")}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium"
//             >
//               <Plus size={15} /> Add Course
//             </button>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[800px]">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-10">
//                       #
//                     </th>
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
//                       onClick={() => handleSort("name")}
//                     >
//                       <span className="flex items-center gap-1">Course {getSortIcon("name")}</span>
//                     </th>
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
//                       onClick={() => handleSort("category")}
//                     >
//                       <span className="flex items-center gap-1">Category {getSortIcon("category")}</span>
//                     </th>
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
//                       Level
//                     </th>
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">
//                       Duration
//                     </th>
//                     <th
//                       className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
//                       onClick={() => handleSort("students")}
//                     >
//                       <span className="flex items-center gap-1">Students {getSortIcon("students")}</span>
//                     </th>
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">
//                       Language
//                     </th>
//                     <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
//                       Certificate
//                     </th>
//                     <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {paginatedCourses.map((course, index) => (
//                     <tr
//                       key={course.id}
//                       className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
//                       onClick={() => { setSelectedCourse(course); setShowViewModal(true); }}
//                     >
//                       {/* # */}
//                       <td className="px-5 py-4 text-base font-semibold text-slate-400">
//                         {indexOfFirstItem + index + 1}
//                       </td>

//                       {/* Course */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
//                             {course.image ? (
//                               <img
//                                 src={`https://codingcloud.pythonanywhere.com${course.image}`}
//                                 alt={course.name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/44?text=C"; }}
//                               />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center">
//                                 <BookOpen size={16} className="text-slate-400" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-base font-semibold text-slate-800 line-clamp-1">{course.name}</p>
//                             <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
//                               {course.text?.slice(0, 55) || "No description"}
//                               {course.text?.length > 55 ? "…" : ""}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Category */}
//                       <td className="px-5 py-4 hidden md:table-cell">
//                         <span className="text-base text-slate-500 font-medium">
//                           {course.category_details?.name || "—"}
//                         </span>
//                       </td>

//                       {/* Level */}
//                       <td className="px-5 py-4 hidden lg:table-cell">
//                         {course.level ? (
//                           <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getLevelStyles(course.level)}`}>
//                             {course.level}
//                           </span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Duration */}
//                       <td className="px-5 py-4 hidden xl:table-cell">
//                         <span className="text-base text-slate-500">{course.duration || <span className="text-slate-300">—</span>}</span>
//                       </td>

//                       {/* Students */}
//                       <td className="px-5 py-4 hidden md:table-cell">
//                         <div className="flex items-center gap-1.5 text-base text-slate-500">
//                           <Users size={13} className="text-slate-400" />
//                           {course.students || <span className="text-slate-300">—</span>}
//                         </div>
//                       </td>

//                       {/* Language */}
//                       <td className="px-5 py-4 hidden xl:table-cell">
//                         <span className="text-base text-slate-500">{course.language || <span className="text-slate-300">—</span>}</span>
//                       </td>

//                       {/* Certificate */}
//                       <td className="px-5 py-4 hidden lg:table-cell">
//                         {hasCert(course) ? (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
//                             <Award size={10} /> Yes
//                           </span>
//                         ) : (
//                           <span className="text-slate-300 text-xs">No</span>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex items-center justify-end gap-1.5">
//                           <button
//                             onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); setShowViewModal(true); }}
//                             className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
//                             title="View"
//                           >
//                             <Eye size={15} />
//                           </button>
//                           <button
//                             onClick={(e) => { e.stopPropagation(); navigate(`/edit-course/${course.id}`); }}
//                             className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
//                             title="Edit"
//                           >
//                             <Edit size={15} />
//                           </button>
//                           <button
//                             onClick={(e) => handleDeleteClick(e, course)}
//                             className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
//                             title="Delete"
//                           >
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <span className="text-xs text-slate-400 font-medium">
//                 Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredCourses.length)}</span> of <span className="text-slate-700 font-semibold">{filteredCourses.length}</span> courses
//               </span>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
//                 >
//                   ← Prev
//                 </button>
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                     let page = i + 1;
//                     if (totalPages > 5) {
//                       if (currentPage <= 3) page = i + 1;
//                       else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
//                       else page = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
//                           currentPage === page ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
//                 >
//                   Next →
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Course Detail Modal ── */}
//       {showViewModal && selectedCourse && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setShowViewModal(false)}
//           />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden max-h-[92vh] flex flex-col">

//             <button
//               onClick={() => setShowViewModal(false)}
//               className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
//             >
//               <X size={16} className="text-slate-600" />
//             </button>

//             {/* Banner */}
//             <div className="relative h-56 bg-slate-900 flex-shrink-0 overflow-hidden">
//               <img
//                 src={`https://codingcloud.pythonanywhere.com${selectedCourse.banner_img || selectedCourse.image}`}
//                 alt={selectedCourse.name}
//                 className="w-full h-full object-cover opacity-75"
//                 onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x224?text=Course"; }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
//               <div className="absolute bottom-0 left-0 right-0 p-6">
//                 <h2 className="text-white text-2xl font-bold mb-2">{selectedCourse.name}</h2>
//                 <div className="flex flex-wrap gap-2">
//                   <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
//                     {selectedCourse.category_details?.name}
//                   </span>
//                   {selectedCourse.level && (
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelStyles(selectedCourse.level)}`}>
//                       {selectedCourse.level}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 overflow-y-auto flex-1">
//               {/* Stat cards */}
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
//                 {[
//                   { icon: Clock, label: "Duration", val: selectedCourse.duration },
//                   { icon: BookOpen, label: "Lectures", val: selectedCourse.lecture },
//                   { icon: Users, label: "Students", val: selectedCourse.students },
//                   { icon: Globe, label: "Language", val: selectedCourse.language },
//                 ].filter((s) => s.val).map((s, i) => (
//                   <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
//                     <s.icon size={16} className="text-violet-600 mx-auto mb-1" />
//                     <p className="text-xs text-slate-400 mb-0.5">{s.label}</p>
//                     <p className="text-base font-semibold text-slate-800">{s.val}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Description */}
//               <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">About this course</p>
//                 <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">
//                   {selectedCourse.text || "No description available."}
//                 </p>
//               </div>

//               {/* Keywords */}
//               {selectedCourse.keywords && (
//                 <div className="mb-4">
//                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Keywords</p>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedCourse.keywords.split(",").map((k, i) => (
//                       <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{k.trim()}</span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Certificate badge */}
//               {hasCert(selectedCourse) && (
//                 <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
//                   <Award size={16} className="text-amber-600" />
//                   <span className="text-base font-semibold text-amber-700">Certificate of Completion included</span>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3 flex-shrink-0">
//               {selectedCourse.pdf_file && (
//                 <a
//                   href={`https://codingcloud.pythonanywhere.com${selectedCourse.pdf_file}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
//                 >
//                   <Download size={14} /> Syllabus
//                 </a>
//               )}
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => { setShowViewModal(false); navigate(`/edit-course/${selectedCourse.id}`); }}
//                 className="px-5 py-2 bg-violet-600 text-white text-base font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
//               >
//                 <Edit size={14} /> Edit Course
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {showDeleteModal && courseToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
//             onClick={() => !deleteLoading && setShowDeleteModal(false)}
//           />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
//             <button
//               onClick={() => !deleteLoading && setShowDeleteModal(false)}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
//             >
//               <X size={16} />
//             </button>

//             <div className="flex items-start gap-4">
//               <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
//                 <AlertCircle size={22} className="text-red-500" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Course</h3>
//                 <p className="text-base text-slate-500">
//                   Are you sure you want to delete <span className="font-semibold text-slate-700">"{courseToDelete.name}"</span>? This action cannot be undone.
//                 </p>
//               </div>
//             </div>

//             {deleteSuccess && (
//               <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
//                 <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
//                 <p className="text-base text-emerald-700">{deleteSuccess}</p>
//               </div>
//             )}
//             {deleteError && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
//                 <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
//                 <p className="text-base text-red-600">{deleteError}</p>
//               </div>
//             )}

//             <div className="mt-6 flex gap-3 justify-end">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 disabled={deleteLoading}
//                 className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={deleteLoading}
//                 className="px-5 py-2 bg-red-600 text-white text-base font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//               >
//                 {deleteLoading ? (
//                   <>
//                     <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Deleting…
//                   </>
//                 ) : (
//                   <><Trash2 size={14} /> Delete</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Clock, Users, Globe, Award, Search,
  X, Download, Edit, Trash2, AlertCircle, CheckCircle,
  Plus, SortAsc, SortDesc, Eye, ChevronLeft, ChevronRight, Filter, ChevronDown,
} from "lucide-react";
import Toasts from "./Toasts";

const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Keep filter panel for courses (category/level/language/certificate) but remove date filter
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    language: "all",
    certificate: "all",
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toastError, setToastError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
      const data = await response.json();
      if (data.success) {
        const list = data.data;
        setCourses(list);
        const catMap = new Map();
        list.forEach((c) => { if (c.category_details?.id) catMap.set(c.category_details.id, c.category_details); });
        setCategories([...catMap.values()]);
        setLanguages([...new Set(list.map((c) => c.language).filter(Boolean))]);
        setError(null);
      } else {
        setError("Failed to fetch courses");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  // ── Derived (no state = no jerk on refresh) ──
  const filteredCourses = (() => {
    let result = [...courses];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          stripHtml(c.text).toLowerCase().includes(q) ||
          c.category_details?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all")
      result = result.filter((c) => c.category_details?.id === parseInt(filters.category));
    if (filters.level !== "all")
      result = result.filter((c) => c.level?.toLowerCase() === filters.level.toLowerCase());
    if (filters.language !== "all")
      result = result.filter((c) => c.language?.toLowerCase() === filters.language.toLowerCase());
    if (filters.certificate !== "all") {
      result = result.filter((c) => {
        const has = c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";
        return filters.certificate === "yes" ? has : !has;
      });
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id")        { aVal = a.id || 0; bVal = b.id || 0; }
      else if (sortConfig.key === "name") { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
      else if (sortConfig.key === "students") { aVal = parseInt(a.students) || 0; bVal = parseInt(b.students) || 0; }
      else if (sortConfig.key === "category") { aVal = a.category_details?.name?.toLowerCase() || ""; bVal = b.category_details?.name?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  })();

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  // Reset to page 1 on dependency change
  const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });
  useEffect(() => {
    const p = prevDeps.current;
    if (
      p.searchTerm !== searchTerm ||
      p.sortConfig !== sortConfig ||
      p.itemsPerPage !== itemsPerPage ||
      p.filters !== filters
    ) {
      setCurrentPage(1);
      prevDeps.current = { searchTerm, sortConfig, itemsPerPage, filters };
    }
  }, [searchTerm, sortConfig, itemsPerPage, filters]);

  const handleSort = (key) => {
    setSortConfig((c) => ({ key, direction: c.key === key && c.direction === "asc" ? "desc" : "asc" }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
      : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
  };

  const handleDeleteClick = (e, course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    const courseId = courseToDelete.id;
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setShowDeleteModal(false);
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/course/${courseId}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setToast({ show: true, message: "Course deleted successfully!", type: "error" });
      } else {
        await fetchCourses();
        setToastError("Failed to delete course. Data restored.");
        setTimeout(() => setToastError(""), 3000);
      }
    } catch {
      await fetchCourses();
      setToastError("Network error. Please try again.");
      setTimeout(() => setToastError(""), 3000);
    }
  };

  const getLevelStyles = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":     return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
      case "intermediate": return { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" };
      case "hard":
      case "advanced":     return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
      default:             return { background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe" };
    }
  };

  const hasCert = (c) => c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";

  const activeFiltersCount = [
    filters.category !== "all",
    filters.level !== "all",
    filters.language !== "all",
    filters.certificate !== "all",
  ].filter(Boolean).length;

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading courses…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", padding: 32, maxWidth: 360, width: "100%", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <X size={22} color="#ef4444" />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>Something went wrong</h3>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .crs-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .crs-row { transition: background 0.13s; cursor: pointer; }
        .crs-row:hover { background: #fafafa; }
        .crs-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .crs-action-btn.view:hover { background: #f1f5f9; color: #475569; }
        .crs-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
        .crs-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }
        .crs-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .crs-th-btn:hover { color: #475569; }
        .crs-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .crs-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .crs-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .crs-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .crs-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .crs-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .crs-search::placeholder { color: #cbd5e1; }
        .crs-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .crs-select:focus { border-color: #7c3aed; }
        .crs-filter-select { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .crs-filter-select:focus { border-color: #7c3aed; }
        .crs-add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(124,58,237,0.28); transition: opacity 0.15s; font-family: inherit; flex-shrink: 0; }
        .crs-add-btn:hover { opacity: 0.9; }
        .crs-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; flex-shrink: 0; }
        .crs-filter-btn.active { border-color: #a78bfa; background: #f5f3ff; color: #6d28d9; }
        .crs-filter-btn:hover { background: #f8fafc; }
      `}</style>

      {toast.show && <Toasts message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      {toastError && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          <AlertCircle size={15} color="#ef4444" />
          <p style={{ fontSize: 14, color: "#dc2626", margin: 0 }}>{toastError}</p>
          <button onClick={() => setToastError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", marginLeft: 4, display: "flex" }}><X size={13} /></button>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
              <BookOpen size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Courses</h1>
            <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{courses.length}</span>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage your course catalogue</p>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
              <input
                className="crs-search"
                type="text"
                placeholder="Search by name, description or category…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Items per page */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>Show</span>
              <select className="crs-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
            </div>

            {/* Filters toggle */}
            <button
              className={`crs-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span style={{ padding: "1px 7px", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 99 }}>{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {/* Add Course */}
            <button className="crs-add-btn" onClick={() => navigate("/add-course")}>
              <Plus size={16} /> Add Course
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
              {[
                { label: "Category", key: "category", options: [{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))] },
                { label: "Level", key: "level", options: [{ value: "all", label: "All Levels" }, { value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "Advanced", label: "Advanced" }] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>{label}</label>
                  <select
                    className="crs-filter-select"
                    value={filters[key]}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  >
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Gap ── */}
        <div style={{ height: 20 }} />

        {/* ── Table / Empty ── */}
        {filteredCourses.length === 0 ? (
          <div className="crs-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <BookOpen size={27} color="#cbd5e1" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No courses found</h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || Object.values(filters).some((v) => v !== "all")
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first course."}
            </p>
            <button
              onClick={() => navigate("/add-course")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
            >
              <Plus size={15} /> Add Course
            </button>
          </div>
        ) : (
          <div className="crs-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
                    <th style={{ padding: "14px 18px", textAlign: "left", width: 52 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>#</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="crs-th-btn" onClick={() => handleSort("name")}>Course <SortIcon col="name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }} className="hidden md:table-cell">
                      <button className="crs-th-btn" onClick={() => handleSort("category")}>Category <SortIcon col="category" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Level</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="crs-th-btn" onClick={() => handleSort("students")}>Students <SortIcon col="students" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Cert</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((course, index) => {
                    const plainText = stripHtml(course.text);
                    return (
                      <tr
                        key={course.id}
                        className="crs-row"
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                        onClick={() => { setSelectedCourse(course); setShowViewModal(true); }}
                      >
                        {/* # */}
                        <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Course */}
                        <td style={{ padding: "15px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 11, overflow: "hidden", border: "1px solid #e2e8f0", background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {course.image ? (
                                <img src={`https://codingcloud.pythonanywhere.com${course.image}`} alt={course.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = "https://via.placeholder.com/44?text=C"; }} />
                              ) : (
                                <BookOpen size={16} color="#cbd5e1" />
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.name}</p>
                              <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {plainText.slice(0, 55) || "No description"}{plainText.length > 55 ? "…" : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: "15px 18px" }}>
                          <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{course.category_details?.name || "—"}</span>
                        </td>

                        {/* Level */}
                        <td style={{ padding: "15px 18px" }}>
                          {course.level ? (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 99, fontSize: 12.5, fontWeight: 600, ...getLevelStyles(course.level) }}>
                              {course.level}
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>—</span>
                          )}
                        </td>

                        {/* Students */}
                        <td style={{ padding: "15px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: "#64748b" }}>
                            <Users size={13} color="#94a3b8" />
                            {course.students || <span style={{ color: "#cbd5e1" }}>—</span>}
                          </div>
                        </td>

                        {/* Certificate */}
                        <td style={{ padding: "15px 18px" }}>
                          {hasCert(course) ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a", borderRadius: 99, fontSize: 12.5, fontWeight: 600 }}>
                              <Award size={10} /> Yes
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 13 }}>No</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                            <button className="crs-action-btn view" onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); setShowViewModal(true); }} title="View"><Eye size={15} /></button>
                            <button className="crs-action-btn edit" onClick={(e) => { e.stopPropagation(); navigate(`/edit-course/${course.id}`); }} title="Edit"><Edit size={15} /></button>
                            <button className="crs-action-btn del" onClick={(e) => handleDeleteClick(e, course)} title="Delete"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
                Showing{" "}
                <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredCourses.length)}</strong>
                {" "}of{" "}
                <strong style={{ color: "#475569" }}>{filteredCourses.length}</strong> courses
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button className="crs-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}><ChevronLeft size={15} /></button>
                {getPageNumbers().map((page) => (
                  <button key={page} className={`crs-page-btn${safePage === page ? " active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className="crs-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Modal ── */}
      {showViewModal && selectedCourse && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowViewModal(false)} />
          <div className="crs-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", maxWidth: 680, width: "100%", zIndex: 10, overflow: "hidden", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

            <button onClick={() => setShowViewModal(false)} style={{ position: "absolute", top: 14, right: 14, zIndex: 10, width: 34, height: 34, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <X size={15} color="#475569" />
            </button>

            {/* Banner */}
            <div style={{ position: "relative", height: 220, background: "#0f172a", flexShrink: 0, overflow: "hidden" }}>
              <img
                src={`https://codingcloud.pythonanywhere.com${selectedCourse.banner_img || selectedCourse.image}`}
                alt={selectedCourse.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x224?text=Course"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{selectedCourse.name}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ padding: "4px 12px", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", borderRadius: 99, fontSize: 12.5, color: "#fff", fontWeight: 500 }}>
                    {selectedCourse.category_details?.name}
                  </span>
                  {selectedCourse.level && (
                    <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12.5, fontWeight: 600, ...getLevelStyles(selectedCourse.level) }}>
                      {selectedCourse.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr))", gap: 12, marginBottom: 20 }}>
                {[
                  { icon: Clock, label: "Duration", val: selectedCourse.duration },
                  { icon: BookOpen, label: "Lectures", val: selectedCourse.lecture },
                  { icon: Users, label: "Students", val: selectedCourse.students },
                  { icon: Globe, label: "Language", val: selectedCourse.language },
                ].filter((s) => s.val).map((s, i) => (
                  <div key={i} style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                    <s.icon size={16} color="#7c3aed" style={{ margin: "0 auto 4px" }} />
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 3px", fontWeight: 500 }}>{s.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 10px" }}>About this course</p>
                <div style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65 }}>
                  {selectedCourse.text
                    ? <div dangerouslySetInnerHTML={{ __html: selectedCourse.text }} />
                    : <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0 }}>No description available.</p>}
                </div>
              </div>

              {/* Keywords */}
              {selectedCourse.keywords && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 8px" }}>Keywords</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedCourse.keywords.split(",").map((k, i) => (
                      <span key={i} style={{ padding: "4px 10px", background: "#f1f5f9", color: "#64748b", fontSize: 13, borderRadius: 99 }}>{k.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate */}
              {hasCert(selectedCourse) && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px" }}>
                  <Award size={16} color="#b45309" />
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: "#b45309" }}>Certificate of Completion included</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
              {selectedCourse.pdf_file && (
                <a href={`https://codingcloud.pythonanywhere.com${selectedCourse.pdf_file}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, textDecoration: "none", background: "#fff" }}>
                  <Download size={14} /> Syllabus
                </a>
              )}
              <button onClick={() => setShowViewModal(false)}
                style={{ padding: "9px 18px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Close
              </button>
              <button onClick={() => { setShowViewModal(false); navigate(`/edit-course/${selectedCourse.id}`); }}
                style={{ padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" }}>
                <Edit size={14} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && courseToDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }} onClick={() => !deleteLoading && setShowDeleteModal(false)} />
          <div className="crs-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 420, width: "100%", padding: 26, zIndex: 10 }}>
            <button onClick={() => !deleteLoading && setShowDeleteModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}>
              <X size={15} />
            </button>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 46, height: 46, background: "#fef2f2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 7px" }}>Delete Course</h3>
                <p style={{ fontSize: 14.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                  Are you sure you want to delete <strong style={{ color: "#1e293b" }}>"{courseToDelete.name}"</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteError && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={14} color="#ef4444" />
                <p style={{ fontSize: 13.5, color: "#dc2626", margin: 0 }}>{deleteError}</p>
              </div>
            )}
            <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}
                style={{ padding: "10px 20px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleteLoading}
                style={{ padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: deleteLoading ? 0.7 : 1, fontFamily: "inherit" }}>
                {deleteLoading ? (
                  <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Deleting…</>
                ) : (
                  <><Trash2 size={14} /> Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
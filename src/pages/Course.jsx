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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Clock, Users, Globe, Award, Search, Filter, X,
  Download, Edit, Trash2, AlertCircle, CheckCircle, ChevronDown,
  Plus, ArrowUpRight, SortAsc, SortDesc, RefreshCw, Eye,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Helper to strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// ── Circular Progress (stat cards) ──
function CircularProgress({ pct, size = 48 }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#ede9fe" strokeWidth="4" />
      <circle
        cx="22" cy="22" r={r} fill="none" stroke="#7c3aed" strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 22 22)"
      />
    </svg>
  );
}

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
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
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [toastError, setToastError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch ──
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
      const data = await response.json();
      if (data.success) {
        const list = data.data;
        setCourses(list);
        setFilteredCourses(list);
        // Build category + language lists
        const catMap = new Map();
        list.forEach((c) => {
          if (c.category_details?.id) catMap.set(c.category_details.id, c.category_details);
        });
        setCategories([...catMap.values()]);
        setLanguages([...new Set(list.map((c) => c.language).filter(Boolean))]);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  // ── Filter + Sort ──
  useEffect(() => {
    let result = [...courses];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          stripHtml(c.text).toLowerCase().includes(q) || // search in stripped text
          c.category_details?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      result = result.filter((c) => c.category_details?.id === parseInt(filters.category));
    }
    if (filters.level !== "all") {
      result = result.filter((c) => c.level?.toLowerCase() === filters.level.toLowerCase());
    }
    if (filters.language !== "all") {
      result = result.filter((c) => c.language?.toLowerCase() === filters.language.toLowerCase());
    }
    if (filters.certificate !== "all") {
      result = result.filter((c) => {
        const hasCert = c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";
        return filters.certificate === "yes" ? hasCert : !hasCert;
      });
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") { aVal = a.id || 0; bVal = b.id || 0; }
      else if (sortConfig.key === "name") { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
      else if (sortConfig.key === "students") { aVal = parseInt(a.students) || 0; bVal = parseInt(b.students) || 0; }
      else if (sortConfig.key === "category") { aVal = a.category_details?.name?.toLowerCase() || ""; bVal = b.category_details?.name?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, courses]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({ key, direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc" }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} className="text-violet-500" />
      : <SortDesc size={13} className="text-violet-500" />;
  };

  
  // ── Delete (optimistic) ──
  const handleDeleteClick = (e, course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    const courseId = courseToDelete.id;
    // Optimistic remove
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setShowDeleteModal(false);
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/course/${courseId}/`,
        { method: "DELETE" }
      );
      if (!response.ok && response.status !== 204) {
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

  // ── Helpers ──
  const getLevelStyles = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "intermediate": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "hard":
      case "advanced": return "bg-red-50 text-red-700 border border-red-200";
      default: return "bg-violet-50 text-violet-700 border border-violet-200";
    }
  };

  const hasCert = (c) => c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";

  const activeFiltersCount = [
    filters.category !== "all",
    filters.level !== "all",
    filters.language !== "all",
    filters.certificate !== "all",
    sortConfig.key !== "id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  // ── Pagination ──
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  // ── Stat cards ──
  const totalStudents = courses.reduce((acc, c) => acc + (parseInt(c.students) || 0), 0);
  const certCount = courses.filter(hasCert).length;
  

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-base font-medium">Loading courses…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
          <p className="text-slate-500 text-base mb-5">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-base font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast error */}
      {toastError && (
        <div className="fixed top-5 right-5 z-[100] bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-base text-red-600">{toastError}</p>
          <button onClick={() => setToastError("")} className="ml-2 text-red-400 hover:text-red-600"><X size={13} /></button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {courses.length}
            </span>
          </div>
          <p className="text-slate-500 text-base">Manage your course catalogue</p>
        </div>

        
        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, description or category…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-medium transition-all whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Add Course */}
            <button
              onClick={() => navigate("/add-course")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium whitespace-nowrap shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Add Course
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="hard">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Languages</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Certificate</label>
                <select
                  value={filters.certificate}
                  onChange={(e) => setFilters({ ...filters, certificate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All</option>
                  <option value="yes">With Certificate</option>
                  <option value="no">Without Certificate</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Table / Empty state ── */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-400 text-base mb-5">
              {searchTerm || Object.values(filters).some((v) => v !== "all")
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first course."}
            </p>
            <button
              onClick={() => navigate("/add-course")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium"
            >
              <Plus size={15} /> Add Course
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-10">
                      #
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("name")}
                    >
                      <span className="flex items-center gap-1">Course {getSortIcon("name")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
                      onClick={() => handleSort("category")}
                    >
                      <span className="flex items-center gap-1">Category {getSortIcon("category")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                      Level
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">
                      Duration
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
                      onClick={() => handleSort("students")}
                    >
                      <span className="flex items-center gap-1">Students {getSortIcon("students")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">
                      Language
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                      Certificate
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCourses.map((course, index) => {
                    const plainText = stripHtml(course.text); // stripped for preview
                    return (
                      <tr
                        key={course.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => { setSelectedCourse(course); setShowViewModal(true); }}
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-base font-semibold text-slate-400">
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Course */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                              {course.image ? (
                                <img
                                  src={`https://codingcloud.pythonanywhere.com${course.image}`}
                                  alt={course.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/44?text=C"; }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen size={16} className="text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-base font-semibold text-slate-800 line-clamp-1">{course.name}</p>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {plainText.slice(0, 55) || "No description"}
                                {plainText.length > 55 ? "…" : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-base text-slate-500 font-medium">
                            {course.category_details?.name || "—"}
                          </span>
                        </td>

                        {/* Level */}
                        <td className="px-5 py-4 hidden lg:table-cell">
                          {course.level ? (
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getLevelStyles(course.level)}`}>
                              {course.level}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="px-5 py-4 hidden xl:table-cell">
                          <span className="text-base text-slate-500">{course.duration || <span className="text-slate-300">—</span>}</span>
                        </td>

                        {/* Students */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-base text-slate-500">
                            <Users size={13} className="text-slate-400" />
                            {course.students || <span className="text-slate-300">—</span>}
                          </div>
                        </td>

                        {/* Language */}
                        <td className="px-5 py-4 hidden xl:table-cell">
                          <span className="text-base text-slate-500">{course.language || <span className="text-slate-300">—</span>}</span>
                        </td>

                        {/* Certificate */}
                        <td className="px-5 py-4 hidden lg:table-cell">
                          {hasCert(course) ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
                              <Award size={10} /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">No</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); setShowViewModal(true); }}
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/edit-course/${course.id}`); }}
                              className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, course)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredCourses.length)}</span> of <span className="text-slate-700 font-semibold">{filteredCourses.length}</span> courses
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage <= 3) page = i + 1;
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                      else page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === page ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Course Detail Modal (with HTML content) ── */}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden max-h-[92vh] flex flex-col">

            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X size={16} className="text-slate-600" />
            </button>

            {/* Banner */}
            <div className="relative h-56 bg-slate-900 flex-shrink-0 overflow-hidden">
              <img
                src={`https://codingcloud.pythonanywhere.com${selectedCourse.banner_img || selectedCourse.image}`}
                alt={selectedCourse.name}
                className="w-full h-full object-cover opacity-75"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x224?text=Course"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-white text-2xl font-bold mb-2">{selectedCourse.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    {selectedCourse.category_details?.name}
                  </span>
                  {selectedCourse.level && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelStyles(selectedCourse.level)}`}>
                      {selectedCourse.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { icon: Clock, label: "Duration", val: selectedCourse.duration },
                  { icon: BookOpen, label: "Lectures", val: selectedCourse.lecture },
                  { icon: Users, label: "Students", val: selectedCourse.students },
                  { icon: Globe, label: "Language", val: selectedCourse.language },
                ].filter((s) => s.val).map((s, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <s.icon size={16} className="text-violet-600 mx-auto mb-1" />
                    <p className="text-xs text-slate-400 mb-0.5">{s.label}</p>
                    <p className="text-base font-semibold text-slate-800">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Description - Rendered as HTML with proper styling */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">About this course</p>
                <div className="prose prose-sm max-w-none text-slate-600">
                  {selectedCourse.text ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedCourse.text }} />
                  ) : (
                    <p className="text-slate-400 italic">No description available.</p>
                  )}
                </div>
              </div>

              {/* Keywords */}
              {selectedCourse.keywords && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.keywords.split(",").map((k, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{k.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate badge */}
              {hasCert(selectedCourse) && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                  <Award size={16} className="text-amber-600" />
                  <span className="text-base font-semibold text-amber-700">Certificate of Completion included</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3 flex-shrink-0">
              {selectedCourse.pdf_file && (
                <a
                  href={`https://codingcloud.pythonanywhere.com${selectedCourse.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <Download size={14} /> Syllabus
                </a>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowViewModal(false); navigate(`/edit-course/${selectedCourse.id}`); }}
                className="px-5 py-2 bg-violet-600 text-white text-base font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
              >
                <Edit size={14} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
            <button
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Course</h3>
                <p className="text-base text-slate-500">
                  Are you sure you want to delete <span className="font-semibold text-slate-700">"{courseToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                <p className="text-base text-emerald-700">{deleteSuccess}</p>
              </div>
            )}
            {deleteError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-base text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 text-white text-base font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting…
                  </>
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
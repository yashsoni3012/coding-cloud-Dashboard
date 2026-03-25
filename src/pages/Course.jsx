// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen, Clock, Users, Globe, Award, Search,
//   X, Download, Edit, Trash2, AlertCircle, CheckCircle,
//   Plus, SortAsc, SortDesc, Eye, ChevronLeft, ChevronRight, Filter, ChevronDown,
// } from "lucide-react";
// import Toasts from "./Toasts";

// const stripHtml = (html) => {
//   if (!html) return "";
//   const tmp = document.createElement("div");
//   tmp.innerHTML = html;
//   return tmp.textContent || tmp.innerText || "";
// };

// export default function Courses() {
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [languages, setLanguages] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Keep filter panel for courses (category/level/language/certificate) but remove date filter
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
//   const [deleteError, setDeleteError] = useState("");
//   const [toastError, setToastError] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   useEffect(() => {
//   const catMap = new Map();

//   courses.forEach((c) => {
//     if (c.category_details?.id) {
//       catMap.set(c.category_details.id, c.category_details);
//     }
//   });

//   setCategories([...catMap.values()]);
// }, [courses]);
//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("https://codingcloudapi.codingcloud.co.in/course/");
//       const data = await response.json();
//       if (data.success) {
//         const list = data.data;
//         setCourses(list);

//         setLanguages([...new Set(list.map((c) => c.language).filter(Boolean))]);
//         setError(null);
//       } else {
//         setError("Failed to fetch courses");
//       }
//     } catch {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCourses(); }, []);

//   // ── Derived (no state = no jerk on refresh) ──
//   const filteredCourses = (() => {
//     let result = [...courses];

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter(
//         (c) =>
//           c.name?.toLowerCase().includes(q) ||
//           stripHtml(c.text).toLowerCase().includes(q) ||
//           c.category_details?.name?.toLowerCase().includes(q)
//       );
//     }

//     if (filters.category !== "all")
//       result = result.filter((c) => c.category_details?.id === parseInt(filters.category));
//     if (filters.level !== "all")
//       result = result.filter((c) => c.level?.toLowerCase() === filters.level.toLowerCase());
//     if (filters.language !== "all")
//       result = result.filter((c) => c.language?.toLowerCase() === filters.language.toLowerCase());
//     if (filters.certificate !== "all") {
//       result = result.filter((c) => {
//         const has = c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";
//         return filters.certificate === "yes" ? has : !has;
//       });
//     }

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "id")        { aVal = a.id || 0; bVal = b.id || 0; }
//       else if (sortConfig.key === "name") { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
//       else if (sortConfig.key === "students") { aVal = parseInt(a.students) || 0; bVal = parseInt(b.students) || 0; }
//       else if (sortConfig.key === "category") { aVal = a.category_details?.name?.toLowerCase() || ""; bVal = b.category_details?.name?.toLowerCase() || ""; }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   })();

//   const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedCourses = filteredCourses.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

//   // Reset to page 1 on dependency change
//   const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });
//   useEffect(() => {
//     const p = prevDeps.current;
//     if (
//       p.searchTerm !== searchTerm ||
//       p.sortConfig !== sortConfig ||
//       p.itemsPerPage !== itemsPerPage ||
//       p.filters !== filters
//     ) {
//       setCurrentPage(1);
//       prevDeps.current = { searchTerm, sortConfig, itemsPerPage, filters };
//     }
//   }, [searchTerm, sortConfig, itemsPerPage, filters]);

//   const handleSort = (key) => {
//     setSortConfig((c) => ({ key, direction: c.key === key && c.direction === "asc" ? "desc" : "asc" }));
//   };

//   const SortIcon = ({ col }) => {
//     if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
//     return sortConfig.direction === "asc"
//       ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
//       : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
//   };

//   const handleDeleteClick = (e, course) => {
//     e.stopPropagation();
//     setCourseToDelete(course);
//     setShowDeleteModal(true);
//     setDeleteError("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!courseToDelete) return;
//     const courseId = courseToDelete.id;
//     setCourses((prev) => prev.filter((c) => c.id !== courseId));
//     setShowDeleteModal(false);
//     try {
//       const response = await fetch(
//         `https://codingcloudapi.codingcloud.co.in/course/${courseId}/`,
//         { method: "DELETE" }
//       );
//       if (response.ok || response.status === 204) {
//   setToast({
//     show: true,
//     message: "Course deleted successfully!",
//     type: "danger", // red notification
//   });
// } else {
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

//   const getLevelStyles = (level) => {
//     switch (level?.toLowerCase()) {
//       case "beginner":     return { background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
//       case "intermediate": return { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" };
//       case "hard":
//       case "advanced":     return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
//       default:             return { background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe" };
//     }
//   };

//   const hasCert = (c) => c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";

//   const activeFiltersCount = [
//     filters.category !== "all",
//     filters.level !== "all",
//     filters.language !== "all",
//     filters.certificate !== "all",
//   ].filter(Boolean).length;

//   const getPageNumbers = () => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (safePage <= 3) return [1, 2, 3, 4, 5];
//     if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//     return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
//   };

//   if (loading) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//           <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading courses…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//         <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", padding: 32, maxWidth: 360, width: "100%", textAlign: "center" }}>
//           <div style={{ width: 56, height: 56, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//             <X size={22} color="#ef4444" />
//           </div>
//           <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>Something went wrong</h3>
//           <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>{error}</p>
//           <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         * { box-sizing: border-box; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         .crs-animate { animation: fadeSlideIn 0.22s ease forwards; }
//         .crs-row { transition: background 0.13s; cursor: pointer; }
//         .crs-row:hover { background: #fafafa; }
//         .crs-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
//         .crs-action-btn.view:hover { background: #f1f5f9; color: #475569; }
//         .crs-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
//         .crs-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }
//         .crs-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
//         .crs-th-btn:hover { color: #475569; }
//         .crs-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
//         .crs-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .crs-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .crs-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//         .crs-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
//         .crs-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .crs-search::placeholder { color: #cbd5e1; }
//         .crs-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .crs-select:focus { border-color: #7c3aed; }
//         .crs-filter-select { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .crs-filter-select:focus { border-color: #7c3aed; }
//         .crs-add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(124,58,237,0.28); transition: opacity 0.15s; font-family: inherit; flex-shrink: 0; }
//         .crs-add-btn:hover { opacity: 0.9; }
//         .crs-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; flex-shrink: 0; }
//         .crs-filter-btn.active { border-color: #a78bfa; background: #f5f3ff; color: #6d28d9; }
//         .crs-filter-btn:hover { background: #f8fafc; }
//       `}</style>

//       {toast.show && <Toasts message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

//       {toastError && (
//         <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
//           <AlertCircle size={15} color="#ef4444" />
//           <p style={{ fontSize: 14, color: "#dc2626", margin: 0 }}>{toastError}</p>
//           <button onClick={() => setToastError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", marginLeft: 4, display: "flex" }}><X size={13} /></button>
//         </div>
//       )}

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>

//         {/* ── Header ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
//             <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
//               <BookOpen size={17} color="#fff" />
//             </div>
//             <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Courses</h1>
//             <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{courses.length}</span>
//           </div>
//           <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage your course catalogue</p>
//         </div>

//         {/* ── Toolbar ── */}
//         <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
//           <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

//             {/* Search */}
//             <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
//               <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
//               <input
//                 className="crs-search"
//                 type="text"
//                 placeholder="Search by name, description or category…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}>
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* Items per page */}
//             <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//               <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>Show</span>
//               <select className="crs-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//               <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
//             </div>

//             {/* Filters toggle */}
//             <button
//               className={`crs-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span style={{ padding: "1px 7px", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 99 }}>{activeFiltersCount}</span>
//               )}
//               <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
//             </button>

//             {/* Add Course */}
//             <button className="crs-add-btn" onClick={() => navigate("/add-course")}>
//               <Plus size={16} /> Add Course
//             </button>
//           </div>

//           {/* Expandable filter panel */}
//           {showFilters && (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
//               {[
//                 { label: "Category", key: "category", options: [{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))] },
//                 { label: "Level", key: "level", options: [{ value: "all", label: "All Levels" }, { value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "Advanced", label: "Advanced" }] },
//               ].map(({ label, key, options }) => (
//                 <div key={key}>
//                   <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>{label}</label>
//                   <select
//                     className="crs-filter-select"
//                     value={filters[key]}
//                     onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
//                   >
//                     {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//                   </select>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── Gap ── */}
//         <div style={{ height: 20 }} />

//         {/* ── Table / Empty ── */}
//         {filteredCourses.length === 0 ? (
//           <div className="crs-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
//             <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//               <BookOpen size={27} color="#cbd5e1" />
//             </div>
//             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No courses found</h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm || Object.values(filters).some((v) => v !== "all")
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first course."}
//             </p>
//             <button
//               onClick={() => navigate("/add-course")}
//               style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
//             >
//               <Plus size={15} /> Add Course
//             </button>
//           </div>
//         ) : (
//           <div className="crs-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
//                     <th style={{ padding: "14px 18px", textAlign: "left", width: 52 }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>#</span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button className="crs-th-btn" onClick={() => handleSort("name")}>Course <SortIcon col="name" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }} className="hidden md:table-cell">
//                       <button className="crs-th-btn" onClick={() => handleSort("category")}>Category <SortIcon col="category" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Level</span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button className="crs-th-btn" onClick={() => handleSort("students")}>Students <SortIcon col="students" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Cert</span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "right" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedCourses.map((course, index) => {
//                     const plainText = stripHtml(course.text);
//                     return (
//                       <tr
//                         key={course.id}
//                         className="crs-row"
//                         style={{ borderBottom: "1px solid #f1f5f9" }}
//                         onClick={() => { setSelectedCourse(course); setShowViewModal(true); }}
//                       >
//                         {/* # */}
//                         <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
//                           {indexOfFirstItem + index + 1}
//                         </td>

//                         {/* Course */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                             <div style={{ width: 44, height: 44, borderRadius: 11, overflow: "hidden", border: "1px solid #e2e8f0", background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                               {course.image ? (
//                                 <img src={`https://codingcloudapi.codingcloud.co.in/${course.image}`} alt={course.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = "https://via.placeholder.com/44?text=C"; }} />
//                               ) : (
//                                 <BookOpen size={16} color="#cbd5e1" />
//                               )}
//                             </div>
//                             <div style={{ minWidth: 0 }}>
//                               <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.name}</p>
//                               <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                                 {plainText.slice(0, 55) || "No description"}{plainText.length > 55 ? "…" : ""}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Category */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{course.category_details?.name || "—"}</span>
//                         </td>

//                         {/* Level */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {course.level ? (
//                             <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 99, fontSize: 12.5, fontWeight: 600, ...getLevelStyles(course.level) }}>
//                               {course.level}
//                             </span>
//                           ) : (
//                             <span style={{ color: "#cbd5e1" }}>—</span>
//                           )}
//                         </td>

//                         {/* Students */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: "#64748b" }}>
//                             <Users size={13} color="#94a3b8" />
//                             {course.students || <span style={{ color: "#cbd5e1" }}>—</span>}
//                           </div>
//                         </td>

//                         {/* Certificate */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {hasCert(course) ? (
//                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a", borderRadius: 99, fontSize: 12.5, fontWeight: 600 }}>
//                               <Award size={10} /> Yes
//                             </span>
//                           ) : (
//                             <span style={{ color: "#cbd5e1", fontSize: 13 }}>No</span>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
//                             <button className="crs-action-btn view" onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); setShowViewModal(true); }} title="View"><Eye size={15} /></button>
//                             <button className="crs-action-btn edit" onClick={(e) => { e.stopPropagation(); navigate(`/edit-course/${course.id}`); }} title="Edit"><Edit size={15} /></button>
//                             <button className="crs-action-btn del" onClick={(e) => handleDeleteClick(e, course)} title="Delete"><Trash2 size={15} /></button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* ── Pagination ── */}
//             <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
//               <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
//                 Showing{" "}
//                 <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredCourses.length)}</strong>
//                 {" "}of{" "}
//                 <strong style={{ color: "#475569" }}>{filteredCourses.length}</strong> courses
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button className="crs-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}><ChevronLeft size={15} /></button>
//                 {getPageNumbers().map((page) => (
//                   <button key={page} className={`crs-page-btn${safePage === page ? " active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
//                 ))}
//                 <button className="crs-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}><ChevronRight size={15} /></button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── View Modal ── */}
//       {showViewModal && selectedCourse && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowViewModal(false)} />
//           <div className="crs-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", maxWidth: 680, width: "100%", zIndex: 10, overflow: "hidden", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

//             <button onClick={() => setShowViewModal(false)} style={{ position: "absolute", top: 14, right: 14, zIndex: 10, width: 34, height: 34, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
//               <X size={15} color="#475569" />
//             </button>

//             {/* Banner */}
//             <div style={{ position: "relative", height: 220, background: "#0f172a", flexShrink: 0, overflow: "hidden" }}>
//               <img
//                 src={`https://codingcloudapi.codingcloud.co.in/${selectedCourse.banner_img || selectedCourse.image}`}
//                 alt={selectedCourse.name}
//                 style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
//                 onError={(e) => { e.target.src = "https://via.placeholder.com/800x224?text=Course"; }}
//               />
//               <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
//               <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
//                 <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{selectedCourse.name}</h2>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   <span style={{ padding: "4px 12px", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", borderRadius: 99, fontSize: 12.5, color: "#fff", fontWeight: 500 }}>
//                     {selectedCourse.category_details?.name}
//                   </span>
//                   {selectedCourse.level && (
//                     <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12.5, fontWeight: 600, ...getLevelStyles(selectedCourse.level) }}>
//                       {selectedCourse.level}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
//               {/* Stats */}
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr))", gap: 12, marginBottom: 20 }}>
//                 {[
//                   { icon: Clock, label: "Duration", val: selectedCourse.duration },
//                   { icon: BookOpen, label: "Lectures", val: selectedCourse.lecture },
//                   { icon: Users, label: "Students", val: selectedCourse.students },
//                   { icon: Globe, label: "Language", val: selectedCourse.language },
//                 ].filter((s) => s.val).map((s, i) => (
//                   <div key={i} style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
//                     <s.icon size={16} color="#7c3aed" style={{ margin: "0 auto 4px" }} />
//                     <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 3px", fontWeight: 500 }}>{s.label}</p>
//                     <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>{s.val}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Description */}
//               <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 16, marginBottom: 16 }}>
//                 <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 10px" }}>About this course</p>
//                 <div style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65 }}>
//                   {selectedCourse.text
//                     ? <div dangerouslySetInnerHTML={{ __html: selectedCourse.text }} />
//                     : <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0 }}>No description available.</p>}
//                 </div>
//               </div>

//               {/* Keywords */}
//               {selectedCourse.keywords && (
//                 <div style={{ marginBottom: 16 }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 8px" }}>Keywords</p>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//                     {selectedCourse.keywords.split(",").map((k, i) => (
//                       <span key={i} style={{ padding: "4px 10px", background: "#f1f5f9", color: "#64748b", fontSize: 13, borderRadius: 99 }}>{k.trim()}</span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Certificate */}
//               {hasCert(selectedCourse) && (
//                 <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px" }}>
//                   <Award size={16} color="#b45309" />
//                   <span style={{ fontSize: 14.5, fontWeight: 600, color: "#b45309" }}>Certificate of Completion included</span>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
//               {selectedCourse.pdf_file && (
//                 <a href={`https://codingcloudapi.codingcloud.co.in/${selectedCourse.pdf_file}`} target="_blank" rel="noopener noreferrer"
//                   style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, textDecoration: "none", background: "#fff" }}>
//                   <Download size={14} /> Syllabus
//                 </a>
//               )}
//               <button onClick={() => setShowViewModal(false)}
//                 style={{ padding: "9px 18px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
//                 Close
//               </button>
//               <button onClick={() => { setShowViewModal(false); navigate(`/edit-course/${selectedCourse.id}`); }}
//                 style={{ padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" }}>
//                 <Edit size={14} /> Edit Course
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {showDeleteModal && courseToDelete && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }} onClick={() => !deleteLoading && setShowDeleteModal(false)} />
//           <div className="crs-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 420, width: "100%", padding: 26, zIndex: 10 }}>
//             <button onClick={() => !deleteLoading && setShowDeleteModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}>
//               <X size={15} />
//             </button>
//             <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//               <div style={{ width: 46, height: 46, background: "#fef2f2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <AlertCircle size={22} color="#ef4444" />
//               </div>
//               <div>
//                 <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 7px" }}>Delete Course</h3>
//                 <p style={{ fontSize: 14.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
//                   Are you sure you want to delete <strong style={{ color: "#1e293b" }}>"{courseToDelete.name}"</strong>? This action cannot be undone.
//                 </p>
//               </div>
//             </div>
//             {deleteError && (
//               <div style={{ marginTop: 14, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
//                 <AlertCircle size={14} color="#ef4444" />
//                 <p style={{ fontSize: 13.5, color: "#dc2626", margin: 0 }}>{deleteError}</p>
//               </div>
//             )}
//             <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
//               <button onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}
//                 style={{ padding: "10px 20px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
//                 Cancel
//               </button>
//               <button onClick={handleDeleteConfirm} disabled={deleteLoading}
//                 style={{ padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: deleteLoading ? 0.7 : 1, fontFamily: "inherit" }}>
//                 {deleteLoading ? (
//                   <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Deleting…</>
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

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  Users,
  Globe,
  Award,
  Search,
  X,
  Download,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
  SortAsc,
  SortDesc,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import Toasts from "./Toasts";

const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const fetchCourses = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/course/",
  );
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch courses");
  return data.data || [];
};

export default function Courses() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- TanStack Query for courses ---
  const {
    data: courses = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // --- Derived data from courses (categories & languages) with array guards ---
  const categories = useMemo(() => {
    // Guard: ensure courses is an array before using it
    if (!Array.isArray(courses)) return [];

    const catMap = new Map();
    courses.forEach((c) => {
      if (c.category_details?.id) {
        catMap.set(c.category_details.id, c.category_details);
      }
    });
    return [...catMap.values()];
  }, [courses]);

  const languages = useMemo(() => {
    // Guard: ensure courses is an array before using it
    if (!Array.isArray(courses)) return [];

    return [...new Set(courses.map((c) => c.language).filter(Boolean))];
  }, [courses]);

  // --- Delete mutation with optimistic update ---
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(
        `https://codingcloudapi.codingcloud.co.in/course/${id}/`,
        { method: "DELETE" },
      );
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });
      const previousCourses = queryClient.getQueryData(["courses"]);
      queryClient.setQueryData(["courses"], (old = []) =>
        old.filter((c) => c.id !== deletedId),
      );
      return { previousCourses };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses);
      }
      setDeleteError(err.message);
      setToastError(err.message);
      setTimeout(() => setToastError(""), 3000);
    },
    onSuccess: () => {
      setToast({
        show: true,
        message: "Course deleted successfully!",
        type: "error",
      });
    },
    onSettled: () => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    },
  });

  // --- Original UI state (unchanged) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ── Derived filtered/sorted data (with array guard) ──
  const filteredCourses = useMemo(() => {
    // Guard: ensure courses is an array before using it
    if (!Array.isArray(courses)) return [];

    let result = [...courses];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          stripHtml(c.text).toLowerCase().includes(q) ||
          c.category_details?.name?.toLowerCase().includes(q),
      );
    }

    if (filters.category !== "all")
      result = result.filter(
        (c) => c.category_details?.id === parseInt(filters.category),
      );
    if (filters.level !== "all")
      result = result.filter(
        (c) => c.level?.toLowerCase() === filters.level.toLowerCase(),
      );
    if (filters.language !== "all")
      result = result.filter(
        (c) => c.language?.toLowerCase() === filters.language.toLowerCase(),
      );
    if (filters.certificate !== "all") {
      const has = (c) =>
        c.certificate === true ||
        c.certificate === "Yes" ||
        c.certificate === "yes";
      result = result.filter((c) =>
        filters.certificate === "yes" ? has(c) : !has(c),
      );
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") {
        aVal = a.id || 0;
        bVal = b.id || 0;
      } else if (sortConfig.key === "name") {
        aVal = a.name?.toLowerCase() || "";
        bVal = b.name?.toLowerCase() || "";
      } else if (sortConfig.key === "students") {
        aVal = parseInt(a.students) || 0;
        bVal = parseInt(b.students) || 0;
      } else if (sortConfig.key === "category") {
        aVal = a.category_details?.name?.toLowerCase() || "";
        bVal = b.category_details?.name?.toLowerCase() || "";
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [courses, searchTerm, filters, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

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
    setSortConfig((c) => ({
      key,
      direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col)
      return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} style={{ color: "#7c3aed" }} />
    ) : (
      <SortDesc size={13} style={{ color: "#7c3aed" }} />
    );
  };

  const handleDeleteClick = (e, course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    deleteMutation.mutate(courseToDelete.id);
  };

  const getLevelStyles = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return {
          background: "#f0fdf4",
          color: "#15803d",
          border: "1px solid #bbf7d0",
        };
      case "intermediate":
        return {
          background: "#fffbeb",
          color: "#b45309",
          border: "1px solid #fde68a",
        };
      case "hard":
      case "advanced":
        return {
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
        };
      default:
        return {
          background: "#f5f3ff",
          color: "#6d28d9",
          border: "1px solid #ddd6fe",
        };
    }
  };

  const hasCert = (c) =>
    c.certificate === true ||
    c.certificate === "Yes" ||
    c.certificate === "yes";

  const activeFiltersCount = [
    filters.category !== "all",
    filters.level !== "all",
    filters.language !== "all",
    filters.certificate !== "all",
  ].filter(Boolean).length;

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #ede9fe",
              borderTopColor: "#7c3aed",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              marginTop: 14,
              color: "#94a3b8",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Loading courses…
          </p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            padding: 32,
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#fef2f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <X size={22} color="#ef4444" />
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            Something went wrong
          </h3>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>
            {queryError.message}
          </p>
          <button
            onClick={() => refetch()}
            style={{
              padding: "10px 24px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
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

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {toastError && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <AlertCircle size={15} color="#ef4444" />
          <p style={{ fontSize: 14, color: "#dc2626", margin: 0 }}>
            {toastError}
          </p>
          <button
            onClick={() => setToastError("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              marginLeft: 4,
              display: "flex",
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 5,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
              }}
            >
              <BookOpen size={17} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Courses
            </h1>
            <span
              style={{
                padding: "3px 11px",
                background: "#ede9fe",
                color: "#6d28d9",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 99,
              }}
            >
              {courses.length}
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#94a3b8",
              margin: 0,
              paddingLeft: 48,
            }}
          >
            Manage your course catalogue
          </p>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "14px 18px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Search */}
            <div
              style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#cbd5e1",
                  pointerEvents: "none",
                }}
              />
              <input
                className="crs-search"
                type="text"
                placeholder="Search by name, description or category…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                    padding: 2,
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Items per page */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                Show
              </span>
              <select
                className="crs-select"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>
                per page
              </span>
            </div>

            {/* Filters toggle */}
            <button
              className={`crs-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span
                  style={{
                    padding: "1px 7px",
                    background: "#7c3aed",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 99,
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                style={{
                  transform: showFilters ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Add Course */}
            <button
              className="crs-add-btn"
              onClick={() => navigate("/add-course")}
            >
              <Plus size={16} /> Add Course
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 14,
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid #f1f5f9",
              }}
            >
              {[
                {
                  label: "Category",
                  key: "category",
                  options: [
                    { value: "all", label: "All Categories" },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ],
                },
                {
                  label: "Level",
                  key: "level",
                  options: [
                    { value: "all", label: "All Levels" },
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                  ],
                },
                {
                  label: "Language",
                  key: "language",
                  options: [
                    { value: "all", label: "All Languages" },
                    ...languages.map((lang) => ({ value: lang, label: lang })),
                  ],
                },
                {
                  label: "Certificate",
                  key: "certificate",
                  options: [
                    { value: "all", label: "All" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <select
                    className="crs-filter-select"
                    value={filters[key]}
                    onChange={(e) =>
                      setFilters({ ...filters, [key]: e.target.value })
                    }
                  >
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 20 }} />

        {/* Table / Empty */}
        {filteredCourses.length === 0 ? (
          <div
            className="crs-animate"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: "64px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                background: "#f1f5f9",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <BookOpen size={27} color="#cbd5e1" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 6px",
              }}
            >
              No courses found
            </h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || Object.values(filters).some((v) => v !== "all")
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first course."}
            </p>
            <button
              onClick={() => navigate("/add-course")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> Add Course
            </button>
          </div>
        ) : (
          <div
            className="crs-animate"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 800,
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      background: "#fafafa",
                    }}
                  >
                    <th
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        width: 52,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        #
                      </span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="crs-th-btn"
                        onClick={() => handleSort("name")}
                      >
                        Course <SortIcon col="name" />
                      </button>
                    </th>
                    <th
                      style={{ padding: "14px 18px", textAlign: "left" }}
                      className="hidden md:table-cell"
                    >
                      <button
                        className="crs-th-btn"
                        onClick={() => handleSort("category")}
                      >
                        Category <SortIcon col="category" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Level
                      </span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="crs-th-btn"
                        onClick={() => handleSort("students")}
                      >
                        Students <SortIcon col="students" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Cert
                      </span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Actions
                      </span>
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
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowViewModal(true);
                        }}
                      >
                        <td
                          style={{
                            padding: "15px 18px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#cbd5e1",
                          }}
                        >
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td style={{ padding: "15px 18px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 11,
                                overflow: "hidden",
                                border: "1px solid #e2e8f0",
                                background: "#f1f5f9",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {course.image ? (
                                <img
                                  src={getImageUrl(course.image)}
                                  alt={course.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/44?text=C";
                                  }}
                                />
                              ) : (
                                <BookOpen size={16} color="#cbd5e1" />
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#1e293b",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {course.name}
                              </p>
                              <p
                                style={{
                                  fontSize: 12.5,
                                  color: "#94a3b8",
                                  margin: "2px 0 0",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {plainText.slice(0, 55) || "No description"}
                                {plainText.length > 55 ? "…" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "15px 18px" }}>
                          <span
                            style={{
                              fontSize: 14,
                              color: "#64748b",
                              fontWeight: 500,
                            }}
                          >
                            {course.category_details?.name || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "15px 18px" }}>
                          {course.level ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "4px 10px",
                                borderRadius: 99,
                                fontSize: 12.5,
                                fontWeight: 600,
                                ...getLevelStyles(course.level),
                              }}
                            >
                              {course.level}
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "15px 18px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 14,
                              color: "#64748b",
                            }}
                          >
                            <Users size={13} color="#94a3b8" />
                            {course.students || (
                              <span style={{ color: "#cbd5e1" }}>—</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "15px 18px" }}>
                          {hasCert(course) ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 9px",
                                background: "#fffbeb",
                                color: "#b45309",
                                border: "1px solid #fde68a",
                                borderRadius: 99,
                                fontSize: 12.5,
                                fontWeight: 600,
                              }}
                            >
                              <Award size={10} /> Yes
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 13 }}>
                              No
                            </span>
                          )}
                        </td>
                        <td
                          style={{ padding: "15px 18px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 4,
                            }}
                          >
                            <button
                              className="crs-action-btn view"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourse(course);
                                setShowViewModal(true);
                              }}
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="crs-action-btn edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-course/${course.id}`);
                              }}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              className="crs-action-btn del"
                              onClick={(e) => handleDeleteClick(e, course)}
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
            <div
              style={{
                padding: "13px 18px",
                background: "#fafafa",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span
                style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}
              >
                Showing{" "}
                <strong style={{ color: "#475569" }}>
                  {indexOfFirstItem + 1}–
                  {Math.min(
                    indexOfFirstItem + itemsPerPage,
                    filteredCourses.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "#475569" }}>
                  {filteredCourses.length}
                </strong>{" "}
                courses
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button
                  className="crs-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`crs-page-btn${safePage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="crs-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={safePage === totalPages}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowViewModal(false)}
          />
          <div
            className="crs-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              maxWidth: 680,
              width: "100%",
              zIndex: 10,
              overflow: "hidden",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() => setShowViewModal(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                zIndex: 10,
                width: 34,
                height: 34,
                background: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <X size={15} color="#475569" />
            </button>
            <div
              style={{
                position: "relative",
                height: 220,
                background: "#0f172a",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                src={getImageUrl(
                  selectedCourse.banner_img || selectedCourse.image,
                )}
                alt={selectedCourse.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.75,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x224?text=Course";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px 24px",
                }}
              >
                <h2
                  style={{
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 700,
                    margin: "0 0 8px",
                  }}
                >
                  {selectedCourse.name}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(4px)",
                      borderRadius: 99,
                      fontSize: 12.5,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {selectedCourse.category_details?.name}
                  </span>
                  {selectedCourse.level && (
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 99,
                        fontSize: 12.5,
                        fontWeight: 600,
                        ...getLevelStyles(selectedCourse.level),
                      }}
                    >
                      {selectedCourse.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr))",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    icon: Clock,
                    label: "Duration",
                    val: selectedCourse.duration,
                  },
                  {
                    icon: BookOpen,
                    label: "Lectures",
                    val: selectedCourse.lecture,
                  },
                  {
                    icon: Users,
                    label: "Students",
                    val: selectedCourse.students,
                  },
                  {
                    icon: Globe,
                    label: "Language",
                    val: selectedCourse.language,
                  },
                ]
                  .filter((s) => s.val)
                  .map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        borderRadius: 12,
                        padding: "12px 8px",
                        textAlign: "center",
                      }}
                    >
                      <s.icon
                        size={16}
                        color="#7c3aed"
                        style={{ margin: "0 auto 4px" }}
                      />
                      <p
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          margin: "0 0 3px",
                          fontWeight: 500,
                        }}
                      >
                        {s.label}
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1e293b",
                          margin: 0,
                        }}
                      >
                        {s.val}
                      </p>
                    </div>
                  ))}
              </div>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    margin: "0 0 10px",
                  }}
                >
                  About this course
                </p>
                <div
                  style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65 }}
                >
                  {selectedCourse.text ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedCourse.text }}
                    />
                  ) : (
                    <p
                      style={{
                        color: "#94a3b8",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      No description available.
                    </p>
                  )}
                </div>
              </div>
              {selectedCourse.keywords && (
                <div style={{ marginBottom: 16 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      margin: "0 0 8px",
                    }}
                  >
                    Keywords
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedCourse.keywords.split(",").map((k, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 10px",
                          background: "#f1f5f9",
                          color: "#64748b",
                          fontSize: 13,
                          borderRadius: 99,
                        }}
                      >
                        {k.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hasCert(selectedCourse) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <Award size={16} color="#b45309" />
                  <span
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: "#b45309",
                    }}
                  >
                    Certificate of Completion included
                  </span>
                </div>
              )}
            </div>
            <div
              style={{
                padding: "14px 24px",
                background: "#f8fafc",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              {selectedCourse.pdf_file && (
                <a
                  href={`https://codingcloudapi.codingcloud.co.in/${selectedCourse.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    border: "1.5px solid #e2e8f0",
                    color: "#475569",
                    borderRadius: 10,
                    fontSize: 14.5,
                    fontWeight: 600,
                    textDecoration: "none",
                    background: "#fff",
                  }}
                >
                  <Download size={14} /> Syllabus
                </a>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  padding: "9px 18px",
                  border: "1.5px solid #e2e8f0",
                  background: "#fff",
                  color: "#475569",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-course/${selectedCourse.id}`);
                }}
                style={{
                  padding: "9px 18px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "inherit",
                }}
              >
                <Edit size={14} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && courseToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.45)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() =>
              !deleteMutation.isPending && setShowDeleteModal(false)
            }
          />
          <div
            className="crs-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxWidth: 420,
              width: "100%",
              padding: 26,
              zIndex: 10,
            }}
          >
            <button
              onClick={() =>
                !deleteMutation.isPending && setShowDeleteModal(false)
              }
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                padding: 6,
                borderRadius: 8,
                display: "flex",
              }}
            >
              <X size={15} />
            </button>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  background: "#fef2f2",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 7px",
                  }}
                >
                  Delete Course
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  Are you sure you want to delete{" "}
                  <strong style={{ color: "#1e293b" }}>
                    "{courseToDelete.name}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteError && (
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={14} color="#ef4444" />
                <p style={{ fontSize: 13.5, color: "#dc2626", margin: 0 }}>
                  {deleteError}
                </p>
              </div>
            )}
            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}
                style={{
                  padding: "10px 20px",
                  border: "1.5px solid #e2e8f0",
                  background: "#fff",
                  color: "#475569",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                style={{
                  padding: "10px 20px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  opacity: deleteMutation.isPending ? 0.7 : 1,
                  fontFamily: "inherit",
                }}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />{" "}
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

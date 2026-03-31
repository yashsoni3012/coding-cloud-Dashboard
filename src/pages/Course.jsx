// import { useState, useEffect, useRef, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   BookOpen,
//   Clock,
//   Users,
//   Globe,
//   Award,
//   Search,
//   X,
//   Download,
//   Edit,
//   Trash2,
//   AlertCircle,
//   Plus,
//   SortAsc,
//   SortDesc,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   ChevronDown,
// } from "lucide-react";
// import Toasts from "./Toasts";

// const stripHtml = (html) => {
//   if (!html) return "";
//   const tmp = document.createElement("div");
//   tmp.innerHTML = html;
//   return tmp.textContent || tmp.innerText || "";
// };

// const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

// const getImageUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   return `${BASE_URL}${path}`;
// };

// const fetchCourses = async () => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/course/",
//   );
//   const data = await response.json();
//   if (!data.success) throw new Error("Failed to fetch courses");
//   return data.data || [];
// };

// export default function Courses() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const {
//     data: courses = [],
//     isLoading,
//     error: queryError,
//     refetch,
//   } = useQuery({
//     queryKey: ["courses"],
//     queryFn: fetchCourses,
//   });

//   // --- Derived data from courses (categories & languages) with array guards ---
//   const categories = useMemo(() => {
//     // Guard: ensure courses is an array before using it
//     if (!Array.isArray(courses)) return [];

//     const catMap = new Map();
//     courses.forEach((c) => {
//       if (c.category_details?.id) {
//         catMap.set(c.category_details.id, c.category_details);
//       }
//     });
//     return [...catMap.values()];
//   }, [courses]);

//   const languages = useMemo(() => {
//     // Guard: ensure courses is an array before using it
//     if (!Array.isArray(courses)) return [];

//     return [...new Set(courses.map((c) => c.language).filter(Boolean))];
//   }, [courses]);

//   // --- Delete mutation with optimistic update ---
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       const response = await fetch(
//         `https://codingcloudapi.codingcloud.co.in/course/${id}/`,
//         { method: "DELETE" },
//       );
//       if (!response.ok && response.status !== 204) {
//         const data = await response.json().catch(() => ({}));
//         throw new Error(data.message || `HTTP Error: ${response.status}`);
//       }
//       return id;
//     },
//     onMutate: async (deletedId) => {
//       await queryClient.cancelQueries({ queryKey: ["courses"] });
//       const previousCourses = queryClient.getQueryData(["courses"]);
//       queryClient.setQueryData(["courses"], (old = []) =>
//         old.filter((c) => c.id !== deletedId),
//       );
//       return { previousCourses };
//     },
//     onError: (err, deletedId, context) => {
//       if (context?.previousCourses) {
//         queryClient.setQueryData(["courses"], context.previousCourses);
//       }
//       setDeleteError(err.message);
//       setToastError(err.message);
//       setTimeout(() => setToastError(""), 3000);
//     },
//     onSuccess: () => {
//       setToast({
//         show: true,
//         message: "Course deleted successfully!",
//         type: "error",
//       });
//     },
//     onSettled: () => {
//       setDeleteLoading(false);
//       setShowDeleteModal(false);
//       setCourseToDelete(null);
//     },
//   });

//   // --- Original UI state (unchanged) ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "id",
//     direction: "desc",
//   });
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

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
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   // ── Derived filtered/sorted data (with array guard) ──
//   const filteredCourses = useMemo(() => {
//     // Guard: ensure courses is an array before using it
//     if (!Array.isArray(courses)) return [];

//     let result = [...courses];

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter(
//         (c) =>
//           c.name?.toLowerCase().includes(q) ||
//           stripHtml(c.text).toLowerCase().includes(q) ||
//           c.category_details?.name?.toLowerCase().includes(q),
//       );
//     }

//     if (filters.category !== "all")
//       result = result.filter(
//         (c) => c.category_details?.id === parseInt(filters.category),
//       );
//     if (filters.level !== "all")
//       result = result.filter(
//         (c) => c.level?.toLowerCase() === filters.level.toLowerCase(),
//       );
//     if (filters.language !== "all")
//       result = result.filter(
//         (c) => c.language?.toLowerCase() === filters.language.toLowerCase(),
//       );
//     if (filters.certificate !== "all") {
//       const has = (c) =>
//         c.certificate === true ||
//         c.certificate === "Yes" ||
//         c.certificate === "yes";
//       result = result.filter((c) =>
//         filters.certificate === "yes" ? has(c) : !has(c),
//       );
//     }

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "id") {
//         aVal = a.id || 0;
//         bVal = b.id || 0;
//       } else if (sortConfig.key === "name") {
//         aVal = a.name?.toLowerCase() || "";
//         bVal = b.name?.toLowerCase() || "";
//       } else if (sortConfig.key === "students") {
//         aVal = parseInt(a.students) || 0;
//         bVal = parseInt(b.students) || 0;
//       } else if (sortConfig.key === "category") {
//         aVal = a.category_details?.name?.toLowerCase() || "";
//         bVal = b.category_details?.name?.toLowerCase() || "";
//       }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   }, [courses, searchTerm, filters, sortConfig]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredCourses.length / itemsPerPage),
//   );
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedCourses = filteredCourses.slice(
//     indexOfFirstItem,
//     indexOfFirstItem + itemsPerPage,
//   );

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
//     setSortConfig((c) => ({
//       key,
//       direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const SortIcon = ({ col }) => {
//     if (sortConfig.key !== col)
//       return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
//     return sortConfig.direction === "asc" ? (
//       <SortAsc size={13} style={{ color: "#7c3aed" }} />
//     ) : (
//       <SortDesc size={13} style={{ color: "#7c3aed" }} />
//     );
//   };

//   const handleDeleteClick = (e, course) => {
//     e.stopPropagation();
//     setCourseToDelete(course);
//     setShowDeleteModal(true);
//     setDeleteError("");
//   };

//   const handleDeleteConfirm = () => {
//     if (!courseToDelete) return;
//     setDeleteLoading(true);
//     setDeleteError("");
//     deleteMutation.mutate(courseToDelete.id);
//   };

//   const getLevelStyles = (level) => {
//     switch (level?.toLowerCase()) {
//       case "beginner":
//         return {
//           background: "#f0fdf4",
//           color: "#15803d",
//           border: "1px solid #bbf7d0",
//         };
//       case "intermediate":
//         return {
//           background: "#fffbeb",
//           color: "#b45309",
//           border: "1px solid #fde68a",
//         };
//       case "hard":
//       case "advanced":
//         return {
//           background: "#fef2f2",
//           color: "#b91c1c",
//           border: "1px solid #fecaca",
//         };
//       default:
//         return {
//           background: "#f5f3ff",
//           color: "#6d28d9",
//           border: "1px solid #ddd6fe",
//         };
//     }
//   };

//   const hasCert = (c) =>
//     c.certificate === true ||
//     c.certificate === "Yes" ||
//     c.certificate === "yes";

//   const activeFiltersCount = [
//     filters.category !== "all",
//     filters.level !== "all",
//     filters.language !== "all",
//     filters.certificate !== "all",
//   ].filter(Boolean).length;

//   const getPageNumbers = () => {
//     if (totalPages <= 5)
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (safePage <= 3) return [1, 2, 3, 4, 5];
//     if (safePage >= totalPages - 2)
//       return [
//         totalPages - 4,
//         totalPages - 3,
//         totalPages - 2,
//         totalPages - 1,
//         totalPages,
//       ];
//     return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
//   };

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#f8fafc",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               width: 44,
//               height: 44,
//               border: "3px solid #ede9fe",
//               borderTopColor: "#7c3aed",
//               borderRadius: "50%",
//               margin: "0 auto",
//               animation: "spin 0.8s linear infinite",
//             }}
//           />
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//           <p
//             style={{
//               marginTop: 14,
//               color: "#94a3b8",
//               fontSize: 15,
//               fontWeight: 500,
//             }}
//           >
//             Loading courses…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (queryError) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#f8fafc",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 16,
//         }}
//       >
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 20,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
//             padding: 32,
//             maxWidth: 360,
//             width: "100%",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               width: 56,
//               height: 56,
//               background: "#fef2f2",
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 16px",
//             }}
//           >
//             <X size={22} color="#ef4444" />
//           </div>
//           <h3
//             style={{
//               fontSize: 17,
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: "0 0 6px",
//             }}
//           >
//             Something went wrong
//           </h3>
//           <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>
//             {queryError.message}
//           </p>
//           <button
//             onClick={() => refetch()}
//             style={{
//               padding: "10px 24px",
//               background: "#7c3aed",
//               color: "#fff",
//               border: "none",
//               borderRadius: 10,
//               fontSize: 15,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8fafc",
//         fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//       }}
//     >
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

//       {toast.show && (
//         <Toasts
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}

//       {toastError && (
//         <div
//           style={{
//             position: "fixed",
//             top: 20,
//             right: 20,
//             zIndex: 100,
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: 12,
//             padding: "12px 16px",
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//           }}
//         >
//           <AlertCircle size={15} color="#ef4444" />
//           <p style={{ fontSize: 14, color: "#dc2626", margin: 0 }}>
//             {toastError}
//           </p>
//           <button
//             onClick={() => setToastError("")}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "#94a3b8",
//               marginLeft: 4,
//               display: "flex",
//             }}
//           >
//             <X size={13} />
//           </button>
//         </div>
//       )}

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
//         {/* Header */}
//         <div style={{ marginBottom: 24 }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               marginBottom: 5,
//             }}
//           >
//             <div
//               style={{
//                 width: 38,
//                 height: 38,
//                 background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
//                 borderRadius: 11,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
//               }}
//             >
//               <BookOpen size={17} color="#fff" />
//             </div>
//             <h1
//               style={{
//                 fontSize: 22,
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               Courses
//             </h1>
//             <span
//               style={{
//                 padding: "3px 11px",
//                 background: "#ede9fe",
//                 color: "#6d28d9",
//                 fontSize: 13,
//                 fontWeight: 700,
//                 borderRadius: 99,
//               }}
//             >
//               {courses.length}
//             </span>
//           </div>
//         </div>

//         {/* Toolbar */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 16,
//             border: "1px solid #e2e8f0",
//             padding: "14px 18px",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               alignItems: "center",
//               gap: 10,
//             }}
//           >
//             {/* Search */}
//             <div
//               style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}
//             >
//               <Search
//                 size={16}
//                 style={{
//                   position: "absolute",
//                   left: 13,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#cbd5e1",
//                   pointerEvents: "none",
//                 }}
//               />
//               <input
//                 className="crs-search"
//                 type="text"
//                 placeholder="Search by name, description or category…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   style={{
//                     position: "absolute",
//                     right: 11,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#94a3b8",
//                     display: "flex",
//                     padding: 2,
//                   }}
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* Items per page */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 flexShrink: 0,
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: 14,
//                   color: "#94a3b8",
//                   fontWeight: 500,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 Show
//               </span>
//               <select
//                 className="crs-select"
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//               <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>
//                 per page
//               </span>
//             </div>

//             {/* Filters toggle */}
//             <button
//               className={`crs-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span
//                   style={{
//                     padding: "1px 7px",
//                     background: "#7c3aed",
//                     color: "#fff",
//                     fontSize: 12,
//                     fontWeight: 700,
//                     borderRadius: 99,
//                   }}
//                 >
//                   {activeFiltersCount}
//                 </span>
//               )}
//               <ChevronDown
//                 size={14}
//                 style={{
//                   transform: showFilters ? "rotate(180deg)" : "none",
//                   transition: "transform 0.2s",
//                 }}
//               />
//             </button>

//             {/* Add Course */}
//             <button
//               className="crs-add-btn"
//               onClick={() => navigate("/add-course")}
//             >
//               <Plus size={16} /> Add Course
//             </button>
//           </div>

//           {/* Expandable filter panel */}
//           {showFilters && (
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//                 gap: 14,
//                 marginTop: 14,
//                 paddingTop: 14,
//                 borderTop: "1px solid #f1f5f9",
//               }}
//             >
//               {[
//                 {
//                   label: "Category",
//                   key: "category",
//                   options: [
//                     { value: "all", label: "All Categories" },
//                     ...categories.map((c) => ({ value: c.id, label: c.name })),
//                   ],
//                 },
//                 {
//                   label: "Level",
//                   key: "level",
//                   options: [
//                     { value: "all", label: "All Levels" },
//                     { value: "beginner", label: "Beginner" },
//                     { value: "intermediate", label: "Intermediate" },
//                     { value: "Advanced", label: "Advanced" },
//                   ],
//                 },
//                 {
//                   label: "Language",
//                   key: "language",
//                   options: [
//                     { value: "all", label: "All Languages" },
//                     ...languages.map((lang) => ({ value: lang, label: lang })),
//                   ],
//                 },
//                 {
//                   label: "Certificate",
//                   key: "certificate",
//                   options: [
//                     { value: "all", label: "All" },
//                     { value: "yes", label: "Yes" },
//                     { value: "no", label: "No" },
//                   ],
//                 },
//               ].map(({ label, key, options }) => (
//                 <div key={key}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.07em",
//                       color: "#94a3b8",
//                       marginBottom: 6,
//                     }}
//                   >
//                     {label}
//                   </label>
//                   <select
//                     className="crs-filter-select"
//                     value={filters[key]}
//                     onChange={(e) =>
//                       setFilters({ ...filters, [key]: e.target.value })
//                     }
//                   >
//                     {options.map((o) => (
//                       <option key={o.value} value={o.value}>
//                         {o.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div style={{ height: 20 }} />

//         {/* Table / Empty */}
//         {filteredCourses.length === 0 ? (
//           <div
//             className="crs-animate"
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               border: "1px solid #e2e8f0",
//               padding: "64px 24px",
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 width: 62,
//                 height: 62,
//                 background: "#f1f5f9",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 16px",
//               }}
//             >
//               <BookOpen size={27} color="#cbd5e1" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: "#1e293b",
//                 margin: "0 0 6px",
//               }}
//             >
//               No courses found
//             </h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm || Object.values(filters).some((v) => v !== "all")
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first course."}
//             </p>
//             <button
//               onClick={() => navigate("/add-course")}
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "10px 20px",
//                 background: "#7c3aed",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 10,
//                 fontSize: 14.5,
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//             >
//               <Plus size={15} /> Add Course
//             </button>
//           </div>
//         ) : (
//           <div
//             className="crs-animate"
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               border: "1px solid #e2e8f0",
//               overflow: "hidden",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//             }}
//           >
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   minWidth: 800,
//                   borderCollapse: "collapse",
//                 }}
//               >
//                 <thead>
//                   <tr
//                     style={{
//                       borderBottom: "2px solid #f1f5f9",
//                       background: "#fafafa",
//                     }}
//                   >
//                     <th
//                       style={{
//                         padding: "14px 18px",
//                         textAlign: "left",
//                         width: 52,
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 12,
//                           fontWeight: 700,
//                           textTransform: "uppercase",
//                           letterSpacing: "0.07em",
//                           color: "#94a3b8",
//                         }}
//                       >
//                         #
//                       </span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="crs-th-btn"
//                         onClick={() => handleSort("name")}
//                       >
//                         Course <SortIcon col="name" />
//                       </button>
//                     </th>
//                     <th
//                       style={{ padding: "14px 18px", textAlign: "left" }}
//                       className="hidden md:table-cell"
//                     >
//                       <button
//                         className="crs-th-btn"
//                         onClick={() => handleSort("category")}
//                       >
//                         Category <SortIcon col="category" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span
//                         style={{
//                           fontSize: 12,
//                           fontWeight: 700,
//                           textTransform: "uppercase",
//                           letterSpacing: "0.07em",
//                           color: "#94a3b8",
//                         }}
//                       >
//                         Level
//                       </span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="crs-th-btn"
//                         onClick={() => handleSort("students")}
//                       >
//                         Students <SortIcon col="students" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span
//                         style={{
//                           fontSize: 12,
//                           fontWeight: 700,
//                           textTransform: "uppercase",
//                           letterSpacing: "0.07em",
//                           color: "#94a3b8",
//                         }}
//                       >
//                         Cert
//                       </span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "right" }}>
//                       <span
//                         style={{
//                           fontSize: 12,
//                           fontWeight: 700,
//                           textTransform: "uppercase",
//                           letterSpacing: "0.07em",
//                           color: "#94a3b8",
//                         }}
//                       >
//                         Actions
//                       </span>
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
//                         onClick={() => {
//                           setSelectedCourse(course);
//                           setShowViewModal(true);
//                         }}
//                       >
//                         <td
//                           style={{
//                             padding: "15px 18px",
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#cbd5e1",
//                           }}
//                         >
//                           {indexOfFirstItem + index + 1}
//                         </td>
//                         <td style={{ padding: "15px 18px" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 12,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 width: 44,
//                                 height: 44,
//                                 borderRadius: 11,
//                                 overflow: "hidden",
//                                 border: "1px solid #e2e8f0",
//                                 background: "#f1f5f9",
//                                 flexShrink: 0,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               {course.image ? (
//                                 <img
//                                   src={getImageUrl(course.image)}
//                                   alt={course.name}
//                                   style={{
//                                     width: "100%",
//                                     height: "100%",
//                                     objectFit: "cover",
//                                   }}
//                                   onError={(e) => {
//                                     e.target.src =
//                                       "https://via.placeholder.com/44?text=C";
//                                   }}
//                                 />
//                               ) : (
//                                 <BookOpen size={16} color="#cbd5e1" />
//                               )}
//                             </div>
//                             <div style={{ minWidth: 0 }}>
//                               <p
//                                 style={{
//                                   fontSize: 15,
//                                   fontWeight: 600,
//                                   color: "#1e293b",
//                                   margin: 0,
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {course.name}
//                               </p>
//                               <p
//                                 style={{
//                                   fontSize: 12.5,
//                                   color: "#94a3b8",
//                                   margin: "2px 0 0",
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {plainText.slice(0, 55) || "No description"}
//                                 {plainText.length > 55 ? "…" : ""}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td style={{ padding: "15px 18px" }}>
//                           <span
//                             style={{
//                               fontSize: 14,
//                               color: "#64748b",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {course.category_details?.name || "—"}
//                           </span>
//                         </td>
//                         <td style={{ padding: "15px 18px" }}>
//                           {course.level ? (
//                             <span
//                               style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 padding: "4px 10px",
//                                 borderRadius: 99,
//                                 fontSize: 12.5,
//                                 fontWeight: 600,
//                                 ...getLevelStyles(course.level),
//                               }}
//                             >
//                               {course.level}
//                             </span>
//                           ) : (
//                             <span style={{ color: "#cbd5e1" }}>—</span>
//                           )}
//                         </td>
//                         <td style={{ padding: "15px 18px" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 5,
//                               fontSize: 14,
//                               color: "#64748b",
//                             }}
//                           >
//                             <Users size={13} color="#94a3b8" />
//                             {course.students || (
//                               <span style={{ color: "#cbd5e1" }}>—</span>
//                             )}
//                           </div>
//                         </td>
//                         <td style={{ padding: "15px 18px" }}>
//                           {hasCert(course) ? (
//                             <span
//                               style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 gap: 4,
//                                 padding: "3px 9px",
//                                 background: "#fffbeb",
//                                 color: "#b45309",
//                                 border: "1px solid #fde68a",
//                                 borderRadius: 99,
//                                 fontSize: 12.5,
//                                 fontWeight: 600,
//                               }}
//                             >
//                               <Award size={10} /> Yes
//                             </span>
//                           ) : (
//                             <span style={{ color: "#cbd5e1", fontSize: 13 }}>
//                               No
//                             </span>
//                           )}
//                         </td>
//                         <td
//                           style={{ padding: "15px 18px" }}
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "flex-end",
//                               gap: 4,
//                             }}
//                           >
//                             <button
//                               className="crs-action-btn view"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedCourse(course);
//                                 setShowViewModal(true);
//                               }}
//                               title="View"
//                             >
//                               <Eye size={15} />
//                             </button>
//                             <button
//                               className="crs-action-btn edit"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/edit-course/${course.id}`);
//                               }}
//                               title="Edit"
//                             >
//                               <Edit size={15} />
//                             </button>
//                             <button
//                               className="crs-action-btn del"
//                               onClick={(e) => handleDeleteClick(e, course)}
//                               title="Delete"
//                             >
//                               <Trash2 size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div
//               style={{
//                 padding: "13px 18px",
//                 background: "#fafafa",
//                 borderTop: "1px solid #f1f5f9",
//                 display: "flex",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: 10,
//               }}
//             >
//               <span
//                 style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}
//               >
//                 Showing{" "}
//                 <strong style={{ color: "#475569" }}>
//                   {indexOfFirstItem + 1}–
//                   {Math.min(
//                     indexOfFirstItem + itemsPerPage,
//                     filteredCourses.length,
//                   )}
//                 </strong>{" "}
//                 of{" "}
//                 <strong style={{ color: "#475569" }}>
//                   {filteredCourses.length}
//                 </strong>{" "}
//                 courses
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button
//                   className="crs-page-btn"
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={safePage === 1}
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page) => (
//                   <button
//                     key={page}
//                     className={`crs-page-btn${safePage === page ? " active" : ""}`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   className="crs-page-btn"
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(p + 1, totalPages))
//                   }
//                   disabled={safePage === totalPages}
//                 >
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* View Modal */}
//       {showViewModal && selectedCourse && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 50,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 16,
//           }}
//         >
//           <div
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(15,23,42,0.6)",
//               backdropFilter: "blur(4px)",
//             }}
//             onClick={() => setShowViewModal(false)}
//           />
//           <div
//             className="crs-animate"
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
//               maxWidth: 680,
//               width: "100%",
//               zIndex: 10,
//               overflow: "hidden",
//               maxHeight: "92vh",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <button
//               onClick={() => setShowViewModal(false)}
//               style={{
//                 position: "absolute",
//                 top: 14,
//                 right: 14,
//                 zIndex: 10,
//                 width: 34,
//                 height: 34,
//                 background: "rgba(255,255,255,0.9)",
//                 border: "none",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//               }}
//             >
//               <X size={15} color="#475569" />
//             </button>
//             <div
//               style={{
//                 position: "relative",
//                 height: 220,
//                 background: "#0f172a",
//                 flexShrink: 0,
//                 overflow: "hidden",
//               }}
//             >
//               <img
//                 src={getImageUrl(
//                   selectedCourse.banner_img || selectedCourse.image,
//                 )}
//                 alt={selectedCourse.name}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   opacity: 0.75,
//                 }}
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/800x224?text=Course";
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background:
//                     "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   padding: "20px 24px",
//                 }}
//               >
//                 <h2
//                   style={{
//                     color: "#fff",
//                     fontSize: 22,
//                     fontWeight: 700,
//                     margin: "0 0 8px",
//                   }}
//                 >
//                   {selectedCourse.name}
//                 </h2>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   <span
//                     style={{
//                       padding: "4px 12px",
//                       background: "rgba(255,255,255,0.18)",
//                       backdropFilter: "blur(4px)",
//                       borderRadius: 99,
//                       fontSize: 12.5,
//                       color: "#fff",
//                       fontWeight: 500,
//                     }}
//                   >
//                     {selectedCourse.category_details?.name}
//                   </span>
//                   {selectedCourse.level && (
//                     <span
//                       style={{
//                         padding: "4px 12px",
//                         borderRadius: 99,
//                         fontSize: 12.5,
//                         fontWeight: 600,
//                         ...getLevelStyles(selectedCourse.level),
//                       }}
//                     >
//                       {selectedCourse.level}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr))",
//                   gap: 12,
//                   marginBottom: 20,
//                 }}
//               >
//                 {[
//                   {
//                     icon: Clock,
//                     label: "Duration",
//                     val: selectedCourse.duration,
//                   },
//                   {
//                     icon: BookOpen,
//                     label: "Lectures",
//                     val: selectedCourse.lecture,
//                   },
//                   {
//                     icon: Users,
//                     label: "Students",
//                     val: selectedCourse.students,
//                   },
//                   {
//                     icon: Globe,
//                     label: "Language",
//                     val: selectedCourse.language,
//                   },
//                 ]
//                   .filter((s) => s.val)
//                   .map((s, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         background: "#f8fafc",
//                         border: "1px solid #f1f5f9",
//                         borderRadius: 12,
//                         padding: "12px 8px",
//                         textAlign: "center",
//                       }}
//                     >
//                       <s.icon
//                         size={16}
//                         color="#7c3aed"
//                         style={{ margin: "0 auto 4px" }}
//                       />
//                       <p
//                         style={{
//                           fontSize: 11,
//                           color: "#94a3b8",
//                           margin: "0 0 3px",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {s.label}
//                       </p>
//                       <p
//                         style={{
//                           fontSize: 15,
//                           fontWeight: 700,
//                           color: "#1e293b",
//                           margin: 0,
//                         }}
//                       >
//                         {s.val}
//                       </p>
//                     </div>
//                   ))}
//               </div>
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   border: "1px solid #f1f5f9",
//                   borderRadius: 12,
//                   padding: 16,
//                   marginBottom: 16,
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.07em",
//                     color: "#94a3b8",
//                     margin: "0 0 10px",
//                   }}
//                 >
//                   About this course
//                 </p>
//                 <div
//                   style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65 }}
//                 >
//                   {selectedCourse.text ? (
//                     <div
//                       dangerouslySetInnerHTML={{ __html: selectedCourse.text }}
//                     />
//                   ) : (
//                     <p
//                       style={{
//                         color: "#94a3b8",
//                         fontStyle: "italic",
//                         margin: 0,
//                       }}
//                     >
//                       No description available.
//                     </p>
//                   )}
//                 </div>
//               </div>
//               {selectedCourse.keywords && (
//                 <div style={{ marginBottom: 16 }}>
//                   <p
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.07em",
//                       color: "#94a3b8",
//                       margin: "0 0 8px",
//                     }}
//                   >
//                     Keywords
//                   </p>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//                     {selectedCourse.keywords.split(",").map((k, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           padding: "4px 10px",
//                           background: "#f1f5f9",
//                           color: "#64748b",
//                           fontSize: 13,
//                           borderRadius: 99,
//                         }}
//                       >
//                         {k.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {hasCert(selectedCourse) && (
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     background: "#fffbeb",
//                     border: "1px solid #fde68a",
//                     borderRadius: 12,
//                     padding: "12px 16px",
//                   }}
//                 >
//                   <Award size={16} color="#b45309" />
//                   <span
//                     style={{
//                       fontSize: 14.5,
//                       fontWeight: 600,
//                       color: "#b45309",
//                     }}
//                   >
//                     Certificate of Completion included
//                   </span>
//                 </div>
//               )}
//             </div>
//             <div
//               style={{
//                 padding: "14px 24px",
//                 background: "#f8fafc",
//                 borderTop: "1px solid #f1f5f9",
//                 display: "flex",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 justifyContent: "flex-end",
//                 gap: 10,
//                 flexShrink: 0,
//               }}
//             >
//               {selectedCourse.pdf_file && (
//                 <a
//                   href={`https://codingcloudapi.codingcloud.co.in/${selectedCourse.pdf_file}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 6,
//                     padding: "9px 18px",
//                     border: "1.5px solid #e2e8f0",
//                     color: "#475569",
//                     borderRadius: 10,
//                     fontSize: 14.5,
//                     fontWeight: 600,
//                     textDecoration: "none",
//                     background: "#fff",
//                   }}
//                 >
//                   <Download size={14} /> Syllabus
//                 </a>
//               )}
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 style={{
//                   padding: "9px 18px",
//                   border: "1.5px solid #e2e8f0",
//                   background: "#fff",
//                   color: "#475569",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   fontFamily: "inherit",
//                 }}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   setShowViewModal(false);
//                   navigate(`/edit-course/${selectedCourse.id}`);
//                 }}
//                 style={{
//                   padding: "9px 18px",
//                   background: "#7c3aed",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 7,
//                   fontFamily: "inherit",
//                 }}
//               >
//                 <Edit size={14} /> Edit Course
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && courseToDelete && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 50,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 16,
//           }}
//         >
//           <div
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(15,23,42,0.45)",
//               backdropFilter: "blur(4px)",
//             }}
//             onClick={() =>
//               !deleteMutation.isPending && setShowDeleteModal(false)
//             }
//           />
//           <div
//             className="crs-animate"
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//               maxWidth: 420,
//               width: "100%",
//               padding: 26,
//               zIndex: 10,
//             }}
//           >
//             <button
//               onClick={() =>
//                 !deleteMutation.isPending && setShowDeleteModal(false)
//               }
//               style={{
//                 position: "absolute",
//                 top: 14,
//                 right: 14,
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#94a3b8",
//                 padding: 6,
//                 borderRadius: 8,
//                 display: "flex",
//               }}
//             >
//               <X size={15} />
//             </button>
//             <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//               <div
//                 style={{
//                   width: 46,
//                   height: 46,
//                   background: "#fef2f2",
//                   borderRadius: 12,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <AlertCircle size={22} color="#ef4444" />
//               </div>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: 16,
//                     fontWeight: 700,
//                     color: "#0f172a",
//                     margin: "0 0 7px",
//                   }}
//                 >
//                   Delete Course
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: 14.5,
//                     color: "#64748b",
//                     margin: 0,
//                     lineHeight: 1.55,
//                   }}
//                 >
//                   Are you sure you want to delete{" "}
//                   <strong style={{ color: "#1e293b" }}>
//                     "{courseToDelete.name}"
//                   </strong>
//                   ? This action cannot be undone.
//                 </p>
//               </div>
//             </div>
//             {deleteError && (
//               <div
//                 style={{
//                   marginTop: 14,
//                   padding: "10px 14px",
//                   background: "#fef2f2",
//                   border: "1px solid #fecaca",
//                   borderRadius: 10,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <AlertCircle size={14} color="#ef4444" />
//                 <p style={{ fontSize: 13.5, color: "#dc2626", margin: 0 }}>
//                   {deleteError}
//                 </p>
//               </div>
//             )}
//             <div
//               style={{
//                 marginTop: 22,
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 10,
//               }}
//             >
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 disabled={deleteMutation.isPending}
//                 style={{
//                   padding: "10px 20px",
//                   border: "1.5px solid #e2e8f0",
//                   background: "#fff",
//                   color: "#475569",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   fontFamily: "inherit",
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={deleteMutation.isPending}
//                 style={{
//                   padding: "10px 20px",
//                   background: "#ef4444",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 7,
//                   opacity: deleteMutation.isPending ? 0.7 : 1,
//                   fontFamily: "inherit",
//                 }}
//               >
//                 {deleteMutation.isPending ? (
//                   <>
//                     <div
//                       style={{
//                         width: 14,
//                         height: 14,
//                         border: "2px solid rgba(255,255,255,0.4)",
//                         borderTopColor: "#fff",
//                         borderRadius: "50%",
//                         animation: "spin 0.7s linear infinite",
//                       }}
//                     />{" "}
//                     Deleting…
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 size={14} /> Delete
//                   </>
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
  const response = await fetch(`${BASE_URL}/course/`);
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch courses");
  return data.data || [];
};

const getLevelClass = (level) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "bg-green-50 text-green-700 border border-green-200";
    case "intermediate":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "hard":
    case "advanced":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-violet-50 text-violet-700 border border-violet-200";
  }
};

const hasCert = (c) =>
  c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";

export default function Courses() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const categories = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    const catMap = new Map();
    courses.forEach((c) => {
      if (c.category_details?.id)
        catMap.set(c.category_details.id, c.category_details);
    });
    return [...catMap.values()];
  }, [courses]);

  const languages = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return [...new Set(courses.map((c) => c.language).filter(Boolean))];
  }, [courses]);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/course/${id}/`, {
        method: "DELETE",
      });
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
    onError: (err, _, context) => {
      if (context?.previousCourses)
        queryClient.setQueryData(["courses"], context.previousCourses);
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

  const filteredCourses = useMemo(() => {
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
    if (filters.certificate !== "all")
      result = result.filter((c) =>
        filters.certificate === "yes" ? hasCert(c) : !hasCert(c),
      );

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

  const handleSort = (key) =>
    setSortConfig((c) => ({
      key,
      direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
    }));

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col)
      return <SortAsc size={13} className="text-slate-300" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-600" />
    ) : (
      <SortDesc size={13} className="text-violet-600" />
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

  /* ─────────────────────────── Loading ─────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading courses…
          </p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── Error ─────────────────────────── */
  if (queryError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-400 mb-5">{queryError.message}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── Main ─────────────────────────── */
  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .crs-animate { animation: fadeSlideIn 0.22s ease forwards; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {toastError && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg max-w-xs">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 flex-1">{toastError}</p>
          <button
            onClick={() => setToastError("")}
            className="text-slate-400 flex-shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className="w-fullmax-w-screen-xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
              Courses
            </h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {courses.length}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile search */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search courses…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition placeholder:text-slate-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mobile controls row */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition flex-shrink-0 ${showFilters || activeFiltersCount > 0 ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <Filter size={14} />
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/add-course")}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition flex-shrink-0"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Tablet/Desktop row */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, description or category…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition placeholder:text-slate-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                Show
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                per page
              </span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition flex-shrink-0 ${showFilters || activeFiltersCount > 0 ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              <Filter size={14} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={() => navigate("/add-course")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
            >
              <Plus size={15} /> Add Course
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3.5 border-t border-slate-100">
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
                    ...languages.map((l) => ({ value: l, label: l })),
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
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    {label}
                  </label>
                  <select
                    value={filters[key]}
                    onChange={(e) =>
                      setFilters({ ...filters, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
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

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredCourses.length === 0 ? (
          <div className="crs-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No courses found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm || Object.values(filters).some((v) => v !== "all")
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first course."}
            </p>
            <button
              onClick={() => navigate("/add-course")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add Course
            </button>
          </div>
        ) : (
          <div className="crs-animate">
            {/* ══════════════════════════════
                MOBILE CARDS  (< sm)
            ══════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedCourses.map((course, index) => {
                const plainText = stripHtml(course.text);
                return (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowViewModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        {course.image ? (
                          <img
                            src={getImageUrl(course.image)}
                            alt={course.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/48?text=C";
                            }}
                          />
                        ) : (
                          <BookOpen size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                          {course.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {plainText.slice(0, 60) || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
                      {course.category_details?.name && (
                        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {course.category_details.name}
                        </span>
                      )}
                      {course.level && (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getLevelClass(course.level)}`}
                        >
                          {course.level}
                        </span>
                      )}
                      {hasCert(course) && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-semibold flex items-center gap-1">
                          <Award size={10} /> Cert
                        </span>
                      )}
                      {course.students && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                          <Users size={11} /> {course.students}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-slate-100 flex">
                      {[
                        {
                          label: "View",
                          icon: Eye,
                          cls: "text-slate-500 hover:bg-slate-50",
                          fn: (e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                            setShowViewModal(true);
                          },
                        },
                        {
                          label: "Edit",
                          icon: Edit,
                          cls: "text-violet-600 hover:bg-violet-50",
                          fn: (e) => {
                            e.stopPropagation();
                            navigate(`/edit-course/${course.id}`);
                          },
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          cls: "text-red-500 hover:bg-red-50",
                          fn: (e) => handleDeleteClick(e, course),
                        },
                      ].map(({ label, icon: Icon, cls, fn }, i, arr) => (
                        <span key={label} className="flex-1 flex">
                          <button
                            onClick={fn}
                            className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold transition ${cls}`}
                          >
                            <Icon size={13} /> {label}
                          </button>
                          {i < arr.length - 1 && (
                            <div className="w-px bg-slate-100" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ══════════════════════════════
                DESKTOP TABLE (sm+)
            ══════════════════════════════ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          #
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Course <SortIcon col="name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden lg:table-cell">
                        <button
                          onClick={() => handleSort("category")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Category <SortIcon col="category" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Level
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort("students")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Students <SortIcon col="students" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Cert
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
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
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowViewModal(true);
                          }}
                        >
                          <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
                                {course.image ? (
                                  <img
                                    src={getImageUrl(course.image)}
                                    alt={course.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/44?text=C";
                                    }}
                                  />
                                ) : (
                                  <BookOpen
                                    size={15}
                                    className="text-slate-300"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate max-w-[160px] md:max-w-[220px] lg:max-w-[280px]">
                                  {course.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate max-w-[160px] md:max-w-[220px] lg:max-w-[280px] mt-0.5">
                                  <span className="lg:hidden text-violet-500 font-medium mr-1">
                                    {course.category_details?.name}
                                  </span>
                                  {plainText.slice(0, 50) || "No description"}
                                  {plainText.length > 50 ? "…" : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-sm text-slate-500 font-medium">
                              {course.category_details?.name || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {course.level ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getLevelClass(course.level)}`}
                              >
                                {course.level}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <Users size={13} className="text-slate-400" />
                              {course.students || (
                                <span className="text-slate-300">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            {hasCert(course) ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                                <Award size={10} /> Yes
                              </span>
                            ) : (
                              <span className="text-slate-300 text-sm">No</span>
                            )}
                          </td>
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCourse(course);
                                  setShowViewModal(true);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                title="View"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/edit-course/${course.id}`);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                                title="Edit"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, course)}
                                className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
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

              {/* Pagination — inside table card */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-600">
                    {indexOfFirstItem + 1}–
                    {Math.min(
                      indexOfFirstItem + itemsPerPage,
                      filteredCourses.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredCourses.length}
                  </strong>{" "}
                  courses
                </span>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={safePage === 1}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${safePage === page ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={safePage === totalPages}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile pagination */}
            <div className="sm:hidden mt-4 flex flex-col items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <strong className="text-slate-600">
                  {indexOfFirstItem + 1}–
                  {Math.min(
                    indexOfFirstItem + itemsPerPage,
                    filteredCourses.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {filteredCourses.length}
                </strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${safePage === page ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={safePage === totalPages}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          VIEW MODAL
      ══════════════════════════════════════ */}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="crs-animate relative bg-white w-full sm:max-w-xl md:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
            >
              <X size={14} className="text-slate-500" />
            </button>
            <div className="w-10 h-1 bg-slate-300/60 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Banner */}
            <div className="relative h-44 sm:h-52 bg-slate-900 flex-shrink-0 overflow-hidden">
              <img
                src={getImageUrl(
                  selectedCourse.banner_img || selectedCourse.image,
                )}
                alt={selectedCourse.name}
                className="w-full h-full object-cover opacity-75"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x224?text=Course";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-4">
                <h2 className="text-white text-base sm:text-xl font-bold mb-2 line-clamp-2">
                  {selectedCourse.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.category_details?.name && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white font-medium">
                      {selectedCourse.category_details.name}
                    </span>
                  )}
                  {selectedCourse.level && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getLevelClass(selectedCourse.level)}`}
                    >
                      {selectedCourse.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
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
                      className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center"
                    >
                      <s.icon
                        size={15}
                        className="text-violet-600 mx-auto mb-1"
                      />
                      <p className="text-xs text-slate-400 font-medium mb-0.5">
                        {s.label}
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {s.val}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  About this course
                </p>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {selectedCourse.text ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedCourse.text }}
                    />
                  ) : (
                    <p className="text-slate-400 italic">
                      No description available.
                    </p>
                  )}
                </div>
              </div>

              {selectedCourse.keywords && (
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourse.keywords.split(",").map((k, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        {k.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasCert(selectedCourse) && (
                <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <Award size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-amber-700">
                    Certificate of Completion included
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 flex-shrink-0">
              {selectedCourse.pdf_file && (
                <a
                  href={`${BASE_URL}/${selectedCourse.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 transition no-underline"
                >
                  <Download size={14} /> Syllabus
                </a>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-course/${selectedCourse.id}`);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                <Edit size={14} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════ */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() =>
              !deleteMutation.isPending && setShowDeleteModal(false)
            }
          />
          <div className="crs-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <button
              onClick={() =>
                !deleteMutation.isPending && setShowDeleteModal(false)
              }
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X size={15} />
            </button>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  Delete Course
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    "{courseToDelete.name}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteError && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
            <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-70 transition"
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
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

// import { useState, useEffect, useRef, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Search,
//   X,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   AlertCircle,
//   Layers,
//   FolderOpen,
//   Eye,
//   ChevronDown,
//   SortAsc,
//   SortDesc,
//   BookMarked,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Toasts from "./Toasts";

// // Fetch modules
// const fetchModules = async () => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/modules/",
//   );
//   const data = await response.json();
//   if (!data.success) throw new Error("Failed to fetch modules");
//   return data.data || [];
// };

// // Fetch courses
// const fetchCourses = async () => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/course/",
//   );
//   const data = await response.json();
//   // API returns { success: boolean, data: [...] } or just array?
//   return data.data || data || [];
// };

// // Delete module mutation
// const deleteModule = async (id) => {
//   const response = await fetch(
//     `https://codingcloudapi.codingcloud.co.in/modules/${id}/`,
//     {
//       method: "DELETE",
//     },
//   );
//   if (!response.ok && response.status !== 204) {
//     const data = await response.json().catch(() => ({}));
//     throw new Error(data.message || "Failed to delete module");
//   }
//   return id;
// };

// export default function Modules() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryClient = useQueryClient();

//   // --- TanStack Query for modules ---
//   const {
//     data: rawModules = [],
//     isLoading: modulesLoading,
//     error: modulesError,
//     isFetching: modulesFetching,
//     refetch: refetchModules,
//   } = useQuery({
//     queryKey: ["modules"],
//     queryFn: fetchModules,
//   });

//   // --- TanStack Query for courses ---
//   const {
//     data: coursesData = [],
//     isLoading: coursesLoading,
//     error: coursesError,
//   } = useQuery({
//     queryKey: ["courses"],
//     queryFn: fetchCourses,
//   });

//   // Build courses map
//   const coursesMap = useMemo(() => {
//     const map = {};
//     if (Array.isArray(coursesData)) {
//       coursesData.forEach((c) => {
//         map[c.id] = c.name;
//       });
//     }
//     return map;
//   }, [coursesData]);

//   // Compute unique course IDs from modules
//   const uniqueCourses = useMemo(() => {
//     const ids = rawModules.map((m) => m.course_data).filter(Boolean);
//     return [...new Set(ids)].sort((a, b) => a - b);
//   }, [rawModules]);

//   // Assign display_id based on sorted order (id descending)
//   const modules = useMemo(() => {
//     const sorted = [...rawModules].sort((a, b) => b.id - a.id);
//     return sorted.map((item, index) => ({
//       ...item,
//       display_id: index + 1,
//     }));
//   }, [rawModules]);

//   // Combined loading/error states
//   const loading = modulesLoading || coursesLoading;
//   const error = modulesError || coursesError;

//   // --- Delete mutation ---
//   const deleteMutation = useMutation({
//     mutationFn: deleteModule,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["modules"] });
//       setToast({
//         show: true,
//         message: "Module deleted successfully!",
//         type: "error", // original used "error" for success
//       });
//       setShowDeleteModal(false);
//       setModuleToDelete(null);
//     },
//     onError: (err) => {
//       setToast({
//         show: true,
//         message: err.message || "Failed to delete module.",
//         type: "error",
//       });
//     },
//     onSettled: () => {
//       setDeleteLoading(false);
//     },
//   });

//   // Local UI state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "id",
//     direction: "desc",
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({ course: "all" });
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [moduleToDelete, setModuleToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });

//   // Reset page when filters change
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

//   // Handle navigation state from add
//   useEffect(() => {
//     if (location.state?.fromAdd) {
//       setCurrentPage(1);
//       navigate(location.pathname, { replace: true, state: {} });
//     }
//   }, [location, navigate]);

//   // ── Derived filtered/sorted modules ──
//   const filteredModules = useMemo(() => {
//     let result = [...modules];

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           m.display_id.toString().includes(q) ||
//           (coursesMap[m.course_data] &&
//             coursesMap[m.course_data].toLowerCase().includes(q)),
//       );
//     }

//     if (filters.course !== "all")
//       result = result.filter((m) => m.course_data === parseInt(filters.course));

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "id") {
//         aVal = a.id || 0;
//         bVal = b.id || 0;
//       } else if (sortConfig.key === "name") {
//         aVal = a.name?.toLowerCase() || "";
//         bVal = b.name?.toLowerCase() || "";
//       } else if (sortConfig.key === "course") {
//         aVal =
//           coursesMap[a.course_data]?.toLowerCase() || String(a.course_data);
//         bVal =
//           coursesMap[b.course_data]?.toLowerCase() || String(b.course_data);
//       }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   }, [modules, searchTerm, filters, sortConfig, coursesMap]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredModules.length / itemsPerPage),
//   );
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedModules = filteredModules.slice(
//     indexOfFirstItem,
//     indexOfFirstItem + itemsPerPage,
//   );

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

//   const handleDeleteClick = (e, module) => {
//     e.stopPropagation();
//     setModuleToDelete(module);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!moduleToDelete) return;
//     setDeleteLoading(true);
//     deleteMutation.mutate(moduleToDelete.id);
//   };

//   const activeFiltersCount = [filters.course !== "all"].filter(Boolean).length;

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

//   if (loading) {
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
//             Loading modules…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
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
//             {error.message}
//           </p>
//           <button
//             onClick={() => refetchModules()}
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
//         @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
//         .mod-animate { animation: fadeSlideIn 0.22s ease forwards; }
//         .mod-row { transition: background 0.13s; cursor: pointer; }
//         .mod-row:hover { background: #fafafa; }
//         .mod-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
//         .mod-action-btn.view:hover { background: #f1f5f9; color: #475569; }
//         .mod-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
//         .mod-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }
//         .mod-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
//         .mod-th-btn:hover { color: #475569; }
//         .mod-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
//         .mod-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .mod-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .mod-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//         .mod-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
//         .mod-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .mod-search::placeholder { color: #cbd5e1; }
//         .mod-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .mod-select:focus { border-color: #7c3aed; }
//         .mod-filter-select { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .mod-filter-select:focus { border-color: #7c3aed; }
//         .mod-add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(124,58,237,0.28); transition: opacity 0.15s; font-family: inherit; flex-shrink: 0; }
//         .mod-add-btn:hover { opacity: 0.9; }
//         .mod-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; flex-shrink: 0; }
//         .mod-filter-btn.active { border-color: #a78bfa; background: #f5f3ff; color: #6d28d9; }
//         .mod-filter-btn:hover { background: #f8fafc; }
//       `}</style>

//       {toast.show && (
//         <Toasts
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}

//       <div style={{ padding: "28px 16px" }}>
//         {/* ── Header ── */}
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
//               <Layers size={17} color="#fff" />
//             </div>
//             <h1
//               style={{
//                 fontSize: 22,
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               Modules
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
//               {modules.length}
//             </span>
//           </div>
//           <p
//             style={{
//               fontSize: 14,
//               color: "#94a3b8",
//               margin: 0,
//               paddingLeft: 48,
//             }}
//           >
//             Manage your course modules and lessons
//           </p>
//         </div>

//         {/* ── Toolbar ── */}
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
//                 className="mod-search"
//                 type="text"
//                 placeholder="Search by module name, course or ID…"
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
//                 className="mod-select"
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

//             {/* Filter toggle */}
//             <button
//               className={`mod-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
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

//             {/* Add Module */}
//             <button
//               className="mod-add-btn"
//               onClick={() => navigate("/add-module")}
//             >
//               <Plus size={16} /> Add Module
//             </button>
//           </div>

//           {/* Expandable filter — Course only */}
//           {showFilters && (
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                 gap: 14,
//                 marginTop: 14,
//                 paddingTop: 14,
//                 borderTop: "1px solid #f1f5f9",
//               }}
//             >
//               <div>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: 11,
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.07em",
//                     color: "#94a3b8",
//                     marginBottom: 6,
//                   }}
//                 >
//                   Course
//                 </label>
//                 <select
//                   className="mod-filter-select"
//                   value={filters.course}
//                   onChange={(e) => setFilters({ course: e.target.value })}
//                 >
//                   <option value="all">All Courses</option>
//                   {uniqueCourses.map((courseId) => (
//                     <option key={courseId} value={courseId}>
//                       {coursesMap[courseId] || `Course ${courseId}`} (
//                       {modules.filter((m) => m.course_data === courseId).length}
//                       )
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Gap ── */}
//         <div style={{ height: 20 }} />

//         {/* ── Table / Empty ── */}
//         {filteredModules.length === 0 ? (
//           <div
//             className="mod-animate"
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
//               <Layers size={27} color="#cbd5e1" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: "#1e293b",
//                 margin: "0 0 6px",
//               }}
//             >
//               No modules found
//             </h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm || filters.course !== "all"
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first module."}
//             </p>
//             <button
//               onClick={() => navigate("/add-module")}
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
//               <Plus size={15} /> Add Module
//             </button>
//           </div>
//         ) : (
//           <div
//             className="mod-animate"
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               border: "1px solid #e2e8f0",
//               overflow: "hidden",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//             }}
//           >
//             {/* Silent refresh bar */}
//             {modulesFetching && (
//               <div
//                 style={{
//                   height: 3,
//                   background:
//                     "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)",
//                   backgroundSize: "200% 100%",
//                   animation: "shimmer 1.2s linear infinite",
//                 }}
//               />
//             )}

//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   minWidth: 500,
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
//                         width: 56,
//                       }}
//                     >
//                       <button
//                         className="mod-th-btn"
//                         onClick={() => handleSort("id")}
//                       >
//                         # <SortIcon col="id" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="mod-th-btn"
//                         onClick={() => handleSort("name")}
//                       >
//                         Module Name <SortIcon col="name" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="mod-th-btn"
//                         onClick={() => handleSort("course")}
//                       >
//                         Course <SortIcon col="course" />
//                       </button>
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
//                   {paginatedModules.map((module, index) => (
//                     <tr
//                       key={module.id}
//                       className="mod-row"
//                       style={{ borderBottom: "1px solid #f1f5f9" }}
//                       onClick={() => {
//                         setSelectedModule(module);
//                         setShowViewModal(true);
//                       }}
//                     >
//                       {/* # */}
//                       <td
//                         style={{
//                           padding: "15px 18px",
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#cbd5e1",
//                         }}
//                       >
//                         {indexOfFirstItem + index + 1}
//                       </td>

//                       {/* Module name */}
//                       <td style={{ padding: "15px 18px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 12,
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: 38,
//                               height: 38,
//                               background: "#f5f3ff",
//                               borderRadius: 10,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               flexShrink: 0,
//                             }}
//                           >
//                             <BookMarked size={15} color="#7c3aed" />
//                           </div>
//                           <span
//                             style={{
//                               fontSize: 15,
//                               fontWeight: 600,
//                               color: "#1e293b",
//                             }}
//                           >
//                             {module.name}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Course badge */}
//                       <td style={{ padding: "15px 18px" }}>
//                         <span
//                           style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: 5,
//                             padding: "4px 11px",
//                             background: "#f5f3ff",
//                             color: "#6d28d9",
//                             border: "1px solid #ddd6fe",
//                             fontSize: 13,
//                             fontWeight: 600,
//                             borderRadius: 99,
//                           }}
//                         >
//                           <FolderOpen size={11} />
//                           {coursesMap[module.course_data] ||
//                             `Course ${module.course_data}`}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td
//                         style={{ padding: "15px 18px" }}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "flex-end",
//                             gap: 4,
//                           }}
//                         >
//                           <button
//                             className="mod-action-btn view"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedModule(module);
//                               setShowViewModal(true);
//                             }}
//                             title="View"
//                           >
//                             <Eye size={15} />
//                           </button>
//                           <button
//                             className="mod-action-btn edit"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/edit-module/${module.id}`);
//                             }}
//                             title="Edit"
//                           >
//                             <Edit size={15} />
//                           </button>
//                           <button
//                             className="mod-action-btn del"
//                             onClick={(e) => handleDeleteClick(e, module)}
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

//             {/* ── Pagination ── */}
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
//                     filteredModules.length,
//                   )}
//                 </strong>{" "}
//                 of{" "}
//                 <strong style={{ color: "#475569" }}>
//                   {filteredModules.length}
//                 </strong>{" "}
//                 modules
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button
//                   className="mod-page-btn"
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={safePage === 1}
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page) => (
//                   <button
//                     key={page}
//                     className={`mod-page-btn${safePage === page ? " active" : ""}`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   className="mod-page-btn"
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

//       {/* ── View Modal ── */}
//       {showViewModal && selectedModule && (
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
//               background: "rgba(15,23,42,0.5)",
//               backdropFilter: "blur(4px)",
//             }}
//             onClick={() => setShowViewModal(false)}
//           />
//           <div
//             className="mod-animate"
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//               maxWidth: 520,
//               width: "100%",
//               zIndex: 10,
//               overflow: "hidden",
//             }}
//           >
//             <button
//               onClick={() => setShowViewModal(false)}
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

//             <div style={{ padding: 24 }}>
//               {/* Icon + title */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 14,
//                   marginBottom: 22,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 52,
//                     height: 52,
//                     background: "#f5f3ff",
//                     borderRadius: 14,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <BookMarked size={24} color="#7c3aed" />
//                 </div>
//                 <h2
//                   style={{
//                     fontSize: 20,
//                     fontWeight: 700,
//                     color: "#0f172a",
//                     margin: 0,
//                   }}
//                 >
//                   {selectedModule.name}
//                 </h2>
//               </div>

//               {/* Course */}
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   border: "1px solid #f1f5f9",
//                   borderRadius: 12,
//                   padding: 16,
//                   marginBottom: 14,
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.07em",
//                     color: "#94a3b8",
//                     margin: "0 0 6px",
//                   }}
//                 >
//                   Course
//                 </p>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <FolderOpen size={15} color="#7c3aed" />
//                   <p
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 600,
//                       color: "#1e293b",
//                       margin: 0,
//                     }}
//                   >
//                     {coursesMap[selectedModule.course_data] ||
//                       `Course ${selectedModule.course_data}`}
//                   </p>
//                 </div>
//               </div>

//               {/* Description */}
//               {selectedModule.descriptions && (
//                 <div
//                   style={{
//                     background: "#f8fafc",
//                     border: "1px solid #f1f5f9",
//                     borderRadius: 12,
//                     padding: 16,
//                   }}
//                 >
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
//                     Description
//                   </p>
//                   <div
//                     style={{
//                       fontSize: 14.5,
//                       color: "#475569",
//                       lineHeight: 1.65,
//                     }}
//                     dangerouslySetInnerHTML={{
//                       __html: selectedModule.descriptions,
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div
//               style={{
//                 padding: "14px 24px",
//                 background: "#f8fafc",
//                 borderTop: "1px solid #f1f5f9",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 10,
//               }}
//             >
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
//                   navigate(`/edit-module/${selectedModule.id}`);
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
//                 <Edit size={14} /> Edit Module
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {showDeleteModal && moduleToDelete && (
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
//             onClick={() => !deleteLoading && setShowDeleteModal(false)}
//           />
//           <div
//             className="mod-animate"
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
//               onClick={() => !deleteLoading && setShowDeleteModal(false)}
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
//                   Delete Module
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
//                     "{moduleToDelete.name}"
//                   </strong>
//                   ? This action cannot be undone.
//                 </p>
//               </div>
//             </div>
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
//                 disabled={deleteLoading}
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
//                 disabled={deleteLoading}
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
//                   opacity: deleteLoading ? 0.7 : 1,
//                   fontFamily: "inherit",
//                 }}
//               >
//                 {deleteLoading ? (
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
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  X,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Layers,
  FolderOpen,
  Eye,
  ChevronDown,
  SortAsc,
  SortDesc,
  BookMarked,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Toasts from "./Toasts";

/* ─── API helpers ─────────────────────────────────── */
const BASE = "https://codingcloudapi.codingcloud.co.in";

const fetchModules = async () => {
  const res = await fetch(`${BASE}/modules/`);
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch modules");
  return data.data || [];
};

const fetchCourses = async () => {
  const res = await fetch(`${BASE}/course/`);
  const data = await res.json();
  return data.data || data || [];
};

const deleteModuleApi = async (id) => {
  const res = await fetch(`${BASE}/modules/${id}/`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete module");
  }
  return id;
};

/* ─── Component ───────────────────────────────────── */
export default function Modules() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  /* queries */
  const {
    data: rawModules = [],
    isLoading: modulesLoading,
    error: modulesError,
    isFetching: modulesFetching,
    refetch: refetchModules,
  } = useQuery({ queryKey: ["modules"], queryFn: fetchModules });

  const {
    data: coursesData = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });

  /* derived maps */
  const coursesMap = useMemo(() => {
    const map = {};
    if (Array.isArray(coursesData))
      coursesData.forEach((c) => {
        map[c.id] = c.name;
      });
    return map;
  }, [coursesData]);

  const uniqueCourses = useMemo(
    () =>
      [...new Set(rawModules.map((m) => m.course_data).filter(Boolean))].sort(
        (a, b) => a - b,
      ),
    [rawModules],
  );

  const modules = useMemo(() => {
    const sorted = [...rawModules].sort((a, b) => b.id - a.id);
    return sorted.map((item, index) => ({ ...item, display_id: index + 1 }));
  }, [rawModules]);

  /* delete mutation */
  const deleteMutation = useMutation({
    mutationFn: deleteModuleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      setToast({
        show: true,
        message: "Module deleted successfully!",
        type: "error",
      });
      setShowDeleteModal(false);
      setModuleToDelete(null);
    },
    onError: (err) => {
      setToast({
        show: true,
        message: err.message || "Failed to delete module.",
        type: "error",
      });
    },
    onSettled: () => setDeleteLoading(false),
  });

  /* UI state */
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: "all" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  /* reset page on dep change */
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

  useEffect(() => {
    if (location.state?.fromAdd) {
      setCurrentPage(1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  /* filtered + sorted modules */
  const filteredModules = useMemo(() => {
    let result = [...modules];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.display_id.toString().includes(q) ||
          (coursesMap[m.course_data] &&
            coursesMap[m.course_data].toLowerCase().includes(q)),
      );
    }
    if (filters.course !== "all")
      result = result.filter((m) => m.course_data === parseInt(filters.course));

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") {
        aVal = a.id || 0;
        bVal = b.id || 0;
      } else if (sortConfig.key === "name") {
        aVal = a.name?.toLowerCase() || "";
        bVal = b.name?.toLowerCase() || "";
      } else if (sortConfig.key === "course") {
        aVal =
          coursesMap[a.course_data]?.toLowerCase() || String(a.course_data);
        bVal =
          coursesMap[b.course_data]?.toLowerCase() || String(b.course_data);
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [modules, searchTerm, filters, sortConfig, coursesMap]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredModules.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedModules = filteredModules.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

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

  const handleDeleteClick = (e, module) => {
    e.stopPropagation();
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!moduleToDelete) return;
    setDeleteLoading(true);
    deleteMutation.mutate(moduleToDelete.id);
  };

  const activeFiltersCount = [filters.course !== "all"].filter(Boolean).length;

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

  const loading = modulesLoading || coursesLoading;
  const error = modulesError || coursesError;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading modules…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-400 mb-5">{error.message}</p>
          <button
            onClick={() => refetchModules()}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="min-h-screen ">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .mod-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .shimmer-bar  { background: linear-gradient(90deg,#7c3aed,#a78bfa,#7c3aed); background-size:200% 100%; animation: shimmer 1.2s linear infinite; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="w-full max-w-screen-xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <Layers size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
              Modules
            </h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {modules.length}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile: search full width */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search modules…"
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

          {/* Mobile: controls row */}
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
              onClick={() => navigate("/add-module")}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition flex-shrink-0"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Tablet / Desktop: single row */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by module name, course or ID…"
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
              onClick={() => navigate("/add-module")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
            >
              <Plus size={15} /> Add Module
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-3 pt-3.5 border-t border-slate-100">
              <div className="max-w-xs">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Course
                </label>
                <select
                  value={filters.course}
                  onChange={(e) => setFilters({ course: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((courseId) => (
                    <option key={courseId} value={courseId}>
                      {coursesMap[courseId] || `Course ${courseId}`} (
                      {modules.filter((m) => m.course_data === courseId).length}
                      )
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredModules.length === 0 ? (
          <div className="mod-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No modules found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm || filters.course !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first module."}
            </p>
            <button
              onClick={() => navigate("/add-module")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add Module
            </button>
          </div>
        ) : (
          <div className="mod-animate">
            {/* ══════════════════════════════
                MOBILE CARDS  (< sm)
            ══════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedModules.map((module, index) => (
                <div
                  key={module.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                  onClick={() => {
                    setSelectedModule(module);
                    setShowViewModal(true);
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-4">
                    {/* Icon */}
                    <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookMarked size={18} className="text-violet-600" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {module.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <FolderOpen
                          size={11}
                          className="text-violet-400 flex-shrink-0"
                        />
                        <span className="text-xs text-violet-600 font-medium truncate">
                          {coursesMap[module.course_data] ||
                            `Course ${module.course_data}`}
                        </span>
                      </div>
                    </div>
                    {/* Row number */}
                    <span className="text-xs text-slate-300 font-semibold flex-shrink-0">
                      #{indexOfFirstItem + index + 1}
                    </span>
                  </div>

                  {/* Action bar */}
                  <div className="border-t border-slate-100 flex">
                    {[
                      {
                        label: "View",
                        icon: Eye,
                        cls: "text-slate-500 hover:bg-slate-50",
                        fn: (e) => {
                          e.stopPropagation();
                          setSelectedModule(module);
                          setShowViewModal(true);
                        },
                      },
                      {
                        label: "Edit",
                        icon: Edit,
                        cls: "text-violet-600 hover:bg-violet-50",
                        fn: (e) => {
                          e.stopPropagation();
                          navigate(`/edit-module/${module.id}`);
                        },
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        cls: "text-red-500 hover:bg-red-50",
                        fn: (e) => handleDeleteClick(e, module),
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
              ))}
            </div>

            {/* ══════════════════════════════
                DESKTOP TABLE  (sm+)
            ══════════════════════════════ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Silent refresh shimmer */}
              {modulesFetching && <div className="shimmer-bar h-0.5 w-full" />}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-12">
                        <button
                          onClick={() => handleSort("id")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          # <SortIcon col="id" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Module Name <SortIcon col="name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort("course")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Course <SortIcon col="course" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedModules.map((module, index) => (
                      <tr
                        key={module.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedModule(module);
                          setShowViewModal(true);
                        }}
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <BookMarked
                                size={15}
                                className="text-violet-600"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-semibold text-slate-800 block truncate max-w-[200px] sm:max-w-[260px]">
                                {module.name}
                              </span>
                              {/* Show course inline on sm (before md column appears) */}
                              <div className="flex items-center gap-1 mt-0.5 md:hidden">
                                <FolderOpen
                                  size={10}
                                  className="text-violet-400 flex-shrink-0"
                                />
                                <span className="text-xs text-violet-600 font-medium truncate max-w-[180px]">
                                  {coursesMap[module.course_data] ||
                                    `Course ${module.course_data}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold rounded-full">
                            <FolderOpen size={11} />
                            {coursesMap[module.course_data] ||
                              `Course ${module.course_data}`}
                          </span>
                        </td>
                        <td
                          className="px-4 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedModule(module);
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
                                navigate(`/edit-module/${module.id}`);
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, module)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination inside card */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-600">
                    {indexOfFirstItem + 1}–
                    {Math.min(
                      indexOfFirstItem + itemsPerPage,
                      filteredModules.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredModules.length}
                  </strong>{" "}
                  modules
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
                    filteredModules.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {filteredModules.length}
                </strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
      {showViewModal && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="mod-animate relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden">
            {/* Drag handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Close */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition z-10"
            >
              <X size={15} />
            </button>

            {/* Body */}
            <div className="px-5 sm:px-6 py-5 sm:py-6">
              {/* Icon + title */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-13 h-13 w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookMarked size={22} className="text-violet-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedModule.name}
                </h2>
              </div>

              {/* Course */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3.5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Course
                </p>
                <div className="flex items-center gap-2">
                  <FolderOpen
                    size={15}
                    className="text-violet-600 flex-shrink-0"
                  />
                  <p className="text-sm font-semibold text-slate-800">
                    {coursesMap[selectedModule.course_data] ||
                      `Course ${selectedModule.course_data}`}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedModule.descriptions && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                    Description
                  </p>
                  <div
                    className="text-sm text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedModule.descriptions,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-module/${selectedModule.id}`);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                <Edit size={14} /> Edit Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════ */}
      {showDeleteModal && moduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="mod-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <button
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
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
                  Delete Module
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    "{moduleToDelete.name}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-70 transition"
              >
                {deleteLoading ? (
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

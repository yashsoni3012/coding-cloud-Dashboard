// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search, X, Filter, Plus, Eye, Edit, Trash2,
//   AlertCircle, BookMarked, Layers, ChevronDown,
//   SortAsc, SortDesc, ChevronLeft, ChevronRight,
// } from "lucide-react";
// import Toasts from "./Toasts";

// export default function Topics() {
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [topicsData, setTopicsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({ course: "all", module: "all" });
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [uniqueCourses, setUniqueCourses] = useState([]);
//   const [uniqueModules, setUniqueModules] = useState([]);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [topicToDelete, setTopicToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });

//   const parseTopics = (data) => {
//     let displayId = 1;
//     return data.map((module) => ({
//       ...module,
//       topics: module.topics.map((topic) => ({
//         ...topic,
//         display_id: displayId++,
//         module_name: module.module_name,
//         module_id: module.module_id,
//       })),
//     }));
//   };

//   const fetchData = async (silent = false) => {
//     silent ? setRefreshing(true) : setLoading(true);
//     try {
//       const [coursesRes, topicsRes] = await Promise.all([
//         fetch("https://codingcloud.pythonanywhere.com/course/"),
//         fetch("https://codingcloud.pythonanywhere.com/topics/"),
//       ]);
//       const coursesData = await coursesRes.json();
//       const topicsJson = await topicsRes.json();

//       if (coursesData.success) {
//         setCourses(coursesData.data);
//         setUniqueCourses(coursesData.data);
//       }
//       if (topicsJson.status === "success") {
//         const parsed = parseTopics(topicsJson.data);
//         setTopicsData(parsed);
//         setUniqueModules(parsed.map((m) => ({ id: m.module_id, name: m.module_name })));
//       } else {
//         if (!silent) setError("Failed to fetch topics.");
//       }
//     } catch {
//       if (!silent) setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const refreshTopicsOnly = async () => {
//     setRefreshing(true);
//     try {
//       const topicsRes = await fetch("https://codingcloud.pythonanywhere.com/topics/");
//       const topicsJson = await topicsRes.json();
//       if (topicsJson.status === "success") {
//         const parsed = parseTopics(topicsJson.data);
//         setTopicsData(parsed);
//         setUniqueModules(parsed.map((m) => ({ id: m.module_id, name: m.module_name })));
//       }
//     } catch { /* silent fail */ }
//     finally { setRefreshing(false); }
//   };

//   useEffect(() => { fetchData(false); }, []);

//   // ── Derived — no state, no jerk ──
//   const filteredTopics = (() => {
//     let result = topicsData.flatMap((m) => m.topics);

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter(
//         (t) =>
//           t.name.toLowerCase().includes(q) ||
//           t.module_name.toLowerCase().includes(q) ||
//           t.display_id.toString().includes(q) ||
//           t.id.toString().includes(q)
//       );
//     }

//     if (filters.course !== "all") {
//       const course = courses.find((c) => c.id === parseInt(filters.course));
//       if (course) result = result.filter((t) => t.module_name.toLowerCase().includes(course.name.toLowerCase()));
//     }

//     if (filters.module !== "all")
//       result = result.filter((t) => t.module_id === parseInt(filters.module));

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "display_id")       { aVal = a.display_id || 0; bVal = b.display_id || 0; }
//       else if (sortConfig.key === "name")         { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
//       else if (sortConfig.key === "module_name")  { aVal = a.module_name?.toLowerCase() || ""; bVal = b.module_name?.toLowerCase() || ""; }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   })();

//   const totalPages = Math.max(1, Math.ceil(filteredTopics.length / itemsPerPage));
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedTopics = filteredTopics.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

//   // Reset page on dependency change
//   useEffect(() => {
//     const p = prevDeps.current;
//     if (p.searchTerm !== searchTerm || p.sortConfig !== sortConfig || p.itemsPerPage !== itemsPerPage || p.filters !== filters) {
//       setCurrentPage(1);
//       prevDeps.current = { searchTerm, sortConfig, itemsPerPage, filters };
//     }
//   }, [searchTerm, sortConfig, itemsPerPage, filters]);

//   const handleSort = (key) =>
//     setSortConfig((c) => ({ key, direction: c.key === key && c.direction === "asc" ? "desc" : "asc" }));

//   const SortIcon = ({ col }) => {
//     if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
//     return sortConfig.direction === "asc"
//       ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
//       : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
//   };

//   const handleDeleteClick = (e, topic) => {
//     e.stopPropagation();
//     setTopicToDelete(topic);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!topicToDelete) return;
//     setDeleteLoading(true);
//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/topics/${topicToDelete.id}/`,
//         { method: "DELETE" }
//       );
//       if (response.ok || response.status === 204) {
//         setToast({ show: true, message: "Topic deleted successfully!", type: "error" });
//         refreshTopicsOnly();
//         setShowDeleteModal(false);
//         setTopicToDelete(null);
//       } else {
//         const data = await response.json().catch(() => ({}));
//         setToast({ show: true, message: data.message || "Failed to delete topic.", type: "error" });
//       }
//     } catch {
//       setToast({ show: true, message: "Network error. Please try again.", type: "error" });
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const activeFiltersCount = [filters.course !== "all", filters.module !== "all"].filter(Boolean).length;
//   const totalTopics = topicsData.flatMap((m) => m.topics).length;

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
//           <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading topics…</p>
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
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
//         @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         .top-animate { animation: fadeSlideIn 0.22s ease forwards; }
//         .top-row { transition: background 0.13s; cursor: pointer; }
//         .top-row:hover { background: #fafafa; }
//         .top-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
//         .top-action-btn.view:hover { background: #f1f5f9; color: #475569; }
//         .top-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
//         .top-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }
//         .top-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
//         .top-th-btn:hover { color: #475569; }
//         .top-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
//         .top-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .top-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .top-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//         .top-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
//         .top-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .top-search::placeholder { color: #cbd5e1; }
//         .top-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .top-select:focus { border-color: #7c3aed; }
//         .top-filter-select { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .top-filter-select:focus { border-color: #7c3aed; }
//         .top-filter-select:disabled { opacity: 0.5; cursor: not-allowed; }
//         .top-add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(124,58,237,0.28); transition: opacity 0.15s; font-family: inherit; flex-shrink: 0; }
//         .top-add-btn:hover { opacity: 0.9; }
//         .top-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; flex-shrink: 0; }
//         .top-filter-btn.active { border-color: #a78bfa; background: #f5f3ff; color: #6d28d9; }
//         .top-filter-btn:hover { background: #f8fafc; }
//       `}</style>

//       {toast.show && <Toasts message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

//       <div style={{ padding: "28px 16px" }}>

//         {/* ── Header ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
//             <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
//               <BookMarked size={17} color="#fff" />
//             </div>
//             <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Topics</h1>
//             <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{totalTopics}</span>
//           </div>
//           <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage your lesson topics across modules</p>
//         </div>

//         {/* ── Toolbar ── */}
//         <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
//           <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

//             {/* Search */}
//             <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
//               <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
//               <input
//                 className="top-search"
//                 type="text"
//                 placeholder="Search by topic name, module or ID…"
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
//               <select className="top-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//               <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
//             </div>

//             {/* Filter toggle */}
//             <button
//               className={`top-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span style={{ padding: "1px 7px", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 99 }}>{activeFiltersCount}</span>
//               )}
//               <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
//             </button>

//             {/* Add Topic */}
//             <button className="top-add-btn" onClick={() => navigate("/add-topic")}>
//               <Plus size={16} /> Add Topic
//             </button>
//           </div>

//           {/* Expandable filter panel */}
//           {showFilters && (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
//               {/* Course */}
//               <div>
//                 <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Course</label>
//                 <select
//                   className="top-filter-select"
//                   value={filters.course}
//                   onChange={(e) => setFilters({ ...filters, course: e.target.value, module: "all" })}
//                 >
//                   <option value="all">All Courses</option>
//                   {uniqueCourses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                 </select>
//               </div>
//               {/* Module */}
//               <div>
//                 <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Module</label>
//                 <select
//                   className="top-filter-select"
//                   value={filters.module}
//                   onChange={(e) => setFilters({ ...filters, module: e.target.value })}
//                   disabled={filters.course === "all"}
//                 >
//                   <option value="all">All Modules</option>
//                   {uniqueModules
//                     .filter((m) => {
//                       if (filters.course === "all") return true;
//                       const course = courses.find((c) => c.id === parseInt(filters.course));
//                       return course && m.name.toLowerCase().includes(course.name.toLowerCase());
//                     })
//                     .map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Gap ── */}
//         <div style={{ height: 20 }} />

//         {/* ── Table / Empty ── */}
//         {filteredTopics.length === 0 ? (
//           <div className="top-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
//             <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//               <BookMarked size={27} color="#cbd5e1" />
//             </div>
//             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No topics found</h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm || filters.course !== "all" || filters.module !== "all"
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first topic."}
//             </p>
//             <button onClick={() => navigate("/add-topic")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}>
//               <Plus size={15} /> Add Topic
//             </button>
//           </div>
//         ) : (
//           <div className="top-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

//             {/* Silent refresh bar */}
//             {refreshing && (
//               <div style={{ height: 3, background: "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)", backgroundSize: "200% 100%", animation: "shimmer 1.2s linear infinite" }} />
//             )}

//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", minWidth: 500, borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
//                     <th style={{ padding: "14px 18px", textAlign: "left", width: 56 }}>
//                       <button className="top-th-btn" onClick={() => handleSort("display_id")}># <SortIcon col="display_id" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button className="top-th-btn" onClick={() => handleSort("name")}>Topic Name <SortIcon col="name" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button className="top-th-btn" onClick={() => handleSort("module_name")}>Module <SortIcon col="module_name" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "right" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedTopics.map((topic, index) => (
//                     <tr
//                       key={topic.id}
//                       className="top-row"
//                       style={{ borderBottom: "1px solid #f1f5f9" }}
//                       onClick={() => { setSelectedTopic(topic); setShowViewModal(true); }}
//                     >
//                       {/* # */}
//                       <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
//                         {indexOfFirstItem + index + 1}
//                       </td>

//                       {/* Topic name */}
//                       <td style={{ padding: "15px 18px" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                           <div style={{ width: 38, height: 38, background: "#f5f3ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                             <BookMarked size={15} color="#7c3aed" />
//                           </div>
//                           <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{topic.name}</span>
//                         </div>
//                       </td>

//                       {/* Module badge */}
//                       <td style={{ padding: "15px 18px" }}>
//                         <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", fontSize: 13, fontWeight: 600, borderRadius: 99 }}>
//                           <Layers size={11} />
//                           {topic.module_name}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
//                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
//                           <button className="top-action-btn view" onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); setShowViewModal(true); }} title="View"><Eye size={15} /></button>
//                           <button className="top-action-btn edit" onClick={(e) => { e.stopPropagation(); navigate(`/edit-topic/${topic.id}`, { state: { topic } }); }} title="Edit"><Edit size={15} /></button>
//                           <button className="top-action-btn del" onClick={(e) => handleDeleteClick(e, topic)} title="Delete"><Trash2 size={15} /></button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* ── Pagination ── */}
//             <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
//               <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
//                 Showing{" "}
//                 <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredTopics.length)}</strong>
//                 {" "}of{" "}
//                 <strong style={{ color: "#475569" }}>{filteredTopics.length}</strong> topics
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button className="top-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}><ChevronLeft size={15} /></button>
//                 {getPageNumbers().map((page) => (
//                   <button key={page} className={`top-page-btn${safePage === page ? " active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
//                 ))}
//                 <button className="top-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}><ChevronRight size={15} /></button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── View Modal ── */}
//       {showViewModal && selectedTopic && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setShowViewModal(false)} />
//           <div className="top-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 480, width: "100%", zIndex: 10, overflow: "hidden" }}>
//             <button onClick={() => setShowViewModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}>
//               <X size={15} />
//             </button>

//             <div style={{ padding: 24 }}>
//               {/* Icon + title */}
//               <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
//                 <div style={{ width: 52, height: 52, background: "#f5f3ff", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                   <BookMarked size={24} color="#7c3aed" />
//                 </div>
//                 <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{selectedTopic.name}</h2>
//               </div>

//               {/* Module info */}
//               <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 16 }}>
//                 <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
//                   <Layers size={11} /> Module
//                 </p>
//                 <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>{selectedTopic.module_name}</p>
//               </div>
//             </div>

//             <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10 }}>
//               <button onClick={() => setShowViewModal(false)} style={{ padding: "9px 18px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
//                 Close
//               </button>
//               <button onClick={() => { setShowViewModal(false); navigate(`/edit-topic/${selectedTopic.id}`, { state: { topic: selectedTopic } }); }} style={{ padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" }}>
//                 <Edit size={14} /> Edit Topic
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {showDeleteModal && topicToDelete && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }} onClick={() => !deleteLoading && setShowDeleteModal(false)} />
//           <div className="top-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 420, width: "100%", padding: 26, zIndex: 10 }}>
//             <button onClick={() => !deleteLoading && setShowDeleteModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}>
//               <X size={15} />
//             </button>
//             <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//               <div style={{ width: 46, height: 46, background: "#fef2f2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <AlertCircle size={22} color="#ef4444" />
//               </div>
//               <div>
//                 <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 7px" }}>Delete Topic</h3>
//                 <p style={{ fontSize: 14.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
//                   Are you sure you want to delete <strong style={{ color: "#1e293b" }}>"{topicToDelete.name}"</strong>? This action cannot be undone.
//                 </p>
//               </div>
//             </div>
//             <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
//               <button onClick={() => setShowDeleteModal(false)} disabled={deleteLoading} style={{ padding: "10px 20px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
//                 Cancel
//               </button>
//               <button onClick={handleDeleteConfirm} disabled={deleteLoading} style={{ padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: deleteLoading ? 0.7 : 1, fontFamily: "inherit" }}>
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
  Search, X, Filter, Plus, Eye, Edit, Trash2,
  AlertCircle, BookMarked, Layers, ChevronDown,
  SortAsc, SortDesc, ChevronLeft, ChevronRight,
} from "lucide-react";
import Toasts from "./Toasts";

// Fetch courses
const fetchCourses = async () => {
  const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch courses");
  return data.data || [];
};

// Fetch topics
const fetchTopics = async () => {
  const response = await fetch("https://codingcloud.pythonanywhere.com/topics/");
  const data = await response.json();
  if (data.status !== "success") throw new Error("Failed to fetch topics");
  return data.data || [];
};

// Delete topic mutation
const deleteTopic = async (id) => {
  const response = await fetch(`https://codingcloud.pythonanywhere.com/topics/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete topic");
  }
  return id;
};

export default function Topics() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- TanStack Query: fetch courses ---
  const {
    data: coursesData = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // --- TanStack Query: fetch topics ---
  const {
    data: rawTopicsData = [],
    isLoading: topicsLoading,
    isFetching: topicsFetching,
    error: topicsError,
    refetch: refetchTopics,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  // Combine loading/error states
  const loading = coursesLoading || topicsLoading;
  const error = coursesError || topicsError;

  // --- Delete mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => {
      // Invalidate topics list so it refreshes
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      setToast({ show: true, message: "Topic deleted successfully!", type: "error" });
      setShowDeleteModal(false);
      setTopicToDelete(null);
    },
    onError: (err) => {
      setToast({ show: true, message: err.message || "Failed to delete topic.", type: "error" });
    },
    onSettled: () => {
      setDeleteLoading(false);
    },
  });

  // Helper to parse topics with display_id and module info
  const parseTopics = (data) => {
    let displayId = 1;
    return data.map((module) => ({
      ...module,
      topics: module.topics.map((topic) => ({
        ...topic,
        display_id: displayId++,
        module_name: module.module_name,
        module_id: module.module_id,
      })),
    }));
  };

  // Local state (derived from query data)
  const [courses, setCourses] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [uniqueModules, setUniqueModules] = useState([]);

  // Update local state when query data arrives
  useEffect(() => {
    setCourses(coursesData);
    setUniqueCourses(coursesData);
  }, [coursesData]);

  useEffect(() => {
    if (rawTopicsData.length) {
      const parsed = parseTopics(rawTopicsData);
      setTopicsData(parsed);
      setUniqueModules(parsed.map((m) => ({ id: m.module_id, name: m.module_name })));
    }
  }, [rawTopicsData]);

  // Local UI state (unchanged)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: "all", module: "all" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });

  // ── Derived filtered topics (identical) ──
  const filteredTopics = useMemo(() => {
    let result = topicsData.flatMap((m) => m.topics);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.module_name.toLowerCase().includes(q) ||
          t.display_id.toString().includes(q) ||
          t.id.toString().includes(q)
      );
    }

    if (filters.course !== "all") {
      const course = courses.find((c) => c.id === parseInt(filters.course));
      if (course) result = result.filter((t) => t.module_name.toLowerCase().includes(course.name.toLowerCase()));
    }

    if (filters.module !== "all")
      result = result.filter((t) => t.module_id === parseInt(filters.module));

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id")       { aVal = a.display_id || 0; bVal = b.display_id || 0; }
      else if (sortConfig.key === "name")         { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
      else if (sortConfig.key === "module_name")  { aVal = a.module_name?.toLowerCase() || ""; bVal = b.module_name?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [topicsData, searchTerm, filters, sortConfig, courses]);

  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedTopics = filteredTopics.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  // Reset page on dependency change
  useEffect(() => {
    const p = prevDeps.current;
    if (p.searchTerm !== searchTerm || p.sortConfig !== sortConfig || p.itemsPerPage !== itemsPerPage || p.filters !== filters) {
      setCurrentPage(1);
      prevDeps.current = { searchTerm, sortConfig, itemsPerPage, filters };
    }
  }, [searchTerm, sortConfig, itemsPerPage, filters]);

  const handleSort = (key) =>
    setSortConfig((c) => ({ key, direction: c.key === key && c.direction === "asc" ? "desc" : "asc" }));

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
      : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
  };

  const handleDeleteClick = (e, topic) => {
    e.stopPropagation();
    setTopicToDelete(topic);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!topicToDelete) return;
    setDeleteLoading(true);
    deleteMutation.mutate(topicToDelete.id);
  };

  const activeFiltersCount = [filters.course !== "all", filters.module !== "all"].filter(Boolean).length;
  const totalTopics = topicsData.flatMap((m) => m.topics).length;

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
          <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading topics…</p>
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
          <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>{error.message}</p>
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
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .top-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .top-row { transition: background 0.13s; cursor: pointer; }
        .top-row:hover { background: #fafafa; }
        .top-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .top-action-btn.view:hover { background: #f1f5f9; color: #475569; }
        .top-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
        .top-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }
        .top-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .top-th-btn:hover { color: #475569; }
        .top-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .top-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .top-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .top-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .top-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .top-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .top-search::placeholder { color: #cbd5e1; }
        .top-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .top-select:focus { border-color: #7c3aed; }
        .top-filter-select { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .top-filter-select:focus { border-color: #7c3aed; }
        .top-filter-select:disabled { opacity: 0.5; cursor: not-allowed; }
        .top-add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(124,58,237,0.28); transition: opacity 0.15s; font-family: inherit; flex-shrink: 0; }
        .top-add-btn:hover { opacity: 0.9; }
        .top-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; flex-shrink: 0; }
        .top-filter-btn.active { border-color: #a78bfa; background: #f5f3ff; color: #6d28d9; }
        .top-filter-btn:hover { background: #f8fafc; }
      `}</style>

      {toast.show && <Toasts message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div style={{ padding: "28px 16px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
              <BookMarked size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Topics</h1>
            <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{totalTopics}</span>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage your lesson topics across modules</p>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
              <input
                className="top-search"
                type="text"
                placeholder="Search by topic name, module or ID…"
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
              <select className="top-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
            </div>

            {/* Filter toggle */}
            <button
              className={`top-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span style={{ padding: "1px 7px", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 99 }}>{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {/* Add Topic */}
            <button className="top-add-btn" onClick={() => navigate("/add-topic")}>
              <Plus size={16} /> Add Topic
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
              {/* Course */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Course</label>
                <select
                  className="top-filter-select"
                  value={filters.course}
                  onChange={(e) => setFilters({ ...filters, course: e.target.value, module: "all" })}
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {/* Module */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Module</label>
                <select
                  className="top-filter-select"
                  value={filters.module}
                  onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                  disabled={filters.course === "all"}
                >
                  <option value="all">All Modules</option>
                  {uniqueModules
                    .filter((m) => {
                      if (filters.course === "all") return true;
                      const course = courses.find((c) => c.id === parseInt(filters.course));
                      return course && m.name.toLowerCase().includes(course.name.toLowerCase());
                    })
                    .map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Gap ── */}
        <div style={{ height: 20 }} />

        {/* ── Table / Empty ── */}
        {filteredTopics.length === 0 ? (
          <div className="top-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <BookMarked size={27} color="#cbd5e1" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No topics found</h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || filters.course !== "all" || filters.module !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first topic."}
            </p>
            <button onClick={() => navigate("/add-topic")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}>
              <Plus size={15} /> Add Topic
            </button>
          </div>
        ) : (
          <div className="top-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

            {/* Silent refresh bar (uses topicsFetching) */}
            {topicsFetching && (
              <div style={{ height: 3, background: "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)", backgroundSize: "200% 100%", animation: "shimmer 1.2s linear infinite" }} />
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 500, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
                    <th style={{ padding: "14px 18px", textAlign: "left", width: 56 }}>
                      <button className="top-th-btn" onClick={() => handleSort("display_id")}># <SortIcon col="display_id" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="top-th-btn" onClick={() => handleSort("name")}>Topic Name <SortIcon col="name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="top-th-btn" onClick={() => handleSort("module_name")}>Module <SortIcon col="module_name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTopics.map((topic, index) => (
                    <tr
                      key={topic.id}
                      className="top-row"
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                      onClick={() => { setSelectedTopic(topic); setShowViewModal(true); }}
                    >
                      {/* # */}
                      <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Topic name */}
                      <td style={{ padding: "15px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 38, height: 38, background: "#f5f3ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <BookMarked size={15} color="#7c3aed" />
                          </div>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{topic.name}</span>
                        </div>
                      </td>

                      {/* Module badge */}
                      <td style={{ padding: "15px 18px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", fontSize: 13, fontWeight: 600, borderRadius: 99 }}>
                          <Layers size={11} />
                          {topic.module_name}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                          <button className="top-action-btn view" onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); setShowViewModal(true); }} title="View"><Eye size={15} /></button>
                          <button className="top-action-btn edit" onClick={(e) => { e.stopPropagation(); navigate(`/edit-topic/${topic.id}`, { state: { topic } }); }} title="Edit"><Edit size={15} /></button>
                          <button className="top-action-btn del" onClick={(e) => handleDeleteClick(e, topic)} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
                Showing{" "}
                <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredTopics.length)}</strong>
                {" "}of{" "}
                <strong style={{ color: "#475569" }}>{filteredTopics.length}</strong> topics
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button className="top-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}><ChevronLeft size={15} /></button>
                {getPageNumbers().map((page) => (
                  <button key={page} className={`top-page-btn${safePage === page ? " active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className="top-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Modal ── */}
      {showViewModal && selectedTopic && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setShowViewModal(false)} />
          <div className="top-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 480, width: "100%", zIndex: 10, overflow: "hidden" }}>
            <button onClick={() => setShowViewModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}>
              <X size={15} />
            </button>

            <div style={{ padding: 24 }}>
              {/* Icon + title */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{ width: 52, height: 52, background: "#f5f3ff", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookMarked size={24} color="#7c3aed" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{selectedTopic.name}</h2>
              </div>

              {/* Module info */}
              <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
                  <Layers size={11} /> Module
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>{selectedTopic.module_name}</p>
              </div>
            </div>

            <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowViewModal(false)} style={{ padding: "9px 18px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Close
              </button>
              <button onClick={() => { setShowViewModal(false); navigate(`/edit-topic/${selectedTopic.id}`, { state: { topic: selectedTopic } }); }} style={{ padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" }}>
                <Edit size={14} /> Edit Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && topicToDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }} onClick={() => !deleteLoading && setShowDeleteModal(false)} />
          <div className="top-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 420, width: "100%", padding: 26, zIndex: 10 }}>
            <button onClick={() => !deleteLoading && setShowDeleteModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}>
              <X size={15} />
            </button>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 46, height: 46, background: "#fef2f2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 7px" }}>Delete Topic</h3>
                <p style={{ fontSize: 14.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                  Are you sure you want to delete <strong style={{ color: "#1e293b" }}>"{topicToDelete.name}"</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} disabled={deleteLoading} style={{ padding: "10px 20px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleteLoading} style={{ padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: deleteLoading ? 0.7 : 1, fontFamily: "inherit" }}>
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
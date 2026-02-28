// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Search,
//   X,
//   SlidersHorizontal,
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   BookMarked,
//   Layers,
//   ChevronDown,
//   ChevronUp,
//   ArrowUpRight,
//   Tag,
// } from "lucide-react";

// const ITEMS_PER_PAGE = 10;

// export default function Topics() {
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [topicsData, setTopicsData] = useState([]);
//   const [filteredTopics, setFilteredTopics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("all");
//   const [selectedModule, setSelectedModule] = useState("all");
//   const [uniqueCourses, setUniqueCourses] = useState([]);
//   const [uniqueModules, setUniqueModules] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [expandedModules, setExpandedModules] = useState({});

//   // Checkbox
//   const [selectedRows, setSelectedRows] = useState([]);

//   // Pagination (flat topic list)
//   const [currentPage, setCurrentPage] = useState(1);

//   // Modal states
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [topicToDelete, setTopicToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState("");
//   const [deleteError, setDeleteError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const coursesResponse = await fetch("https://codingcloud.pythonanywhere.com/course/");
//         const coursesData = await coursesResponse.json();
//         if (coursesData.success) {
//           setCourses(coursesData.data);
//           setUniqueCourses(coursesData.data);
//         }

//         const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
//         const topicsJson = await topicsResponse.json();
//         if (topicsJson.status === "success") {
//           setTopicsData(topicsJson.data);
//           setFilteredTopics(topicsJson.data);
//           const modules = topicsJson.data.map((item) => ({ id: item.module_id, name: item.module_name }));
//           setUniqueModules(modules);
//           const expanded = {};
//           topicsJson.data.forEach((item) => { expanded[item.module_id] = true; });
//           setExpandedModules(expanded);
//         }
//       } catch (err) {
//         setError("Failed to fetch data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     let filtered = [...topicsData];
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (module) =>
//           module.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           module.topics.some((topic) => topic.name.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }
//     if (selectedCourse !== "all") {
//       const course = courses.find((c) => c.id === parseInt(selectedCourse));
//       if (course) {
//         filtered = filtered.filter((module) =>
//           module.module_name.toLowerCase().includes(course.name.toLowerCase())
//         );
//       }
//     }
//     if (selectedModule !== "all") {
//       filtered = filtered.filter((module) => module.module_id === parseInt(selectedModule));
//     }
//     setFilteredTopics(filtered);
//     setCurrentPage(1);
//     setSelectedRows([]);
//   }, [searchTerm, selectedCourse, selectedModule, topicsData, courses]);

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedCourse("all");
//     setSelectedModule("all");
//   };

//   const toggleModule = (moduleId, e) => {
//     if (e) e.stopPropagation();
//     setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
//   };

//   const openTopicModal = (topic, moduleName, moduleId) => {
//     setSelectedTopic({ ...topic, module_name: moduleName, module_id: moduleId });
//     setShowModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeTopicModal = () => {
//     setShowModal(false);
//     setSelectedTopic(null);
//     document.body.style.overflow = "unset";
//   };

//   const handleDeleteClick = (e, topic, moduleName) => {
//     e.stopPropagation();
//     setTopicToDelete({ ...topic, module_name: moduleName });
//     setShowDeleteModal(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!topicToDelete) return;
//     setDeleteLoading(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/topics/${topicToDelete.id}/`,
//         { method: "DELETE", headers: { "Content-Type": "application/json" } }
//       );
//       if (response.ok || response.status === 204) {
//         setDeleteSuccess("Topic deleted successfully!");
//         const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
//         const topicsJson = await topicsResponse.json();
//         if (topicsJson.status === "success") setTopicsData(topicsJson.data);
//         setTimeout(() => {
//           setShowDeleteModal(false);
//           setTopicToDelete(null);
//           setDeleteSuccess("");
//         }, 1500);
//       } else {
//         const data = await response.json();
//         setDeleteError(data.message || "Failed to delete topic");
//       }
//     } catch (err) {
//       setDeleteError("Network error. Please try again.");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleEdit = (e, topic, moduleName, moduleId) => {
//     e.stopPropagation();
//     navigate(`/edit-topic/${topic.id}`, {
//       state: { topic: { ...topic, module_name: moduleName, module_id: moduleId } },
//     });
//   };

//   // Flatten all topics for table + pagination
//   const allFlatTopics = filteredTopics.flatMap((module) =>
//     module.topics.map((topic) => ({ ...topic, module_name: module.module_name, module_id: module.module_id }))
//   );
//   const totalPages = Math.ceil(allFlatTopics.length / ITEMS_PER_PAGE);
//   const paginatedTopics = allFlatTopics.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   const totalTopics = topicsData.reduce((acc, m) => acc + m.topics.length, 0);

//   // Checkbox logic
//   const allOnPageSelected = paginatedTopics.length > 0 && paginatedTopics.every((t) => selectedRows.includes(t.id));
//   const toggleSelectAll = () => {
//     if (allOnPageSelected) {
//       setSelectedRows((prev) => prev.filter((id) => !paginatedTopics.map((t) => t.id).includes(id)));
//     } else {
//       setSelectedRows((prev) => [...prev, ...paginatedTopics.map((t) => t.id).filter((id) => !prev.includes(id))]);
//     }
//   };
//   const toggleRow = (id) => setSelectedRows((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

//   // Stat cards
//   const statCards = [
//     { label: "Total Topics", value: totalTopics, pct: 70 },
//     { label: "Total Modules", value: topicsData.length, pct: 55 },
//     { label: "Courses", value: courses.length, pct: 42 },
//     { label: "Filtered Topics", value: allFlatTopics.length, pct: 80 },
//   ];

//   const CircularProgress = ({ pct, size = 52 }) => {
//     const r = 20, circ = 2 * Math.PI * r;
//     const offset = circ - (pct / 100) * circ;
//     return (
//       <svg width={size} height={size} viewBox="0 0 48 48">
//         <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
//         <circle cx="24" cy="24" r={r} fill="none" stroke="#2563eb" strokeWidth="4"
//           strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 24 24)" />
//         <foreignObject x="8" y="8" width="32" height="32">
//           <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <ArrowUpRight size={14} color="#2563eb" />
//           </div>
//         </foreignObject>
//       </svg>
//     );
//   };

//   if (loading) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: 48, height: 48, border: "3px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
//           <p style={{ color: "#6b7280", fontSize: 14 }}>Loading topics...</p>
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ background: "#fee2e2", borderRadius: "50%", width: 64, height: 64, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <X size={28} color="#dc2626" />
//           </div>
//           <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Something went wrong</h3>
//           <p style={{ color: "#6b7280", marginBottom: 16 }}>{error}</p>
//           <button onClick={() => window.location.reload()}
//             style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500 }}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "24px 20px" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         .topic-row:hover { background: #f9fafb; }
//         .action-btn-t { background: none; border: none; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9ca3af; transition: background 0.15s, color 0.15s; }
//         .action-btn-t:hover { background: #f3f4f6; color: #374151; }
//         .page-btn-t { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; font-family: inherit; transition: background 0.15s; }
//         .page-btn-t:hover:not(:disabled) { background: #f3f4f6; }
//         .page-btn-t:disabled { opacity: 0.4; cursor: not-allowed; }
//         .mod-header:hover { background: #f3f4f6 !important; }
//         @media (max-width: 640px) {
//           .stat-grid-t { grid-template-columns: 1fr 1fr !important; }
//           .table-wrap-t { overflow-x: auto; }
//           .hide-mob { display: none !important; }
//           .toolbar-t { flex-wrap: wrap; }
//         }
//         @media (max-width: 400px) { .stat-grid-t { grid-template-columns: 1fr !important; } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       {/* ── Stat Cards ── */}
//       <div className="stat-grid-t" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
//         {statCards.map((s, i) => (
//           <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
//             <CircularProgress pct={s.pct} />
//             <div>
//               <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontWeight: 500 }}>{s.label}</p>
//               <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "2px 0 0" }}>{s.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Table Card ── */}
//       <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>

//         {/* Toolbar */}
//         <div className="toolbar-t" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
//           <button onClick={() => setShowFilters(!showFilters)}
//             style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
//             <SlidersHorizontal size={15} />
//             Filters
//             {(selectedCourse !== "all" || selectedModule !== "all") && (
//               <span style={{ width: 7, height: 7, background: "#2563eb", borderRadius: "50%", display: "inline-block" }} />
//             )}
//           </button>

//           <button onClick={() => navigate("/add-topic")}
//             style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
//             <Plus size={15} />
//             Add Topic
//           </button>

//           {selectedRows.length > 0 && (
//             <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
//               {selectedRows.length} selected
//             </span>
//           )}

//           <div style={{ flex: 1 }} />

//           {/* Search */}
//           <div style={{ position: "relative", minWidth: 200 }}>
//             <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
//             <input type="text" placeholder="Search topics or modules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//               style={{ paddingLeft: 32, paddingRight: searchTerm ? 32 : 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", background: "#f9fafb", outline: "none", width: "100%", fontFamily: "inherit" }} />
//             {searchTerm && (
//               <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
//               {[
//                 { label: "Course", value: selectedCourse, onChange: (v) => setSelectedCourse(v), options: [{ value: "all", label: "All Courses" }, ...courses.map((c) => ({ value: c.id, label: c.name }))] },
//                 { label: "Module", value: selectedModule, onChange: (v) => setSelectedModule(v), options: [{ value: "all", label: "All Modules" }, ...uniqueModules.map((m) => ({ value: m.id, label: m.name }))] },
//               ].map((f, i) => (
//                 <div key={i}>
//                   <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{f.label}</p>
//                   <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
//                     style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#374151", background: "#fff", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
//                     {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//                   </select>
//                 </div>
//               ))}
//               <button onClick={resetFilters}
//                 style={{ padding: "8px 14px", border: "none", background: "none", color: "#2563eb", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
//                 Reset
//               </button>
//             </div>

//             {/* Active filter chips */}
//             {(selectedCourse !== "all" || selectedModule !== "all") && (
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
//                 {selectedCourse !== "all" && (
//                   <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "#eff6ff", color: "#2563eb", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
//                     Course: {courses.find((c) => c.id === parseInt(selectedCourse))?.name}
//                     <button onClick={() => setSelectedCourse("all")} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", padding: 0, display: "flex" }}><X size={12} /></button>
//                   </span>
//                 )}
//                 {selectedModule !== "all" && (
//                   <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "#eff6ff", color: "#2563eb", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
//                     Module: {uniqueModules.find((m) => m.id === parseInt(selectedModule))?.name}
//                     <button onClick={() => setSelectedModule("all")} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", padding: 0, display: "flex" }}><X size={12} /></button>
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Table */}
//         <div className="table-wrap-t">
//           {allFlatTopics.length === 0 ? (
//             <div style={{ padding: "60px 20px", textAlign: "center" }}>
//               <div style={{ background: "#f3f4f6", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//                 <BookOpen size={28} color="#9ca3af" />
//               </div>
//               <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>No topics found</h3>
//               <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>Try adjusting your search or filters</p>
//               <button onClick={resetFilters} style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
//                 Clear filters
//               </button>
//             </div>
//           ) : (
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//               <thead>
//                 <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
//                   <th style={{ padding: "12px 16px", width: 44 }}>
                    
//                   </th>
//                   {["Topic", "Module", "Topic ID", "Module ID", ""].map((col, i) => (
//                     <th key={i} className={i >= 2 && i <= 3 ? "hide-mob" : ""}
//                       style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
//                       <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                         {col} {col && <ChevronDown size={12} />}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedTopics.map((topic) => {
//                   const isSelected = selectedRows.includes(topic.id);
//                   return (
//                     <tr key={topic.id} className="topic-row"
//                       style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isSelected ? "#eff6ff" : "transparent" }}
//                       onClick={() => openTopicModal(topic, topic.module_name, topic.module_id)}>

//                       {/* Topic name */}
//                       <td style={{ padding: "14px 14px" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                           <div style={{ width: 34, height: 34, borderRadius: 9, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                             <BookMarked size={15} color="#2563eb" />
//                           </div>
//                           <div>
//                             <p style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: 13 }}>{topic.name}</p>
//                             <p style={{ color: "#9ca3af", margin: "2px 0 0", fontSize: 11 }}>ID: {topic.id}</p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Module name */}
//                       <td style={{ padding: "14px 14px" }}>
//                         <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "#f3f4f6", borderRadius: 20, fontSize: 12, fontWeight: 500, color: "#4b5563" }}>
//                           <Layers size={11} />
//                           {topic.module_name}
//                         </span>
//                       </td>

//                       {/* Topic ID */}
//                       <td className="hide-mob" style={{ padding: "14px 14px", color: "#6b7280", fontSize: 13 }}>
//                         <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>#{topic.id}</span>
//                       </td>

//                       {/* Module ID */}
//                       <td className="hide-mob" style={{ padding: "14px 14px", color: "#6b7280", fontSize: 13 }}>
//                         <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>#{topic.module_id}</span>
//                       </td>

//                       {/* Actions */}
//                       <td style={{ padding: "14px 14px" }} onClick={(e) => e.stopPropagation()}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
//                           <button className="action-btn-t" onClick={(e) => { e.stopPropagation(); openTopicModal(topic, topic.module_name, topic.module_id); }} title="View">
//                             <Eye size={14} />
//                           </button>
//                           <button className="action-btn-t" onClick={(e) => handleEdit(e, topic, topic.module_name, topic.module_id)} title="Edit">
//                             <Edit size={14} />
//                           </button>
//                           <button className="action-btn-t" onClick={(e) => handleDeleteClick(e, topic, topic.module_name)} title="Delete" style={{ color: "#f87171" }}>
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {allFlatTopics.length > 0 && (
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
//             <button className="page-btn-t" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
//             <span style={{ fontSize: 13, color: "#6b7280" }}>
//               Page <strong style={{ color: "#111827" }}>{currentPage}</strong> of {totalPages} &nbsp;·&nbsp; {allFlatTopics.length} topics
//             </span>
//             <button className="page-btn-t" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
//           </div>
//         )}
//       </div>

//       {/* ── Topic Detail Modal ── */}
//       {showModal && selectedTopic && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.7)", backdropFilter: "blur(4px)" }} onClick={closeTopicModal} />
//           <div style={{ position: "relative", background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
//             {/* Header */}
//             <div style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", padding: "28px 28px 24px" }}>
//               <button onClick={closeTopicModal}
//                 style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <X size={16} color="#fff" />
//               </button>
//               <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                 <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <BookOpen size={26} color="#fff" />
//                 </div>
//                 <div>
//                   <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: "0 0 6px" }}>{selectedTopic.name}</h2>
//                   <div style={{ display: "flex", gap: 6 }}>
//                     <span style={{ padding: "3px 10px", background: "rgba(255,255,255,0.2)", borderRadius: 20, fontSize: 11, color: "#fff", fontWeight: 500 }}>Topic #{selectedTopic.id}</span>
//                     <span style={{ padding: "3px 10px", background: "rgba(255,255,255,0.2)", borderRadius: 20, fontSize: 11, color: "#fff", fontWeight: 500 }}>Module #{selectedTopic.module_id}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Content */}
//             <div style={{ padding: 28 }}>
//               <div style={{ background: "#f9fafb", borderRadius: 12, padding: 20, marginBottom: 24 }}>
//                 <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>Topic Details</p>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                   {[
//                     { label: "Topic Name", value: selectedTopic.name },
//                     { label: "Module Name", value: selectedTopic.module_name },
//                     { label: "Topic ID", value: `#${selectedTopic.id}` },
//                     { label: "Module ID", value: `#${selectedTopic.module_id}` },
//                   ].map((item, i) => (
//                     <div key={i} style={i === 0 ? { gridColumn: "1 / -1" } : {}}>
//                       <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 3px" }}>{item.label}</p>
//                       <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{item.value}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: 10 }}>
//                 <button onClick={(e) => { closeTopicModal(); handleEdit(e, selectedTopic, selectedTopic.module_name, selectedTopic.module_id); }}
//                   style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 11, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit" }}>
//                   <Edit size={16} /> Edit Topic
//                 </button>
//                 <button onClick={closeTopicModal}
//                   style={{ flex: 1, padding: 11, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit" }}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
//       {showDeleteModal && topicToDelete && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.7)", backdropFilter: "blur(4px)" }}
//             onClick={() => !deleteLoading && setShowDeleteModal(false)} />
//           <div style={{ position: "relative", background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, padding: 32, boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
//             <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//               <AlertCircle size={26} color="#dc2626" />
//             </div>
//             <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 8 }}>Delete Topic</h3>
//             <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
//               Are you sure you want to delete <strong style={{ color: "#111827" }}>"{topicToDelete.name}"</strong>? This action cannot be undone.
//             </p>

//             {deleteSuccess && (
//               <div style={{ marginBottom: 14, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
//                 <CheckCircle size={15} color="#16a34a" />
//                 <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>{deleteSuccess}</p>
//               </div>
//             )}
//             {deleteError && (
//               <div style={{ marginBottom: 14, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
//                 <X size={15} color="#dc2626" />
//                 <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{deleteError}</p>
//               </div>
//             )}

//             <div style={{ display: "flex", gap: 10 }}>
//               <button onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}
//                 style={{ flex: 1, padding: "11px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
//                 Cancel
//               </button>
//               <button onClick={handleDeleteConfirm} disabled={deleteLoading || !!deleteSuccess}
//                 style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", opacity: (deleteLoading || !!deleteSuccess) ? 0.6 : 1 }}>
//                 {deleteLoading ? (
//                   <>
//                     <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//                     Deleting...
//                   </>
//                 ) : <><Trash2 size={15} /> Delete</>}
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
  Search, X, Filter, Plus, Eye, Edit, Trash2,
  AlertCircle, CheckCircle, BookMarked, Layers, ChevronDown,
  RefreshCw, SortAsc, SortDesc, Tag, BookOpen,
} from "lucide-react";
import Toasts from "./Toasts"; // <-- import toast component

export default function Topics() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: "all", module: "all" });

  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [uniqueModules, setUniqueModules] = useState([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isFirstLoad = useRef(true);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

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

  const fetchData = async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const [coursesRes, topicsRes] = await Promise.all([
        fetch("https://codingcloud.pythonanywhere.com/course/"),
        fetch("https://codingcloud.pythonanywhere.com/topics/"),
      ]);
      const coursesData = await coursesRes.json();
      const topicsJson = await topicsRes.json();

      if (coursesData.success) {
        setCourses(coursesData.data);
        setUniqueCourses(coursesData.data);
      }
      if (topicsJson.status === "success") {
        const parsed = parseTopics(topicsJson.data);
        setTopicsData(parsed);
        setUniqueModules(parsed.map((m) => ({ id: m.module_id, name: m.module_name })));
      } else {
        if (!silent) setError("Failed to fetch topics.");
      }
    } catch {
      if (!silent) setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFirstLoad.current = false;
    }
  };

  const refreshTopicsOnly = async () => {
    setRefreshing(true);
    try {
      const topicsRes = await fetch("https://codingcloud.pythonanywhere.com/topics/");
      const topicsJson = await topicsRes.json();
      if (topicsJson.status === "success") {
        const parsed = parseTopics(topicsJson.data);
        setTopicsData(parsed);
        setUniqueModules(parsed.map((m) => ({ id: m.module_id, name: m.module_name })));
      }
    } catch {
      // silent fail
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(false); }, []);

  useEffect(() => {
    let result = topicsData.flatMap((m) => m.topics);

    if (searchTerm) {
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
      if (course) {
        result = result.filter((t) =>
          t.module_name.toLowerCase().includes(course.name.toLowerCase())
        );
      }
    }

    if (filters.module !== "all") {
      result = result.filter((t) => t.module_id === parseInt(filters.module));
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") { aVal = a.display_id || 0; bVal = b.display_id || 0; }
      else if (sortConfig.key === "name") { aVal = a.name?.toLowerCase() || ""; bVal = b.name?.toLowerCase() || ""; }
      else if (sortConfig.key === "module_name") { aVal = a.module_name?.toLowerCase() || ""; bVal = b.module_name?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredTopics(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, topicsData, courses]);

  const handleSort = (key) =>
    setSortConfig((cur) => ({
      key,
      direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
    }));

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} className="text-violet-500" />
      : <SortDesc size={13} className="text-violet-500" />;
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const paginatedTopics = filteredTopics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);

  const handleDeleteClick = (e, topic) => {
    e.stopPropagation();
    setTopicToDelete(topic);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/topics/${topicToDelete.id}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        showToast("Topic deleted successfully!", "error"); // red toast
        refreshTopicsOnly();
        setShowDeleteModal(false);
        setTopicToDelete(null);
      } else {
        const data = await response.json().catch(() => ({}));
        showToast(data.message || "Failed to delete topic.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeFiltersCount = [
    filters.course !== "all",
    filters.module !== "all",
    sortConfig.key !== "name" || sortConfig.direction !== "asc",
  ].filter(Boolean).length;

  const totalTopics = topicsData.flatMap((m) => m.topics).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-base font-medium">Loading topics…</p>
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
          <button onClick={() => window.location.reload()}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-base font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast notification */}
      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookMarked size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Topics</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {totalTopics}
            </span>
          </div>
          <p className="text-slate-500 text-base">Manage your lesson topics across modules</p>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by topic name, module or ID…"
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

            {/* Add Topic */}
            <button
              onClick={() => navigate("/add-topic")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium whitespace-nowrap shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Add Topic
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Course</label>
                <select
                  value={filters.course}
                  onChange={(e) => setFilters({ ...filters, course: e.target.value, module: "all" })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Module</label>
                <select
                  value={filters.module}
                  onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                  disabled={filters.course === "all"}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 disabled:opacity-50"
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
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Table / Empty state ── */}
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookMarked size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No topics found</h3>
            <p className="text-slate-400 text-base mb-5">
              {searchTerm || filters.course !== "all" || filters.module !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first topic."}
            </p>
            <button
              onClick={() => navigate("/add-topic")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium"
            >
              <Plus size={15} /> Add Topic
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Silent refresh shimmer bar */}
            {refreshing && (
              <div style={{
                height: 3,
                background: "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.2s linear infinite",
              }} />
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-14"
                      onClick={() => handleSort("display_id")}
                    >
                      <span className="flex items-center gap-1"># {getSortIcon("display_id")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("name")}
                    >
                      <span className="flex items-center gap-1">Topic Name {getSortIcon("name")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("module_name")}
                    >
                      <span className="flex items-center gap-1">Module {getSortIcon("module_name")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTopics.map((topic, index) => (
                    <tr
                      key={topic.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedTopic(topic); setShowViewModal(true); }}
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-base font-semibold text-slate-400">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Topic name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 flex-shrink-0">
                            <BookMarked size={15} />
                          </div>
                          <span className="text-base font-semibold text-slate-800">{topic.name}</span>
                        </div>
                      </td>

                      {/* Module badge */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold rounded-full">
                          <Layers size={11} />
                          {topic.module_name}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); setShowViewModal(true); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit-topic/${topic.id}`, { state: { topic } }); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, topic)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
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

            {/* Pagination */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTopics.length)}</span> of <span className="text-slate-700 font-semibold">{filteredTopics.length}</span> topics
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
                          currentPage === page
                            ? "bg-violet-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200"
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

      {/* ── View Modal ── */}
      {showViewModal && selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden">

            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="p-6">
              {/* Icon + title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 flex-shrink-0">
                  <BookMarked size={26} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedTopic.name}</h2>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Layers size={11} /> Module
                  </p>
                  <p className="text-base font-semibold text-slate-800">{selectedTopic.module_name}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowViewModal(false); navigate(`/edit-topic/${selectedTopic.id}`, { state: { topic: selectedTopic } }); }}
                className="px-5 py-2 bg-violet-600 text-white text-base font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
              >
                <Edit size={14} /> Edit Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && topicToDelete && (
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
                <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Topic</h3>
                <p className="text-base text-slate-500">
                  Are you sure you want to delete <span className="font-semibold text-slate-700">"{topicToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

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
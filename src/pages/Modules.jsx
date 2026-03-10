// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Search,
//   X,
//   SlidersHorizontal,
//   Plus,
//   ChevronRight,
//   Edit,
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   Hash,
//   BookMarked,
//   Layers,
//   Clock,
//   FolderOpen,
//   Eye,
//   ChevronLeft,
//   Calendar,
//   User,
//   MoreVertical,
// } from "lucide-react";

// export default function Modules() {
//   const navigate = useNavigate();

//   // State for modules data
//   const [modules, setModules] = useState([]);
//   const [filteredModules, setFilteredModules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI State
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("all");
//   const [uniqueCourses, setUniqueCourses] = useState([]);
//   const [coursesMap, setCoursesMap] = useState({});
//   const [showFilters, setShowFilters] = useState(false);

//   // Sort state
//   const [sortConfig, setSortConfig] = useState({
//     key: "name",
//     direction: "asc",
//   });

//   // Modal states
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [moduleToDelete, setModuleToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState("");
//   const [deleteError, setDeleteError] = useState("");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 10;

//   // Fetch modules
//   const fetchModules = async () => {
//     try {
//       setLoading(true);
//       const [modulesRes, coursesRes] = await Promise.all([
//         fetch("https://codingcloud.pythonanywhere.com/modules/"),
//         fetch("https://codingcloud.pythonanywhere.com/course/"),
//       ]);

//       const data = await modulesRes.json();
//       const coursesDataRes = await coursesRes.json();

//       if (data.success) {
//         setModules(data.data);
//         setFilteredModules(data.data);

//         // Extract unique course IDs for filtering
//         const courses = [...new Set(data.data.map((m) => m.course_data))].sort(
//           (a, b) => a - b,
//         );
//         setUniqueCourses(courses);

//         // Map courses
//         const courseMap = {};
//         const actualCourses = coursesDataRes.data || coursesDataRes;
//         if (Array.isArray(actualCourses)) {
//           actualCourses.forEach((course) => {
//             courseMap[course.id] = course.name;
//           });
//         }
//         setCoursesMap(courseMap);
//       } else {
//         setError("Failed to fetch modules");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//       console.error("Error fetching modules:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchModules();
//   }, []);

//   // Filter and sort modules
//   useEffect(() => {
//     let filtered = [...modules];

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (module) =>
//           module.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply course filter
//     if (selectedCourse !== "all") {
//       filtered = filtered.filter(
//         (module) => module.course_data === parseInt(selectedCourse),
//       );
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       let aVal = a[sortConfig.key];
//       let bVal = b[sortConfig.key];

//       if (sortConfig.key === "course_data") {
//         aVal = coursesMap[a.course_data] || a.course_data;
//         bVal = coursesMap[b.course_data] || b.course_data;
//       }

//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     setFilteredModules(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedCourse, modules, sortConfig, coursesMap]);

//   const resettopicFilters = () => {
//     setSearchTerm("");
//     setSelectedCourse("all");
//   };

//   // Sort handler
//   const handleSort = (key) => {
//     setSortConfig({
//       key,
//       direction:
//         sortConfig.key === key && sortConfig.direction === "asc"
//           ? "desc"
//           : "asc",
//     });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === "asc" ? " ↑" : " ↓";
//   };

//   // Modal handlers
//   const openModuleModal = (module) => {
//     setSelectedModule(module);
//     setShowModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModuleModal = () => {
//     setShowModal(false);
//     setSelectedModule(null);
//     document.body.style.overflow = "unset";
//   };

//   // Delete handlers
//   const handleDeleteClick = (e, module) => {
//     e.stopPropagation();
//     setModuleToDelete(module);
//     setShowDeleteModal(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!moduleToDelete) return;

//     setDeleteLoading(true);

//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/modules/${moduleToDelete.id}/`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (response.ok || response.status === 204) {
//         setDeleteSuccess("Module deleted successfully!");
//         setTimeout(() => {
//           setShowDeleteModal(false);
//           setModuleToDelete(null);
//           fetchModules(); // Refresh the list
//         }, 1500);
//       } else {
//         setDeleteError("Failed to delete module. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error deleting module:", err);
//       setDeleteError("Network error. Please try again.");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // Handle edit
//   const handleEdit = (e, moduleId) => {
//     e.stopPropagation();
//     navigate(`/edit-module/${moduleId}`);
//   };

//   // Pagination
//   const paginatedModules = filteredModules.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );
//   const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);

//   // Stat card data
//   const totalCourses = uniqueCourses.length;
//   const statCards = [
//     {
//       label: "Total Modules",
//       value: modules.length,
//       icon: Layers,
//       color: "#2563eb",
//       bgColor: "#eef2ff",
//     },
//     {
//       label: "Total Courses",
//       value: totalCourses,
//       icon: BookOpen,
//       color: "#7c3aed",
//       bgColor: "#f3e8ff",
//     },
//     {
//       label: "Avg Modules/Course",
//       value: modules.length
//         ? Math.round((modules.length / totalCourses) * 10) / 10
//         : 0,
//       icon: Clock,
//       color: "#db2777",
//       bgColor: "#fce7f3",
//     },
//   ];

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "60vh",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               width: 48,
//               height: 48,
//               border: "3px solid #e5e7eb",
//               borderTopColor: "#2563eb",
//               borderRadius: "50%",
//               animation: "spin 0.8s linear infinite",
//               margin: "0 auto 12px",
//             }}
//           />
//           <p style={{ color: "#6b7280", fontSize: 14 }}>Loading modules...</p>
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "60vh",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               background: "#fee2e2",
//               borderRadius: "50%",
//               padding: 16,
//               width: 64,
//               height: 64,
//               margin: "0 auto 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <X size={28} color="#dc2626" />
//           </div>
//           <h3
//             style={{
//               fontSize: 18,
//               fontWeight: 600,
//               color: "#111827",
//               marginBottom: 8,
//             }}
//           >
//             Something went wrong
//           </h3>
//           <p style={{ color: "#6b7280", marginBottom: 16 }}>{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             style={{
//               padding: "8px 20px",
//               background: "#2563eb",
//               color: "#fff",
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               fontWeight: 500,
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
//         fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//         background: "#f4f5f7",
//         minHeight: "100vh",
//         padding: "24px 20px",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         .filter-sel { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; font-size: 13px; color: #374151; background: #fff; outline: none; appearance: none; cursor: pointer; }
//         .filter-sel:focus { border-color: #2563eb; }
//         .page-btn { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; transition: background 0.15s; }
//         .page-btn:hover:not(:disabled) { background: #f3f4f6; }
//         .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//         .table-row:hover { background: #f9fafb; }
//         .sortable-header { cursor: pointer; user-select: none; }
//         .sortable-header:hover { background: #f3f4f6; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       {/* ── Header with Stats ── */}
//       <div style={{ marginBottom: 24 }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 20,
//           }}
//         >
//           <div>
//             <h1
//               style={{
//                 fontSize: 24,
//                 fontWeight: 700,
//                 color: "#111827",
//                 margin: 0,
//               }}
//             >
//               Modules
//             </h1>
//             <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
//               Manage your course modules and lessons
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/add-module")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "10px 20px",
//               borderRadius: 10,
//               background: "#2563eb",
//               color: "#fff",
//               fontSize: 14,
//               fontWeight: 600,
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             <Plus size={18} />
//             Add Module
//           </button>
//         </div>

//         {/* Stat Cards */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//             gap: 16,
//           }}
//         >
//           {statCards.map((stat, index) => (
//             <div
//               key={index}
//               style={{
//                 background: "#fff",
//                 borderRadius: 14,
//                 padding: "18px 20px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 16,
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//               }}
//             >
//               <div
//                 style={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 12,
//                   background: stat.bgColor,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <stat.icon size={22} color={stat.color} />
//               </div>
//               <div>
//                 <p
//                   style={{
//                     fontSize: 13,
//                     color: "#6b7280",
//                     margin: 0,
//                     fontWeight: 500,
//                   }}
//                 >
//                   {stat.label}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 24,
//                     fontWeight: 700,
//                     color: "#111827",
//                     margin: "2px 0 0",
//                   }}
//                 >
//                   {stat.value}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Error Toast */}
//       {deleteError && (
//         <div
//           style={{
//             position: "fixed",
//             top: 24,
//             right: 24,
//             zIndex: 100,
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: 10,
//             padding: "12px 16px",
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           <AlertCircle size={16} color="#dc2626" />
//           <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
//             {deleteError}
//           </p>
//         </div>
//       )}

//       {/* ── Main Card ── */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 16,
//           boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//           overflow: "hidden",
//         }}
//       >
//         {/* Toolbar */}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             gap: 10,
//             padding: "16px 20px",
//             borderBottom: "1px solid #f3f4f6",
//           }}
//         >
//           {/* Left: Filter */}
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "8px 14px",
//               border: "1px solid #e5e7eb",
//               borderRadius: 8,
//               background: "#fff",
//               color: "#374151",
//               fontSize: 13,
//               fontWeight: 500,
//               cursor: "pointer",
//             }}
//           >
//             <SlidersHorizontal size={15} />
//             Filters
//             {selectedCourse !== "all" && (
//               <span
//                 style={{
//                   width: 7,
//                   height: 7,
//                   background: "#2563eb",
//                   borderRadius: "50%",
//                   display: "inline-block",
//                 }}
//               />
//             )}
//           </button>

//           {/* Search */}
//           <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
//             <Search
//               size={15}
//               style={{
//                 position: "absolute",
//                 left: 10,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#9ca3af",
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search modules by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 paddingLeft: 32,
//                 paddingRight: searchTerm ? 32 : 12,
//                 paddingTop: 8,
//                 paddingBottom: 8,
//                 border: "1px solid #e5e7eb",
//                 borderRadius: 8,
//                 fontSize: 13,
//                 color: "#374151",
//                 background: "#f9fafb",
//                 outline: "none",
//                 width: "100%",
//               }}
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 style={{
//                   position: "absolute",
//                   right: 8,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "#9ca3af",
//                   padding: 0,
//                 }}
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* Results count */}
//           <span style={{ fontSize: 13, color: "#6b7280", marginLeft: "auto" }}>
//             {filteredModules.length} module
//             {filteredModules.length !== 1 ? "s" : ""}
//           </span>
//         </div>

//         {/* Advanced Filters */}
//         {showFilters && (
//           <div
//             style={{
//               padding: "14px 20px",
//               borderBottom: "1px solid #f3f4f6",
//               background: "#f9fafb",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 16,
//                 alignItems: "flex-end",
//               }}
//             >
//               <div style={{ minWidth: 200 }}>
//                 <p
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: "#9ca3af",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.06em",
//                     marginBottom: 4,
//                   }}
//                 >
//                   Course
//                 </p>
//                 <select
//                   className="filter-sel"
//                   value={selectedCourse}
//                   onChange={(e) => setSelectedCourse(e.target.value)}
//                   style={{ width: "100%" }}
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
//               <button
//                 onClick={resetFilters}
//                 style={{
//                   padding: "8px 14px",
//                   border: "none",
//                   background: "none",
//                   color: "#2563eb",
//                   fontSize: 13,
//                   fontWeight: 500,
//                   cursor: "pointer",
//                 }}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Table View - Simplified to show only Module Name and Category */}
//         {filteredModules.length === 0 ? (
//           <div style={{ padding: "60px 20px", textAlign: "center" }}>
//             <div
//               style={{
//                 background: "#f3f4f6",
//                 borderRadius: "50%",
//                 width: 64,
//                 height: 64,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 16px",
//               }}
//             >
//               <BookOpen size={28} color="#9ca3af" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#111827",
//                 marginBottom: 6,
//               }}
//             >
//               No modules found
//             </h3>
//             <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>
//               Try adjusting your search or filter criteria
//             </p>
//             <button
//               onClick={resetFilters}
//               style={{
//                 padding: "8px 20px",
//                 background: "#2563eb",
//                 color: "#fff",
//                 borderRadius: 8,
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: 500,
//               }}
//             >
//               Clear filters
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Simplified Table with only Module Name and Category */}
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: 13,
//                 }}
//               >
//                 <thead>
//                   <tr
//                     style={{
//                       background: "#f9fafb",
//                       borderBottom: "1px solid #e5e7eb",
//                     }}
//                   >
//                     <th
//                       className="sortable-header"
//                       onClick={() => handleSort("name")}
//                       style={{
//                         padding: "14px 20px",
//                         textAlign: "left",
//                         fontWeight: 600,
//                         color: "#374151",
//                         cursor: "pointer",
//                         width: "40%",
//                       }}
//                     >
//                       Module Name {getSortIcon("name")}
//                     </th>
//                     <th
//                       className="sortable-header"
//                       onClick={() => handleSort("course_data")}
//                       style={{
//                         padding: "14px 20px",
//                         textAlign: "left",
//                         fontWeight: 600,
//                         color: "#374151",
//                         cursor: "pointer",
//                         width: "40%",
//                       }}
//                     >
//                       Category {getSortIcon("course_data")}
//                     </th>
//                     <th
//                       style={{
//                         padding: "14px 20px",
//                         textAlign: "center",
//                         fontWeight: 600,
//                         color: "#374151",
//                         width: "20%",
//                       }}
//                     >
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedModules.map((module, index) => (
//                     <tr
//                       key={module.id}
//                       className="table-row"
//                       onClick={() => openModuleModal(module)}
//                       style={{
//                         borderBottom: "1px solid #f3f4f6",
//                         cursor: "pointer",
//                         background: index % 2 === 0 ? "#fff" : "#fafafa",
//                       }}
//                     >
//                       <td
//                         style={{
//                           padding: "16px 20px",
//                           fontWeight: 500,
//                           color: "#111827",
//                         }}
//                       >
//                         {module.name}
//                       </td>
//                       <td style={{ padding: "16px 20px" }}>
//                         <span
//                           style={{
//                             background: "#eef2ff",
//                             padding: "4px 10px",
//                             borderRadius: 20,
//                             fontSize: 12,
//                             color: "#4f46e5",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {coursesMap[module.course_data] ||
//                             `Course ${module.course_data}`}
//                         </span>
//                       </td>
//                       <td style={{ padding: "16px 20px", textAlign: "center" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: 8,
//                             justifyContent: "center",
//                           }}
//                         >
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openModuleModal(module);
//                             }}
//                             style={{
//                               padding: "6px 12px",
//                               background: "#eef2ff",
//                               border: "none",
//                               borderRadius: 6,
//                               fontSize: 12,
//                               fontWeight: 500,
//                               color: "#4f46e5",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 4,
//                             }}
//                           >
//                             <Eye size={14} />
//                             View
//                           </button>
//                           <button
//                             onClick={(e) => handleEdit(e, module.id)}
//                             style={{
//                               padding: "6px 12px",
//                               background: "#dbeafe",
//                               border: "none",
//                               borderRadius: 6,
//                               fontSize: 12,
//                               fontWeight: 500,
//                               color: "#2563eb",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 4,
//                             }}
//                           >
//                             <Edit size={14} />
//                             Edit
//                           </button>
//                           <button
//                             onClick={(e) => handleDeleteClick(e, module)}
//                             style={{
//                               padding: "6px 12px",
//                               background: "#fee2e2",
//                               border: "none",
//                               borderRadius: 6,
//                               fontSize: 12,
//                               fontWeight: 500,
//                               color: "#dc2626",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 4,
//                             }}
//                           >
//                             <Trash2 size={14} />
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "16px 20px",
//                   borderTop: "1px solid #f3f4f6",
//                 }}
//               >
//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button
//                     className="page-btn"
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button
//                     className="page-btn"
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                   >
//                     <ChevronLeft size={14} />
//                   </button>
//                 </div>

//                 <span style={{ fontSize: 13, color: "#6b7280" }}>
//                   Page{" "}
//                   <strong style={{ color: "#111827" }}>{currentPage}</strong> of{" "}
//                   {totalPages}
//                 </span>

//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button
//                     className="page-btn"
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(totalPages, p + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                   <button
//                     className="page-btn"
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Module Details Modal ── */}
//       {showModal && selectedModule && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 50,
//             overflowY: "auto",
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
//               background: "rgba(17,24,39,0.7)",
//               backdropFilter: "blur(4px)",
//             }}
//             onClick={closeModuleModal}
//           />
//           <div
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               width: "100%",
//               maxWidth: 450,
//               maxHeight: "90vh",
//               overflowY: "auto",
//               boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
//             }}
//           >
//             {/* Modal Header - Simplified */}
//             <div
//               style={{
//                 background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
//                 padding: "32px 24px",
//                 position: "relative",
//                 textAlign: "center",
//               }}
//             >
//               <button
//                 onClick={closeModuleModal}
//                 style={{
//                   position: "absolute",
//                   top: 16,
//                   right: 16,
//                   width: 32,
//                   height: 32,
//                   background: "rgba(255,255,255,0.2)",
//                   border: "none",
//                   borderRadius: "50%",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backdropFilter: "blur(4px)",
//                 }}
//               >
//                 <X size={16} color="#fff" />
//               </button>

//               <div
//                 style={{
//                   width: 64,
//                   height: 64,
//                   background: "rgba(255,255,255,0.2)",
//                   backdropFilter: "blur(8px)",
//                   borderRadius: 16,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 16px",
//                 }}
//               >
//                 <BookOpen size={32} color="#fff" />
//               </div>
//               <h2
//                 style={{
//                   color: "#fff",
//                   fontWeight: 700,
//                   fontSize: 20,
//                   margin: 0,
//                   lineHeight: 1.4,
//                 }}
//               >
//                 {selectedModule.name}
//               </h2>
//             </div>

//             {/* Modal Content - Simplified to show only category */}
//             <div style={{ padding: 24 }}>
//               <div
//                 style={{
//                   background: "#f9fafb",
//                   borderRadius: 12,
//                   padding: 20,
//                   marginBottom: 20,
//                   textAlign: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 8,
//                     marginBottom: 8,
//                   }}
//                 >
//                   <FolderOpen size={18} color="#6b7280" />
//                   <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
//                     Category
//                   </span>
//                 </div>
//                 <span
//                   style={{
//                     background: "#eef2ff",
//                     padding: "8px 20px",
//                     borderRadius: 30,
//                     fontSize: 16,
//                     fontWeight: 600,
//                     color: "#4f46e5",
//                     display: "inline-block",
//                   }}
//                 >
//                   {coursesMap[selectedModule.course_data] ||
//                     `Course ${selectedModule.course_data}`}
//                 </span>
//               </div>

//               {/* Action Buttons */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 10,
//                 }}
//               >
//                 <button
//                   onClick={(e) => {
//                     closeModuleModal();
//                     handleEdit(e, selectedModule.id);
//                   }}
//                   style={{
//                     padding: "12px",
//                     background: "#2563eb",
//                     color: "#fff",
//                     borderRadius: 10,
//                     border: "none",
//                     cursor: "pointer",
//                     fontWeight: 600,
//                     fontSize: 14,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 8,
//                   }}
//                 >
//                   <Edit size={16} />
//                   Edit Module
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     closeModuleModal();
//                     handleDeleteClick(e, selectedModule);
//                   }}
//                   style={{
//                     padding: "12px",
//                     background: "#fee2e2",
//                     color: "#dc2626",
//                     borderRadius: 10,
//                     border: "none",
//                     cursor: "pointer",
//                     fontWeight: 600,
//                     fontSize: 14,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 8,
//                   }}
//                 >
//                   <Trash2 size={16} />
//                   Delete
//                 </button>
//               </div>
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
//               background: "rgba(17,24,39,0.7)",
//               backdropFilter: "blur(4px)",
//             }}
//             onClick={() => setShowDeleteModal(false)}
//           />
//           <div
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               width: "100%",
//               maxWidth: 400,
//               padding: 24,
//               boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
//             }}
//           >
//             {deleteSuccess ? (
//               <>
//                 <div style={{ textAlign: "center", padding: "20px 0" }}>
//                   <div
//                     style={{
//                       width: 64,
//                       height: 64,
//                       borderRadius: "50%",
//                       background: "#dcfce7",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       margin: "0 auto 16px",
//                     }}
//                   >
//                     <CheckCircle size={32} color="#16a34a" />
//                   </div>
//                   <h3
//                     style={{
//                       fontSize: 18,
//                       fontWeight: 700,
//                       color: "#111827",
//                       marginBottom: 8,
//                     }}
//                   >
//                     Deleted!
//                   </h3>
//                   <p
//                     style={{ fontSize: 14, color: "#6b7280", marginBottom: 0 }}
//                   >
//                     {deleteSuccess}
//                   </p>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div
//                   style={{
//                     width: 56,
//                     height: 56,
//                     borderRadius: "50%",
//                     background: "#fee2e2",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     margin: "0 auto 16px",
//                   }}
//                 >
//                   <AlertCircle size={28} color="#dc2626" />
//                 </div>
//                 <h3
//                   style={{
//                     fontSize: 18,
//                     fontWeight: 700,
//                     color: "#111827",
//                     textAlign: "center",
//                     marginBottom: 8,
//                   }}
//                 >
//                   Delete Module
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: 14,
//                     color: "#6b7280",
//                     textAlign: "center",
//                     marginBottom: 24,
//                   }}
//                 >
//                   Are you sure you want to delete{" "}
//                   <strong>"{moduleToDelete.name}"</strong>? This action cannot
//                   be undone.
//                 </p>

//                 {deleteError && (
//                   <div
//                     style={{
//                       marginBottom: 16,
//                       padding: "10px",
//                       background: "#fef2f2",
//                       border: "1px solid #fecaca",
//                       borderRadius: 8,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                   >
//                     <AlertCircle size={14} color="#dc2626" />
//                     <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
//                       {deleteError}
//                     </p>
//                   </div>
//                 )}

//                 <div style={{ display: "flex", gap: 10 }}>
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     disabled={deleteLoading}
//                     style={{
//                       flex: 1,
//                       padding: "12px",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 10,
//                       background: "#fff",
//                       color: "#374151",
//                       fontWeight: 600,
//                       fontSize: 14,
//                       cursor: deleteLoading ? "not-allowed" : "pointer",
//                       opacity: deleteLoading ? 0.5 : 1,
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleDeleteConfirm}
//                     disabled={deleteLoading}
//                     style={{
//                       flex: 1,
//                       padding: "12px",
//                       border: "none",
//                       borderRadius: 10,
//                       background: "#dc2626",
//                       color: "#fff",
//                       fontWeight: 600,
//                       fontSize: 14,
//                       cursor: deleteLoading ? "not-allowed" : "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: 8,
//                       opacity: deleteLoading ? 0.5 : 1,
//                     }}
//                   >
//                     {deleteLoading ? (
//                       <>
//                         <div
//                           style={{
//                             width: 14,
//                             height: 14,
//                             border: "2px solid rgba(255,255,255,0.4)",
//                             borderTopColor: "#fff",
//                             borderRadius: "50%",
//                             animation: "spin 0.8s linear infinite",
//                           }}
//                         />
//                         Deleting...
//                       </>
//                     ) : (
//                       <>
//                         <Trash2 size={16} />
//                         Delete
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

export default function Modules() {
  const navigate = useNavigate();
  const location = useLocation();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
  key: "display_id",
  direction: "desc",
});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: "all" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});

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

  const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });

  const fetchModules = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const [modulesRes, coursesRes] = await Promise.all([
        fetch("https://codingcloud.pythonanywhere.com/modules/"),
        fetch("https://codingcloud.pythonanywhere.com/course/"),
      ]);
      const modulesData = await modulesRes.json();
      const coursesData = await coursesRes.json();

      if (modulesData.success) {
        const sorted = [...modulesData.data].sort((a, b) => b.id - a.id);
        const withIds = sorted.map((item, index) => ({
          ...item,
          display_id: index + 1,
        }));
        setModules(withIds);

        const courses = [
          ...new Set(modulesData.data.map((m) => m.course_data)),
        ].sort((a, b) => a - b);
        setUniqueCourses(courses);

        const courseMap = {};
        const actualCourses = coursesData.data || coursesData;
        if (Array.isArray(actualCourses))
          actualCourses.forEach((c) => {
            courseMap[c.id] = c.name;
          });
        setCoursesMap(courseMap);
        setError(null);
      } else {
        if (!silent) setError("Failed to fetch modules");
      }
    } catch {
      if (!silent) setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchModules(false);
  }, []);

  useEffect(() => {
    if (location.state?.fromAdd) {
      setCurrentPage(1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // ── Derived — no state, no jerk ──
  const filteredModules = (() => {
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
      if (sortConfig.key === "display_id") {
        aVal = a.display_id || 0;
        bVal = b.display_id || 0;
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
  })();

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

  // Reset page on dependency change
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

  const handleDeleteClick = (e, module) => {
    e.stopPropagation();
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!moduleToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/modules/${moduleToDelete.id}/`,
        { method: "DELETE" },
      );
      if (response.ok || response.status === 204) {
        setToast({
          show: true,
          message: "Module deleted successfully!",
          type: "error",
        });
        fetchModules(true);
        setShowDeleteModal(false);
        setModuleToDelete(null);
      } else {
        setToast({
          show: true,
          message: "Failed to delete module.",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
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

  if (loading) {
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
            Loading modules…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
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
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .mod-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .mod-row { transition: background 0.13s; cursor: pointer; }
        .mod-row:hover { background: #fafafa; }
        .mod-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .mod-action-btn.view:hover { background: #f1f5f9; color: #475569; }
        .mod-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
        .mod-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }
        .mod-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .mod-th-btn:hover { color: #475569; }
        .mod-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .mod-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .mod-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .mod-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .mod-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .mod-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .mod-search::placeholder { color: #cbd5e1; }
        .mod-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .mod-select:focus { border-color: #7c3aed; }
        .mod-filter-select { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .mod-filter-select:focus { border-color: #7c3aed; }
        .mod-add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(124,58,237,0.28); transition: opacity 0.15s; font-family: inherit; flex-shrink: 0; }
        .mod-add-btn:hover { opacity: 0.9; }
        .mod-filter-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; flex-shrink: 0; }
        .mod-filter-btn.active { border-color: #a78bfa; background: #f5f3ff; color: #6d28d9; }
        .mod-filter-btn:hover { background: #f8fafc; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div style={{ padding: "28px 16px" }}>
        {/* ── Header ── */}
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
              <Layers size={17} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Modules
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
              {modules.length}
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
            Manage your course modules and lessons
          </p>
        </div>

        {/* ── Toolbar ── */}
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
                className="mod-search"
                type="text"
                placeholder="Search by module name, course or ID…"
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
                className="mod-select"
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

            {/* Filter toggle */}
            <button
              className={`mod-filter-btn${showFilters || activeFiltersCount > 0 ? " active" : ""}`}
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

            {/* Add Module */}
            <button
              className="mod-add-btn"
              onClick={() => navigate("/add-module")}
            >
              <Plus size={16} /> Add Module
            </button>
          </div>

          {/* Expandable filter — Course only */}
          {showFilters && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <div>
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
                  Course
                </label>
                <select
                  className="mod-filter-select"
                  value={filters.course}
                  onChange={(e) => setFilters({ course: e.target.value })}
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

        {/* ── Gap ── */}
        <div style={{ height: 20 }} />

        {/* ── Table / Empty ── */}
        {filteredModules.length === 0 ? (
          <div
            className="mod-animate"
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
              <Layers size={27} color="#cbd5e1" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 6px",
              }}
            >
              No modules found
            </h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || filters.course !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first module."}
            </p>
            <button
              onClick={() => navigate("/add-module")}
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
              <Plus size={15} /> Add Module
            </button>
          </div>
        ) : (
          <div
            className="mod-animate"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* Silent refresh bar */}
            {refreshing && (
              <div
                style={{
                  height: 3,
                  background:
                    "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.2s linear infinite",
                }}
              />
            )}

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 500,
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
                        width: 56,
                      }}
                    >
                      <button
                        className="mod-th-btn"
                        onClick={() => handleSort("display_id")}
                      >
                        # <SortIcon col="display_id" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="mod-th-btn"
                        onClick={() => handleSort("name")}
                      >
                        Module Name <SortIcon col="name" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="mod-th-btn"
                        onClick={() => handleSort("course")}
                      >
                        Course <SortIcon col="course" />
                      </button>
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
                  {paginatedModules.map((module, index) => (
                    <tr
                      key={module.id}
                      className="mod-row"
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                      onClick={() => {
                        setSelectedModule(module);
                        setShowViewModal(true);
                      }}
                    >
                      {/* # */}
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

                      {/* Module name */}
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
                              width: 38,
                              height: 38,
                              background: "#f5f3ff",
                              borderRadius: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <BookMarked size={15} color="#7c3aed" />
                          </div>
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            {module.name}
                          </span>
                        </div>
                      </td>

                      {/* Course badge */}
                      <td style={{ padding: "15px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 11px",
                            background: "#f5f3ff",
                            color: "#6d28d9",
                            border: "1px solid #ddd6fe",
                            fontSize: 13,
                            fontWeight: 600,
                            borderRadius: 99,
                          }}
                        >
                          <FolderOpen size={11} />
                          {coursesMap[module.course_data] ||
                            `Course ${module.course_data}`}
                        </span>
                      </td>

                      {/* Actions */}
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
                            className="mod-action-btn view"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModule(module);
                              setShowViewModal(true);
                            }}
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="mod-action-btn edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-module/${module.id}`);
                            }}
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="mod-action-btn del"
                            onClick={(e) => handleDeleteClick(e, module)}
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

            {/* ── Pagination ── */}
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
                    filteredModules.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "#475569" }}>
                  {filteredModules.length}
                </strong>{" "}
                modules
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button
                  className="mod-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`mod-page-btn${safePage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="mod-page-btn"
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

      {/* ── View Modal ── */}
      {showViewModal && selectedModule && (
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
              background: "rgba(15,23,42,0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowViewModal(false)}
          />
          <div
            className="mod-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxWidth: 520,
              width: "100%",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowViewModal(false)}
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

            <div style={{ padding: 24 }}>
              {/* Icon + title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "#f5f3ff",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookMarked size={24} color="#7c3aed" />
                </div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {selectedModule.name}
                </h2>
              </div>

              {/* Course */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    margin: "0 0 6px",
                  }}
                >
                  Course
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FolderOpen size={15} color="#7c3aed" />
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {coursesMap[selectedModule.course_data] ||
                      `Course ${selectedModule.course_data}`}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedModule.descriptions && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
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
                    Description
                  </p>
                  <div
                    style={{
                      fontSize: 14.5,
                      color: "#475569",
                      lineHeight: 1.65,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedModule.descriptions,
                    }}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                padding: "14px 24px",
                background: "#f8fafc",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
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
                  navigate(`/edit-module/${selectedModule.id}`);
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
                <Edit size={14} /> Edit Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && moduleToDelete && (
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
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div
            className="mod-animate"
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
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
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
                  Delete Module
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
                    "{moduleToDelete.name}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
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
                disabled={deleteLoading}
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
                disabled={deleteLoading}
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
                  opacity: deleteLoading ? 0.7 : 1,
                  fontFamily: "inherit",
                }}
              >
                {deleteLoading ? (
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

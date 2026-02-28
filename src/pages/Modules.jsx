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
import { useNavigate, useLocation } from "react-router-dom"; // added useLocation
import {
  Search,
  X,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Layers,
  FolderOpen,
  Eye,
  ChevronDown,
  RefreshCw,
  SortAsc,
  SortDesc,
  BookMarked,
} from "lucide-react";
import Toasts from "./Toasts"; // <-- import toast component

export default function Modules() {
  const navigate = useNavigate();
  const location = useLocation(); // to detect navigation from AddModule

  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: "all" });

  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
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

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

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
        const sortedModules = [...modulesData.data].sort((a, b) => b.id - a.id);

const dataWithDisplayIds = sortedModules.map((item, index) => ({
  ...item,
  display_id: index + 1,
}));

setModules(dataWithDisplayIds);

        const courses = [
          ...new Set(modulesData.data.map((m) => m.course_data)),
        ].sort((a, b) => a - b);
        setUniqueCourses(courses);

        const courseMap = {};
        const actualCourses = coursesData.data || coursesData;
        if (Array.isArray(actualCourses)) {
          actualCourses.forEach((course) => {
            courseMap[course.id] = course.name;
          });
        }
        setCoursesMap(courseMap);
      } else {
        if (!silent) setError("Failed to fetch modules");
      }
    } catch {
      if (!silent) setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFirstLoad.current = false;
    }
  };

  useEffect(() => {
    fetchModules(false);
  }, []);

  // Detect if we just added a module and reset to page 1
  useEffect(() => {
    if (location.state?.fromAdd) {
      setCurrentPage(1);
      // Clear the state so it doesn't keep resetting on re-renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Adjust current page if it becomes out of range
  useEffect(() => {
    const maxPage = Math.ceil(filteredModules.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (filteredModules.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredModules.length, itemsPerPage, currentPage]);

  useEffect(() => {
    let result = [...modules];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.display_id.toString().includes(q) ||
          (coursesMap[m.course_data] &&
            coursesMap[m.course_data].toLowerCase().includes(q)),
      );
    }

    if (filters.course !== "all") {
      result = result.filter((m) => m.course_data === parseInt(filters.course));
    }

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

    setFilteredModules(result);
  }, [searchTerm, filters, sortConfig, modules, coursesMap]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({
      key,
      direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-500" />
    ) : (
      <SortDesc size={13} className="text-violet-500" />
    );
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const paginatedModules = filteredModules.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

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
        // Show red toast for delete success
        showToast("Module deleted successfully!", "error");
        fetchModules(true);
        setShowDeleteModal(false);
        setModuleToDelete(null);
      } else {
        showToast("Failed to delete module.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeFiltersCount = [
    filters.course !== "all",
    sortConfig.key !== "name" || sortConfig.direction !== "asc",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-base font-medium">
            Loading modules…
          </p>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Something went wrong
          </h3>
          <p className="text-slate-500 text-base mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-base font-medium"
          >
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Modules</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {modules.length}
            </span>
          </div>
          <p className="text-slate-500 text-base">
            Manage your course modules and lessons
          </p>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by module name, course or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
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
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Add Module */}
            <button
              onClick={() => navigate("/add-module")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium whitespace-nowrap shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Add Module
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Course
                </label>
                <select
                  value={filters.course}
                  onChange={(e) => setFilters({ course: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Items Per Page
                </label>
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
        {filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Layers size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No modules found
            </h3>
            <p className="text-slate-400 text-base mb-5">
              {searchTerm || filters.course !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first module."}
            </p>
            <button
              onClick={() => navigate("/add-module")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium"
            >
              <Plus size={15} /> Add Module
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Silent refresh progress bar */}
            {refreshing && (
              <>
                <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
                <div
                  style={{
                    height: 3,
                    background:
                      "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.2s linear infinite",
                  }}
                />
              </>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-14"
                      onClick={() => handleSort("display_id")}
                    >
                      <span className="flex items-center gap-1">
                        # {getSortIcon("display_id")}
                      </span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("name")}
                    >
                      <span className="flex items-center gap-1">
                        Module Name {getSortIcon("name")}
                      </span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("course")}
                    >
                      <span className="flex items-center gap-1">
                        Course {getSortIcon("course")}
                      </span>
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedModules.map((module, index) => (
                    <tr
                      key={module.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedModule(module);
                        setShowViewModal(true);
                      }}
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-base font-semibold text-slate-400">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Module name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 flex-shrink-0">
                            <BookMarked size={15} />
                          </div>
                          <span className="text-base font-semibold text-slate-800">
                            {module.name}
                          </span>
                        </div>
                      </td>

                      {/* Course badge */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold rounded-full">
                          <FolderOpen size={11} />
                          {coursesMap[module.course_data] ||
                            `Course ${module.course_data}`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModule(module);
                              setShowViewModal(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-module/${module.id}`);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, module)}
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
                Showing{" "}
                <span className="text-slate-700 font-semibold">
                  {indexOfFirstItem + 1}–
                  {Math.min(indexOfLastItem, filteredModules.length)}
                </span>{" "}
                of{" "}
                <span className="text-slate-700 font-semibold">
                  {filteredModules.length}
                </span>{" "}
                modules
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
                      else if (currentPage >= totalPages - 2)
                        page = totalPages - 4 + i;
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
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
      {showViewModal && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden">
            {/* Close */}
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
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedModule.name}
                  </h2>
                  <p className="text-base text-slate-400 mt-0.5">
                    Module #{selectedModule.display_id}
                  </p>
                </div>
              </div>

              {/* Course */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Course
                </p>
                <div className="flex items-center gap-2">
                  <FolderOpen
                    size={15}
                    className="text-violet-500 flex-shrink-0"
                  />
                  <p className="text-base font-semibold text-slate-800">
                    {coursesMap[selectedModule.course_data] ||
                      `Course ${selectedModule.course_data}`}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedModule.description && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Description
                  </p>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {selectedModule.description}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-module/${selectedModule.id}`);
                }}
                className="px-5 py-2 bg-violet-600 text-white text-base font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
              >
                <Edit size={14} /> Edit Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && moduleToDelete && (
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
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Delete Module
                </h3>
                <p className="text-base text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    "{moduleToDelete.name}"
                  </span>
                  ? This action cannot be undone.
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

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import {
//   BookOpen,
//   Clock,
//   Users,
//   Signal,
//   Globe,
//   Award,
//   Search,
//   Filter,
//   X,
//   Download,
//   SlidersHorizontal,
//   FileText,
//   Eye,
//   Edit,
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   Plus,
//   ArrowUpRight,
//   Layers,
// } from "lucide-react";

// const ITEMS_PER_PAGE = 8;

// export default function Courses() {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [sortBy, setSortBy] = useState("default");
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     level: "all",
//     language: "all",
//     certificate: "all",
//     duration: "all",
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   // Delete confirmation state
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [courseToDelete, setCourseToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState("");
//   const [deleteError, setDeleteError] = useState("");

//   const navigate = useNavigate();

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/course/",
//       );
//       const data = await response.json();

//       if (data.success) {
//         setCourses(data.data);
//         setFilteredCourses(data.data);

//         const uniqueCategories = [
//           ...new Map(
//             data.data.map((course) => [
//               course.category_details?.id,
//               course.category_details,
//             ]),
//           ).values(),
//         ];
//         setCategories(uniqueCategories);
//       } else {
//         setError("Failed to fetch courses");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//       console.error("Error fetching courses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Filter and sort courses
//   useEffect(() => {
//     let filtered = [...courses];

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (course) =>
//           course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.category_details?.name ||
//           "-".toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (course) => course.category_details?.id === parseInt(selectedCategory),
//       );
//     }

//     if (filters.level !== "all") {
//       filtered = filtered.filter(
//         (course) => course.level?.toLowerCase() === filters.level.toLowerCase(),
//       );
//     }

//     if (filters.language !== "all") {
//       filtered = filtered.filter(
//         (course) =>
//           course.language?.toLowerCase() === filters.language.toLowerCase(),
//       );
//     }

//     if (filters.certificate !== "all") {
//       filtered = filtered.filter(
//         (course) =>
//           (filters.certificate === "yes" && course.certificate === "Yes") ||
//           (filters.certificate === "no" && course.certificate === "No"),
//       );
//     }

//     if (filters.duration !== "all") {
//       filtered = filtered.filter((course) => {
//         if (!course.duration) return false;
//         const duration = course.duration.toLowerCase();
//         if (filters.duration === "short")
//           return duration.includes("hour") || duration.includes("min");
//         if (filters.duration === "medium") return duration.includes("week");
//         if (filters.duration === "long") return duration.includes("month");
//         return true;
//       });
//     }

//     switch (sortBy) {
//       case "name-asc":
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "name-desc":
//         filtered.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       case "duration-asc":
//         filtered.sort((a, b) => {
//           const durA = getDurationNumber(a.duration);
//           const durB = getDurationNumber(b.duration);
//           return durA - durB;
//         });
//         break;
//       case "duration-desc":
//         filtered.sort((a, b) => {
//           const durA = parseInt(a.duration) || 0;
//           const durB = parseInt(b.duration) || 0;
//           return durB - durA;
//         });
//         break;
//       case "students":
//         filtered.sort(
//           (a, b) => (parseInt(b.students) || 0) - (parseInt(a.students) || 0),
//         );
//         break;
//       default:
//         filtered.sort((a, b) => b.id - a.id);
//     }

//     setFilteredCourses(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedCategory, filters, sortBy, courses]);

//   const openCourseModal = (course) => {
//     setSelectedCourse(course);
//     setShowModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeCourseModal = () => {
//     setShowModal(false);
//     setSelectedCourse(null);
//     document.body.style.overflow = "unset";
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedCategory("all");
//     setFilters({
//       level: "all",
//       language: "all",
//       certificate: "all",
//       duration: "all",
//     });
//     setSortBy("default");
//   };

//   const handleEdit = (e, courseId) => {
//     e.stopPropagation();
//     navigate(`/edit-course/${courseId}`);
//   };

//   const handleDeleteClick = (e, course) => {
//     e.stopPropagation();
//     setCourseToDelete(course);
//     setShowDeleteModal(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!courseToDelete) return;

//     // Optimistic UI update - remove course immediately
//     const courseId = courseToDelete.id;
//     setCourses((prev) => prev.filter((c) => c.id !== courseId));
//     setFilteredCourses((prev) => prev.filter((c) => c.id !== courseId));

//     // Close modal immediately for better UX
//     setShowDeleteModal(false);
//     setDeleteLoading(false);

//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/course/${courseId}/`,
//         { method: "DELETE", headers: { "Content-Type": "application/json" } },
//       );

//       if (!response.ok && response.status !== 204) {
//         // If deletion fails, refetch courses to restore data
//         await fetchCourses();
//         setDeleteError("Failed to delete course. Data has been restored.");
//         setTimeout(() => setDeleteError(""), 3000);
//       }
//     } catch (err) {
//       console.error("Error deleting course:", err);
//       // Refetch courses on error to ensure consistency
//       await fetchCourses();
//       setDeleteError("Network error. Please try again.");
//       setTimeout(() => setDeleteError(""), 3000);
//     }
//   };

//   const languages = [
//     ...new Set(courses.map((c) => c.language).filter(Boolean)),
//   ];

//   const getLevelBadge = (level) => {
//     if (!level) return { bg: "#f3f4f6", color: "#6b7280" };
//     switch (level.toLowerCase()) {
//       case "beginner":
//         return { bg: "#dcfce7", color: "#16a34a" };
//       case "intermediate":
//         return { bg: "#fef9c3", color: "#ca8a04" };
//       case "hard":
//       case "advanced":
//         return { bg: "#fee2e2", color: "#dc2626" };
//       default:
//         return { bg: "#dbeafe", color: "#2563eb" };
//     }
//   };

//   const paginatedCourses = filteredCourses.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );
//   const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

//   // Stat card data
//   const totalStudents = courses.reduce(
//     (acc, c) => acc + (parseInt(c.students) || 0),
//     0,
//   );
//   const certCourses = courses.filter((c) => c.certificate === "Yes").length;
//   const statCards = [
//     {
//       label: "Total Courses",
//       value: courses.length,
//       color: "#2563eb",
//       pct: 72,
//     },
//     {
//       label: "Total Students",
//       value: `${totalStudents}+`,
//       color: "#2563eb",
//       pct: 58,
//     },
//     {
//       label: "Categories",
//       value: categories.length,
//       color: "#2563eb",
//       pct: 45,
//     },
//     {
//       label: "With Certificate",
//       value: certCourses,
//       color: "#2563eb",
//       pct: 83,
//     },
//   ];

//   const CircularProgress = ({ pct, color, size = 52 }) => {
//     const r = 20;
//     const circ = 2 * Math.PI * r;
//     const offset = circ - (pct / 100) * circ;
//     return (
//       <svg width={size} height={size} viewBox="0 0 48 48">
//         <circle
//           cx="24"
//           cy="24"
//           r={r}
//           fill="none"
//           stroke="#e5e7eb"
//           strokeWidth="4"
//         />
//         <circle
//           cx="24"
//           cy="24"
//           r={r}
//           fill="none"
//           stroke={color}
//           strokeWidth="4"
//           strokeDasharray={circ}
//           strokeDashoffset={offset}
//           strokeLinecap="round"
//           transform="rotate(-90 24 24)"
//         />
//         <foreignObject x="8" y="8" width="32" height="32">
//           <div
//             style={{
//               width: 32,
//               height: 32,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ArrowUpRight size={14} color={color} />
//           </div>
//         </foreignObject>
//       </svg>
//     );
//   };

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
//           <p style={{ color: "#6b7280", fontSize: 14 }}>Loading courses...</p>
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
//           @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//           .course-row:hover { background: #f9fafb; }
//           .action-btn { transition: all 0.15s; }
//           .action-btn:hover { background: #f3f4f6; transform: scale(1.05); }
//           .filter-sel { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; font-size: 13px; color: #374151; background: #fff; outline: none; appearance: none; cursor: pointer; }
//           .filter-sel:focus { border-color: #2563eb; }
//           .page-btn { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; transition: background 0.15s; }
//           .page-btn:hover:not(:disabled) { background: #f3f4f6; }
//           .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//           @media (max-width: 640px) {
//             .stat-grid { grid-template-columns: 1fr 1fr !important; }
//             .table-wrap { overflow-x: auto; }
//             .hide-mobile { display: none !important; }
//           }
//           @media (max-width: 400px) {
//             .stat-grid { grid-template-columns: 1fr !important; }
//           }
//         `}</style>

//       {/* ── Stat Cards ── */}
//       <div
//         className="stat-grid"
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(4, 1fr)",
//           gap: 16,
//           marginBottom: 24,
//         }}
//       >
//         {statCards.map((s, i) => (
//           <div
//             key={i}
//             style={{
//               background: "#fff",
//               borderRadius: 14,
//               padding: "18px 20px",
//               display: "flex",
//               alignItems: "center",
//               gap: 16,
//               boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//             }}
//           >
//             <CircularProgress pct={s.pct} color={s.color} />
//             <div>
//               <p
//                 style={{
//                   fontSize: 12,
//                   color: "#9ca3af",
//                   margin: 0,
//                   fontWeight: 500,
//                 }}
//               >
//                 {s.label}
//               </p>
//               <p
//                 style={{
//                   fontSize: 22,
//                   fontWeight: 700,
//                   color: "#111827",
//                   margin: "2px 0 0",
//                 }}
//               >
//                 {s.value}
//               </p>
//             </div>
//           </div>
//         ))}
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
//           <X size={16} color="#dc2626" />
//           <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
//             {deleteError}
//           </p>
//         </div>
//       )}

//       {/* ── Table Card ── */}
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
//           {/* Left: Filter + Add */}
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
//             {(selectedCategory !== "all" ||
//               Object.values(filters).some((v) => v !== "all")) && (
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

//           <button
//             onClick={() => navigate("/add-course")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "8px 16px",
//               borderRadius: 8,
//               background: "#2563eb",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             <Plus size={15} />
//             Add Course
//           </button>

//           {/* Spacer */}
//           <div style={{ flex: 1 }} />

//           {/* Search */}
//           <div style={{ position: "relative", minWidth: 200 }}>
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
//               placeholder="Search"
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
//                 gap: 10,
//                 alignItems: "flex-end",
//               }}
//             >
//               {[
//                 {
//                   label: "Category",
//                   value: selectedCategory,
//                   onChange: (v) => setSelectedCategory(v),
//                   options: [
//                     { value: "all", label: "All Categories" },
//                     ...categories.map((c) => ({ value: c.id, label: c.name })),
//                   ],
//                 },
//                 {
//                   label: "Level",
//                   value: filters.level,
//                   onChange: (v) => setFilters({ ...filters, level: v }),
//                   options: [
//                     { value: "all", label: "All Levels" },
//                     { value: "beginner", label: "Beginner" },
//                     { value: "intermediate", label: "Intermediate" },
//                     { value: "hard", label: "Advanced" },
//                   ],
//                 },
//                 {
//                   label: "Language",
//                   value: filters.language,
//                   onChange: (v) => setFilters({ ...filters, language: v }),
//                   options: [
//                     { value: "all", label: "All Languages" },
//                     ...languages.map((l) => ({ value: l, label: l })),
//                   ],
//                 },
//                 {
//                   label: "Certificate",
//                   value: filters.certificate,
//                   onChange: (v) => setFilters({ ...filters, certificate: v }),
//                   options: [
//                     { value: "all", label: "All" },
//                     { value: "yes", label: "With Certificate" },
//                     { value: "no", label: "Without" },
//                   ],
//                 },
//                 {
//                   label: "Sort By",
//                   value: sortBy,
//                   onChange: (v) => setSortBy(v),
//                   options: [
//                     { value: "default", label: "Newest First" },
//                     { value: "name-asc", label: "Name A-Z" },
//                     { value: "name-desc", label: "Name Z-A" },
//                     { value: "students", label: "Most Popular" },
//                   ],
//                 },
//               ].map((f, i) => (
//                 <div key={i}>
//                   <p
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 600,
//                       color: "#9ca3af",
//                       textTransform: "uppercase",
//                       letterSpacing: "0.06em",
//                       marginBottom: 4,
//                     }}
//                   >
//                     {f.label}
//                   </p>
//                   <select
//                     className="filter-sel"
//                     value={f.value}
//                     onChange={(e) => f.onChange(e.target.value)}
//                   >
//                     {f.options.map((o) => (
//                       <option key={o.value} value={o.value}>
//                         {o.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ))}
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
//                 Reset
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         <div className="table-wrap">
//           {filteredCourses.length === 0 ? (
//             <div style={{ padding: "60px 20px", textAlign: "center" }}>
//               <div
//                 style={{
//                   background: "#f3f4f6",
//                   borderRadius: "50%",
//                   width: 64,
//                   height: 64,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 16px",
//                 }}
//               >
//                 <BookOpen size={28} color="#9ca3af" />
//               </div>
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "#111827",
//                   marginBottom: 6,
//                 }}
//               >
//                 No courses found
//               </h3>
//               <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>
//                 Try adjusting your search or filter criteria
//               </p>
//               <button
//                 onClick={resetFilters}
//                 style={{
//                   padding: "8px 20px",
//                   background: "#2563eb",
//                   color: "#fff",
//                   borderRadius: 8,
//                   border: "none",
//                   cursor: "pointer",
//                   fontWeight: 500,
//                 }}
//               >
//                 Clear filters
//               </button>
//             </div>
//           ) : (
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 fontSize: 13,
//               }}
//             >
//               <thead>
//                 <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
//                   {[
//                     { label: "Course", width: "auto" },
//                     { label: "Category", width: 120 },
//                     { label: "Level", width: 110 },
//                     { label: "Duration", width: 110 },
//                     { label: "Students", width: 100 },
//                     { label: "Language", width: 100 },
//                     { label: "Certificate", width: 110 },
//                     { label: "", width: 80 },
//                   ].map((col, i) => (
//                     <th
//                       key={i}
//                       style={{
//                         padding: "12px 14px",
//                         textAlign: "left",
//                         fontSize: 12,
//                         fontWeight: 600,
//                         color: "#9ca3af",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.06em",
//                         whiteSpace: "nowrap",
//                         width: col.width,
//                       }}
//                       className={i > 0 && i < 7 ? "hide-mobile" : ""}
//                     >
//                       <span
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 4,
//                         }}
//                       >
//                         {col.label}
//                         {col.label && <ChevronDown size={12} />}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedCourses.map((course) => {
//                   const lvl = getLevelBadge(course.level);
//                   return (
//                     <tr
//                       key={course.id}
//                       className="course-row"
//                       style={{
//                         borderBottom: "1px solid #f9fafb",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => openCourseModal(course)}
//                     >
//                       {/* Course name + image */}
//                       <td style={{ padding: "14px 14px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 12,
//                           }}
//                         >
//                           <img
//                             src={`https://codingcloud.pythonanywhere.com${course.image}`}
//                             alt={course.name}
//                             onError={(e) => {
//                               e.target.src =
//                                 "https://via.placeholder.com/40x40?text=C";
//                             }}
//                             style={{
//                               width: 40,
//                               height: 40,
//                               borderRadius: 10,
//                               objectFit: "cover",
//                               flexShrink: 0,
//                               background: "#f3f4f6",
//                             }}
//                           />
//                           <div>
//                             <p
//                               style={{
//                                 fontWeight: 600,
//                                 color: "#111827",
//                                 margin: 0,
//                                 fontSize: 13,
//                                 whiteSpace: "nowrap",
//                                 maxWidth: 200,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               {course.name}
//                             </p>
//                             <p
//                               style={{
//                                 color: "#9ca3af",
//                                 margin: "2px 0 0",
//                                 fontSize: 12,
//                                 whiteSpace: "nowrap",
//                                 maxWidth: 200,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               {course.text
//                                 ? course.text.slice(0, 50) +
//                                   (course.text.length > 50 ? "…" : "")
//                                 : "No description"}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Category */}
//                       <td
//                         style={{ padding: "14px 14px" }}
//                         className="hide-mobile"
//                       >
//                         <span
//                           style={{
//                             fontSize: 12,
//                             color: "#4b5563",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {course.category_details.name}
//                         </span>
//                       </td>

//                       {/* Level */}
//                       <td
//                         style={{ padding: "14px 14px" }}
//                         className="hide-mobile"
//                       >
//                         {course.level ? (
//                           <span
//                             style={{
//                               padding: "3px 10px",
//                               borderRadius: 20,
//                               fontSize: 11,
//                               fontWeight: 600,
//                               background: lvl.bg,
//                               color: lvl.color,
//                             }}
//                           >
//                             {course.level}
//                           </span>
//                         ) : (
//                           <span style={{ color: "#d1d5db" }}>—</span>
//                         )}
//                       </td>

//                       {/* Duration */}
//                       <td
//                         style={{ padding: "14px 14px", color: "#4b5563" }}
//                         className="hide-mobile"
//                       >
//                         {course.duration || (
//                           <span style={{ color: "#d1d5db" }}>—</span>
//                         )}
//                       </td>

//                       {/* Students */}
//                       <td
//                         style={{ padding: "14px 14px", color: "#4b5563" }}
//                         className="hide-mobile"
//                       >
//                         {course.students || (
//                           <span style={{ color: "#d1d5db" }}>—</span>
//                         )}
//                       </td>

//                       {/* Language */}
//                       <td
//                         style={{ padding: "14px 14px", color: "#4b5563" }}
//                         className="hide-mobile"
//                       >
//                         {course.language || (
//                           <span style={{ color: "#d1d5db" }}>—</span>
//                         )}
//                       </td>

//                       {/* Certificate */}
//                       <td
//                         style={{ padding: "14px 14px" }}
//                         className="hide-mobile"
//                       >
//                         {course.certificate === "Yes" ? (
//                           <span
//                             style={{
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: 4,
//                               fontSize: 11,
//                               fontWeight: 600,
//                               color: "#ca8a04",
//                               background: "#fef9c3",
//                               padding: "3px 10px",
//                               borderRadius: 20,
//                             }}
//                           >
//                             <Award size={11} />
//                             Yes
//                           </span>
//                         ) : (
//                           <span style={{ color: "#d1d5db", fontSize: 12 }}>
//                             No
//                           </span>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td
//                         style={{ padding: "14px 14px" }}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 4,
//                           }}
//                         >
//                           <button
//                             onClick={(e) => handleDeleteClick(e, course)}
//                             className="action-btn"
//                             style={{
//                               width: 32,
//                               height: 32,
//                               borderRadius: 6,
//                               border: "none",
//                               background: "transparent",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#9ca3af",
//                             }}
//                           >
//                             <Trash2 size={15} />
//                           </button>
//                           <button
//                             onClick={(e) => handleEdit(e, course.id)}
//                             className="action-btn"
//                             style={{
//                               width: 32,
//                               height: 32,
//                               borderRadius: 6,
//                               border: "none",
//                               background: "transparent",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#9ca3af",
//                             }}
//                           >
//                             <Edit size={15} />
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
//         {filteredCourses.length > 0 && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "14px 20px",
//               borderTop: "1px solid #f3f4f6",
//             }}
//           >
//             <button
//               className="page-btn"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span style={{ fontSize: 13, color: "#6b7280" }}>
//               Page <strong style={{ color: "#111827" }}>{currentPage}</strong>{" "}
//               of {totalPages}
//             </span>
//             <button
//               className="page-btn"
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ── Course Detail Modal ── */}
//       {showModal && selectedCourse && (
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
//             onClick={closeCourseModal}
//           />
//           <div
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               width: "100%",
//               maxWidth: 800,
//               maxHeight: "90vh",
//               overflowY: "auto",
//               boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
//             }}
//           >
//             <button
//               onClick={closeCourseModal}
//               style={{
//                 position: "absolute",
//                 top: 16,
//                 right: 16,
//                 zIndex: 10,
//                 width: 36,
//                 height: 36,
//                 background: "rgba(255,255,255,0.9)",
//                 border: "none",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//               }}
//             >
//               <X size={18} color="#374151" />
//             </button>

//             {/* Banner */}
//             <div
//               style={{
//                 position: "relative",
//                 height: 260,
//                 background: "#111827",
//                 borderRadius: "20px 20px 0 0",
//                 overflow: "hidden",
//               }}
//             >
//               <img
//                 src={`https://codingcloud.pythonanywhere.com${selectedCourse.banner_img || selectedCourse.image}`}
//                 alt={selectedCourse.name}
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/800x260?text=Course";
//                 }}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   opacity: 0.75,
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background:
//                     "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   padding: "24px 28px",
//                 }}
//               >
//                 <h2
//                   style={{
//                     color: "#fff",
//                     fontWeight: 700,
//                     fontSize: 26,
//                     margin: "0 0 8px",
//                   }}
//                 >
//                   {selectedCourse.name}
//                 </h2>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   <span
//                     style={{
//                       padding: "4px 12px",
//                       background: "rgba(255,255,255,0.2)",
//                       backdropFilter: "blur(4px)",
//                       borderRadius: 20,
//                       fontSize: 12,
//                       color: "#fff",
//                     }}
//                   >
//                     {selectedCourse.category_details.name}
//                   </span>
//                   {selectedCourse.level &&
//                     (() => {
//                       const lvl = getLevelBadge(selectedCourse.level);
//                       return (
//                         <span
//                           style={{
//                             padding: "4px 12px",
//                             borderRadius: 20,
//                             fontSize: 12,
//                             fontWeight: 600,
//                             background: lvl.bg,
//                             color: lvl.color,
//                           }}
//                         >
//                           {selectedCourse.level}
//                         </span>
//                       );
//                     })()}
//                 </div>
//               </div>
//             </div>

//             <div style={{ padding: "28px" }}>
//               {/* Stats */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
//                   gap: 12,
//                   marginBottom: 24,
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
//                         background: "#f9fafb",
//                         borderRadius: 10,
//                         padding: "14px",
//                         textAlign: "center",
//                       }}
//                     >
//                       <s.icon
//                         size={18}
//                         style={{ color: "#2563eb", margin: "0 auto 6px" }}
//                       />
//                       <p
//                         style={{
//                           fontSize: 11,
//                           color: "#9ca3af",
//                           margin: "0 0 2px",
//                         }}
//                       >
//                         {s.label}
//                       </p>
//                       <p
//                         style={{
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#111827",
//                           margin: 0,
//                         }}
//                       >
//                         {s.val}
//                       </p>
//                     </div>
//                   ))}
//               </div>

//               {/* Description */}
//               <div style={{ marginBottom: 24 }}>
//                 <h3
//                   style={{
//                     fontSize: 16,
//                     fontWeight: 600,
//                     color: "#111827",
//                     marginBottom: 10,
//                   }}
//                 >
//                   About this course
//                 </h3>
//                 <p
//                   style={{
//                     color: "#4b5563",
//                     lineHeight: 1.7,
//                     fontSize: 14,
//                     whiteSpace: "pre-line",
//                   }}
//                 >
//                   {selectedCourse.text || "No description available."}
//                 </p>
//               </div>

//               {/* Keywords */}
//               {selectedCourse.keywords && (
//                 <div style={{ marginBottom: 24 }}>
//                   <h4
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 600,
//                       color: "#6b7280",
//                       marginBottom: 8,
//                     }}
//                   >
//                     Keywords
//                   </h4>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//                     {selectedCourse.keywords.split(",").map((k, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           padding: "4px 12px",
//                           background: "#f3f4f6",
//                           borderRadius: 20,
//                           fontSize: 12,
//                           color: "#4b5563",
//                         }}
//                       >
//                         {k.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Actions */}
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                 <button
//                   onClick={(e) => {
//                     closeCourseModal();
//                     handleEdit(e, selectedCourse.id);
//                   }}
//                   style={{
//                     flex: 1,
//                     minWidth: 120,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 8,
//                     padding: "11px",
//                     background: "#2563eb",
//                     color: "#fff",
//                     borderRadius: 10,
//                     border: "none",
//                     cursor: "pointer",
//                     fontWeight: 600,
//                     fontSize: 14,
//                   }}
//                 >
//                   <Edit size={16} />
//                   Edit Course
//                 </button>
//                 {selectedCourse.pdf_file && (
//                   <a
//                     href={`https://codingcloud.pythonanywhere.com${selectedCourse.pdf_file}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       flex: 1,
//                       minWidth: 120,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: 8,
//                       padding: "11px",
//                       background: "#f3f4f6",
//                       color: "#374151",
//                       borderRadius: 10,
//                       border: "none",
//                       cursor: "pointer",
//                       fontWeight: 600,
//                       fontSize: 14,
//                       textDecoration: "none",
//                     }}
//                   >
//                     <Download size={16} />
//                     Syllabus
//                   </a>
//                 )}
//                 <button
//                   onClick={closeCourseModal}
//                   style={{
//                     flex: 1,
//                     minWidth: 100,
//                     padding: "11px",
//                     border: "1px solid #e5e7eb",
//                     color: "#374151",
//                     borderRadius: 10,
//                     background: "#fff",
//                     cursor: "pointer",
//                     fontWeight: 600,
//                     fontSize: 14,
//                   }}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Modal ── */}
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
//               maxWidth: 440,
//               padding: 32,
//               boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
//             }}
//           >
//             <div
//               style={{
//                 width: 60,
//                 height: 60,
//                 borderRadius: "50%",
//                 background: "#fee2e2",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 16px",
//               }}
//             >
//               <AlertCircle size={28} color="#dc2626" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 18,
//                 fontWeight: 700,
//                 color: "#111827",
//                 textAlign: "center",
//                 marginBottom: 8,
//               }}
//             >
//               Delete Course
//             </h3>
//             <p
//               style={{
//                 fontSize: 14,
//                 color: "#6b7280",
//                 textAlign: "center",
//                 marginBottom: 24,
//                 lineHeight: 1.6,
//               }}
//             >
//               Are you sure you want to delete{" "}
//               <strong style={{ color: "#111827" }}>
//                 "{courseToDelete.name}"
//               </strong>
//               ? This cannot be undone.
//             </p>

//             {deleteSuccess && (
//               <div
//                 style={{
//                   marginBottom: 16,
//                   padding: "10px 14px",
//                   background: "#f0fdf4",
//                   border: "1px solid #bbf7d0",
//                   borderRadius: 10,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <CheckCircle size={16} color="#16a34a" />
//                 <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>
//                   {deleteSuccess}
//                 </p>
//               </div>
//             )}

//             <div style={{ display: "flex", gap: 10 }}>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 style={{
//                   flex: 1,
//                   padding: "11px",
//                   border: "1px solid #e5e7eb",
//                   borderRadius: 10,
//                   background: "#fff",
//                   color: "#374151",
//                   fontWeight: 600,
//                   fontSize: 14,
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 style={{
//                   flex: 1,
//                   padding: "11px",
//                   border: "none",
//                   borderRadius: 10,
//                   background: "#dc2626",
//                   color: "#fff",
//                   fontWeight: 600,
//                   fontSize: 14,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                 }}
//               >
//                 <Trash2 size={16} /> Delete
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
    Search,
    Plus,
    Edit,
    Trash2,
    AlertCircle,
    CheckCircle,
    X,
    Image as ImageIcon,
    BookOpen,
    Clock,
    Users,
    Award,
    Globe,
    Filter,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    SortAsc,
    SortDesc,
    Download,
    Eye
} from "lucide-react";

export default function Courses() {
    const navigate = useNavigate();

    // State for data
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
    const [filters, setFilters] = useState({
        category: "all",
        level: "all",
        language: "all",
        certificate: "all",
    });
    const [showFilters, setShowFilters] = useState(false);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [deleteError, setDeleteError] = useState("");

    // View modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
            const data = await response.json();

            if (data.success) {
                setCourses(data.data);
                setFilteredCourses(data.data);

                // Extract unique categories
                const uniqueCategories = [
                    ...new Map(
                        data.data.map((course) => [
                            course.category_details?.id,
                            course.category_details,
                        ]),
                    ).values(),
                ];
                setCategories(uniqueCategories);
            } else {
                setError("Failed to fetch courses");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Get unique languages for filter
    const languages = [...new Set(courses.map(c => c.language).filter(Boolean))];

    // Filter and sort courses
    useEffect(() => {
        let result = [...courses];

        // Apply search filter
        if (searchTerm) {
            result = result.filter((course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (course.text && course.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
                course.id.toString().includes(searchTerm) ||
                course.category_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (filters.category !== "all") {
            result = result.filter(
                (course) => course.category_details?.id === parseInt(filters.category)
            );
        }

        // Apply level filter
        if (filters.level !== "all") {
            result = result.filter(
                (course) => course.level?.toLowerCase() === filters.level.toLowerCase()
            );
        }

        // Apply language filter
        if (filters.language !== "all") {
            result = result.filter(
                (course) => course.language?.toLowerCase() === filters.language.toLowerCase()
            );
        }

        // Apply certificate filter
        if (filters.certificate !== "all") {
            result = result.filter(
                (course) =>
                    (filters.certificate === "yes" && course.certificate === "Yes") ||
                    (filters.certificate === "no" && course.certificate === "No")
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === "name") {
                aValue = a.name?.toLowerCase() || "";
                bValue = b.name?.toLowerCase() || "";
            } else if (sortConfig.key === "category") {
                aValue = a.category_details?.name?.toLowerCase() || "";
                bValue = b.category_details?.name?.toLowerCase() || "";
            } else if (sortConfig.key === "students") {
                aValue = parseInt(a.students) || 0;
                bValue = parseInt(b.students) || 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        setFilteredCourses(result);
        setCurrentPage(1);
    }, [searchTerm, filters, sortConfig, courses]);

    // Handle sort
    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
        }));
    };

    // Get sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <SortAsc size={14} className="text-gray-400" />;
        return sortConfig.direction === "asc" 
            ? <SortAsc size={14} className="text-indigo-600" />
            : <SortDesc size={14} className="text-indigo-600" />;
    };

    // Get level badge styles
    const getLevelStyles = (level) => {
        if (!level) return { bg: "#f3f4f6", color: "#6b7280" };
        switch (level.toLowerCase()) {
            case "beginner":
                return { bg: "#dcfce7", color: "#16a34a" };
            case "intermediate":
                return { bg: "#fef9c3", color: "#ca8a04" };
            case "advanced":
            case "hard":
                return { bg: "#fee2e2", color: "#dc2626" };
            default:
                return { bg: "#dbeafe", color: "#2563eb" };
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            category: "all",
            level: "all",
            language: "all",
            certificate: "all",
        });
        setSortConfig({ key: "id", direction: "desc" });
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    // Delete handlers
    const handleDeleteClick = (e, course) => {
        e.stopPropagation();
        setCourseToDelete(course);
        setShowDeleteModal(true);
        setDeleteError("");
        setDeleteSuccess("");
    };

    const handleDeleteConfirm = async () => {
        if (!courseToDelete) return;

        setDeleteLoading(true);
        setDeleteError("");
        setDeleteSuccess("");

        try {
            const response = await fetch(
                `https://codingcloud.pythonanywhere.com/course/${courseToDelete.id}/`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok || response.status === 204) {
                setDeleteSuccess("Course deleted successfully!");
                fetchCourses(); // Refresh list
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                    setDeleteSuccess("");
                }, 1500);
            } else {
                setDeleteError("Failed to delete course.");
            }
        } catch (err) {
            console.error("Error deleting course:", err);
            setDeleteError("Network error. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (e, courseId) => {
        e.stopPropagation();
        navigate(`/edit-course/${courseId}`);
    };

    const handleView = (course) => {
        setSelectedCourse(course);
        setShowViewModal(true);
    };

    const handleAddCourse = () => {
        navigate("/add-course");
    };

    // Calculate stats
    const totalStudents = courses.reduce((acc, c) => acc + (parseInt(c.students) || 0), 0);
    const certCourses = courses.filter(c => c.certificate === "Yes").length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <X size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header with Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Courses</p>
                                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <BookOpen size={20} className="text-indigo-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{totalStudents}+</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users size={20} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Filter size={20} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">With Certificate</p>
                                <p className="text-2xl font-bold text-gray-900">{certCourses}</p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <Award size={20} className="text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Courses</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage and organize your courses
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAddCourse}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span>Add Course</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search by name, description, category, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                                showFilters 
                                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* Reset Button */}
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Level
                                </label>
                                <select
                                    value={filters.level}
                                    onChange={(e) => setFilters({...filters, level: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <select
                                    value={filters.language}
                                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Languages</option>
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Certificate
                                </label>
                                <select
                                    value={filters.certificate}
                                    onChange={(e) => setFilters({...filters, certificate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All</option>
                                    <option value="yes">With Certificate</option>
                                    <option value="no">Without Certificate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Items Per Page
                                </label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                {/* Courses Table */}
                {filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <BookOpen size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || Object.values(filters).some(v => v !== "all")
                                ? "Try adjusting your filters"
                                : "Get started by adding your first course"}
                        </p>
                        <button
                            onClick={handleAddCourse}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Course
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th 
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('id')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    ID {getSortIcon('id')}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th 
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('category')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Category {getSortIcon('category')}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('level')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Level {getSortIcon('level')}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Duration
                                            </th>
                                            <th 
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('students')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Students {getSortIcon('students')}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Language
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Certificate
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedCourses.map((course, index) => {
                                            const levelStyles = getLevelStyles(course.level);
                                            return (
                                                <tr 
                                                    key={course.id} 
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => handleView(course)}
                                                >
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                       {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                {course.image ? (
                                                                    <img
                                                                        src={`https://codingcloud.pythonanywhere.com${course.image}`}
                                                                        alt={course.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://via.placeholder.com/400x300?text=Course';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <ImageIcon size={16} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {course.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                                                                    {course.text || "No description"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-600">
                                                            {course.category_details?.name || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {course.level ? (
                                                            <span
                                                                style={{
                                                                    backgroundColor: levelStyles.bg,
                                                                    color: levelStyles.color,
                                                                }}
                                                                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                                                            >
                                                                {course.level}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Clock size={14} className="text-gray-400" />
                                                            {course.duration || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Users size={14} className="text-gray-400" />
                                                            {course.students || "0"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Globe size={14} className="text-gray-400" />
                                                            {course.language || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {course.certificate === "Yes" ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                                <Award size={12} />
                                                                Yes
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleView(course);
                                                                }}
                                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleEdit(e, course.id)}
                                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                title="Edit Course"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteClick(e, course)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Course"
                                                            >
                                                                <Trash2 size={16} />
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
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCourses.length)} of {filteredCourses.length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* View Course Modal */}
            {showViewModal && selectedCourse && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowViewModal(false)}
                            aria-hidden="true"
                        />

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Course Details
                                    </h3>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Banner/Image */}
                                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={`https://codingcloud.pythonanywhere.com${selectedCourse.banner_img || selectedCourse.image}`}
                                            alt={selectedCourse.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/800x200?text=Course+Banner';
                                            }}
                                        />
                                    </div>

                                    {/* Title and Category */}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedCourse.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                                {selectedCourse.category_details?.name}
                                            </span>
                                            {selectedCourse.level && (
                                                <span
                                                    style={{
                                                        backgroundColor: getLevelStyles(selectedCourse.level).bg,
                                                        color: getLevelStyles(selectedCourse.level).color,
                                                    }}
                                                    className="px-2 py-1 text-xs font-medium rounded-full"
                                                >
                                                    {selectedCourse.level}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <Clock size={16} className="text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500">Duration</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedCourse.duration || "-"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <BookOpen size={16} className="text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500">Lectures</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedCourse.lecture || "-"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <Users size={16} className="text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500">Students</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedCourse.students || "0"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <Globe size={16} className="text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500">Language</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedCourse.language || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">
                                            {selectedCourse.text || "No description available."}
                                        </p>
                                    </div>

                                    {/* Keywords */}
                                    {selectedCourse.keywords && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCourse.keywords.split(',').map((keyword, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                    >
                                                        {keyword.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Syllabus Link */}
                                    {selectedCourse.pdf_file && (
                                        <div>
                                            <a
                                                href={`https://codingcloud.pythonanywhere.com${selectedCourse.pdf_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <Download size={16} />
                                                Download Syllabus
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        navigate(`/edit-course/${selectedCourse.id}`);
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Course
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowViewModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && courseToDelete && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => !deleteLoading && setShowDeleteModal(false)}
                            aria-hidden="true"
                        />

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Delete Course
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete "{courseToDelete.name}"? 
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                        {deleteSuccess && (
                                            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <p className="text-sm text-green-600">{deleteSuccess}</p>
                                            </div>
                                        )}
                                        {deleteError && (
                                            <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                                                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                                                <p className="text-sm text-red-600">{deleteError}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Deleting...
                                        </div>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleteLoading}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
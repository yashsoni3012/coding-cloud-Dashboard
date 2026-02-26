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
  BookOpen, Clock, Users, Globe, Award, Search, Filter, X,
  Download, Edit, Trash2, AlertCircle, CheckCircle, ChevronDown,
  Plus, ArrowUpRight, SortAsc, SortDesc, RefreshCw, Eye,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

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
          c.text?.toLowerCase().includes(q) ||
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

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ category: "all", level: "all", language: "all", certificate: "all" });
    setSortConfig({ key: "id", direction: "desc" });
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
  const statCards = [
    { label: "Total Courses", value: courses.length, pct: 72 },
    { label: "Total Students", value: `${totalStudents}+`, pct: 58 },
    { label: "Categories", value: categories.length, pct: 45 },
    { label: "With Certificate", value: certCount, pct: 83 },
  ];

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-medium">Loading courses…</p>
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
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
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
          <p className="text-sm text-red-600">{toastError}</p>
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
          <p className="text-slate-500 text-sm">Manage your course catalogue</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <CircularProgress pct={s.pct} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ArrowUpRight size={13} className="text-violet-600" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 leading-tight">{s.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
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
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
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

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
              title="Reset filters"
            >
              <RefreshCw size={15} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Add Course */}
            <button
              onClick={() => navigate("/add-course")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium whitespace-nowrap shadow-sm shadow-violet-200"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
            <p className="text-slate-400 text-sm mb-5">
              {searchTerm || Object.values(filters).some((v) => v !== "all")
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first course."}
            </p>
            <button
              onClick={() => navigate("/add-course")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium"
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
                      Cert
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCourses.map((course, index) => (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedCourse(course); setShowViewModal(true); }}
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-400">
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
                            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{course.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {course.text?.slice(0, 55) || "No description"}
                              {course.text?.length > 55 ? "…" : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500 font-medium">
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
                        <span className="text-sm text-slate-500">{course.duration || <span className="text-slate-300">—</span>}</span>
                      </td>

                      {/* Students */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Users size={13} className="text-slate-400" />
                          {course.students || <span className="text-slate-300">—</span>}
                        </div>
                      </td>

                      {/* Language */}
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <span className="text-sm text-slate-500">{course.language || <span className="text-slate-300">—</span>}</span>
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
                  ))}
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

      {/* ── Course Detail Modal ── */}
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
                    <p className="text-sm font-semibold text-slate-800">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">About this course</p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedCourse.text || "No description available."}
                </p>
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
                  <span className="text-sm font-semibold text-amber-700">Certificate of Completion included</span>
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
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <Download size={14} /> Syllabus
                </a>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowViewModal(false); navigate(`/edit-course/${selectedCourse.id}`); }}
                className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
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
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete <span className="font-semibold text-slate-700">"{courseToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700">{deleteSuccess}</p>
              </div>
            )}
            {deleteError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
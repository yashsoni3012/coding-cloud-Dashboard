// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Toasts from "./Toasts";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   AlertCircle,
//   X,
//   ChevronDown,
//   BookOpen,
//   MessageCircleQuestion,
//   Filter,
//   Eye,
//   SortAsc,
//   SortDesc,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw, // ← new icon
// } from "lucide-react";

// // Fetch FAQs and normalize course field to ID
// const fetchFaqs = async () => {
//   const response = await fetch("https://codingcloudapi.codingcloud.co.in/faqs/");
//   if (!response.ok) throw new Error("Failed to fetch FAQs");
//   const data = await response.json();
//   const actualFaqs = data.data || data;
//   if (!Array.isArray(actualFaqs)) return [];

//   // Normalize: ensure faq.course is the course ID (if it's an object, extract id)
//   return actualFaqs.map((faq) => ({
//     ...faq,
//     course: faq.course?.id || faq.course,
//   }));
// };

// // Fetch courses and return map id -> name
// const fetchCoursesMap = async () => {
//   const response = await fetch("https://codingcloudapi.codingcloud.co.in/course/");
//   if (!response.ok) throw new Error("Failed to fetch courses");
//   const data = await response.json();
//   const actualCourses = data.data || data;
//   const map = {};
//   if (Array.isArray(actualCourses)) {
//     actualCourses.forEach((c) => {
//       map[c.id] = c.name;
//     });
//   } else if (typeof actualCourses === "object") {
//     // fallback if API returns object with id keys
//     Object.values(actualCourses).forEach((c) => {
//       if (c && c.id) map[c.id] = c.name;
//     });
//   }
//   return map;
// };

// // Delete FAQ mutation
// const deleteFaq = async (id) => {
//   const response = await fetch(`https://codingcloudapi.codingcloud.co.in/faqs/${id}/`, {
//     method: "DELETE",
//   });
//   if (!response.ok && response.status !== 204) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || "Failed to delete FAQ");
//   }
//   return id;
// };

// export default function FAQs() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // --- TanStack Query for FAQs ---
//   const {
//     data: faqs = [],
//     isLoading: faqsLoading,
//     error: faqsError,
//     refetch, // ← we'll use this for manual refresh
//   } = useQuery({
//     queryKey: ["faqs"],
//     queryFn: fetchFaqs,
//     select: (data) =>
//       data.map((faq, index) => ({ ...faq, display_id: index + 1 })),
//     // Optional: you can set staleTime to 0 (default) and refetchOnWindowFocus true (default)
//   });

//   // --- TanStack Query for courses map ---
//   const {
//     data: coursesMap = {},
//     isLoading: coursesLoading,
//     error: coursesError,
//   } = useQuery({
//     queryKey: ["courses"],
//     queryFn: fetchCoursesMap,
//   });

//   // Combined loading/error states
//   const loading = faqsLoading || coursesLoading;
//   const error = faqsError || coursesError;

//   // --- Delete mutation ---
//   const deleteMutation = useMutation({
//     mutationFn: deleteFaq,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["faqs"] });
//       setToastConfig({
//         show: true,
//         message: "FAQ deleted successfully!",
//         type: "error", // original used "error" for success
//       });
//       setShowDeleteModal(false);
//       setFaqToDelete(null);
//     },
//     onError: (err) => {
//       setToastConfig({
//         show: true,
//         message: err.message || "Failed to delete FAQ.",
//         type: "error",
//       });
//     },
//     onSettled: () => setDeleteLoading(false),
//   });

//   // --- Local UI state (unchanged) ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "id",
//     direction: "desc",
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({ course: "all" });
//   const [expandedFaqs, setExpandedFaqs] = useState(new Set());
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedFaq, setSelectedFaq] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [faqToDelete, setFaqToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [toastConfig, setToastConfig] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   // Helper to safely get course name
//   const getCourseName = (courseValue) => {
//     if (!courseValue) return "Unknown Course";
//     if (typeof courseValue === "object" && courseValue.name) return courseValue.name;
//     const id = Number(courseValue);
//     return coursesMap[id] || `Course ${id}`;
//   };

//   // --- Derived filtered FAQs (memoized) ---
//   const filteredFaqs = useMemo(() => {
//     let result = [...faqs];

//     if (searchTerm) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter((faq) => {
//         const courseName = getCourseName(faq.course);
//         return (
//           faq.question.toLowerCase().includes(q) ||
//           faq.answer.toLowerCase().includes(q) ||
//           courseName.toLowerCase().includes(q) ||
//           faq.display_id.toString().includes(q)
//         );
//       });
//     }

//     if (filters.course !== "all") {
//       const filterId = Number(filters.course);
//       result = result.filter((faq) => Number(faq.course) === filterId);
//     }

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "id") {
//         aVal = a.id || 0;
//         bVal = b.id || 0;
//       } else if (sortConfig.key === "question") {
//         aVal = a.question?.toLowerCase() || "";
//         bVal = b.question?.toLowerCase() || "";
//       } else if (sortConfig.key === "course") {
//         aVal = getCourseName(a.course).toLowerCase();
//         bVal = getCourseName(b.course).toLowerCase();
//       }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   }, [faqs, coursesMap, searchTerm, filters, sortConfig]);

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filters, sortConfig, itemsPerPage]);

//   const handleSort = (key) => {
//     setSortConfig((cur) => ({
//       key,
//       direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key)
//       return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
//     return sortConfig.direction === "asc" ? (
//       <SortAsc size={13} style={{ color: "#7c3aed" }} />
//     ) : (
//       <SortDesc size={13} style={{ color: "#7c3aed" }} />
//     );
//   };

//   const toggleFaq = (faqId) => {
//     setExpandedFaqs((prev) => {
//       const next = new Set(prev);
//       next.has(faqId) ? next.delete(faqId) : next.add(faqId);
//       return next;
//     });
//   };

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

//   const handleDeleteClick = (e, faq) => {
//     e.stopPropagation();
//     setFaqToDelete(faq);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (!faqToDelete) return;
//     setDeleteLoading(true);
//     deleteMutation.mutate(faqToDelete.id);
//   };

//   // Unique courses for filter dropdown (from coursesMap)
//   const uniqueCourses = Object.entries(coursesMap).map(([id, name]) => ({
//     id: parseInt(id),
//     name,
//   })).sort((a, b) => a.name.localeCompare(b.name));

//   const activeFiltersCount = [filters.course !== "all"].filter(Boolean).length;

//   // Helper for consistent avatar colors
//   const avatarColors = [
//     "#7c3aed",
//     "#2563eb",
//     "#0891b2",
//     "#059669",
//     "#d97706",
//     "#dc2626",
//   ];
//   const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
//   const getInitials = (question) =>
//     question ? question.slice(0, 2).toUpperCase() : "FA";

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
//             Loading FAQs…
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
//             onClick={() => window.location.reload()}
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
//         .faq-animate { animation: fadeSlideIn 0.22s ease forwards; }
//         .faq-row { transition: background 0.13s; cursor: pointer; }
//         .faq-row:hover { background: #fafafa; }
//         .faq-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
//         .faq-action-btn:hover { background: #ede9fe; color: #7c3aed; }
//         .faq-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
//         .faq-th-btn:hover { color: #475569; }
//         .faq-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
//         .faq-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .faq-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .faq-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//         .faq-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
//         .faq-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .faq-search::placeholder { color: #cbd5e1; }
//         .faq-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .faq-select:focus { border-color: #7c3aed; }
//         .faq-filter-btn { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.13s; font-family: inherit; white-space: nowrap; }
//         .faq-filter-btn.active { border-color: #7c3aed; background: #ede9fe; color: #7c3aed; }
//         .faq-filter-btn:hover { background: #f1f5f9; }
//         .faq-add-btn { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border: none; border-radius: 10px; background: #7c3aed; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.13s; font-family: inherit; white-space: nowrap; box-shadow: 0 2px 8px rgba(124,58,237,0.25); }
//         .faq-add-btn:hover { background: #6d28d9; }
//         .faq-refresh-btn { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.13s; font-family: inherit; }
//         .faq-refresh-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
//         .faq-copy-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
//         .faq-copy-btn:hover { background: #f1f5f9; }
//         .faq-close-btn { padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
//         .faq-close-btn:hover { background: #f1f5f9; }
//       `}</style>

//       {/* Toast component */}
//       {toastConfig.show && (
//         <Toasts
//           message={toastConfig.message}
//           type={toastConfig.type}
//           onClose={() => setToastConfig({ ...toastConfig, show: false })}
//         />
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
//               <MessageCircleQuestion size={17} color="#fff" />
//             </div>
//             <h1
//               style={{
//                 fontSize: 22,
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               FAQs
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
//               {faqs.length}
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
//                 className="faq-search"
//                 type="text"
//                 placeholder="Search questions, answers or course…"
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

//             {/* Filter toggle */}
//             <button
//               className={`faq-filter-btn ${showFilters || activeFiltersCount > 0 ? "active" : ""}`}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter size={15} />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span
//                   style={{
//                     marginLeft: 2,
//                     background: "#7c3aed",
//                     color: "#fff",
//                     fontSize: 11,
//                     fontWeight: 600,
//                     padding: "2px 6px",
//                     borderRadius: 20,
//                   }}
//                 >
//                   {activeFiltersCount}
//                 </span>
//               )}
//               <ChevronDown
//                 size={14}
//                 style={{
//                   transition: "transform 0.2s",
//                   transform: showFilters ? "rotate(180deg)" : "none",
//                 }}
//               />
//             </button>

//             {/* Add FAQ */}
//             <button
//               className="faq-add-btn"
//               onClick={() => navigate("/add-faq")}
//             >
//               <Plus size={16} /> Add FAQ
//             </button>

//             {/* 🔁 NEW: Manual Refresh Button */}
//             <button
//               className="faq-refresh-btn"
//               onClick={() => refetch()}
//               title="Refresh list"
//             >
//               <RefreshCw size={15} />
//               Refresh
//             </button>
//           </div>

//           {/* Expandable filter panel */}
//           {showFilters && (
//             <div
//               style={{
//                 marginTop: 16,
//                 paddingTop: 16,
//                 borderTop: "1px solid #f1f5f9",
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 16,
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
//                   className="faq-select"
//                   value={filters.course}
//                   onChange={(e) =>
//                     setFilters({ ...filters, course: e.target.value })
//                   }
//                   style={{ width: "100%" }}
//                 >
//                   <option value="all">All Courses</option>
//                   {uniqueCourses.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
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
//                   Items per page
//                 </label>
//                 <select
//                   className="faq-select"
//                   value={itemsPerPage}
//                   onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                   style={{ width: "100%" }}
//                 >
//                   <option value={5}>5 per page</option>
//                   <option value={10}>10 per page</option>
//                   <option value={25}>25 per page</option>
//                   <option value={50}>50 per page</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Gap */}
//         <div style={{ height: 20 }} />

//         {/* Table / Empty state */}
//         {filteredFaqs.length === 0 ? (
//           <div
//             className="faq-animate"
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
//               <MessageCircleQuestion size={27} color="#cbd5e1" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: "#1e293b",
//                 margin: "0 0 6px",
//               }}
//             >
//               No FAQs found
//             </h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm || filters.course !== "all"
//                 ? "Try adjusting your filters or search term."
//                 : "Get started by adding your first FAQ."}
//             </p>
//             {searchTerm || filters.course !== "all" ? (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setFilters({ course: "all" });
//                 }}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "10px 20px",
//                   background: "#7c3aed",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 Clear Filters
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/add-faq")}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "10px 20px",
//                   background: "#7c3aed",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 <Plus size={15} /> Add FAQ
//               </button>
//             )}
//           </div>
//         ) : (
//           <div
//             className="faq-animate"
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
//                   minWidth: 700,
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
//                         className="faq-th-btn"
//                         onClick={() => handleSort("display_id")}
//                       >
//                         # {getSortIcon("display_id")}
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="faq-th-btn"
//                         onClick={() => handleSort("question")}
//                       >
//                         Question {getSortIcon("question")}
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="faq-th-btn"
//                         onClick={() => handleSort("course")}
//                       >
//                         Course {getSortIcon("course")}
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
//                   {paginatedFaqs.map((faq, index) => {
//                     const isExpanded = expandedFaqs.has(faq.id);
//                     const color = getColor(faq.id);
//                     return (
//                       <tr
//                         key={faq.id}
//                         className="faq-row"
//                         style={{ borderBottom: "1px solid #f1f5f9" }}
//                         onClick={() => {
//                           setSelectedFaq(faq);
//                           setShowViewModal(true);
//                         }}
//                       >
//                         {/* # */}
//                         <td
//                           style={{
//                             padding: "15px 18px",
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#cbd5e1",
//                             verticalAlign: "top",
//                           }}
//                         >
//                           {indexOfFirstItem + index + 1}
//                         </td>

//                         {/* Question column with expandable answer */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "flex-start",
//                               gap: 10,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 width: 32,
//                                 height: 32,
//                                 borderRadius: 8,
//                                 background: color,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 color: "#fff",
//                                 fontSize: 11,
//                                 fontWeight: 700,
//                                 flexShrink: 0,
//                               }}
//                             >
//                               {getInitials(faq.question)}
//                             </div>
//                             <div style={{ flex: 1 }}>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   toggleFaq(faq.id);
//                                 }}
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "space-between",
//                                   width: "100%",
//                                   background: "none",
//                                   border: "none",
//                                   cursor: "pointer",
//                                   textAlign: "left",
//                                   padding: 0,
//                                 }}
//                               >
//                                 <span
//                                   style={{
//                                     fontSize: 15,
//                                     fontWeight: 600,
//                                     color: "#1e293b",
//                                   }}
//                                 >
//                                   {faq.question}
//                                 </span>
//                                 <ChevronDown
//                                   size={15}
//                                   style={{
//                                     color: "#94a3b8",
//                                     transition: "transform 0.2s",
//                                     transform: isExpanded
//                                       ? "rotate(180deg)"
//                                       : "none",
//                                     flexShrink: 0,
//                                   }}
//                                 />
//                               </button>
//                               {isExpanded && (
//                                 <div
//                                   style={{
//                                     marginTop: 10,
//                                     paddingLeft: 10,
//                                     borderLeft: "2px solid #ede9fe",
//                                   }}
//                                 >
//                                   <p
//                                     style={{
//                                       fontSize: 14,
//                                       color: "#64748b",
//                                       lineHeight: 1.6,
//                                       margin: 0,
//                                       whiteSpace: "pre-wrap",
//                                     }}
//                                   >
//                                     {faq.answer}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Course badge */}
//                         <td
//                           style={{ padding: "15px 18px", verticalAlign: "top" }}
//                         >
//                           <span
//                             style={{
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: 5,
//                               padding: "4px 10px",
//                               background: "#ede9fe",
//                               color: "#6d28d9",
//                               border: "1px solid #ddd6fe",
//                               fontSize: 12.5,
//                               fontWeight: 600,
//                               borderRadius: 99,
//                             }}
//                           >
//                             <BookOpen size={10} />
//                             {getCourseName(faq.course)}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td
//                           style={{ padding: "15px 18px", verticalAlign: "top" }}
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "flex-end",
//                               gap: 2,
//                             }}
//                           >
//                             <button
//                               className="faq-action-btn"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedFaq(faq);
//                                 setShowViewModal(true);
//                               }}
//                               title="View"
//                             >
//                               <Eye size={15} />
//                             </button>
//                             <button
//                               className="faq-action-btn"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/edit-faq/${faq.id}`, {
//                                   state: { faq },
//                                 });
//                               }}
//                               title="Edit"
//                             >
//                               <Edit size={15} />
//                             </button>
//                             <button
//                               className="faq-action-btn"
//                               onClick={(e) => handleDeleteClick(e, faq)}
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
//                   {Math.min(indexOfLastItem, filteredFaqs.length)}
//                 </strong>{" "}
//                 of{" "}
//                 <strong style={{ color: "#475569" }}>
//                   {filteredFaqs.length}
//                 </strong>{" "}
//                 FAQs
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button
//                   className="faq-page-btn"
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                   let page = i + 1;
//                   if (totalPages > 5) {
//                     if (currentPage <= 3) page = i + 1;
//                     else if (currentPage >= totalPages - 2)
//                       page = totalPages - 4 + i;
//                     else page = currentPage - 2 + i;
//                   }
//                   return (
//                     <button
//                       key={page}
//                       className={`faq-page-btn${currentPage === page ? " active" : ""}`}
//                       onClick={() => setCurrentPage(page)}
//                     >
//                       {page}
//                     </button>
//                   );
//                 })}
//                 <button
//                   className="faq-page-btn"
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(p + 1, totalPages))
//                   }
//                   disabled={currentPage === totalPages}
//                 >
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* View Modal */}
//       {showViewModal && selectedFaq && (
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
//             className="faq-animate"
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//               maxWidth: 520,
//               width: "100%",
//               zIndex: 10,
//               overflow: "hidden",
//               maxHeight: "90vh",
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
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#94a3b8",
//                 padding: 6,
//                 borderRadius: 8,
//                 display: "flex",
//                 zIndex: 10,
//               }}
//             >
//               <X size={15} />
//             </button>

//             <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
//               {/* Avatar + Question */}
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
//                     borderRadius: 14,
//                     background: getColor(selectedFaq.id),
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                     fontSize: 18,
//                     fontWeight: 700,
//                     flexShrink: 0,
//                   }}
//                 >
//                   {getInitials(selectedFaq.question)}
//                 </div>
//                 <div>
//                   <h2
//                     style={{
//                       fontSize: 20,
//                       fontWeight: 700,
//                       color: "#0f172a",
//                       margin: 0,
//                     }}
//                   >
//                     {selectedFaq.question}
//                   </h2>
//                   <p
//                     style={{
//                       fontSize: 13.5,
//                       color: "#94a3b8",
//                       margin: "3px 0 0",
//                     }}
//                   >
//                     FAQ #{selectedFaq.display_id}
//                   </p>
//                 </div>
//               </div>

//               {/* Course */}
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   border: "1px solid #f1f5f9",
//                   borderRadius: 12,
//                   padding: 14,
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
//                     margin: "0 0 5px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                   }}
//                 >
//                   <BookOpen size={11} color="#7c3aed" /> Course
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 15,
//                     fontWeight: 600,
//                     color: "#1e293b",
//                     margin: 0,
//                   }}
//                 >
//                   {getCourseName(selectedFaq.course)}
//                 </p>
//               </div>

//               {/* Answer */}
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   border: "1px solid #f1f5f9",
//                   borderRadius: 12,
//                   padding: 14,
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.07em",
//                     color: "#94a3b8",
//                     margin: "0 0 8px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                   }}
//                 >
//                   <MessageCircleQuestion size={11} color="#7c3aed" /> Answer
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 14.5,
//                     color: "#475569",
//                     lineHeight: 1.65,
//                     margin: 0,
//                     whiteSpace: "pre-wrap",
//                   }}
//                 >
//                   {selectedFaq.answer}
//                 </p>
//               </div>
//             </div>

//             {/* Footer */}
//             <div
//               style={{
//                 padding: "14px 24px",
//                 background: "#f8fafc",
//                 borderTop: "1px solid #f1f5f9",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 10,
//                 flexShrink: 0,
//               }}
//             >
//               <button
//                 className="faq-close-btn"
//                 onClick={() => setShowViewModal(false)}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   setShowViewModal(false);
//                   navigate(`/edit-faq/${selectedFaq.id}`, {
//                     state: { faq: selectedFaq },
//                   });
//                 }}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "9px 18px",
//                   background: "#7c3aed",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   fontFamily: "inherit",
//                 }}
//               >
//                 <Edit size={14} /> Edit FAQ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && faqToDelete && (
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
//             onClick={() => !deleteLoading && setShowDeleteModal(false)}
//           />
//           <div
//             className="faq-animate"
//             style={{
//               position: "relative",
//               background: "#fff",
//               borderRadius: 20,
//               boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//               maxWidth: 400,
//               width: "100%",
//               zIndex: 10,
//               padding: 24,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
//               <div
//                 style={{
//                   width: 44,
//                   height: 44,
//                   borderRadius: 12,
//                   background: "#fef2f2",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <AlertCircle size={22} color="#ef4444" />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <h3
//                   style={{
//                     fontSize: 18,
//                     fontWeight: 700,
//                     color: "#0f172a",
//                     margin: "0 0 4px",
//                   }}
//                 >
//                   Delete FAQ
//                 </h3>
//                 <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
//                   Are you sure you want to delete "
//                   <strong style={{ color: "#1e293b" }}>
//                     {faqToDelete.question}
//                   </strong>
//                   "? This action cannot be undone.
//                 </p>
//               </div>
//             </div>

//             <div
//               style={{
//                 marginTop: 24,
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 10,
//               }}
//             >
//               <button
//                 className="faq-close-btn"
//                 onClick={() => setShowDeleteModal(false)}
//                 disabled={deleteLoading}
//                 style={{ opacity: deleteLoading ? 0.5 : 1 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={deleteLoading}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "9px 18px",
//                   background: "#ef4444",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14,
//                   fontWeight: 600,
//                   cursor: deleteLoading ? "not-allowed" : "pointer",
//                   fontFamily: "inherit",
//                   opacity: deleteLoading ? 0.6 : 1,
//                 }}
//               >
//                 {deleteLoading ? (
//                   <>
//                     <div
//                       style={{
//                         width: 14,
//                         height: 14,
//                         border: "2px solid #fff",
//                         borderTopColor: "transparent",
//                         borderRadius: "50%",
//                         animation: "spin 0.6s linear infinite",
//                       }}
//                     />
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

import { useState, useEffect, useMemo, useRef } from "react";
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
  MessageCircleQuestion,
  Eye,
  ChevronDown,
  SortAsc,
  SortDesc,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Toasts from "./Toasts";

/* ─── API helpers ─────────────────────────────────── */
const BASE = "https://codingcloudapi.codingcloud.co.in";

const fetchFaqs = async () => {
  const res = await fetch(`${BASE}/faqs/`);
  if (!res.ok) throw new Error("Failed to fetch FAQs");
  const data = await res.json();
  const actualFaqs = data.data || data;
  if (!Array.isArray(actualFaqs)) return [];
  // Normalize course field (sometimes it's an object with id)
  return actualFaqs.map((faq) => ({
    ...faq,
    course: faq.course?.id || faq.course,
  }));
};

const fetchCourses = async () => {
  const res = await fetch(`${BASE}/course/`);
  const data = await res.json();
  return data.data || data || [];
};

const deleteFaqApi = async (id) => {
  const res = await fetch(`${BASE}/faqs/${id}/`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete FAQ");
  }
  return id;
};

/* ─── Component ───────────────────────────────────── */
export default function FAQs() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  /* queries */
  const {
    data: rawFaqs = [],
    isLoading: faqsLoading,
    error: faqsError,
    isFetching: faqsFetching,
    refetch: refetchFaqs,
  } = useQuery({ queryKey: ["faqs"], queryFn: fetchFaqs });

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
    () => [...new Set(rawFaqs.map((f) => f.course).filter(Boolean))].sort((a, b) => a - b),
    [rawFaqs]
  );

  const faqs = useMemo(() => {
    const sorted = [...rawFaqs].sort((a, b) => b.id - a.id);
    return sorted.map((item, index) => ({ ...item, display_id: index + 1 }));
  }, [rawFaqs]);

  /* delete mutation */
  const deleteMutation = useMutation({
    mutationFn: deleteFaqApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setToast({
        show: true,
        message: "FAQ deleted successfully!",
        type: "error", // using "error" type for red success? We'll keep as is
      });
      setShowDeleteModal(false);
      setFaqToDelete(null);
    },
    onError: (err) => {
      setToast({
        show: true,
        message: err.message || "Failed to delete FAQ.",
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
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
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

  /* filtered + sorted faqs */
  const filteredFaqs = useMemo(() => {
    let result = [...faqs];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.display_id.toString().includes(q) ||
          (coursesMap[f.course] && coursesMap[f.course].toLowerCase().includes(q))
      );
    }
    if (filters.course !== "all")
      result = result.filter((f) => f.course === parseInt(filters.course));

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") {
        aVal = a.id || 0;
        bVal = b.id || 0;
      } else if (sortConfig.key === "question") {
        aVal = a.question?.toLowerCase() || "";
        bVal = b.question?.toLowerCase() || "";
      } else if (sortConfig.key === "course") {
        aVal = coursesMap[a.course]?.toLowerCase() || String(a.course);
        bVal = coursesMap[b.course]?.toLowerCase() || String(b.course);
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [faqs, searchTerm, filters, sortConfig, coursesMap]);

  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
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

  const handleDeleteClick = (e, faq) => {
    e.stopPropagation();
    setFaqToDelete(faq);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!faqToDelete) return;
    setDeleteLoading(true);
    deleteMutation.mutate(faqToDelete.id);
  };

  const activeFiltersCount = [filters.course !== "all"].filter(Boolean).length;

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  const loading = faqsLoading || coursesLoading;
  const error = faqsError || coursesError;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">Loading FAQs…</p>
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
          <h3 className="text-base font-bold text-slate-900 mb-2">Something went wrong</h3>
          <p className="text-sm text-slate-400 mb-5">{error.message}</p>
          <button
            onClick={() => refetchFaqs()}
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
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .faq-animate { animation: fadeSlideIn 0.22s ease forwards; }
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
              <MessageCircleQuestion size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">FAQs</h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {faqs.length}
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
              placeholder="Search FAQs…"
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition flex-shrink-0 ${
                showFilters || activeFiltersCount > 0
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <Filter size={14} />
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/add-faq")}
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
                placeholder="Search by question, answer or course…"
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
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Show</span>
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
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">per page</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition flex-shrink-0 ${
                showFilters || activeFiltersCount > 0
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
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
              onClick={() => navigate("/add-faq")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
            >
              <Plus size={15} /> Add FAQ
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
                      {faqs.filter((f) => f.course === courseId).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredFaqs.length === 0 ? (
          <div className="faq-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircleQuestion size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">No FAQs found</h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm || filters.course !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first FAQ."}
            </p>
            <button
              onClick={() => navigate("/add-faq")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>
        ) : (
          <div className="faq-animate">
            {/* ══════════════════════════════
                MOBILE CARDS  (< sm)
            ══════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                  onClick={() => {
                    setSelectedFaq(faq);
                    setShowViewModal(true);
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircleQuestion size={18} className="text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {faq.question}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <BookOpen size={11} className="text-violet-400 flex-shrink-0" />
                        <span className="text-xs text-violet-600 font-medium truncate">
                          {coursesMap[faq.course] || `Course ${faq.course}`}
                        </span>
                      </div>
                    </div>
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
                          setSelectedFaq(faq);
                          setShowViewModal(true);
                        },
                      },
                      {
                        label: "Edit",
                        icon: Edit,
                        cls: "text-violet-600 hover:bg-violet-50",
                        fn: (e) => {
                          e.stopPropagation();
                          navigate(`/edit-faq/${faq.id}`, { state: { faq } });
                        },
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        cls: "text-red-500 hover:bg-red-50",
                        fn: (e) => handleDeleteClick(e, faq),
                      },
                    ].map(({ label, icon: Icon, cls, fn }, i, arr) => (
                      <span key={label} className="flex-1 flex">
                        <button
                          onClick={fn}
                          className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold transition ${cls}`}
                        >
                          <Icon size={13} /> {label}
                        </button>
                        {i < arr.length - 1 && <div className="w-px bg-slate-100" />}
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
              {faqsFetching && <div className="shimmer-bar h-0.5 w-full" />}

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
                          onClick={() => handleSort("question")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Question <SortIcon col="question" />
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
                    {paginatedFaqs.map((faq, index) => (
                      <tr
                        key={faq.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedFaq(faq);
                          setShowViewModal(true);
                        }}
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <MessageCircleQuestion size={15} className="text-violet-600" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-semibold text-slate-800 block truncate max-w-[200px] sm:max-w-[260px]">
                                {faq.question}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5 md:hidden">
                                <BookOpen size={10} className="text-violet-400 flex-shrink-0" />
                                <span className="text-xs text-violet-600 font-medium truncate max-w-[180px]">
                                  {coursesMap[faq.course] || `Course ${faq.course}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold rounded-full">
                            <BookOpen size={11} />
                            {coursesMap[faq.course] || `Course ${faq.course}`}
                          </span>
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFaq(faq);
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
                                navigate(`/edit-faq/${faq.id}`, { state: { faq } });
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, faq)}
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
                    {Math.min(indexOfFirstItem + itemsPerPage, filteredFaqs.length)}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">{filteredFaqs.length}</strong> FAQs
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
                      className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${
                        safePage === page
                          ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
                  {indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredFaqs.length)}
                </strong>{" "}
                of <strong className="text-slate-600">{filteredFaqs.length}</strong>
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
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${
                      safePage === page
                        ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
      {showViewModal && selectedFaq && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="faq-animate relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden">
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
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageCircleQuestion size={22} className="text-violet-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedFaq.question}
                </h2>
              </div>

              {/* Course */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3.5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Course
                </p>
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-violet-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-slate-800">
                    {coursesMap[selectedFaq.course] || `Course ${selectedFaq.course}`}
                  </p>
                </div>
              </div>

              {/* Answer */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  Answer
                </p>
                <div
                  className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
                />
              </div>
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
                  navigate(`/edit-faq/${selectedFaq.id}`, { state: { faq: selectedFaq } });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                <Edit size={14} /> Edit FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════ */}
      {showDeleteModal && faqToDelete && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="faq-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
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
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete FAQ</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">“{faqToDelete.question}”</strong>? This
                  action cannot be undone.
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
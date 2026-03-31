// import React, { useState, useEffect, useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Search,
//   Mail,
//   Phone,
//   MapPin,
//   BookOpen,
//   X,
//   User,
//   SortAsc,
//   SortDesc,
//   Eye,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Download,
// } from "lucide-react";
// import * as XLSX from "xlsx";

// // Fetch enrollments function
// const fetchEnrollments = async () => {
//   const response = await fetch(
//     "https://codingcloudapi.codingcloud.co.in/enroll",
//   );
//   if (!response.ok)
//     throw new Error(`HTTP ${response.status} · ${response.statusText}`);
//   const data = await response.json();
//   // Ensure data is an array, then add display_id based on original order
//   return (Array.isArray(data) ? data : []).map((item, index) => ({
//     ...item,
//     display_id: index + 1,
//   }));
// };

// export default function EnrollmentList() {
//   // --- TanStack Query: fetch enrollments ---
//   const {
//     data: enrollments = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["enrollments"],
//     queryFn: fetchEnrollments,
//   });

//   // Local UI state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "display_id",
//     direction: "desc",
//   });
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedEnrollment, setSelectedEnrollment] = useState(null);

//   const prevSearch = useRef(searchTerm);
//   const prevSort = useRef(sortConfig);
//   const prevIpp = useRef(itemsPerPage);
//   const prevStartDate = useRef(startDate);
//   const prevEndDate = useRef(endDate);

//   // Helper: get local date (YYYY-MM-DD) from ISO timestamp
//   const getLocalDate = (isoString) => {
//     if (!isoString) return null;
//     const date = new Date(isoString);
//     return date.toLocaleDateString("en-CA");
//   };

//   // Date range filter
//   const isWithinDateRange = (enrollment) => {
//     if (!startDate && !endDate) return true;
//     const enrolledDate = getLocalDate(enrollment.created_at);
//     if (!enrolledDate) return false;

//     if (startDate && !endDate) return enrolledDate >= startDate;
//     if (!startDate && endDate) return enrolledDate <= endDate;
//     return enrolledDate >= startDate && enrolledDate <= endDate;
//   };

//   // Filtered enrollments (date + search + sort)
//   const filteredEnrollments = (() => {
//     // 1. Date filter
//     let result = enrollments.filter(isWithinDateRange);

//     // 2. Search filter
//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter(
//         (e) =>
//           `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
//           e.email?.toLowerCase().includes(q) ||
//           e.mobile?.includes(searchTerm) ||
//           e.city?.toLowerCase().includes(q) ||
//           e.course_name?.toLowerCase().includes(q) ||
//           e.display_id?.toString().includes(searchTerm),
//       );
//     }

//     // 3. Sort
//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "display_id") {
//         aVal = a.display_id || 0;
//         bVal = b.display_id || 0;
//       } else if (sortConfig.key === "full_name") {
//         aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
//         bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
//       } else if (sortConfig.key === "email") {
//         aVal = a.email?.toLowerCase() || "";
//         bVal = b.email?.toLowerCase() || "";
//       } else if (sortConfig.key === "course_name") {
//         aVal = a.course_name?.toLowerCase() || "";
//         bVal = b.course_name?.toLowerCase() || "";
//       } else {
//         aVal = 0;
//         bVal = 0;
//       }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   })();

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredEnrollments.length / itemsPerPage),
//   );
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedEnrollments = filteredEnrollments.slice(
//     indexOfFirstItem,
//     indexOfFirstItem + itemsPerPage,
//   );

//   // Reset to page 1 when any filter changes
//   useEffect(() => {
//     if (
//       prevSearch.current !== searchTerm ||
//       prevSort.current !== sortConfig ||
//       prevIpp.current !== itemsPerPage ||
//       prevStartDate.current !== startDate ||
//       prevEndDate.current !== endDate
//     ) {
//       setCurrentPage(1);
//       prevSearch.current = searchTerm;
//       prevSort.current = sortConfig;
//       prevIpp.current = itemsPerPage;
//       prevStartDate.current = startDate;
//       prevEndDate.current = endDate;
//     }
//   }, [searchTerm, sortConfig, itemsPerPage, startDate, endDate]);

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

//   const avatarColors = [
//     "#7c3aed",
//     "#2563eb",
//     "#0891b2",
//     "#059669",
//     "#d97706",
//     "#dc2626",
//   ];
//   const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
//   const getInitials = (first, last) => {
//     if (!first && !last) return "??";
//     return (
//       `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "??"
//     );
//   };

//   // Export to Excel – respects current date range & search filters
//   const exportToExcel = () => {
//     if (filteredEnrollments.length === 0) return;

//     // Sort by display_id ascending for the export (optional)
//     const sortedForExport = [...filteredEnrollments].sort(
//       (a, b) => (a.display_id || 0) - (b.display_id || 0),
//     );

//     const excelData = sortedForExport.map((enrollment) => ({
//       "No.": enrollment.display_id,
//       "First Name": enrollment.first_name || "",
//       "Last Name": enrollment.last_name || "",
//       "Full Name":
//         `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim(),
//       Email: enrollment.email || "",
//       Mobile: enrollment.mobile || "",
//       City: enrollment.city || "",
//       Course: enrollment.course_name || `Course #${enrollment.course_id}`,
//       "Enrolled On": enrollment.created_at
//         ? new Date(enrollment.created_at).toLocaleDateString("en-US")
//         : "",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");

//     const fileName = `enrollments_${startDate || "all"}_${endDate || "all"}_${new Date()
//       .toISOString()
//       .slice(0, 19)}.xlsx`;
//     XLSX.writeFile(workbook, fileName);
//   };

//   // Clear all filters (search + dates)
//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setStartDate("");
//     setEndDate("");
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
//             Loading enrollments…
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
//         .enr-animate { animation: fadeSlideIn 0.22s ease forwards; }
//         .enr-row { transition: background 0.13s; cursor: pointer; }
//         .enr-row:hover { background: #fafafa; }
//         .enr-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
//         .enr-action-btn:hover { background: #ede9fe; color: #7c3aed; }
//         .enr-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
//         .enr-th-btn:hover { color: #475569; }
//         .enr-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
//         .enr-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .enr-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .enr-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//         .enr-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
//         .enr-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .enr-search::placeholder { color: #cbd5e1; }
//         .enr-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .enr-select:focus { border-color: #7c3aed; }
//         .export-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 9px 18px;
//           background: #16a34a;
//           color: #fff;
//           border: none;
//           border-radius: 10px;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: background 0.13s;
//           font-family: inherit;
//           box-shadow: 0 2px 6px rgba(5,150,105,0.2);
//         }
//         .export-btn:hover {
//           background: #15803d;
//         }
//         .export-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }
//         .date-input {
//           padding: 9px 12px;
//           border: 1.5px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 14px;
//           color: #1e293b;
//           background: #f8fafc;
//           outline: none;
//           font-family: inherit;
//           transition: border-color 0.15s;
//         }
//         .date-input:focus {
//           border-color: #7c3aed;
//           background: #fff;
//         }
//         .clear-dates-btn {
//           background: #f1f5f9;
//           border: 1px solid #e2e8f0;
//           color: #475569;
//           padding: 9px 14px;
//           border-radius: 10px;
//           font-size: 13px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.13s;
//         }
//         .clear-dates-btn:hover {
//           background: #e2e8f0;
//         }
//         .clear-all-btn {
//           background: #fee2e2;
//           border: 1px solid #fecaca;
//           color: #b91c1c;
//           padding: 9px 14px;
//           border-radius: 10px;
//           font-size: 13px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.13s;
//         }
//         .clear-all-btn:hover {
//           background: #fecaca;
//         }
//       `}</style>

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
//         {/* Header with Export Button */}
//         <div
//           style={{
//             marginBottom: 24,
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 16,
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 marginBottom: 5,
//               }}
//             >
//               <div
//                 style={{
//                   width: 38,
//                   height: 38,
//                   background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
//                   borderRadius: 11,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
//                 }}
//               >
//                 <BookOpen size={17} color="#fff" />
//               </div>
//               <h1
//                 style={{
//                   fontSize: 22,
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: 0,
//                 }}
//               >
//                 Course Enrollments
//               </h1>
//               <span
//                 style={{
//                   padding: "3px 11px",
//                   background: "#ede9fe",
//                   color: "#6d28d9",
//                   fontSize: 13,
//                   fontWeight: 700,
//                   borderRadius: 99,
//                 }}
//               >
//                 {enrollments.length}
//               </span>
//             </div>
//             <p
//               style={{
//                 fontSize: 14,
//                 color: "#94a3b8",
//                 margin: 0,
//                 paddingLeft: 48,
//               }}
//             >
//               Manage and track student enrollments
//             </p>
//           </div>
//           <button
//             onClick={exportToExcel}
//             disabled={filteredEnrollments.length === 0}
//             className="export-btn"
//           >
//             <Download size={16} />
//             Export to Excel ({filteredEnrollments.length})
//           </button>
//         </div>

//         {/* Toolbar (Search + Date Range + Items per page) */}
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
//               gap: 12,
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
//                 className="enr-search"
//                 type="text"
//                 placeholder="Search by name, email, phone, city, course or ID…"
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

//             {/* Date Range */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 flexWrap: "wrap",
//               }}
//             >
//               <div style={{ position: "relative" }}>
//                 <Calendar
//                   size={14}
//                   style={{
//                     position: "absolute",
//                     left: 10,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "#94a3b8",
//                     pointerEvents: "none",
//                   }}
//                 />
//                 <input
//                   type="date"
//                   className="date-input"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   style={{ paddingLeft: 32 }}
//                   placeholder="Start date"
//                 />
//               </div>
//               <span style={{ color: "#cbd5e1" }}>—</span>
//               <div style={{ position: "relative" }}>
//                 <Calendar
//                   size={14}
//                   style={{
//                     position: "absolute",
//                     left: 10,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "#94a3b8",
//                     pointerEvents: "none",
//                   }}
//                 />
//                 <input
//                   type="date"
//                   className="date-input"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   style={{ paddingLeft: 32 }}
//                   placeholder="End date"
//                 />
//               </div>
//               {(startDate || endDate) && (
//                 <button
//                   onClick={() => {
//                     setStartDate("");
//                     setEndDate("");
//                   }}
//                   className="clear-dates-btn"
//                   title="Clear date filter"
//                 >
//                   <X size={12} style={{ marginRight: 4 }} />
//                   Clear dates
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
//                 marginLeft: "auto",
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
//                 className="enr-select"
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
//           </div>

//           {/* Clear all filters button (visible when any filter is active) */}
//           {(searchTerm || startDate || endDate) && (
//             <div style={{ marginTop: 12, textAlign: "right" }}>
//               <button onClick={clearAllFilters} className="clear-all-btn">
//                 Clear all filters
//               </button>
//             </div>
//           )}
//         </div>

//         <div style={{ height: 20 }} />

//         {/* Table / Empty */}
//         {filteredEnrollments.length === 0 ? (
//           <div
//             className="enr-animate"
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
//               <User size={27} color="#cbd5e1" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: "#1e293b",
//                 margin: "0 0 6px",
//               }}
//             >
//               No enrollments found
//             </h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm || startDate || endDate
//                 ? "Try adjusting your filters."
//                 : "No enrollment records yet."}
//             </p>
//             {(searchTerm || startDate || endDate) && (
//               <button
//                 onClick={clearAllFilters}
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
//                 Clear all filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div
//             className="enr-animate"
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
//                         className="enr-th-btn"
//                         onClick={() => handleSort("display_id")}
//                       >
//                         # <SortIcon col="display_id" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="enr-th-btn"
//                         onClick={() => handleSort("full_name")}
//                       >
//                         Learner <SortIcon col="full_name" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="enr-th-btn"
//                         onClick={() => handleSort("email")}
//                       >
//                         Email <SortIcon col="email" />
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
//                         Phone
//                       </span>
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
//                         City
//                       </span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="enr-th-btn"
//                         onClick={() => handleSort("course_name")}
//                       >
//                         Course <SortIcon col="course_name" />
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
//                   {paginatedEnrollments.map((enrollment, index) => {
//                     const color = getColor(enrollment.id);
//                     const fullName =
//                       `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() ||
//                       "No Name";
//                     return (
//                       <tr
//                         key={enrollment.id}
//                         className="enr-row"
//                         style={{ borderBottom: "1px solid #f1f5f9" }}
//                         onClick={() => {
//                           setSelectedEnrollment(enrollment);
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
//                           }}
//                         >
//                           {indexOfFirstItem + index + 1}
//                         </td>

//                         {/* Learner */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 11,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 width: 38,
//                                 height: 38,
//                                 borderRadius: 10,
//                                 background: color,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 color: "#fff",
//                                 fontSize: 12,
//                                 fontWeight: 700,
//                                 flexShrink: 0,
//                               }}
//                             >
//                               {getInitials(
//                                 enrollment.first_name,
//                                 enrollment.last_name,
//                               )}
//                             </div>
//                             <div>
//                               <span
//                                 style={{
//                                   fontSize: 15,
//                                   fontWeight: 600,
//                                   color: "#1e293b",
//                                   display: "block",
//                                 }}
//                               >
//                                 {fullName}
//                               </span>
//                               <span
//                                 style={{
//                                   fontSize: 12,
//                                   color: "#94a3b8",
//                                   display: "block",
//                                   marginTop: 1,
//                                 }}
//                               >
//                                 {enrollment.course_name ||
//                                   `Course #${enrollment.course_id}`}
//                               </span>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Email */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <a
//                             href={`mailto:${enrollment.email}`}
//                             onClick={(e) => e.stopPropagation()}
//                             style={{
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: 5,
//                               fontSize: 14,
//                               color: "#7c3aed",
//                               textDecoration: "none",
//                               fontWeight: 500,
//                             }}
//                             onMouseOver={(e) =>
//                               (e.currentTarget.style.textDecoration =
//                                 "underline")
//                             }
//                             onMouseOut={(e) =>
//                               (e.currentTarget.style.textDecoration = "none")
//                             }
//                           >
//                             <Mail size={13} />
//                             <span
//                               style={{
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 maxWidth: 160,
//                               }}
//                             >
//                               {enrollment.email || "—"}
//                             </span>
//                           </a>
//                         </td>

//                         {/* Phone */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {enrollment.mobile ? (
//                             <a
//                               href={`tel:${enrollment.mobile}`}
//                               onClick={(e) => e.stopPropagation()}
//                               style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 gap: 5,
//                                 fontSize: 14,
//                                 color: "#475569",
//                                 textDecoration: "none",
//                                 fontWeight: 500,
//                               }}
//                             >
//                               <Phone size={13} color="#94a3b8" />
//                               {enrollment.mobile}
//                             </a>
//                           ) : (
//                             <span style={{ color: "#cbd5e1", fontSize: 14 }}>
//                               —
//                             </span>
//                           )}
//                         </td>

//                         {/* City */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {enrollment.city ? (
//                             <span
//                               style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 gap: 5,
//                                 padding: "4px 10px",
//                                 background: "#f1f5f9",
//                                 color: "#64748b",
//                                 border: "1px solid #e2e8f0",
//                                 fontSize: 12.5,
//                                 fontWeight: 600,
//                                 borderRadius: 99,
//                               }}
//                             >
//                               <MapPin size={10} style={{ flexShrink: 0 }} />
//                               {enrollment.city}
//                             </span>
//                           ) : (
//                             <span style={{ color: "#cbd5e1", fontSize: 14 }}>
//                               —
//                             </span>
//                           )}
//                         </td>

//                         {/* Course */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {enrollment.course_name ? (
//                             <span
//                               style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 gap: 5,
//                                 padding: "4px 11px",
//                                 background: "#7c3aed",
//                                 color: "#fff",
//                                 fontSize: 12.5,
//                                 fontWeight: 600,
//                                 borderRadius: 99,
//                                 maxWidth: 160,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 boxShadow: "0 1px 4px rgba(124,58,237,0.25)",
//                               }}
//                             >
//                               <BookOpen size={10} style={{ flexShrink: 0 }} />
//                               <span
//                                 style={{
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                 }}
//                               >
//                                 {enrollment.course_name}
//                               </span>
//                             </span>
//                           ) : (
//                             <span style={{ fontSize: 14, color: "#94a3b8" }}>
//                               Course #{enrollment.course_id}
//                             </span>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td
//                           style={{ padding: "15px 18px" }}
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "flex-end",
//                             }}
//                           >
//                             <button
//                               className="enr-action-btn"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedEnrollment(enrollment);
//                                 setShowViewModal(true);
//                               }}
//                               title="View Details"
//                             >
//                               <Eye size={15} />
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
//                     filteredEnrollments.length,
//                   )}
//                 </strong>{" "}
//                 of{" "}
//                 <strong style={{ color: "#475569" }}>
//                   {filteredEnrollments.length}
//                 </strong>{" "}
//                 enrollments
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button
//                   className="enr-page-btn"
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={safePage === 1}
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page) => (
//                   <button
//                     key={page}
//                     className={`enr-page-btn${safePage === page ? " active" : ""}`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   className="enr-page-btn"
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

//       {/* View Modal (unchanged) */}
//       {showViewModal && selectedEnrollment && (
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
//             className="enr-animate"
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
//               {/* Avatar + Name */}
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
//                     background: getColor(selectedEnrollment.id),
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                     fontSize: 18,
//                     fontWeight: 700,
//                     flexShrink: 0,
//                   }}
//                 >
//                   {getInitials(
//                     selectedEnrollment.first_name,
//                     selectedEnrollment.last_name,
//                   )}
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
//                     {selectedEnrollment.first_name}{" "}
//                     {selectedEnrollment.last_name}
//                   </h2>
//                   <p
//                     style={{
//                       fontSize: 13.5,
//                       color: "#94a3b8",
//                       margin: "3px 0 0",
//                     }}
//                   >
//                     Enrollment #{selectedEnrollment.display_id}
//                   </p>
//                 </div>
//               </div>

//               {/* Email + Phone */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 12,
//                   marginBottom: 12,
//                 }}
//               >
//                 <div
//                   style={{
//                     background: "#f8fafc",
//                     border: "1px solid #f1f5f9",
//                     borderRadius: 12,
//                     padding: 14,
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.07em",
//                       color: "#94a3b8",
//                       margin: "0 0 5px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <Mail size={11} color="#7c3aed" /> Email
//                   </p>
//                   <a
//                     href={`mailto:${selectedEnrollment.email}`}
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 600,
//                       color: "#7c3aed",
//                       textDecoration: "none",
//                       wordBreak: "break-all",
//                     }}
//                   >
//                     {selectedEnrollment.email || "—"}
//                   </a>
//                 </div>
//                 <div
//                   style={{
//                     background: "#f8fafc",
//                     border: "1px solid #f1f5f9",
//                     borderRadius: 12,
//                     padding: 14,
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.07em",
//                       color: "#94a3b8",
//                       margin: "0 0 5px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <Phone size={11} color="#059669" /> Phone
//                   </p>
//                   {selectedEnrollment.mobile ? (
//                     <a
//                       href={`tel:${selectedEnrollment.mobile}`}
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 600,
//                         color: "#1e293b",
//                         textDecoration: "none",
//                       }}
//                     >
//                       {selectedEnrollment.mobile}
//                     </a>
//                   ) : (
//                     <span
//                       style={{
//                         fontSize: 14,
//                         color: "#94a3b8",
//                         fontStyle: "italic",
//                       }}
//                     >
//                       No phone provided
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* City + Course */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 12,
//                   marginBottom: 12,
//                 }}
//               >
//                 {selectedEnrollment.city && (
//                   <div
//                     style={{
//                       background: "#f8fafc",
//                       border: "1px solid #f1f5f9",
//                       borderRadius: 12,
//                       padding: 14,
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontSize: 11,
//                         fontWeight: 700,
//                         textTransform: "uppercase",
//                         letterSpacing: "0.07em",
//                         color: "#94a3b8",
//                         margin: "0 0 5px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 4,
//                       }}
//                     >
//                       <MapPin size={11} color="#8b5cf6" /> City
//                     </p>
//                     <p
//                       style={{
//                         fontSize: 15,
//                         fontWeight: 600,
//                         color: "#1e293b",
//                         margin: 0,
//                       }}
//                     >
//                       {selectedEnrollment.city}
//                     </p>
//                   </div>
//                 )}
//                 <div
//                   style={{
//                     background: "#f8fafc",
//                     border: "1px solid #f1f5f9",
//                     borderRadius: 12,
//                     padding: 14,
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.07em",
//                       color: "#94a3b8",
//                       margin: "0 0 5px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <BookOpen size={11} color="#f59e0b" /> Course
//                   </p>
//                   <p
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 600,
//                       color: "#1e293b",
//                       margin: 0,
//                     }}
//                   >
//                     {selectedEnrollment.course_name ||
//                       `Course #${selectedEnrollment.course_id}`}
//                   </p>
//                 </div>
//               </div>

//               {/* Enrolled On */}
//               {selectedEnrollment.created_at && (
//                 <div
//                   style={{
//                     background: "#f8fafc",
//                     border: "1px solid #f1f5f9",
//                     borderRadius: 12,
//                     padding: 14,
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.07em",
//                       color: "#94a3b8",
//                       margin: "0 0 5px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <Calendar size={11} color="#7c3aed" /> Enrolled On
//                   </p>
//                   <p
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 600,
//                       color: "#1e293b",
//                       margin: 0,
//                     }}
//                   >
//                     {new Date(selectedEnrollment.created_at).toLocaleDateString(
//                       "en-US",
//                       { year: "numeric", month: "long", day: "numeric" },
//                     )}
//                   </p>
//                 </div>
//               )}
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
//               <a
//                 href={`mailto:${selectedEnrollment.email}`}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "9px 18px",
//                   background: "#7c3aed",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 10,
//                   fontSize: 14.5,
//                   fontWeight: 600,
//                   textDecoration: "none",
//                 }}
//               >
//                 <Mail size={14} /> Send Email
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  X,
  User,
  SortAsc,
  SortDesc,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

/* ─── API ────────────────────────────────────── */
const fetchEnrollments = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/enroll",
  );
  if (!response.ok)
    throw new Error(`HTTP ${response.status} · ${response.statusText}`);
  const data = await response.json();
  return (Array.isArray(data) ? data : []).map((item, index) => ({
    ...item,
    display_id: index + 1,
  }));
};

/* ─── Helpers ────────────────────────────────── */
const avatarColors = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
];
const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
const getInitials = (first, last) => {
  if (!first && !last) return "??";
  return (
    `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "??"
  );
};
const getLocalDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-CA");
};

/* ─── Component ──────────────────────────────── */
export default function EnrollmentList() {
  const {
    data: enrollments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["enrollments"],
    queryFn: fetchEnrollments,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "display_id",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  /* reset page on dep change */
  const prevDeps = useRef({
    searchTerm,
    sortConfig,
    itemsPerPage,
    startDate,
    endDate,
  });
  useEffect(() => {
    const p = prevDeps.current;
    if (
      p.searchTerm !== searchTerm ||
      p.sortConfig !== sortConfig ||
      p.itemsPerPage !== itemsPerPage ||
      p.startDate !== startDate ||
      p.endDate !== endDate
    ) {
      setCurrentPage(1);
      prevDeps.current = {
        searchTerm,
        sortConfig,
        itemsPerPage,
        startDate,
        endDate,
      };
    }
  }, [searchTerm, sortConfig, itemsPerPage, startDate, endDate]);

  /* date filter */
  const isWithinDateRange = (e) => {
    if (!startDate && !endDate) return true;
    const d = getLocalDate(e.created_at);
    if (!d) return false;
    if (startDate && !endDate) return d >= startDate;
    if (!startDate && endDate) return d <= endDate;
    return d >= startDate && d <= endDate;
  };

  /* filtered + sorted */
  const filteredEnrollments = (() => {
    let result = enrollments.filter(isWithinDateRange);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.mobile?.includes(searchTerm) ||
          e.city?.toLowerCase().includes(q) ||
          e.course_name?.toLowerCase().includes(q) ||
          e.display_id?.toString().includes(searchTerm),
      );
    }
    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") {
        aVal = a.display_id || 0;
        bVal = b.display_id || 0;
      } else if (sortConfig.key === "full_name") {
        aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
        bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else if (sortConfig.key === "email") {
        aVal = a.email?.toLowerCase() || "";
        bVal = b.email?.toLowerCase() || "";
      } else if (sortConfig.key === "course_name") {
        aVal = a.course_name?.toLowerCase() || "";
        bVal = b.course_name?.toLowerCase() || "";
      } else {
        aVal = 0;
        bVal = 0;
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  })();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnrollments.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(
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

  const exportToExcel = () => {
    if (!filteredEnrollments.length) return;
    const sorted = [...filteredEnrollments].sort(
      (a, b) => (a.display_id || 0) - (b.display_id || 0),
    );
    const excelData = sorted.map((e) => ({
      "No.": e.display_id,
      "First Name": e.first_name || "",
      "Last Name": e.last_name || "",
      "Full Name": `${e.first_name || ""} ${e.last_name || ""}`.trim(),
      Email: e.email || "",
      Mobile: e.mobile || "",
      City: e.city || "",
      Course: e.course_name || `Course #${e.course_id}`,
      "Enrolled On": e.created_at
        ? new Date(e.created_at).toLocaleDateString("en-US")
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enrollments");
    XLSX.writeFile(
      wb,
      `enrollments_${startDate || "all"}_${endDate || "all"}_${new Date().toISOString().slice(0, 19)}.xlsx`,
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };
  const hasFilters = searchTerm || startDate || endDate;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading enrollments…
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
            onClick={() => refetch()}
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
        .enr-animate { animation: fadeSlideIn 0.22s ease forwards; }
      `}</style>

      <div className="w-full max-w-screen-xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
                <BookOpen size={16} className="text-white" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                Course Enrollments
              </h1>
              <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                {enrollments.length}
              </span>
            </div>
          </div>

          {/* Export button */}
          <button
            onClick={exportToExcel}
            disabled={filteredEnrollments.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-emerald-200 self-start sm:self-auto flex-shrink-0"
          >
            <Download size={15} />
            <span className="hidden xs:inline">Export to Excel</span>
            <span className="inline xs:hidden">Export</span>
            <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-xs font-bold">
              {filteredEnrollments.length}
            </span>
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile: row 1 — search */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search enrollments…"
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

          {/* Mobile: row 2 — dates */}
          <div className="flex items-center gap-2 mb-2.5 sm:hidden">
            <div className="relative flex-1">
              <Calendar
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition"
              />
            </div>
            <span className="text-slate-300 text-xs flex-shrink-0">—</span>
            <div className="relative flex-1">
              <Calendar
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile: row 3 — per page */}
          <div className="flex items-center gap-2 sm:hidden">
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
            <span className="text-xs text-slate-400 font-medium">per page</span>
          </div>

          {/* Tablet/Desktop: single row */}
          <div className="hidden sm:flex items-center gap-2.5 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, city, course or ID…"
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

            {/* Date range */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Calendar
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition w-[140px]"
                />
              </div>
              <span className="text-slate-300">—</span>
              <div className="relative">
                <Calendar
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition w-[140px]"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition flex-shrink-0"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Per page */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
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
          </div>

          {/* Clear all */}
          {hasFilters && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
              >
                <X size={11} /> Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredEnrollments.length === 0 ? (
          <div className="enr-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No enrollments found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {hasFilters
                ? "Try adjusting your filters."
                : "No enrollment records yet."}
            </p>
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="enr-animate">
            {/* ══════════════════════════════
                MOBILE CARDS  (< sm)
            ══════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedEnrollments.map((enrollment, index) => {
                const color = getColor(enrollment.id);
                const fullName =
                  `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() ||
                  "No Name";
                return (
                  <div
                    key={enrollment.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                    onClick={() => {
                      setSelectedEnrollment(enrollment);
                      setShowViewModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: color }}
                      >
                        {getInitials(
                          enrollment.first_name,
                          enrollment.last_name,
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {fullName}
                        </p>
                        <a
                          href={`mailto:${enrollment.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 mt-0.5 text-xs text-violet-600 font-medium truncate no-underline"
                        >
                          <Mail size={11} className="flex-shrink-0" />
                          {enrollment.email || "—"}
                        </a>
                      </div>
                      <span className="text-xs text-slate-300 font-semibold flex-shrink-0">
                        #{indexOfFirstItem + index + 1}
                      </span>
                    </div>

                    {/* Pills */}
                    <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
                      {/* Course */}
                      {enrollment.course_name && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full max-w-[180px] truncate shadow-sm shadow-violet-200">
                          <BookOpen size={9} className="flex-shrink-0" />
                          <span className="truncate">
                            {enrollment.course_name}
                          </span>
                        </span>
                      )}
                      {/* City */}
                      {enrollment.city && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-full">
                          <MapPin size={9} className="flex-shrink-0" />
                          {enrollment.city}
                        </span>
                      )}
                      {/* Phone */}
                      {enrollment.mobile && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 ml-auto">
                          <Phone size={11} />
                          {enrollment.mobile}
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    {enrollment.created_at && (
                      <div className="px-4 pb-3">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(enrollment.created_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    )}

                    {/* Action */}
                    <div className="border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnrollment(enrollment);
                          setShowViewModal(true);
                        }}
                        className="w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition"
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ══════════════════════════════
                DESKTOP TABLE  (sm+)
            ══════════════════════════════ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-12">
                        <button
                          onClick={() => handleSort("display_id")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          # <SortIcon col="display_id" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("full_name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Learner <SortIcon col="full_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort("email")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Email <SortIcon col="email" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden lg:table-cell">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Phone
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden lg:table-cell">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          City
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("course_name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Course <SortIcon col="course_name" />
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
                    {paginatedEnrollments.map((enrollment, index) => {
                      const color = getColor(enrollment.id);
                      const fullName =
                        `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() ||
                        "No Name";
                      return (
                        <tr
                          key={enrollment.id}
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedEnrollment(enrollment);
                            setShowViewModal(true);
                          }}
                        >
                          <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                            {indexOfFirstItem + index + 1}
                          </td>

                          {/* Learner — always visible, extra info inline on sm/md */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: color }}
                              >
                                {getInitials(
                                  enrollment.first_name,
                                  enrollment.last_name,
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-semibold text-slate-800 block truncate max-w-[140px] md:max-w-[160px]">
                                  {fullName}
                                </span>
                                {/* email inline on sm only */}
                                <a
                                  href={`mailto:${enrollment.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="md:hidden flex items-center gap-1 mt-0.5 text-xs text-violet-600 font-medium truncate max-w-[140px] no-underline"
                                >
                                  <Mail size={10} className="flex-shrink-0" />
                                  {enrollment.email || "—"}
                                </a>
                                {/* course inline on sm/md only */}
                                {enrollment.course_name && (
                                  <span className="lg:hidden mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 bg-violet-600 text-white text-xs font-medium rounded-full max-w-[140px] truncate shadow-sm shadow-violet-200">
                                    <BookOpen
                                      size={8}
                                      className="flex-shrink-0"
                                    />
                                    <span className="truncate">
                                      {enrollment.course_name}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email — md+ */}
                          <td className="px-4 py-4 hidden md:table-cell">
                            <a
                              href={`mailto:${enrollment.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-sm text-violet-600 font-medium hover:underline no-underline truncate max-w-[180px]"
                            >
                              <Mail size={13} className="flex-shrink-0" />
                              <span className="truncate">
                                {enrollment.email || "—"}
                              </span>
                            </a>
                          </td>

                          {/* Phone — lg+ */}
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {enrollment.mobile ? (
                              <a
                                href={`tel:${enrollment.mobile}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-sm text-slate-600 font-medium no-underline"
                              >
                                <Phone
                                  size={13}
                                  className="text-slate-400 flex-shrink-0"
                                />
                                {enrollment.mobile}
                              </a>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>

                          {/* City — lg+ */}
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {enrollment.city ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-full">
                                <MapPin size={10} className="flex-shrink-0" />
                                {enrollment.city}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>

                          {/* Course */}
                          <td className="px-4 py-4">
                            {enrollment.course_name ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full max-w-[150px] truncate shadow-sm shadow-violet-200">
                                <BookOpen size={10} className="flex-shrink-0" />
                                <span className="truncate">
                                  {enrollment.course_name}
                                </span>
                              </span>
                            ) : (
                              <span className="text-sm text-slate-400">
                                Course #{enrollment.course_id}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEnrollment(enrollment);
                                  setShowViewModal(true);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                                title="View Details"
                              >
                                <Eye size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                      filteredEnrollments.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredEnrollments.length}
                  </strong>{" "}
                  enrollments
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
                    filteredEnrollments.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {filteredEnrollments.length}
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
      {showViewModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="enr-animate relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
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
            <div className="px-5 sm:px-6 py-5 sm:py-6 overflow-y-auto flex-1">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ background: getColor(selectedEnrollment.id) }}
                >
                  {getInitials(
                    selectedEnrollment.first_name,
                    selectedEnrollment.last_name,
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {selectedEnrollment.first_name}{" "}
                    {selectedEnrollment.last_name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enrollment #{selectedEnrollment.display_id}
                  </p>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Mail size={11} className="text-violet-600" /> Email
                  </p>
                  <a
                    href={`mailto:${selectedEnrollment.email}`}
                    className="text-sm font-semibold text-violet-600 hover:underline break-all no-underline"
                  >
                    {selectedEnrollment.email || "—"}
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Phone size={11} className="text-emerald-600" /> Phone
                  </p>
                  {selectedEnrollment.mobile ? (
                    <a
                      href={`tel:${selectedEnrollment.mobile}`}
                      className="text-sm font-semibold text-slate-800 no-underline"
                    >
                      {selectedEnrollment.mobile}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">
                      No phone provided
                    </span>
                  )}
                </div>
              </div>

              {/* City + Course */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
                {selectedEnrollment.city && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                      <MapPin size={11} className="text-violet-500" /> City
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedEnrollment.city}
                    </p>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen size={11} className="text-amber-500" /> Course
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedEnrollment.course_name ||
                      `Course #${selectedEnrollment.course_id}`}
                  </p>
                </div>
              </div>

              {/* Enrolled On */}
              {selectedEnrollment.created_at && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar size={11} className="text-violet-600" /> Enrolled
                    On
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(selectedEnrollment.created_at).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedEnrollment.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition no-underline"
              >
                <Mail size={14} /> Send Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

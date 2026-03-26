// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   AlertCircle,
//   X,
//   Image as ImageIcon,
//   FolderOpen,
//   Link2,
//   Tag,
//   ChevronLeft,
//   ChevronRight,
//   SortAsc,
//   SortDesc,
// } from "lucide-react";
// import Toasts from "../pages/Toasts";

// // Fetch function (same as before, now used by TanStack Query)
// const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

// const fetchCategories = async () => {
//   const response = await fetch(`${BASE_URL}/category/`);
//   if (!response.ok) throw new Error("Failed to fetch categories");
//   const json = await response.json();
//   return json.data || [];
// };

// export default function Categories() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // --- TanStack Query: fetch with caching ---
//   const {
//     data: categories = [],
//     isLoading,
//     error: queryError,
//     refetch,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//   });

//   // --- Delete mutation (replaces manual fetch) ---
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       const response = await fetch(`${BASE_URL}/category/${id}/`, {
//         method: "DELETE",
//       });
//       if (!response.ok && response.status !== 204) {
//         const data = await response.json().catch(() => ({}));
//         throw new Error(data.message || `HTTP Error: ${response.status}`);
//       }
//       return id;
//     },
//     onSuccess: () => {
//       // Invalidate cache so categories refresh automatically
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//       setToast({
//         show: true,
//         message: "Category deleted successfully!",
//         type: "error",
//       });
//       setShowDeleteModal(false);
//       setCategoryToDelete(null);
//     },
//     onError: (err) => {
//       setDeleteError(err.message);
//     },
//     onSettled: () => {
//       setDeleteLoading(false);
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

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false); // used for spinner
//   const [deleteError, setDeleteError] = useState("");

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   // --- Derived filtered/sorted data (identical) ---
//   const filteredCategories = (() => {
//     let result = [...categories];
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(
//         (c) =>
//           c.name?.toLowerCase().includes(term) ||
//           c.id?.toString().includes(term) ||
//           c.slug?.toLowerCase().includes(term),
//       );
//     }
//     result.sort((a, b) => {
//       const aVal = a[sortConfig.key];
//       const bVal = b[sortConfig.key];
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     return result;
//   })();

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredCategories.length / itemsPerPage),
//   );
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedCategories = filteredCategories.slice(
//     indexOfFirstItem,
//     indexOfFirstItem + itemsPerPage,
//   );

//   // Reset page when search/sort/itemsPerPage changes
//   const prevSearch = useRef(searchTerm);
//   const prevSort = useRef(sortConfig);
//   const prevIpp = useRef(itemsPerPage);
//   useEffect(() => {
//     if (
//       prevSearch.current !== searchTerm ||
//       prevSort.current !== sortConfig ||
//       prevIpp.current !== itemsPerPage
//     ) {
//       setCurrentPage(1);
//       prevSearch.current = searchTerm;
//       prevSort.current = sortConfig;
//       prevIpp.current = itemsPerPage;
//     }
//   }, [searchTerm, sortConfig, itemsPerPage]);

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

//   const handleDeleteClick = (category) => {
//     setCategoryToDelete(category);
//     setShowDeleteModal(true);
//     setDeleteError("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!categoryToDelete) return;
//     setDeleteLoading(true);
//     setDeleteError("");
//     deleteMutation.mutate(categoryToDelete.id);
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

//   // --- Loading / Error UI (using TanStack Query states) ---
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
//             Loading categories…
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

//   // --- Main render (everything below is untouched) ---
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

//         .cat-animate { animation: fadeSlideIn 0.22s ease forwards; }

//         .cat-row { transition: background 0.13s; }
//         .cat-row:hover { background: #fafafa; }

//         .cat-action-btn {
//           background: none; border: none; cursor: pointer;
//           padding: 8px; border-radius: 9px;
//           display: flex; align-items: center; justify-content: center;
//           transition: background 0.13s, color 0.13s;
//           color: #94a3b8;
//         }
//         .cat-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
//         .cat-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }

//         .cat-th-btn {
//           background: none; border: none; cursor: pointer;
//           display: inline-flex; align-items: center; gap: 5px;
//           font-size: 12px; font-weight: 700;
//           text-transform: uppercase; letter-spacing: 0.07em;
//           color: #94a3b8; padding: 0;
//           transition: color 0.13s; font-family: inherit;
//         }
//         .cat-th-btn:hover { color: #475569; }

//         .cat-page-btn {
//           width: 34px; height: 34px; border-radius: 8px;
//           border: 1.5px solid #e2e8f0; background: #fff;
//           font-size: 14px; font-weight: 600; color: #64748b;
//           cursor: pointer; display: flex; align-items: center; justify-content: center;
//           transition: all 0.13s; font-family: inherit;
//         }
//         .cat-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .cat-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .cat-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

//         .cat-search {
//           width: 100%; padding: 11px 36px 11px 40px;
//           border: 1.5px solid #e2e8f0; border-radius: 12px;
//           font-size: 15px; color: #1e293b;
//           background: #f8fafc; outline: none;
//           transition: border-color 0.15s, box-shadow 0.15s;
//           font-family: inherit;
//         }
//         .cat-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .cat-search::placeholder { color: #cbd5e1; }

//         .cat-select {
//           padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px;
//           font-size: 14px; color: #475569; background: #f8fafc;
//           outline: none; cursor: pointer; font-family: inherit; font-weight: 500;
//           transition: border-color 0.15s;
//         }
//         .cat-select:focus { border-color: #7c3aed; }

//         .cat-add-btn {
//           display: flex; align-items: center; gap: 7px;
//           padding: 10px 20px;
//           background: linear-gradient(135deg, #7c3aed, #6d28d9);
//           color: #fff; border: none; border-radius: 12px;
//           font-size: 15px; font-weight: 600; cursor: pointer;
//           white-space: nowrap;
//           box-shadow: 0 3px 12px rgba(124,58,237,0.28);
//           transition: opacity 0.15s; font-family: inherit;
//           flex-shrink: 0;
//         }
//         .cat-add-btn:hover { opacity: 0.9; }
//       `}</style>

//       {toast.show && (
//         <Toasts
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}

//       <div style={{ width: "100%", padding: "28px 16px" }}>
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
//               <Tag size={17} color="#fff" />
//             </div>
//             <h1
//               style={{
//                 fontSize: 22,
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               Categories
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
//               {categories.length}
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
//             Manage and organise your product categories
//           </p>
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
//                 className="cat-search"
//                 type="text"
//                 placeholder="Search by name, slug or ID…"
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
//                 className="cat-select"
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

//             {/* Add button */}
//             <button
//               className="cat-add-btn"
//               onClick={() => navigate("/add-category")}
//             >
//               <Plus size={16} />
//               Add Category
//             </button>
//           </div>
//         </div>

//         <div style={{ height: 20 }} />

//         {/* Table / Empty */}
//         {filteredCategories.length === 0 ? (
//           <div
//             className="cat-animate"
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
//               <FolderOpen size={27} color="#cbd5e1" />
//             </div>
//             <h3
//               style={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: "#1e293b",
//                 margin: "0 0 6px",
//               }}
//             >
//               No categories found
//             </h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm
//                 ? "Try a different search term."
//                 : "Get started by adding your first category."}
//             </p>
//             <button
//               onClick={() => navigate("/add-category")}
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
//               <Plus size={15} /> Add Category
//             </button>
//           </div>
//         ) : (
//           <div
//             className="cat-animate"
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
//                   minWidth: 580,
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
//                         className="cat-th-btn"
//                         onClick={() => handleSort("id")}
//                       >
//                         # <SortIcon col="id" />
//                       </button>
//                     </th>
//                     <th
//                       style={{
//                         padding: "14px 18px",
//                         textAlign: "left",
//                         width: 68,
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
//                         Image
//                       </span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="cat-th-btn"
//                         onClick={() => handleSort("name")}
//                       >
//                         Name <SortIcon col="name" />
//                       </button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button
//                         className="cat-th-btn"
//                         onClick={() => handleSort("slug")}
//                       >
//                         Slug <SortIcon col="slug" />
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
//                   {paginatedCategories.map((category, index) => (
//                     <tr
//                       key={category.id}
//                       className="cat-row"
//                       style={{ borderBottom: "1px solid #f1f5f9" }}
//                     >
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
//                       <td style={{ padding: "15px 18px" }}>
//                         <div
//                           style={{
//                             width: 44,
//                             height: 44,
//                             borderRadius: 11,
//                             overflow: "hidden",
//                             background: "#f1f5f9",
//                             border: "1px solid #e2e8f0",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           {category.image ? (
//                             <img
//                               src={
//                                 category.image?.startsWith("http")
//                                   ? category.image
//                                   : `${BASE_URL}${category.image}`
//                               }
//                               alt={category.name}
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                               loading="lazy"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://via.placeholder.com/80?text=?";
//                               }}
//                             />
//                           ) : (
//                             <ImageIcon size={16} color="#cbd5e1" />
//                           )}
//                         </div>
//                       </td>
//                       <td style={{ padding: "15px 18px" }}>
//                         <span
//                           style={{
//                             fontSize: 15,
//                             fontWeight: 600,
//                             color: "#1e293b",
//                           }}
//                         >
//                           {category.name}
//                         </span>
//                       </td>
//                       <td style={{ padding: "15px 18px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 6,
//                           }}
//                         >
//                           <Link2
//                             size={13}
//                             color="#f59e0b"
//                             style={{ flexShrink: 0 }}
//                           />
//                           <span
//                             style={{
//                               fontSize: 14,
//                               color: "#64748b",
//                               fontFamily: "monospace",
//                             }}
//                           >
//                             {category.slug ? (
//                               `/${category.slug}`
//                             ) : (
//                               <span style={{ color: "#cbd5e1" }}>No slug</span>
//                             )}
//                           </span>
//                         </div>
//                       </td>
//                       <td style={{ padding: "15px 18px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             gap: 4,
//                           }}
//                         >
//                           <button
//                             className="cat-action-btn edit"
//                             onClick={() =>
//                               navigate(`/edit-category/${category.id}`, {
//                                 state: { category },
//                               })
//                             }
//                             title="Edit"
//                           >
//                             <Edit size={15} />
//                           </button>
//                           <button
//                             className="cat-action-btn del"
//                             onClick={() => handleDeleteClick(category)}
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
//                     filteredCategories.length,
//                   )}
//                 </strong>{" "}
//                 of{" "}
//                 <strong style={{ color: "#475569" }}>
//                   {filteredCategories.length}
//                 </strong>{" "}
//                 categories
//               </span>

//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button
//                   className="cat-page-btn"
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={safePage === 1}
//                   aria-label="Previous"
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page) => (
//                   <button
//                     key={page}
//                     className={`cat-page-btn${safePage === page ? " active" : ""}`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   className="cat-page-btn"
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(p + 1, totalPages))
//                   }
//                   disabled={safePage === totalPages}
//                   aria-label="Next"
//                 >
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Modal */}
//       {showDeleteModal && categoryToDelete && (
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
//             className="cat-animate"
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
//                   Delete Category
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
//                     "{categoryToDelete.name}"
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

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Image as ImageIcon,
  FolderOpen,
  Link2,
  Tag,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Toasts from "../pages/Toasts";

const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/category/`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  const json = await response.json();
  return json.data || [];
};

export default function Categories() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/category/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setToast({
        show: true,
        message: "Category deleted successfully!",
        type: "error",
      });
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    },
    onError: (err) => {
      setDeleteError(err.message);
    },
    onSettled: () => {
      setDeleteLoading(false);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const filteredCategories = (() => {
    let result = [...categories];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.id?.toString().includes(term) ||
          c.slug?.toLowerCase().includes(term),
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  })();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

  const prevSearch = useRef(searchTerm);
  const prevSort = useRef(sortConfig);
  const prevIpp = useRef(itemsPerPage);
  useEffect(() => {
    if (
      prevSearch.current !== searchTerm ||
      prevSort.current !== sortConfig ||
      prevIpp.current !== itemsPerPage
    ) {
      setCurrentPage(1);
      prevSearch.current = searchTerm;
      prevSort.current = sortConfig;
      prevIpp.current = itemsPerPage;
    }
  }, [searchTerm, sortConfig, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig((c) => ({
      key,
      direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col)
      return <SortAsc size={13} className="text-slate-300" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-600" />
    ) : (
      <SortDesc size={13} className="text-violet-600" />
    );
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    deleteMutation.mutate(categoryToDelete.id);
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

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading categories…
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
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
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main ──
  return (
    <div className="min-h-screen ">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-animate { animation: fadeSlideIn 0.22s ease forwards; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="w-full ">
        {/* ── Page Header ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <Tag size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
              Categories
            </h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {categories.length}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Row 1 on mobile: Search full width */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, slug or ID…"
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

          {/* Row 2 on mobile: per-page left, add button right */}
          <div className="flex items-center justify-between gap-2 sm:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button
              onClick={() => navigate("/add-category")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition"
            >
              <Plus size={15} />
              Add Category
            </button>
          </div>

          {/* Tablet / Desktop: single row */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, slug or ID…"
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

            {/* Per page */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                Show
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                per page
              </span>
            </div>

            {/* Add button */}
            <button
              onClick={() => navigate("/add-category")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
            >
              <Plus size={15} />
              Add Category
            </button>
          </div>
        </div>

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredCategories.length === 0 ? (
          <div className="cat-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No categories found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm
                ? "Try a different search term."
                : "Get started by adding your first category."}
            </p>
            <button
              onClick={() => navigate("/add-category")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
        ) : (
          <div className="cat-animate">
            {/* ══════════════════════════════════════════
                MOBILE CARD LIST  (visible below sm)
            ══════════════════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm"
                >
                  {/* Image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {category.image ? (
                      <img
                        src={
                          category.image?.startsWith("http")
                            ? category.image
                            : `${BASE_URL}${category.image}`
                        }
                        alt={category.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=?";
                        }}
                      />
                    ) : (
                      <ImageIcon size={16} className="text-slate-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {category.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Link2
                        size={11}
                        className="text-amber-400 flex-shrink-0"
                      />
                      <span className="text-xs text-slate-500 font-mono truncate">
                        {category.slug ? (
                          `/${category.slug}`
                        ) : (
                          <span className="text-slate-300">No slug</span>
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5">
                      #{indexOfFirstItem + index + 1}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/edit-category/${category.id}`, {
                          state: { category },
                        })
                      }
                      className="p-2.5 rounded-xl text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition active:scale-95"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition active:scale-95"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════════
                TABLET / DESKTOP TABLE  (hidden below sm)
            ══════════════════════════════════════════ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-12">
                        <button
                          onClick={() => handleSort("id")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          # <SortIcon col="id" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left w-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Image
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          Name <SortIcon col="name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort("slug")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          Slug <SortIcon col="slug" />
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
                    {paginatedCategories.map((category, index) => (
                      <tr
                        key={category.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        {/* # */}
                        <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Image */}
                        <td className="px-4 py-4">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                            {category.image ? (
                              <img
                                src={
                                  category.image?.startsWith("http")
                                    ? category.image
                                    : `${BASE_URL}${category.image}`
                                }
                                alt={category.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/80?text=?";
                                }}
                              />
                            ) : (
                              <ImageIcon size={15} className="text-slate-300" />
                            )}
                          </div>
                        </td>

                        {/* Name — also shows slug on sm screens (md column hidden) */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-slate-800">
                            {category.name}
                          </span>
                          {/* Slug inline only when the dedicated column is hidden */}
                          <div className="flex items-center gap-1 mt-0.5 md:hidden">
                            <Link2
                              size={11}
                              className="text-amber-400 flex-shrink-0"
                            />
                            <span className="text-xs text-slate-500 font-mono truncate max-w-[160px]">
                              {category.slug ? (
                                `/${category.slug}`
                              ) : (
                                <span className="text-slate-300">No slug</span>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Slug — md+ only */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Link2
                              size={12}
                              className="text-amber-400 flex-shrink-0"
                            />
                            <span className="text-sm text-slate-500 font-mono">
                              {category.slug ? (
                                `/${category.slug}`
                              ) : (
                                <span className="text-slate-300">No slug</span>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate(`/edit-category/${category.id}`, {
                                  state: { category },
                                })
                              }
                              className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category)}
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

              {/* Pagination — inside table card */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-600">
                    {indexOfFirstItem + 1}–
                    {Math.min(
                      indexOfFirstItem + itemsPerPage,
                      filteredCategories.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredCategories.length}
                  </strong>{" "}
                  categories
                </span>

                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={safePage === 1}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Previous"
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
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={safePage === totalPages}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Next"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination — below cards on mobile */}
            <div className="sm:hidden mt-4 flex flex-col items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <strong className="text-slate-600">
                  {indexOfFirstItem + 1}–
                  {Math.min(
                    indexOfFirstItem + itemsPerPage,
                    filteredCategories.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {filteredCategories.length}
                </strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
        )}
      </div>

      {/* ══════════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════════ */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() =>
              !deleteMutation.isPending && setShowDeleteModal(false)
            }
          />

          {/* Sheet on mobile, centered card on sm+ */}
          <div className="cat-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
            {/* Close button */}
            <button
              onClick={() =>
                !deleteMutation.isPending && setShowDeleteModal(false)
              }
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={15} />
            </button>

            {/* Drag handle on mobile */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  Delete Category
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    "{categoryToDelete.name}"
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
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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

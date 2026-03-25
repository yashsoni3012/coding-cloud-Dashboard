// import React, { useState, useEffect, useRef } from "react";
// import {
//   Search, Mail, Phone, Tag, X, Copy,
//   MessageSquare, User, SortAsc, SortDesc,
//   Eye, ChevronLeft, ChevronRight,
// } from "lucide-react";

// export default function Contact() {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [copied, setCopied] = useState(null);

//   const prevSearch = useRef(searchTerm);
//   const prevSort = useRef(sortConfig);
//   const prevIpp = useRef(itemsPerPage);

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("https://codingcloudapi.codingcloud.co.in/contacts/");
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const data = await response.json();
//       if (data.status === "success" && data.data) {
//         setContacts(data.data);
//         setError(null);
//       } else {
//         throw new Error("Invalid API response format");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchContacts(); }, []);

//   // Derived data – no state, no jerk on refresh
//   const filteredContacts = (() => {
//     let result = [...contacts];

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       result = result.filter((c) =>
//         c.full_name?.toLowerCase().includes(q) ||
//         c.email?.toLowerCase().includes(q) ||
//         c.subject?.toLowerCase().includes(q) ||
//         c.message?.toLowerCase().includes(q) ||
//         c.mobile_no?.includes(searchTerm) ||
//         c.id.toString().includes(searchTerm)
//       );
//     }

//     result.sort((a, b) => {
//       let aVal, bVal;
//       if (sortConfig.key === "id")            { aVal = parseInt(a.id) || 0; bVal = parseInt(b.id) || 0; }
//       else if (sortConfig.key === "full_name") { aVal = a.full_name?.toLowerCase() || ""; bVal = b.full_name?.toLowerCase() || ""; }
//       else if (sortConfig.key === "email")     { aVal = a.email?.toLowerCase() || ""; bVal = b.email?.toLowerCase() || ""; }
//       else { aVal = 0; bVal = 0; }
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return result;
//   })();

//   const totalPages = Math.max(1, Math.ceil(filteredContacts.length / itemsPerPage));
//   const safePage = Math.min(currentPage, totalPages);
//   const indexOfFirstItem = (safePage - 1) * itemsPerPage;
//   const paginatedContacts = filteredContacts.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

//   // Reset to page 1 when search/sort/itemsPerPage changes
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
//     if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
//     return sortConfig.direction === "asc"
//       ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
//       : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
//   };

//   const getPageNumbers = () => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (safePage <= 3) return [1, 2, 3, 4, 5];
//     if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//     return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
//   };

//   const getInitials = (name) => (name ? name.slice(0, 2).toUpperCase() : "??");
//   const avatarColors = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
//   const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];

//   const handleCopy = (text, id) => {
//     navigator.clipboard.writeText(text);
//     setCopied(id);
//     setTimeout(() => setCopied(null), 2000);
//   };

//   if (loading) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//           <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading contacts…</p>
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
//           <button onClick={fetchContacts} style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
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
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         .con-animate { animation: fadeSlideIn 0.22s ease forwards; }
//         .con-row { transition: background 0.13s; cursor: pointer; }
//         .con-row:hover { background: #fafafa; }
//         .con-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
//         .con-action-btn:hover { background: #ede9fe; color: #7c3aed; }
//         .con-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
//         .con-th-btn:hover { color: #475569; }
//         .con-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
//         .con-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
//         .con-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
//         .con-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//         .con-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
//         .con-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
//         .con-search::placeholder { color: #cbd5e1; }
//         .con-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
//         .con-select:focus { border-color: #7c3aed; }
//         .con-copy-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
//         .con-copy-btn:hover { background: #f1f5f9; }
//         .con-close-btn { padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
//         .con-close-btn:hover { background: #f1f5f9; }
//       `}</style>

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>

//         {/* Header */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
//             <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
//               <MessageSquare size={17} color="#fff" />
//             </div>
//             <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Contact Messages</h1>
//             <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{contacts.length}</span>
//           </div>
//           <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage and respond to contact form submissions</p>
//         </div>

//         {/* Toolbar */}
//         <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
//           <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

//             {/* Search */}
//             <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
//               <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
//               <input
//                 className="con-search"
//                 type="text"
//                 placeholder="Search by name, email, subject, message or ID…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             {/* Items per page */}
//             <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//               <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>Show</span>
//               <select className="con-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//               <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
//             </div>
//           </div>
//         </div>

//         {/* Gap */}
//         <div style={{ height: 20 }} />

//         {/* Table / Empty */}
//         {filteredContacts.length === 0 ? (
//           <div className="con-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
//             <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//               <User size={27} color="#cbd5e1" />
//             </div>
//             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No contacts found</h3>
//             <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
//               {searchTerm ? "Try a different search term." : "No contact messages yet."}
//             </p>
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
//               >
//                 Clear Search
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="con-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
//                     <th style={{ padding: "14px 18px", textAlign: "left", width: 56 }}>
//                       <button className="con-th-btn" onClick={() => handleSort("id")}># <SortIcon col="id" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button className="con-th-btn" onClick={() => handleSort("full_name")}>Contact <SortIcon col="full_name" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <button className="con-th-btn" onClick={() => handleSort("email")}>Email <SortIcon col="email" /></button>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Phone</span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Subject</span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "left" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Message Preview</span>
//                     </th>
//                     <th style={{ padding: "14px 18px", textAlign: "right" }}>
//                       <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedContacts.map((contact, index) => {
//                     const color = getColor(contact.id);
//                     return (
//                       <tr
//                         key={contact.id}
//                         className="con-row"
//                         style={{ borderBottom: "1px solid #f1f5f9" }}
//                         onClick={() => { setSelectedContact(contact); setShowViewModal(true); }}
//                       >
//                         {/* # */}
//                         <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
//                           {indexOfFirstItem + index + 1}
//                         </td>

//                         {/* Contact name + avatar */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
//                             <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
//                               {getInitials(contact.full_name)}
//                             </div>
//                             <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
//                               {contact.full_name || "No Name"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* Email */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <a
//                             href={`mailto:${contact.email}`}
//                             onClick={(e) => e.stopPropagation()}
//                             style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}
//                             onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
//                             onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
//                           >
//                             <Mail size={13} />
//                             <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
//                               {contact.email || "—"}
//                             </span>
//                           </a>
//                         </td>

//                         {/* Phone */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {contact.mobile_no ? (
//                             <a
//                               href={`tel:${contact.mobile_no}`}
//                               onClick={(e) => e.stopPropagation()}
//                               style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, color: "#475569", textDecoration: "none", fontWeight: 500 }}
//                             >
//                               <Phone size={13} color="#94a3b8" />
//                               {contact.mobile_no}
//                             </a>
//                           ) : (
//                             <span style={{ color: "#cbd5e1", fontSize: 14 }}>—</span>
//                           )}
//                         </td>

//                         {/* Subject */}
//                         <td style={{ padding: "15px 18px" }}>
//                           {contact.subject ? (
//                             <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", fontSize: 12.5, fontWeight: 600, borderRadius: 99, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                               <Tag size={10} style={{ flexShrink: 0 }} />
//                               <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{contact.subject}</span>
//                             </span>
//                           ) : (
//                             <span style={{ color: "#cbd5e1", fontSize: 14 }}>—</span>
//                           )}
//                         </td>

//                         {/* Message preview */}
//                         <td style={{ padding: "15px 18px" }}>
//                           <span style={{ fontSize: 14, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200, display: "block" }}>
//                             {contact.message ? contact.message : <span style={{ fontStyle: "italic" }}>No message</span>}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
//                           <div style={{ display: "flex", justifyContent: "flex-end" }}>
//                             <button
//                               className="con-action-btn"
//                               onClick={(e) => { e.stopPropagation(); setSelectedContact(contact); setShowViewModal(true); }}
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
//             <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
//               <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
//                 Showing{" "}
//                 <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredContacts.length)}</strong>
//                 {" "}of{" "}
//                 <strong style={{ color: "#475569" }}>{filteredContacts.length}</strong> contacts
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                 <button className="con-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}>
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page) => (
//                   <button
//                     key={page}
//                     className={`con-page-btn${safePage === page ? " active" : ""}`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button className="con-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}>
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* View Contact Modal */}
//       {showViewModal && selectedContact && (
//         <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//           <div
//             style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
//             onClick={() => setShowViewModal(false)}
//           />
//           <div className="con-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 520, width: "100%", zIndex: 10, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

//             <button
//               onClick={() => setShowViewModal(false)}
//               style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex", zIndex: 10 }}
//             >
//               <X size={15} />
//             </button>

//             <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>

//               {/* Avatar + Name */}
//               <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
//                 <div style={{ width: 52, height: 52, borderRadius: 14, background: getColor(selectedContact.id), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
//                   {getInitials(selectedContact.full_name)}
//                 </div>
//                 <div>
//                   <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>
//                     {selectedContact.full_name || "No Name"}
//                   </h2>
//                   <p style={{ fontSize: 13.5, color: "#94a3b8", margin: "3px 0 0" }}>Contact #{selectedContact.id}</p>
//                 </div>
//               </div>

//               {/* Email + Phone */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
//                 <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
//                     <Mail size={11} color="#7c3aed" /> Email
//                   </p>
//                   <a href={`mailto:${selectedContact.email}`} style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", textDecoration: "none", wordBreak: "break-all" }}>
//                     {selectedContact.email || "—"}
//                   </a>
//                 </div>
//                 <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
//                     <Phone size={11} color="#059669" /> Phone
//                   </p>
//                   {selectedContact.mobile_no ? (
//                     <a href={`tel:${selectedContact.mobile_no}`} style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", textDecoration: "none" }}>
//                       {selectedContact.mobile_no}
//                     </a>
//                   ) : (
//                     <span style={{ fontSize: 14, color: "#94a3b8", fontStyle: "italic" }}>No phone provided</span>
//                   )}
//                 </div>
//               </div>

//               {/* Subject */}
//               {selectedContact.subject && (
//                 <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14, marginBottom: 14 }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
//                     <Tag size={11} color="#7c3aed" /> Subject
//                   </p>
//                   <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>{selectedContact.subject}</p>
//                 </div>
//               )}

//               {/* Message */}
//               <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
//                 <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 4 }}>
//                   <MessageSquare size={11} color="#7c3aed" /> Message
//                 </p>
//                 <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
//                   {selectedContact.message || "No message provided."}
//                 </p>
//               </div>
//             </div>

//             {/* Footer */}
//             <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
//               <button
//                 className="con-copy-btn"
//                 onClick={() => handleCopy(selectedContact.email, `modal-${selectedContact.id}`)}
//               >
//                 <Copy size={13} />
//                 {copied === `modal-${selectedContact.id}` ? "Copied!" : "Copy Email"}
//               </button>
//               <button className="con-close-btn" onClick={() => setShowViewModal(false)}>
//                 Close
//               </button>
//               <a
//                 href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your inquiry"}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
//               >
//                 <Mail size={14} /> Reply via Email
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
  Tag,
  X,
  Copy,
  MessageSquare,
  User,
  SortAsc,
  SortDesc,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx"; // <-- Add this

// Fetch contacts function
const fetchContacts = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/contacts/",
  );
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  if (data.status === "success" && data.data) {
    return data.data;
  } else {
    throw new Error("Invalid API response format");
  }
};

export default function Contact() {
  // --- TanStack Query: fetch contacts ---
  const {
    data: contacts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });

  // Local UI state (unchanged)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [copied, setCopied] = useState(null);

  const prevSearch = useRef(searchTerm);
  const prevSort = useRef(sortConfig);
  const prevIpp = useRef(itemsPerPage);

  // Derived data – no state, no jerk on refresh
  const filteredContacts = (() => {
    let result = [...contacts];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.full_name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.message?.toLowerCase().includes(q) ||
          c.mobile_no?.includes(searchTerm) ||
          c.id.toString().includes(searchTerm),
      );
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") {
        aVal = parseInt(a.id) || 0;
        bVal = parseInt(b.id) || 0;
      } else if (sortConfig.key === "full_name") {
        aVal = a.full_name?.toLowerCase() || "";
        bVal = b.full_name?.toLowerCase() || "";
      } else if (sortConfig.key === "email") {
        aVal = a.email?.toLowerCase() || "";
        bVal = b.email?.toLowerCase() || "";
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
    Math.ceil(filteredContacts.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

  // Reset to page 1 when search/sort/itemsPerPage changes
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
      return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} style={{ color: "#7c3aed" }} />
    ) : (
      <SortDesc size={13} style={{ color: "#7c3aed" }} />
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

  const getInitials = (name) => (name ? name.slice(0, 2).toUpperCase() : "??");
  const avatarColors = [
    "#7c3aed",
    "#2563eb",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];
  const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (contacts.length === 0) return;

    // ✅ Step 1: Sort contacts in ASCENDING order by ID
    const sortedContacts = [...filteredContacts].sort(
      (a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0),
    );

    // ✅ Step 2: Add Serial Number (1,2,3...)
    const excelData = sortedContacts.map((contact, index) => ({
      "No.": index + 1, // 👈 serial number
      ID: contact.id,
      "Full Name": contact.full_name || "",
      Email: contact.email || "",
      "Mobile No": contact.mobile_no || "",
      Subject: contact.subject || "",
      Message: contact.message || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Messages");

    XLSX.writeFile(
      workbook,
      `contact_messages_${new Date().toISOString().slice(0, 19)}.xlsx`,
    );
  };

  if (isLoading) {
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
            Loading contacts…
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
            {error.message}
          </p>
          <button
            onClick={() => refetch()}
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
        .con-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .con-row { transition: background 0.13s; cursor: pointer; }
        .con-row:hover { background: #fafafa; }
        .con-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .con-action-btn:hover { background: #ede9fe; color: #7c3aed; }
        .con-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .con-th-btn:hover { color: #475569; }
        .con-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .con-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .con-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .con-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .con-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .con-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .con-search::placeholder { color: #cbd5e1; }
        .con-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .con-select:focus { border-color: #7c3aed; }
        .con-copy-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
        .con-copy-btn:hover { background: #f1f5f9; }
        .con-close-btn { padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
        .con-close-btn:hover { background: #f1f5f9; }
        .export-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background:#16A34A;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.13s;
          font-family: inherit;
          box-shadow: 0 2px 6px rgba(5,150,105,0.2);
        }
        .export-btn:hover {
          background: #15803D;
        }
        .export-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
        {/* Header with Export Button */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
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
                <MessageSquare size={17} color="#fff" />
              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Contact Messages
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
                {contacts.length}
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
              Manage and respond to contact form submissions
            </p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={contacts.length === 0}
            className="export-btn"
          >
            <Download size={16} />
            Export to Excel
          </button>
        </div>

        {/* Toolbar (search and items per page) */}
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
                className="con-search"
                type="text"
                placeholder="Search by name, email, subject, message or ID…"
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
                className="con-select"
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
          </div>
        </div>

        {/* Gap */}
        <div style={{ height: 20 }} />

        {/* Table / Empty */}
        {filteredContacts.length === 0 ? (
          <div
            className="con-animate"
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
              <User size={27} color="#cbd5e1" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 6px",
              }}
            >
              No contacts found
            </h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm
                ? "Try a different search term."
                : "No contact messages yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
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
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div
            className="con-animate"
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 700,
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
                        className="con-th-btn"
                        onClick={() => handleSort("id")}
                      >
                        # <SortIcon col="id" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="con-th-btn"
                        onClick={() => handleSort("full_name")}
                      >
                        Contact <SortIcon col="full_name" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="con-th-btn"
                        onClick={() => handleSort("email")}
                      >
                        Email <SortIcon col="email" />
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Phone
                      </span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Subject
                      </span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#94a3b8",
                        }}
                      >
                        Message Preview
                      </span>
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
                  {paginatedContacts.map((contact, index) => {
                    const color = getColor(contact.id);
                    return (
                      <tr
                        key={contact.id}
                        className="con-row"
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                        onClick={() => {
                          setSelectedContact(contact);
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

                        {/* Contact name + avatar */}
                        <td style={{ padding: "15px 18px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 11,
                            }}
                          >
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                background: color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(contact.full_name)}
                            </div>
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#1e293b",
                              }}
                            >
                              {contact.full_name || "No Name"}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: "15px 18px" }}>
                          <a
                            href={`mailto:${contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 14,
                              color: "#7c3aed",
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.textDecoration =
                                "underline")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.textDecoration = "none")
                            }
                          >
                            <Mail size={13} />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 160,
                              }}
                            >
                              {contact.email || "—"}
                            </span>
                          </a>
                        </td>

                        {/* Phone */}
                        <td style={{ padding: "15px 18px" }}>
                          {contact.mobile_no ? (
                            <a
                              href={`tel:${contact.mobile_no}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontSize: 14,
                                color: "#475569",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              <Phone size={13} color="#94a3b8" />
                              {contact.mobile_no}
                            </a>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>
                              —
                            </span>
                          )}
                        </td>

                        {/* Subject */}
                        <td style={{ padding: "15px 18px" }}>
                          {contact.subject ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                background: "#f5f3ff",
                                color: "#6d28d9",
                                border: "1px solid #ddd6fe",
                                fontSize: 12.5,
                                fontWeight: 600,
                                borderRadius: 99,
                                maxWidth: 140,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tag size={10} style={{ flexShrink: 0 }} />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {contact.subject}
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>
                              —
                            </span>
                          )}
                        </td>

                        {/* Message preview */}
                        <td style={{ padding: "15px 18px" }}>
                          <span
                            style={{
                              fontSize: 14,
                              color: "#94a3b8",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 200,
                              display: "block",
                            }}
                          >
                            {contact.message ? (
                              contact.message
                            ) : (
                              <span style={{ fontStyle: "italic" }}>
                                No message
                              </span>
                            )}
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
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              className="con-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContact(contact);
                                setShowViewModal(true);
                              }}
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

            {/* Pagination */}
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
                    filteredContacts.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "#475569" }}>
                  {filteredContacts.length}
                </strong>{" "}
                contacts
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button
                  className="con-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`con-page-btn${safePage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="con-page-btn"
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

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
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
            className="con-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxWidth: 520,
              width: "100%",
              zIndex: 10,
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
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
                zIndex: 10,
              }}
            >
              <X size={15} />
            </button>

            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              {/* Avatar + Name */}
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
                    borderRadius: 14,
                    background: getColor(selectedContact.id),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(selectedContact.full_name)}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {selectedContact.full_name || "No Name"}
                  </h2>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#94a3b8",
                      margin: "3px 0 0",
                    }}
                  >
                    Contact #{selectedContact.id}
                  </p>
                </div>
              </div>

              {/* Email + Phone */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      margin: "0 0 5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Mail size={11} color="#7c3aed" /> Email
                  </p>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#7c3aed",
                      textDecoration: "none",
                      wordBreak: "break-all",
                    }}
                  >
                    {selectedContact.email || "—"}
                  </a>
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#94a3b8",
                      margin: "0 0 5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Phone size={11} color="#059669" /> Phone
                  </p>
                  {selectedContact.mobile_no ? (
                    <a
                      href={`tel:${selectedContact.mobile_no}`}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1e293b",
                        textDecoration: "none",
                      }}
                    >
                      {selectedContact.mobile_no}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontSize: 14,
                        color: "#94a3b8",
                        fontStyle: "italic",
                      }}
                    >
                      No phone provided
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              {selectedContact.subject && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: 14,
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
                      margin: "0 0 5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Tag size={11} color="#7c3aed" /> Subject
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {selectedContact.subject}
                  </p>
                </div>
              )}

              {/* Message */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  borderRadius: 12,
                  padding: 14,
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
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <MessageSquare size={11} color="#7c3aed" /> Message
                </p>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "#475569",
                    lineHeight: 1.65,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedContact.message || "No message provided."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px",
                background: "#f8fafc",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                className="con-copy-btn"
                onClick={() =>
                  handleCopy(
                    selectedContact.email,
                    `modal-${selectedContact.id}`,
                  )
                }
              >
                <Copy size={13} />
                {copied === `modal-${selectedContact.id}`
                  ? "Copied!"
                  : "Copy Email"}
              </button>
              <button
                className="con-close-btn"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your inquiry"}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

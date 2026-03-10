// import React, { useState, useEffect } from 'react';
// import {
//   Search, RefreshCw, ArrowUpRight, Mail, Phone,
//   MapPin, BookOpen, X, ChevronDown, User
// } from 'lucide-react';

// const ITEMS_PER_PAGE = 10;

// const EnrollmentList = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const API_URL = 'https://codingcloud.pythonanywhere.com/enroll/';

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) throw new Error(`HTTP ${response.status} · ${response.statusText}`);
//       const data = await response.json();
//       setEnrollments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch enrollments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const filtered = enrollments.filter(e =>
//     `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     e.mobile?.includes(searchTerm) ||
//     e.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     e.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   useEffect(() => { setCurrentPage(1); setSelectedRows([]); }, [searchTerm]);

//   const allOnPageSelected = paginated.length > 0 && paginated.every(e => selectedRows.includes(e.id));
//   const toggleSelectAll = () => {
//     if (allOnPageSelected) setSelectedRows(prev => prev.filter(id => !paginated.map(e => e.id).includes(id)));
//     else setSelectedRows(prev => [...prev, ...paginated.map(e => e.id).filter(id => !prev.includes(id))]);
//   };
//   const toggleRow = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

//   const avatarColors = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
//   const getColor = (id) => avatarColors[id % avatarColors.length];
//   const getInitials = (first, last) => `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase() || '??';

//   // Unique cities and courses for stat cards
//   const uniqueCities = [...new Set(enrollments.map(e => e.city).filter(Boolean))].length;
//   const uniqueCourses = [...new Set(enrollments.map(e => e.course_name).filter(Boolean))].length;

//   const statCards = [
//     { label: 'Total Enrollments', value: enrollments.length, pct: 72 },
//     { label: 'Filtered Results', value: filtered.length, pct: 55 },
//     { label: 'Unique Cities', value: uniqueCities, pct: 42 },
//     { label: 'Unique Courses', value: uniqueCourses, pct: 65 },
//   ];

//   const CircularProgress = ({ pct }) => {
//     const r = 20, circ = 2 * Math.PI * r;
//     const offset = circ - (pct / 100) * circ;
//     return (
//       <svg width="52" height="52" viewBox="0 0 48 48">
//         <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
//         <circle cx="24" cy="24" r={r} fill="none" stroke="#2563eb" strokeWidth="4"
//           strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 24 24)" />
//         <foreignObject x="8" y="8" width="32" height="32">
//           <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <ArrowUpRight size={14} color="#2563eb" />
//           </div>
//         </foreignObject>
//       </svg>
//     );
//   };

//   if (loading) return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
//         <p style={{ color: '#6b7280', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Loading enrollments...</p>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'DM Sans', sans-serif" }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ background: '#fee2e2', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
//           <X size={28} color="#dc2626" />
//         </div>
//         <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Something went wrong</h3>
//         <p style={{ color: '#6b7280', marginBottom: 16 }}>{error}</p>
//         <button onClick={fetchData}
//           style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
//           Try Again
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f4f5f7', minHeight: '100vh', padding: '24px 20px' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         .enroll-row:hover { background: #f9fafb; }
//         .page-btn-e { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; font-family: inherit; transition: background 0.15s; }
//         .page-btn-e:hover:not(:disabled) { background: #f3f4f6; }
//         .page-btn-e:disabled { opacity: 0.4; cursor: not-allowed; }
//         @media (max-width: 640px) {
//           .stat-grid-e { grid-template-columns: 1fr 1fr !important; }
//           .table-wrap-e { overflow-x: auto; }
//           .hide-mob-e { display: none !important; }
//           .toolbar-e { flex-wrap: wrap; }
//         }
//         @media (max-width: 400px) { .stat-grid-e { grid-template-columns: 1fr !important; } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       {/* ── Stat Cards ── */}
//       <div className="stat-grid-e" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
//         {statCards.map((s, i) => (
//           <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
//             <CircularProgress pct={s.pct} />
//             <div>
//               <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontWeight: 500 }}>{s.label}</p>
//               <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '2px 0 0' }}>{s.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Table Card ── */}
//       <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

//         {/* Toolbar */}
//         <div className="toolbar-e" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
//           <button onClick={fetchData}
//             style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
//             <RefreshCw size={14} />
//             <span className="hide-mob-e">Refresh</span>
//           </button>

//           {selectedRows.length > 0 && (
//             <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{selectedRows.length} selected</span>
//           )}

//           <div style={{ flex: 1 }} />

//           {/* Search */}
//           <div style={{ position: 'relative', minWidth: 220 }}>
//             <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
//             <input type="text" placeholder="Search enrollments..." value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{ paddingLeft: 32, paddingRight: searchTerm ? 32 : 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#374151', background: '#f9fafb', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
//             {searchTerm && (
//               <button onClick={() => setSearchTerm('')}
//                 style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-wrap-e">
//           {filtered.length === 0 ? (
//             <div style={{ padding: '60px 20px', textAlign: 'center' }}>
//               <div style={{ background: '#f3f4f6', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
//                 <User size={28} color="#9ca3af" />
//               </div>
//               <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>No enrollments found</h3>
//               <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Try adjusting your search terms</p>
//               <button onClick={() => setSearchTerm('')}
//                 style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
//                 Clear Search
//               </button>
//             </div>
//           ) : (
//             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//               <thead>
//                 <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
//                   {['Learner', 'Email', 'Phone', 'City', 'Course', ''].map((col, i) => (
//                     <th key={i} className={i >= 2 && i <= 3 ? 'hide-mob-e' : ''}
//                       style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
//                       <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                         {col}{col && <ChevronDown size={12} />}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((enrollment) => {
//                   const isSelected = selectedRows.includes(enrollment.id);
//                   const color = getColor(enrollment.id);
//                   return (
//                     <tr key={enrollment.id} className="enroll-row"
//                       style={{ borderBottom: '1px solid #f9fafb', background: isSelected ? '#eff6ff' : 'transparent' }}>

//                       {/* Learner */}
//                       <td style={{ padding: '14px 14px' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                           <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
//                             {getInitials(enrollment.first_name, enrollment.last_name)}
//                           </div>
//                           <div>
//                             <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>
//                               {enrollment.first_name} {enrollment.last_name}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Email */}
//                       <td style={{ padding: '14px 14px' }}>
//                         <a href={`mailto:${enrollment.email}`}
//                           style={{ color: '#2563eb', fontSize: 13, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
//                           <Mail size={13} />
//                           <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
//                             {enrollment.email}
//                           </span>
//                         </a>
//                       </td>

//                       {/* Phone */}
//                       <td className="hide-mob-e" style={{ padding: '14px 14px' }}>
//                         {enrollment.mobile ? (
//                           <a href={`tel:${enrollment.mobile}`}
//                             style={{ color: '#4b5563', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
//                             <Phone size={13} color="#9ca3af" />
//                             {enrollment.mobile}
//                           </a>
//                         ) : <span style={{ color: '#d1d5db' }}>—</span>}
//                       </td>

//                       {/* City */}
//                       <td className="hide-mob-e" style={{ padding: '14px 14px' }}>
//                         {enrollment.city ? (
//                           <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: '#eff6ff', borderRadius: 20, fontSize: 12, color: '#2563eb', fontWeight: 500 }}>
//                             <MapPin size={11} />
//                             {enrollment.city}
//                           </span>
//                         ) : <span style={{ color: '#d1d5db' }}>—</span>}
//                       </td>

//                       {/* Course */}
//                       <td style={{ padding: '14px 14px' }}>
//                         {enrollment.course_name ? (
//                           <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', borderRadius: 20, fontSize: 12, color: '#fff', fontWeight: 600 }}>
//                             <BookOpen size={11} />
//                             {enrollment.course_name}
//                           </span>
//                         ) : (
//                           <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: '#f3f4f6', borderRadius: 20, fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
//                             Course ID: {enrollment.course_id}
//                           </span>
//                         )}
//                       </td>

//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {filtered.length > 0 && (
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f3f4f6' }}>
//             <button className="page-btn-e" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
//             <span style={{ fontSize: 13, color: '#6b7280' }}>
//               Page <strong style={{ color: '#111827' }}>{currentPage}</strong> of {totalPages}&nbsp;·&nbsp;{filtered.length} enrollments
//             </span>
//             <button className="page-btn-e" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
//         Total Enrollments: {enrollments.length} · Last updated: {new Date().toLocaleTimeString()}
//       </p>
//     </div>
//   );
// };

// export default EnrollmentList;

import React, { useState, useEffect, useRef } from "react";
import {
  Search, Mail, Phone, MapPin, BookOpen,
  X, User, SortAsc, SortDesc,
  Eye, Calendar, ChevronLeft, ChevronRight,
} from "lucide-react";

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "display_id", direction: "desc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const prevSearch = useRef(searchTerm);
  const prevSort = useRef(sortConfig);
  const prevIpp = useRef(itemsPerPage);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://codingcloud.pythonanywhere.com/enroll/");
      if (!response.ok) throw new Error(`HTTP ${response.status} · ${response.statusText}`);
      const data = await response.json();
      const withIds = (Array.isArray(data) ? data : []).map((item, index) => ({
        ...item,
        display_id: index + 1,
      }));
      setEnrollments(withIds);
    } catch (err) {
      setError(err.message || "Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Derived data – no state, no jerk on refresh
  const filteredEnrollments = (() => {
    let result = [...enrollments];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.mobile?.includes(searchTerm) ||
        e.city?.toLowerCase().includes(q) ||
        e.course_name?.toLowerCase().includes(q) ||
        e.display_id?.toString().includes(searchTerm)
      );
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id")       { aVal = a.display_id || 0; bVal = b.display_id || 0; }
      else if (sortConfig.key === "full_name")   { aVal = `${a.first_name} ${a.last_name}`.toLowerCase(); bVal = `${b.first_name} ${b.last_name}`.toLowerCase(); }
      else if (sortConfig.key === "email")       { aVal = a.email?.toLowerCase() || ""; bVal = b.email?.toLowerCase() || ""; }
      else if (sortConfig.key === "course_name") { aVal = a.course_name?.toLowerCase() || ""; bVal = b.course_name?.toLowerCase() || ""; }
      else { aVal = 0; bVal = 0; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  })();

  const totalPages = Math.max(1, Math.ceil(filteredEnrollments.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

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
    if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
      : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  const avatarColors = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
  const getInitials = (first, last) => {
    if (!first && !last) return "??";
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "??";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading enrollments…</p>
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
          <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px" }}>{error}</p>
          <button onClick={fetchData} style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .enr-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .enr-row { transition: background 0.13s; cursor: pointer; }
        .enr-row:hover { background: #fafafa; }
        .enr-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .enr-action-btn:hover { background: #ede9fe; color: #7c3aed; }
        .enr-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .enr-th-btn:hover { color: #475569; }
        .enr-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .enr-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .enr-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .enr-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .enr-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .enr-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .enr-search::placeholder { color: #cbd5e1; }
        .enr-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .enr-select:focus { border-color: #7c3aed; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
              <BookOpen size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Course Enrollments</h1>
            <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{enrollments.length}</span>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage and track student enrollments</p>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
              <input
                className="enr-search"
                type="text"
                placeholder="Search by name, email, phone, city, course or ID…"
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
              <select className="enr-select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
            </div>
          </div>
        </div>

        {/* ── Gap ── */}
        <div style={{ height: 20 }} />

        {/* ── Table / Empty ── */}
        {filteredEnrollments.length === 0 ? (
          <div className="enr-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <User size={27} color="#cbd5e1" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No enrollments found</h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm ? "Try a different search term." : "No enrollment records yet."}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="enr-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
                    <th style={{ padding: "14px 18px", textAlign: "left", width: 56 }}>
                      <button className="enr-th-btn" onClick={() => handleSort("display_id")}># <SortIcon col="display_id" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="enr-th-btn" onClick={() => handleSort("full_name")}>Learner <SortIcon col="full_name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="enr-th-btn" onClick={() => handleSort("email")}>Email <SortIcon col="email" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Phone</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>City</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="enr-th-btn" onClick={() => handleSort("course_name")}>Course <SortIcon col="course_name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEnrollments.map((enrollment, index) => {
                    const color = getColor(enrollment.id);
                    const fullName = `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() || "No Name";
                    return (
                      <tr
                        key={enrollment.id}
                        className="enr-row"
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                        onClick={() => { setSelectedEnrollment(enrollment); setShowViewModal(true); }}
                      >
                        {/* # */}
                        <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Learner */}
                        <td style={{ padding: "15px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                              {getInitials(enrollment.first_name, enrollment.last_name)}
                            </div>
                            <div>
                              <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", display: "block" }}>{fullName}</span>
                              <span style={{ fontSize: 12, color: "#94a3b8", display: "block", marginTop: 1 }}>
                                {enrollment.course_name || `Course #${enrollment.course_id}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: "15px 18px" }}>
                          <a
                            href={`mailto:${enrollment.email}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}
                            onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                          >
                            <Mail size={13} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{enrollment.email || "—"}</span>
                          </a>
                        </td>

                        {/* Phone */}
                        <td style={{ padding: "15px 18px" }}>
                          {enrollment.mobile ? (
                            <a
                              href={`tel:${enrollment.mobile}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, color: "#475569", textDecoration: "none", fontWeight: 500 }}
                            >
                              <Phone size={13} color="#94a3b8" />
                              {enrollment.mobile}
                            </a>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>—</span>
                          )}
                        </td>

                        {/* City */}
                        <td style={{ padding: "15px 18px" }}>
                          {enrollment.city ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", fontSize: 12.5, fontWeight: 600, borderRadius: 99 }}>
                              <MapPin size={10} style={{ flexShrink: 0 }} />
                              {enrollment.city}
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>—</span>
                          )}
                        </td>

                        {/* Course */}
                        <td style={{ padding: "15px 18px" }}>
                          {enrollment.course_name ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", background: "#7c3aed", color: "#fff", fontSize: 12.5, fontWeight: 600, borderRadius: 99, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(124,58,237,0.25)" }}>
                              <BookOpen size={10} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{enrollment.course_name}</span>
                            </span>
                          ) : (
                            <span style={{ fontSize: 14, color: "#94a3b8" }}>Course #{enrollment.course_id}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                              className="enr-action-btn"
                              onClick={(e) => { e.stopPropagation(); setSelectedEnrollment(enrollment); setShowViewModal(true); }}
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

            {/* ── Pagination ── */}
            <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
                Showing{" "}
                <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredEnrollments.length)}</strong>
                {" "}of{" "}
                <strong style={{ color: "#475569" }}>{filteredEnrollments.length}</strong> enrollments
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button className="enr-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}><ChevronLeft size={15} /></button>
                {getPageNumbers().map((page) => (
                  <button key={page} className={`enr-page-btn${safePage === page ? " active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className="enr-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Modal ── */}
      {showViewModal && selectedEnrollment && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setShowViewModal(false)} />
          <div className="enr-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 520, width: "100%", zIndex: 10, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

            <button onClick={() => setShowViewModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex", zIndex: 10 }}>
              <X size={15} />
            </button>

            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              {/* Avatar + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: getColor(selectedEnrollment.id), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                  {getInitials(selectedEnrollment.first_name, selectedEnrollment.last_name)}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    {selectedEnrollment.first_name} {selectedEnrollment.last_name}
                  </h2>
                  <p style={{ fontSize: 13.5, color: "#94a3b8", margin: "3px 0 0" }}>Enrollment #{selectedEnrollment.display_id}</p>
                </div>
              </div>

              {/* Email + Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Mail size={11} color="#7c3aed" /> Email
                  </p>
                  <a href={`mailto:${selectedEnrollment.email}`} style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", textDecoration: "none", wordBreak: "break-all" }}>
                    {selectedEnrollment.email || "—"}
                  </a>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Phone size={11} color="#059669" /> Phone
                  </p>
                  {selectedEnrollment.mobile ? (
                    <a href={`tel:${selectedEnrollment.mobile}`} style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", textDecoration: "none" }}>
                      {selectedEnrollment.mobile}
                    </a>
                  ) : (
                    <span style={{ fontSize: 14, color: "#94a3b8", fontStyle: "italic" }}>No phone provided</span>
                  )}
                </div>
              </div>

              {/* City + Course */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {selectedEnrollment.city && (
                  <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={11} color="#8b5cf6" /> City
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>{selectedEnrollment.city}</p>
                  </div>
                )}
                <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                    <BookOpen size={11} color="#f59e0b" /> Course
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>
                    {selectedEnrollment.course_name || `Course #${selectedEnrollment.course_id}`}
                  </p>
                </div>
              </div>

              {/* Enrolled On */}
              {selectedEnrollment.created_at && (
                <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={11} color="#7c3aed" /> Enrolled On
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>
                    {new Date(selectedEnrollment.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
              <button onClick={() => setShowViewModal(false)} style={{ padding: "9px 18px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Close
              </button>
              <a
                href={`mailto:${selectedEnrollment.email}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}
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

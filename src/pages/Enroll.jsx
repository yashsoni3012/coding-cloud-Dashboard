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

import React, { useState, useEffect } from "react";
import {
  Search, RefreshCw, Mail, Phone, MapPin, BookOpen,
  X, ChevronDown, User, Filter, SortAsc, SortDesc,
  Eye, Calendar,
} from "lucide-react";

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "display_id", direction: "desc" });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ hasPhone: "all", hasCity: "all" });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://codingcloud.pythonanywhere.com/enroll/");
      if (!response.ok) throw new Error(`HTTP ${response.status} · ${response.statusText}`);
      const data = await response.json();
      const dataWithDisplayIds = (Array.isArray(data) ? data : []).map((item, index) => ({
        ...item,
        display_id: index + 1,
      }));
      setEnrollments(dataWithDisplayIds);
      setFilteredEnrollments(dataWithDisplayIds);
    } catch (err) {
      setError(err.message || "Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = [...enrollments];

    if (searchTerm) {
      result = result.filter((e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.mobile?.includes(searchTerm) ||
        e.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.display_id?.toString().includes(searchTerm)
      );
    }

    if (filters.hasPhone !== "all") {
      result = result.filter((e) => filters.hasPhone === "yes" ? e.mobile : !e.mobile);
    }
    if (filters.hasCity !== "all") {
      result = result.filter((e) => filters.hasCity === "yes" ? e.city : !e.city);
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") { aVal = a.display_id || 0; bVal = b.display_id || 0; }
      else if (sortConfig.key === "full_name") { aVal = `${a.first_name} ${a.last_name}`.toLowerCase(); bVal = `${b.first_name} ${b.last_name}`.toLowerCase(); }
      else if (sortConfig.key === "email") { aVal = a.email?.toLowerCase() || ""; bVal = b.email?.toLowerCase() || ""; }
      else if (sortConfig.key === "course_name") { aVal = a.course_name?.toLowerCase() || ""; bVal = b.course_name?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEnrollments(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, enrollments]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({ key, direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc" }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} className="text-violet-500" />
      : <SortDesc size={13} className="text-violet-500" />;
  };

 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  const avatarColors = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const getColor = (id) => avatarColors[id % avatarColors.length];
  const getInitials = (first, last) => {
    if (!first && !last) return "??";
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "??";
  };

  const activeFiltersCount = [
    filters.hasPhone !== "all",
    filters.hasCity !== "all",
    sortConfig.key !== "display_id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-medium">Loading enrollments…</p>
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
          <button onClick={fetchData} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Course Enrollments</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {enrollments.length}
            </span>
          </div>
          <p className="text-slate-500 text-sm">Manage and track student enrollments</p>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, phone, city, course or ID…"
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

           
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <select
                  value={filters.hasPhone}
                  onChange={(e) => setFilters({ ...filters, hasPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Enrollments</option>
                  <option value="yes">With Phone</option>
                  <option value="no">Without Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">City</label>
                <select
                  value={filters.hasCity}
                  onChange={(e) => setFilters({ ...filters, hasCity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Enrollments</option>
                  <option value="yes">With City</option>
                  <option value="no">Without City</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
        {filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No enrollments found</h3>
            <p className="text-slate-400 text-sm mb-5">
              {searchTerm || filters.hasPhone !== "all" || filters.hasCity !== "all"
                ? "Try adjusting your filters or search term."
                : "No enrollment records yet."}
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium"
            >
              <RefreshCw size={15} /> Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
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
                      onClick={() => handleSort("full_name")}
                    >
                      <span className="flex items-center gap-1">Learner {getSortIcon("full_name")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("email")}
                    >
                      <span className="flex items-center gap-1">Email {getSortIcon("email")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                      City
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden lg:table-cell"
                      onClick={() => handleSort("course_name")}
                    >
                      <span className="flex items-center gap-1">Course {getSortIcon("course_name")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedEnrollments.map((enrollment, index) => {
                    const color = getColor(enrollment.id);
                    const fullName = `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() || "No Name";

                    return (
                      <tr
                        key={enrollment.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => { setSelectedEnrollment(enrollment); setShowViewModal(true); }}
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Learner */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              {getInitials(enrollment.first_name, enrollment.last_name)}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-slate-800 block">{fullName}</span>
                              {/* Show course on small screens */}
                              <span className="text-xs text-slate-400 lg:hidden line-clamp-1">
                                {enrollment.course_name || `Course #${enrollment.course_id}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4">
                          <a
                            href={`mailto:${enrollment.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 hover:underline"
                          >
                            <Mail size={13} />
                            <span className="line-clamp-1 max-w-[160px]">{enrollment.email || "—"}</span>
                          </a>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          {enrollment.mobile ? (
                            <a
                              href={`tel:${enrollment.mobile}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
                            >
                              <Phone size={13} className="text-slate-400" />
                              {enrollment.mobile}
                            </a>
                          ) : (
                            <span className="text-slate-300 text-sm">—</span>
                          )}
                        </td>

                        {/* City */}
                        <td className="px-5 py-4 hidden lg:table-cell">
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
                        <td className="px-5 py-4 hidden lg:table-cell">
                          {enrollment.course_name ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full max-w-[160px] truncate shadow-sm">
                              <BookOpen size={10} className="flex-shrink-0" />
                              <span className="truncate">{enrollment.course_name}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-sm">Course #{enrollment.course_id}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedEnrollment(enrollment); setShowViewModal(true); }}
                              className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
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
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredEnrollments.length)}</span> of <span className="text-slate-700 font-semibold">{filteredEnrollments.length}</span> enrollments
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

      {/* ── View Enrollment Modal ── */}
      {showViewModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden max-h-[90vh] flex flex-col">

            {/* Close */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: getColor(selectedEnrollment.id) }}
                >
                  {getInitials(selectedEnrollment.first_name, selectedEnrollment.last_name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedEnrollment.first_name} {selectedEnrollment.last_name}
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">Enrollment #{selectedEnrollment.display_id}</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Mail size={11} className="text-violet-500" /> Email
                  </p>
                  <a href={`mailto:${selectedEnrollment.email}`} className="text-sm font-medium text-violet-600 hover:underline break-all">
                    {selectedEnrollment.email || "—"}
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Phone size={11} className="text-emerald-500" /> Phone
                  </p>
                  {selectedEnrollment.mobile ? (
                    <a href={`tel:${selectedEnrollment.mobile}`} className="text-sm font-medium text-slate-800 hover:text-slate-900">
                      {selectedEnrollment.mobile}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">No phone provided</span>
                  )}
                </div>
              </div>

              {/* Location + Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {selectedEnrollment.city && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <MapPin size={11} className="text-purple-500" /> City
                    </p>
                    <p className="text-sm font-semibold text-slate-800">{selectedEnrollment.city}</p>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <BookOpen size={11} className="text-amber-500" /> Course
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedEnrollment.course_name || `Course #${selectedEnrollment.course_id}`}
                  </p>
                </div>
              </div>

              {/* Enrolled On */}
              {selectedEnrollment.created_at && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar size={11} className="text-violet-500" /> Enrolled On
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(selectedEnrollment.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedEnrollment.email}`}
                className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
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
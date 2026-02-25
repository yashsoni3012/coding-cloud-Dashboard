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

import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Calendar
} from 'lucide-react';

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hasPhone: 'all',
    hasCity: 'all',
  });

  // View Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const API_URL = 'https://codingcloud.pythonanywhere.com/enroll/';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status} · ${response.statusText}`);
      const data = await response.json();
      
      // Add sequential IDs for display (1,2,3,4...)
      const dataWithDisplayIds = (Array.isArray(data) ? data : []).map((item, index) => ({
        ...item,
        display_id: index + 1 // This will give 1,2,3,4... in the UI
      }));
      
      setEnrollments(dataWithDisplayIds);
      setFilteredEnrollments(dataWithDisplayIds);
    } catch (err) {
      setError(err.message || 'Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter and sort enrollments
  useEffect(() => {
    let result = [...enrollments];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(e =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.mobile?.includes(searchTerm) ||
        e.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.display_id?.toString().includes(searchTerm)
      );
    }

    // Apply phone filter
    if (filters.hasPhone !== 'all') {
      result = result.filter(e =>
        filters.hasPhone === 'yes' ? e.mobile : !e.mobile
      );
    }

    // Apply city filter
    if (filters.hasCity !== 'all') {
      result = result.filter(e =>
        filters.hasCity === 'yes' ? e.city : !e.city
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'display_id') {
        aValue = a.display_id || 0;
        bValue = b.display_id || 0;
      } else if (sortConfig.key === 'full_name') {
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else if (sortConfig.key === 'email') {
        aValue = a.email?.toLowerCase() || '';
        bValue = b.email?.toLowerCase() || '';
      } else if (sortConfig.key === 'course_name') {
        aValue = a.course_name?.toLowerCase() || '';
        bValue = b.course_name?.toLowerCase() || '';
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredEnrollments(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, enrollments]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={14} className="text-gray-400" />;
    return sortConfig.direction === 'asc'
      ? <SortAsc size={14} className="text-indigo-600" />
      : <SortDesc size={14} className="text-indigo-600" />;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      hasPhone: 'all',
      hasCity: 'all',
    });
    setSortConfig({ key: 'display_id', direction: 'desc' });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  // Avatar utilities
  const avatarColors = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
  const getColor = (id) => avatarColors[id % avatarColors.length];
  const getInitials = (first, last) => {
    if (!first && !last) return '??';
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase() || '??';
  };

  // View enrollment details
  const handleView = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading enrollments...</p>
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
            onClick={fetchData}
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Enrollments</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track student enrollments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
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
                placeholder="Search by name, email, phone, city, course, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <select
                  value={filters.hasPhone}
                  onChange={(e) => setFilters({ ...filters, hasPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Enrollments</option>
                  <option value="yes">With Phone</option>
                  <option value="no">Without Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={filters.hasCity}
                  onChange={(e) => setFilters({ ...filters, hasCity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Enrollments</option>
                  <option value="yes">With City</option>
                  <option value="no">Without City</option>
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

        {/* Enrollments Table */}
        {filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No enrollments found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filters.hasPhone !== 'all' || filters.hasCity !== 'all'
                ? 'Try adjusting your filters'
                : 'No enrollment records yet'}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Clear Filters
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
                        onClick={() => handleSort('display_id')}
                      >
                        <div className="flex items-center gap-1">
                          # {getSortIcon('display_id')}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('full_name')}
                      >
                        <div className="flex items-center gap-1">
                          Learner {getSortIcon('full_name')}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-1">
                          Email {getSortIcon('email')}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('course_name')}
                      >
                        <div className="flex items-center gap-1">
                          Course {getSortIcon('course_name')}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedEnrollments.map((enrollment) => {
                      const color = getColor(enrollment.id);
                      const fullName = `${enrollment.first_name || ''} ${enrollment.last_name || ''}`.trim() || 'No Name';
                      
                      return (
                        <tr
                          key={enrollment.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleView(enrollment)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            #{enrollment.display_id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ backgroundColor: color }}
                              >
                                {getInitials(enrollment.first_name, enrollment.last_name)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {fullName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`mailto:${enrollment.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                            >
                              <Mail size={14} />
                              {enrollment.email || '-'}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            {enrollment.mobile ? (
                              <a
                                href={`tel:${enrollment.mobile}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                              >
                                <Phone size={14} className="text-gray-400" />
                                {enrollment.mobile}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {enrollment.city ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                                <MapPin size={10} />
                                {enrollment.city}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {enrollment.course_name ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full">
                                <BookOpen size={10} />
                                {enrollment.course_name}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Course #{enrollment.course_id}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(enrollment);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEnrollments.length)} of {filteredEnrollments.length} results
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

      {/* View Enrollment Modal */}
      {showViewModal && selectedEnrollment && (
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
                    Enrollment Details
                  </h3>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Header with Avatar */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: getColor(selectedEnrollment.id) }}
                    >
                      {getInitials(selectedEnrollment.first_name, selectedEnrollment.last_name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedEnrollment.first_name} {selectedEnrollment.last_name}
                      </h2>
                      <p className="text-sm text-gray-500">ID: #{selectedEnrollment.display_id}</p>
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Mail size={16} />
                        <span className="text-xs font-medium text-gray-500">Email</span>
                      </div>
                      <a
                        href={`mailto:${selectedEnrollment.email}`}
                        className="text-sm text-gray-900 hover:text-indigo-600 break-all"
                      >
                        {selectedEnrollment.email || '-'}
                      </a>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <Phone size={16} />
                        <span className="text-xs font-medium text-gray-500">Phone</span>
                      </div>
                      {selectedEnrollment.mobile ? (
                        <a
                          href={`tel:${selectedEnrollment.mobile}`}
                          className="text-sm text-gray-900 hover:text-indigo-600"
                        >
                          {selectedEnrollment.mobile}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No phone provided</span>
                      )}
                    </div>
                  </div>

                  {/* Location and Course */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEnrollment.city && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                          <MapPin size={16} />
                          <span className="text-xs font-medium text-gray-500">City</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedEnrollment.city}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-600 mb-1">
                        <BookOpen size={16} />
                        <span className="text-xs font-medium text-gray-500">Course</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedEnrollment.course_name || `Course #${selectedEnrollment.course_id}`}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEnrollment.created_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar size={16} />
                          <span className="text-xs font-medium text-gray-500">Enrolled On</span>
                        </div>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedEnrollment.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <a
                  href={`mailto:${selectedEnrollment.email}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Mail size={16} className="mr-2" />
                  Send Email
                </a>
                <button
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
    </div>
  );
}
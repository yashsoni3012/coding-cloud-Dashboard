import React, { useState, useEffect } from 'react';
import {
  Search, RefreshCw, ArrowUpRight, Mail, Phone,
  MapPin, BookOpen, X, ChevronDown, User
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = 'https://codingcloud.pythonanywhere.com/enroll/';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status} · ${response.statusText}`);
      const data = await response.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = enrollments.filter(e =>
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.mobile?.includes(searchTerm) ||
    e.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); setSelectedRows([]); }, [searchTerm]);

  const allOnPageSelected = paginated.length > 0 && paginated.every(e => selectedRows.includes(e.id));
  const toggleSelectAll = () => {
    if (allOnPageSelected) setSelectedRows(prev => prev.filter(id => !paginated.map(e => e.id).includes(id)));
    else setSelectedRows(prev => [...prev, ...paginated.map(e => e.id).filter(id => !prev.includes(id))]);
  };
  const toggleRow = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const avatarColors = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
  const getColor = (id) => avatarColors[id % avatarColors.length];
  const getInitials = (first, last) => `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase() || '??';

  // Unique cities and courses for stat cards
  const uniqueCities = [...new Set(enrollments.map(e => e.city).filter(Boolean))].length;
  const uniqueCourses = [...new Set(enrollments.map(e => e.course_name).filter(Boolean))].length;

  const statCards = [
    { label: 'Total Enrollments', value: enrollments.length, pct: 72 },
    { label: 'Filtered Results', value: filtered.length, pct: 55 },
    { label: 'Unique Cities', value: uniqueCities, pct: 42 },
    { label: 'Unique Courses', value: uniqueCourses, pct: 65 },
  ];

  const CircularProgress = ({ pct }) => {
    const r = 20, circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
      <svg width="52" height="52" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke="#2563eb" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 24 24)" />
        <foreignObject x="8" y="8" width="32" height="32">
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpRight size={14} color="#2563eb" />
          </div>
        </foreignObject>
      </svg>
    );
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Loading enrollments...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: '#fee2e2', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <X size={28} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Something went wrong</h3>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>{error}</p>
        <button onClick={fetchData}
          style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f4f5f7', minHeight: '100vh', padding: '24px 20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .enroll-row:hover { background: #f9fafb; }
        .cb-e { width: 17px; height: 17px; border: 1.5px solid #d1d5db; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: border-color 0.15s, background 0.15s; }
        .cb-e.checked { background: #2563eb; border-color: #2563eb; }
        .page-btn-e { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .page-btn-e:hover:not(:disabled) { background: #f3f4f6; }
        .page-btn-e:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 640px) {
          .stat-grid-e { grid-template-columns: 1fr 1fr !important; }
          .table-wrap-e { overflow-x: auto; }
          .hide-mob-e { display: none !important; }
          .toolbar-e { flex-wrap: wrap; }
        }
        @media (max-width: 400px) { .stat-grid-e { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Stat Cards ── */}
      <div className="stat-grid-e" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <CircularProgress pct={s.pct} />
            <div>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '2px 0 0' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div className="toolbar-e" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <button onClick={fetchData}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <RefreshCw size={14} />
            <span className="hide-mob-e">Refresh</span>
          </button>

          {selectedRows.length > 0 && (
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{selectedRows.length} selected</span>
          )}

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" placeholder="Search enrollments..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: searchTerm ? 32 : 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#374151', background: '#f9fafb', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap-e">
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ background: '#f3f4f6', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <User size={28} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>No enrollments found</h3>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Try adjusting your search terms</p>
              <button onClick={() => setSearchTerm('')}
                style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
                Clear Search
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ padding: '12px 16px', width: 44 }}>
                    <div className={`cb-e${allOnPageSelected ? ' checked' : ''}`} onClick={toggleSelectAll}>
                      {allOnPageSelected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </th>
                  {['Learner', 'Email', 'Phone', 'City', 'Course', ''].map((col, i) => (
                    <th key={i} className={i >= 2 && i <= 3 ? 'hide-mob-e' : ''}
                      style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {col}{col && <ChevronDown size={12} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((enrollment) => {
                  const isSelected = selectedRows.includes(enrollment.id);
                  const color = getColor(enrollment.id);
                  return (
                    <tr key={enrollment.id} className="enroll-row"
                      style={{ borderBottom: '1px solid #f9fafb', background: isSelected ? '#eff6ff' : 'transparent' }}>

                      {/* Checkbox */}
                      <td style={{ padding: '14px 16px' }}>
                        <div className={`cb-e${isSelected ? ' checked' : ''}`} onClick={() => toggleRow(enrollment.id)}>
                          {isSelected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                      </td>

                      {/* Learner */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                            {getInitials(enrollment.first_name, enrollment.last_name)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>
                              {enrollment.first_name} {enrollment.last_name}
                            </p>
                            <p style={{ color: '#9ca3af', margin: '2px 0 0', fontSize: 11 }}>ID: {enrollment.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '14px 14px' }}>
                        <a href={`mailto:${enrollment.email}`}
                          style={{ color: '#2563eb', fontSize: 13, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Mail size={13} />
                          <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {enrollment.email}
                          </span>
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="hide-mob-e" style={{ padding: '14px 14px' }}>
                        {enrollment.mobile ? (
                          <a href={`tel:${enrollment.mobile}`}
                            style={{ color: '#4b5563', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Phone size={13} color="#9ca3af" />
                            {enrollment.mobile}
                          </a>
                        ) : <span style={{ color: '#d1d5db' }}>—</span>}
                      </td>

                      {/* City */}
                      <td className="hide-mob-e" style={{ padding: '14px 14px' }}>
                        {enrollment.city ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: '#eff6ff', borderRadius: 20, fontSize: 12, color: '#2563eb', fontWeight: 500 }}>
                            <MapPin size={11} />
                            {enrollment.city}
                          </span>
                        ) : <span style={{ color: '#d1d5db' }}>—</span>}
                      </td>

                      {/* Course */}
                      <td style={{ padding: '14px 14px' }}>
                        {enrollment.course_name ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', borderRadius: 20, fontSize: 12, color: '#fff', fontWeight: 600 }}>
                            <BookOpen size={11} />
                            {enrollment.course_name}
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: '#f3f4f6', borderRadius: 20, fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
                            Course ID: {enrollment.course_id}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 14px' }}>
                        <a href={`mailto:${enrollment.email}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#f3f4f6', color: '#374151', borderRadius: 8, fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s', whiteSpace: 'nowrap' }}>
                          <Mail size={12} />
                          <span className="hide-mob-e">Reply</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f3f4f6' }}>
            <button className="page-btn-e" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              Page <strong style={{ color: '#111827' }}>{currentPage}</strong> of {totalPages}&nbsp;·&nbsp;{filtered.length} enrollments
            </span>
            <button className="page-btn-e" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
        Total Enrollments: {enrollments.length} · Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default EnrollmentList;
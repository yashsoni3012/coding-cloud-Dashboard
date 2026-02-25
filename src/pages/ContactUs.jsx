import React, { useState, useEffect } from 'react';
import {
  Search, RefreshCw, ArrowUpRight, Mail, Phone, Tag,
  X, ChevronDown, ChevronUp, Copy, MessageSquare, User
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://codingcloud.pythonanywhere.com/contacts/');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setContacts(data.data);
        setError(null);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processedContacts = contacts
    .filter(c =>
      c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile_no?.includes(searchTerm)
    )
    .sort((a, b) => {
      let aVal = a[sortBy], bVal = b[sortBy];
      if (sortBy === 'id') { aVal = parseInt(aVal); bVal = parseInt(bVal); }
      if (sortBy === 'full_name' || sortBy === 'email' || sortBy === 'subject') {
        aVal = aVal?.toLowerCase() || '';
        bVal = bVal?.toLowerCase() || '';
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const totalPages = Math.ceil(processedContacts.length / ITEMS_PER_PAGE);
  const paginated = processedContacts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); setSelectedRows([]); }, [searchTerm, sortBy, sortOrder]);

  const allOnPageSelected = paginated.length > 0 && paginated.every(c => selectedRows.includes(c.id));
  const toggleSelectAll = () => {
    if (allOnPageSelected) setSelectedRows(prev => prev.filter(id => !paginated.map(c => c.id).includes(id)));
    else setSelectedRows(prev => [...prev, ...paginated.map(c => c.id).filter(id => !prev.includes(id))]);
  };
  const toggleRow = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const getInitials = (name) => name?.slice(0, 2).toUpperCase() || '??';
  const avatarColors = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
  const getColor = (id) => avatarColors[id % avatarColors.length];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const statCards = [
    { label: 'Total Contacts', value: contacts.length, pct: 72 },
    { label: 'Filtered Results', value: processedContacts.length, pct: 55 },
    { label: 'With Phone', value: contacts.filter(c => c.mobile_no).length, pct: 63 },
    { label: 'Current Page', value: `${currentPage}/${totalPages || 1}`, pct: 45 },
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
        <p style={{ color: '#6b7280', fontSize: 14 }}>Loading contacts...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: '#fee2e2', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <X size={28} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Something went wrong</h3>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>{error}</p>
        <button onClick={fetchContacts}
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
        .contact-row:hover { background: #f9fafb; }
        .action-btn-c { background: none; border: none; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9ca3af; transition: background 0.15s, color 0.15s; }
        .action-btn-c:hover { background: #f3f4f6; color: #374151; }
        .cb-c { width: 17px; height: 17px; border: 1.5px solid #d1d5db; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: border-color 0.15s, background 0.15s; }
        .cb-c.checked { background: #2563eb; border-color: #2563eb; }
        .page-btn-c { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .page-btn-c:hover:not(:disabled) { background: #f3f4f6; }
        .page-btn-c:disabled { opacity: 0.4; cursor: not-allowed; }
        .expanded-row { animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .stat-grid-c { grid-template-columns: 1fr 1fr !important; }
          .table-wrap-c { overflow-x: auto; }
          .hide-mob-c { display: none !important; }
          .toolbar-c { flex-wrap: wrap; }
        }
        @media (max-width: 400px) { .stat-grid-c { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Stat Cards ── */}
      <div className="stat-grid-c" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
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
        <div className="toolbar-c" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#374151', background: '#fff', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="id">Sort: ID</option>
              <option value="full_name">Sort: Name</option>
              <option value="email">Sort: Email</option>
              <option value="subject">Sort: Subject</option>
            </select>
            <button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              style={{ width: 36, height: 36, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}>
              {sortOrder === 'asc' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          <button onClick={fetchContacts}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <RefreshCw size={14} />
            <span className="hide-mob-c">Refresh</span>
          </button>

          {selectedRows.length > 0 && (
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{selectedRows.length} selected</span>
          )}

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: searchTerm ? 32 : 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#374151', background: '#f9fafb', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap-c">
          {processedContacts.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ background: '#f3f4f6', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <User size={28} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>No contacts found</h3>
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
                    <div className={`cb-c${allOnPageSelected ? ' checked' : ''}`} onClick={toggleSelectAll}>
                      {allOnPageSelected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </th>
                  {['Contact', 'Email', 'Phone', 'Subject', ''].map((col, i) => (
                    <th key={i} className={i >= 2 && i <= 3 ? 'hide-mob-c' : ''}
                      style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {col}{col && <ChevronDown size={12} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((contact) => {
                  const isSelected = selectedRows.includes(contact.id);
                  const isExpanded = selectedContact === contact.id;
                  const color = getColor(contact.id);
                  return (
                    <React.Fragment key={contact.id}>
                      <tr className="contact-row"
                        style={{ borderBottom: isExpanded ? 'none' : '1px solid #f9fafb', cursor: 'pointer', background: isSelected ? '#eff6ff' : isExpanded ? '#fafafa' : 'transparent' }}
                        onClick={() => setSelectedContact(isExpanded ? null : contact.id)}>

                        {/* Checkbox */}
                        <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                          <div className={`cb-c${isSelected ? ' checked' : ''}`} onClick={() => toggleRow(contact.id)}>
                            {isSelected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                        </td>

                        {/* Contact name + avatar */}
                        <td style={{ padding: '14px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                              {getInitials(contact.full_name)}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>{contact.full_name || 'No Name'}</p>
                              <p style={{ color: '#9ca3af', margin: '2px 0 0', fontSize: 11 }}>ID: {contact.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: '14px 14px' }}>
                          <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()}
                            style={{ color: '#2563eb', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                            {contact.email || '—'}
                          </a>
                        </td>

                        {/* Phone */}
                        <td className="hide-mob-c" style={{ padding: '14px 14px' }}>
                          {contact.mobile_no ? (
                            <a href={`tel:${contact.mobile_no}`} onClick={(e) => e.stopPropagation()}
                              style={{ color: '#4b5563', fontSize: 13, textDecoration: 'none' }}>
                              {contact.mobile_no}
                            </a>
                          ) : <span style={{ color: '#d1d5db' }}>—</span>}
                        </td>

                        {/* Subject */}
                        <td className="hide-mob-c" style={{ padding: '14px 14px' }}>
                          {contact.subject ? (
                            <span style={{ padding: '3px 10px', background: '#f3f4f6', borderRadius: 20, fontSize: 12, color: '#4b5563', fontWeight: 500 }}>
                              {contact.subject}
                            </span>
                          ) : <span style={{ color: '#d1d5db', fontSize: 12 }}>—</span>}
                        </td>

                        {/* Expand icon */}
                        <td style={{ padding: '14px 14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                            <a href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your inquiry'}`}
                              onClick={(e) => e.stopPropagation()}
                              className="action-btn-c" title="Reply" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 6, transition: 'background 0.15s' }}>
                              <Mail size={14} />
                            </a>
                            <button className="action-btn-c" title="Copy Email" onClick={(e) => { e.stopPropagation(); handleCopy(contact.email, contact.id); }}>
                              {copied === contact.id ? <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 700 }}>✓</span> : <Copy size={13} />}
                            </button>
                            <button className="action-btn-c" onClick={() => setSelectedContact(isExpanded ? null : contact.id)}>
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Message Row */}
                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan={6} style={{ padding: '0 20px 16px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                <MessageSquare size={14} color="#6b7280" />
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</p>
                              </div>
                              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>
                                {contact.message || 'No message provided.'}
                              </p>
                              {/* Quick info chips */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#eff6ff', borderRadius: 20, fontSize: 12, color: '#2563eb', fontWeight: 500 }}>
                                  <Mail size={11} /> {contact.email}
                                </span>
                                {contact.mobile_no && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#f0fdf4', borderRadius: 20, fontSize: 12, color: '#16a34a', fontWeight: 500 }}>
                                    <Phone size={11} /> {contact.mobile_no}
                                  </span>
                                )}
                                {contact.subject && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#f3f4f6', borderRadius: 20, fontSize: 12, color: '#4b5563', fontWeight: 500 }}>
                                    <Tag size={11} /> {contact.subject}
                                  </span>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={(e) => { e.stopPropagation(); handleCopy(contact.email, `copy-${contact.id}`); }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                  <Copy size={13} />
                                  {copied === `copy-${contact.id}` ? 'Copied!' : 'Copy Email'}
                                </button>
                                <a href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your inquiry'}`}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                                  <Mail size={13} />
                                  Reply via Email
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {processedContacts.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f3f4f6' }}>
            <button className="page-btn-c" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              Page <strong style={{ color: '#111827' }}>{currentPage}</strong> of {totalPages}&nbsp;·&nbsp;{processedContacts.length} contacts
            </span>
            <button className="page-btn-c" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
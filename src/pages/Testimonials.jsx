import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Edit, Trash2, AlertCircle, CheckCircle,
  X, Star, User, Calendar, ChevronDown, MessageSquare,
  ArrowUpRight, RefreshCw,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function Testimonials() {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://codingcloud.pythonanywhere.com/testimonials/");
      if (response.ok) {
        const data = await response.json();
        const list = data.data || [];
        setTestimonials(list);
        setFilteredTestimonials(list);
      } else {
        setError("Failed to fetch testimonials.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  useEffect(() => {
    let filtered = [...testimonials];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(lower) ||
        t.review.toLowerCase().includes(lower)
      );
    }
    if (selectedRating !== "all") {
      filtered = filtered.filter(t => t.rating === parseInt(selectedRating));
    }
    filtered.sort((a, b) => {
      const dA = new Date(a.created_at), dB = new Date(b.created_at);
      return sortOrder === "newest" ? dB - dA : dA - dB;
    });
    setFilteredTestimonials(filtered);
    setCurrentPage(1);
    setSelectedRows([]);
  }, [searchTerm, selectedRating, sortOrder, testimonials]);

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(dateString));

  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/testimonials/${testimonialToDelete.id}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setDeleteSuccess("Testimonial deleted successfully!");
        fetchTestimonials();
        setTimeout(() => { setShowDeleteModal(false); setTestimonialToDelete(null); setDeleteSuccess(""); }, 1500);
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete testimonial.");
        } catch { setDeleteError(`HTTP Error: ${response.status}`); }
      }
    } catch (err) {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (testimonial) =>
    navigate(`/edit-testimonial/${testimonial.id}`, { state: { testimonial } });

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const paginated = filteredTestimonials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Checkboxes
  const allOnPageSelected = paginated.length > 0 && paginated.every(t => selectedRows.includes(t.id));
  const toggleSelectAll = () => {
    if (allOnPageSelected) setSelectedRows(prev => prev.filter(id => !paginated.map(t => t.id).includes(id)));
    else setSelectedRows(prev => [...prev, ...paginated.map(t => t.id).filter(id => !prev.includes(id))]);
  };
  const toggleRow = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const avatarColors = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const getColor = (id) => avatarColors[id % avatarColors.length];

  // Stats
  const avgRating = testimonials.length
    ? (testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)
    : 0;
  const fiveStarCount = testimonials.filter(t => t.rating === 5).length;

  const statCards = [
    { label: "Total Reviews", value: testimonials.length, pct: 72 },
    { label: "Avg Rating", value: `${avgRating}★`, pct: (parseFloat(avgRating) / 5) * 100 },
    { label: "5-Star Reviews", value: fiveStarCount, pct: testimonials.length ? (fiveStarCount / testimonials.length) * 100 : 0 },
    { label: "Filtered", value: filteredTestimonials.length, pct: 55 },
  ];

  const CircularProgress = ({ pct }) => {
    const r = 20, circ = 2 * Math.PI * r;
    const offset = circ - (Math.min(pct, 100) / 100) * circ;
    return (
      <svg width="52" height="52" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke="#2563eb" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 24 24)" />
        <foreignObject x="8" y="8" width="32" height="32">
          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowUpRight size={14} color="#2563eb" />
          </div>
        </foreignObject>
      </svg>
    );
  };

  const StarRating = ({ rating, size = 13 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size}
          style={{ color: s <= rating ? "#facc15" : "#e5e7eb", fill: s <= rating ? "#facc15" : "#e5e7eb" }} />
      ))}
    </div>
  );

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "3px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Loading testimonials...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ background: "#fee2e2", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <X size={28} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Something went wrong</h3>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>{error}</p>
        <button onClick={() => window.location.reload()}
          style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "24px 20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .test-row:hover { background: #f9fafb; }
        .action-btn-t2 { background: none; border: none; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9ca3af; transition: background 0.15s, color 0.15s; }
        .action-btn-t2:hover { background: #f3f4f6; color: #374151; }
        .action-btn-t2.del:hover { background: #fef2f2; color: #f87171; }
        .cb-t2 { width: 17px; height: 17px; border: 1.5px solid #d1d5db; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: border-color 0.15s, background 0.15s; }
        .cb-t2.checked { background: #2563eb; border-color: #2563eb; }
        .page-btn-t2 { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .page-btn-t2:hover:not(:disabled) { background: #f3f4f6; }
        .page-btn-t2:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 640px) {
          .stat-grid-t2 { grid-template-columns: 1fr 1fr !important; }
          .table-wrap-t2 { overflow-x: auto; }
          .hide-mob-t2 { display: none !important; }
          .toolbar-t2 { flex-wrap: wrap; }
        }
        @media (max-width: 400px) { .stat-grid-t2 { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Stat Cards ── */}
      <div className="stat-grid-t2" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <CircularProgress pct={s.pct} />
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "2px 0 0" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div className="toolbar-t2" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <button onClick={() => navigate("/add-testimonial")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={15} />
            Add Testimonial
          </button>

          <button onClick={fetchTestimonials}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={14} />
            <span className="hide-mob-t2">Refresh</span>
          </button>

          {/* Rating filter */}
          <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>

          {/* Sort */}
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer" }}
            className="hide-mob-t2">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {selectedRows.length > 0 && (
            <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{selectedRows.length} selected</span>
          )}

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: "relative", minWidth: 220 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input type="text" placeholder="Search testimonials..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: searchTerm ? 32 : 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", background: "#f9fafb", outline: "none", width: "100%", fontFamily: "inherit" }} />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap-t2">
          {filteredTestimonials.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ background: "#f3f4f6", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <MessageSquare size={28} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>No testimonials found</h3>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                {searchTerm || selectedRating !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by adding your first testimonial."}
              </p>
              {(searchTerm || selectedRating !== "all") && (
                <button onClick={() => { setSearchTerm(""); setSelectedRating("all"); }}
                  style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <th style={{ padding: "12px 16px", width: 44 }}>
                    <div className={`cb-t2${allOnPageSelected ? " checked" : ""}`} onClick={toggleSelectAll}>
                      {allOnPageSelected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </th>
                  {["Reviewer", "Rating", "Review", "Date", ""].map((col, i) => (
                    <th key={i} className={i >= 2 && i <= 3 ? "hide-mob-t2" : ""}
                      style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {col}{col && <ChevronDown size={12} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((testimonial) => {
                  const isSelected = selectedRows.includes(testimonial.id);
                  const color = getColor(testimonial.id);
                  const hasAvatar = testimonial.image && !testimonial.image.includes("default.jpg");
                  return (
                    <tr key={testimonial.id} className="test-row"
                      style={{ borderBottom: "1px solid #f9fafb", background: isSelected ? "#eff6ff" : "transparent" }}>

                      {/* Checkbox */}
                      <td style={{ padding: "14px 16px" }}>
                        <div className={`cb-t2${isSelected ? " checked" : ""}`} onClick={() => toggleRow(testimonial.id)}>
                          {isSelected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: hasAvatar ? "#f3f4f6" : color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                            {hasAvatar ? (
                              <img src={testimonial.image} alt={testimonial.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }} />
                            ) : (
                              <User size={16} color="#fff" />
                            )}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: 13 }}>{testimonial.name}</p>
                            <p style={{ color: "#9ca3af", margin: "2px 0 0", fontSize: 11 }}>ID: {testimonial.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <StarRating rating={testimonial.rating} />
                          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>({testimonial.rating}/5)</span>
                        </div>
                      </td>

                      {/* Review */}
                      <td className="hide-mob-t2" style={{ padding: "14px 14px", maxWidth: 280 }}>
                        <p style={{ margin: 0, color: "#4b5563", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {testimonial.review}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="hide-mob-t2" style={{ padding: "14px 14px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
                          <Calendar size={12} color="#9ca3af" />
                          {formatDate(testimonial.created_at)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <button className="action-btn-t2" onClick={() => handleEdit(testimonial)} title="Edit">
                            <Edit size={14} />
                          </button>
                          <button className="action-btn-t2 del" onClick={() => handleDeleteClick(testimonial)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filteredTestimonials.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
            <button className="page-btn-t2" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Page <strong style={{ color: "#111827" }}>{currentPage}</strong> of {totalPages}&nbsp;·&nbsp;{filteredTestimonials.length} testimonials
            </span>
            <button className="page-btn-t2" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {showDeleteModal && testimonialToDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => !deleteLoading && setShowDeleteModal(false)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440, padding: 32, boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <AlertCircle size={26} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 8 }}>Delete Testimonial</h3>
            <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
              Are you sure you want to delete the testimonial from{" "}
              <strong style={{ color: "#111827" }}>{testimonialToDelete.name}</strong>? This cannot be undone.
            </p>

            {deleteSuccess && (
              <div style={{ marginBottom: 14, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={15} color="#16a34a" />
                <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>{deleteSuccess}</p>
              </div>
            )}
            {deleteError && (
              <div style={{ marginBottom: 14, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <X size={15} color="#dc2626" />
                <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{deleteError}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}
                style={{ flex: 1, padding: 11, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleteLoading || !!deleteSuccess}
                style={{ flex: 1, padding: 11, border: "none", borderRadius: 10, background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", opacity: (deleteLoading || !!deleteSuccess) ? 0.6 : 1 }}>
                {deleteLoading ? (
                  <>
                    <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Deleting...
                  </>
                ) : <><Trash2 size={15} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
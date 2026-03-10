import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toasts from "../pages/Toasts";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Star,
  User,
  Calendar,
  ChevronDown,
  MessageSquare,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// API base URL – change this if your endpoint moves
const BASE_URL = "https://codingcloud.pythonanywhere.com";

export default function Testimonials() {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ rating: "all" });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/testimonials/`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug – remove in production

      // Extract the array from various possible response structures
      let testimonialsArray = [];
      if (Array.isArray(data)) {
        testimonialsArray = data;
      } else if (data && typeof data === "object") {
        // Common keys where the array might be nested
        const possibleKeys = ["data", "testimonials", "results", "items"];
        for (const key of possibleKeys) {
          if (Array.isArray(data[key])) {
            testimonialsArray = data[key];
            break;
          }
        }
        // If still not found, maybe it's a single object (unlikely)
        if (testimonialsArray.length === 0) {
          if (data.id || data.name) {
            testimonialsArray = [data];
          } else {
            console.warn("No array found in response", data);
          }
        }
      }

      if (testimonialsArray.length === 0) {
        setError("No testimonials found.");
        setTestimonials([]);
        setFilteredTestimonials([]);
        return;
      }

      // Add a local display ID for each item (for table numbering)
      const withDisplayIds = testimonialsArray.map((testimonial, index) => ({
        ...testimonial,
        display_id: index + 1,
      }));

      setTestimonials(withDisplayIds);
      setFilteredTestimonials(withDisplayIds);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let result = [...testimonials];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (testimonial) =>
          (testimonial.name && testimonial.name.toLowerCase().includes(q)) ||
          (testimonial.review &&
            testimonial.review.toLowerCase().includes(q)) ||
          testimonial.display_id.toString().includes(q)
      );
    }

    if (filters.rating !== "all") {
      result = result.filter(
        (testimonial) => testimonial.rating === parseInt(filters.rating)
      );
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") {
        aVal = a.display_id || 0;
        bVal = b.display_id || 0;
      } else if (sortConfig.key === "name") {
        aVal = a.name?.toLowerCase() || "";
        bVal = b.name?.toLowerCase() || "";
      } else if (sortConfig.key === "rating") {
        aVal = a.rating || 0;
        bVal = b.rating || 0;
      } else if (sortConfig.key === "created_at") {
        aVal = a.created_at || "";
        bVal = b.created_at || "";
      } else {
        aVal = a[sortConfig.key] || "";
        bVal = b[sortConfig.key] || "";
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredTestimonials(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, testimonials]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({
      key,
      direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
      : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

  const handleDeleteClick = (e, testimonial) => {
    e.stopPropagation();
    setTestimonialToDelete(testimonial);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const response = await fetch(
        `${BASE_URL}/testimonials/${testimonialToDelete.id}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setShowDeleteModal(false);
        setTestimonialToDelete(null);
        setToast({
          show: true,
          message: "Testimonial deleted successfully!",
          type: "error",
        });
        fetchTestimonials();
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete testimonial.");
        } catch {
          setDeleteError(`HTTP Error: ${response.status}`);
        }
      }
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return { background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" };
    if (rating >= 3) return { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" };
    return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
  };

  const activeFiltersCount = [
    filters.rating !== "all",
    sortConfig.key !== "id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  const StarRating = ({ rating, size = 13 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          style={{
            color: star <= rating ? "#fbbf24" : "#e2e8f0",
            fill: star <= rating ? "#fbbf24" : "none",
          }}
        />
      ))}
    </div>
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const avatarColors = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
  const getInitials = (name) => (name ? name.slice(0, 2).toUpperCase() : "TM");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading testimonials…</p>
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
          <button onClick={fetchTestimonials} style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
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
        .test-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .test-row { transition: background 0.13s; cursor: pointer; }
        .test-row:hover { background: #fafafa; }
        .test-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .test-action-btn:hover { background: #ede9fe; color: #7c3aed; }
        .test-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .test-th-btn:hover { color: #475569; }
        .test-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .test-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .test-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .test-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .test-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .test-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .test-search::placeholder { color: #cbd5e1; }
        .test-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .test-select:focus { border-color: #7c3aed; }
        .test-filter-btn { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.13s; font-family: inherit; white-space: nowrap; }
        .test-filter-btn.active { border-color: #7c3aed; background: #ede9fe; color: #7c3aed; }
        .test-filter-btn:hover { background: #f1f5f9; }
        .test-add-btn { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border: none; border-radius: 10px; background: #7c3aed; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.13s; font-family: inherit; white-space: nowrap; box-shadow: 0 2px 8px rgba(124,58,237,0.25); }
        .test-add-btn:hover { background: #6d28d9; }
        .test-close-btn { padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
        .test-close-btn:hover { background: #f1f5f9; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" }}>
              <MessageSquare size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Testimonials</h1>
            <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>{testimonials.length}</span>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>Manage your customer testimonials and reviews</p>
        </div>

        {/* Toolbar */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
              <input
                className="test-search"
                type="text"
                placeholder="Search by name or review…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              className={`test-filter-btn ${showFilters || activeFiltersCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span style={{ marginLeft: 2, background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 20 }}>
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: showFilters ? "rotate(180deg)" : "none" }} />
            </button>

            {/* Add Testimonial */}
            <button
              className="test-add-btn"
              onClick={() => navigate("/add-testimonial")}
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Rating</label>
                <select
                  className="test-select"
                  value={filters.rating}
                  onChange={(e) => setFilters({ rating: e.target.value })}
                  style={{ width: "100%" }}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>Items per page</label>
                <select
                  className="test-select"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  style={{ width: "100%" }}
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

        {/* Gap */}
        <div style={{ height: 20 }} />

        {/* Table / Empty state */}
        {filteredTestimonials.length === 0 ? (
          <div className="test-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <MessageSquare size={27} color="#cbd5e1" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No testimonials found</h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || filters.rating !== "all" ? "Try adjusting your filters or search term." : "Get started by adding your first testimonial."}
            </p>
            {(searchTerm || filters.rating !== "all") ? (
              <button
                onClick={() => { setSearchTerm(""); setFilters({ rating: "all" }); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/add-testimonial")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
              >
                <Plus size={15} /> Add Testimonial
              </button>
            )}
          </div>
        ) : (
          <div className="test-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
                    <th style={{ padding: "14px 18px", textAlign: "left", width: 56 }}>
                      <button className="test-th-btn" onClick={() => handleSort("display_id")}># <SortIcon col="display_id" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="test-th-btn" onClick={() => handleSort("name")}>Reviewer <SortIcon col="name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="test-th-btn" onClick={() => handleSort("rating")}>Rating <SortIcon col="rating" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }} className="hidden lg:table-cell">
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Review</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }} className="hidden md:table-cell">
                      <button className="test-th-btn" onClick={() => handleSort("created_at")}>Date <SortIcon col="created_at" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTestimonials.map((testimonial, index) => {
                    const color = getColor(testimonial.id);
                    return (
                      <tr
                        key={testimonial.id}
                        className="test-row"
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                        onClick={() => { setSelectedTestimonial(testimonial); setShowViewModal(true); }}
                      >
                        {/* # */}
                        <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1", verticalAlign: "top" }}>
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Reviewer */}
                        <td style={{ padding: "15px 18px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                              {getInitials(testimonial.name)}
                            </div>
                            <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{testimonial.name}</span>
                          </div>
                        </td>

                        {/* Rating */}
                        <td style={{ padding: "15px 18px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            <StarRating rating={testimonial.rating} />
                            <span style={{ padding: "4px 10px", ...getRatingColor(testimonial.rating), fontSize: 12.5, fontWeight: 600, borderRadius: 99, display: "inline-block", width: "fit-content" }}>
                              {testimonial.rating}/5
                            </span>
                          </div>
                        </td>

                        {/* Review */}
                        <td style={{ padding: "15px 18px", verticalAlign: "top" }} className="hidden lg:table-cell">
                          <span style={{ fontSize: 14, color: "#94a3b8", display: "block", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {testimonial.review || <span style={{ fontStyle: "italic" }}>No review text</span>}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: "15px 18px", verticalAlign: "top" }} className="hidden md:table-cell">
                          {testimonial.created_at ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, color: "#64748b" }}>
                              <Calendar size={13} color="#94a3b8" />
                              {formatDate(testimonial.created_at)}
                            </span>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: 14 }}>—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "15px 18px", verticalAlign: "top" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <button
                              className="test-action-btn"
                              onClick={(e) => { e.stopPropagation(); setSelectedTestimonial(testimonial); setShowViewModal(true); }}
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="test-action-btn"
                              onClick={(e) => { e.stopPropagation(); navigate(`/edit-testimonial/${testimonial.id}`, { state: { testimonial } }); }}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              className="test-action-btn"
                              onClick={(e) => handleDeleteClick(e, testimonial)}
                              title="Delete"
                            >
                              <Trash2 size={15} />
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
            <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
                Showing{" "}
                <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTestimonials.length)}</strong>
                {" "}of{" "}
                <strong style={{ color: "#475569" }}>{filteredTestimonials.length}</strong> testimonials
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button
                  className="test-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`test-page-btn${currentPage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="test-page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Testimonial Modal */}
      {showViewModal && selectedTestimonial && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowViewModal(false)}
          />
          <div className="test-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 600, width: "100%", zIndex: 10, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

            <button
              onClick={() => setShowViewModal(false)}
              style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex", zIndex: 10 }}
            >
              <X size={15} />
            </button>

            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>

              {/* Avatar + Name + Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: getColor(selectedTestimonial.id), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                  {getInitials(selectedTestimonial.name)}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{selectedTestimonial.name}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <StarRating rating={selectedTestimonial.rating} size={16} />
                    <span style={{ padding: "2px 8px", ...getRatingColor(selectedTestimonial.rating), fontSize: 11, fontWeight: 600, borderRadius: 99 }}>
                      {selectedTestimonial.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              {selectedTestimonial.created_at && (
                <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={11} color="#7c3aed" /> Submitted On
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 }}>
                    {new Date(selectedTestimonial.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              )}

              {/* Review */}
              <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 8px" }}>Review</p>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                    {selectedTestimonial.review || "No review content available."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
              <button className="test-close-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-testimonial/${selectedTestimonial.id}`, { state: { testimonial: selectedTestimonial } });
                }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                <Edit size={14} /> Edit Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && testimonialToDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="test-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 400, width: "100%", zIndex: 10, padding: 24 }}>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Delete Testimonial</h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                  Are you sure you want to delete the testimonial from "<strong style={{ color: "#1e293b" }}>{testimonialToDelete.name}</strong>"? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div style={{ marginTop: 16, padding: 12, background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={15} color="#ef4444" />
                <span style={{ fontSize: 14, color: "#b91c1c" }}>{deleteError}</span>
              </div>
            )}

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                className="test-close-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                style={{ opacity: deleteLoading ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: deleteLoading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: deleteLoading ? 0.6 : 1 }}
              >
                {deleteLoading ? (
                  <>
                    <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
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
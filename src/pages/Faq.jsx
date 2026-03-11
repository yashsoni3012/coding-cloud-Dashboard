import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toasts from "./Toasts";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  ChevronDown,
  BookOpen,
  MessageCircleQuestion,
  Filter,
  Eye,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function FAQs() {
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast state
  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "display_id",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ course: "all" });
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faqsRes, coursesRes] = await Promise.all([
        fetch("https://codingcloud.pythonanywhere.com/faqs/"),
        fetch("https://codingcloud.pythonanywhere.com/course/"),
      ]);

      if (faqsRes.ok && coursesRes.ok) {
        const faqsData = await faqsRes.json();
        const coursesDataRes = await coursesRes.json();

        const courseMap = {};
        const actualCourses = coursesDataRes.data || coursesDataRes;
        if (Array.isArray(actualCourses)) {
          actualCourses.forEach((c) => {
            courseMap[c.id] = c.name;
          });
        }
        setCourses(courseMap);

        const actualFaqs = faqsData.data || faqsData;
        const faqsList = Array.isArray(actualFaqs) ? actualFaqs : [];
        const faqsWithDisplayIds = faqsList.map((faq, index) => ({
          ...faq,
          display_id: index + 1,
        }));
        setFaqs(faqsWithDisplayIds);
        setFilteredFaqs(faqsWithDisplayIds);
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...faqs];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((faq) => {
        const courseName = courses[faq.course] || "";
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          courseName.toLowerCase().includes(q) ||
          faq.display_id.toString().includes(q)
        );
      });
    }

    if (filters.course !== "all") {
      result = result.filter((faq) => faq.course === parseInt(filters.course));
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") {
        aVal = a.display_id || 0;
        bVal = b.display_id || 0;
      } else if (sortConfig.key === "question") {
        aVal = a.question?.toLowerCase() || "";
        bVal = b.question?.toLowerCase() || "";
      } else if (sortConfig.key === "course") {
        aVal = courses[a.course]?.toLowerCase() || String(a.course);
        bVal = courses[b.course]?.toLowerCase() || String(b.course);
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredFaqs(result);
    setCurrentPage(1);
    setExpandedFaqs(new Set());
  }, [searchTerm, filters, sortConfig, faqs, courses]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({
      key,
      direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} style={{ color: "#7c3aed" }} />
    ) : (
      <SortDesc size={13} style={{ color: "#7c3aed" }} />
    );
  };

  const toggleFaq = (faqId) => {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      next.has(faqId) ? next.delete(faqId) : next.add(faqId);
      return next;
    });
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

  const handleDeleteClick = (e, faq) => {
    e.stopPropagation();
    setFaqToDelete(faq);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/faqs/${faqToDelete.id}/`,
        { method: "DELETE" },
      );
      if (response.ok || response.status === 204) {
        setToastConfig({
          show: true,
          message: "FAQ deleted successfully!",
          type: "error",
        });
        setShowDeleteModal(false);
        setFaqToDelete(null);
        fetchData();
      } else {
        setToastConfig({
          show: true,
          message: "Failed to delete FAQ.",
          type: "error",
        });
      }
    } catch {
      setToastConfig({
        show: true,
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const uniqueCourses = Object.keys(courses).map((id) => ({
    id: parseInt(id),
    name: courses[id],
  }));

  const activeFiltersCount = [
    filters.course !== "all",
    sortConfig.key !== "display_id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  // Helper for consistent avatar colors
  const avatarColors = [
    "#7c3aed",
    "#2563eb",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];
  const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
  const getInitials = (question) =>
    question ? question.slice(0, 2).toUpperCase() : "FA";

  if (loading) {
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
            Loading FAQs…
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
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
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
        .faq-animate { animation: fadeSlideIn 0.22s ease forwards; }
        .faq-row { transition: background 0.13s; cursor: pointer; }
        .faq-row:hover { background: #fafafa; }
        .faq-action-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: background 0.13s, color 0.13s; color: #94a3b8; }
        .faq-action-btn:hover { background: #ede9fe; color: #7c3aed; }
        .faq-th-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; padding: 0; transition: color 0.13s; font-family: inherit; }
        .faq-th-btn:hover { color: #475569; }
        .faq-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; font-family: inherit; }
        .faq-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .faq-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .faq-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .faq-search { width: 100%; padding: 11px 36px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
        .faq-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .faq-search::placeholder { color: #cbd5e1; }
        .faq-select { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #475569; background: #f8fafc; outline: none; cursor: pointer; font-family: inherit; font-weight: 500; transition: border-color 0.15s; }
        .faq-select:focus { border-color: #7c3aed; }
        .faq-filter-btn { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.13s; font-family: inherit; white-space: nowrap; }
        .faq-filter-btn.active { border-color: #7c3aed; background: #ede9fe; color: #7c3aed; }
        .faq-filter-btn:hover { background: #f1f5f9; }
        .faq-add-btn { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border: none; border-radius: 10px; background: #7c3aed; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.13s; font-family: inherit; white-space: nowrap; box-shadow: 0 2px 8px rgba(124,58,237,0.25); }
        .faq-add-btn:hover { background: #6d28d9; }
        .faq-copy-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
        .faq-copy-btn:hover { background: #f1f5f9; }
        .faq-close-btn { padding: 9px 16px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.13s; }
        .faq-close-btn:hover { background: #f1f5f9; }
      `}</style>

      {/* Toast component */}
      {toastConfig.show && (
        <Toasts
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig({ ...toastConfig, show: false })}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
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
              <MessageCircleQuestion size={17} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              FAQs
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
              {faqs.length}
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
            Manage frequently asked questions across courses
          </p>
        </div>

        {/* Toolbar */}
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
                className="faq-search"
                type="text"
                placeholder="Search questions, answers or course…"
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

            {/* Filter toggle */}
            <button
              className={`faq-filter-btn ${showFilters || activeFiltersCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span
                  style={{
                    marginLeft: 2,
                    background: "#7c3aed",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 20,
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                style={{
                  transition: "transform 0.2s",
                  transform: showFilters ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {/* Add FAQ */}
            <button
              className="faq-add-btn"
              onClick={() => navigate("/add-faq")}
            >
              <Plus size={16} />
              Add FAQ
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid #f1f5f9",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    marginBottom: 6,
                  }}
                >
                  Course
                </label>
                <select
                  className="faq-select"
                  value={filters.course}
                  onChange={(e) =>
                    setFilters({ ...filters, course: e.target.value })
                  }
                  style={{ width: "100%" }}
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    marginBottom: 6,
                  }}
                >
                  Items per page
                </label>
                <select
                  className="faq-select"
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
        {filteredFaqs.length === 0 ? (
          <div
            className="faq-animate"
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
              <MessageCircleQuestion size={27} color="#cbd5e1" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 6px",
              }}
            >
              No FAQs found
            </h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm || filters.course !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first FAQ."}
            </p>
            {searchTerm || filters.course !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ course: "all" });
                }}
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
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/add-faq")}
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
                <Plus size={15} /> Add FAQ
              </button>
            )}
          </div>
        ) : (
          <div
            className="faq-animate"
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
                        className="faq-th-btn"
                        onClick={() => handleSort("display_id")}
                      >
                        # {getSortIcon("display_id")}
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="faq-th-btn"
                        onClick={() => handleSort("question")}
                      >
                        Question {getSortIcon("question")}
                      </button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button
                        className="faq-th-btn"
                        onClick={() => handleSort("course")}
                      >
                        Course {getSortIcon("course")}
                      </button>
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
                  {paginatedFaqs.map((faq, index) => {
                    const isExpanded = expandedFaqs.has(faq.id);
                    const color = getColor(faq.id);
                    return (
                      <tr
                        key={faq.id}
                        className="faq-row"
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                        onClick={() => {
                          setSelectedFaq(faq);
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
                            verticalAlign: "top",
                          }}
                        >
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Question column with expandable answer */}
                        <td style={{ padding: "15px 18px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(faq.question)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFaq(faq.id);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  padding: 0,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#1e293b",
                                  }}
                                >
                                  {faq.question}
                                </span>
                                <ChevronDown
                                  size={15}
                                  style={{
                                    color: "#94a3b8",
                                    transition: "transform 0.2s",
                                    transform: isExpanded
                                      ? "rotate(180deg)"
                                      : "none",
                                    flexShrink: 0,
                                  }}
                                />
                              </button>
                              {isExpanded && (
                                <div
                                  style={{
                                    marginTop: 10,
                                    paddingLeft: 10,
                                    borderLeft: "2px solid #ede9fe",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: 14,
                                      color: "#64748b",
                                      lineHeight: 1.6,
                                      margin: 0,
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Course badge */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "4px 10px",
                              background: "#ede9fe",
                              color: "#6d28d9",
                              border: "1px solid #ddd6fe",
                              fontSize: 12.5,
                              fontWeight: 600,
                              borderRadius: 99,
                            }}
                          >
                            <BookOpen size={10} />
                            {courses[faq.course] || `Course ${faq.course}`}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          style={{ padding: "15px 18px", verticalAlign: "top" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 2,
                            }}
                          >
                            <button
                              className="faq-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFaq(faq);
                                setShowViewModal(true);
                              }}
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="faq-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-faq/${faq.id}`, {
                                  state: { faq },
                                });
                              }}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              className="faq-action-btn"
                              onClick={(e) => handleDeleteClick(e, faq)}
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
                  {Math.min(indexOfLastItem, filteredFaqs.length)}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "#475569" }}>
                  {filteredFaqs.length}
                </strong>{" "}
                FAQs
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button
                  className="faq-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2)
                      page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      className={`faq-page-btn${currentPage === page ? " active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="faq-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedFaq && (
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
            className="faq-animate"
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
              {/* Avatar + Question */}
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
                    background: getColor(selectedFaq.id),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(selectedFaq.question)}
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
                    {selectedFaq.question}
                  </h2>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#94a3b8",
                      margin: "3px 0 0",
                    }}
                  >
                    FAQ #{selectedFaq.display_id}
                  </p>
                </div>
              </div>

              {/* Course */}
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
                  <BookOpen size={11} color="#7c3aed" /> Course
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  {courses[selectedFaq.course] ||
                    `Course ${selectedFaq.course}`}
                </p>
              </div>

              {/* Answer */}
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
                  <MessageCircleQuestion size={11} color="#7c3aed" /> Answer
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
                  {selectedFaq.answer}
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
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                className="faq-close-btn"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-faq/${selectedFaq.id}`, {
                    state: { faq: selectedFaq },
                  });
                }}
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
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Edit size={14} /> Edit FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && faqToDelete && (
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
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div
            className="faq-animate"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxWidth: 400,
              width: "100%",
              zIndex: 10,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}
                >
                  Delete FAQ
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                  Are you sure you want to delete "
                  <strong style={{ color: "#1e293b" }}>
                    {faqToDelete.question}
                  </strong>
                  "? This action cannot be undone.
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                className="faq-close-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                style={{ opacity: deleteLoading ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: deleteLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: deleteLoading ? 0.6 : 1,
                }}
              >
                {deleteLoading ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #fff",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
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

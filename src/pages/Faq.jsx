import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageCircleQuestion,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function FAQs() {
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());
  const [selectedCourse, setSelectedCourse] = useState("all");

  // Checkbox + Pagination
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

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
        if (Array.isArray(actualCourses))
          actualCourses.forEach((c) => {
            courseMap[c.id] = c.name;
          });
        setCourses(courseMap);
        const actualFaqs = faqsData.data || faqsData;
        const faqsList = Array.isArray(actualFaqs) ? actualFaqs : [];
        setFaqs(faqsList);
        setFilteredFaqs(faqsList);
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
    let filtered = faqs;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((faq) => {
        const courseName = courses[faq.course] || "";
        return (
          faq.question.toLowerCase().includes(lowerSearch) ||
          faq.answer.toLowerCase().includes(lowerSearch) ||
          courseName.toLowerCase().includes(lowerSearch)
        );
      });
    }
    if (selectedCourse !== "all")
      filtered = filtered.filter(
        (faq) => faq.course === parseInt(selectedCourse),
      );
    setFilteredFaqs(filtered);
    setExpandedFaqs(new Set());
    setCurrentPage(1);
    setSelectedRows([]);
  }, [searchTerm, selectedCourse, faqs, courses]);

  const toggleFaq = (faqId) => {
    setExpandedFaqs((prev) => {
      const newSet = new Set(prev);
      newSet.has(faqId) ? newSet.delete(faqId) : newSet.add(faqId);
      return newSet;
    });
  };

  const expandAll = () => setExpandedFaqs(new Set(paginated.map((f) => f.id)));
  const collapseAll = () => setExpandedFaqs(new Set());

  const handleDeleteClick = (faq) => {
    setFaqToDelete(faq);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/faqs/${faqToDelete.id}/`,
        { method: "DELETE" },
      );
      if (response.ok || response.status === 204) {
        setDeleteSuccess("FAQ deleted successfully!");
        fetchData();
        setTimeout(() => {
          setShowDeleteModal(false);
          setFaqToDelete(null);
          setDeleteSuccess("");
        }, 1500);
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete FAQ.");
        } catch {
          setDeleteError(`HTTP Error: ${response.status}`);
        }
      }
    } catch (err) {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (faq) =>
    navigate(`/edit-faq/${faq.id}`, { state: { faq } });

  const uniqueCourses = Object.keys(courses).map((id) => ({
    id: parseInt(id),
    name: courses[id],
  }));

  // Pagination
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);
  const paginated = filteredFaqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Checkboxes
  const allOnPageSelected =
    paginated.length > 0 && paginated.every((f) => selectedRows.includes(f.id));
  const toggleSelectAll = () => {
    if (allOnPageSelected)
      setSelectedRows((prev) =>
        prev.filter((id) => !paginated.map((f) => f.id).includes(id)),
      );
    else
      setSelectedRows((prev) => [
        ...prev,
        ...paginated.map((f) => f.id).filter((id) => !prev.includes(id)),
      ]);
  };
  const toggleRow = (id) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // Stat cards
  const uniqueCourseCount = Object.keys(courses).length;
  const statCards = [
    { label: "Total FAQs", value: faqs.length, pct: 72 },
    { label: "Filtered FAQs", value: filteredFaqs.length, pct: 55 },
    { label: "Courses", value: uniqueCourseCount, pct: 42 },
    { label: "Expanded", value: expandedFaqs.size, pct: 30 },
  ];

  const CircularProgress = ({ pct }) => {
    const r = 20,
      circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
      <svg width="52" height="52" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <foreignObject x="8" y="8" width="32" height="32">
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpRight size={14} color="#2563eb" />
          </div>
        </foreignObject>
      </svg>
    );
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Loading FAQs...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#fee2e2",
              borderRadius: "50%",
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <X size={28} color="#dc2626" />
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#111827",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h3>
          <p style={{ color: "#6b7280", marginBottom: 16 }}>{error}</p>
          <button
            onClick={fetchData}
            style={{
              padding: "8px 20px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontFamily: "inherit",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f4f5f7",
        minHeight: "100vh",
        padding: "24px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .faq-card { transition: box-shadow 0.18s; }
        .faq-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09) !important; }
        .faq-header-btn { width: 100%; background: none; border: none; cursor: pointer; text-align: left; transition: background 0.15s; border-radius: 0; }
        .faq-header-btn:hover { background: #f9fafb; }
        .action-btn-f { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: inherit; transition: background 0.15s; }
        .page-btn-f { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .page-btn-f:hover:not(:disabled) { background: #f3f4f6; }
        .page-btn-f:disabled { opacity: 0.4; cursor: not-allowed; }
        .faq-answer { animation: slideDown 0.18s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .stat-grid-f { grid-template-columns: 1fr 1fr !important; }
          .toolbar-f { flex-wrap: wrap; }
        }
        @media (max-width: 400px) { .stat-grid-f { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Stat Cards ── */}
      <div
        className="stat-grid-f"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statCards.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <CircularProgress pct={s.pct} />
            <div>
              <p
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#111827",
                  margin: "2px 0 0",
                }}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Card ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          className="toolbar-f"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 20px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          {/* Course filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 13,
              color: "#374151",
              background: "#fff",
              outline: "none",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate("/add-faq")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Plus size={15} />
            Add FAQ
          </button>

          <button
            onClick={fetchData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <RefreshCw size={14} />
            <span className="hide-mob-f">Refresh</span>
          </button>

          {filteredFaqs.length > 0 && (
            <div style={{ display: "flex", gap: 6 }} className="hide-mob-f">
              <button
                onClick={expandAll}
                className="action-btn-f"
                style={{
                  color: "#6b7280",
                  background: "#f3f4f6",
                  fontSize: 12,
                }}
              >
                <ChevronDown size={13} /> Expand All
              </button>
              <button
                onClick={collapseAll}
                className="action-btn-f"
                style={{
                  color: "#6b7280",
                  background: "#f3f4f6",
                  fontSize: 12,
                }}
              >
                <ChevronUp size={13} /> Collapse All
              </button>
            </div>
          )}

          {selectedRows.length > 0 && (
            <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
              {selectedRows.length} selected
            </span>
          )}

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: "relative", minWidth: 220 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: 32,
                paddingRight: searchTerm ? 32 : 12,
                paddingTop: 8,
                paddingBottom: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                color: "#374151",
                background: "#f9fafb",
                outline: "none",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  padding: 0,
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div
              style={{
                background: "#f3f4f6",
                borderRadius: "50%",
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <MessageCircleQuestion size={28} color="#9ca3af" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              No FAQs found
            </h3>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
              {searchTerm || selectedCourse !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by adding your first FAQ."}
            </p>
            {(searchTerm || selectedCourse !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCourse("all");
                }}
                style={{
                  padding: "8px 20px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontFamily: "inherit",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Column Header Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderBottom: "1px solid #f3f4f6",
                background: "#fafafa",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                  flex: 1,
                }}
              >
                Question
              </p>
              <div style={{ width: 90 }} />
            </div>

            {/* FAQ Rows */}
            <div style={{ divide: "1px solid #f3f4f6" }}>
              {paginated.map((faq) => {
                const isExpanded = expandedFaqs.has(faq.id);
                const isSelected = selectedRows.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="faq-card"
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: isSelected ? "#eff6ff" : "#fff",
                    }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0 20px",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          width: 44,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      ></div>

                      {/* Question (clickable) */}
                      <button
                        className="faq-header-btn"
                        onClick={() => toggleFaq(faq.id)}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          padding: "16px 0",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{ flex: 1, minWidth: 0, textAlign: "left" }}
                        >
                          <p
                            style={{
                              fontWeight: 600,
                              color: "#111827",
                              margin: 0,
                              fontSize: 14,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: isExpanded ? "normal" : "nowrap",
                              paddingRight: 8,
                            }}
                          >
                            {faq.question}
                          </p>
                        </div>
                      </button>

                      {/* Course badge */}
                      <div
                        style={{ width: 140, flexShrink: 0 }}
                        className="hide-mob-f"
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            background: "#eff6ff",
                            borderRadius: 20,
                            fontSize: 11,
                            color: "#2563eb",
                            fontWeight: 500,
                            maxWidth: 130,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <BookOpen size={10} />
                          {courses[faq.course] || `Course ${faq.course}`}
                        </span>
                      </div>

                      {/* Toggle + Actions */}
                      <div
                        style={{
                          width: 90,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 4,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(faq);
                          }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f3f4f6";
                            e.currentTarget.style.color = "#374151";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#9ca3af";
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(faq);
                          }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#f87171",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#fef2f2")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f3f4f6")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Answer */}
                    {isExpanded && (
                      <div
                        className="faq-answer"
                        style={{ padding: "0 20px 18px 64px" }}
                      >
                        <div
                          style={{
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: 12,
                            padding: "16px 18px",
                          }}
                        >
                          {/* Course chip on mobile */}
                          <div
                            style={{ display: "none" }}
                            className="show-mob-only"
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 10px",
                                background: "#eff6ff",
                                borderRadius: 20,
                                fontSize: 11,
                                color: "#2563eb",
                                fontWeight: 500,
                                marginBottom: 10,
                              }}
                            >
                              <BookOpen size={10} />
                              {courses[faq.course] || `Course ${faq.course}`}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#4b5563",
                              lineHeight: 1.75,
                              margin: 0,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <button
                className="page-btn-f"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Page <strong style={{ color: "#111827" }}>{currentPage}</strong>{" "}
                of {totalPages}&nbsp;·&nbsp;{filteredFaqs.length} FAQs
              </span>
              <button
                className="page-btn-f"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Delete Modal ── */}
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
              background: "rgba(17,24,39,0.7)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 440,
              padding: 32,
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertCircle size={26} color="#dc2626" />
            </div>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111827",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Delete FAQ
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#6b7280",
                textAlign: "center",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "#111827" }}>
                "{faqToDelete.question}"
              </strong>
              ? This cannot be undone.
            </p>

            {deleteSuccess && (
              <div
                style={{
                  marginBottom: 14,
                  padding: "10px 14px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <CheckCircle size={15} color="#16a34a" />
                <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>
                  {deleteSuccess}
                </p>
              </div>
            )}
            {deleteError && (
              <div
                style={{
                  marginBottom: 14,
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <X size={15} color="#dc2626" />
                <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
                  {deleteError}
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                style={{
                  flex: 1,
                  padding: 11,
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading || !!deleteSuccess}
                style={{
                  flex: 1,
                  padding: 11,
                  border: "none",
                  borderRadius: 10,
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "inherit",
                  opacity: deleteLoading || !!deleteSuccess ? 0.6 : 1,
                }}
              >
                {deleteLoading ? (
                  <>
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} /> Delete FAQ
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

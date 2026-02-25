import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  X,
  SlidersHorizontal,
  Plus,
  ChevronRight,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Hash,
  BookMarked,
  Layers,
  Clock,
  FolderOpen,
  Eye,
} from "lucide-react";

export default function Modules() {
  const navigate = useNavigate();

  // State for modules data
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedModule, setSelectedModule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Fetch modules
  const fetchModules = async () => {
    try {
      setLoading(true);
      const [modulesRes, coursesRes] = await Promise.all([
        fetch("https://codingcloud.pythonanywhere.com/modules/"),
        fetch("https://codingcloud.pythonanywhere.com/course/"),
      ]);

      const data = await modulesRes.json();
      const coursesDataRes = await coursesRes.json();

      if (data.success) {
        setModules(data.data);
        setFilteredModules(data.data);

        // Extract unique course IDs for filtering
        const courses = [...new Set(data.data.map((m) => m.course_data))].sort(
          (a, b) => a - b,
        );
        setUniqueCourses(courses);

        // Map courses
        const courseMap = {};
        const actualCourses = coursesDataRes.data || coursesDataRes;
        if (Array.isArray(actualCourses)) {
          actualCourses.forEach((course) => {
            courseMap[course.id] = course.name;
          });
        }
        setCoursesMap(courseMap);
      } else {
        setError("Failed to fetch modules");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error fetching modules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Filter modules based on search and course filter
  useEffect(() => {
    let filtered = [...modules];

    if (searchTerm) {
      filtered = filtered.filter((module) =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCourse !== "all") {
      filtered = filtered.filter(
        (module) => module.course_data === parseInt(selectedCourse),
      );
    }

    setFilteredModules(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, modules]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCourse("all");
  };

  // Modal handlers
  const openModuleModal = (module) => {
    setSelectedModule(module);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModuleModal = () => {
    setShowModal(false);
    setSelectedModule(null);
    document.body.style.overflow = "unset";
  };

  // Delete handlers
  const handleDeleteClick = (e, module) => {
    e.stopPropagation();
    setModuleToDelete(module);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!moduleToDelete) return;

    // Optimistic UI update - remove module immediately
    const moduleId = moduleToDelete.id;
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setFilteredModules(prev => prev.filter(m => m.id !== moduleId));
    
    // Close modal immediately for better UX
    setShowDeleteModal(false);
    setDeleteLoading(false);

    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/modules/${moduleId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok && response.status !== 204) {
        // If deletion fails, refetch modules to restore data
        await fetchModules();
        setDeleteError("Failed to delete module. Data has been restored.");
        setTimeout(() => setDeleteError(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting module:", err);
      // Refetch modules on error to ensure consistency
      await fetchModules();
      setDeleteError("Network error. Please try again.");
      setTimeout(() => setDeleteError(""), 3000);
    }
  };

  // Handle edit
  const handleEdit = (e, moduleId) => {
    e.stopPropagation();
    navigate(`/edit-module/${moduleId}`);
  };

  // Pagination
  const paginatedModules = filteredModules.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);

  // Stat card data
  const totalCourses = uniqueCourses.length;
  const statCards = [
    { label: "Total Modules", value: modules.length, color: "#2563eb", pct: 72 },
    { label: "Total Courses", value: totalCourses, color: "#2563eb", pct: 58 },
    { label: "Avg Modules/Course", value: modules.length ? Math.round(modules.length / totalCourses) : 0, color: "#2563eb", pct: 45 },
  ];

  const CircularProgress = ({ pct, color, size = 52 }) => {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <foreignObject x="8" y="8" width="32" height="32">
          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={14} color={color} />
          </div>
        </foreignObject>
      </svg>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, border: "3px solid #e5e7eb", borderTopColor: "#2563eb",
            borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px"
          }} />
          <p style={{ color: "#6b7280", fontSize: 14 }}>Loading modules...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ background: "#fee2e2", borderRadius: "50%", padding: 16, width: 64, height: 64, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={28} color="#dc2626" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Something went wrong</h3>
          <p style={{ color: "#6b7280", marginBottom: 16 }}>{error}</p>
          <button onClick={() => window.location.reload()}
            style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "24px 20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .module-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }
        .filter-sel { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; font-size: 13px; color: #374151; background: #fff; outline: none; appearance: none; cursor: pointer; }
        .filter-sel:focus { border-color: #2563eb; }
        .page-btn { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 500; background: #fff; color: #374151; cursor: pointer; transition: background 0.15s; }
        .page-btn:hover:not(:disabled) { background: #f3f4f6; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16; }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .filter-section { flex-direction: column; }
        }
        @media (max-width: 400px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Stat Cards ── */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <CircularProgress pct={s.pct} color={s.color} />
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "2px 0 0" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error Toast */}
      {deleteError && (
        <div style={{ 
          position: "fixed", 
          top: 24, 
          right: 24, 
          zIndex: 100,
          background: "#fef2f2", 
          border: "1px solid #fecaca", 
          borderRadius: 10, 
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <X size={16} color="#dc2626" />
          <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{deleteError}</p>
        </div>
      )}

      {/* ── Main Card ── */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          {/* Left: Filter + Add */}
          <button onClick={() => setShowFilters(!showFilters)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            <SlidersHorizontal size={15} />
            Filters
            {(selectedCourse !== "all") && (
              <span style={{ width: 7, height: 7, background: "#2563eb", borderRadius: "50%", display: "inline-block" }} />
            )}
          </button>

          <button onClick={() => navigate("/add-module")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            <Plus size={15} />
            Add Module
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: "relative", minWidth: 200 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: searchTerm ? 32 : 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", background: "#f9fafb", outline: "none", width: "100%" }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Course</p>
                <select className="filter-sel" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((courseId) => (
                    <option key={courseId} value={courseId}>
                      {coursesMap[courseId] || `Course ${courseId}`} ({modules.filter(m => m.course_data === courseId).length})
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={resetFilters}
                style={{ padding: "8px 14px", border: "none", background: "none", color: "#2563eb", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6", background: "#fafbfc" }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Showing <span style={{ fontWeight: 600, color: "#111827" }}>{filteredModules.length}</span> results
          </p>
        </div>

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ background: "#f3f4f6", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <BookOpen size={28} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>No modules found</h3>
            <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>Try adjusting your search or filter criteria</p>
            <button onClick={resetFilters}
              style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500 }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, padding: 20 }}>
              {paginatedModules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => openModuleModal(module)}
                  className="module-card"
                  style={{ 
                    background: "#fff", 
                    borderRadius: 12, 
                    border: "1px solid #f0f0f0", 
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ padding: 18 }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 32, height: 32, background: "#eef2ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Hash size={16} color="#4f46e5" />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 8px", borderRadius: 12 }}>
                          ID: {module.id}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "#4f46e5", background: "#eef2ff", padding: "3px 8px", borderRadius: 12, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {coursesMap[module.course_data] || `Course ${module.course_data}`}
                      </span>
                    </div>

                    {/* Module Name */}
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 18px 0", lineHeight: 1.4, minHeight: 42 }}>
                      {module.name}
                    </h3>

                    {/* Action Buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); openModuleModal(module); }}
                        style={{ padding: "6px 0", background: "#eef2ff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#4f46e5", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#e0e7ff"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#eef2ff"}
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => handleEdit(e, module.id)}
                        style={{ padding: "6px 0", background: "#dbeafe", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#2563eb", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#bfdbfe"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#dbeafe"}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, module)}
                        style={{ padding: "6px 0", background: "#fee2e2", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#dc2626", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
                <button className="page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Previous
                </button>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  Page <strong style={{ color: "#111827" }}>{currentPage}</strong> of {totalPages}
                </span>
                <button className="page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Module Details Modal ── */}
      {showModal && selectedModule && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.7)", backdropFilter: "blur(4px)" }} onClick={closeModuleModal} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
            <button onClick={closeModuleModal}
              style={{ position: "absolute", top: 16, right: 16, zIndex: 10, width: 36, height: 36, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <X size={18} color="#374151" />
            </button>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)", padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={32} color="#fff" />
                </div>
                <div>
                  <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 22, margin: "0 0 4px" }}>{selectedModule.name}</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ padding: "4px 10px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", borderRadius: 20, fontSize: 12, color: "#fff" }}>
                      ID: {selectedModule.id}
                    </span>
                    <span style={{ padding: "4px 10px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", borderRadius: 20, fontSize: 12, color: "#fff" }}>
                      {coursesMap[selectedModule.course_data] || `Course ${selectedModule.course_data}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: 28 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Module Information</h3>
                <div style={{ background: "#f9fafb", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Module Name</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{selectedModule.name}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Course</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                        {coursesMap[selectedModule.course_data] || selectedModule.course_data}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={(e) => { closeModuleModal(); handleEdit(e, selectedModule.id); }}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "#2563eb", color: "#fff", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                  <Edit size={16} />
                  Edit Module
                </button>
                <button onClick={closeModuleModal}
                  style={{ flex: 1, padding: "12px", border: "1px solid #e5e7eb", color: "#374151", borderRadius: 10, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && moduleToDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowDeleteModal(false)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440, padding: 32, boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <AlertCircle size={28} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 8 }}>Delete Module</h3>
            <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong style={{ color: "#111827" }}>"{moduleToDelete.name}"</strong>? This cannot be undone.
            </p>

            {deleteSuccess && (
              <div style={{ marginBottom: 16, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={16} color="#16a34a" />
                <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>{deleteSuccess}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: "11px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm}
                style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
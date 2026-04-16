import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  Users,
  Globe,
  Award,
  Search,
  X,
  Download,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
  SortAsc,
  SortDesc,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import Toasts from "./Toasts";

const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const fetchCourses = async () => {
  const response = await fetch(`${BASE_URL}/course/`);
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch courses");
  return data.data || [];
};

const getLevelClass = (level) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "bg-green-50 text-green-700 border border-green-200";
    case "intermediate":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "hard":
    case "advanced":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-violet-50 text-violet-700 border border-violet-200";
  }
};

const hasCert = (c) =>
  c.certificate === true || c.certificate === "Yes" || c.certificate === "yes";

export default function Courses() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const categories = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    const catMap = new Map();
    courses.forEach((c) => {
      if (c.category_details?.id)
        catMap.set(c.category_details.id, c.category_details);
    });
    return [...catMap.values()];
  }, [courses]);

  const languages = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return [...new Set(courses.map((c) => c.language).filter(Boolean))];
  }, [courses]);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/course/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });
      const previousCourses = queryClient.getQueryData(["courses"]);
      queryClient.setQueryData(["courses"], (old = []) =>
        old.filter((c) => c.id !== deletedId),
      );
      return { previousCourses };
    },
    onError: (err, _, context) => {
      if (context?.previousCourses)
        queryClient.setQueryData(["courses"], context.previousCourses);
      setDeleteError(err.message);
      setToastError(err.message);
      setTimeout(() => setToastError(""), 3000);
    },
    onSuccess: () => {
      setToast({
        show: true,
        message: "Course deleted successfully!",
        type: "error",
      });
    },
    onSettled: () => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    language: "all",
    certificate: "all",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toastError, setToastError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    let result = [...courses];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          stripHtml(c.text).toLowerCase().includes(q) ||
          c.category_details?.name?.toLowerCase().includes(q),
      );
    }
    if (filters.category !== "all")
      result = result.filter(
        (c) => c.category_details?.id === parseInt(filters.category),
      );
    if (filters.level !== "all")
      result = result.filter(
        (c) => c.level?.toLowerCase() === filters.level.toLowerCase(),
      );
    if (filters.language !== "all")
      result = result.filter(
        (c) => c.language?.toLowerCase() === filters.language.toLowerCase(),
      );
    if (filters.certificate !== "all")
      result = result.filter((c) =>
        filters.certificate === "yes" ? hasCert(c) : !hasCert(c),
      );

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") {
        aVal = a.id || 0;
        bVal = b.id || 0;
      } else if (sortConfig.key === "name") {
        aVal = a.name?.toLowerCase() || "";
        bVal = b.name?.toLowerCase() || "";
      } else if (sortConfig.key === "students") {
        aVal = parseInt(a.students) || 0;
        bVal = parseInt(b.students) || 0;
      } else if (sortConfig.key === "category") {
        aVal = a.category_details?.name?.toLowerCase() || "";
        bVal = b.category_details?.name?.toLowerCase() || "";
      } else if (sortConfig.key === "sequence") {
        aVal = a.course_sequence ?? Number.MAX_SAFE_INTEGER;
        bVal = b.course_sequence ?? Number.MAX_SAFE_INTEGER;
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [courses, searchTerm, filters, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

  const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage, filters });
  useEffect(() => {
    const p = prevDeps.current;
    if (
      p.searchTerm !== searchTerm ||
      p.sortConfig !== sortConfig ||
      p.itemsPerPage !== itemsPerPage ||
      p.filters !== filters
    ) {
      setCurrentPage(1);
      prevDeps.current = { searchTerm, sortConfig, itemsPerPage, filters };
    }
  }, [searchTerm, sortConfig, itemsPerPage, filters]);

  const handleSort = (key) =>
    setSortConfig((c) => ({
      key,
      direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
    }));

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col)
      return <SortAsc size={13} className="text-slate-300" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-600" />
    ) : (
      <SortDesc size={13} className="text-violet-600" />
    );
  };

  const handleDeleteClick = (e, course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    deleteMutation.mutate(courseToDelete.id);
  };

  const activeFiltersCount = [
    filters.category !== "all",
    filters.level !== "all",
    filters.language !== "all",
    filters.certificate !== "all",
  ].filter(Boolean).length;

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  /* ─────────────────────────── Loading ─────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading courses…
          </p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── Error ─────────────────────────── */
  if (queryError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-400 mb-5">{queryError.message}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── Main ─────────────────────────── */
  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .crs-animate { animation: fadeSlideIn 0.22s ease forwards; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {toastError && (
        <div className="fixed top-4 right-4 z-10 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg max-w-xs">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 flex-1">{toastError}</p>
          <button
            onClick={() => setToastError("")}
            className="text-slate-400 flex-shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className="w-fullmax-w-screen-xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
              Courses
            </h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {courses.length}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile search */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search courses…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition placeholder:text-slate-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mobile controls row */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition flex-shrink-0 ${showFilters || activeFiltersCount > 0 ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <Filter size={14} />
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/add-course")}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition flex-shrink-0"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Tablet/Desktop row */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, description or category…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition placeholder:text-slate-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                Show
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                per page
              </span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition flex-shrink-0 ${showFilters || activeFiltersCount > 0 ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              <Filter size={14} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={() => navigate("/add-course")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
            >
              <Plus size={15} /> Add Course
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3.5 border-t border-slate-100">
              {[
                {
                  label: "Category",
                  key: "category",
                  options: [
                    { value: "all", label: "All Categories" },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ],
                },
                {
                  label: "Level",
                  key: "level",
                  options: [
                    { value: "all", label: "All Levels" },
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                  ],
                },
                {
                  label: "Language",
                  key: "language",
                  options: [
                    { value: "all", label: "All Languages" },
                    ...languages.map((l) => ({ value: l, label: l })),
                  ],
                },
                {
                  label: "Certificate",
                  key: "certificate",
                  options: [
                    { value: "all", label: "All" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    {label}
                  </label>
                  <select
                    value={filters[key]}
                    onChange={(e) =>
                      setFilters({ ...filters, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
                  >
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredCourses.length === 0 ? (
          <div className="crs-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No courses found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm || Object.values(filters).some((v) => v !== "all")
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first course."}
            </p>
            <button
              onClick={() => navigate("/add-course")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add Course
            </button>
          </div>
        ) : (
          <div className="crs-animate">
            {/* ══════════════════════════════
                MOBILE CARDS  (< sm)
            ══════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedCourses.map((course, index) => {
                const plainText = stripHtml(course.text);
                return (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowViewModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        {course.image ? (
                          <img
                            src={getImageUrl(course.image)}
                            alt={course.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/48?text=C";
                            }}
                          />
                        ) : (
                          <BookOpen size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                          {course.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {plainText.slice(0, 60) || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
                      {course.category_details?.name && (
                        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {course.category_details.name}
                        </span>
                      )}
                      {course.level && (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getLevelClass(course.level)}`}
                        >
                          {course.level}
                        </span>
                      )}
                      {course.course_sequence !== undefined &&
                        course.course_sequence !== null && (
                          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                            Seq: {course.course_sequence}
                          </span>
                        )}
                      {hasCert(course) && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-semibold flex items-center gap-1">
                          <Award size={10} /> Cert
                        </span>
                      )}
                      {course.students && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                          <Users size={11} /> {course.students}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-slate-100 flex">
                      {[
                        {
                          label: "View",
                          icon: Eye,
                          cls: "text-slate-500 hover:bg-slate-50",
                          fn: (e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                            setShowViewModal(true);
                          },
                        },
                        {
                          label: "Edit",
                          icon: Edit,
                          cls: "text-violet-600 hover:bg-violet-50",
                          fn: (e) => {
                            e.stopPropagation();
                            navigate(`/edit-course/${course.id}`);
                          },
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          cls: "text-red-500 hover:bg-red-50",
                          fn: (e) => handleDeleteClick(e, course),
                        },
                      ].map(({ label, icon: Icon, cls, fn }, i, arr) => (
                        <span key={label} className="flex-1 flex">
                          <button
                            onClick={fn}
                            className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold transition ${cls}`}
                          >
                            <Icon size={13} /> {label}
                          </button>
                          {i < arr.length - 1 && (
                            <div className="w-px bg-slate-100" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ══════════════════════════════
                DESKTOP TABLE (sm+)
            ══════════════════════════════ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          #
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Course <SortIcon col="name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden lg:table-cell">
                        <button
                          onClick={() => handleSort("category")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Category <SortIcon col="category" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Level
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("sequence")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Seq <SortIcon col="sequence" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Cert
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCourses.map((course, index) => {
                      const plainText = stripHtml(course.text);
                      return (
                        <tr
                          key={course.id}
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowViewModal(true);
                          }}
                        >
                          <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
                                {course.image ? (
                                  <img
                                    src={getImageUrl(course.image)}
                                    alt={course.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/44?text=C";
                                    }}
                                  />
                                ) : (
                                  <BookOpen
                                    size={15}
                                    className="text-slate-300"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate max-w-[160px] md:max-w-[220px] lg:max-w-[280px]">
                                  {course.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate max-w-[160px] md:max-w-[220px] lg:max-w-[280px] mt-0.5">
                                  <span className="lg:hidden text-violet-500 font-medium mr-1">
                                    {course.category_details?.name}
                                  </span>
                                  {plainText.slice(0, 50) || "No description"}
                                  {plainText.length > 50 ? "…" : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-sm text-slate-500 font-medium">
                              {course.category_details?.name || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {course.level ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getLevelClass(course.level)}`}
                              >
                                {course.level}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600 font-medium">
                              {course.course_sequence !== undefined &&
                              course.course_sequence !== null
                                ? course.course_sequence
                                : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            {hasCert(course) ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                                <Award size={10} /> Yes
                              </span>
                            ) : (
                              <span className="text-slate-300 text-sm">No</span>
                            )}
                          </td>
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCourse(course);
                                  setShowViewModal(true);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                title="View"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/edit-course/${course.id}`);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                                title="Edit"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, course)}
                                className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
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

              {/* Pagination — inside table card */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-600">
                    {indexOfFirstItem + 1}–
                    {Math.min(
                      indexOfFirstItem + itemsPerPage,
                      filteredCourses.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredCourses.length}
                  </strong>{" "}
                  courses
                </span>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={safePage === 1}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${safePage === page ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={safePage === totalPages}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile pagination */}
            <div className="sm:hidden mt-4 flex flex-col items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <strong className="text-slate-600">
                  {indexOfFirstItem + 1}–
                  {Math.min(
                    indexOfFirstItem + itemsPerPage,
                    filteredCourses.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {filteredCourses.length}
                </strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${safePage === page ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={safePage === totalPages}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          VIEW MODAL
      ══════════════════════════════════════ */}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="crs-animate relative bg-white w-full sm:max-w-xl md:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
            >
              <X size={14} className="text-slate-500" />
            </button>
            <div className="w-10 h-1 bg-slate-300/60 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Banner */}
            <div className="relative h-44 sm:h-52 bg-slate-900 flex-shrink-0 overflow-hidden">
              <img
                src={getImageUrl(
                  selectedCourse.banner_img || selectedCourse.image,
                )}
                alt={selectedCourse.name}
                className="w-full h-full object-cover opacity-75"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x224?text=Course";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-4">
                <h2 className="text-white text-base sm:text-xl font-bold mb-2 line-clamp-2">
                  {selectedCourse.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.category_details?.name && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white font-medium">
                      {selectedCourse.category_details.name}
                    </span>
                  )}
                  {selectedCourse.level && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getLevelClass(selectedCourse.level)}`}
                    >
                      {selectedCourse.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {[
                  {
                    icon: Clock,
                    label: "Duration",
                    val: selectedCourse.duration,
                  },
                  {
                    icon: BookOpen,
                    label: "Lectures",
                    val: selectedCourse.lecture,
                  },
                  {
                    icon: Users,
                    label: "Students",
                    val: selectedCourse.students,
                  },
                  {
                    icon: Globe,
                    label: "Language",
                    val: selectedCourse.language,
                  },
                ]
                  .filter((s) => s.val)
                  .map((s, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center"
                    >
                      <s.icon
                        size={15}
                        className="text-violet-600 mx-auto mb-1"
                      />
                      <p className="text-xs text-slate-400 font-medium mb-0.5">
                        {s.label}
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {s.val}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  About this course
                </p>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {selectedCourse.text ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedCourse.text }}
                    />
                  ) : (
                    <p className="text-slate-400 italic">
                      No description available.
                    </p>
                  )}
                </div>
              </div>

              {selectedCourse.keywords && (
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourse.keywords.split(",").map((k, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        {k.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasCert(selectedCourse) && (
                <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <Award size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-amber-700">
                    Certificate of Completion included
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 flex-shrink-0">
              {selectedCourse.pdf_file && (
                <a
                  href={`${BASE_URL}/${selectedCourse.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 transition no-underline"
                >
                  <Download size={14} /> Syllabus
                </a>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-course/${selectedCourse.id}`);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                <Edit size={14} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════ */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() =>
              !deleteMutation.isPending && setShowDeleteModal(false)
            }
          />
          <div className="crs-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <button
              onClick={() =>
                !deleteMutation.isPending && setShowDeleteModal(false)
              }
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X size={15} />
            </button>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  Delete Course
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    "{courseToDelete.name}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteError && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
            <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}  
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-70 transition"
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
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
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  X,
  User,
  SortAsc,
  SortDesc,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

/* ─── API ────────────────────────────────────── */
const fetchEnrollments = async () => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/enroll",
  );
  if (!response.ok)
    throw new Error(`HTTP ${response.status} · ${response.statusText}`);
  const data = await response.json();
  return (Array.isArray(data) ? data : []).map((item, index) => ({
    ...item,
    display_id: index + 1,
  }));
};

/* ─── Helpers ────────────────────────────────── */
const avatarColors = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
];
const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];
const getInitials = (first, last) => {
  if (!first && !last) return "??";
  return (
    `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "??"
  );
};
// Returns YYYY-MM-DD from ISO string (ignores time)
const getLocalDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-CA");
};

// Format date for Excel display
const formatDateForExcel = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ─── Component ──────────────────────────────── */
export default function EnrollmentList() {
  const {
    data: enrollments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["enrollments"],
    queryFn: fetchEnrollments,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  /* reset page on filter/sort change */
  const prevDeps = useRef({
    searchTerm,
    sortConfig,
    itemsPerPage,
    startDate,
    endDate,
  });
  useEffect(() => {
    const p = prevDeps.current;
    if (
      p.searchTerm !== searchTerm ||
      p.sortConfig !== sortConfig ||
      p.itemsPerPage !== itemsPerPage ||
      p.startDate !== startDate ||
      p.endDate !== endDate
    ) {
      setCurrentPage(1);
      prevDeps.current = {
        searchTerm,
        sortConfig,
        itemsPerPage,
        startDate,
        endDate,
      };
    }
  }, [searchTerm, sortConfig, itemsPerPage, startDate, endDate]);

  /* date filter (works with YYYY-MM-DD strings) */
  const isWithinDateRange = (e) => {
    if (!startDate && !endDate) return true;
    const d = getLocalDate(e.created_at);
    if (!d) return false;
    if (startDate && !endDate) return d >= startDate;
    if (!startDate && endDate) return d <= endDate;
    return d >= startDate && d <= endDate;
  };

  /* filtered + sorted */
  const filteredEnrollments = (() => {
    let result = enrollments.filter(isWithinDateRange);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.mobile?.includes(searchTerm) ||
          e.city?.toLowerCase().includes(q) ||
          e.course_name?.toLowerCase().includes(q) ||
          e.display_id?.toString().includes(searchTerm),
      );
    }
    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "display_id") {
        aVal = a.display_id || 0;
        bVal = b.display_id || 0;
      } else if (sortConfig.key === "full_name") {
        aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
        bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else if (sortConfig.key === "email") {
        aVal = a.email?.toLowerCase() || "";
        bVal = b.email?.toLowerCase() || "";
      } else if (sortConfig.key === "course_name") {
        aVal = a.course_name?.toLowerCase() || "";
        bVal = b.course_name?.toLowerCase() || "";
      } else if (sortConfig.key === "created_at") {
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  })();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnrollments.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

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

  /* Export to Excel – respects current date range and search filters */
  const exportToExcel = () => {
    if (!filteredEnrollments.length) return;

    // Prepare data (preserve display order)
    const excelData = filteredEnrollments.map((e) => ({
      "No.": e.display_id,
      "First Name": e.first_name || "",
      "Last Name": e.last_name || "",
      "Full Name": `${e.first_name || ""} ${e.last_name || ""}`.trim(),
      Email: e.email || "",
      Mobile: e.mobile || "",
      City: e.city || "",
      Course: e.course_name || `Course #${e.course_id}`,
      "Enrolled On": formatDateForExcel(e.created_at),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enrollments");

    // Build filename with date range
    let dateRange = "all";
    if (startDate && endDate) {
      dateRange = `${startDate}_to_${endDate}`;
    } else if (startDate) {
      dateRange = `from_${startDate}`;
    } else if (endDate) {
      dateRange = `until_${endDate}`;
    }
    const fileName = `enrollments_${dateRange}_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };
  const hasFilters = searchTerm || startDate || endDate;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading enrollments…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-400 mb-5">{error.message}</p>
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

  /* ── Main ── */
  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .enr-animate { animation: fadeSlideIn 0.22s ease forwards; }
      `}</style>

      <div className="w-full max-w-screen-xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
                <BookOpen size={16} className="text-white" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                Course Enrollments
              </h1>
              <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                {enrollments.length}
              </span>
            </div>
          </div>

          {/* Export button */}
          <button
            onClick={exportToExcel}
            disabled={filteredEnrollments.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-emerald-200 self-start sm:self-auto flex-shrink-0"
          >
            <Download size={15} />
            <span className="hidden xs:inline">Export to Excel</span>
            <span className="inline xs:hidden">Export</span>
            <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-xs font-bold">
              {filteredEnrollments.length}
            </span>
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile: row 1 — search */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search enrollments…"
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

          {/* Mobile: row 2 — dates */}
          <div className="flex items-center gap-2 mb-2.5 sm:hidden">
            <div className="relative flex-1">
              <Calendar
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition"
              />
            </div>
            <span className="text-slate-300 text-xs flex-shrink-0">—</span>
            <div className="relative flex-1">
              <Calendar
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile: row 3 — per page */}
          <div className="flex items-center gap-2 sm:hidden">
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
            <span className="text-xs text-slate-400 font-medium">per page</span>
          </div>

          {/* Tablet/Desktop: single row */}
          <div className="hidden sm:flex items-center gap-2.5 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, city, course or ID…"
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

            {/* Date range */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Calendar
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition w-[140px]"
                />
              </div>
              <span className="text-slate-300">—</span>
              <div className="relative">
                <Calendar
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 outline-none focus:border-violet-500 transition w-[140px]"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition flex-shrink-0"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Per page */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
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
          </div>

          {/* Clear all */}
          {hasFilters && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
              >
                <X size={11} /> Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="h-5" />

        {/* ── Empty State ── */}
        {filteredEnrollments.length === 0 ? (
          <div className="enr-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No enrollments found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {hasFilters
                ? "Try adjusting your filters."
                : "No enrollment records yet."}
            </p>
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="enr-animate">
            {/* ══════════════════════════════
                MOBILE CARDS  (< sm)
            ══════════════════════════════ */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedEnrollments.map((enrollment, index) => {
                const color = getColor(enrollment.id);
                const fullName =
                  `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() ||
                  "No Name";
                return (
                  <div
                    key={enrollment.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                    onClick={() => {
                      setSelectedEnrollment(enrollment);
                      setShowViewModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: color }}
                      >
                        {getInitials(
                          enrollment.first_name,
                          enrollment.last_name,
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {fullName}
                        </p>
                        <a
                          href={`mailto:${enrollment.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 mt-0.5 text-xs text-violet-600 font-medium truncate no-underline"
                        >
                          <Mail size={11} className="flex-shrink-0" />
                          {enrollment.email || "—"}
                        </a>
                      </div>
                      <span className="text-xs text-slate-300 font-semibold flex-shrink-0">
                        #{indexOfFirstItem + index + 1}
                      </span>
                    </div>

                    {/* Pills */}
                    <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
                      {/* Course */}
                      {enrollment.course_name && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full max-w-[180px] truncate shadow-sm shadow-violet-200">
                          <BookOpen size={9} className="flex-shrink-0" />
                          <span className="truncate">
                            {enrollment.course_name}
                          </span>
                        </span>
                      )}
                      {/* City */}
                      {enrollment.city && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-full">
                          <MapPin size={9} className="flex-shrink-0" />
                          {enrollment.city}
                        </span>
                      )}
                      {/* Phone */}
                      {enrollment.mobile && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 ml-auto">
                          <Phone size={11} />
                          {enrollment.mobile}
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    {enrollment.created_at && (
                      <div className="px-4 pb-3">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(enrollment.created_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    )}

                    {/* Action */}
                    <div className="border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnrollment(enrollment);
                          setShowViewModal(true);
                        }}
                        className="w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition"
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ══════════════════════════════
                DESKTOP TABLE  (sm+)
            ══════════════════════════════ */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-12">
                        <button
                          onClick={() => handleSort("display_id")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          # <SortIcon col="display_id" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("full_name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Learner <SortIcon col="full_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort("email")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Email <SortIcon col="email" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden lg:table-cell">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Phone
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden lg:table-cell">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          City
                        </span>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("course_name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Course <SortIcon col="course_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("created_at")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0"
                        >
                          Date <SortIcon col="created_at" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEnrollments.map((enrollment, index) => {
                      const color = getColor(enrollment.id);
                      const fullName =
                        `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() ||
                        "No Name";
                      return (
                        <tr
                          key={enrollment.id}
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedEnrollment(enrollment);
                            setShowViewModal(true);
                          }}
                        >
                          <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                            {indexOfFirstItem + index + 1}
                          </td>

                          {/* Learner — always visible, extra info inline on sm/md */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: color }}
                              >
                                {getInitials(
                                  enrollment.first_name,
                                  enrollment.last_name,
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-semibold text-slate-800 block truncate max-w-[140px] md:max-w-[160px]">
                                  {fullName}
                                </span>
                                {/* email inline on sm only */}
                                <a
                                  href={`mailto:${enrollment.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="md:hidden flex items-center gap-1 mt-0.5 text-xs text-violet-600 font-medium truncate max-w-[140px] no-underline"
                                >
                                  <Mail size={10} className="flex-shrink-0" />
                                  {enrollment.email || "—"}
                                </a>
                                {/* course inline on sm/md only */}
                                {enrollment.course_name && (
                                  <span className="lg:hidden mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 bg-violet-600 text-white text-xs font-medium rounded-full max-w-[140px] truncate shadow-sm shadow-violet-200">
                                    <BookOpen
                                      size={8}
                                      className="flex-shrink-0"
                                    />
                                    <span className="truncate">
                                      {enrollment.course_name}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email — md+ */}
                          <td className="px-4 py-4 hidden md:table-cell">
                            <a
                              href={`mailto:${enrollment.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-sm text-violet-600 font-medium hover:underline no-underline truncate max-w-[180px]"
                            >
                              <Mail size={13} className="flex-shrink-0" />
                              <span className="truncate">
                                {enrollment.email || "—"}
                              </span>
                            </a>
                          </td>

                          {/* Phone — lg+ */}
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {enrollment.mobile ? (
                              <a
                                href={`tel:${enrollment.mobile}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-sm text-slate-600 font-medium no-underline"
                              >
                                <Phone
                                  size={13}
                                  className="text-slate-400 flex-shrink-0"
                                />
                                {enrollment.mobile}
                              </a>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>

                          {/* City — lg+ */}
                          <td className="px-4 py-4 hidden lg:table-cell">
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
                          <td className="px-4 py-4">
                            {enrollment.course_name ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full max-w-[150px] truncate shadow-sm shadow-violet-200">
                                <BookOpen size={10} className="flex-shrink-0" />
                                <span className="truncate">
                                  {enrollment.course_name}
                                </span>
                              </span>
                            ) : (
                              <span className="text-sm text-slate-400">
                                Course #{enrollment.course_id}
                              </span>
                            )}
                          </td>
                          {/* Date */}
                          <td className="px-4 py-4">
                            {enrollment.created_at ? (
                              <span className="text-sm text-slate-600 flex items-center gap-1">
                                <Calendar
                                  size={13}
                                  className="text-slate-400"
                                />
                                {new Date(
                                  enrollment.created_at,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEnrollment(enrollment);
                                  setShowViewModal(true);
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
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

              {/* Pagination inside card */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-600">
                    {indexOfFirstItem + 1}–
                    {Math.min(
                      indexOfFirstItem + itemsPerPage,
                      filteredEnrollments.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredEnrollments.length}
                  </strong>{" "}
                  enrollments
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
                    filteredEnrollments.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {filteredEnrollments.length}
                </strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
      {showViewModal && selectedEnrollment && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="enr-animate relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Drag handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Close */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition z-10"
            >
              <X size={15} />
            </button>

            {/* Body */}
            <div className="px-5 sm:px-6 py-5 sm:py-6 overflow-y-auto flex-1">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ background: getColor(selectedEnrollment.id) }}
                >
                  {getInitials(
                    selectedEnrollment.first_name,
                    selectedEnrollment.last_name,
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {selectedEnrollment.first_name}{" "}
                    {selectedEnrollment.last_name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enrollment #{selectedEnrollment.display_id}
                  </p>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Mail size={11} className="text-violet-600" /> Email
                  </p>
                  <a
                    href={`mailto:${selectedEnrollment.email}`}
                    className="text-sm font-semibold text-violet-600 hover:underline break-all no-underline"
                  >
                    {selectedEnrollment.email || "—"}
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Phone size={11} className="text-emerald-600" /> Phone
                  </p>
                  {selectedEnrollment.mobile ? (
                    <a
                      href={`tel:${selectedEnrollment.mobile}`}
                      className="text-sm font-semibold text-slate-800 no-underline"
                    >
                      {selectedEnrollment.mobile}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">
                      No phone provided
                    </span>
                  )}
                </div>
              </div>

              {/* City + Course */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
                {selectedEnrollment.city && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                      <MapPin size={11} className="text-violet-500" /> City
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedEnrollment.city}
                    </p>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen size={11} className="text-amber-500" /> Course
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedEnrollment.course_name ||
                      `Course #${selectedEnrollment.course_id}`}
                  </p>
                </div>
              </div>

              {/* Enrolled On */}
              {selectedEnrollment.created_at && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar size={11} className="text-violet-600" /> Enrolled
                    On
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(selectedEnrollment.created_at).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedEnrollment.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition no-underline"
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

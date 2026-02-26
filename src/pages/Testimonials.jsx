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
  Star,
  User,
  Calendar,
  ChevronDown,
  MessageSquare,
  Filter,
  RefreshCw,
  SortAsc,
  SortDesc,
  Eye,
} from "lucide-react";

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
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/testimonials/",
      );
      if (response.ok) {
        const testimonialsData = await response.json();
        const actualTestimonials = testimonialsData.data || testimonialsData;
        const testimonialsList = Array.isArray(actualTestimonials)
          ? actualTestimonials
          : [];
        const testimonialsWithDisplayIds = testimonialsList.map(
          (testimonial, index) => ({
            ...testimonial,
            display_id: index + 1,
          }),
        );
        setTestimonials(testimonialsWithDisplayIds);
        setFilteredTestimonials(testimonialsWithDisplayIds);
      } else {
        setError("Failed to fetch testimonials data.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    let result = [...testimonials];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (testimonial) =>
          (testimonial.name && testimonial.name.toLowerCase().includes(q)) ||
          (testimonial.review &&
            testimonial.review.toLowerCase().includes(q)) ||
          testimonial.display_id.toString().includes(q),
      );
    }

    if (filters.rating !== "all") {
      result = result.filter(
        (testimonial) => testimonial.rating === parseInt(filters.rating),
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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-500" />
    ) : (
      <SortDesc size={13} className="text-violet-500" />
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ rating: "all" });
    setSortConfig({ key: "id", direction: "desc" });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

  const handleDeleteClick = (e, testimonial) => {
    e.stopPropagation();
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
        { method: "DELETE" },
      );
      if (response.ok || response.status === 204) {
        setDeleteSuccess("Testimonial deleted successfully!");
        fetchTestimonials();
        setTimeout(() => {
          setShowDeleteModal(false);
          setTestimonialToDelete(null);
          setDeleteSuccess("");
        }, 1500);
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
    if (rating >= 4)
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (rating >= 3)
      return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-red-50 text-red-700 border border-red-200";
  };

  const activeFiltersCount = [
    filters.rating !== "all",
    sortConfig.key !== "id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  const StarRating = ({ rating, size = 13 }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
          }
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-medium">
            Loading testimonials…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Something went wrong
          </h3>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {testimonials.length}
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Manage your customer testimonials and reviews
          </p>
        </div>

        {/* ── Stats Cards (similar to Blogs but with testimonials data) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Total Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Total Reviews
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {testimonials.length}
            </p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Average Rating
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-slate-900">
                {testimonials.length
                  ? (
                      testimonials.reduce((acc, t) => acc + t.rating, 0) /
                      testimonials.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
              <Star
                rating={4}
                size={16}
                className="text-amber-400 fill-amber-400"
              />
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${(testimonials.reduce((acc, t) => acc + t.rating, 0) / (testimonials.length * 5)) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          {/* 5-Star Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              5-Star Reviews
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {testimonials.filter((t) => t.rating === 5).length}
            </p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${(testimonials.filter((t) => t.rating === 5).length / testimonials.length) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          {/* Filtered Results */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Filtered Results
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {filteredTestimonials.length}
            </p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${(filteredTestimonials.length / testimonials.length) * 100 || 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name or review…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
              title="Reset filters"
            >
              <RefreshCw size={15} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Add Testimonial */}
            <button
              onClick={() => navigate("/add-testimonial")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium whitespace-nowrap shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ rating: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Items Per Page
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
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

        {/* ── Table / Empty state ── */}
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No testimonials found
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              {searchTerm || filters.rating !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first testimonial."}
            </p>
            <button
              onClick={() => navigate("/add-testimonial")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium"
            >
              <Plus size={15} /> Add Testimonial
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-14"
                      onClick={() => handleSort("display_id")}
                    >
                      <span className="flex items-center gap-1">
                        # {getSortIcon("display_id")}
                      </span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Reviewer
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("rating")}
                    >
                      <span className="flex items-center gap-1">
                        Rating {getSortIcon("rating")}
                      </span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                      Review
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 hidden md:table-cell"
                      onClick={() => handleSort("created_at")}
                    >
                      <span className="flex items-center gap-1">
                        Date {getSortIcon("created_at")}
                      </span>
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTestimonials.map((testimonial, index) => (
                    <tr
                      key={testimonial.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setShowViewModal(true);
                      }}
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Reviewer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-violet-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0">
                            {testimonial.image &&
                            !testimonial.image.includes("default") ? (
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <User size={16} className="text-violet-600" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-800 block">
                              {testimonial.name}
                            </span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              ID: {testimonial.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <StarRating rating={testimonial.rating} />
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full w-fit ${getRatingColor(testimonial.rating)}`}
                          >
                            {testimonial.rating}/5
                          </span>
                        </div>
                      </td>

                      {/* Review */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-400 line-clamp-1 max-w-[250px] block">
                          {testimonial.review || (
                            <span className="italic">No review text</span>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {testimonial.created_at ? (
                          <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar
                              size={13}
                              className="text-slate-400 flex-shrink-0"
                            />
                            {formatDate(testimonial.created_at)}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTestimonial(testimonial);
                              setShowViewModal(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-testimonial/${testimonial.id}`, {
                                state: { testimonial },
                              });
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, testimonial)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <span className="text-slate-700 font-semibold">
                  {indexOfFirstItem + 1}–
                  {Math.min(indexOfLastItem, filteredTestimonials.length)}
                </span>{" "}
                of{" "}
                <span className="text-slate-700 font-semibold">
                  {filteredTestimonials.length}
                </span>{" "}
                testimonials
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
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
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-violet-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Testimonial Modal ── */}
      {showViewModal && selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10"
            >
              <X size={16} />
            </button>

            {/* Reviewer header with avatar */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0">
                  {selectedTestimonial.image &&
                  !selectedTestimonial.image.includes("default") ? (
                    <img
                      src={selectedTestimonial.image}
                      alt={selectedTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={28} className="text-violet-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedTestimonial.name}
                      </h2>
                      <p className="text-sm text-slate-400 mt-0.5">
                        Testimonial #{selectedTestimonial.display_id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getRatingColor(selectedTestimonial.rating)}`}
                    >
                      {selectedTestimonial.rating}/5 Stars
                    </span>
                  </div>
                  <div className="mt-2">
                    <StarRating rating={selectedTestimonial.rating} size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Date */}
              {selectedTestimonial.created_at && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar size={11} className="text-violet-500" /> Submitted
                    On
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(
                      selectedTestimonial.created_at,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Review Content */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Review
                </p>
                <div className="max-h-60 overflow-y-auto">
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedTestimonial.review ||
                      "No review content available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/edit-testimonial/${selectedTestimonial.id}`, {
                    state: { testimonial: selectedTestimonial },
                  });
                }}
                className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
              >
                <Edit size={14} /> Edit Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && testimonialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
            <button
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Delete Testimonial
                </h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete the testimonial from{" "}
                  <span className="font-semibold text-slate-700">
                    "{testimonialToDelete.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle
                  size={15}
                  className="text-emerald-600 flex-shrink-0"
                />
                <p className="text-sm text-emerald-700">{deleteSuccess}</p>
              </div>
            )}
            {deleteError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

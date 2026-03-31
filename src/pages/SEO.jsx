import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Toasts from "../pages/Toasts";

// ✅ Use the correct API base URL
const BASE_URL = "https://codingcloud.pythonanywhere.com";

// ✅ Fetch all SEO entries – handles both array and {data: [...]} responses
const fetchSeoData = async () => {
  const response = await fetch(`${BASE_URL}/page-seo/`);
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to fetch SEO data`);
  const json = await response.json();
  // API might return an array directly or an object with a 'data' property
  return Array.isArray(json) ? json : json.data || [];
};

export default function SEO() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // React Query – fetch SEO data
  const {
    data: seoData = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["seo"],
    queryFn: fetchSeoData,
    staleTime: 60000, // 1 minute
  });

  // ✅ Delete mutation with correct endpoint
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/page-seo/${id}/`, {
        method: "DELETE",
      });
      // 204 No Content is success, also 200/202 are acceptable
      if (!response.ok && response.status !== 204) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo"] });
      setToast({
        show: true,
        message: "SEO entry deleted successfully!",
        type: "success",
      });
      setShowDeleteModal(false);
      setSeoToDelete(null);
    },
    onError: (err) => {
      setDeleteError(err.message);
    },
    onSettled: () => {
      setDeleteLoading(false);
    },
  });

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [seoToDelete, setSeoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Filtering & sorting
  const filteredSeo = (() => {
    let result = [...seoData];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.page_name?.toLowerCase().includes(term) ||
          item.meta_title?.toLowerCase().includes(term) ||
          item.meta_keywords?.toLowerCase().includes(term) ||
          item.id?.toString().includes(term),
      );
    }
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      // Handle null/undefined
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  })();

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSeo.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedSeo = filteredSeo.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );

  // Reset page when filters change
  const prevSearch = useRef(searchTerm);
  const prevSort = useRef(sortConfig);
  const prevIpp = useRef(itemsPerPage);
  useEffect(() => {
    if (
      prevSearch.current !== searchTerm ||
      prevSort.current !== sortConfig ||
      prevIpp.current !== itemsPerPage
    ) {
      setCurrentPage(1);
      prevSearch.current = searchTerm;
      prevSort.current = sortConfig;
      prevIpp.current = itemsPerPage;
    }
  }, [searchTerm, sortConfig, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig((c) => ({
      key,
      direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col)
      return <SortAsc size={13} className="text-slate-300" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-600" />
    ) : (
      <SortDesc size={13} className="text-violet-600" />
    );
  };

  const handleDeleteClick = (seo) => {
    setSeoToDelete(seo);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = () => {
    if (!seoToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    deleteMutation.mutate(seoToDelete.id);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">
            Loading SEO data…
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (queryError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Failed to load SEO data
          </h3>
          <p className="text-sm text-slate-400 mb-5">{queryError.message}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .seo-animate { animation: fadeSlideIn 0.22s ease forwards; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="w-full">
        {/* Page Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <FileText size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
              SEO Management
            </h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {seoData.length}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile: Search full width */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by page name, title, keywords…"
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

          {/* Mobile: per-page and add button */}
          <div className="flex items-center justify-between gap-2 sm:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500 transition"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button
              onClick={() => navigate("/add-seo")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition"
            >
              <Plus size={15} />
              Add SEO
            </button>
          </div>

          {/* Desktop: search, per-page, add button in one row */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by page name, title, keywords…"
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
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                per page
              </span>
            </div>
            <button
              onClick={() => navigate("/add-seo")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap flex-shrink-0"
            >
              <Plus size={15} />
              Add SEO
            </button>
          </div>
        </div>

        <div className="h-5" />

        {/* Empty State */}
        {filteredSeo.length === 0 ? (
          <div className="seo-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              No SEO entries found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm
                ? "Try a different search term."
                : "Get started by adding your first SEO entry."}
            </p>
            <button
              onClick={() => navigate("/add-seo")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add SEO
            </button>
          </div>
        ) : (
          <div className="seo-animate">
            {/* Mobile Card View */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedSeo.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-start gap-3 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {item.page_name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Title:</span>{" "}
                      {item.meta_title?.length > 50
                        ? `${item.meta_title.substring(0, 50)}...`
                        : item.meta_title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-600">
                        Keywords:
                      </span>{" "}
                      {item.meta_keywords?.length > 40
                        ? `${item.meta_keywords.substring(0, 40)}...`
                        : item.meta_keywords || "—"}
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-1">
                      #{indexOfFirstItem + index + 1}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/edit-seo/${item.id}`, {
                          state: { seo: item },
                        })
                      }
                      className="p-2.5 rounded-xl text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition active:scale-95"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition active:scale-95"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-12">
                        <button
                          onClick={() => handleSort("id")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          # <SortIcon col="id" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("page_name")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          Page Name <SortIcon col="page_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("meta_title")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          Meta Title <SortIcon col="meta_title" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort("meta_keywords")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer p-0 font-sans"
                        >
                          Keywords <SortIcon col="meta_keywords" />
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
                    {paginatedSeo.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-300">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-slate-800">
                            {item.page_name}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-600">
                            {item.meta_title?.length > 60
                              ? `${item.meta_title.substring(0, 60)}...`
                              : item.meta_title}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-sm text-slate-500">
                            {item.meta_keywords?.length > 50
                              ? `${item.meta_keywords.substring(0, 50)}...`
                              : item.meta_keywords || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate(`/edit-seo/${item.id}`, {
                                  state: { seo: item },
                                })
                              }
                              className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
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

              {/* Pagination inside table card */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-600">
                    {indexOfFirstItem + 1}–
                    {Math.min(
                      indexOfFirstItem + itemsPerPage,
                      filteredSeo.length,
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-600">
                    {filteredSeo.length}
                  </strong>{" "}
                  entries
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
                      className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${
                        safePage === page
                          ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                      }`}
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

            {/* Pagination below mobile cards */}
            <div className="sm:hidden mt-4 flex flex-col items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <strong className="text-slate-600">
                  {indexOfFirstItem + 1}–
                  {Math.min(
                    indexOfFirstItem + itemsPerPage,
                    filteredSeo.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">{filteredSeo.length}</strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${
                      safePage === page
                        ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
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
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && seoToDelete && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() =>
              !deleteMutation.isPending && setShowDeleteModal(false)
            }
          />
          <div className="seo-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
            <button
              onClick={() =>
                !deleteMutation.isPending && setShowDeleteModal(false)
              }
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={15} />
            </button>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  Delete SEO Entry
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800">
                    "{seoToDelete.page_name}"
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
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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

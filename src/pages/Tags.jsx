import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Hash,
  Tag,
  Search,
  X,
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
import axios from "axios";
import Toasts from "./Toasts";

const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

// Fetch all tags
const fetchTags = async () => {
  const response = await axios.get(`${BASE_URL}/tags/`);
  // Assuming the API returns an array directly or { data: [...] }
  return response.data.data || response.data;
};

export default function Tags() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tags = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE_URL}/tags/${id}/`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["tags"] });
      const previousTags = queryClient.getQueryData(["tags"]);
      queryClient.setQueryData(["tags"], (old = []) =>
        old.filter((t) => t.id !== deletedId)
      );
      return { previousTags };
    },
    onError: (err, _, context) => {
      if (context?.previousTags)
        queryClient.setQueryData(["tags"], context.previousTags);
      setDeleteError(err.message);
      setToastError(err.message);
      setTimeout(() => setToastError(""), 3000);
    },
    onSuccess: () => {
      setToast({
        show: true,
        message: "Tag deleted successfully!",
        type: "error", // error type for delete? Actually success, but Courses used "error" for delete? We'll use "success"
      });
    },
    onSettled: () => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setTagToDelete(null);
    },
  });

  // State for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toastError, setToastError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Filter and sort
  const filteredTags = useMemo(() => {
    let result = [...tags];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((t) => t.tag_line?.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === "id") {
        aVal = a.id;
        bVal = b.id;
      } else {
        aVal = a.tag_line?.toLowerCase() || "";
        bVal = b.tag_line?.toLowerCase() || "";
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [tags, searchTerm, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredTags.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedTags = filteredTags.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  // Reset page when filters change
  const prevDeps = useRef({ searchTerm, sortConfig, itemsPerPage });
  useEffect(() => {
    const p = prevDeps.current;
    if (
      p.searchTerm !== searchTerm ||
      p.sortConfig !== sortConfig ||
      p.itemsPerPage !== itemsPerPage
    ) {
      setCurrentPage(1);
      prevDeps.current = { searchTerm, sortConfig, itemsPerPage };
    }
  }, [searchTerm, sortConfig, itemsPerPage]);

  const handleSort = (key) =>
    setSortConfig((c) => ({
      key,
      direction: c.key === key && c.direction === "asc" ? "desc" : "asc",
    }));

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <SortAsc size={13} className="text-slate-300" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={13} className="text-violet-600" />
    ) : (
      <SortDesc size={13} className="text-violet-600" />
    );
  };

  const handleDeleteClick = (e, tag) => {
    e.stopPropagation();
    setTagToDelete(tag);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = () => {
    if (!tagToDelete) return;
    setDeleteLoading(true);
    deleteMutation.mutate(tagToDelete.id);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-violet-100 border-t-violet-600 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">Loading tags…</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Something went wrong</h3>
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

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .tag-animate { animation: fadeSlideIn 0.22s ease forwards; }
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
          <button onClick={() => setToastError("")} className="text-slate-400">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <Hash size={16} className="text-white" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Tags</h1>
            <span className="px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              {tags.length}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-3 py-3 sm:px-4 sm:py-3.5">
          {/* Mobile search */}
          <div className="relative w-full mb-2.5 sm:hidden">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search tags…"
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
                className="px-2.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => navigate("/add-tag")}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition"
            >
              <Plus size={14} /> Add Tag
            </button>
          </div>

          {/* Desktop row */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Search by tag name…"
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
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 outline-none cursor-pointer font-medium focus:border-violet-500"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">per page</span>
            </div>
            <button
              onClick={() => navigate("/add-tag")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-200 hover:opacity-90 transition whitespace-nowrap"
            >
              <Plus size={15} /> Add Tag
            </button>
          </div>
        </div>

        <div className="h-5" />

        {/* Empty state */}
        {filteredTags.length === 0 ? (
          <div className="tag-animate bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={26} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">No tags found</h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm ? "Try adjusting your search term." : "Get started by adding your first tag."}
            </p>
            <button
              onClick={() => navigate("/add-tag")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              <Plus size={14} /> Add Tag
            </button>
          </div>
        ) : (
          <div className="tag-animate">
            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedTags.map((tag, idx) => (
                <div
                  key={tag.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                  onClick={() => {
                    setSelectedTag(tag);
                    setShowViewModal(true);
                  }}
                >
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug">
                          #{tag.id}
                        </p>
                        <p className="text-sm text-slate-600 mt-1 break-words">{tag.tag_line}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 flex">
                    {[
                      { label: "View", icon: Eye, cls: "text-slate-500 hover:bg-slate-50", fn: (e) => { e.stopPropagation(); setSelectedTag(tag); setShowViewModal(true); } },
                      { label: "Edit", icon: Edit, cls: "text-violet-600 hover:bg-violet-50", fn: (e) => { e.stopPropagation(); navigate(`/edit-tag/${tag.id}`); } },
                      { label: "Delete", icon: Trash2, cls: "text-red-500 hover:bg-red-50", fn: (e) => handleDeleteClick(e, tag) },
                    ].map(({ label, icon: Icon, cls, fn }, i, arr) => (
                      <span key={label} className="flex-1 flex">
                        <button onClick={fn} className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold transition ${cls}`}>
                          <Icon size={13} /> {label}
                        </button>
                        {i < arr.length - 1 && <div className="w-px bg-slate-100" />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                      <th className="px-4 py-3.5 text-left w-16">
                        <button
                          onClick={() => handleSort("id")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition"
                        >
                          ID <SortIcon col="id" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-left">
                        <button
                          onClick={() => handleSort("tag_line")}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition"
                        >
                          Tag Line <SortIcon col="tag_line" />
                        </button>
                      </th>
                      <th className="px-4 py-3.5 text-right w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTags.map((tag, idx) => (
                      <tr
                        key={tag.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedTag(tag);
                          setShowViewModal(true);
                        }}
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                          {tag.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700 break-words max-w-md">
                          {tag.tag_line}
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); setShowViewModal(true); }}
                              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/edit-tag/${tag.id}`); }}
                              className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, tag)}
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

              {/* Pagination */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs sm:text-sm text-slate-400 font-medium text-center sm:text-left">
                  Showing <strong className="text-slate-600">{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredTags.length)}</strong> of{" "}
                  <strong className="text-slate-600">{filteredTags.length}</strong> tags
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
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
                Showing <strong className="text-slate-600">{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredTags.length)}</strong> of{" "}
                <strong className="text-slate-600">{filteredTags.length}</strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30"
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition ${
                      safePage === page
                        ? "bg-violet-600 border-violet-600 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={safePage === totalPages}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 disabled:opacity-30"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedTag && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="tag-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden">
            <button onClick={() => setShowViewModal(false)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md">
              <X size={14} className="text-slate-500" />
            </button>
            <div className="w-10 h-1 bg-slate-300/60 rounded-full mx-auto mt-3 sm:hidden" />
            <div className="p-5 pt-7 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Hash size={18} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Tag ID</p>
                  <p className="text-sm font-bold text-slate-800">#{selectedTag.id}</p>
                </div>
              </div>
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Tag Line</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-sm text-slate-700 break-words">{selectedTag.tag_line}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    navigate(`/edit-tag/${selectedTag.id}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
                >
                  <Edit size={14} /> Edit Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && tagToDelete && (
        <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !deleteMutation.isPending && setShowDeleteModal(false)} />
          <div className="tag-animate relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 p-5 sm:p-7 pb-8 sm:pb-7">
            <button onClick={() => !deleteMutation.isPending && setShowDeleteModal(false)} className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
              <X size={15} />
            </button>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete Tag</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete tag <strong className="text-slate-800">“{tagToDelete.tag_line}”</strong>? This action cannot be undone.
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
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting…
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
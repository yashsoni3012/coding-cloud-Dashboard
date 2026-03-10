// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   X,
//   Image as ImageIcon,
//   FolderOpen,
//   Calendar,
//   FileText,
// } from "lucide-react";

// export default function Categories() {
//   const navigate = useNavigate();

//   // State for data
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI State
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal states
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState("");
//   const [deleteError, setDeleteError] = useState("");

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         "https://codingcloud.pythonanywhere.com/category/",
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(data);
//         setFilteredCategories(data);
//       } else {
//         setError("Failed to fetch categories.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Filter categories based on search
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = categories.filter(
//         (category) =>
//           category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (category.text &&
//             category.text.toLowerCase().includes(searchTerm.toLowerCase())),
//       );
//       setFilteredCategories(filtered);
//     } else {
//       setFilteredCategories(categories);
//     }
//   }, [searchTerm, categories]);

//   // Delete handlers
//   const handleDeleteClick = (category) => {
//     setCategoryToDelete(category);
//     setShowDeleteModal(true);
//     setDeleteError("");
//     setDeleteSuccess("");
//   };

//   const handleDeleteConfirm = async () => {
//     if (!categoryToDelete) return;

//     setDeleteLoading(true);
//     setDeleteError("");
//     setDeleteSuccess("");

//     try {
//       const response = await fetch(
//         `https://codingcloud.pythonanywhere.com/category/${categoryToDelete.id}/`,
//         {
//           method: "DELETE",
//         },
//       );

//       if (response.ok || response.status === 204) {
//         setDeleteSuccess("Category deleted successfully!");
//         fetchCategories(); // Refresh list
//         setTimeout(() => {
//           setShowDeleteModal(false);
//           setCategoryToDelete(null);
//           setDeleteSuccess("");
//         }, 1500);
//       } else {
//         try {
//           const data = await response.json();
//           setDeleteError(data.message || "Failed to delete category.");
//         } catch {
//           setDeleteError(`HTTP Error: ${response.status}`);
//         }
//       }
//     } catch (err) {
//       console.error("Error deleting category:", err);
//       setDeleteError("Network error. Please try again.");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleEdit = (categoryId) => {
//     navigate(`/edit-category/${categoryId}`);
//   };

//   const handleAddCategory = () => {
//     navigate("/add-category");
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="relative">
//           <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//           <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-base whitespace-nowrap">
//             Loading categories...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//             <X size={32} className="text-red-500" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Oops! Something went wrong
//           </h3>
//           <p className="text-gray-500 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             Categories
//           </h1>
//           <p className="text-gray-500 text-base mt-1">
//             Manage your {categories.length} categories
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleAddCategory}
//             className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
//           >
//             <Plus size={18} />
//             <span className="hidden sm:inline font-medium">Add Category</span>
//             <span className="sm:hidden font-medium">Add</span>
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
//         <div className="relative">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />
//           <input
//             type="text"
//             placeholder="Search categories..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <X size={16} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Categories List View */}
//       {filteredCategories.length === 0 ? (
//         <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
//           <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//             <FolderOpen size={32} className="text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             No categories found
//           </h3>
//           <p className="text-gray-500 mb-4">
//             Try adjusting your search or add a new category.
//           </p>
//           <button
//             onClick={handleAddCategory}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
//           >
//             <Plus size={16} />
//             Add Category
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//           {/* Table Header */}
//           <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-base font-semibold text-gray-600">
//             <div className="col-span-1">ID</div>
//             <div className="col-span-2">Image</div>
//             <div className="col-span-2">Name</div>
//             <div className="col-span-4">Description</div>
//             <div className="col-span-3 text-right">Actions</div>
//           </div>

//           {/* Table Rows */}
//           <div className="divide-y divide-gray-200">
//             {filteredCategories.map((category) => (
//               <div
//                 key={category.id}
//                 className="p-4 hover:bg-gray-50 transition-colors"
//               >
//                 {/* Mobile View */}
//                 <div className="md:hidden space-y-3">
//                   <div className="flex items-start gap-3">
//                     {/* Image */}
//                     <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                       {category.image ? (
//                         <img
//                           src={`https://codingcloud.pythonanywhere.com${category.image}`}
//                           alt={category.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src =
//                               "https://via.placeholder.com/400x300?text=No+Image";
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <ImageIcon size={24} className="text-gray-400" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             {category.name}
//                           </h3>
//                           <span className="text-xs text-gray-500">
//                             ID: {category.id}
//                           </span>
//                         </div>
//                       </div>
//                       <p className="text-base text-gray-600 mt-1 line-clamp-2">
//                         {category.text || "No description provided."}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
//                     <button
//                       onClick={() => handleEdit(category.id)}
//                       className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                       title="Edit Category"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteClick(category)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       title="Delete Category"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Desktop View */}
//                 <div className="hidden md:grid grid-cols-12 gap-4 items-center">
//                   <div className="col-span-1">
//                     <span className="text-base font-medium text-gray-900">
//                       {category.id}
//                     </span>
//                   </div>
//                   <div className="col-span-2">
//                     <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
//                       {category.image ? (
//                         <img
//                           src={`https://codingcloud.pythonanywhere.com${category.image}`}
//                           alt={category.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src =
//                               "https://via.placeholder.com/400x300?text=No+Image";
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <ImageIcon size={20} className="text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col-span-2">
//                     <span className="text-base font-medium text-gray-900">
//                       {category.name}
//                     </span>
//                   </div>
//                   <div className="col-span-4">
//                     <p className="text-base text-gray-600 line-clamp-2">
//                       {category.text || "No description provided."}
//                     </p>
//                   </div>
//                   <div className="col-span-3 flex items-center justify-end gap-2">
//                     <button
//                       onClick={() => handleEdit(category.id)}
//                       className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                       title="Edit Category"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteClick(category)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       title="Delete Category"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Footer with count */}
//           <div className="p-4 bg-gray-50 border-t border-gray-200 text-base text-gray-600">
//             Showing {filteredCategories.length} of {categories.length}{" "}
//             categories
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && categoryToDelete && (
//         <div
//           className="fixed inset-0 z-50 overflow-y-auto"
//           aria-labelledby="delete-modal-title"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div
//               className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
//               onClick={() => !deleteLoading && setShowDeleteModal(false)}
//               aria-hidden="true"
//             />

//             <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
//               <div className="p-6">
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
//                   <AlertCircle size={32} className="text-red-600" />
//                 </div>

//                 <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
//                   Delete Category
//                 </h3>

//                 <p className="text-base text-gray-500 text-center mb-6">
//                   Are you sure you want to delete{" "}
//                   <span className="font-semibold text-gray-900">
//                     "{categoryToDelete.name}"
//                   </span>
//                   ? This action cannot be undone.
//                 </p>

//                 {deleteSuccess && (
//                   <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//                     <CheckCircle size={16} className="text-green-600" />
//                     <p className="text-base text-green-600">{deleteSuccess}</p>
//                   </div>
//                 )}

//                 {deleteError && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//                     <AlertCircle
//                       size={16}
//                       className="text-red-600 mt-0.5 shrink-0"
//                     />
//                     <p className="text-base text-red-600">{deleteError}</p>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-2 gap-3 mt-2">
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     disabled={deleteLoading}
//                     className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleDeleteConfirm}
//                     disabled={deleteLoading}
//                     className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
//                   >
//                     {deleteLoading ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Deleting...
//                       </>
//                     ) : (
//                       "Delete Category"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Image as ImageIcon,
  FolderOpen,
  Link2,
  Tag,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Toasts from "../pages/Toasts";

export default function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://codingcloud.pythonanywhere.com/category/");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const json = await response.json();
      setCategories(json.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Derived — no state, no jerk on refresh
  const filteredCategories = (() => {
    let result = [...categories];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.id?.toString().includes(term) ||
          c.slug?.toLowerCase().includes(term)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  })();

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstItem = (safePage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

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
    if (sortConfig.key !== col) return <SortAsc size={13} style={{ color: "#cbd5e1" }} />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} style={{ color: "#7c3aed" }} />
      : <SortDesc size={13} style={{ color: "#7c3aed" }} />;
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/category/${categoryToDelete.id}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setToast({ show: true, message: "Category deleted successfully!", type: "error" });
        fetchCategories();
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      } else {
        const data = await response.json().catch(() => ({}));
        setDeleteError(data.message || `HTTP Error: ${response.status}`);
      }
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading categories…</p>
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
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
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

        .cat-animate { animation: fadeSlideIn 0.22s ease forwards; }

        .cat-row { transition: background 0.13s; }
        .cat-row:hover { background: #fafafa; }

        .cat-action-btn {
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.13s, color 0.13s;
          color: #94a3b8;
        }
        .cat-action-btn.edit:hover { background: #ede9fe; color: #7c3aed; }
        .cat-action-btn.del:hover  { background: #fef2f2; color: #ef4444; }

        .cat-th-btn {
          background: none; border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #94a3b8; padding: 0;
          transition: color 0.13s; font-family: inherit;
        }
        .cat-th-btn:hover { color: #475569; }

        .cat-page-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 14px; font-weight: 600; color: #64748b;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.13s; font-family: inherit;
        }
        .cat-page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .cat-page-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
        .cat-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .cat-search {
          width: 100%; padding: 11px 36px 11px 40px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; color: #1e293b;
          background: #f8fafc; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .cat-search:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
        .cat-search::placeholder { color: #cbd5e1; }

        .cat-select {
          padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 14px; color: #475569; background: #f8fafc;
          outline: none; cursor: pointer; font-family: inherit; font-weight: 500;
          transition: border-color 0.15s;
        }
        .cat-select:focus { border-color: #7c3aed; }

        .cat-add-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 3px 12px rgba(124,58,237,0.28);
          transition: opacity 0.15s; font-family: inherit;
          flex-shrink: 0;
        }
        .cat-add-btn:hover { opacity: 0.9; }
      `}</style>

      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div style={{ width: "100%", padding: "28px 16px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
              borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
            }}>
              <Tag size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Categories</h1>
            <span style={{ padding: "3px 11px", background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700, borderRadius: 99 }}>
              {categories.length}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, paddingLeft: 48 }}>
            Manage and organise your product categories
          </p>
        </div>

        {/* ── Toolbar ── */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "14px 18px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>

            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }} />
              <input
                className="cat-search"
                type="text"
                placeholder="Search by name, slug or ID…"
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

            {/* Items per page */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>Show</span>
              <select
                className="cat-select"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>per page</span>
            </div>

            {/* Add button */}
            <button className="cat-add-btn" onClick={() => navigate("/add-category")}>
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>

        {/* ── Gap between toolbar and table ── */}
        <div style={{ height: 20 }} />

        {/* ── Table / Empty ── */}
        {filteredCategories.length === 0 ? (
          <div className="cat-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 62, height: 62, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FolderOpen size={27} color="#cbd5e1" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>No categories found</h3>
            <p style={{ fontSize: 14.5, color: "#94a3b8", margin: "0 0 20px" }}>
              {searchTerm ? "Try a different search term." : "Get started by adding your first category."}
            </p>
            <button
              onClick={() => navigate("/add-category")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
            >
              <Plus size={15} /> Add Category
            </button>
          </div>
        ) : (
          <div className="cat-animate" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 580, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafafa" }}>
                    <th style={{ padding: "14px 18px", textAlign: "left", width: 56 }}>
                      <button className="cat-th-btn" onClick={() => handleSort("id")}># <SortIcon col="id" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left", width: 68 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Image</span>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="cat-th-btn" onClick={() => handleSort("name")}>Name <SortIcon col="name" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "left" }}>
                      <button className="cat-th-btn" onClick={() => handleSort("slug")}>Slug <SortIcon col="slug" /></button>
                    </th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category, index) => (
                    <tr key={category.id} className="cat-row" style={{ borderBottom: "1px solid #f1f5f9" }}>

                      {/* Serial */}
                      <td style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Image */}
                      <td style={{ padding: "15px 18px" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 11, overflow: "hidden", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {category.image ? (
                            <img
                              src={`https://codingcloud.pythonanywhere.com${category.image}`}
                              alt={category.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              loading="lazy"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=?"; }}
                            />
                          ) : (
                            <ImageIcon size={16} color="#cbd5e1" />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td style={{ padding: "15px 18px" }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{category.name}</span>
                      </td>

                      {/* Slug */}
                      <td style={{ padding: "15px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Link2 size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: "#64748b", fontFamily: "monospace" }}>
                            {category.slug ? `/${category.slug}` : <span style={{ color: "#cbd5e1" }}>No slug</span>}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "15px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                          <button
                            className="cat-action-btn edit"
                            onClick={() => navigate(`/edit-category/${category.id}`, { state: { category } })}
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="cat-action-btn del"
                            onClick={() => handleDeleteClick(category)}
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

            {/* ── Pagination ── */}
            <div style={{ padding: "13px 18px", background: "#fafafa", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>
                Showing{" "}
                <strong style={{ color: "#475569" }}>{indexOfFirstItem + 1}–{Math.min(indexOfFirstItem + itemsPerPage, filteredCategories.length)}</strong>
                {" "}of{" "}
                <strong style={{ color: "#475569" }}>{filteredCategories.length}</strong> categories
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <button className="cat-page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1} aria-label="Previous">
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page) => (
                  <button key={page} className={`cat-page-btn${safePage === page ? " active" : ""}`} onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                ))}
                <button className="cat-page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages} aria-label="Next">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {showDeleteModal && categoryToDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="cat-animate" style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 420, width: "100%", padding: 26, zIndex: 10 }}>
            <button
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6, borderRadius: 8, display: "flex" }}
            >
              <X size={15} />
            </button>

            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 46, height: 46, background: "#fef2f2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertCircle size={22} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 7px" }}>Delete Category</h3>
                <p style={{ fontSize: 14.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                  Are you sure you want to delete{" "}
                  <strong style={{ color: "#1e293b" }}>"{categoryToDelete.name}"</strong>?
                  {" "}This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={14} color="#ef4444" />
                <p style={{ fontSize: 13.5, color: "#dc2626", margin: 0 }}>{deleteError}</p>
              </div>
            )}

            <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                style={{ padding: "10px 20px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{ padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: deleteLoading ? 0.7 : 1, fontFamily: "inherit" }}
              >
                {deleteLoading ? (
                  <>
                    <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Deleting…
                  </>
                ) : (
                  <><Trash2 size={14} /> Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

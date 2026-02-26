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
//           <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
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
//           <p className="text-gray-500 text-sm mt-1">
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
//           <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
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
//                       <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
//                     <span className="text-sm font-medium text-gray-900">
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
//                     <span className="text-sm font-medium text-gray-900">
//                       {category.name}
//                     </span>
//                   </div>
//                   <div className="col-span-4">
//                     <p className="text-sm text-gray-600 line-clamp-2">
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
//           <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
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

//                 <p className="text-sm text-gray-500 text-center mb-6">
//                   Are you sure you want to delete{" "}
//                   <span className="font-semibold text-gray-900">
//                     "{categoryToDelete.name}"
//                   </span>
//                   ? This action cannot be undone.
//                 </p>

//                 {deleteSuccess && (
//                   <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//                     <CheckCircle size={16} className="text-green-600" />
//                     <p className="text-sm text-green-600">{deleteSuccess}</p>
//                   </div>
//                 )}

//                 {deleteError && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//                     <AlertCircle
//                       size={16}
//                       className="text-red-600 mt-0.5 shrink-0"
//                     />
//                     <p className="text-sm text-red-600">{deleteError}</p>
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
  Image as ImageIcon,
  FolderOpen,
  Filter,
  ChevronDown,
  RefreshCw,
  SortAsc,
  SortDesc,
  Tag,
} from "lucide-react";

export default function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [filters, setFilters] = useState({ hasImage: "all", dateRange: "all" });
  const [showFilters, setShowFilters] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

const fetchCategories = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      "https://codingcloud.pythonanywhere.com/category/"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const json = await response.json();

    // ✅ FIX HERE
    const categoryArray = json.data || [];

    const dataWithDates = categoryArray.map((item) => ({
      ...item,
      created_at:
        item.created_at ||
        new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
    }));

    setCategories(dataWithDates);
    setFilteredCategories(dataWithDates);

    setError(null);
  } catch (err) {
    console.error("Fetch Error:", err);
    setError("Failed to load categories");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    let result = [...categories];
    if (searchTerm) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.text && c.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.id.toString().includes(searchTerm)
      );
    }
    if (filters.hasImage !== "all") {
      result = result.filter((c) => filters.hasImage === "yes" ? !!c.image : !c.image);
    }
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
      const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
      result = result.filter((c) => {
        const d = new Date(c.created_at);
        if (filters.dateRange === "today") return d >= today;
        if (filters.dateRange === "week") return d >= weekAgo;
        if (filters.dateRange === "month") return d >= monthAgo;
        return true;
      });
    }
    result.sort((a, b) => {
      let aVal = sortConfig.key === "created_at" ? new Date(a[sortConfig.key]) : a[sortConfig.key];
      let bVal = sortConfig.key === "created_at" ? new Date(b[sortConfig.key]) : b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCategories(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, categories]);

  const handleSort = (key) => {
    setSortConfig((c) => ({ key, direction: c.key === key && c.direction === "asc" ? "desc" : "asc" }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} className="text-violet-500" />
      : <SortDesc size={13} className="text-violet-500" />;
  };

 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/category/${categoryToDelete.id}/`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setDeleteSuccess("Category deleted successfully!");
        fetchCategories();
        setTimeout(() => { setShowDeleteModal(false); setCategoryToDelete(null); setDeleteSuccess(""); }, 1500);
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete category.");
        } catch { setDeleteError(`HTTP Error: ${response.status}`); }
      }
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm font-medium">Loading categories…</p>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeFiltersCount = [
    filters.hasImage !== "all",
    filters.dateRange !== "all",
    sortConfig.key !== "id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {categories.length}
            </span>
          </div>
          <p className="text-slate-500 text-sm">Manage and organise your product categories</p>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, description or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
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
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

           

            {/* Add Category */}
            <button
              onClick={() => navigate("/add-category")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium whitespace-nowrap shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Image</label>
                <select
                  value={filters.hasImage}
                  onChange={(e) => setFilters({ ...filters, hasImage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Categories</option>
                  <option value="yes">With Image</option>
                  <option value="no">Without Image</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Date Added</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Items Per Page</label>
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
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FolderOpen size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No categories found</h3>
            <p className="text-slate-400 text-sm mb-5">
              {searchTerm || filters.hasImage !== "all" || filters.dateRange !== "all"
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first category."}
            </p>
            <button
              onClick={() => navigate("/add-category")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm font-medium"
            >
              <Plus size={15} />
              Add Category
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-16"
                      onClick={() => handleSort("id")}
                    >
                      <span className="flex items-center gap-1"># {getSortIcon("id")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">
                      Image
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("name")}
                    >
                      <span className="flex items-center gap-1">Name {getSortIcon("name")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                      Description
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Serial number */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Image */}
                      <td className="px-5 py-4">
                        <div className="w-11 h-11 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0">
                          {category.image ? (
                            <img
                              src={`https://codingcloud.pythonanywhere.com${category.image}`}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80?text=?";
                              }}
                            />
                          ) : (
                            <ImageIcon size={16} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-slate-800">{category.name}</span>
                          {/* Show description here on small screens */}
                          <span className="text-xs text-slate-400 md:hidden line-clamp-1">
                            {category.text || "No description"}
                          </span>
                        </div>
                      </td>

                      {/* Description (hidden on small) */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500 line-clamp-1 max-w-xs block">
                          {category.text || (
                            <span className="italic text-slate-300">No description provided</span>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/edit-category/${category.id}`)}
                            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
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
                Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredCategories.length)}</span> of <span className="text-slate-700 font-semibold">{filteredCategories.length}</span> categories
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
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

      {/* ── Delete Modal ── */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
            {/* Close button */}
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
                <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Category</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete <span className="font-semibold text-slate-700">"{categoryToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
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
                    <Trash2 size={14} />
                    Delete
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

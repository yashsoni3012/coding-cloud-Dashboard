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
  ChevronUp,
  RefreshCw,
  SortAsc,
  SortDesc,
  Clock,
} from "lucide-react";

export default function Categories() {
  const navigate = useNavigate();

  // State for data
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    hasImage: "all", // 'all', 'yes', 'no'
    dateRange: "all", // 'all', 'today', 'week', 'month'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/category/",
      );
      if (response.ok) {
        const data = await response.json();
        // Add a dummy date for demo purposes (since API might not have dates)
        const dataWithDates = data.map((item, index) => ({
          ...item,
          created_at: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }));
        setCategories(dataWithDates);
        setFilteredCategories(dataWithDates);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter and sort categories
  useEffect(() => {
    let result = [...categories];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.text &&
            category.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
          category.id.toString().includes(searchTerm),
      );
    }

    // Apply image filter
    if (filters.hasImage !== "all") {
      result = result.filter((category) =>
        filters.hasImage === "yes" ? !!category.image : !category.image,
      );
    }

    // Apply date filter (using dummy dates)
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

      result = result.filter((category) => {
        const categoryDate = new Date(category.created_at);
        switch (filters.dateRange) {
          case "today":
            return categoryDate >= today;
          case "week":
            return categoryDate >= weekAgo;
          case "month":
            return categoryDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "created_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredCategories(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, categories]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <SortAsc size={14} className="text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={14} className="text-indigo-600" />
    ) : (
      <SortDesc size={14} className="text-indigo-600" />
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      hasImage: "all",
      dateRange: "all",
    });
    setSortConfig({ key: "id", direction: "desc" });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Delete handlers
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
        {
          method: "DELETE",
        },
      );

      if (response.ok || response.status === 204) {
        setDeleteSuccess("Category deleted successfully!");
        fetchCategories(); // Refresh list
        setTimeout(() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
          setDeleteSuccess("");
        }, 1500);
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete category.");
        } catch {
          setDeleteError(`HTTP Error: ${response.status}`);
        }
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/edit-category/${categoryId}`);
  };

  const handleAddCategory = () => {
    navigate("/add-category");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <X size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Categories
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and organize your categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
              {showFilters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Filter
                </label>
                <select
                  value={filters.hasImage}
                  onChange={(e) =>
                    setFilters({ ...filters, hasImage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="yes">With Image</option>
                  <option value="no">Without Image</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Added
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items Per Page
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Categories Table */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FolderOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ||
              filters.hasImage !== "all" ||
              filters.dateRange !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first category"}
            </p>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center gap-1">
                          ID {getSortIcon("id")}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Name {getSortIcon("name")}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedCategories.map((category, index) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                            {category.image ? (
                              <img
                                src={`https://codingcloud.pythonanywhere.com${category.image}`}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/400x300?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon
                                  size={16}
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {category.text || "No description provided"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(category.id)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Category"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
                  {filteredCategories.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              aria-hidden="true"
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Category
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{categoryToDelete.name}
                        "? This action cannot be undone.
                      </p>
                    </div>
                    {deleteSuccess && (
                      <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <p className="text-sm text-green-600">
                          {deleteSuccess}
                        </p>
                      </div>
                    )}
                    {deleteError && (
                      <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                        <AlertCircle
                          size={16}
                          className="text-red-600 mt-0.5"
                        />
                        <p className="text-sm text-red-600">{deleteError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

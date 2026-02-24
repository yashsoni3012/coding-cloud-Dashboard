import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  Filter,
  X,
  Grid,
  List,
  SlidersHorizontal,
  Plus,
  FolderOpen,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Hash,
  BookMarked,
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
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
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

  // Fetch modules
  const fetchModules = async () => {
    try {
      setLoading(true);
      const [modulesRes, coursesRes] = await Promise.all([
        fetch("https://codingcloud.pythonanywhere.com/modules/"),
        fetch("https://codingcloud.pythonanywhere.com/course/")
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
          actualCourses.forEach(course => {
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

    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/modules/${moduleToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok || response.status === 204) {
        setDeleteSuccess("Module deleted successfully!");
        await fetchModules(); // Refresh the list
        setTimeout(() => {
          setShowDeleteModal(false);
          setModuleToDelete(null);
          setDeleteSuccess("");
        }, 1500);
      } else {
        const data = await response.json();
        setDeleteError(data.message || "Failed to delete module");
      }
    } catch (err) {
      console.error("Error deleting module:", err);
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (e, moduleId) => {
    e.stopPropagation();
    navigate(`/edit-module/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading modules...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <X size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Module Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Modules</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredModules.length} of {modules.length} modules •{" "}
            {uniqueCourses.length} courses
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats Card */}
          <div className="hidden sm:block bg-white rounded-lg border border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-500">Total Modules</p>
            <p className="text-lg font-semibold text-gray-900">
              {modules.length}
            </p>
          </div>
          <button
            onClick={() => navigate("/add-module")}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline font-medium">Add Module</span>
            <span className="sm:hidden font-medium">Add</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search modules by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

            {/* View Toggle & Filter Button */}
            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filter</span>
                {selectedCourse !== "all" && (
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Course Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Filter by Course ID
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Courses</option>
                    {uniqueCourses.map((courseId) => (
                      <option key={courseId} value={courseId}>
                        {coursesMap[courseId] || `Course ID: ${courseId}`} (
                        {
                          modules.filter((m) => m.course_data === courseId)
                            .length
                        }{" "}
                        modules)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters & Reset */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedCourse !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Course: {coursesMap[selectedCourse] || selectedCourse}
                      <button onClick={() => setSelectedCourse("all")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredModules.length}
          </span>{" "}
          results
        </p>
      </div>

      {/* Modules Grid/List View */}
      {filteredModules.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No modules found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredModules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => openModuleModal(module)}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="p-5">
                    {/* Header with ID */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Hash size={16} className="text-indigo-600" />
                        </div>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          ID: {module.id}
                        </span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-center">
                        {coursesMap[module.course_data] || `Course ${module.course_data}`}
                      </span>
                    </div>

                    {/* Module Name */}
                    <h3 className="font-semibold text-gray-900 text-base mb-4 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors">
                      {module.name}
                    </h3>

                    {/* Action Buttons - REPLACED ICONS WITH BUTTONS */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModuleModal(module);
                        }}
                        className="px-2 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => handleEdit(e, module.id)}
                        className="px-2 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, module)}
                        className="px-2 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {filteredModules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => openModuleModal(module)}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookMarked size={16} className="text-indigo-600" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">
                              ID: {module.id}
                            </span>
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                              {coursesMap[module.course_data] || `Course ${module.course_data}`}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {module.name}
                        </h3>
                      </div>

                      {/* Action Buttons - REPLACED ICONS WITH BUTTONS */}
                      <div className="flex items-center gap-2 sm:pl-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModuleModal(module);
                          }}
                          className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleEdit(e, module.id)}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, module)}
                          className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          Delete
                        </button>
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-indigo-600 transition-colors ml-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Module Details Modal */}
      {showModal && selectedModule && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={closeModuleModal}
              aria-hidden="true"
            />

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="relative">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
                  <button
                    onClick={closeModuleModal}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <BookOpen size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {selectedModule.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                          ID: {selectedModule.id}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                          Course: {coursesMap[selectedModule.course_data] || selectedModule.course_data}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Module Details
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Module Name</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {selectedModule.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Course Name</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {coursesMap[selectedModule.course_data] || selectedModule.course_data}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={(e) => {
                        closeModuleModal();
                        handleEdit(e, selectedModule.id);
                      }}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit Module
                    </button>
                    <button
                      onClick={closeModuleModal}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && moduleToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="delete-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              aria-hidden="true"
            />

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="p-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle size={32} className="text-red-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Module
                </h3>

                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    "{moduleToDelete.name}"
                  </span>
                  ? This action cannot be undone.
                </p>

                {deleteSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="text-sm text-green-600">{deleteSuccess}</p>
                  </div>
                )}

                {deleteError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <X size={16} className="text-red-600" />
                    <p className="text-sm text-red-600">{deleteError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading || deleteSuccess}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
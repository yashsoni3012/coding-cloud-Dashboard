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
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  BookMarked,
  Layers,
  ChevronDown,
  ChevronUp,
  Globe,
  Code,
  Smartphone,
  Database,
  Cloud,
  Palette,
  Terminal,
} from "lucide-react";

export default function Topics() {
  const navigate = useNavigate();

  // State for courses and topics data
  const [courses, setCourses] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [uniqueModules, setUniqueModules] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  // Modal states
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Fetch courses and topics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch courses
        const coursesResponse = await fetch(
          "https://codingcloud.pythonanywhere.com/course/",
        );
        const coursesData = await coursesResponse.json();

        if (coursesData.success) {
          setCourses(coursesData.data);
          setUniqueCourses(coursesData.data);
        }

        // Fetch topics/modules
        const topicsResponse = await fetch(
          "https://codingcloud.pythonanywhere.com/topics/",
        );
        const topicsData = await topicsResponse.json();

        if (topicsData.status === "success") {
          setTopicsData(topicsData.data);
          setFilteredTopics(topicsData.data);

          // Extract unique modules
          const modules = topicsData.data.map((item) => ({
            id: item.module_id,
            name: item.module_name,
          }));
          setUniqueModules(modules);

          // Initialize expanded state
          const expanded = {};
          topicsData.data.forEach((item) => {
            expanded[item.module_id] = true;
          });
          setExpandedModules(expanded);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter topics based on search, course, and module
  useEffect(() => {
    let filtered = [...topicsData];

    if (searchTerm) {
      filtered = filtered.filter(
        (module) =>
          module.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.topics.some((topic) =>
            topic.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (selectedCourse !== "all") {
      // Filter modules by course (you'll need to map courses to modules)
      const course = courses.find((c) => c.id === parseInt(selectedCourse));
      if (course) {
        filtered = filtered.filter((module) =>
          module.module_name.toLowerCase().includes(course.name.toLowerCase()),
        );
      }
    }

    if (selectedModule !== "all") {
      filtered = filtered.filter(
        (module) => module.module_id === parseInt(selectedModule),
      );
    }

    setFilteredTopics(filtered);
  }, [searchTerm, selectedCourse, selectedModule, topicsData, courses]);

  // Get icon for course category
  const getCourseIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "it and software":
        return <Code size={20} className="text-blue-600" />;
      case "mobile application":
        return <Smartphone size={20} className="text-green-600" />;
      default:
        return <Globe size={20} className="text-purple-600" />;
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCourse("all");
    setSelectedModule("all");
  };

  const toggleModule = (moduleId, e) => {
    if (e) e.stopPropagation();
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Modal handlers
  const openTopicModal = (topic, moduleName, moduleId) => {
    setSelectedTopic({
      ...topic,
      module_name: moduleName,
      module_id: moduleId,
    });
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeTopicModal = () => {
    setShowModal(false);
    setSelectedTopic(null);
    document.body.style.overflow = "unset";
  };

  // Delete handlers
  const handleDeleteClick = (e, topic, moduleName) => {
    e.stopPropagation();
    setTopicToDelete({ ...topic, module_name: moduleName });
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/topics/${topicToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok || response.status === 204) {
        setDeleteSuccess("Topic deleted successfully!");
        // Refresh topics
        const topicsResponse = await fetch(
          "https://codingcloud.pythonanywhere.com/topics/",
        );
        const topicsData = await topicsResponse.json();
        if (topicsData.status === "success") {
          setTopicsData(topicsData.data);
        }
        setTimeout(() => {
          setShowDeleteModal(false);
          setTopicToDelete(null);
          setDeleteSuccess("");
        }, 1500);
      } else {
        const data = await response.json();
        setDeleteError(data.message || "Failed to delete topic");
      }
    } catch (err) {
      console.error("Error deleting topic:", err);
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (e, topic, moduleName, moduleId) => {
    e.stopPropagation();
    navigate(`/edit-topic/${topic.id}`, {
      state: {
        topic: { ...topic, module_name: moduleName, module_id: moduleId },
      },
    });
  };

  // Calculate totals
  const totalTopics = topicsData.reduce(
    (acc, module) => acc + module.topics.length,
    0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading courses and topics...
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
      {/* Header with Course Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Topics</h1>
          <p className="text-gray-500 text-sm mt-1">
            {courses.length} courses • {topicsData.length} modules •{" "}
            {totalTopics} topics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Topic Button */}
          <button
            onClick={() => navigate("/add-topic")}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline font-medium">Add Topic</span>
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
                placeholder="Search topics, modules, or courses..."
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
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filter</span>
                {(selectedCourse !== "all" || selectedModule !== "all") && (
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
                    Filter by Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Courses</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} (
                        {course.category_details?.name || "General"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Module Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Filter by Module
                  </label>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Modules</option>
                    {uniqueModules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
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
                      Course:{" "}
                      {
                        courses.find((c) => c.id === parseInt(selectedCourse))
                          ?.name
                      }
                      <button onClick={() => setSelectedCourse("all")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedModule !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Module:{" "}
                      {
                        uniqueModules.find(
                          (m) => m.id === parseInt(selectedModule),
                        )?.name
                      }
                      <button onClick={() => setSelectedModule("all")}>
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
            {filteredTopics.reduce((acc, m) => acc + m.topics.length, 0)}
          </span>{" "}
          topics in {filteredTopics.length} modules
        </p>
      </div>

      {/* Topics Grid/List View */}
      {filteredTopics.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No topics found
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
            <div className="space-y-4">
              {filteredTopics.map((module) => (
                <div
                  key={module.module_id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Module Header */}
                  <div
                    onClick={(e) => toggleModule(module.module_id, e)}
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={20} className="text-indigo-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {module.module_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Module ID: {module.module_id} • {module.topics.length}{" "}
                          topics
                        </p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-white rounded-lg transition-colors">
                      {expandedModules[module.module_id] ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Topics Grid */}
                  {expandedModules[module.module_id] && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {module.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all hover:border-indigo-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <BookMarked
                                size={14}
                                className="text-indigo-600"
                              />
                              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                ID: {topic.id}
                              </span>
                            </div>
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                            {topic.name}
                          </h4>
                          <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openTopicModal(
                                  topic,
                                  module.module_name,
                                  module.module_id,
                                );
                              }}
                              className="px-1.5 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) =>
                                handleEdit(
                                  e,
                                  topic,
                                  module.module_name,
                                  module.module_id,
                                )
                              }
                              className="px-1.5 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteClick(e, topic, module.module_name)
                              }
                              className="px-1.5 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredTopics.map((module) => (
                <div
                  key={module.module_id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Module Header */}
                  <div
                    onClick={(e) => toggleModule(module.module_id, e)}
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={20} className="text-indigo-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {module.module_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Module ID: {module.module_id} • {module.topics.length}{" "}
                          topics
                        </p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-white rounded-lg transition-colors">
                      {expandedModules[module.module_id] ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Topics List */}
                  {expandedModules[module.module_id] && (
                    <div className="divide-y divide-gray-100">
                      {module.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <BookMarked
                                  size={14}
                                  className="text-indigo-600"
                                />
                                <span className="text-xs font-medium text-gray-500">
                                  Topic ID: {topic.id}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {topic.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTopicModal(
                                    topic,
                                    module.module_name,
                                    module.module_id,
                                  );
                                }}
                                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={(e) =>
                                  handleEdit(
                                    e,
                                    topic,
                                    module.module_name,
                                    module.module_id,
                                  )
                                }
                                className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) =>
                                  handleDeleteClick(
                                    e,
                                    topic,
                                    module.module_name,
                                  )
                                }
                                className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Topic Details Modal */}
      {showModal && selectedTopic && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={closeTopicModal}
              aria-hidden="true"
            />

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="relative">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
                  <button
                    onClick={closeTopicModal}
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
                        {selectedTopic.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                          Topic ID: {selectedTopic.id}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                          Module: {selectedTopic.module_id}
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
                        Topic Details
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Module Name</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {selectedTopic.module_name}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Topic ID</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {selectedTopic.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Module ID</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {selectedTopic.module_id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={(e) => {
                        closeTopicModal();
                        handleEdit(
                          e,
                          selectedTopic,
                          selectedTopic.module_name,
                          selectedTopic.module_id,
                        );
                      }}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit Topic
                    </button>
                    <button
                      onClick={closeTopicModal}
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
      {showDeleteModal && topicToDelete && (
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
                  Delete Topic
                </h3>

                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    "{topicToDelete.name}"
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

// import React, { useState, useEffect } from "react";
// import useFetch from "../../hooks/useFetch";
// import useSubmit from "../../hooks/useSubmit";
// import { API } from "../../api/endpoints";
// import { Toast, useToast } from "../../components/Toast";

// // Spinner Component
// const Spinner = () => (
//   <svg
//     className="animate-spin h-5 w-5 text-current"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     ></circle>
//     <path
//       className="opacity-75"
//       fill="currentColor"
//       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//     ></path>
//   </svg>
// );

// const TopicManager = () => {
//   const { toast, showToast, closeToast } = useToast();
//   const { submitData, loading: submitting } = useSubmit();

//   // --- State for data ---
//   const [courses, setCourses] = useState([]);
//   const [modules, setModules] = useState([]);
//   const [topicsByModule, setTopicsByModule] = useState([]);
//   const [loading, setLoading] = useState({
//     courses: true,
//     modules: true,
//     topics: true,
//   });

//   // --- UI State ---
//   const [selectedCourseId, setSelectedCourseId] = useState("");
//   const [filteredModules, setFilteredModules] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingTopic, setEditingTopic] = useState(null); // { id, name, moduleId }
//   const [formData, setFormData] = useState({ module: "", name: "" });
//   const [deleteModal, setDeleteModal] = useState({
//     show: false,
//     id: null,
//     moduleId: null,
//   });

//   // --- Fetch All Data on Mount ---
//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading({ courses: true, modules: true, topics: true });

//       try {
//         // Fetch Courses (You need to define API.COURSES.LIST in your endpoints)
//         const coursesRes = await fetch(API.COURSES.LIST);
//         const coursesJson = await coursesRes.json();
//         // Adjust based on your API response structure for courses
//         const coursesData =
//           coursesJson.data || coursesJson.results || coursesJson;
//         setCourses(Array.isArray(coursesData) ? coursesData : []);

//         // Fetch Modules
//         const modulesRes = await fetch(API.MODULES.LIST);
//         const modulesJson = await modulesRes.json();
//         const modulesData =
//           modulesJson.data || modulesJson.results || modulesJson;
//         setModules(Array.isArray(modulesData) ? modulesData : []);
//         // Fetch Topics (grouped by module)
//         const topicsRes = await fetch(API.TOPICS.LIST);
//         const topicsJson = await topicsRes.json();
//         // The topics API returns data grouped by module: { data: [{ module_id, module_name, topics: [...] }] }
//         const topicsData = topicsJson.data || topicsJson.results || topicsJson;
//         setTopicsByModule(Array.isArray(topicsData) ? topicsData : []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         showToast("Failed to load data", "error");
//       } finally {
//         setLoading({ courses: false, modules: false, topics: false });
//       }
//     };

//     fetchAllData();
//   }, []);

//   // --- Filter modules when course is selected ---
//   useEffect(() => {
//     if (selectedCourseId && modules.length > 0) {
//       const filtered = modules.filter(
//         (mod) => Number(mod.course_data) === Number(selectedCourseId),
//       );
//       setFilteredModules(filtered);
//     } else {
//       setFilteredModules([]);
//     }
//     // Reset form module selection when course changes
//     setFormData((prev) => ({ ...prev, module: "" }));
//   }, [selectedCourseId, modules]);

//   // --- Flatten topics for display with course context ---
//   const flattenedTopics = Array.isArray(topicsByModule)
//     ? topicsByModule.flatMap((moduleGroup) =>
//         (Array.isArray(moduleGroup.topics) ? moduleGroup.topics : []).map(
//           (topic) => ({
//             ...topic,
//             module_id: moduleGroup.module_id,
//             module_name: moduleGroup.module_name,
//           }),
//         ),
//       )
//     : [];

//   // --- Handlers ---
//   const handleCourseChange = (e) => {
//     setSelectedCourseId(e.target.value);
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const resetForm = () => {
//     setFormData({ module: "", name: "" });
//     setEditingTopic(null);
//     setShowForm(false);
//   };

//   const handleEdit = (topic) => {
//     setEditingTopic(topic);
//     setFormData({
//       module: topic.module_id,
//       name: topic.name,
//     });
//     // Find the course for this module to pre-select it?
//     // For simplicity, we clear course selection, user must re-select.
//     setSelectedCourseId("");
//     setShowForm(true);
//   };

//   // --- Submit Handler (POST to /topics/) ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.module || !formData.name.trim()) {
//       showToast("Please select a module and enter a topic name", "error");
//       return;
//     }

//     const payload = {
//       module: parseInt(formData.module),
//       name: formData.name,
//     };

//     let result;
//     if (editingTopic) {
//       // Update existing topic
//       result = await submitData(
//         API.TOPICS.DETAIL(editingTopic.id),
//         payload,
//         true,
//         "PATCH",
//       );
//     } else {
//       // Create new topic
//       result = await submitData(API.TOPICS.LIST, payload, true, "POST");
//     }

//     if (result.success) {
//       showToast(editingTopic ? "Topic updated!" : "Topic created!", "success");
//       // Refetch topics to update the list (simplest approach)
//       const topicsRes = await fetch(API.TOPICS.LIST);
//       const topicsJson = await topicsRes.json();
//       const topicsData = topicsJson.data || topicsJson.results || topicsJson;
//       setTopicsByModule(Array.isArray(topicsData) ? topicsData : []);
//       resetForm();
//     } else {
//       showToast(result.error?.message || "Operation failed", "error");
//     }
//   };

//   // --- Delete Handler ---
//   const promptDelete = (id, moduleId) =>
//     setDeleteModal({ show: true, id, moduleId });

//   const confirmDelete = async () => {
//     const { id, moduleId } = deleteModal;
//     if (!id) return;

//     const result = await submitData(API.TOPICS.DETAIL(id), {}, false, "DELETE");
//     if (result.success) {
//       showToast("Topic deleted", "success");
//       // Update local state by filtering out the deleted topic
//       setTopicsByModule((prev) =>
//         prev.map((moduleGroup) =>
//           moduleGroup.module_id === moduleId
//             ? {
//                 ...moduleGroup,
//                 topics: moduleGroup.topics.filter((t) => t.id !== id),
//               }
//             : moduleGroup,
//         ),
//       );
//       setDeleteModal({ show: false, id: null, moduleId: null });
//     } else {
//       showToast("Delete failed", "error");
//     }
//   };

//   // --- Render Logic ---
//   const isLoading = loading.courses || loading.modules || loading.topics;

//   return (
//     <div className="container mx-auto p-5 min-h-screen">
//       <Toast toast={toast} onClose={closeToast} />

//       {/* Header and Course Selector */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Topic Manager</h1>
//         <div className="flex w-full md:w-auto gap-4">
//           <select
//             value={selectedCourseId}
//             onChange={handleCourseChange}
//             className="flex-1 md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             disabled={isLoading}
//           >
//             <option value="">Filter by Course</option>
//             {courses.map((course) => (
//               <option key={course.id} value={course.id}>
//                 {course.name}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={() => {
//               setEditingTopic(null);
//               setFormData({ module: "", name: "" });
//               setShowForm(true);
//             }}
//             disabled={!selectedCourseId}
//             className="bg-[#4522f0] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#401afc] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
//           >
//             + Add Topic
//           </button>
//         </div>
//       </div>

//       {/* Topics Table */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//         {isLoading ? (
//           <div className="h-40 flex flex-col justify-center items-center text-gray-500">
//             <Spinner />
//             <span className="mt-2">Loading...</span>
//           </div>
//         ) : (
//           <table className="min-w-full">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="py-3 px-6 text-left">#</th>
//                 <th className="py-3 px-6 text-left">Course</th>
//                 <th className="py-3 px-6 text-left">Module</th>
//                 <th className="py-3 px-6 text-left">Topic Name</th>
//                 <th className="py-3 px-6 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {flattenedTopics.length > 0 ? (
//                 flattenedTopics.map((topic, index) => {
//                   // Find the course for this module (optional, for display)
//                   const moduleInfo = modules.find(
//                     (m) => m.id === topic.module_id,
//                   );
//                   const courseName =
//                     courses.find((c) => c.id === moduleInfo?.course_data)
//                       ?.name || "N/A";
//                   return (
//                     <tr key={topic.id} className="hover:bg-blue-50">
//                       <td className="py-4 px-6 text-gray-500">{index + 1}</td>
//                       <td className="py-4 px-6">
//                         <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//                           {courseName}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//                           {topic.module_name}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6 font-bold">{topic.name}</td>
//                       <td className="py-4 px-6 text-center">
//                         <div className="flex justify-center gap-3">
//                           <button
//                             onClick={() => handleEdit(topic)}
//                             className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600"
//                           >
//                             <svg
//                               className="h-4 w-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() =>
//                               promptDelete(topic.id, topic.module_id)
//                             }
//                             className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
//                           >
//                             <svg
//                               className="h-4 w-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="py-10 text-center text-gray-400">
//                     {selectedCourseId
//                       ? "No topics found for the selected filter."
//                       : "Select a course to view or add topics."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Add/Edit Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">
//             <h2 className="text-xl font-bold mb-4 border-b pb-2">
//               {editingTopic ? "Edit Topic" : "Add New Topic"}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               {/* Course Selector (Read-only in form, based on selection) */}
//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Course
//                 </label>
//                 <select
//                   value={selectedCourseId}
//                   onChange={handleCourseChange}
//                   className="w-full p-3 border rounded-lg bg-gray-100"
//                   disabled={!!editingTopic} // Disable change during edit for simplicity
//                   required
//                 >
//                   <option value="">Select Course</option>
//                   {courses.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 {!selectedCourseId && (
//                   <p className="text-xs text-red-500 mt-1">
//                     Please select a course first.
//                   </p>
//                 )}
//               </div>

//               {/* Module Selector (Filtered) */}
//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Module
//                 </label>
//                 <select
//                   name="module"
//                   value={formData.module}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   disabled={!selectedCourseId || loading.modules}
//                   required
//                 >
//                   <option value="">-- Select Module --</option>
//                   {filteredModules.map((mod) => (
//                     <option key={mod.id} value={mod.id}>
//                       {mod.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Topic Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Topic Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Introduction to React"
//                   required
//                 />
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting || !selectedCourseId}
//                   className="flex-1 py-2 bg-[#4522f0] text-white rounded-lg hover:bg-[#401afc] flex justify-center items-center gap-2 disabled:opacity-50"
//                 >
//                   {submitting ? <Spinner /> : editingTopic ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModal.show && (
//         <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
//           <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
//                 <svg
//                   className="h-8 w-8 text-red-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-bold mb-2">Delete Topic?</h3>
//               <p className="text-sm text-gray-500 mb-6">
//                 This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() =>
//                     setDeleteModal({ show: false, id: null, moduleId: null })
//                   }
//                   className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex justify-center items-center gap-2"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TopicManager;

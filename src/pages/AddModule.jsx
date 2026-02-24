import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  X,
  Grid,
  List,
  SlidersHorizontal,
  Plus,
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
  ChevronRight
} from "lucide-react";

export default function Topics() {
  const navigate = useNavigate();

  // State for courses, modules and topics data
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
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

  // Add Topic Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState("");
  const [addError, setAddError] = useState("");
  const [newTopic, setNewTopic] = useState({
    name: "",
    module_id: "",
    description: "",
    order: "",
    content: "",
    video_url: "",
    duration: ""
  });

  // Filtered modules based on selected course
  const [filteredModules, setFilteredModules] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesResponse = await fetch("https://codingcloud.pythonanywhere.com/course/");
        const coursesData = await coursesResponse.json();
        
        if (coursesData.success) {
          setCourses(coursesData.data);
        }

        // Fetch modules
        const modulesResponse = await fetch("https://codingcloud.pythonanywhere.com/modules/");
        const modulesData = await modulesResponse.json();
        
        if (modulesData.success) {
          setModules(modulesData.data);
        }

        // Fetch topics
        const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
        const topicsData = await topicsResponse.json();

        if (topicsData.status === "success") {
          setTopicsData(topicsData.data);
          setFilteredTopics(topicsData.data);

          // Initialize expanded state for all modules
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

    fetchAllData();
  }, []);

  // Filter modules when course is selected in add modal
  useEffect(() => {
    if (selectedCourse && selectedCourse !== "all") {
      const courseId = parseInt(selectedCourse);
      const courseModules = modules.filter(module => module.course_data === courseId);
      setFilteredModules(courseModules);
    } else {
      setFilteredModules([]);
    }
  }, [selectedCourse, modules]);

  // Filter topics based on search, course, and module
  useEffect(() => {
    let filtered = [...topicsData];

    if (searchTerm) {
      filtered = filtered.filter(
        (module) =>
          module.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.topics.some((topic) =>
            topic.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedCourse !== "all") {
      // Get all module IDs for the selected course
      const courseModules = modules
        .filter(m => m.course_data === parseInt(selectedCourse))
        .map(m => m.id);
      
      filtered = filtered.filter(module => 
        courseModules.includes(module.module_id)
      );
    }

    if (selectedModule !== "all") {
      filtered = filtered.filter(
        (module) => module.module_id === parseInt(selectedModule)
      );
    }

    setFilteredTopics(filtered);
  }, [searchTerm, selectedCourse, selectedModule, topicsData, modules]);

  // Get course name by module ID
  const getCourseNameByModuleId = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return "Unknown Course";
    const course = courses.find(c => c.id === module.course_data);
    return course ? course.name : "Unknown Course";
  };

  // Get icon for course category
  const getCourseIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'it and software':
        return <Code size={20} className="text-blue-600" />;
      case 'mobile application':
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

  // Add Topic Modal handlers
  const openAddModal = () => {
    setShowAddModal(true);
    setAddError("");
    setAddSuccess("");
    setSelectedCourse("all");
    setNewTopic({
      name: "",
      module_id: "",
      description: "",
      order: "",
      content: "",
      video_url: "",
      duration: ""
    });
    document.body.style.overflow = "hidden";
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddError("");
    setAddSuccess("");
    document.body.style.overflow = "unset";
  };

  // Handle Add Topic form input changes
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add Topic submit
  const handleAddTopic = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");

    // Prepare data for API - only send required fields
    const topicData = {
      name: newTopic.name,
      module_id: parseInt(newTopic.module_id)
    };

    // Add optional fields only if they have values
    if (newTopic.description) topicData.description = newTopic.description;
    if (newTopic.order) topicData.order = parseInt(newTopic.order);
    if (newTopic.content) topicData.content = newTopic.content;
    if (newTopic.video_url) topicData.video_url = newTopic.video_url;
    if (newTopic.duration) topicData.duration = newTopic.duration;

    try {
      const response = await fetch("https://codingcloud.pythonanywhere.com/topics/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicData),
      });

      const data = await response.json();

      if (response.ok) {
        setAddSuccess("Topic added successfully!");
        
        // Refresh topics list
        const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
        const topicsData = await topicsResponse.json();
        
        if (topicsData.status === "success") {
          setTopicsData(topicsData.data);
          setFilteredTopics(topicsData.data);
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          closeAddModal();
        }, 2000);
      } else {
        setAddError(data.message || "Failed to add topic");
      }
    } catch (err) {
      console.error("Error adding topic:", err);
      setAddError("Network error. Please try again.");
    } finally {
      setAddLoading(false);
    }
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
        }
      );

      if (response.ok || response.status === 204) {
        setDeleteSuccess("Topic deleted successfully!");
        // Refresh topics
        const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
        const topicsData = await topicsResponse.json();
        if (topicsData.status === "success") {
          setTopicsData(topicsData.data);
          setFilteredTopics(topicsData.data);
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
  const handleEdit = (e, topicId) => {
    e.stopPropagation();
    navigate(`/edit-topic/${topicId}`);
  };

  // Calculate totals
  const totalTopics = topicsData.reduce(
    (acc, module) => acc + module.topics.length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading courses, modules and topics...
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
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Topics</h1>
          <p className="text-gray-500 text-sm mt-1">
            {courses.length} courses • {modules.length} modules • {totalTopics} topics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Topic Button */}
          <button
            onClick={openAddModal}
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
                        {course.name} ({course.category_details?.name || 'General'})
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
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name} (Course ID: {module.course_data})
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
                      Course: {courses.find(c => c.id === parseInt(selectedCourse))?.name}
                      <button onClick={() => setSelectedCourse("all")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedModule !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Module: {modules.find(m => m.id === parseInt(selectedModule))?.name}
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
              {filteredTopics.map((module) => {
                const courseName = getCourseNameByModuleId(module.module_id);
                return (
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
                            Module ID: {module.module_id} • {module.topics.length} topics
                          </p>
                          <p className="text-xs text-indigo-600 mt-0.5">
                            Course: {courseName}
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
                                <BookMarked size={14} className="text-indigo-600" />
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
                                  openTopicModal(topic, module.module_name, module.module_id);
                                }}
                                className="px-1.5 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={(e) => handleEdit(e, topic.id)}
                                className="px-1.5 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, topic, module.module_name)}
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
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredTopics.map((module) => {
                const courseName = getCourseNameByModuleId(module.module_id);
                return (
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
                            Module ID: {module.module_id} • {module.topics.length} topics
                          </p>
                          <p className="text-xs text-indigo-600 mt-0.5">
                            Course: {courseName}
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
                                  <BookMarked size={14} className="text-indigo-600" />
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
                                    openTopicModal(topic, module.module_name, module.module_id);
                                  }}
                                  className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                >
                                  View
                                </button>
                                <button
                                  onClick={(e) => handleEdit(e, topic.id)}
                                  className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => handleDeleteClick(e, topic, module.module_name)}
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
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Topic Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="add-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={closeAddModal}
              aria-hidden="true"
            />

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6">
                  <button
                    onClick={closeAddModal}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Plus size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Add New Topic
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        Create a new topic for your course module
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleAddTopic}>
                  <div className="p-6 space-y-4">
                    {/* Success Message */}
                    {addSuccess && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle size={18} className="text-green-600" />
                        <p className="text-green-700 text-sm">{addSuccess}</p>
                      </div>
                    )}

                    {/* Error Message */}
                    {addError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-600" />
                        <p className="text-red-700 text-sm">{addError}</p>
                      </div>
                    )}

                    {/* Topic Name - Required */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newTopic.name}
                        onChange={handleAddInputChange}
                        required
                        placeholder="e.g., Introduction to React"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {/* Course Selection - Helps filter modules */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Course (Optional - to filter modules)
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Select a course to see only its modules in the dropdown below
                      </p>
                    </div>

                    {/* Module ID - Required with filtered modules */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="module_id"
                        value={newTopic.module_id}
                        onChange={handleAddInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select a module</option>
                        {(selectedCourse !== "all" ? filteredModules : modules).map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.name} (ID: {module.id})
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Select the module where this topic will belong
                      </p>
                    </div>

                    {/* Order - Optional */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order (Optional)
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={newTopic.order}
                        onChange={handleAddInputChange}
                        placeholder="e.g., 1"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Display order of the topic within the module
                      </p>
                    </div>

                    {/* Description - Optional */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={newTopic.description}
                        onChange={handleAddInputChange}
                        rows="3"
                        placeholder="Enter topic description..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Content - Optional */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (Optional)
                      </label>
                      <textarea
                        name="content"
                        value={newTopic.content}
                        onChange={handleAddInputChange}
                        rows="4"
                        placeholder="Enter topic content..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Video URL - Optional */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="video_url"
                        value={newTopic.video_url}
                        onChange={handleAddInputChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {/* Duration - Optional */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) (Optional)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={newTopic.duration}
                        onChange={handleAddInputChange}
                        placeholder="e.g., 30"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      disabled={addLoading}
                      className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Add Topic
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
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
                          <div>
                            <p className="text-xs text-gray-500">Course</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {getCourseNameByModuleId(selectedTopic.module_id)}
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
                        handleEdit(e, selectedTopic.id);
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
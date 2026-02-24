import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Clock,
  Users,
  Signal,
  Globe,
  Award,
  Search,
  Filter,
  X,
  ChevronRight,
  Download,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  FileText,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    level: "all",
    language: "all",
    certificate: "all",
    duration: "all",
  });

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const navigate = useNavigate();

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/course/",
      );
      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
        setFilteredCourses(data.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Map(
            data.data.map((course) => [
              course.category_details.id,
              course.category_details,
            ]),
          ).values(),
        ];
        setCategories(uniqueCategories);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category_details.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category_details.id === parseInt(selectedCategory),
      );
    }

    // Advanced filters
    if (filters.level !== "all") {
      filtered = filtered.filter(
        (course) => course.level?.toLowerCase() === filters.level.toLowerCase(),
      );
    }

    if (filters.language !== "all") {
      filtered = filtered.filter(
        (course) =>
          course.language?.toLowerCase() === filters.language.toLowerCase(),
      );
    }

    if (filters.certificate !== "all") {
      filtered = filtered.filter(
        (course) =>
          (filters.certificate === "yes" && course.certificate === "Yes") ||
          (filters.certificate === "no" && course.certificate === "No"),
      );
    }

    if (filters.duration !== "all") {
      filtered = filtered.filter((course) => {
        if (!course.duration) return false;
        const duration = course.duration.toLowerCase();
        if (filters.duration === "short")
          return duration.includes("hour") || duration.includes("min");
        if (filters.duration === "medium") return duration.includes("week");
        if (filters.duration === "long") return duration.includes("month");
        return true;
      });
    }

    // Sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "duration-asc":
        filtered.sort((a, b) => {
          const durA = parseInt(a.duration) || 999;
          const durB = parseInt(b.duration) || 999;
          return durA - durB;
        });
        break;
      case "duration-desc":
        filtered.sort((a, b) => {
          const durA = parseInt(a.duration) || 0;
          const durB = parseInt(b.duration) || 0;
          return durB - durA;
        });
        break;
      case "students":
        filtered.sort(
          (a, b) => (parseInt(b.students) || 0) - (parseInt(a.students) || 0),
        );
        break;
      default:
        // Default sorting by id (newest first)
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, filters, sortBy, courses]);

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeCourseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    document.body.style.overflow = "unset";
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setFilters({
      level: "all",
      language: "all",
      certificate: "all",
      duration: "all",
    });
    setSortBy("default");
  };

  // Handle edit
  const handleEdit = (e, courseId) => {
    e.stopPropagation();
    navigate(`/edit-course/${courseId}`);
  };

  // Handle delete confirmation
  const handleDeleteClick = (e, course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  // Handle delete course
  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/course/${courseToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok || response.status === 204) {
        setDeleteSuccess("Course deleted successfully!");
        
        // Refresh courses list
        await fetchCourses();
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          setShowDeleteModal(false);
          setCourseToDelete(null);
          setDeleteSuccess("");
        }, 1500);
      } else {
        const data = await response.json();
        setDeleteError(data.message || "Failed to delete course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get unique languages for filter
  const languages = [
    ...new Set(courses.map((c) => c.language).filter(Boolean)),
  ];

  // Get level badge color
  const getLevelBadge = (level) => {
    if (!level) return "bg-gray-100 text-gray-600";

    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading courses...
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Courses</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredCourses.length} of {courses.length} courses • {categories.length} categories
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Stats Cards */}
          <div className="hidden sm:flex gap-3">
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">Total Students</p>
              <p className="text-lg font-semibold text-gray-900">
                {courses.reduce((acc, course) => acc + (parseInt(course.students) || 0), 0)}+
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">Avg. Duration</p>
              <p className="text-lg font-semibold text-gray-900">40h</p>
            </div>
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => navigate('/add-course')}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          >
            <span className="text-lg font-bold leading-none">+</span>
            <span className="hidden sm:inline font-medium">Add Course</span>
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
                placeholder="Search courses by name, description or category..."
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
                <span className="hidden sm:inline">Filters</span>
                {(selectedCategory !== "all" ||
                  Object.values(filters).some((v) => v !== "all")) && (
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (
                        {
                          courses.filter(
                            (c) => c.category_details.id === cat.id,
                          ).length
                        }
                        )
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) =>
                      setFilters({ ...filters, level: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="hard">Advanced/Hard</option>
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) =>
                      setFilters({ ...filters, language: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Languages</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Certificate Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Certificate
                  </label>
                  <select
                    value={filters.certificate}
                    onChange={(e) =>
                      setFilters({ ...filters, certificate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="yes">With Certificate</option>
                    <option value="no">Without Certificate</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="default">Newest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="duration-asc">Duration (Shortest)</option>
                    <option value="duration-desc">Duration (Longest)</option>
                    <option value="students">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Active Filters & Reset */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Category:{" "}
                      {
                        categories.find(
                          (c) => c.id === parseInt(selectedCategory),
                        )?.name
                      }
                      <button onClick={() => setSelectedCategory("all")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.level !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Level: {filters.level}
                      <button
                        onClick={() => setFilters({ ...filters, level: "all" })}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.language !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Language: {filters.language}
                      <button
                        onClick={() =>
                          setFilters({ ...filters, language: "all" })
                        }
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Reset all filters
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
            {filteredCourses.length}
          </span>{" "}
          results
        </p>
      </div>

      {/* Course Grid/List View */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No courses found
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={`https://codingcloud.pythonanywhere.com${course.image}`}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x200?text=Course+Image";
                      }}
                    />
                    {course.category_details && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                          {course.category_details.name}
                        </span>
                      </div>
                    )}
                    {course.certificate === "Yes" && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1">
                          <Award size={12} />
                          Cert
                        </span>
                      </div>
                    )}
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => openCourseModal(course)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => handleEdit(e, course.id)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                        title="Edit Course"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, course)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                      {course.name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {course.text || "No description available"}
                    </p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {course.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Clock size={14} className="text-gray-400" />
                          <span className="truncate">{course.duration}</span>
                        </div>
                      )}
                      {course.lecture && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <BookOpen size={14} className="text-gray-400" />
                          <span className="truncate">{course.lecture}</span>
                        </div>
                      )}
                      {course.students && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Users size={14} className="text-gray-400" />
                          <span className="truncate">{course.students}</span>
                        </div>
                      )}
                      {course.level && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Signal size={14} className="text-gray-400" />
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelBadge(course.level)}`}
                          >
                            {course.level}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openCourseModal(course)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={(e) => handleEdit(e, course.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, course)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        <Trash2 size={14} />
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
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image */}
                    <div className="md:w-64 h-48 md:h-auto relative overflow-hidden bg-gray-100">
                      <img
                        src={`https://codingcloud.pythonanywhere.com${course.image}`}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=Course+Image";
                        }}
                      />
                      {course.certificate === "Yes" && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Award size={12} />
                            Certificate
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          {/* Category & Level */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                              {course.category_details.name}
                            </span>
                            {course.level && (
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getLevelBadge(course.level)}`}
                              >
                                {course.level}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-gray-900 text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                            {course.name}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {course.text || "No description available"}
                          </p>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            {course.duration && (
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Duration
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {course.duration}
                                  </p>
                                </div>
                              </div>
                            )}
                            {course.lecture && (
                              <div className="flex items-center gap-2">
                                <BookOpen size={16} className="text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Lectures
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {course.lecture}
                                  </p>
                                </div>
                              </div>
                            )}
                            {course.students && (
                              <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Students
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {course.students}
                                  </p>
                                </div>
                              </div>
                            )}
                            {course.language && (
                              <div className="flex items-center gap-2">
                                <Globe size={16} className="text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Language
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {course.language}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="lg:w-40 flex flex-row lg:flex-col items-center justify-end gap-2">
                          <button
                            onClick={() => openCourseModal(course)}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={(e) => handleEdit(e, course.id)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, course)}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                          {course.pdf_file && (
                            <a
                              href={`https://codingcloud.pythonanywhere.com${course.pdf_file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <FileText size={14} />
                              Syllabus
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Course Details Modal */}
      {showModal && selectedCourse && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end sm:items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={closeCourseModal}
              aria-hidden="true"
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
              {/* Close button */}
              <button
                onClick={closeCourseModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Modal Content */}
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Banner Image */}
                <div className="relative h-64 sm:h-80 bg-gray-900">
                  <img
                    src={`https://codingcloud.pythonanywhere.com${selectedCourse.banner_img || selectedCourse.image}`}
                    alt={selectedCourse.name}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/1200x400?text=Course+Banner";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {selectedCourse.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                        {selectedCourse.category_details.name}
                      </span>
                      {selectedCourse.level && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadge(selectedCourse.level)}`}
                        >
                          {selectedCourse.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {selectedCourse.duration && (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Clock
                          size={20}
                          className="mx-auto mb-2 text-indigo-600"
                        />
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">
                          {selectedCourse.duration}
                        </p>
                      </div>
                    )}
                    {selectedCourse.lecture && (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <BookOpen
                          size={20}
                          className="mx-auto mb-2 text-indigo-600"
                        />
                        <p className="text-xs text-gray-500">Lectures</p>
                        <p className="font-semibold text-gray-900">
                          {selectedCourse.lecture}
                        </p>
                      </div>
                    )}
                    {selectedCourse.students && (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Users
                          size={20}
                          className="mx-auto mb-2 text-indigo-600"
                        />
                        <p className="text-xs text-gray-500">Students</p>
                        <p className="font-semibold text-gray-900">
                          {selectedCourse.students}
                        </p>
                      </div>
                    )}
                    {selectedCourse.language && (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Globe
                          size={20}
                          className="mx-auto mb-2 text-indigo-600"
                        />
                        <p className="text-xs text-gray-500">Language</p>
                        <p className="font-semibold text-gray-900">
                          {selectedCourse.language}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About this course
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {selectedCourse.text ||
                        "No description available for this course."}
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {selectedCourse.meta_title && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Meta Title
                        </h4>
                        <p className="text-gray-900">
                          {selectedCourse.meta_title}
                        </p>
                      </div>
                    )}
                    {selectedCourse.meta_description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Meta Description
                        </h4>
                        <p className="text-gray-900">
                          {selectedCourse.meta_description}
                        </p>
                      </div>
                    )}
                    {selectedCourse.keywords && (
                      <div className="sm:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCourse.keywords
                            .split(",")
                            .map((keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={(e) => {
                        closeCourseModal();
                        handleEdit(e, selectedCourse.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit size={18} />
                      Edit Course
                    </button>
                    {selectedCourse.pdf_file && (
                      <a
                        href={`https://codingcloud.pythonanywhere.com${selectedCourse.pdf_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Download size={18} />
                        Download Syllabus
                      </a>
                    )}
                    <button
                      onClick={closeCourseModal}
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
      {showDeleteModal && courseToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="delete-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={() => !deleteLoading && setShowDeleteModal(false)}
              aria-hidden="true"
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="p-6">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle size={32} className="text-red-600" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Course
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">"{courseToDelete.name}"</span>? 
                  This action cannot be undone.
                </p>

                {/* Success/Error Messages */}
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

                {/* Buttons */}
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
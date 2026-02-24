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
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageCircleQuestion,
} from "lucide-react";

export default function FAQs() {
  const navigate = useNavigate();

  // State for data
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [courses, setCourses] = useState({}); // Map of courseId -> courseName
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());
  const [selectedCourse, setSelectedCourse] = useState("all");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch both FAQs and Courses in parallel
      const [faqsRes, coursesRes] = await Promise.all([
        fetch("https://codingcloud.pythonanywhere.com/faqs/"),
        fetch("https://codingcloud.pythonanywhere.com/course/"),
      ]);

      if (faqsRes.ok && coursesRes.ok) {
        const faqsData = await faqsRes.json();
        const coursesDataRes = await coursesRes.json();

        // Create a lookup map for courses: { id: name }
        const courseMap = {};
        const actualCourses = coursesDataRes.data || coursesDataRes;
        if (Array.isArray(actualCourses)) {
          actualCourses.forEach((course) => {
            courseMap[course.id] = course.name;
          });
        }
        setCourses(courseMap);

        const actualFaqs = faqsData.data || faqsData;
        const faqsList = Array.isArray(actualFaqs) ? actualFaqs : [];
        setFaqs(faqsList);
        setFilteredFaqs(faqsList);
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter based on search and course
  useEffect(() => {
    let filtered = faqs;

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((faq) => {
        const courseName = courses[faq.course] || "";
        return (
          faq.question.toLowerCase().includes(lowerSearch) ||
          faq.answer.toLowerCase().includes(lowerSearch) ||
          courseName.toLowerCase().includes(lowerSearch)
        );
      });
    }

    // Apply course filter
    if (selectedCourse !== "all") {
      filtered = filtered.filter((faq) => faq.course === parseInt(selectedCourse));
    }

    setFilteredFaqs(filtered);
    
    // Clear expanded state when filters change
    setExpandedFaqs(new Set());
  }, [searchTerm, selectedCourse, faqs, courses]);

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  // Expand all FAQs
  const expandAll = () => {
    setExpandedFaqs(new Set(filteredFaqs.map(faq => faq.id)));
  };

  // Collapse all FAQs
  const collapseAll = () => {
    setExpandedFaqs(new Set());
  };

  // Delete handlers
  const handleDeleteClick = (faq) => {
    setFaqToDelete(faq);
    setShowDeleteModal(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/faqs/${faqToDelete.id}/`,
        {
          method: "DELETE",
        },
      );

      if (response.ok || response.status === 204) {
        setDeleteSuccess("FAQ deleted successfully!");
        fetchData(); // Refresh list
        setTimeout(() => {
          setShowDeleteModal(false);
          setFaqToDelete(null);
          setDeleteSuccess("");
        }, 1500);
      } else {
        try {
          const data = await response.json();
          setDeleteError(data.message || "Failed to delete FAQ.");
        } catch {
          setDeleteError(`HTTP Error: ${response.status}`);
        }
      }
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (faq) => {
    navigate(`/edit-faq/${faq.id}`, { state: { faq } });
  };

  // Get unique courses for filter
  const uniqueCourses = Object.keys(courses).map(id => ({
    id: parseInt(id),
    name: courses[id]
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MessageCircleQuestion size={24} className="text-indigo-600 animate-pulse" />
          </div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading FAQs...
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">FAQs</h1>
            <p className="text-indigo-100 text-sm">
              Manage your Frequently Asked Questions
            </p>
          </div>

          <button
            onClick={() => navigate("/add-faq")}
            className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 font-medium group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search questions, answers, or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* Course Filter */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'FAQ' : 'FAQs'}
            </span>
          </div>

          {/* Expand/Collapse Buttons */}
          {filteredFaqs.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 border border-gray-200"
              >
                <ChevronDown size={16} />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 border border-gray-200"
              >
                <ChevronUp size={16} />
                Collapse All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FAQs Accordion */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full p-6 w-28 h-28 mx-auto mb-6 flex items-center justify-center">
            <MessageCircleQuestion size={48} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No FAQs found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm || selectedCourse !== "all" 
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating your first FAQ."}
          </p>
          {(searchTerm || selectedCourse !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCourse("all");
              }}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* FAQ Header - Clickable */}
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      <BookOpen size={12} className="mr-1" />
                      {courses[faq.course] || `Course ${faq.course}`}
                    </span>
                    <span className="text-xs text-gray-400">ID: {faq.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  {expandedFaqs.has(faq.id) ? (
                    <ChevronUp size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </div>
              </button>

              {/* FAQ Answer - Expandable */}
              {expandedFaqs.has(faq.id) && (
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl p-5 border border-indigo-100/50">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(faq);
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(faq);
                        }}
                        className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && faqToDelete && (
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
                  Delete FAQ
                </h3>

                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete the question{" "}
                  <span className="font-semibold text-gray-900 border-b border-gray-300 pb-0.5">
                    "{faqToDelete.question}"
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
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle
                      size={16}
                      className="text-red-600 mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-red-600">{deleteError}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete FAQ"
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
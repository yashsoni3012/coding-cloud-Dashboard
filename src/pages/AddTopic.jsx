import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  BookOpen,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Layers,
  BookMarked,
} from "lucide-react";

export default function AddTopic() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    module_id: "",
    name: "",
  });

  // State for API data
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Fetch modules and courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch modules
        const modulesResponse = await fetch(
          "https://codingcloud.pythonanywhere.com/modules/",
        );
        const modulesData = await modulesResponse.json();
        console.log("Modules API response:", modulesData);

        // Fetch courses
        const coursesResponse = await fetch(
          "https://codingcloud.pythonanywhere.com/course/",
        );
        const coursesData = await coursesResponse.json();
        console.log("Courses API response:", coursesData);

        if (modulesData.success) {
          setModules(modulesData.data);
          setFilteredModules(modulesData.data);
        } else {
          setError("Failed to load modules");
        }

        if (coursesData.success) {
          setCourses(coursesData.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load modules or courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter modules when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const filtered = modules.filter(
        (module) => module.course_data === parseInt(selectedCourse),
      );
      setFilteredModules(filtered);

      // Reset module selection if current selection doesn't belong to selected course
      if (formData.module_id) {
        const selectedModule = modules.find(
          (m) => m.id === parseInt(formData.module_id),
        );
        if (
          selectedModule &&
          selectedModule.course_data !== parseInt(selectedCourse)
        ) {
          setFormData((prev) => ({ ...prev, module_id: "" }));
        }
      }
    } else {
      setFilteredModules(modules);
    }
  }, [selectedCourse, modules, formData.module_id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle course selection
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Topic name is required";
    }
    if (!formData.module_id) {
      return "Please select a module";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const moduleId = parseInt(formData.module_id);
      const topicName = formData.name.trim();

      // Based on available endpoints, it seems the correct pattern is /topics/
      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/topics/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            module: parseInt(formData.module_id),
            name: formData.name.trim(),
          }),
        },
      );

      console.log("Response status:", response.status);

      // If the response is not ok, try to get the error details
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          errorMessage = errorText || `HTTP error ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Success response:", data);

      setSuccess("Topic created successfully!");

      // Reset form
      setFormData({
        module_id: "",
        name: "",
      });
      setSelectedCourse("");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/topics");
      }, 2000);
    } catch (err) {
      console.error("Error creating topic:", err);
      setError(
        err.message ||
          "Failed to create topic. Please check the API endpoint.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Get module details for display
  const getModuleDetails = (moduleId) => {
    const module = modules.find((m) => m.id === parseInt(moduleId));
    if (!module) return null;

    const course = courses.find((c) => c.id === module.course_data);
    return {
      moduleName: module.name,
      courseName: course?.name || "Unknown Course",
      courseId: module.course_data,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading modules and courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/topics")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Topic</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create a new topic for a module
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/topics")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Topic
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={16} className="text-red-600" />
          </div>
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-red-600 text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-pulse">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Success!</h4>
            <p className="text-green-600 text-sm mt-0.5">{success}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BookMarked size={18} className="text-indigo-600" />
              <h2 className="font-semibold text-gray-900">Topic Information</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Required fields are marked with *
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Topic Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Topic Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to React, HTML Basics, JavaScript Fundamentals"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Enter a descriptive name for the topic
              </p>
            </div>

            {/* Course Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Layers size={14} className="inline mr-1 text-gray-400" />
                Select Course <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">-- First select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id}: {course.name} (
                    {course.category_details?.name || "No Category"})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Select a course to filter available modules
              </p>
            </div>

            {/* Module Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <BookOpen size={14} className="inline mr-1 text-gray-400" />
                Select Module <span className="text-red-500">*</span>
              </label>
              <select
                name="module_id"
                value={formData.module_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={!selectedCourse}
              >
                <option value="">-- Select a module --</option>
                {filteredModules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.id}: {module.name}
                  </option>
                ))}
              </select>
              {!selectedCourse && (
                <p className="text-xs text-amber-600 mt-1.5">
                  Please select a course first to see available modules
                </p>
              )}
              {selectedCourse && filteredModules.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5">
                  No modules found for this course
                </p>
              )}
            </div>

            {/* Selected Information Preview */}
            {formData.module_id && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-900 mb-2">
                  Selected Information:
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-indigo-700">
                    <span className="font-medium">Topic:</span>{" "}
                    {formData.name || "Not specified"}
                  </p>
                  <p className="text-sm text-indigo-700">
                    <span className="font-medium">Module:</span>{" "}
                    {getModuleDetails(formData.module_id)?.moduleName}
                  </p>
                  <p className="text-sm text-indigo-700">
                    <span className="font-medium">Course:</span>{" "}
                    {getModuleDetails(formData.module_id)?.courseName} (ID:{" "}
                    {getModuleDetails(formData.module_id)?.courseId})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="text-gray-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Topic Creation Tips
              </h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>First select a course to filter available modules</li>
                <li>Then select the module this topic belongs to</li>
                <li>Topic names should be specific and descriptive</li>
                <li>
                  Example: "Variables and Data Types", "React Hooks", "CSS
                  Flexbox"
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button (Mobile) */}
        <div className="block sm:hidden">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Topic
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  BookOpen,
  AlertCircle,
  Layers,
} from "lucide-react";

export default function EditTopic() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const locationState = location.state;

  const [formData, setFormData] = useState({ module_id: "", name: "" });
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const modulesResponse = await fetch("https://codingcloud.pythonanywhere.com/modules/");
        const modulesData = await modulesResponse.json();
        const coursesResponse = await fetch("https://codingcloud.pythonanywhere.com/course/");
        const coursesData = await coursesResponse.json();

        let topicData = null;
        if (locationState && locationState.topic) {
          topicData = locationState.topic;
        } else if (id) {
          const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
          if (topicsResponse.ok) {
            const allTopicsData = await topicsResponse.json();
            if (allTopicsData.status === "success" && allTopicsData.data) {
              for (const mod of allTopicsData.data) {
                const found = mod.topics.find((t) => t.id === parseInt(id));
                if (found) {
                  topicData = { ...found, module_id: mod.module_id, module_name: mod.module_name };
                  break;
                }
              }
            }
          }
        }

        if (modulesData.success) {
          setModules(modulesData.data);
          setFilteredModules(modulesData.data);
        } else {
          setError("Failed to load modules");
        }
        if (coursesData.success) setCourses(coursesData.data);

        if (topicData) {
          const modId = topicData.module_id || topicData.module || "";
          setFormData({ module_id: modId ? modId.toString() : "", name: topicData.name || "" });
          if (modId) {
            const mod = modulesData.data?.find((m) => m.id === parseInt(modId));
            if (mod && mod.course_data) setSelectedCourse(mod.course_data.toString());
          }
        }
      } catch (err) {
        setError("Failed to load modules, courses or topic. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedCourse) {
      const filtered = modules.filter((module) => module.course_data === parseInt(selectedCourse));
      setFilteredModules(filtered);
      if (formData.module_id) {
        const selectedModule = modules.find((m) => m.id === parseInt(formData.module_id));
        if (selectedModule && selectedModule.course_data !== parseInt(selectedCourse)) {
          setFormData((prev) => ({ ...prev, module_id: "" }));
        }
      }
    } else {
      setFilteredModules(modules);
    }
  }, [selectedCourse, modules, formData.module_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCourseChange = (e) => setSelectedCourse(e.target.value);

  const validateForm = () => {
    if (!formData.name.trim()) return "Topic name is required";
    if (!formData.module_id) return "Please select a module";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`https://codingcloud.pythonanywhere.com/topics/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: parseInt(formData.module_id), name: formData.name.trim() }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try { const errorData = JSON.parse(errorText); errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData); }
        catch { errorMessage = errorText || `HTTP error ${response.status}`; }
        throw new Error(errorMessage);
      }
      setSuccess("Topic updated successfully!");
      setFormData({ module_id: "", name: "" });
      setSelectedCourse("");
      setTimeout(() => navigate("/topics"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update topic. Please check the API endpoint.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-gray-800 mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading topic details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/topics")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Topic</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Update topic details</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">Update</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X size={12} className="text-red-600" />
            </div>
            <p className="text-xs text-red-600 flex-1">{error}</p>
            <button onClick={() => setError("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Save size={12} className="text-green-600" />
            </div>
            <p className="text-xs text-green-600">✓ {success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Topic Name */}
          <div>
            <label className={labelClass}>
              Topic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to React, HTML Basics, JavaScript Fundamentals"
              className={inputClass}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Enter a descriptive name for the topic</p>
          </div>

          {/* Course Selection */}
          <div>
            <label className={labelClass}>
              <Layers size={13} className="inline mr-1 text-gray-500" />
              Select Course <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                className={inputClass + " appearance-none cursor-pointer"}
              >
                <option value="">-- First select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id}: {course.name} ({course.category_details?.name || "No Category"})
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <p className="text-xs text-gray-400 mt-1">Select a course to filter available modules</p>
          </div>

          {/* Module Selection */}
          <div>
            <label className={labelClass}>
              <BookOpen size={13} className="inline mr-1 text-gray-500" />
              Select Module <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="module_id"
                value={formData.module_id}
                onChange={handleInputChange}
                className={inputClass + " appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" + (!selectedCourse ? " bg-gray-200" : "")}
                disabled={!selectedCourse}
              >
                <option value="">-- Select a module --</option>
                {filteredModules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.id}: {module.name}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {!selectedCourse && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                Please select a course first to see available modules
              </p>
            )}
            {selectedCourse && filteredModules.length === 0 && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                No modules found for this course
              </p>
            )}
          </div>

          {/* Mobile Submit Button */}
          <div className="block sm:hidden">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Topic
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
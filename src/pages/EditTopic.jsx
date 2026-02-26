import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    X,
    BookOpen,
    AlertCircle,
    Layers,
    CheckCircle2,
    Tag,
    ChevronDown,
    BookMarked,
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
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
                } catch {
                    errorMessage = errorText || `HTTP error ${response.status}`;
                }
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

    const moduleDetails = formData.module_id ? getModuleDetails(formData.module_id) : null;
    const selectedCourseObj = courses.find((c) => String(c.id) === String(selectedCourse));

    // ── Loading State ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-medium">Loading topic details…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Header ── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/topics")}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Edit Topic</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Update topic details</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Updating…
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                Update Topic
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

                {/* Error Alert */}
                {error && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <span className="flex-1">{error}</span>
                        <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700">
                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Topic Name Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Tag size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                                    Topic Name <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Enter a descriptive name for the topic</p>
                            </div>
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Introduction to React, HTML Basics, JavaScript Fundamentals"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* ── Course Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Layers size={16} className="text-violet-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Select Course <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">Select a course to filter available modules</p>
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="">— First select a course —</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.id}: {course.name} ({course.category_details?.name || "No Category"})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Selected course confirmation badge */}
                        {selectedCourseObj && (
                            <div className="mt-3 flex items-center gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                                <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Layers size={12} className="text-violet-600" />
                                </div>
                                <p className="text-xs text-violet-700">
                                    <span className="font-semibold">Selected:</span> {selectedCourseObj.name}
                                    {selectedCourseObj.category_details?.name && (
                                        <span className="text-violet-400 ml-1">· {selectedCourseObj.category_details.name}</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Module Selection Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen size={16} className="text-pink-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Select Module <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {!selectedCourse
                                        ? "Select a course above to see available modules"
                                        : filteredModules.length === 0
                                        ? "No modules found for this course"
                                        : "Choose the module this topic belongs to"}
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                name="module_id"
                                value={formData.module_id}
                                onChange={handleInputChange}
                                disabled={!selectedCourse}
                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    !selectedCourse ? "bg-gray-100" : "bg-gray-50 focus:bg-white"
                                }`}
                            >
                                <option value="">— Select a module —</option>
                                {filteredModules.map((module) => (
                                    <option key={module.id} value={module.id}>
                                        {module.id}: {module.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Contextual hints */}
                        {!selectedCourse && (
                            <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-2">
                                <AlertCircle size={12} />
                                Please select a course first to see available modules
                            </p>
                        )}
                        {selectedCourse && filteredModules.length === 0 && (
                            <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-2">
                                <AlertCircle size={12} />
                                No modules found for this course
                            </p>
                        )}

                        {/* Selected module confirmation badge */}
                        {moduleDetails && (
                            <div className="mt-3 flex items-center gap-2 p-3 bg-pink-50 border border-pink-100 rounded-xl">
                                <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BookOpen size={12} className="text-pink-500" />
                                </div>
                                <p className="text-xs text-pink-700">
                                    <span className="font-semibold">Selected:</span> {moduleDetails.moduleName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Live Preview Card ── */}
                    {(formData.name || moduleDetails) && (
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">Preview</p>
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <BookMarked size={18} className="text-indigo-500" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <p className="text-sm font-bold text-gray-800 truncate">
                                        {formData.name || <span className="text-gray-400 font-normal italic">Untitled Topic</span>}
                                    </p>
                                    {moduleDetails && (
                                        <>
                                            <p className="text-xs text-gray-500 truncate">
                                                <span className="font-medium text-gray-600">Module:</span> {moduleDetails.moduleName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                <span className="font-medium text-gray-600">Course:</span> {moduleDetails.courseName}
                                                <span className="text-gray-400 ml-1">(ID: {moduleDetails.courseId})</span>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Mobile Submit ── */}
                    <div className="sm:hidden">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Updating…
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
            </main>
        </div>
    );
}
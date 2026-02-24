import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    X,
    FileText,
    HelpCircle,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

export default function EditFAQ() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const locationState = location.state;

    // State for form data
    const [formData, setFormData] = useState({
        course: "", // string ID that we parsing to int later
        question: "",
        answer: "",
    });

    // Data state
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                setError("");

                // Fetch courses for the dropdown
                let fetchedCourses = [];
                const coursesResponse = await fetch("https://codingcloud.pythonanywhere.com/course/");
                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    fetchedCourses = coursesData.data || coursesData;
                    setCourses(fetchedCourses);
                } else {
                    setError("Failed to fetch available courses.");
                }

                // Fetch FAQ data
                let faqData = null;
                if (locationState && locationState.faq) {
                    faqData = locationState.faq;
                } else {
                    // Need to fetch individual or from list
                    const faqsResponse = await fetch("https://codingcloud.pythonanywhere.com/faqs/");
                    if (faqsResponse.ok) {
                        const listDataRes = await faqsResponse.json();
                        const listData = listDataRes.data || listDataRes;
                        faqData = Array.isArray(listData) ? listData.find(f => f.id === parseInt(id)) : null;
                    }
                }

                if (faqData) {
                    setFormData({
                        course: faqData.course?.toString() || "",
                        question: faqData.question || "",
                        answer: faqData.answer || "",
                    });
                } else {
                    setError(prev => prev ? prev + " FAQ not found." : "FAQ not found.");
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [id, locationState]);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    // Validate form
    const validateForm = () => {
        if (!formData.course) {
            return "Please select a course";
        }
        if (!formData.question.trim()) {
            return "Question is required";
        }
        if (!formData.answer.trim()) {
            return "Answer is required";
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
            const payload = {
                course: parseInt(formData.course),
                question: formData.question.trim(),
                answer: formData.answer.trim()
            };

            const response = await fetch(
                `https://codingcloud.pythonanywhere.com/faqs/${id}/`,
                {
                    method: "PATCH", // Use PATCH for partial/full updates natively
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            // If the response is not ok, try to get the error details
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

            setSuccess("FAQ updated successfully!");

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/faqs");
            }, 2000);

        } catch (err) {
            console.error("Error updating FAQ:", err);
            setError(
                err.message ||
                "Failed to update FAQ. Please check your connection."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
                        Loading detail...
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
                        onClick={() => navigate("/faqs")}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        type="button"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Update the frequently asked question
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/faqs")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <X size={18} />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !formData.course}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update FAQ
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
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">FAQ Information</h2>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Required fields are marked with *
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Associated Course */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Related Course <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                                    required
                                >
                                    <option value="" disabled>Select a Course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} (ID: {course.id})
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Question <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Answer */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Answer <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="answer"
                                value={formData.answer}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Submit Button (Mobile) */}
                <div className="block sm:hidden">
                    <button
                        type="submit"
                        disabled={saving || !formData.course}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update FAQ
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

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

    // Styles matching AddCourse component
    const inputStyle = {
        width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb",
        borderRadius: 10, fontSize: 13, color: "#111827", background: "#f9fafb",
        outline: "none", boxSizing: "border-box", fontFamily: "inherit",
        transition: "border-color 0.15s, background 0.15s",
    };
    
    const labelStyle = { 
        display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 
    };
    
    const sectionStyle = {
        background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        overflow: "hidden", marginBottom: 20,
    };
    
    const sectionHeaderStyle = {
        padding: "16px 24px", borderBottom: "1px solid #f3f4f6", background: "#fafafa",
        display: "flex", alignItems: "center", gap: 10,
    };
    
    const sectionDotStyle = (color) => ({
        width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0,
    });

    if (loading) {
        return (
            <div style={{ 
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif", 
                background: "#f4f5f7", 
                minHeight: "100vh", 
                padding: "24px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
                <div style={{ textAlign: "center" }}>
                    <div style={{ 
                        width: 50, 
                        height: 50, 
                        border: "3px solid #e5e7eb", 
                        borderTopColor: "#2563eb", 
                        borderRadius: "50%", 
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 16px"
                    }} />
                    <p style={{ fontSize: 13, color: "#6b7280" }}>Loading FAQ details...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "24px 20px" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
                input:focus, textarea:focus, select:focus { 
                    border-color: #2563eb !important; 
                    background: #fff !important; 
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.08); 
                }
                .form-input:hover { border-color: #c7d2fe; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => navigate(-1)} type="button"
                        style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <ArrowLeft size={18} color="#374151" />
                    </button>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Edit FAQ</h1>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Update the frequently asked question</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => navigate(-1)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        <X size={15} /> Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving || !formData.course}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 10, background: saving ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: (saving || !formData.course) ? "not-allowed" : "pointer", minWidth: 140, justifyContent: "center" }}>
                        {saving ? (
                            <>
                                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                Updating...
                            </>
                        ) : (
                            <><Save size={15} /> Update FAQ</>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Alerts ── */}
            {error && (
                <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <AlertCircle size={14} color="#dc2626" />
                    </div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: 0 }}>Error</p>
                        <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>{error}</p>
                    </div>
                    <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={14} /></button>
                </div>
            )}
            
            {success && (
                <div style={{ marginBottom: 16, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckCircle size={14} color="#16a34a" />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", margin: 0 }}>✓ {success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* ── FAQ Information ── */}
                <div style={sectionStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={sectionDotStyle("#2563eb")} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>FAQ Information</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Required fields are marked with *</p>
                        </div>
                    </div>
                    
                    <div style={{ padding: 24 }}>
                        {/* Associated Course */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>
                                Related Course <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <div style={{ position: "relative" }}>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                    style={{ 
                                        ...inputStyle, 
                                        appearance: "none", 
                                        cursor: "pointer",
                                        paddingRight: 36
                                    }}
                                    required
                                >
                                    <option value="" disabled>Select a Course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} (ID: {course.id})
                                        </option>
                                    ))}
                                </select>
                                <div style={{ 
                                    position: "absolute", 
                                    right: 12, 
                                    top: "50%", 
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none",
                                    color: "#9ca3af"
                                }}>
                                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>
                                Question <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <input
                                className="form-input"
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                                placeholder="e.g., What is Python used for?"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Answer */}
                        <div>
                            <label style={labelStyle}>
                                Answer <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <textarea
                                name="answer"
                                value={formData.answer}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="Enter the comprehensive answer here..."
                                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 120 }}
                                required
                            />
                        </div>

                        {/* Preview Section */}
                        {formData.question && formData.answer && (
                            <div style={{ 
                                marginTop: 24,
                                background: "#f9fafb", 
                                borderRadius: 12, 
                                padding: 16,
                                border: "1px solid #e5e7eb"
                            }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Preview
                                </p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 6px 0" }}>
                                    Q: {formData.question}
                                </p>
                                <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>
                                    A: {formData.answer}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Help Section ── */}
                <div style={sectionStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={sectionDotStyle("#10b981")} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Editing Tips</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Guidelines for updating FAQs</p>
                        </div>
                    </div>
                    
                    <div style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: 10, 
                                background: "#e6f7e6", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                <HelpCircle size={16} color="#10b981" />
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#4b5563", lineHeight: 1.8 }}>
                                <li>Make the question concise and from the user's perspective.</li>
                                <li>Provide a direct, clear, and comprehensive answer.</li>
                                <li>Ensure the FAQ is assigned to the correct related course.</li>
                                <li>Changes will be saved immediately after clicking Update.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── Footer Actions ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
                    <button type="button" onClick={() => navigate(-1)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        <X size={15} /> Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving || !formData.course}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 24px", border: "none", borderRadius: 10, background: (saving || !formData.course) ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: (saving || !formData.course) ? "not-allowed" : "pointer", minWidth: 140, justifyContent: "center" }}>
                        {saving ? (
                            <>
                                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                Updating...
                            </>
                        ) : (
                            <><Save size={15} /> Update FAQ</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  BookOpen,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Layers,
  Hash,
  Info,
} from "lucide-react";

export default function AddModule() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state matching API format
  const [formData, setFormData] = useState({
    name: "",
    course_data: ""
  });

  // Fetch courses for dropdown (optional - you can let user enter ID directly)
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch available courses (optional feature)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch("https://codingcloud.pythonanywhere.com/course/");
        const data = await response.json();
        
        if (data.success) {
          // Extract unique course IDs with names
          const courseList = data.data.map(course => ({
            id: course.id,
            name: course.name
          }));
          setCourses(courseList);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError("");
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Module name is required";
    }
    if (!formData.course_data) {
      return "Course ID is required";
    }
    if (isNaN(formData.course_data) || parseInt(formData.course_data) <= 0) {
      return "Please enter a valid Course ID";
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

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for API
      const submitData = {
        name: formData.name.trim(),
        course_data: parseInt(formData.course_data)
      };

      console.log("Submitting module data:", submitData);

      // Make API request
      const response = await fetch("https://codingcloud.pythonanywhere.com/modules/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok || response.status === 201) {
        setSuccess("Module created successfully!");
        // Reset form
        setFormData({
          name: "",
          course_data: ""
        });
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/modules");
        }, 2000);
      } else {
        setError(data.message || data.detail || "Failed to create module. Please try again.");
      }
    } catch (err) {
      console.error("Error creating module:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 13,
    color: "#111827",
    background: "#f9fafb",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s, background 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  };

  const sectionStyle = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    overflow: "hidden",
    marginBottom: 20,
  };

  const sectionHeaderStyle = {
    padding: "16px 24px",
    borderBottom: "1px solid #f3f4f6",
    background: "#fafafa",
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const sectionDotStyle = (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  });

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#f4f5f7",
      minHeight: "100vh",
      padding: "24px 20px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        input:focus, textarea:focus, select:focus {
          border-color: #2563eb !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }
        .form-input:hover {
          border-color: #c7d2fe;
        }
        @media (max-width: 640px) {
          .header-actions {
            flex-direction: column !important;
            width: 100%;
          }
          .header-actions button {
            width: 100%;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/modules")}
            type="button"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
            }}
          >
            <ArrowLeft size={18} color="#374151" />
          </button>
          <div>
            <h1 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
              margin: 0
            }}>Add New Module</h1>
            <p style={{
              fontSize: 12,
              color: "#9ca3af",
              margin: "2px 0 0"
            }}>Create a new module for your course</p>
          </div>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate("/modules")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#fff",
              color: "#374151",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <X size={15} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              border: "none",
              borderRadius: 10,
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              minWidth: 130,
              justifyContent: "center"
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Save Module</>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          marginBottom: 16,
          padding: "12px 16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <AlertCircle size={14} color="#dc2626" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: 0 }}>Error</p>
            <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af"
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div style={{
          marginBottom: 16,
          padding: "12px 16px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <CheckCircle size={14} color="#16a34a" />
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", margin: 0 }}>
            ✓ {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Module Information Section */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#2563eb")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
                Module Information
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Required fields are marked with *
              </p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            {/* Module Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Module Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Module 1 - Introduction to Python"
                style={inputStyle}
                required
              />
              <p style={{
                fontSize: 11,
                color: "#9ca3af",
                marginTop: 5,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}>
                <Info size={10} /> Enter a descriptive name for the module
              </p>
            </div>

            {/* OR Option 2: Course Dropdown (Optional) - KEPT AS ORIGINAL */}
            {courses.length > 0 && (
              <div style={{
                marginTop: 16,
                paddingTop: 20,
                borderTop: "1px solid #f3f4f6"
              }}>
                <label style={labelStyle}>
                  <BookOpen size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                  Or select from existing courses:
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({
                        ...prev,
                        course_data: e.target.value
                      }));
                    }
                  }}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">-- Select a course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.id}: {course.name}
                    </option>
                  ))}
                </select>
                <p style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 5
                }}>
                  Select from list to auto-fill Course ID
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section - Updated to show Course ID */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#8b5cf6")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
                Module Preview
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Preview of your module details
              </p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            <div style={{
              background: "#f8fafc",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #e5e7eb"
            }}>
              {formData.name || formData.course_data ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#e0f2fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Layers size={16} color="#0284c7" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>Module</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                        {formData.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#fef3c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Hash size={16} color="#d97706" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>Course ID</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                        {formData.course_data || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px"
                  }}>
                    <Layers size={20} color="#9ca3af" />
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                    Fill in the fields to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#10b981")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
                Module Creation Tips
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Best practices for creating modules
              </p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            <div style={{
              background: "#f0f9ff",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #bae6fd"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  <HelpCircle size={16} color="#0284c7" />
                </div>
                <div>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0369a1",
                    margin: "0 0 8px"
                  }}>
                    Module Creation Best Practices
                  </p>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: 12,
                    color: "#075985",
                    lineHeight: 1.8
                  }}>
                    <li>Module names should be descriptive and unique within a course</li>
                    <li>Course ID must be a valid existing course ID</li>
                    <li>You can find Course IDs in the Courses section</li>
                    <li>Example formats: "Module 1 - Introduction", "Chapter 2: Basics"</li>
                    <li>Modules help organize course content into manageable sections</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          paddingTop: 4
        }}>
          <button
            type="button"
            onClick={() => navigate("/modules")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "11px 22px",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#fff",
              color: "#374151",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <X size={15} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "11px 24px",
              border: "none",
              borderRadius: 10,
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              minWidth: 140,
              justifyContent: "center"
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Save Module</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
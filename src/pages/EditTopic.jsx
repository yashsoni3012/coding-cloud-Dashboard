import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

export default function EditTopic() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const locationState = location.state;

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

        // Fetch courses
        const coursesResponse = await fetch(
          "https://codingcloud.pythonanywhere.com/course/",
        );
        const coursesData = await coursesResponse.json();

        // Fetch specific topic
        let topicData = null;
        if (locationState && locationState.topic) {
          topicData = locationState.topic;
        } else if (id) {
          // If not in state, fetch all topics and find it
          const topicsResponse = await fetch("https://codingcloud.pythonanywhere.com/topics/");
          if (topicsResponse.ok) {
            const allTopicsData = await topicsResponse.json();
            if (allTopicsData.status === "success" && allTopicsData.data) {
              // topicsData.data is array of modules, each has a topics array
              for (const mod of allTopicsData.data) {
                const found = mod.topics.find((t) => t.id === parseInt(id));
                if (found) {
                  topicData = {
                    ...found,
                    module_id: mod.module_id,
                    module_name: mod.module_name
                  };
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

        if (coursesData.success) {
          setCourses(coursesData.data);
        }

        // Pre-fill form if topic data exists
        if (topicData) {
          const name = topicData.name || "";
          let modId = topicData.module_id || topicData.module || "";

          setFormData({
            module_id: modId ? modId.toString() : "",
            name: name,
          });

          // Try to set course if module ID is available
          if (modId) {
            const mod = modulesData.data?.find((m) => m.id === parseInt(modId));
            if (mod && mod.course_data) {
              setSelectedCourse(mod.course_data.toString());
            }
          }
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load modules, courses or topic. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

      // Based on available endpoints, it seems the correct pattern is /topics/<id>/
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/topics/${id}/`,
        {
          method: "PUT",
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

      setSuccess("Topic updated successfully!");

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
      console.error("Error updating topic:", err);
      setError(
        err.message ||
        "Failed to update topic. Please check the API endpoint.",
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
          <p style={{ fontSize: 13, color: "#6b7280" }}>Loading topic details...</p>
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
          <button onClick={() => navigate("/topics")} type="button"
            style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <ArrowLeft size={18} color="#374151" />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Edit Topic</h1>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Update topic details</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => navigate("/topics")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <X size={15} /> Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 10, background: saving ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", minWidth: 140, justifyContent: "center" }}>
            {saving ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Update Topic</>
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
        {/* ── Topic Information ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#2563eb")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Topic Information</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Required fields are marked with *</p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            {/* Topic Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Topic Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to React, HTML Basics, JavaScript Fundamentals"
                style={inputStyle}
                required
              />
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                Enter a descriptive name for the topic
              </p>
            </div>

            {/* Course Selection Dropdown */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                <Layers size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle", color: "#6b7280" }} />
                Select Course <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
              >
                <option value="">-- First select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id}: {course.name} (
                    {course.category_details?.name || "No Category"})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                Select a course to filter available modules
              </p>
            </div>

            {/* Module Selection Dropdown */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                <BookOpen size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle", color: "#6b7280" }} />
                Select Module <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                name="module_id"
                value={formData.module_id}
                onChange={handleInputChange}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer", background: !selectedCourse ? "#f3f4f6" : "#f9fafb" }}
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
                <p style={{ fontSize: 11, color: "#d97706", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={11} color="#d97706" />
                  Please select a course first to see available modules
                </p>
              )}
              
              {selectedCourse && filteredModules.length === 0 && (
                <p style={{ fontSize: 11, color: "#d97706", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={11} color="#d97706" />
                  No modules found for this course
                </p>
              )}
            </div>

            {/* Selected Information Preview */}
            {formData.module_id && (
              <div style={{ 
                background: "#eff6ff", 
                borderRadius: 10, 
                padding: "16px",
                marginTop: 8,
                border: "1px solid #dbeafe"
              }}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: "#1e40af", margin: "0 0 10px 0" }}>
                  Selected Information:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <p style={{ fontSize: 12, color: "#1e40af", margin: 0 }}>
                    <span style={{ fontWeight: 600 }}>Topic:</span>{" "}
                    {formData.name || "Not specified"}
                  </p>
                  <p style={{ fontSize: 12, color: "#1e40af", margin: 0 }}>
                    <span style={{ fontWeight: 600 }}>Module:</span>{" "}
                    {getModuleDetails(formData.module_id)?.moduleName}
                  </p>
                  <p style={{ fontSize: 12, color: "#1e40af", margin: 0 }}>
                    <span style={{ fontWeight: 600 }}>Course:</span>{" "}
                    {getModuleDetails(formData.module_id)?.courseName} (ID:{" "}
                    {getModuleDetails(formData.module_id)?.courseId})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Help Section ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#10b981")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Topic Update Tips</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Guidelines for updating topics</p>
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

        {/* ── Footer Actions ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
          <button type="button" onClick={() => navigate("/topics")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <X size={15} /> Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 24px", border: "none", borderRadius: 10, background: saving ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", minWidth: 140, justifyContent: "center" }}>
            {saving ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Update Topic</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
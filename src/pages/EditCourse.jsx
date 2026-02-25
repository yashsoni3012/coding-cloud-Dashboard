import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Image,
  FileText,
  Clock,
  BookOpen,
  Users,
  Signal,
  Globe,
  Award,
  HelpCircle,
} from "lucide-react";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  // Form state matching exact API format
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    category: "",
    text: "",
    duration: "",
    lecture: "",
    students: "",
    level: "",
    language: "",
    certificate: "No",
    meta_title: "",
    meta_description: "",
    keywords: "",
    // File states
    image: null,
    banner_img: null,
    pdf_file: null,
    icon: null,
    // Existing file URLs (for display)
    existing_image: "",
    existing_banner: "",
    existing_icon: "",
    existing_pdf: "",
  });

  // Preview URLs for new files
  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [pdfName, setPdfName] = useState("");

  // Track which files have been changed
  const [filesChanged, setFilesChanged] = useState({
    image: false,
    banner_img: false,
    icon: false,
    pdf_file: false,
  });

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const response = await fetch(
          `https://codingcloud.pythonanywhere.com/course/${id}/`,
        );
        const data = await response.json();

        if (data.success) {
          const course = data.data;
          setFormData({
            id: course.id,
            name: course.name || "",
            slug: course.slug || "",
            category: course.category || "",
            text: course.text || "",
            duration: course.duration || "",
            lecture: course.lecture || "",
            students: course.students || "",
            level: course.level || "",
            language: course.language || "",
            certificate: course.certificate || "No",
            meta_title: course.meta_title || "",
            meta_description: course.meta_description || "",
            keywords: course.keywords || "",
            image: null,
            banner_img: null,
            pdf_file: null,
            icon: null,
            existing_image: course.image || "",
            existing_banner: course.banner_img || "",
            existing_icon: course.icon || "",
            existing_pdf: course.pdf_file || "",
          });
        } else {
          setError("Failed to fetch course details");
        }

        // Fetch categories
        setCategories([
          { id: 40, name: "IT and Software" },
          { id: 43, name: "Mobile Application" },
          { id: 54, name: "check123" },
        ]);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
    if (name === "name" && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setFilesChanged((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Create preview URLs for images
      if (name === "image") {
        setImagePreview(URL.createObjectURL(file));
      } else if (name === "banner_img") {
        setBannerPreview(URL.createObjectURL(file));
      } else if (name === "icon") {
        setIconPreview(URL.createObjectURL(file));
      } else if (name === "pdf_file") {
        setPdfName(file.name);
      }
    }
  };

  // Remove file
  const removeFile = (field, isExisting = false) => {
    if (isExisting) {
      // Mark existing file for deletion
      setFormData((prev) => ({
        ...prev,
        [`existing_${field}`]: "",
      }));
      setFilesChanged((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      // Remove new file
      setFormData((prev) => ({
        ...prev,
        [field]: null,
      }));
      setFilesChanged((prev) => ({
        ...prev,
        [field]: true,
      }));

      if (field === "image") {
        setImagePreview("");
        document.getElementById("image-upload").value = "";
      } else if (field === "banner_img") {
        setBannerPreview("");
        document.getElementById("banner-upload").value = "";
      } else if (field === "icon") {
        setIconPreview("");
        document.getElementById("icon-upload").value = "";
      } else if (field === "pdf_file") {
        setPdfName("");
        document.getElementById("pdf-upload").value = "";
      }
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return "Course name is required";
    if (!formData.slug.trim()) return "Course slug is required";
    if (!formData.category) return "Category is required";
    if (!formData.text.trim()) return "Description is required";
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
      // Create FormData for multipart/form-data
      const submitData = new FormData();

      // Append all text fields
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      submitData.append("category", formData.category);
      submitData.append("text", formData.text);

      if (formData.duration) submitData.append("duration", formData.duration);
      if (formData.lecture) submitData.append("lecture", formData.lecture);
      if (formData.students) submitData.append("students", formData.students);
      if (formData.level) submitData.append("level", formData.level);
      if (formData.language) submitData.append("language", formData.language);

      submitData.append(
        "certificate",
        formData.certificate === "Yes" ? "Yes" : "No",
      );

      if (formData.meta_title)
        submitData.append("meta_title", formData.meta_title);
      if (formData.meta_description)
        submitData.append("meta_description", formData.meta_description);
      if (formData.keywords) submitData.append("keywords", formData.keywords);

      // Append new files if they exist
      if (formData.image) submitData.append("image", formData.image);
      if (formData.banner_img)
        submitData.append("banner_img", formData.banner_img);
      if (formData.pdf_file) submitData.append("pdf_file", formData.pdf_file);
      if (formData.icon) submitData.append("icon", formData.icon);

      // Make API request (PATCH request for update)
      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/course/${id}/`,
        {
          method: "PATCH",
          body: submitData,
        },
      );

      const data = await response.json();

      if (response.ok || response.status === 200) {
        setSuccess("Course updated successfully!");
        setTimeout(() => {
          navigate("/course");
        }, 2000);
      } else {
        setError(
          data.message ||
            data.detail ||
            "Failed to update course. Please try again.",
        );
      }
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSaving(false);
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

  const UploadBox = ({
    preview,
    onRemove,
    inputId,
    inputName,
    accept,
    label,
    hint,
    isSmall,
    existingUrl,
  }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div
        style={{
          border: "1.5px dashed #d1d5db",
          borderRadius: 12,
          padding: isSmall ? "20px 16px" : "24px 16px",
          textAlign: "center",
          background: "#f9fafb",
          position: "relative",
          transition: "border-color 0.15s",
        }}
      >
        {preview || existingUrl ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={
                preview ||
                `https://codingcloud.pythonanywhere.com${existingUrl}`
              }
              alt="preview"
              style={{
                maxHeight: isSmall ? 80 : 140,
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            />
            <button
              type="button"
              onClick={onRemove}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#ef4444",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(239,68,68,0.4)",
              }}
            >
              <X size={12} color="#fff" />
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <Upload size={20} color="#2563eb" />
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#374151",
                margin: "0 0 4px",
                fontWeight: 500,
              }}
            >
              Click to upload
            </p>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px" }}>
              {hint}
            </p>
            <label
              htmlFor={inputId}
              style={{
                display: "inline-block",
                padding: "7px 18px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Browse File
            </label>
          </>
        )}
        <input
          type="file"
          name={inputName}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );

  const PdfBox = () => (
    <div>
      <label style={labelStyle}>Syllabus PDF</label>
      <div
        style={{
          border: "1.5px dashed #d1d5db",
          borderRadius: 12,
          padding: "24px 16px",
          textAlign: "center",
          background: "#f9fafb",
        }}
      >
        {pdfName || formData.existing_pdf ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={18} color="#ef4444" />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#374151",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {pdfName || formData.existing_pdf?.split("/").pop()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeFile("pdf_file", !pdfName)}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#ef4444",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={12} color="#fff" />
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <FileText size={20} color="#ef4444" />
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#374151",
                margin: "0 0 4px",
                fontWeight: 500,
              }}
            >
              Upload Syllabus
            </p>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px" }}>
              PDF only, up to 10MB
            </p>
            <label
              htmlFor="pdf-upload"
              style={{
                display: "inline-block",
                padding: "7px 18px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Browse PDF
            </label>
          </>
        )}
        <input
          type="file"
          name="pdf_file"
          accept=".pdf"
          onChange={handleFileChange}
          id="pdf-upload"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Loading course data...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f4f5f7",
        minHeight: "100vh",
        padding: "24px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        input:focus, textarea:focus, select:focus { border-color: #2563eb !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .form-input:hover { border-color: #c7d2fe; }
        @media (max-width: 640px) {
          .details-grid { grid-template-columns: 1fr 1fr !important; }
          .media-grid { grid-template-columns: 1fr !important; }
          .header-actions { flex-direction: column !important; }
        }
        @media (max-width: 400px) {
          .details-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/course")}
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
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <ArrowLeft size={18} color="#374151" />
          </button>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Edit Course
            </h1>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>
              Update course information • ID: {id}
            </p>
          </div>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate("/course")}
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
              cursor: "pointer",
            }}
          >
            <X size={15} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              border: "none",
              borderRadius: 10,
              background: saving ? "#93c5fd" : "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              minWidth: 130,
              justifyContent: "center",
            }}
          >
            {saving ? (
              <>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Update Course
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={14} color="#dc2626" />
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#dc2626",
                margin: 0,
              }}
            >
              Error
            </p>
            <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>
              {error}
            </p>
          </div>
          <button
            onClick={() => setError("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
      {success && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Save size={14} color="#16a34a" />
          </div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#16a34a",
              margin: 0,
            }}
          >
            ✓ {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Basic Information ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#2563eb")} />
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111827",
                }}
              >
                Basic Information
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Required fields are marked with *
              </p>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Course Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Advanced React Development"
                style={inputStyle}
                required
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Slug <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    padding: "10px 14px",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRight: "none",
                    borderRadius: "10px 0 0 10px",
                    fontSize: 12,
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  /course/
                </span>
                <input
                  className="form-input"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="advanced-react-development"
                  style={{
                    ...inputStyle,
                    borderRadius: "0 10px 10px 0",
                    flex: 1,
                  }}
                  required
                />
              </div>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                URL-friendly version of the name. Auto-generated from course
                name.
              </p>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Category <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (ID: {cat.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                Description <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                rows={4}
                placeholder="Detailed description of the course..."
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                required
              />
            </div>
          </div>
        </div>

        {/* ── Course Details ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#8b5cf6")} />
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111827",
                }}
              >
                Course Details
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Additional information about the course (optional)
              </p>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <div
              className="details-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {[
                {
                  icon: Clock,
                  label: "Duration",
                  name: "duration",
                  placeholder: "e.g., 40 hours",
                  type: "input",
                },
                {
                  icon: BookOpen,
                  label: "Lectures",
                  name: "lecture",
                  placeholder: "e.g., 98 lectures",
                  type: "input",
                },
                {
                  icon: Users,
                  label: "Students",
                  name: "students",
                  placeholder: "e.g., 1000",
                  type: "input",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label style={labelStyle}>
                    <field.icon
                      size={12}
                      style={{
                        display: "inline",
                        marginRight: 5,
                        verticalAlign: "middle",
                        color: "#6b7280",
                      }}
                    />
                    {field.label}
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Level */}
              <div>
                <label style={labelStyle}>
                  <Signal
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: 5,
                      verticalAlign: "middle",
                      color: "#6b7280",
                    }}
                  />
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label style={labelStyle}>
                  <Globe
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: 5,
                      verticalAlign: "middle",
                      color: "#6b7280",
                    }}
                  />
                  Language
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g., English"
                  style={inputStyle}
                />
              </div>

              {/* Certificate */}
              <div>
                <label style={labelStyle}>
                  <Award
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: 5,
                      verticalAlign: "middle",
                      color: "#6b7280",
                    }}
                  />
                  Certificate
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["No", "Yes"].map((val) => (
                    <label
                      key={val}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "10px",
                        border: `1.5px solid ${formData.certificate === val ? "#2563eb" : "#e5e7eb"}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        background:
                          formData.certificate === val ? "#eff6ff" : "#f9fafb",
                        fontSize: 13,
                        fontWeight: 600,
                        color:
                          formData.certificate === val ? "#2563eb" : "#374151",
                        transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="radio"
                        name="certificate"
                        value={val}
                        checked={formData.certificate === val}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            certificate: e.target.value,
                          }));
                        }}
                        style={{ display: "none" }}
                      />
                      {val === "Yes" ? <Award size={13} /> : <X size={13} />}
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Media Files ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#f59e0b")} />
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111827",
                }}
              >
                Media Files
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Upload new files to replace existing ones
              </p>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <div
              className="media-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <UploadBox
                preview={imagePreview}
                existingUrl={formData.existing_image}
                onRemove={() => removeFile("image", !imagePreview)}
                inputId="image-upload"
                inputName="image"
                accept="image/*"
                label="Course Image"
                hint="PNG, JPG up to 5MB"
              />
              <UploadBox
                preview={bannerPreview}
                existingUrl={formData.existing_banner}
                onRemove={() => removeFile("banner_img", !bannerPreview)}
                inputId="banner-upload"
                inputName="banner_img"
                accept="image/*"
                label="Banner Image"
                hint="PNG, JPG up to 5MB"
              />
              <UploadBox
                preview={iconPreview}
                existingUrl={formData.existing_icon}
                onRemove={() => removeFile("icon", !iconPreview)}
                inputId="icon-upload"
                inputName="icon"
                accept="image/*"
                label="Course Icon"
                hint="PNG, JPG up to 2MB"
                isSmall
              />
              <PdfBox />
            </div>
          </div>
        </div>

        {/* ── SEO ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#10b981")} />
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111827",
                }}
              >
                SEO & Metadata
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                For search engine optimization (optional)
              </p>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Meta Title</label>
              <input
                className="form-input"
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO title for the course"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Meta Description</label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows={3}
                placeholder="SEO description for search engines"
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
            <div>
              <label style={labelStyle}>Keywords</label>
              <input
                className="form-input"
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="react, javascript, web development"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                Comma-separated keywords for search
              </p>
            </div>
          </div>
        </div>

        {/* ── Help Section ── */}
        <div
          style={{
            background: "#eff6ff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            border: "1px solid #dbeafe",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <HelpCircle
              size={18}
              color="#2563eb"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1e40af",
                  margin: "0 0 4px",
                }}
              >
                Editing Tips
              </p>
              <ul
                style={{
                  fontSize: 12,
                  color: "#2563eb",
                  margin: 0,
                  paddingLeft: 16,
                }}
              >
                <li>
                  Fields marked with <span style={{ color: "#dc2626" }}>*</span>{" "}
                  are required
                </li>
                <li>Upload new files to replace existing ones</li>
                <li>
                  Changes will be saved using PATCH method (partial update)
                </li>
                <li>Category ID must match existing categories</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            paddingTop: 4,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/course")}
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
              cursor: "pointer",
            }}
          >
            <X size={15} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "11px 24px",
              border: "none",
              borderRadius: 10,
              background: saving ? "#93c5fd" : "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              minWidth: 140,
              justifyContent: "center",
            }}
          >
            {saving ? (
              <>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Update Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

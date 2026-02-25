import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Calendar,
  Tag,
  HelpCircle,
} from "lucide-react";

export default function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const locationState = location.state;
  const fileInputRef = useRef(null);

  // State for form data exactly matching API requirements
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    short_description: "",
    status: "", // default
    publish_date: "", // YYYY-MM-DD
    meta_title: "",
    meta_descrtiption: "", // spelled this way as per the API doc
    meta_keyword: "",
    hashtag: "",
    featured_image: null,
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  // Status Options
  const statusOptions = ["Drafts", "Published", "Scheduled"];

  // Styles matching AddCourse component
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        let blogData = null;

        if (locationState && locationState.blog) {
          blogData = locationState.blog;
        } else {
          const response = await fetch(
            "https://codingcloud.pythonanywhere.com/blogs/",
          );
          if (response.ok) {
            const dataRes = await response.json();
            const listData = dataRes.data || dataRes;
            blogData = Array.isArray(listData)
              ? listData.find((b) => b.id === parseInt(id))
              : null;
          }
        }

        if (blogData) {
          setFormData({
            title: blogData.title || "",
            content: blogData.content || "",
            slug: blogData.slug || "",
            short_description: blogData.short_description || "",
            status: blogData.status || "Drafts",
            publish_date: blogData.publish_date
              ? blogData.publish_date.split("T")[0]
              : "",
            meta_title: blogData.meta_title || "",
            meta_descrtiption: blogData.meta_descrtiption || "",
            meta_keyword: blogData.meta_keyword || "",
            hashtag: blogData.hashtag || "",
            featured_image: null, // Only set File object on explicit change
          });

          if (blogData.featured_image) {
            const fullImageUrl = `https://codingcloud.pythonanywhere.com${blogData.featured_image}`;
            setImagePreview(fullImageUrl);
            setOriginalImage(fullImageUrl);
          }
        } else {
          setError("Blog not found.");
        }
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
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

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        featured_image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      featured_image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const restoreOriginalImage = () => {
    setFormData((prev) => ({
      ...prev,
      featured_image: null,
    }));
    setImagePreview(originalImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.content.trim()) return "Content is required";
    if (!formData.slug.trim()) return "Slug is required";
    if (!formData.status) return "Status is required";
    if (!formData.publish_date) return "Publish date is required";
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
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("content", formData.content.trim());
      payload.append("slug", formData.slug.trim());

      if (formData.short_description !== undefined) {
        payload.append("short_description", formData.short_description.trim());
      }

      payload.append("status", formData.status);

      // Keep date format robust
      const formattedDate = formData.publish_date.includes("T")
        ? formData.publish_date
        : `${formData.publish_date}T00:00:00Z`;
      payload.append("publish_date", formattedDate);

      if (formData.meta_title !== undefined)
        payload.append("meta_title", formData.meta_title.trim());
      if (formData.meta_descrtiption !== undefined)
        payload.append("meta_descrtiption", formData.meta_descrtiption.trim());
      if (formData.meta_keyword !== undefined)
        payload.append("meta_keyword", formData.meta_keyword.trim());
      if (formData.hashtag !== undefined)
        payload.append("hashtag", formData.hashtag.trim());

      // Only append if it's explicitly a new image.
      if (formData.featured_image && formData.featured_image instanceof File) {
        payload.append("featured_image", formData.featured_image);
      }

      const response = await fetch(
        `https://codingcloud.pythonanywhere.com/blogs/${id}/`,
        {
          method: "PATCH",
          body: payload,
        },
      );

      // If the response is not ok, parse error
      if (!response.ok) {
        let errorMessage;
        try {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          errorMessage = `HTTP error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      setSuccess("Blog updated successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/blogs");
      }, 2000);
    } catch (err) {
      console.error("Error updating blog:", err);
      setError(
        err.message || "Failed to update blog. Please check your connection.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          background: "#f4f5f7",
          minHeight: "100vh",
          padding: "24px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 50,
              height: 50,
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Loading blog details...
          </p>
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
                input:focus, textarea:focus, select:focus { 
                    border-color: #2563eb !important; 
                    background: #fff !important; 
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.08); 
                }
                .form-input:hover { border-color: #c7d2fe; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                @media (max-width: 1024px) {
                    .blog-grid { grid-template-columns: 1fr !important; }
                }
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
            onClick={() => navigate(-1)}
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
              Edit Blog
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
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
                Updating...
              </>
            ) : (
              <>
                <Save size={15} /> Update Blog
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
            <AlertCircle size={14} color="#dc2626" />
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
            <CheckCircle size={14} color="#16a34a" />
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
          }}
          className="blog-grid"
        >
          {/* Left Column - Main Content */}
          <div>
            {/* ── General Information ── */}
            <div style={sectionStyle}>
              <div style={{ padding: 24 }}>
                {/* Title */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>
                    Blog Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter the title of the blog post"
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Slug */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>
                    Slug / URL Path <span style={{ color: "#ef4444" }}>*</span>
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
                      /blog/
                    </span>
                    <input
                      className="form-input"
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        // Enforce lowercase and hyphens
                        const val = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-");
                        setFormData((prev) => ({ ...prev, slug: val }));
                      }}
                      placeholder="how-to-learn-react"
                      style={{
                        ...inputStyle,
                        borderRadius: "0 10px 10px 0",
                        flex: 1,
                      }}
                      required
                    />
                  </div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                    URL-friendly version of the title. Use lowercase letters and
                    hyphens.
                  </p>
                </div>

                {/* Short Description */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Short Description</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="A brief summary of the blog post"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Main Content */}
                <div>
                  <label style={labelStyle}>
                    Content <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    placeholder="Write the full content of the blog post here..."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                      minHeight: 200,
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ── SEO & Meta Fields ── */}
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
                    SEO & Meta Fields
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                    For search engine optimization (optional)
                  </p>
                </div>
              </div>

              <div style={{ padding: 24 }}>
                {/* Meta Title */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Meta Title</label>
                  <input
                    className="form-input"
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title for the blog"
                    style={inputStyle}
                  />
                </div>

                {/* Meta Description (misspelled to match API) */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea
                    name="meta_descrtiption"
                    value={formData.meta_descrtiption}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="SEO description for search engines"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Meta Keywords */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Meta Keywords</label>
                  <input
                    className="form-input"
                    type="text"
                    name="meta_keyword"
                    value={formData.meta_keyword}
                    onChange={handleInputChange}
                    placeholder="comma, separated, keywords"
                    style={inputStyle}
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label style={labelStyle}>Hashtags</label>
                  <input
                    className="form-input"
                    type="text"
                    name="hashtag"
                    value={formData.hashtag}
                    onChange={handleInputChange}
                    placeholder="#coding #cloud"
                    style={inputStyle}
                  />
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                    Space-separated hashtags for social media
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* ── Publishing ── */}
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
                    Publishing
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                    Status and scheduling
                  </p>
                </div>
              </div>

              <div style={{ padding: 24 }}>
                {/* Status */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>
                    Status <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        cursor: "pointer",
                        paddingRight: 36,
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#9ca3af",
                      }}
                    >
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Publish Date */}
                <div>
                  <label style={labelStyle}>
                    Publish Date <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="publish_date"
                    value={formData.publish_date}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ── Featured Image ── */}
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
                    Featured Image
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                    Upload or change image
                  </p>
                </div>
              </div>

              <div style={{ padding: 24 }}>
                <div>
                  <label style={labelStyle}>Blog Image</label>
                  <div
                    style={{
                      border: imagePreview
                        ? "1.5px solid #d1d5db"
                        : "1.5px dashed #d1d5db",
                      borderRadius: 12,
                      padding: imagePreview ? "16px" : "24px 16px",
                      textAlign: "center",
                      background: imagePreview ? "#fff" : "#f9fafb",
                      position: "relative",
                      transition: "border-color 0.15s",
                      cursor: "pointer",
                    }}
                    onClick={triggerFileInput}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleImageChange({
                          target: { files: e.dataTransfer.files },
                        });
                      }
                    }}
                  >
                    {imagePreview ? (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: "100%",
                            maxHeight: 200,
                            borderRadius: 10,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=Error";
                          }}
                        />
                        <div
                          style={{
                            marginTop: 12,
                            display: "flex",
                            justifyContent: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerFileInput();
                            }}
                            style={{
                              fontSize: 11,
                              color: "#2563eb",
                              cursor: "pointer",
                              padding: "4px 8px",
                              background: "#eff6ff",
                              borderRadius: 6,
                            }}
                          >
                            Change
                          </span>
                          {formData.featured_image && originalImage && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                restoreOriginalImage();
                              }}
                              style={{
                                fontSize: 11,
                                color: "#6b7280",
                                cursor: "pointer",
                                padding: "4px 8px",
                                background: "#f3f4f6",
                                borderRadius: 6,
                              }}
                            >
                              Restore
                            </span>
                          )}
                          {!formData.featured_image && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                              style={{
                                fontSize: 11,
                                color: "#ef4444",
                                cursor: "pointer",
                                padding: "4px 8px",
                                background: "#fee2e2",
                                borderRadius: 6,
                              }}
                            >
                              Remove
                            </span>
                          )}
                        </div>
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
                          <ImageIcon size={20} color="#2563eb" />
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
                        <p
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            margin: "0 0 12px",
                          }}
                        >
                          PNG, JPG or WEBP up to 5MB
                        </p>
                        <label
                          htmlFor="image-upload"
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
                      ref={fileInputRef}
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

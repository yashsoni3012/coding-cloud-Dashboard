import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Star,
  User,
  MessageSquare,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2,
  X,
  HelpCircle,
} from "lucide-react";

export default function AddTestimonial() {
  const navigate = useNavigate();

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    review: "",
    rating: 5,
    image: null,
    category: "", // Will be set after categories load
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

const fetchCategories = async () => {
  try {
    setCategoriesLoading(true);

    const response = await fetch(
      "https://codingcloud.pythonanywhere.com/category/"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    console.log("Categories data:", data);

    // FIX HERE ✅
    if (Array.isArray(data)) {
      setCategories(data);

      const defaultCategory =
        data.find((cat) => cat.id === 41) || data[0];

      if (defaultCategory) {
        setFormData((prev) => ({
          ...prev,
          category: defaultCategory.id,
        }));
      }
    } else {
      throw new Error("Invalid categories format");
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    setCategoriesError(
      "Failed to load categories. Please refresh the page."
    );
  } finally {
    setCategoriesLoading(false);
  }
};

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" || name === "category" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setError("");
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    document.getElementById("image-upload").value = "";
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.review.trim()) {
      setError("Review is required");
      return false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      setError("Rating must be between 1 and 5");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    return true;
  };

  // Handle rating click
  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();

      // Append all fields exactly as your API expects
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("review", formData.review.trim());
      formDataToSend.append("rating", formData.rating.toString());
      formDataToSend.append("category_id", formData.category.toString());

      // Append image if exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Log FormData contents for debugging
      console.log("Sending data:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/testimonials/",
        {
          method: "POST",
          body: formDataToSend,
          // Don't set Content-Type header - let browser set it with boundary
        },
      );

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Response text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Server returned invalid response");
      }

      if (response.ok) {
        setSuccess("Testimonial added successfully!");

        // Clear form after success
        setFormData({
          name: "",
          review: "",
          rating: 5,
          image: null,
          category: categories.find(cat => cat.id === 41)?.id || categories[0]?.id || "",
        });
        setImagePreview(null);
        if (document.getElementById("image-upload")) {
          document.getElementById("image-upload").value = "";
        }

        // Redirect back after showing success message
        setTimeout(() => {
          navigate("/testimonials");
        }, 1500);
      } else {
        setError(
          data.message ||
            data.error ||
            "Failed to add testimonial. Please try again.",
        );
      }
    } catch (err) {
      console.error("Error adding testimonial:", err);
      setError(
        err.message ||
          "Network error. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Render star rating selector
  const renderStarSelector = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                padding: 2,
                outline: "none",
                transition: "transform 0.15s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <Star
                size={24}
                fill={star <= (hoveredRating || formData.rating) ? "#fbbf24" : "none"}
                color={star <= (hoveredRating || formData.rating) ? "#fbbf24" : "#d1d5db"}
                style={{ transition: "all 0.15s" }}
              />
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
          ({formData.rating}/5)
        </span>
      </div>
    );
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

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
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Add New Testimonial</h1>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Share your customer's experience and feedback</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <X size={15} /> Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || categoriesLoading || !formData.category}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 10, background: (loading || categoriesLoading || !formData.category) ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: (loading || categoriesLoading || !formData.category) ? "not-allowed" : "pointer", minWidth: 140, justifyContent: "center" }}>
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Save Testimonial</>
            )}
          </button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {categoriesError && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertCircle size={14} color="#dc2626" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: 0 }}>Error</p>
            <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>{categoriesError}</p>
          </div>
          <button onClick={() => setCategoriesError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={14} /></button>
        </div>
      )}

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
        {/* ── Testimonial Information ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#2563eb")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Testimonial Information</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Required fields are marked with *</p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            {/* Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                <User size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle", color: "#6b7280" }} />
                Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                style={inputStyle}
                required
              />
            </div>

            {/* Rating */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                <Star size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle", color: "#6b7280" }} />
                Rating <span style={{ color: "#ef4444" }}>*</span>
              </label>
              {renderStarSelector()}
            </div>

            {/* Review */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                <MessageSquare size={12} style={{ display: "inline", marginRight: 5, verticalAlign: "middle", color: "#6b7280" }} />
                Review <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="Write the customer's review..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 100 }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>
                Category <span style={{ color: "#ef4444" }}>*</span>
              </label>
              {categoriesLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                  <div style={{ width: 16, height: 16, border: "2px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Loading categories...</span>
                </div>
              ) : (
                <>
                  <div style={{ position: "relative" }}>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{ 
                        ...inputStyle, 
                        appearance: "none", 
                        cursor: "pointer",
                        paddingRight: 36
                      }}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} {category.id === 41 ? "(Customer Service)" : ""}
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
                  
                  {/* Show selected category info */}
                  {formData.category && (
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>
                      Selected: {getCategoryName(formData.category)} (ID: {formData.category})
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Profile Image ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#f59e0b")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Profile Image</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Upload an image (optional)</p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            <div>
              <label style={labelStyle}>Upload Image</label>
              <div style={{
                border: imagePreview ? "1.5px solid #d1d5db" : "1.5px dashed #d1d5db",
                borderRadius: 12,
                padding: imagePreview ? "16px" : "24px 16px",
                textAlign: "center",
                background: imagePreview ? "#fff" : "#f9fafb",
                position: "relative",
                transition: "border-color 0.15s",
                cursor: "pointer"
              }}
              onClick={() => document.getElementById("image-upload")?.click()}>
                {imagePreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: 120, 
                        height: 120, 
                        borderRadius: 10, 
                        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                        objectFit: "cover"
                      }} 
                    />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
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
                        boxShadow: "0 2px 6px rgba(239,68,68,0.4)" 
                      }}>
                      <Trash2 size={12} color="#fff" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                      <ImageIcon size={20} color="#2563eb" />
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", margin: "0 0 4px", fontWeight: 500 }}>Click to upload</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px" }}>PNG, JPG, GIF or WEBP (Max 5MB)</p>
                    <label htmlFor="image-upload"
                      style={{ display: "inline-block", padding: "7px 18px", background: "#2563eb", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      Browse File
                    </label>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Help Section ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionDotStyle("#10b981")} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>Testimonial Tips</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Guidelines for creating effective testimonials</p>
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
                <li>Use real customer names for authenticity</li>
                <li>Include specific details about their experience</li>
                <li>Ratings should reflect the overall satisfaction</li>
                <li>Profile images help build trust with potential customers</li>
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
          <button onClick={handleSubmit} disabled={loading || categoriesLoading || !formData.category}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 24px", border: "none", borderRadius: 10, background: (loading || categoriesLoading || !formData.category) ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: (loading || categoriesLoading || !formData.category) ? "not-allowed" : "pointer", minWidth: 160, justifyContent: "center" }}>
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Saving...
              </>
            ) : (
              <><Save size={15} /> Save Testimonial</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
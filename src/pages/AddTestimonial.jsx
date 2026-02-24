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
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`${
                  star <= (hoveredRating || formData.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } transition-colors cursor-pointer`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-2">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/testimonials")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Testimonials</span>
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare size={28} />
              Add New Testimonial
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Share your customer's experience and feedback
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {categoriesError && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5" />
              <p className="text-red-700">{categoriesError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={18} className="text-indigo-600" />
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Rating Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star size={18} className="text-indigo-600" />
                Rating <span className="text-red-500">*</span>
              </label>
              {renderStarSelector()}
            </div>

            {/* Review Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare size={18} className="text-indigo-600" />
                Review <span className="text-red-500">*</span>
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="Write the customer's review..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Image Upload Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ImageIcon size={18} className="text-indigo-600" />
                Profile Image (Optional)
              </label>

              {imagePreview ? (
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-indigo-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF or WEBP (Max 5MB)
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              {categoriesLoading ? (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} {category.id === 41 ? "(Customer Service)" : ""}
                    </option>
                  ))}
                </select>
              )}
              
              {/* Show selected category info */}
              {formData.category && !categoriesLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {getCategoryName(formData.category)} (ID: {formData.category})
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/testimonials")}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                disabled={loading || categoriesLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || categoriesLoading || !formData.category}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Testimonial
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
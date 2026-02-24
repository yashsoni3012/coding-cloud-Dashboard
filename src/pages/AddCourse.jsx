import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronDown,
} from "lucide-react";

export default function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://codingcloud.pythonanywhere.com/category/",
        );

        const data = await response.json();

        console.log("Categories API:", data);

        // If API returns array
        setCategories(data);

        // If API returns {results: []} use below instead:
        // setCategories(data.results);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Form state matching exact API format
  const [formData, setFormData] = useState({
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
    // Files
    image: null,
    banner_img: null,
    pdf_file: null,
    icon: null,
  });

  // Preview URLs
  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [pdfName, setPdfName] = useState("");

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name (if slug field is empty or being auto-filled)
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
  const removeFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
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

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();

      // Append all text fields (only if they have values)
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      submitData.append("category", formData.category);
      submitData.append("text", formData.text);

      if (formData.duration) submitData.append("duration", formData.duration);
      if (formData.lecture) submitData.append("lecture", formData.lecture);
      if (formData.students) submitData.append("students", formData.students);
      if (formData.level) submitData.append("level", formData.level);
      if (formData.language) submitData.append("language", formData.language);

      submitData.append("certificate", formData.certificate);

      if (formData.meta_title)
        submitData.append("meta_title", formData.meta_title);
      if (formData.meta_description)
        submitData.append("meta_description", formData.meta_description);
      if (formData.keywords) submitData.append("keywords", formData.keywords);

      // Append files if they exist
      if (formData.image) submitData.append("image", formData.image);
      if (formData.banner_img)
        submitData.append("banner_img", formData.banner_img);
      if (formData.pdf_file) submitData.append("pdf_file", formData.pdf_file);
      if (formData.icon) submitData.append("icon", formData.icon);

      // Log FormData contents for debugging
      console.log("Submitting course data:");
      for (let pair of submitData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1]),
        );
      }

      // Make API request
      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/course/",
        {
          method: "POST",
          body: submitData,
          // Don't set Content-Type header - browser will set it with boundary
        },
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok || response.status === 201) {
        setSuccess("Course created successfully!");
        // Reset form after 2 seconds and redirect
        setTimeout(() => {
          navigate("/courses");
        }, 2000);
      } else {
        setError(
          data.message ||
            data.detail ||
            "Failed to create course. Please try again.",
        );
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/courses")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Course</h1>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details to create a new course
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Course
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <X size={16} className="text-red-600" />
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
            <Save size={16} className="text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Success!</h4>
            <p className="text-green-600 text-sm mt-0.5">{success}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Required fields are marked with *
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Advanced React Development"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm bg-gray-100 px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-300">
                  /course/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="advanced-react-development"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-r-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                URL-friendly version of the name. Auto-generated from course
                name.
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                rows="4"
                placeholder="Detailed description of the course..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                required
              />
            </div>
          </div>
        </div>

        {/* Course Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Course Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Additional information about the course (optional)
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Clock size={14} className="inline mr-1.5 text-gray-400" />
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 40 hours"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Lectures */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <BookOpen size={14} className="inline mr-1.5 text-gray-400" />
                  Lectures
                </label>
                <input
                  type="text"
                  name="lecture"
                  value={formData.lecture}
                  onChange={handleInputChange}
                  placeholder="e.g., 98 lectures"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Students */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Users size={14} className="inline mr-1.5 text-gray-400" />
                  Students
                </label>
                <input
                  type="text"
                  name="students"
                  value={formData.students}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Signal size={14} className="inline mr-1.5 text-gray-400" />
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Globe size={14} className="inline mr-1.5 text-gray-400" />
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g., English"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Award size={14} className="inline mr-1.5 text-gray-400" />
                  Certificate
                </label>
                <select
                  name="certificate"
                  value={formData.certificate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Media Files Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Media Files</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload course images and materials (optional)
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={14} className="inline mr-1.5" />
                  Course Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-gray-50">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("image")}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={36}
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload course image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  {!imagePreview && (
                    <label
                      htmlFor="image-upload"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                    >
                      Select Image
                    </label>
                  )}
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={14} className="inline mr-1.5" />
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-gray-50">
                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("banner_img")}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={36}
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload banner image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    name="banner_img"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="banner-upload"
                  />
                  {!bannerPreview && (
                    <label
                      htmlFor="banner-upload"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                    >
                      Select Banner
                    </label>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={14} className="inline mr-1.5" />
                  Course Icon
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-gray-50">
                  {iconPreview ? (
                    <div className="relative">
                      <img
                        src={iconPreview}
                        alt="Preview"
                        className="max-h-24 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("icon")}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={36}
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload icon
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 2MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    name="icon"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="icon-upload"
                  />
                  {!iconPreview && (
                    <label
                      htmlFor="icon-upload"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                    >
                      Select Icon
                    </label>
                  )}
                </div>
              </div>

              {/* PDF File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={14} className="inline mr-1.5" />
                  Syllabus PDF
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-gray-50">
                  {pdfName ? (
                    <div className="relative">
                      <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                        <FileText size={32} className="text-red-500" />
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                          {pdfName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("pdf_file")}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={36}
                        className="mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload PDF
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF files only, up to 10MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    name="pdf_file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  {!pdfName && (
                    <label
                      htmlFor="pdf-upload"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                    >
                      Select PDF
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Metadata Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">SEO & Metadata</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              For search engine optimization (optional)
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO title for the course"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows="3"
                placeholder="SEO description for search engines"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="react, javascript, web development"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Comma-separated keywords for search
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-indigo-900 mb-1">
                Quick Tips
              </h4>
              <ul className="text-xs text-indigo-700 space-y-1 list-disc list-inside">
                <li>
                  Fields marked with <span className="text-red-500">*</span> are
                  required
                </li>
                <li>
                  Slug should be URL-friendly (use hyphens instead of spaces)
                </li>
                <li>You can add media files now or edit the course later</li>
                <li>
                  Category ID must match existing categories (40: IT & Software,
                  43: Mobile App)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toasts from "../pages/Toasts"; // adjust path if needed
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Globe,
  Tag,
  Hash,
  ChevronDown,
  Search,
  Layers,
  HelpCircle,
} from "lucide-react";

// API function to create a page SEO entry
const createPageSeo = async (seoData) => {
  const response = await fetch(
    "https://codingcloud.pythonanywhere.com/page-seo/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seoData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.errors) {
        const backendErrors = {};
        Object.keys(errorData.errors).forEach((key) => {
          backendErrors[key] = errorData.errors[key].join(", ");
        });
        throw new Error(JSON.stringify(backendErrors));
      }
      errorMessage =
        errorData.message || errorData.detail || JSON.stringify(errorData);
    } catch {
      errorMessage = errorText || `HTTP error ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export default function AddSeo() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Page choices as provided
  const PAGE_CHOICES = [
    { value: "Home", label: "Home" },
    { value: "About_us", label: "About Us" },
    { value: "Course", label: "Course" },
    { value: "Course_category", label: "Course Category" },
    { value: "Blog", label: "Blog" },
    { value: "Faq", label: "FAQ" },
    { value: "Contact_us", label: "Contact Us" },
    { value: "Terms_of_service", label: "Terms of Service" },
    { value: "Privacy_policy", label: "Privacy Policy" },
  ];

  const [formData, setFormData] = useState({
    page_name: "Home",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // React Query mutation
  const mutation = useMutation({
    mutationFn: createPageSeo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageSeo"] });
      setToast({
        show: true,
        message: "SEO data saved successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/SEO"), 2000);
    },
    onError: (err) => {
      let errorMsg = err.message;
      try {
        const parsed = JSON.parse(errorMsg);
        if (typeof parsed === "object") {
          setFieldErrors(parsed);
          setToast({
            show: true,
            message: "Please correct the errors below",
            type: "error",
          });
          return;
        }
      } catch {
        // Not JSON
      }
      setToast({
        show: true,
        message: errorMsg,
        type: "error",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.page_name) errors.page_name = "Page name is required";
    if (!formData.meta_title.trim())
      errors.meta_title = "Meta title is required";
    if (!formData.meta_description.trim())
      errors.meta_description = "Meta description is required";
    if (!formData.meta_keywords.trim())
      errors.meta_keywords = "Meta keywords are required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({
        show: true,
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    const payload = {
      page_name: formData.page_name,
      meta_title: formData.meta_title.trim(),
      meta_description: formData.meta_description.trim(),
      meta_keywords: formData.meta_keywords.trim(),
    };
    mutation.mutate(payload);
  };

  // Section Header component
  const SectionHeader = ({
    icon: Icon,
    label,
    iconBg,
    iconColor,
    description,
    badge,
  }) => (
    <div className="flex items-center gap-3 pt-2">
      <div
        className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={16} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-gray-800">{label}</p>
          {badge && (
            <span className="text-xs text-gray-400 font-normal">{badge}</span>
          )}
        </div>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.show && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/SEO")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Add Page SEO
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save SEO
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN – Main SEO fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* SEO Information */}
              <SectionHeader
                icon={FileText}
                label="SEO Information"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                description="Meta tags for search engines and social sharing"
              />

              {/* Meta Title */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label
                  htmlFor="meta_title"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="meta_title"
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="Enter meta title (50-60 characters)"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                      fieldErrors.meta_title ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {fieldErrors.meta_title && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.meta_title}</p>
                )}
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.meta_title.length} / 60
                </p>
              </div>

              {/* Meta Description */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label
                  htmlFor="meta_description"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="A brief description for search result snippets (150-160 characters)"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none ${
                    fieldErrors.meta_description ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.meta_description && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.meta_description}</p>
                )}
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.meta_description.length} / 160
                </p>
              </div>

              {/* Meta Keywords */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={13} className="text-gray-400" />
                  <label
                    htmlFor="meta_keywords"
                    className="text-base font-semibold text-gray-800"
                  >
                    Meta Keywords <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  id="meta_keywords"
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                    fieldErrors.meta_keywords ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.meta_keywords && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.meta_keywords}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Comma-separated, relevant keywords
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN – Page Selection */}
            <div className="space-y-5">
              <SectionHeader
                icon={Layers}
                label="Page"
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                description="Select the page to optimize"
              />

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <div>
                  <label
                    htmlFor="page_name"
                    className="block text-base font-semibold text-gray-800 mb-1"
                  >
                    Page Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="page_name"
                      name="page_name"
                      value={formData.page_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer ${
                        fieldErrors.page_name ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      {PAGE_CHOICES.map((page) => (
                        <option key={page.value} value={page.value}>
                          {page.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {fieldErrors.page_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.page_name}
                    </p>
                  )}
                </div>

                <div className="h-px bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Mobile Submit Button */}
          <div className="sm:hidden mt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save SEO
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
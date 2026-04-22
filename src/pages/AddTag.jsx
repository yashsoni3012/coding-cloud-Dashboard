import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toasts from "../pages/Toasts";
import {
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Hash,
  Plus,
} from "lucide-react";

// API function to create a tag
const createTag = async (tagLine) => {
  const response = await fetch(
    "https://codingcloudapi.codingcloud.co.in/tags/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag_line: tagLine }),
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

// Helper: check if tag already exists
const checkTagExists = async (tagLine, currentTagId = null) => {
  try {
    const response = await fetch(
      "https://codingcloudapi.codingcloud.co.in/tags/"
    );
    if (!response.ok) return false;
    const data = await response.json();
    const tags = data.data || data || [];
    const normalizedTag = tagLine.trim().toLowerCase();
    return tags.some(
      (tag) =>
        tag.tag_line?.trim().toLowerCase() === normalizedTag &&
        (currentTagId === null || tag.id !== currentTagId)
    );
  } catch (error) {
    console.error("Failed to check tag uniqueness:", error);
    return false;
  }
};

export default function AddTag() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tagLine, setTagLine] = useState("");
  const [checkingTag, setCheckingTag] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // React Query mutation
  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setToast({
        show: true,
        message: "Tag added successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/tags"), 2000);
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
    const { value } = e.target;
    setTagLine(value);
    if (fieldErrors.tag_line) {
      setFieldErrors({});
    }
    setError("");
  };

  // Validate required fields
  const validateForm = () => {
    const errors = {};

    if (!tagLine.trim()) errors.tag_line = "Tag line is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        show: true,
        message: "Please correct the errors above.",
        type: "error",
      });
      return;
    }

    // Check for duplicate tag
    setCheckingTag(true);
    const tagExists = await checkTagExists(tagLine);
    setCheckingTag(false);

    if (tagExists) {
      setToast({
        show: true,
        message: "Tag already exists. Please use a different tag name.",
        type: "error",
      });
      return;
    }

    mutation.mutate(tagLine.trim());
  };

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
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tags")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all text-base font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Add New Tag
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending || checkingTag}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending || checkingTag ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {checkingTag ? "Checking..." : "Saving…"}
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save Tag
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-base text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0 text-red-500"
            />
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-base text-emerald-700">
            <CheckCircle2
              size={18}
              className="flex-shrink-0 text-emerald-500"
            />
            <span className="flex-1 font-medium">{success}</span>
            <span className="text-emerald-400 text-xs">
              Redirecting to tags…
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Main Content */}
            <div className="space-y-5">
              <SectionHeader
                icon={Hash}
                label="Tag Information"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
              />

              {/* Tag Line */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <label
                  htmlFor="tag_line"
                  className="block text-base font-semibold text-gray-800 mb-1"
                >
                  Tag Line <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="tag_line"
                    type="text"
                    name="tag_line"
                    value={tagLine}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive tag name"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all ${
                      fieldErrors.tag_line ? "border-red-500" : "border-gray-200"
                    }`}
                    required
                  />
                </div>
                {fieldErrors.tag_line && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.tag_line}
                  </p>
                )}
               
              </div>

            
            </div>
          </div>

          <div className="sm:hidden mt-4">
            <button
              type="submit"
              disabled={mutation.isPending || checkingTag}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending || checkingTag ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {checkingTag ? "Checking..." : "Saving…"}
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Tag
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
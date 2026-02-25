import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    X,
    FolderPlus,
    HelpCircle,
    CheckCircle,
    AlertCircle,
    Image as ImageIcon,
    Upload,
} from "lucide-react";

export default function AddCategory() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        text: "",
        image: null,
    });

    // UI States
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

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
                image: file,
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
            image: null,
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Validate form
    const validateForm = () => {
        if (!formData.name.trim()) {
            return "Category name is required";
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
            // Create FormData object since we are likely sending a file
            const payload = new FormData();
            payload.append("name", formData.name.trim());

            if (formData.text.trim()) {
                payload.append("text", formData.text.trim());
            }

            if (formData.image) {
                payload.append("image", formData.image);
            }

            const response = await fetch(
                "https://codingcloud.pythonanywhere.com/category/",
                {
                    method: "POST",
                    body: payload, // Browser automatically sets Content-Type to multipart/form-data
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

            setSuccess("Category created successfully!");

            // Reset form
            setFormData({
                name: "",
                text: "",
                image: null,
            });
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/categories");
            }, 2000);

        } catch (err) {
            console.error("Error creating category:", err);
            setError(
                err.message ||
                "Failed to create category. Please check the API endpoint."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/categories")}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        type="button"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Create a new category with an image and description
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <X size={18} />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Category
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={16} className="text-red-600" />
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
                        <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-green-800">Success!</h4>
                        <p className="text-green-600 text-sm mt-0.5">{success}</p>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    

                    <div className="p-6 space-y-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., IT and Software, Graphic Design"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Category Text/Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Category Description
                            </label>
                            <textarea
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Enter a brief description for this category..."
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Category Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Category Image
                            </label>

                            <div
                                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${imagePreview ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100/50'
                                    }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                        handleImageChange({ target: { files: e.dataTransfer.files } });
                                    }
                                }}
                            >
                                <div className="space-y-1 text-center w-full">
                                    {imagePreview ? (
                                        <div className="relative w-full max-w-sm mx-auto">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="mx-auto h-48 w-full object-cover rounded-md shadow-sm border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200 transition-colors shadow-sm"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center mt-4">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-0.5"
                                                >
                                                    <span onClick={triggerFileInput}>Upload a file</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        ref={fileInputRef}
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button (Mobile) */}
                <div className="block sm:hidden">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Category
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  BookOpen,
  HelpCircle,
  Hash,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AddModule() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state matching API format
  const [formData, setFormData] = useState({
    name: '',
    course_data: ''
  });

  // Fetch courses for dropdown (optional - you can let user enter ID directly)
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch available courses (optional feature)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch('https://codingcloud.pythonanywhere.com/course/');
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
        console.error('Error fetching courses:', err);
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
    setError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Module name is required';
    }
    if (!formData.course_data) {
      return 'Course ID is required';
    }
    if (isNaN(formData.course_data) || parseInt(formData.course_data) <= 0) {
      return 'Please enter a valid Course ID';
    }
    return '';
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
    setError('');
    setSuccess('');

    try {
      // Prepare data for API
      const submitData = {
        name: formData.name.trim(),
        course_data: parseInt(formData.course_data)
      };

      console.log('Submitting module data:', submitData);

      // Make API request
      const response = await fetch('https://codingcloud.pythonanywhere.com/modules/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok || response.status === 201) {
        setSuccess('Module created successfully!');
        // Reset form
        setFormData({
          name: '',
          course_data: ''
        });
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/modules');
        }, 2000);
      } else {
        setError(data.message || data.detail || 'Failed to create module. Please try again.');
      }
    } catch (err) {
      console.error('Error creating module:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/modules')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Module</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create a new module for your course
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/modules')}
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
                Save Module
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
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
        {/* Module Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="font-semibold text-gray-900">Module Information</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Required fields are marked with *</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Module Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Module Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Python, Module 1 - Basics"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Enter a descriptive name for the module
              </p>
            </div>

            {/* OR Option 2: Course Dropdown (Optional) */}
            {courses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select a course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.id}: {course.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Select from list to auto-fill Course ID
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
          <div className="flex items-start gap-3">
            <BookOpen size={20} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-indigo-900 mb-1">Module Preview</h4>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                {formData.name || formData.course_data ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Module:</span>{' '}
                      {formData.name || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Course ID:</span>{' '}
                      {formData.course_data || 'Not specified'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Fill in the fields to see preview</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="text-gray-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Module Creation Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Module names should be descriptive and unique</li>
                <li>Course ID must be a valid existing course ID</li>
                <li>You can find Course IDs in the Courses section</li>
                <li>Example module names: "Module 1 - Introduction", "Chapter 2: Basics"</li>
              </ul>
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
                Save Module
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
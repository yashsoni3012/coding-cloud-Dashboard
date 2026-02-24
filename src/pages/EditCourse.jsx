import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, Save, X, Upload, Image, FileText,
  Clock, BookOpen, Users, Signal, Globe, Award,
  HelpCircle, Trash2, Eye
} from 'lucide-react'

export default function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categories, setCategories] = useState([])
  
  // Form state matching exact API format
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    category: '',
    text: '',
    duration: '',
    lecture: '',
    students: '',
    level: '',
    language: '',
    certificate: 'No',
    meta_title: '',
    meta_description: '',
    keywords: '',
    // File states
    image: null,
    banner_img: null,
    pdf_file: null,
    icon: null,
    // Existing file URLs (for display)
    existing_image: '',
    existing_banner: '',
    existing_icon: '',
    existing_pdf: ''
  })

  // Preview URLs for new files
  const [imagePreview, setImagePreview] = useState('')
  const [bannerPreview, setBannerPreview] = useState('')
  const [iconPreview, setIconPreview] = useState('')
  const [pdfName, setPdfName] = useState('')

  // Track which files have been changed
  const [filesChanged, setFilesChanged] = useState({
    image: false,
    banner_img: false,
    icon: false,
    pdf_file: false
  })

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        
        // Fetch course details
        const response = await fetch(`https://codingcloud.pythonanywhere.com/course/${id}/`)
        const data = await response.json()

        if (data.success) {
          const course = data.data
          setFormData({
            id: course.id,
            name: course.name || '',
            slug: course.slug || '',
            category: course.category || '',
            text: course.text || '',
            duration: course.duration || '',
            lecture: course.lecture || '',
            students: course.students || '',
            level: course.level || '',
            language: course.language || '',
            certificate: course.certificate || 'No',
            meta_title: course.meta_title || '',
            meta_description: course.meta_description || '',
            keywords: course.keywords || '',
            image: null,
            banner_img: null,
            pdf_file: null,
            icon: null,
            existing_image: course.image || '',
            existing_banner: course.banner_img || '',
            existing_icon: course.icon || '',
            existing_pdf: course.pdf_file || ''
          })
        } else {
          setError('Failed to fetch course details')
        }

        // Fetch categories (you might have a separate endpoint)
        setCategories([
          { id: 40, name: 'IT and Software' },
          { id: 43, name: 'Mobile Application' },
          { id: 54, name: 'check123' }
        ])

      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourseData()
    }
  }, [id])

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from name
    if (name === 'name') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }))
    }
  }

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target
    const file = files[0]
    
    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))

      setFilesChanged(prev => ({
        ...prev,
        [name]: true
      }))

      // Create preview URLs for images
      if (name === 'image') {
        setImagePreview(URL.createObjectURL(file))
      } else if (name === 'banner_img') {
        setBannerPreview(URL.createObjectURL(file))
      } else if (name === 'icon') {
        setIconPreview(URL.createObjectURL(file))
      } else if (name === 'pdf_file') {
        setPdfName(file.name)
      }
    }
  }

  // Remove file
  const removeFile = (field, isExisting = false) => {
    if (isExisting) {
      // Mark existing file for deletion
      setFormData(prev => ({
        ...prev,
        [`existing_${field}`]: ''
      }))
      setFilesChanged(prev => ({
        ...prev,
        [field]: true
      }))
    } else {
      // Remove new file
      setFormData(prev => ({
        ...prev,
        [field]: null
      }))
      setFilesChanged(prev => ({
        ...prev,
        [field]: true
      }))

      if (field === 'image') {
        setImagePreview('')
        document.getElementById('image-upload').value = ''
      } else if (field === 'banner_img') {
        setBannerPreview('')
        document.getElementById('banner-upload').value = ''
      } else if (field === 'icon') {
        setIconPreview('')
        document.getElementById('icon-upload').value = ''
      } else if (field === 'pdf_file') {
        setPdfName('')
        document.getElementById('pdf-upload').value = ''
      }
    }
  }

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return 'Course name is required'
    if (!formData.slug.trim()) return 'Course slug is required'
    if (!formData.category) return 'Category is required'
    if (!formData.text.trim()) return 'Description is required'
    return ''
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData()
      
      // Append all text fields
      submitData.append('name', formData.name)
      submitData.append('slug', formData.slug)
      submitData.append('category', formData.category)
      submitData.append('text', formData.text)
      
      if (formData.duration) submitData.append('duration', formData.duration)
      if (formData.lecture) submitData.append('lecture', formData.lecture)
      if (formData.students) submitData.append('students', formData.students)
      if (formData.level) submitData.append('level', formData.level)
      if (formData.language) submitData.append('language', formData.language)
      
      submitData.append('certificate', formData.certificate)
      
      if (formData.meta_title) submitData.append('meta_title', formData.meta_title)
      if (formData.meta_description) submitData.append('meta_description', formData.meta_description)
      if (formData.keywords) submitData.append('keywords', formData.keywords)
      
      // Append new files if they exist
      if (formData.image) submitData.append('image', formData.image)
      if (formData.banner_img) submitData.append('banner_img', formData.banner_img)
      if (formData.pdf_file) submitData.append('pdf_file', formData.pdf_file)
      if (formData.icon) submitData.append('icon', formData.icon)

      // Log FormData contents for debugging
      console.log('Updating course data:')
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
      }

      // Make API request (PATCH request for update)
      const response = await fetch(`https://codingcloud.pythonanywhere.com/course/${id}/`, {
        method: 'PATCH', // or 'PUT' depending on your API
        body: submitData
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (response.ok || response.status === 200) {
        setSuccess('Course updated successfully!')
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/courses')
        }, 2000)
      } else {
        setError(data.message || data.detail || 'Failed to update course. Please try again.')
      }
    } catch (err) {
      console.error('Error updating course:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap">
            Loading course data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/courses')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-500 text-sm mt-1">
              Update course information • ID: {id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/courses')}
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
                Update Course
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
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
            <p className="text-xs text-gray-500 mt-0.5">Required fields are marked with *</p>
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
                URL-friendly version of the name. Auto-generated from course name.
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
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (ID: {cat.id})
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
            <p className="text-xs text-gray-500 mt-0.5">Additional information about the course (optional)</p>
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
            <p className="text-xs text-gray-500 mt-0.5">Upload new files to replace existing ones</p>
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
                  {imagePreview || formData.existing_image ? (
                    <div className="relative">
                      <img
                        src={imagePreview || `https://codingcloud.pythonanywhere.com${formData.existing_image}`}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('image', !imagePreview)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload course image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
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
                  {!imagePreview && !formData.existing_image && (
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
                  {bannerPreview || formData.existing_banner ? (
                    <div className="relative">
                      <img
                        src={bannerPreview || `https://codingcloud.pythonanywhere.com${formData.existing_banner}`}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('banner_img', !bannerPreview)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload banner image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
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
                  {!bannerPreview && !formData.existing_banner && (
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
                  {iconPreview || formData.existing_icon ? (
                    <div className="relative">
                      <img
                        src={iconPreview || `https://codingcloud.pythonanywhere.com${formData.existing_icon}`}
                        alt="Preview"
                        className="max-h-24 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('icon', !iconPreview)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload icon</p>
                      <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 2MB</p>
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
                  {!iconPreview && !formData.existing_icon && (
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
                  {(pdfName || formData.existing_pdf) ? (
                    <div className="relative">
                      <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                        <FileText size={32} className="text-red-500" />
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                          {pdfName || formData.existing_pdf.split('/').pop()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('pdf_file', !pdfName)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload PDF</p>
                      <p className="text-xs text-gray-400">PDF files only, up to 10MB</p>
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
                  {!pdfName && !formData.existing_pdf && (
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
            <p className="text-xs text-gray-500 mt-0.5">For search engine optimization (optional)</p>
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
              <h4 className="text-sm font-semibold text-indigo-900 mb-1">Editing Tips</h4>
              <ul className="text-xs text-indigo-700 space-y-1 list-disc list-inside">
                <li>Fields marked with <span className="text-red-500">*</span> are required</li>
                <li>Upload new files to replace existing ones</li>
                <li>Changes will be saved using PATCH method (partial update)</li>
                <li>Category ID must match existing categories</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
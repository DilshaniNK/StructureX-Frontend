import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Save, Eye, Calendar, User } from 'lucide-react';

const AdminProjectManager = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Modern Office Building",
      description: "A contemporary 15-story office complex featuring sustainable design elements and state-of-the-art facilities.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
      category: "Commercial",
      dateAdded: "2024-03-15",
      status: "Published"
    },
    {
      id: 2,
      title: "Luxury Residential Villa",
      description: "An elegant 5-bedroom villa with panoramic city views, infinity pool, and premium finishes throughout.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop",
      category: "Residential",
      dateAdded: "2024-03-10",
      status: "Published"
    },
    {
      id: 3,
      title: "Urban Shopping Center",
      description: "A multi-level retail complex with innovative architectural design and eco-friendly features.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop",
      category: "Retail",
      dateAdded: "2024-03-08",
      status: "Draft"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Commercial',
    image: null,
    imagePreview: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = ['Commercial', 'Residential', 'Industrial', 'Retail', 'Healthcare', 'Educational'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: 'File size must be less than 10MB'
        }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
        // Clear image error
        if (formErrors.image) {
          setFormErrors(prev => ({
            ...prev,
            image: ''
          }));
        }
      };
      reader.onerror = () => {
        setFormErrors(prev => ({
          ...prev,
          image: 'Error reading file. Please try again.'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Project title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (!editingProject && !formData.imagePreview) {
      errors.image = 'Project image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingProject) {
      // Update existing project
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? {
              ...project,
              title: formData.title.trim(),
              description: formData.description.trim(),
              category: formData.category,
              image: formData.imagePreview || project.image,
              dateAdded: project.dateAdded
            }
          : project
      ));
    } else {
      // Add new project
      const newProject = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        image: formData.imagePreview,
        dateAdded: new Date().toISOString().split('T')[0],
        status: 'Published'
      };
      setProjects(prev => [newProject, ...prev]);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image: null,
      imagePreview: project.image
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Commercial',
      image: null,
      imagePreview: ''
    });
    setEditingProject(null);
    setFormErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDUwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmaWxsPSIjOUI5QkIzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Management</h1>
            <p className="text-gray-400 mt-2">Manage your portfolio projects that appear on the landing page</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Eye size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-400">{projects.filter(p => p.status === 'Published').length}</p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <Upload size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-yellow-400">{projects.filter(p => p.status === 'Draft').length}</p>
              </div>
              <div className="bg-yellow-600 p-3 rounded-lg">
                <Edit2 size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Categories</p>
                <p className="text-2xl font-bold text-purple-400">{new Set(projects.map(p => p.category)).size}</p>
              </div>
              <div className="bg-purple-600 p-3 rounded-lg">
                <User size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors duration-200">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  onError={handleImageError}
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Published' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 text-sm font-medium">{project.category}</span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {project.dateAdded}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 overflow-hidden" 
                   style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 3,
                     WebkitBoxOrient: 'vertical'
                   }}>
                  {project.description}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter project title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none ${
                        formErrors.description ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter project description..."
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Image *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-500 transition-colors duration-200 ${
                      formErrors.image ? 'border-red-500' : 'border-gray-600'
                    }`}>
                      {formData.imagePreview ? (
                        <div className="relative">
                          <img
                            src={formData.imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg mb-4"
                            onError={handleImageError}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors duration-200"
                          >
                            <X size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => document.getElementById('file-upload').click()}
                            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => document.getElementById('file-upload').click()}
                          className="cursor-pointer"
                        >
                          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                          <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {formErrors.image && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.image}</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectManager;
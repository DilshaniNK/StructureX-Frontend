import React, { useState } from 'react';
import { Calendar, Upload, User, Building, FileText, Link, Save, ArrowLeft, Plus, X } from 'lucide-react';

export default function ProjectInitialization() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    projectDescription: '',
    dueDate: '',
    priority: 'medium',
    budget: '',
    designToolLink: '',
    requirements: [''],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to ongoing projects or show success message
      console.log('Project initialized:', formData);
      alert('Project initialized successfully!');
      // You can integrate with your navigation system here
    }, 2000);
  };

  const projectTypes = [
    'Residential Design',
    'Commercial Design',
    'Interior Design',
    'Landscape Design',
    'Renovation',
    'New Construction',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Initialize New Project</h1>
                <p className="text-gray-600">Create and configure your new design project</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Project Information */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Project Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (Optional)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project budget"
                    />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <User className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Address
                    </label>
                    <input
                      type="text"
                      name="clientAddress"
                      value={formData.clientAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client address"
                    />
                  </div>
                </div>
              </div>

              {/* Project Requirements */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Building className="w-6 h-6 text-purple-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Project Requirements</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="flex items-center px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Requirement ${index + 1}`}
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              
              {/* Design Tool Integration */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <Link className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Design Tool</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AutoCAD Project Link
                    </label>
                    <input
                      type="url"
                      name="designToolLink"
                      value={formData.designToolLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://autocad.com/project/..."
                    />
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Tip:</strong> Make sure your AutoCAD project is shared with appropriate permissions before adding the link.
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Description */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h3>
                    <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Provide a detailed description of the project, including objectives, scope, and any specific requirements..."
                    />
                </div>

              {/* Project Notes */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add any additional notes or special instructions for this project..."
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Initializing Project...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3" />
                      Initialize Project
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
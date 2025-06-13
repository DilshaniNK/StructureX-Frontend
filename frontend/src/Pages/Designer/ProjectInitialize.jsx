import React, { useState } from 'react';
import { Calendar, User, Building, FileText, Link, Save, ArrowLeft, Plus, X, Sparkles, Zap } from 'lucide-react';

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
      console.log('Project initialized:', formData);
      alert('Project initialized successfully!');
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

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-[#FAAD00]/5 to-white shadow-lg border-b border-gray-100">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#FAAD00] rounded-xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    Initialize New Project
                  </h1>
                  <p className="text-xl text-gray-600">Create and configure your next amazing design project</p>
                </div>
              </div>
            </div>
            <div className="text-lg text-gray-500 bg-gradient-to-r from-[#FAAD00]/10 to-yellow-100 px-6 py-3 rounded-2xl border border-yellow-200">
              <Zap className="w-4 h-4 text-[#FAAD00] mr-2" />
              <span className="font-semibold text-[#FAAD00]">Quick Setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-8 py-8">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Project Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-[#FAAD00] rounded-xl shadow-md mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="Enter your amazing project name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Project Type *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      required
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Due Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                        required
                      />
                      <Calendar className="absolute right-4 top-4 w-5 h-5 text-[#FAAD00]" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🔵 Medium Priority</option>
                      <option value="high">🟠 High Priority</option>
                      <option value="urgent">🔴 Urgent</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Budget (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                        placeholder="Enter project budget"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-500 rounded-xl shadow-md mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Client Address
                    </label>
                    <input
                      type="text"
                      name="clientAddress"
                      value={formData.clientAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="Enter client address"
                    />
                  </div>
                </div>
              </div>

              {/* Project Requirements */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500 rounded-xl shadow-md mr-4">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Requirements</h2>
                  </div>
                  <button
                    onClick={addRequirement}
                    className="group flex items-center px-4 py-2 bg-[#FAAD00] text-white font-semibold rounded-xl hover:bg-[#e89d00] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                    Add
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-4 group/item">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                          placeholder={`Requirement ${index + 1} - Describe what you need`}
                        />
                        <div className="absolute left-2 top-2 w-2 h-2 bg-[#FAAD00] rounded-full"></div>
                      </div>
                      {formData.requirements.length > 1 && (
                        <button
                          onClick={() => removeRequirement(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:text-red-600 transform hover:scale-110 opacity-0 group-hover/item:opacity-100"
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
              
              {/* Priority Badge */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Current Priority</h3>
                <div className={`inline-flex items-center px-4 py-3 rounded-xl border-2 font-semibold text-sm ${priorityColors[formData.priority]}`}>
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                </div>
              </div>
              
              {/* Design Tool Integration */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-orange-500 rounded-xl shadow-md mr-4">
                    <Link className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Design Tool</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      AutoCAD Project Link
                    </label>
                    <input
                      type="url"
                      name="designToolLink"
                      value={formData.designToolLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="https://autocad.com/project/..."
                    />
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <p className="text-sm text-orange-800 leading-relaxed">
                      <strong>💡 Pro Tip:</strong> Make sure your AutoCAD project is shared with appropriate permissions before adding the link.
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Project Description</h3>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 resize-none"
                  placeholder="Paint a picture with words... What's your vision for this project?"
                />
              </div>

              {/* Project Notes */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 resize-none"
                  placeholder="Any extra thoughts, special requests, or creative ideas?"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full group flex items-center justify-center px-6 py-5 bg-[#FAAD00] text-white font-bold text-lg rounded-2xl hover:bg-[#e89d00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Initializing Magic...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Initialize Project
                      <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Calendar, User, Building, FileText, Link, Save, ArrowLeft, Plus, X, Sparkles, Zap, Users, UserPlus, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

export default function ProjectInitialization() {
  const [clientType, setClientType] = useState('design-only'); // 'design-only' or 'design-and-project'
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Sample registered clients who want design only
  const designOnlyClients = [
    {
      id: 1,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@gmail.com',
      phone: '+1 (555) 234-5678',
      address: '567 Birch Lane, Creative District, NY 10005',
      avatar: 'LA',
      projectHistory: 4,
      lastProject: '2024-06-01',
      serviceType: 'design-only'
    },
    {
      id: 2,
      name: 'Robert Kim',
      email: 'robert.kim@startup.com',
      phone: '+1 (555) 345-6789',
      address: '890 Cedar Street, Tech Hub, NY 10006',
      avatar: 'RK',
      projectHistory: 2,
      lastProject: '2024-05-20',
      serviceType: 'design-only'
    },
    {
      id: 3,
      name: 'Amanda Foster',
      email: 'amanda.foster@boutique.com',
      phone: '+1 (555) 456-7891',
      address: '234 Willow Avenue, Fashion District, NY 10007',
      avatar: 'AF',
      projectHistory: 6,
      lastProject: '2024-06-15',
      serviceType: 'design-only'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@consulting.com',
      phone: '+1 (555) 567-8912',
      address: '345 Spruce Court, Business Park, NY 10008',
      avatar: 'JW',
      projectHistory: 3,
      lastProject: '2024-05-10',
      serviceType: 'design-only'
    }
  ];

  // Sample registered clients who want design and project continuation
  const designAndProjectClients = [
    {
      id: 5,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gmail.com',
      phone: '+1 (555) 123-4567',
      address: '123 Oak Street, Downtown, NY 10001',
      avatar: 'SJ',
      projectHistory: 3,
      lastProject: '2024-05-15',
      serviceType: 'design-and-project'
    },
    {
      id: 6,
      name: 'Michael Chen',
      email: 'michael.chen@techcorp.com',
      phone: '+1 (555) 987-6543',
      address: '456 Pine Avenue, Business District, NY 10002',
      avatar: 'MC',
      projectHistory: 7,
      lastProject: '2024-06-10',
      serviceType: 'design-and-project'
    },
    {
      id: 7,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@homedesign.com',
      phone: '+1 (555) 456-7890',
      address: '789 Maple Drive, Residential Area, NY 10003',
      avatar: 'ER',
      projectHistory: 2,
      lastProject: '2024-04-22',
      serviceType: 'design-and-project'
    },
    {
      id: 8,
      name: 'David Thompson',
      email: 'david.thompson@outlook.com',
      phone: '+1 (555) 321-0987',
      address: '321 Elm Court, Suburban Hills, NY 10004',
      avatar: 'DT',
      projectHistory: 5,
      lastProject: '2024-05-28',
      serviceType: 'design-and-project'
    }
  ];

  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    clientName: selectedClient?.name || '',
    clientEmail: selectedClient?.email || '',
    clientPhone: selectedClient?.phone || '',
    clientAddress: selectedClient?.address || '',
    projectDescription: '',
    dueDate: '',
    priority: 'medium',
    budget: '',
    designToolLink: '',
    requirements: [''],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current client list based on selected type
  const getCurrentClientList = () => {
    return clientType === 'design-only' ? designOnlyClients : designAndProjectClients;
  };

  // Update form when client is selected
  React.useEffect(() => {
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address
      }));
    } else if (clientType === 'design-only') {
      setFormData(prev => ({
        ...prev,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: ''
      }));
    }
  }, [selectedClient, clientType]);

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

  const handleClientTypeChange = (type) => {
    setClientType(type);
    setSelectedClient(null);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
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

  // Client Type Selection Header
  const ClientTypeSelector = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Client Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleClientTypeChange('design-only')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
            clientType === 'design-only' 
              ? 'border-[#FAAD00] bg-yellow-50 shadow-lg' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-xl mr-4 ${
              clientType === 'design-only' ? 'bg-[#FAAD00]' : 'bg-gray-400'
            }`}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">Design Only Clients</h3>
              <p className="text-sm text-gray-600">Registered clients who need design services only</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 text-left">
            Select from clients who only require design work without project continuation
          </p>
        </button>

        <button
          onClick={() => handleClientTypeChange('design-and-project')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
            clientType === 'design-and-project' 
              ? 'border-[#FAAD00] bg-yellow-50 shadow-lg' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-xl mr-4 ${
              clientType === 'design-and-project' ? 'bg-[#FAAD00]' : 'bg-gray-400'
            }`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">Design + Project Clients</h3>
              <p className="text-sm text-gray-600">Registered clients who want full project management</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 text-left">
            Select from clients who want design and complete project management services
          </p>
        </button>
      </div>
    </div>
  );

  // Registered Clients List
  const RegisteredClientsList = () => {
    const currentClients = getCurrentClientList();
    const clientTypeTitle = clientType === 'design-only' ? 'Design Only Clients' : 'Design + Project Clients';
    
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select {clientTypeTitle}</h2>
          <button
            onClick={() => handleClientTypeChange('design-only')}
            className="text-[#FAAD00] hover:text-[#e89d00] font-semibold text-sm flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Client Types
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentClients.map((client) => (
            <button
              key={client.id}
              onClick={() => handleClientSelect(client)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                selectedClient?.id === client.id
                  ? 'border-[#FAAD00] bg-yellow-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#FAAD00] rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                  {client.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{client.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-[#FAAD00]" />
                      {client.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-[#FAAD00]" />
                      {client.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#FAAD00]" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {client.projectHistory} projects completed
                    </span>
                    <span className="text-xs text-gray-500">
                      Last: {new Date(client.lastProject).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                  selectedClient?.id === client.id ? 'text-[#FAAD00] transform rotate-90' : 'text-gray-400'
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 py-8">
        <div className="w-full">
          <ClientTypeSelector />
          
          {clientType === 'design-and-project' && !selectedClient && (
            <RegisteredClientsList />
          )}
          
          {clientType === 'design-only' && !selectedClient && (
            <RegisteredClientsList />
          )}
          
          {(clientType === 'design-only' || clientType === 'design-and-project') && selectedClient && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              
              {/* Main Form - Left Side */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Selected Client Banner */}
                {selectedClient && (
                  <div className="bg-gradient-to-r from-[#FAAD00] to-[#e89d00] rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                          {selectedClient.avatar}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Selected Client: {selectedClient.name}</h3>
                          <p className="text-yellow-100">
                            {selectedClient.serviceType === 'design-only' 
                              ? 'Design services only' 
                              : 'Design + Project management'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedClient(null)}
                        className="text-white hover:text-yellow-200 transition-colors duration-300"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
                
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
                    {selectedClient && (
                      <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        Auto-filled from registered client
                      </span>
                    )}
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
                        className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 ${
                          selectedClient ? 'bg-green-50' : ''
                        }`}
                        placeholder="Enter client name"
                        required
                        readOnly={selectedClient ? true : false}
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
                        className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 ${
                          selectedClient ? 'bg-green-50' : ''
                        }`}
                        placeholder="client@example.com"
                        required
                        readOnly={selectedClient ? true : false}
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
                        className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 ${
                          selectedClient ? 'bg-green-50' : ''
                        }`}
                        placeholder="+1 (555) 123-4567"
                        readOnly={selectedClient ? true : false}
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
                        className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 ${
                          selectedClient ? 'bg-green-50' : ''
                        }`}
                        placeholder="Enter client address"
                        readOnly={selectedClient ? true : false}
                      />
                    </div>
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
          )}
        </div>
      </div>
    </div>
  );
}
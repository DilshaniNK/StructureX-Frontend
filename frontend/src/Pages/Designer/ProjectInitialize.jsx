
import React, { useState, useEffect } from 'react';
import { Calendar, User, Building, FileText, Link, Save, ArrowLeft, Plus, X, Sparkles, Zap, Users, UserPlus, ChevronRight, MapPin, Phone, Mail, Search } from 'lucide-react';

export default function ClientSelectionPage() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    dueDate: '',
    priority: 'medium',
    price: '', // Added price field that was missing
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    designToolLink: '',
    projectDescription: '',
    notes: '',
    requirements: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8086/api/v1/designer/get_clients');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Transform API data to match your component structure
        const transformedClients = data.map(client => ({
          id: client.client_id,
          name: client.last_name 
            ? `${client.first_name} ${client.last_name}` 
            : client.first_name,
          email: client.email,
          phone: client.contact_number,
          address: client.address,
          company: client.type === 'company' ? client.first_name : `${client.first_name} (${client.type})`,
          avatar: client.last_name 
            ? `${client.first_name[0]}${client.last_name[0]}` 
            : client.first_name.substring(0, 2).toUpperCase(),
          type: client.type,
          havePlan: client.is_have_plan
        }));
        
        setAllClients(transformedClients);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Fixed filter function - properly handles all searchable fields
  const filteredClients = allClients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.company.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower) ||
      client.address.toLowerCase().includes(searchLower)
    );
  });

  // Update form when client is selected
  useEffect(() => {
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address
      }));
    }
  }, [selectedClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation before submission
  if (!selectedClient) {
    alert('Please select a client first');
    return;
  }
  
  if (!formData.projectName.trim()) {
    alert('Please enter a project name');
    return;
  }
  
  if (!formData.projectType) {
    alert('Please select a project type');
    return;
  }
  
  if (!formData.dueDate) {
    alert('Please select a due date');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Prepare the payload according to your backend API structure
    const payload = {
      name: formData.projectName.trim(),
      type: formData.projectType,
      due_date: formData.dueDate,
      priority: formData.priority,
      price: parseFloat(formData.price) || 0,
      design_link: formData.designToolLink.trim() || null,
      description: formData.projectDescription.trim() || null,
      additional_note: formData.notes.trim() || null,
      client_id: selectedClient.id
    };

    console.log('Submitting payload:', payload);

    // Call your backend API
    const response = await fetch('http://localhost:8086/api/v1/designer/initializing_design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Enhanced response handling
    let result;
    let responseText;
    
    try {
      // First, get the response as text
      responseText = await response.text();
      console.log('Raw response:', responseText);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to parse as JSON
      if (responseText.trim()) {
        result = JSON.parse(responseText);
      } else {
        throw new Error('Empty response from server');
      }
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.error('Response text:', responseText);
      
      // If it's an HTML error page, extract useful info
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        throw new Error('Server returned HTML error page instead of JSON');
      }
      
      // If response starts with "Error" (like your original error)
      if (responseText.startsWith('Error')) {
        throw new Error(`Server error: ${responseText}`);
      }
      
      throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
    }
    
    if (!response.ok) {
      throw new Error(result?.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle success
    console.log('Project initialized successfully:', result);
    alert('Project initialized successfully!');
    
    // Reset form after successful submission
    setFormData({
      projectName: '',
      projectType: '',
      dueDate: '',
      priority: 'medium',
      price: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      designToolLink: '',
      projectDescription: '',
      notes: '',
      requirements: ['']
    });
    setSelectedClient(null);
    
  } catch (error) {
    console.error('Error initializing project:', error);
    
    // More specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert('Network error: Please check your connection and try again');
    } else if (error.message.includes('JSON')) {
      alert('Server communication error: Invalid response format');
    } else {
      alert(`Failed to initialize project: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};
  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const projectTypes = [
    'architectural',
    'structural', 
    'electrical',
    'plumbing',
    'mechanical',
    'landscape',
    'interior',
    '3d_modeling'
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };

  // Client Selection View
  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
          <div className="max-w-full mx-auto">
            {/* Header */}
            <div className="bg-black shadow-lg border-l-4 border-[#FAAD00] rounded-lg p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#FAAD00] mb-2">Select Client</h1>
                  <p className="text-gray-300">Choose a client to initialize a new project</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search clients by name, email, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-4 focus:ring-[#FAAD00] focus:ring-opacity-30 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-600 w-80"
                    />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Count */}
            {searchTerm && (
              <div className="mb-6 px-4">
                <p className="text-gray-600">
                  Found {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} 
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Add loading and error states in the JSX */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAAD00] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading clients...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading clients</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-[#FAAD00] text-white rounded-lg hover:bg-[#E09A00] transition-colors duration-200 font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Your existing client grid code */}
              </div>
            )}

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className="relative bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-left transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:border-[#FAAD00]/30 group overflow-hidden"
                >
                  {/* Subtle background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FAAD00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Main content */}
                  <div className="relative z-10">
                    {/* Header section */}
                    <div className="flex items-start mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FAAD00] to-[#FFB800] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                          {client.avatar}
                        </div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FAAD00] to-[#FFB800] rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"></div>
                      </div>
                      
                      <div className="flex-1 ml-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FAAD00] transition-colors duration-300">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full inline-block">
                          {client.company}
                        </p>
                      </div>
                    </div>
                    
                    {/* Contact information */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-[#FAAD00]/10 transition-colors duration-300">
                          <Mail className="w-4 h-4 text-[#FAAD00]" />
                        </div>
                        <span className="truncate font-medium">{client.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-[#FAAD00]/10 transition-colors duration-300">
                          <Phone className="w-4 h-4 text-[#FAAD00]" />
                        </div>
                        <span className="font-medium">{client.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-[#FAAD00]/10 transition-colors duration-300">
                          <MapPin className="w-4 h-4 text-[#FAAD00]" />
                        </div>
                        <span className="truncate font-medium">{client.address}</span>
                      </div>
                    </div>
                    
                    {/* Bottom section with arrow */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Select Client
                      </span>
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#FAAD00] transition-all duration-300">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover border effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-[#FAAD00] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              ))}
            </div>

            {/* No results message */}
              {!loading && !error && filteredClients.length === 0 && (              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No clients found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `No clients match your search for "${searchTerm}"`
                    : "Try adjusting your search criteria"
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-[#FAAD00] text-white rounded-lg hover:bg-[#E09A00] transition-colors duration-200 font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Project Initialization Form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        <div className="max-w-full mx-auto">
          
        {/* Selected Client Banner */}
          <div className="bg-black shadow-lg border-l-4 border-[#FAAD00] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#FAAD00] flex items-center justify-center ring-4 ring-[#FAAD00] ring-opacity-30 shadow-md">
                <span className="text-2xl font-bold text-black">
                  {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#FAAD00] mb-1">
                  Project for {selectedClient.name}
                </h2>
                <p className="text-gray-300 font-medium text-lg mb-3">
                  {selectedClient.company}
                </p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span className="font-medium">{selectedClient.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span className="font-medium">{selectedClient.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedClient(null)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-[#FAAD00] text-black rounded-lg hover:bg-[#E09A00] hover:shadow-md transition-all duration-200 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Back to Clients</span>
            </button>
          </div>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Project Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-[#FAAD00] rounded-xl shadow-md mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Project Details</h3>
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
                      placeholder="Enter project name"
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
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Project Price (LKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500 font-medium">Rs.</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

              </div>
              

              {/* Client Information - Auto-filled */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-500 rounded-xl shadow-md mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Client Information</h3>
                  <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    Auto-filled
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-green-50 text-gray-700"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-green-50 text-gray-700"
                      readOnly
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
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-green-50 text-gray-700"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="clientAddress"
                      value={formData.clientAddress}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-green-50 text-gray-700"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              
              {/* Priority Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Priority Status</h3>
                <div className={`inline-flex items-center px-4 py-3 rounded-xl border-2 font-semibold text-sm ${priorityColors[formData.priority]}`}>
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                </div>
              </div>
              
              {/* Design Tool Integration */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#FAAD00] rounded-xl shadow-md mr-3">
                    <Link className="w-5 h-5 text-white" />
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300"
                      placeholder="https://autocad.com/project/..."
                    />
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Project Description</h3>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 resize-none"
                  placeholder="Describe your project vision..."
                />
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-[#FAAD00] transition-all duration-300 hover:border-gray-300 resize-none"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full group flex items-center justify-center px-6 py-4 bg-[#FAAD00] text-white font-bold text-lg rounded-xl hover:bg-[#e89d00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3" />
                      Initialize Project
                      <Sparkles className="w-5 h-5 ml-3" />
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedClient(null)}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Back to Client Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
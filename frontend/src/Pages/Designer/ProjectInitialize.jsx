import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, MapPin, Search, X, Save, Sparkles, ChevronRight, Loader, Star } from 'lucide-react';

export default function ClientSelectionPage() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    dueDate: '',
    priority: 'medium',
    price: '',
    designToolLink: '',
    projectDescription: '',
    notes: ''
  });

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const empId = pathParts[2];
    if (empId) setEmployeeId(empId);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8086/api/v1/designer/get_clients');
        if (!response.ok) throw new Error(`Failed to fetch clients`);
        const data = await response.json();
        
        const transformedClients = data.map(client => ({
          id: client.client_id,
          name: client.last_name ? `${client.first_name} ${client.last_name}` : client.first_name,
          email: client.email,
          phone: client.contact_number,
          address: client.address,
          company: client.type === 'company' ? client.first_name : `${client.first_name} (${client.type})`,
          avatar: client.last_name ? `${client.first_name[0]}${client.last_name[0]}` : client.first_name.substring(0, 2).toUpperCase(),
          type: client.type
        }));
        
        setAllClients(transformedClients);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = allClients.filter(client => {
    const s = searchTerm.toLowerCase();
    return client.name.toLowerCase().includes(s) || client.email.toLowerCase().includes(s) || 
           client.phone.toLowerCase().includes(s);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClient || !employeeId || !formData.projectName.trim() || !formData.projectType || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.projectName.trim(),
        type: formData.projectType,
        due_date: formData.dueDate,
        priority: formData.priority,
        price: parseFloat(formData.price) || 0,
        design_link: formData.designToolLink.trim() || null,
        description: formData.projectDescription.trim() || null,
        additional_note: formData.notes.trim() || null,
        employee_id: employeeId,
        client_id: selectedClient.id
      };

      const response = await fetch('http://localhost:8086/api/v1/designer/initializing_design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create project');
      
      alert('Project initialized successfully!');
      setFormData({ projectName: '', projectType: '', dueDate: '', priority: 'medium', price: '', designToolLink: '', projectDescription: '', notes: '' });
      setSelectedClient(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = ['architectural', 'structural', 'electrical', 'plumbing', 'mechanical', 'landscape', 'interior', '3d_modeling'];
  const priorityColors = { low: 'bg-green-100 text-green-700', medium: 'bg-blue-100 text-blue-700', high: 'bg-orange-100 text-orange-700', urgent: 'bg-red-100 text-red-700' };

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="px-2 sm:px-3 py-12">
          {/* Header Section */}
          <div className="mb-12 max-w-4xl">            
            <div className="inline-block mb-3 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
              Let's Get Started
            </div>            
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:shadow-lg transition-all shadow-sm hover:border-amber-300"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <X className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-900 mb-2">Error loading clients</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border-2 border-gray-200">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No clients found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  type="button"
                  className="group relative bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-transparent to-amber-100/0 group-hover:from-amber-50/40 group-hover:to-amber-100/20 transition-all duration-300" />
                  
                  <div className="relative z-10">
                    {/* Top Section with Avatar and Arrow */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                        {client.avatar}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    {/* Client Info */}
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-amber-600 transition-colors text-base mb-0.5">{client.name}</h3>
                    <p className="text-xs text-gray-600 mb-3 font-semibold truncate">{client.company}</p>
                    
                    {/* Contact Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className="w-6 h-6 bg-amber-50 rounded flex items-center justify-center flex-shrink-0">
                          <Mail className="w-3 h-3 text-amber-500" />
                        </div>
                        <span className="truncate text-xs font-medium">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className="w-6 h-6 bg-amber-50 rounded flex items-center justify-center flex-shrink-0">
                          <Phone className="w-3 h-3 text-amber-500" />
                        </div>
                        <span className="text-xs font-medium">{client.phone}</span>
                      </div>
                    </div>
                    
                    {/* Bottom CTA */}
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Select</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="px-2 sm:px-3 py-12">
        <div className="max-w-full mx-auto">
          {/* Selected Client Header - Premium Style */}
          <div className="bg-gradient-to-r from-white to-amber-50/50 rounded-2xl border-2 border-amber-300 p-8 mb-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-18 h-18 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedClient.avatar}
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Project for {selectedClient.name}</h2>
                  <p className="text-amber-700 font-semibold mt-1">{selectedClient.company}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 rounded-lg transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <X className="w-4 h-4" />
                Change
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-7">
              {/* Project Details Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg hover:border-amber-300 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                  <h3 className="text-xl font-black text-gray-900">Project Details</h3>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    name="projectName"
                    placeholder="Project name *"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all outline-none font-medium"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all outline-none font-medium"
                    >
                      <option value="">Select type *</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    
                    <div className="relative">
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all outline-none font-medium"
                      />
                      {formData.dueDate && (
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, dueDate: ''})}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all outline-none font-medium"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    
                    <input
                      type="number"
                      name="price"
                      placeholder="Price (LKR)"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all outline-none font-medium"
                    />
                  </div>

                  <input
                    type="url"
                    name="designToolLink"
                    placeholder="Design tool link (optional)"
                    value={formData.designToolLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all outline-none font-medium"
                  />
                </div>
              </div>

              {/* Description & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg hover:border-amber-300 transition-all">
                  <label className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">Description</label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Project details..."
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all resize-none outline-none font-medium"
                  />
                </div>
                
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg hover:border-amber-300 transition-all">
                  <label className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Additional notes..."
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all resize-none outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-7">
              {/* Client Info Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg transition-all">
                <h3 className="text-sm font-black text-gray-900 mb-5 uppercase tracking-wide flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Client Details
                </h3>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Email</p>
                    <p className="font-bold text-gray-900 truncate text-sm">{selectedClient.email}</p>
                  </div>
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Phone</p>
                    <p className="font-bold text-gray-900 text-sm">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Address</p>
                    <p className="font-bold text-gray-900 truncate text-sm">{selectedClient.address}</p>
                  </div>
                </div>
              </div>

              {/* Priority Badge */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200 p-8 shadow-md">
                <p className="text-xs font-black text-amber-900 mb-4 uppercase tracking-wide">Priority Level</p>
                <span className={`inline-block px-5 py-3 rounded-xl font-bold text-sm ${priorityColors[formData.priority]} border-2 border-current/30`}>
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Initialize Project
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
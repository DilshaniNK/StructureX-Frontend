import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, StickyNote, Trash2, Edit, Eye, X
} from 'lucide-react';

const fetchDesigns = async () => {
  try {
    const response = await fetch('http://localhost:8086/api/v1/designer/all_designs');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched designs:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching designs:', error);
    return [];
  }
};

const fetchDesignById = async (designId) => {
  try {
    const response = await fetch(`http://localhost:8086/api/v1/designer/get_design/${designId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching design:', error);
    return null;
  }
};

const DesignerHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [deleteDesignId, setDeleteDesignId] = useState('');
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    type: '',
    due_date: '',
    priority: '',
    price: '',
    design_link: '',
    description: '',
    additional_note: '',
    status: '',
    project_id: ''
  });

  const designStats = {
    ongoing: designs.filter(d => d.status === 'ongoing').length,
    completed: designs.filter(d => d.status === 'completed').length
  };

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading designs...');
        const fetchedDesigns = await fetchDesigns();
        console.log('Designs loaded:', fetchedDesigns);
        setDesigns(fetchedDesigns);
      } catch (err) {
        console.error('Error loading designs:', err);
        setError('Failed to load designs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDesigns();
  }, []);

  const deleteDesign = async (designId) => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/designer/delete_design/${designId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setDesigns(designs.filter(design => design.design_id !== designId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting design:', error);
      return false;
    }
  };

  const updateDesign = async (designId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/designer/update_design/${designId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const responseData = await response.json();
        setDesigns(designs.map(design => 
          design.design_id === designId ? { ...design, ...responseData } : design
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating design:', error);
      return false;
    }
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.design_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || design.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-[#FAAD00]/10 text-[#FAAD00] border border-[#FAAD00]/20';
      case 'completed': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'low': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const handleCancelEdit = () => {
    setIsEditingNote(false);
    setEditedNote(selectedNote);
  };

  const handleSaveNote = () => {
    setSelectedNote(editedNote);
    setIsEditingNote(false);
  };

  const handleUpdateNote = () => {
    setEditedNote(selectedNote);
    setIsEditingNote(true);
  };

  const handleDelete = (designId) => {
    setDeleteDesignId(designId);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (designId) => {
    const design = await fetchDesignById(designId);
    if (design) {
      setSelectedDesign(design);
      setUpdateFormData({
        name: design.name || '',
        type: design.type || '',
        due_date: design.due_date || '',
        priority: design.priority || '',
        price: design.price || '',
        design_link: design.design_link || '',
        description: design.description || '',
        additional_note: design.additional_note || '',
        status: design.status || '',
        project_id: design.project_id || '',
        client_id: design.client_id || '',  
        employee_id: design.employee_id || ''  
      });
      setShowUpdatePopup(true);
    }
  };

  const handleViewDesign = async (designId) => {
    const design = await fetchDesignById(designId);
    if (design) {
      setSelectedDesign(design);
      setShowViewPopup(true);
    }
  };

  const confirmDelete = async () => {
    const success = await deleteDesign(deleteDesignId);
    if (success) {
      setShowDeletePopup(false);
      setDeleteDesignId('');
    }
  };

  const handleUpdateSubmit = async () => {
    const success = await updateDesign(selectedDesign.design_id, updateFormData);
    if (success) {
      setShowUpdatePopup(false);
      setSelectedDesign(null);
      setUpdateFormData({
        name: '',
        type: '',
        due_date: '',
        priority: '',
        price: '',
        design_link: '',
        description: '',
        additional_note: '',
        status: '',
        project_id: '',
        client_id: '',
        employee_id: ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    setUpdateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FAAD00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading designs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Designs</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors duration-150"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {(showDeletePopup || showViewPopup || showUpdatePopup) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
      )}
      
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Design</h3>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to delete this design? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Design Popup */}
      {showViewPopup && selectedDesign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-[#FAAD00]/10 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-[#FAAD00]" />
                </div>
                Design Details
              </h3>
              <button
                onClick={() => setShowViewPopup(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Design ID</label>
                <p className="text-gray-900 font-medium">{selectedDesign.design_id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Project ID</label>
                <p className="text-gray-900 font-medium">{selectedDesign.project_id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-medium">{selectedDesign.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-gray-900 font-medium capitalize">{selectedDesign.type}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Due Date</label>
                <p className="text-gray-900 font-medium">{selectedDesign.due_date}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedDesign.priority)}`}>
                  {selectedDesign.priority?.charAt(0).toUpperCase() + selectedDesign.priority?.slice(1) || 'Medium'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-gray-900 font-medium">${selectedDesign.price}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedDesign.status)}`}>
                  {selectedDesign.status?.charAt(0).toUpperCase() + selectedDesign.status?.slice(1) || 'Ongoing'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Client Name</label>
                <p className="text-gray-900 font-medium">{selectedDesign.client_name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500">Design Link</label>
                <p className="text-gray-900 font-medium truncate">{selectedDesign.design_link || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1">{selectedDesign.description || 'No description provided'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                <p className="text-gray-900 mt-1">{selectedDesign.additional_note || 'No additional notes'}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewPopup(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Design Popup */}
      {showUpdatePopup && selectedDesign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-[#FAAD00]/10 rounded-lg flex items-center justify-center mr-3">
                  <Edit className="w-4 h-4 text-[#FAAD00]" />
                </div>
                Update Design
              </h3>
              <button
                onClick={() => setShowUpdatePopup(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={updateFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={updateFormData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                >
                  <option value="architectural">Architectural</option>
                  <option value="structural">Structural</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="landscape">Landscape</option>
                  <option value="interior">Interior</option>
                  <option value="3d_modeling">3D Modeling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={updateFormData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={updateFormData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={updateFormData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={updateFormData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                <input
                  type="text"
                  value={updateFormData.project_id}
                  onChange={(e) => handleInputChange('project_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Link</label>
                <input
                  type="url"
                  value={updateFormData.design_link}
                  onChange={(e) => handleInputChange('design_link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={updateFormData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUpdatePopup(false)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors duration-150"
              >
                Update Design
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#FAAD00]/10 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#FAAD00] rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ongoing Designs</h3>
                  <p className="text-sm text-gray-600">Active designs in development</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-[#FAAD00]">
                {designStats.ongoing}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Completed Designs</h3>
                  <p className="text-sm text-gray-600">Successfully delivered designs</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-green-600">
                {designStats.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search designs by name, client, or design ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none transition-all duration-200"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 px-6 py-3 bg-[#FAAD00] text-white rounded-lg hover:bg-[#E09900] transition-colors duration-200 font-medium"
              >
                <Filter className="w-5 h-5" />
                <span>Filter Designs</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    {['all', 'ongoing', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowFilterDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                          filterStatus === status 
                            ? 'bg-[#FAAD00]/10 text-[#FAAD00] font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status === 'all' ? 'All Designs' : `${status.charAt(0).toUpperCase() + status.slice(1)} Designs`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Designs List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Design Portfolio</h2>
            <p className="text-gray-600">{filteredDesigns.length} designs in your workspace</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDesigns.map((design) => (
                  <tr key={design.design_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{design.name}</div>
                        <div className="text-sm text-gray-500">{design.design_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{design.client_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{design.client_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(design.status)}`}>
                        {design.status?.charAt(0).toUpperCase() + design.status?.slice(1) || 'Ongoing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {design.status !== 'completed' && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-[#FAAD00]" />
                          {design.due_date}
                        </div>
                      )}
                      {design.status === 'completed' && (
                        <div className="text-sm text-green-600 font-medium">
                          ✓ {design.due_date}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(design.priority)}`}>
                        {design.priority?.charAt(0).toUpperCase() + design.priority?.slice(1) || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {design.additional_note || 'No notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDesign(design.design_id)}
                          className="p-2 text-[#FAAD00] hover:bg-[#FAAD00]/10 rounded-lg transition-colors duration-150"
                          title="View Design"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdate(design.design_id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                          title="Update Design"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(design.design_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          title="Delete Design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Design Note Popup */}
      {showNotePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-[#FAAD00]/10 rounded-lg flex items-center justify-center mr-3">
                  <StickyNote className="w-4 h-4 text-[#FAAD00]" />
                </div>
                Design Notes
              </h3>
              <button
                onClick={() => setShowNotePopup(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {isEditingNote ? (
                <textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-[#FAAD00] outline-none resize-none"
                  placeholder="Enter design notes..."
                />
              ) : (
                <p className="text-gray-800 text-sm leading-relaxed">{selectedNote}</p>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {isEditingNote ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/90 transition-colors duration-150"
                  >
                    Save Note
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdateNote}
                    className="px-4 py-2 text-[#FAAD00] bg-white border border-[#FAAD00] rounded-lg hover:bg-[#FAAD00]/10 transition-colors duration-150"
                  >
                    Update Note
                  </button>
                  <button
                    onClick={() => setShowNotePopup(false)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerHome;
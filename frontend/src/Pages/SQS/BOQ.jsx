import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  FileText, 
  Search, 
  Calendar, 
  DollarSign, 
  Package, 
  Building,
  Save,
  X,
  Trash2,
  Eye,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';


function BOQ() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'edit'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Sample data for existing BOQs
  const existingBOQs = [
    {
      id: 'BOQ001',
      projectName: 'Luxury Villa Complex',
      projectId: 'PROJ001',
      clientName: 'ABC Holdings',
      status: 'Draft',
      totalAmount: 2500000,
      lastModified: '2024-01-15',
      createdBy: 'John Doe',
      itemsCount: 45
    },
    {
      id: 'BOQ002',
      projectName: 'Commercial Tower',
      projectId: 'PROJ002',
      clientName: 'XYZ Developers',
      status: 'Approved',
      totalAmount: 8750000,
      lastModified: '2024-01-10',
      createdBy: 'Jane Smith',
      itemsCount: 78
    },
    {
      id: 'BOQ003',
      projectName: 'Residential Apartments',
      projectId: 'PROJ003',
      clientName: 'HomeLife',
      status: 'Under Review',
      totalAmount: 4200000,
      lastModified: '2024-01-08',
      createdBy: 'Mike Johnson',
      itemsCount: 56
    }
  ];

  // Sample project list for dropdown
  const projectList = [
    { id: 'PROJ001', name: 'Luxury Villa Complex', client: 'ABC Holdings' },
    { id: 'PROJ002', name: 'Commercial Tower', client: 'XYZ Developers' },
    { id: 'PROJ003', name: 'Residential Apartments', client: 'HomeLife' },
  ];

  // State for create form fields
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [clientName, setClientName] = useState('');
  const [boqDate, setBoqDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Sample BOQ items for form
  const [boqItems, setBOQItems] = useState([
    { id: 1, description: '', unit: '', quantity: '', rate: '', amount: 0 }
  ]);

  // Update project selection
  const handleProjectChange = (e) => {
    const projId = e.target.value;
    setSelectedProjectId(projId);
    const proj = projectList.find(p => p.id === projId);
    setClientName(proj ? proj.client : '');
  };

  const addBOQItem = () => {
    const newItem = {
      id: boqItems.length + 1,
      description: '',
      unit: '',
      quantity: '',
      rate: '',
      amount: 0
    };
    setBOQItems([...boqItems, newItem]);
  };

  const removeBOQItem = (id) => {
    setBOQItems(boqItems.filter(item => item.id !== id));
  };

  const updateBOQItem = (id, field, value) => {
    setBOQItems(boqItems.map(item => {
      if (item.id === id) {
        let newValue = value;
        // Prevent negative values for quantity and rate
        if ((field === 'quantity' || field === 'rate') && parseFloat(value) < 0) {
          newValue = 0;
        }
        const updatedItem = { ...item, [field]: newValue };
        if (field === 'quantity' || field === 'rate') {
          // Ensure both quantity and rate are not negative
          const quantity = parseFloat(updatedItem.quantity) < 0 ? 0 : parseFloat(updatedItem.quantity) || 0;
          const rate = parseFloat(updatedItem.rate) < 0 ? 0 : parseFloat(updatedItem.rate) || 0;
          updatedItem.amount = quantity * rate;
        }
        // Prevent negative amount
        if (updatedItem.amount < 0) {
          updatedItem.amount = 0;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return boqItems.reduce((total, item) => total + (item.amount || 0), 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const [boqs, setBOQs] = useState(existingBOQs);
  const filteredBOQs = boqs.filter(boq =>
    boq.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boq.projectId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler to update status in the table
  const handleStatusChange = (id, newStatus) => {
    setBOQs(prev => prev.map(boq => boq.id === id ? { ...boq, status: newStatus } : boq));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'create'
                    ? 'border-[#FAAD00] text-[#FAAD00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                Create New BOQ
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'edit'
                    ? 'border-[#FAAD00] text-[#FAAD00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Edit3 className="w-4 h-4 inline-block mr-2" />
                Edit Existing BOQ
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {activeTab === 'create' && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-xl mx-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center justify-center">
                  <Plus className="w-5 h-5 mr-2 text-[#FAAD00]" />
                  Create New BOQ for Project
                </h2>
                <p className="text-gray-600 mt-1 text-center">Start a new Bill of Quantities for a construction project</p>
              </div>
              <div className="p-6 flex justify-center">
                {/* Project Selection Card */}
                <div className="bg-gradient-to-br from-[#FAAD00]/10 to-[#FAAD00]/5 border-2 border-[#FAAD00]/20 rounded-xl p-6 hover:shadow-md transition-all duration-200 w-full max-w-sm">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#FAAD00] rounded-lg mb-4">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Select Project</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">Choose an existing project to create BOQ</p>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="w-full bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Select Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="space-y-6">
            {/* Edit Existing BOQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Edit3 className="w-5 h-5 mr-2 text-[#FAAD00]" />
                      Edit Existing BOQ
                    </h2>
                    <p className="text-gray-600 mt-1">Modify and update existing Bills of Quantities</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search BOQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                      />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* BOQ List */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BOQ Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBOQs.map((boq) => (
                        <tr key={boq.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">{boq.id}</div>
                              <div className="text-sm text-gray-500">{boq.itemsCount} items</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">{boq.projectName}</div>
                              <div className="text-sm text-gray-500">{boq.projectId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={boq.status}
                              onChange={e => handleStatusChange(boq.id, e.target.value)}
                              className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(boq.status)} bg-white`}
                            >
                              <option value="Draft">Draft</option>
                              <option value="Approved">Approved</option>
                              <option value="Under Review">Under Review</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">
                                LKR {boq.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(boq.lastModified).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => {
                                  setSelectedProject(boq);
                                  setShowEditForm(true);
                                }}
                                className="text-[#FAAD00] hover:text-[#FAAD00]/80 p-1 rounded transition-colors duration-200"
                                title="Edit BOQ"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedProject(boq);
                                  setShowEditForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                                title="View BOQ"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-800 p-1 rounded transition-colors duration-200"
                                title="Download BOQ"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors duration-200"
                                title="More actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredBOQs.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No BOQs found</h3>
                    <p className="text-gray-500">No BOQs match your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create BOQ Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/50 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New BOQ</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Project Info Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                  >
                    <option value="">Select a project</option>
                    {projectList.map((proj) => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent bg-gray-100"
                    value={selectedProjectId ? selectedProjectId : ''}
                    placeholder="Project ID"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent bg-gray-100"
                    value={clientName}
                    placeholder="Client Name"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BOQ Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent bg-gray-100"
                    value={boqDate}
                    readOnly
                  />
                </div>
              </div>

              {/* BOQ Items Table */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">BOQ Items</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {boqItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateBOQItem(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.unit}
                              onChange={(e) => updateBOQItem(item.id, 'unit', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                            >
                              <option value="">Select unit</option>
                              <option value="m²">m²</option>
                              <option value="m³">m³</option>
                              <option value="m">m</option>
                              <option value="kg">kg</option>
                              <option value="pcs">pcs</option>
                              <option value="nos">nos</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => updateBOQItem(item.id, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              value={item.rate}
                              onChange={(e) => updateBOQItem(item.id, 'rate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">
                              LKR {item.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeBOQItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                              disabled={boqItems.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Add Item button below table, above total */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={addBOQItem}
                    className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
                {/* Total Amount */}
                <div className="flex justify-end mt-2">
                  <span className="font-semibold text-gray-900 mr-2">Total Amount:</span>
                  <span className="font-bold text-lg text-[#FAAD00]">LKR {getTotalAmount().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                  Save as Draft
                </button>
                <button className="px-6 py-2 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Create BOQ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit BOQ Modal */}
      {showEditForm && selectedProject && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/50 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit BOQ - {selectedProject.id}</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedProject(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Project Info Form (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={selectedProject.projectName}
                    placeholder="Project Name"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={selectedProject.projectId}
                    placeholder="Project ID"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={selectedProject.clientName}
                    placeholder="Client Name"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BOQ Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={boqDate}
                    readOnly
                  />
                </div>
              </div>

              {/* BOQ Items Table (Similar to create form) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">BOQ Items</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {boqItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateBOQItem(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.unit}
                              onChange={(e) => updateBOQItem(item.id, 'unit', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                            >
                              <option value="">Select unit</option>
                              <option value="m²">m²</option>
                              <option value="m³">m³</option>
                              <option value="m">m</option>
                              <option value="kg">kg</option>
                              <option value="pcs">pcs</option>
                              <option value="nos">nos</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateBOQItem(item.id, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateBOQItem(item.id, 'rate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#FAAD00] focus:border-transparent"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">
                              LKR {item.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeBOQItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                              disabled={boqItems.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Add Item button below table, above total */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={addBOQItem}
                    className="bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
                {/* Total Amount */}
                <div className="flex justify-end mt-2">
                  <span className="font-semibold text-gray-900 mr-2">Total Amount:</span>
                  <span className="font-bold text-lg text-[#FAAD00]">LKR {getTotalAmount().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedProject(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                  Save as Draft
                </button>
                <button className="px-6 py-2 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Update BOQ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BOQ;

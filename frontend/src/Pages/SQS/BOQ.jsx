import React, { useState, useEffect } from 'react';
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
  const [boqs, setBOQs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Project lists fetched from backend
  const [projectsWithoutBOQ, setProjectsWithoutBOQ] = useState([]);
  const [projectsWithBOQ, setProjectsWithBOQ] = useState([]);
  const [approvedBOQs, setApprovedBOQs] = useState([]);
  const [underReviewBOQs, setUnderReviewBOQs] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState(null);

  // Fetch BOQ data from API
  const fetchBOQs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[SQS BOQ] Starting fetch...');
      
      // Add timeout to the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:8086/api/v1/sqs/boqs', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorMessage = `Failed to fetch BOQs: ${response.status} ${response.statusText}`;
        console.error('[SQS BOQ] HTTP Error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('[SQS BOQ] Data received:', data);
      
      // Process the BOQ data according to the new API format
      const processedBOQs = data.map(boqData => {
        const boq = boqData.boq;
        const items = boqData.items || [];
        const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        
        return {
          id: boq.boqId,
          projectName: boqData.projectName || 'Unknown Project',
          projectId: boq.projectId,
          clientName: 'Unknown Client', // Client info not available in this API format
          status: boq.status || 'Draft',
          totalAmount: totalAmount,
          lastModified: boq.date || new Date().toISOString().split('T')[0],
          createdBy: boqData.qsName || 'Unknown',
          itemsCount: items.length,
          projectLocation: boqData.projectLocation || '',
          projectCategory: boqData.projectCategory || '',
          boqData: {
            ...boq,
            items: items,
            createdDate: boq.date,
            projectName: boqData.projectName,
            projectLocation: boqData.projectLocation,
            projectCategory: boqData.projectCategory,
            qsName: boqData.qsName
          }
        };
      });
      
      // Filter BOQs to show only FINAL and APPROVED status for SQS officers
      const finalBOQs = processedBOQs.filter(boq => {
        const status = boq.status?.toUpperCase();
        return status === 'FINAL' || status === 'APPROVED';
      });
      
      // Separate BOQs into approved and under review
      const approvedBOQs = finalBOQs.filter(boq => boq.status?.toUpperCase() === 'APPROVED');
      const underReviewBOQs = finalBOQs.filter(boq => boq.status?.toUpperCase() === 'FINAL');
      
      // For now, assume all returned BOQs are for editing (projects with BOQs)
      // You might need a separate API call to get projects without BOQs
      setProjectsWithoutBOQ([]); // Empty for now - need separate API for projects without BOQs
      setProjectsWithBOQ(finalBOQs);
      setBOQs(finalBOQs);
      setApprovedBOQs(approvedBOQs);
      setUnderReviewBOQs(underReviewBOQs);
      console.log('[SQS BOQ] Data processed successfully');
    } catch (err) {
      console.error('[SQS BOQ] Error fetching BOQs:', err);
      let errorMessage = 'Failed to fetch BOQ data. Please try again.';
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Don't set fallback data if there's an error - let user see the error
      setBOQs([]);
      setProjectsWithoutBOQ([]);
      setProjectsWithBOQ([]);
      setApprovedBOQs([]);
      setUnderReviewBOQs([]);
    } finally {
      setLoading(false);
      console.log('[SQS BOQ] Fetch completed');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBOQs();
  }, []);

  // Load BOQ items when editing a project
  useEffect(() => {
    if (showEditForm && selectedProject && selectedProject.boqData?.items) {
      setBOQItems(selectedProject.boqData.items.map((item, index) => ({
        id: item.itemId || index + 1,
        itemId: item.itemId, // Keep original itemId for updates
        description: item.itemDescription || '',
        unit: item.unit || '',
        quantity: item.quantity || '',
        rate: item.rate || '',
        amount: item.amount || (item.quantity * item.rate) || 0
      })));
    }
  }, [showEditForm, selectedProject]);

  // Sample data for existing BOQs (fallback)
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
    const proj = projectsWithoutBOQ.find(p => p.id === projId);
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
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FINAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'UNDER REVIEW': 
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBOQs = boqs.filter(boq => {
    const searchLower = searchTerm.toLowerCase();
    const projectName = (boq.projectName || '').toLowerCase();
    const projectId = (boq.projectId || '').toLowerCase();
    const boqId = (boq.id || '').toLowerCase();
    
    return projectName.includes(searchLower) || 
           projectId.includes(searchLower) || 
           boqId.includes(searchLower);
  });

  const filteredApprovedBOQs = approvedBOQs.filter(boq => {
    const searchLower = searchTerm.toLowerCase();
    const projectName = (boq.projectName || '').toLowerCase();
    const projectId = (boq.projectId || '').toLowerCase();
    const boqId = (boq.id || '').toLowerCase();
    
    return projectName.includes(searchLower) || 
           projectId.includes(searchLower) || 
           boqId.includes(searchLower);
  });

  const filteredUnderReviewBOQs = underReviewBOQs.filter(boq => {
    const searchLower = searchTerm.toLowerCase();
    const projectName = (boq.projectName || '').toLowerCase();
    const projectId = (boq.projectId || '').toLowerCase();
    const boqId = (boq.id || '').toLowerCase();
    
    return projectName.includes(searchLower) || 
           projectId.includes(searchLower) || 
           boqId.includes(searchLower);
  });

  // Function to render BOQ table
  const renderBOQTable = (boqList, title, emptyMessage) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{boqList.length} BOQ(s) found</p>
      </div>
      <div className="p-6">
        {boqList.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h4 className="text-md font-medium text-gray-900 mb-1">{emptyMessage}</h4>
            <p className="text-gray-500 text-sm">No BOQs in this category match your search criteria.</p>
          </div>
        ) : (
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
                    QS Officer
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
                {boqList.map((boq) => (
                  <tr key={boq.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{boq.id || boq.boqId || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{boq.itemsCount || boq.items?.length || 0} items</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{boq.projectName || boq.project?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{boq.projectId || boq.project?.id || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{boq.boqData?.qsName || boq.createdBy || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">QS Officer</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(boq.status)}`}>
                        {boq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          LKR {(boq.totalAmount || boq.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(boq.lastModified || boq.updatedAt || boq.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditBOQ(boq)}
                          className="text-[#FAAD00] hover:text-[#FAAD00]/80 p-1 rounded transition-colors duration-200"
                          title="Edit BOQ"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewBOQ(boq)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                          title="View BOQ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadBOQ(boq.id || boq.boqId)}
                          className="text-green-600 hover:text-green-800 p-1 rounded transition-colors duration-200"
                          title="Download BOQ"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {/* Show approve button only for Under Review BOQs (FINAL status) */}
                        {boq.status?.toUpperCase() === 'FINAL' && (
                          <button 
                            onClick={() => handleApproveBOQ(boq.id || boq.boqId)}
                            className="text-green-700 hover:text-green-900 p-1 rounded transition-colors duration-200 bg-green-50 hover:bg-green-100"
                            title="Approve BOQ"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
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
        )}
      </div>
    </div>
  );

  // Handler to update status in the table
  const handleStatusChange = (id, newStatus) => {
    setBOQs(prev => prev.map(boq => boq.id === id ? { ...boq, status: newStatus } : boq));
  };

  // Function to refresh data manually
  const handleRefresh = () => {
    fetchBOQs();
  };

  // Handle edit BOQ - load details from selectedProject
  const handleEditBOQ = async (boq) => {
    setSelectedProject(boq);
    setShowEditForm(true);
    
    // BOQ details are already loaded in the boq object from the API
    if (boq.boqData?.items) {
      setBOQItems(boq.boqData.items.map((item, index) => ({
        id: item.itemId || index + 1,
        itemId: item.itemId, // Keep original itemId for updates
        description: item.itemDescription || '',
        unit: item.unit || '',
        quantity: item.quantity || '',
        rate: item.rate || '',
        amount: item.amount || (item.quantity * item.rate) || 0
      })));
    }
  };

  // Handle view BOQ - same as edit for now
  const handleViewBOQ = async (boq) => {
    setSelectedProject(boq);
    setShowEditForm(true);
    
    // BOQ details are already loaded in the boq object from the API
    if (boq.boqData?.items) {
      setBOQItems(boq.boqData.items.map((item, index) => ({
        id: item.itemId || index + 1,
        itemId: item.itemId, // Keep original itemId for updates
        description: item.itemDescription || '',
        unit: item.unit || '',
        quantity: item.quantity || '',
        rate: item.rate || '',
        amount: item.amount || (item.quantity * item.rate) || 0
      })));
    }
  };

  // Handle closing edit/view modal
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedProject(null);
    // Reset to default empty item
    setBOQItems([{ id: 1, description: '', unit: '', quantity: '', rate: '', amount: 0 }]);
  };

  // Handler to download BOQ PDF
  const handleDownloadBOQ = async (boqId) => {
    try {
      const res = await fetch(`http://localhost:8086/api/v1/boq/${boqId}/download`, {
        method: 'GET',
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to download BOQ PDF: ' + errorText);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BOQ_${boqId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading BOQ PDF: ' + err.message);
      console.error('[BOQ Download] Exception:', err);
    }
  };

  // Handler to approve BOQ
  const handleApproveBOQ = async (boqId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      'Are you sure you want to approve this BOQ? Once approved, the status will be changed to "APPROVED" and this action cannot be undone.'
    );
    
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8086/api/v1/sqs/boqs/${boqId}/status?status=APPROVED`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve BOQ: ${errorText}`);
      }

      // Show success message
      alert('BOQ has been successfully approved!');
      
      // Refresh the BOQ list to update the UI
      await fetchBOQs();
      
    } catch (err) {
      alert('Error approving BOQ: ' + err.message);
      console.error('[BOQ Approve] Exception:', err);
    }
  };

  // Helper to format date as yyyy-MM-dd
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  // Helper to clear BOQ form
  const clearBOQForm = () => {
    setSelectedProjectId('');
    setClientName('');
    setBoqDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    setBOQItems([{ id: 1, description: '', unit: '', quantity: '', rate: '', amount: 0 }]);
  };

  // General handler for create or draft
  const handleSaveBOQ = async (status = "FINAL", isEdit = false) => {
    // For edit, use selectedProject info
    const projectId = isEdit && selectedProject ? selectedProject.projectId : selectedProjectId;
    if (!projectId || boqItems.length === 0) return;

    // Validate all BOQ items: no field can be null/empty/invalid
    const validItems = boqItems.filter(item =>
      item.description &&
      item.unit &&
      item.quantity !== '' && item.quantity !== null && !isNaN(Number(item.quantity)) && Number(item.quantity) > 0 &&
      item.rate !== '' && item.rate !== null && !isNaN(Number(item.rate)) && Number(item.rate) > 0 &&
      item.amount !== '' && item.amount !== null && !isNaN(Number(item.amount)) && Number(item.amount) >= 0
    ).map(item => {
      const obj = {
        itemDescription: item.description,
        quantity: Number(item.quantity),
        unit: item.unit,
        rate: Number(item.rate),
        amount: Number(item.amount)
      };
      // For edit, if itemId exists, include it
      if (isEdit && item.itemId) obj.itemId = item.itemId;
      return obj;
    });

    if (validItems.length !== boqItems.length) {
      alert("Please fill all BOQ item fields (description, unit, quantity > 0, rate > 0, amount >= 0). No field can be empty or null.");
      return;
    }

    // For edit, if boqId exists, include it
    const boqObj = {
      projectId: projectId,
      date: formatDate(boqDate),
      qsId: isEdit && selectedProject?.boqData?.qsId ? selectedProject.boqData.qsId : "EMP_001", // Use original QS ID for updates
      status: status
    };
    if (isEdit && selectedProject && selectedProject.id) boqObj.boqId = selectedProject.id;

    const payload = {
      boq: boqObj,
      items: validItems.map(item => ({
        ...item,
        boqId: isEdit && selectedProject ? selectedProject.id : null // Add boqId to each item for backend
      }))
    };

    // Debug: log payload before sending
    console.log("[BOQ Save] Payload:", payload);

    try {
      const url = isEdit ? "http://localhost:8086/api/v1/boq/update" : "http://localhost:8086/api/v1/boq/create";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[BOQ Save] Backend error:", errorText);
        throw new Error("Failed to save BOQ: " + errorText);
      }
      setShowCreateForm(false);
      setShowEditForm(false);
      setSelectedProject(null);
      clearBOQForm();
      // Refresh the BOQ list
      fetchBOQs();
    } catch (err) {
      alert("Error saving BOQ: " + err.message);
      console.error("[BOQ Save] Exception:", err);
    }
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
                View and Edit BOQ
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
            {/* View and Edit BOQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Edit3 className="w-5 h-5 mr-2 text-[#FAAD00]" />
                      View and Edit BOQ
                    </h2>
                    <p className="text-gray-600 mt-1">View and modify Bills of Quantities</p>
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
                    <button 
                      onClick={handleRefresh}
                      disabled={loading}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                      title="Refresh BOQs"
                    >
                      <svg className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAAD00] mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading BOQs...</h3>
                <p className="text-gray-500">Please wait while we fetch the data.</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                  <div className="text-red-600 font-medium mb-2">Error Loading BOQs</div>
                  <div className="text-red-500 text-sm">{error}</div>
                  <button 
                    onClick={fetchBOQs}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* BOQ Sections */}
            {!loading && !error && (
              <>
                {/* Approved BOQs Section */}
                {renderBOQTable(filteredApprovedBOQs, "Approved BOQs", "No Approved BOQs Found")}
                
                {/* Under Review BOQs Section */}
                {renderBOQTable(filteredUnderReviewBOQs, "Under Review BOQs", "No BOQs Under Review Found")}
              </>
            )}
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
                    {projectsWithoutBOQ.map((proj) => (
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
                <button 
                  onClick={() => handleSaveBOQ("DRAFT", false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleSaveBOQ("FINAL", false)}
                  className="px-6 py-2 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit BOQ - {selectedProject.id || selectedProject.boqId || 'Unknown'}
                </h2>
                <button
                  onClick={handleCloseEditForm}
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
                    value={selectedProject.projectName || selectedProject.project?.name || 'N/A'}
                    placeholder="Project Name"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={selectedProject.projectId || selectedProject.project?.id || 'N/A'}
                    placeholder="Project ID"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={selectedProject.clientName || selectedProject.client?.name || 'N/A'}
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
                  onClick={handleCloseEditForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveBOQ("DRAFT", true)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleSaveBOQ("FINAL", true)}
                  className="px-6 py-2 bg-[#FAAD00] hover:bg-[#FAAD00]/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
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

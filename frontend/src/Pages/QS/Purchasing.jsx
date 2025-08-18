import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Eye, FileDown, CheckCircle, Clock, 
  X, Calendar, Package, User, Building, MapPin, DollarSign, Edit
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8086/api/v1/quotation';

const Purchasing = () => {
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotationFormData, setQuotationFormData] = useState({
    project: '',
    requiredDate: '',
    description: '',
    materials: [],
    suppliers: []
  });
  const [currentMaterial, setCurrentMaterial] = useState({
    name: '',
    description: '',
    quantity: '',
    amount: ''
  });
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuotationDetail, setShowQuotationDetail] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [quotationResponses, setQuotationResponses] = useState([]);
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseCounts, setResponseCounts] = useState({});

  // Mock QS ID - In real app, this would come from authentication context
  const qsId = 1;
  const qsEmpId = 'EMP_001'; // QS Employee ID for fetching projects

  // State for projects from API
  const [ongoingProjects, setOngoingProjects] = useState([]);

  // Sample data for suppliers
  const suppliers = [
    { id: 1, name: 'ABC Building Materials', rating: 4.5 },
    { id: 2, name: 'Quality Construction Supplies', rating: 4.2 },
    { id: 3, name: 'Premium Materials Ltd', rating: 4.8 },
    { id: 4, name: 'BuildPro Suppliers', rating: 4.0 },
  ];

  // API Functions
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/qs/${qsEmpId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Raw API response:', data);
        
        // Extract quotations array from the response
        const quotationsArray = data.quotations || data || [];
        
        // Transform the API response to match UI expectations
        const transformedData = Array.isArray(quotationsArray) ? quotationsArray.map(item => {
          console.log('Processing quotation item:', item);
          
          return {
            qId: item.qid || item.qId || item.id,
            projectId: item.projectId || 'Unknown ID',
            projectName: item.projectName || item.projectId || 'Unknown Project',
            requiredDate: item.deadline || item.requiredDate || item.date,
            status: item.status || 'PENDING',
            description: item.description || 'No description',
            items: item.items || item.quotationItems || [],
            suppliers: item.supplierIds ? 
              item.supplierIds.map(id => {
                const supplier = suppliers.find(s => s.id === id);
                return supplier ? supplier.name : `Supplier ${id}`;
              }) : 
              (item.suppliers || item.supplierNames || []),
            createdDate: item.date || item.createdDate,
            // Add original item for debugging
            _original: item
          };
        }) : [];
        
        setQuotations(transformedData);
        console.log('Transformed quotations:', transformedData);
      } else {
        throw new Error('Failed to fetch quotations');
      }
    } catch (error) {
      setError('Error fetching quotations: ' + error.message);
      console.error('Error fetching quotations:', error);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/qs/projects/${qsEmpId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setOngoingProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to empty array if API fails
      setOngoingProjects([]);
    }
  };

  const fetchQuotationDetails = async (quotationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${quotationId}/with-items`);
      if (response.ok) {
        const data = await response.json();
        console.log('Quotation detail response:', data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching quotation details:', error);
    }
    return null;
  };

  const createQuotation = async (quotationData, status = 'pending') => {
    setLoading(true);
    try {
      const dataWithStatus = {
        ...quotationData,
        quotation: {
          ...quotationData.quotation,
          status: status
        }
      };

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithStatus),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh quotations list
        await fetchQuotations();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create quotation');
      }
    } catch (error) {
      setError('Error creating quotation: ' + error.message);
      console.error('Error creating quotation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update quotation function
  const updateQuotation = async (quotationId, quotationData, status = 'pending') => {
    setLoading(true);
    try {
      const dataWithStatus = {
        ...quotationData,
        quotation: {
          ...quotationData.quotation,
          status: status
        }
      };

      const response = await fetch(`${API_BASE_URL}/${quotationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithStatus),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh quotations list
        await fetchQuotations();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quotation');
      }
    } catch (error) {
      setError('Error updating quotation: ' + error.message);
      console.error('Error updating quotation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotationResponses = async (quotationId) => {
    setResponseLoading(true);
    try {
      const response = await fetch(`http://localhost:8086/api/v1/quotation/${quotationId}/responses`);
      if (response.ok) {
        const data = await response.json();
        setQuotationResponses(data.responses || []);
        return data.responses || [];
      } else {
        throw new Error('Failed to fetch responses');
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      setQuotationResponses([]);
      return [];
    } finally {
      setResponseLoading(false);
    }
  };

  const fetchResponseCounts = async () => {
    try {
      const counts = {};
      for (const quotation of quotations) {
        if (quotation.status === 'sent') {
          const responses = await fetch(`http://localhost:8086/api/v1/quotation/${quotation.qId}/responses`);
          if (responses.ok) {
            const data = await responses.json();
            counts[quotation.qId] = data.responses ? data.responses.length : 0;
          }
        }
      }
      setResponseCounts(counts);
    } catch (error) {
      console.error('Error fetching response counts:', error);
    }
  };

  // Load quotations and projects on component mount
  useEffect(() => {
    fetchQuotations();
    fetchProjects();
  }, []);

  // Fetch response counts when quotations change
  useEffect(() => {
    if (quotations.length > 0) {
      fetchResponseCounts();
    }
  }, [quotations]);  
  
  const handleQuotationSubmit = async (e, submitType = 'send') => {
    e.preventDefault();
    
    // Validate that all required fields are filled
    if (!quotationFormData.project) {
      alert('Please select a project');
      return;
    }
    if (!quotationFormData.requiredDate) {
      alert('Please select a required date');
      return;
    }
    if (!quotationFormData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (quotationFormData.materials.length === 0) {
      alert('Please add at least one material/service');
      return;
    }
    if (quotationFormData.suppliers.length === 0) {
      alert('Please select at least one supplier');
      return;
    }

    // Show confirmation dialog for sending
    if (submitType === 'send') {
      setShowConfirmDialog(true);
      return;
    }

    await processQuotationSubmission(submitType);
  };

  const processQuotationSubmission = async (submitType) => {
    try {
      const status = submitType === 'send' ? 'sent' : 'pending';
      
      // Transform data to match backend expected format
      const quotationData = {
        quotation: {
          projectId: quotationFormData.project, // This should be project ID from dropdown
          qsId: qsEmpId, // Use the QS employee ID
          date: new Date().toISOString().split('T')[0], // Current date
          deadline: quotationFormData.requiredDate,
          description: quotationFormData.description.trim(),
          status: status
        },
        items: quotationFormData.materials.map(material => ({
          name: material.name,
          description: material.description,
          amount: parseFloat(material.amount) || 0,
          quantity: parseInt(material.quantity) || 1
        })),
        supplierIds: quotationFormData.suppliers.map(supplierName => {
          // Find supplier ID by name - for now using mock IDs
          const supplier = suppliers.find(s => s.name === supplierName);
          return supplier ? supplier.id : 1; // Fallback to ID 1 if not found
        })
      };

      if (isEditMode && selectedQuotation) {
        await updateQuotation(selectedQuotation.qId, quotationData, status);
        setIsEditMode(false);
        setSelectedQuotation(null);
        alert(`Quotation ${status === 'sent' ? 'sent' : 'updated'} successfully!`);
      } else {
        await createQuotation(quotationData, status);
        alert(`Quotation ${status === 'sent' ? 'sent' : 'saved as draft'} successfully!`);
      }
      
      // Reset form on success
      setShowQuotationForm(false);
      setQuotationFormData({
        project: '',
        requiredDate: '',
        description: '',
        materials: [],
        suppliers: []
      });
      setCurrentMaterial({ name: '', description: '', quantity: '', amount: '' });
      setSupplierSearch('');
      setShowConfirmDialog(false);
      
    } catch (error) {
      alert(`Failed to ${submitType === 'send' ? 'send' : 'save'} quotation request. Please try again.`);
    }
  };

  // Handle editing a quotation
  const handleEditQuotation = async (quotation) => {
    // Get detailed quotation data first
    const detailedQuotation = await fetchQuotationDetails(quotation.qId);
    
    if (detailedQuotation) {
      // Populate the form with existing data
      setQuotationFormData({
        project: detailedQuotation.quotation?.projectId || quotation.projectName,
        requiredDate: detailedQuotation.quotation?.deadline || quotation.requiredDate,
        description: detailedQuotation.quotation?.description || quotation.description || '',
        materials: detailedQuotation.items || [],
        suppliers: detailedQuotation.suppliers ? 
          detailedQuotation.suppliers.map(supplier => supplier.supplierName) : []
      });
    } else {
      // Fallback to basic quotation data
      setQuotationFormData({
        project: quotation.projectName || '',
        requiredDate: quotation.requiredDate || '',
        description: quotation.description || '',
        materials: quotation.items || [],
        suppliers: quotation.suppliers || []
      });
    }
    
    setSelectedQuotation(quotation);
    setIsEditMode(true);
    setShowQuotationDetail(false);
    setShowQuotationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setCurrentMaterial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMaterial = () => {
    if (currentMaterial.name && currentMaterial.quantity && parseInt(currentMaterial.quantity) >= 1) {
      const amount = parseFloat(currentMaterial.amount) || 0;
      if (amount >= 0) {
        setQuotationFormData(prev => ({
          ...prev,
          materials: [...prev.materials, { 
            ...currentMaterial, 
            itemId: Date.now(), 
            qId: null,
            quantity: parseInt(currentMaterial.quantity),
            amount: amount
          }]
        }));
        setCurrentMaterial({ name: '', description: '', quantity: '', amount: '' });
      }
    }
  };

  const removeMaterial = (itemId) => {
    setQuotationFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material.itemId !== itemId)
    }));
  };

  const handleSupplierSearch = (e) => {
    setSupplierSearch(e.target.value);
    setShowSupplierDropdown(e.target.value.length > 0);
  };

  const addSupplier = (supplierName) => {
    if (!quotationFormData.suppliers.includes(supplierName)) {
      setQuotationFormData(prev => ({
        ...prev,
        suppliers: [...prev.suppliers, supplierName]
      }));
    }
    setSupplierSearch('');
    setShowSupplierDropdown(false);
  };

  const removeSupplier = (supplierName) => {
    setQuotationFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter(s => s !== supplierName)
    }));
  };

  const getFilteredSuppliers = () => {
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) &&
      !quotationFormData.suppliers.includes(supplier.name)
    );
  };

  const getStatusBadge = (status) => {
    const upperStatus = status?.toUpperCase();
    if (upperStatus === 'RECEIVED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Received
        </span>
      );
    } else if (upperStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock className="w-3 h-3 mr-1" />
          {status || 'Unknown'}
        </span>
      );
    }
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const handleViewQuotation = async (quotation) => {
    // Try to get detailed quotation data with items
    const detailedQuotation = await fetchQuotationDetails(quotation.qId);
    
    if (detailedQuotation) {
      console.log('Detailed quotation data:', detailedQuotation);
      
      // Extract supplier names from the supplier objects
      const suppliersArray = detailedQuotation.suppliers ? 
        detailedQuotation.suppliers.map(supplier => supplier.supplierName) : [];
      
      const mergedQuotation = {
        ...quotation,
        // Handle quotation object from the response
        qId: detailedQuotation.quotation?.qid || quotation.qId,
        projectId: detailedQuotation.quotation?.projectId || quotation.projectId,
        projectName: detailedQuotation.quotation?.projectName || quotation.projectName,
        requiredDate: detailedQuotation.quotation?.deadline || quotation.requiredDate,
        status: detailedQuotation.quotation?.status || quotation.status,
        createdDate: detailedQuotation.quotation?.date || quotation.createdDate,
        description: detailedQuotation.quotation?.description || quotation.description,
        // Items from the detailed response
        items: detailedQuotation.items || [],
        // Suppliers - extract supplier names from the supplier objects
        suppliers: suppliersArray,
        // Keep the full supplier details for additional information
        supplierDetails: detailedQuotation.suppliers || []
      };
      
      setSelectedQuotation(mergedQuotation);
    } else {
      // Fallback to basic quotation data
      setSelectedQuotation(quotation);
    }
    
    setShowQuotationDetail(true);
  };

  const handleViewResponses = async (quotation) => {
    await fetchQuotationResponses(quotation.qId);
    setSelectedQuotation(quotation);
    setShowResponseModal(true);
  };

  const handlePurchaseResponse = (response) => {
    // Handle purchase logic here
    console.log('Purchasing from response:', response);
    alert(`Purchase order will be created for ${response.supplierName} with total amount Rs. ${response.totalAmount.toLocaleString()}`);
    // In a real application, this would make an API call to create a purchase order
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          
          <button
            onClick={() => setShowQuotationForm(true)}
            className="flex items-center px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Quotation Request
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(quotations) ? quotations.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Received Quotations</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(quotations) ? quotations.filter(q => q.status === 'RECEIVED' || q.status === 'received').length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Quotations</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(quotations) ? quotations.filter(q => q.status === 'PENDING' || q.status === 'pending').length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{purchasedItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Quotation Requests</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search quotations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quotation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading quotations...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : !Array.isArray(quotations) || quotations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No quotations found
                  </td>
                </tr>
              ) : (
                quotations.map((quotation) => (
                  <tr key={quotation.qId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Q{quotation.qId.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quotation.projectName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={quotation.description}>
                      {quotation.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quotation.requiredDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quotation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewQuotation(quotation)}
                          className="text-[#FAAD00] hover:text-[#FAAD00]/80 flex items-center"
                          title="View Quotation Details"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {quotation.status === 'pending' && (
                          <button
                            onClick={() => handleEditQuotation(quotation)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                            title="Edit Quotation"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchased Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search purchases..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchasedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.material} ({item.quantity})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(item.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {item.paymentStatus === 'paid' && item.invoiceFile ? (
                        <button
                          className="text-[#FAAD00] hover:text-[#FAAD00]/80 flex items-center"
                          title="Download Invoice"
                        >
                          <FileDown className="w-4 h-4 mr-1" />
                          Invoice
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">No invoice</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Request Form Modal */}
      {showQuotationForm && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? 'Edit Quotation Request' : 'New Quotation Request'}
                </h3>
                <button
                  onClick={() => setShowQuotationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleQuotationSubmit} className="p-6 space-y-6">
              {/* Project and Required Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Select Project
                  </label>
                  <select
                    name="project"
                    value={quotationFormData.project}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  >
                    <option value="">Choose a project...</option>
                    {Array.isArray(ongoingProjects) && ongoingProjects.map((project) => (
                      <option key={project.id || project.projectId} value={project.id || project.projectId}>
                        {project.name || project.projectName} {project.location && `- ${project.location}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Required Date
                  </label>
                  <input
                    type="date"
                    name="requiredDate"
                    value={quotationFormData.requiredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileDown className="w-4 h-4 inline mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={quotationFormData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter a description for this quotation request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent resize-none"
                />
              </div>

              {/* Materials/Services Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Materials/Services
                </label>
                
                {/* Add Material Form */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    name="name"
                    value={currentMaterial.name}
                    onChange={handleMaterialChange}
                    placeholder="Material/Service name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="description"
                    value={currentMaterial.description}
                    onChange={handleMaterialChange}
                    placeholder="Description"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={currentMaterial.quantity}
                    onChange={handleMaterialChange}
                    placeholder="Quantity"
                    min="1"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="amount"
                    value={currentMaterial.amount}
                    onChange={handleMaterialChange}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add
                  </button>
                </div>

                {/* Materials Table */}
                {quotationFormData.materials.length > 0 && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Material/Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estimated Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {quotationFormData.materials.map((material) => (
                          <tr key={material.itemId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {material.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {material.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {material.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {material.amount ? `Rs. ${parseFloat(material.amount).toLocaleString()}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => removeMaterial(material.itemId)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {quotationFormData.materials.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">Please add at least one material/service</p>
                )}
              </div>

              {/* Suppliers Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Select Suppliers
                </label>

                {/* Selected Suppliers */}
                {quotationFormData.suppliers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Selected suppliers:</p>
                    <div className="flex flex-wrap gap-2">
                      {quotationFormData.suppliers.map((supplier) => (
                        <span
                          key={supplier}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FAAD00] bg-opacity-10 text-[#000000]"
                        >
                          {supplier}
                          <button
                            type="button"
                            onClick={() => removeSupplier(supplier)}
                            className="ml-2 text-black hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Supplier Search */}
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={supplierSearch}
                      onChange={handleSupplierSearch}
                      placeholder="Search and add suppliers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                    />
                  </div>

                  {/* Supplier Dropdown */}
                  {showSupplierDropdown && getFilteredSuppliers().length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {getFilteredSuppliers().map((supplier) => (
                        <div
                          key={supplier.id}
                          onClick={() => addSupplier(supplier.name)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-700">{supplier.name}</span>
                          <span className="text-xs text-gray-500">Rating: {supplier.rating}/5</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {quotationFormData.suppliers.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">Please select at least one supplier</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuotationForm(false);
                    setIsEditMode(false);
                    setSelectedQuotation(null);
                    setQuotationFormData({
                      project: '',
                      requiredDate: '',
                      description: '',
                      materials: [],
                      suppliers: []
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuotationSubmit(e, 'draft')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuotationSubmit(e, 'send')}
                  className="px-6 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
                >
                  {isEditMode ? 'Update & Send' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quotation Detail Modal */}
      {showQuotationDetail && selectedQuotation && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Quotation Details - Q{selectedQuotation.qId.toString().padStart(3, '0')}
                </h3>
                <button
                  onClick={() => setShowQuotationDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quotation Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Quotation Information</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Quotation ID:</span>
                      <span className="font-medium">Q{selectedQuotation.qId.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Project:</span>
                      <span className="font-medium">{selectedQuotation.projectId} - {selectedQuotation.projectName}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Required Date:</span>
                      <span className="font-medium">{selectedQuotation.requiredDate}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <span>{getStatusBadge(selectedQuotation.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">QS Officer Details</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">QS ID:</span>
                      <span className="font-medium">{qsEmpId}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Created Date:</span>
                      <span className="font-medium">{selectedQuotation.createdDate || new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedQuotation.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Materials/Services</h4>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estimated Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
                        selectedQuotation.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.amount ? `Rs. ${parseFloat(item.amount).toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Total Amount */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-[#FAAD00] bg-opacity-10 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 font-medium">Total Estimated Amount:</span>
                      <span className="text-xl font-bold text-black">
                        Rs. {selectedQuotation.items && selectedQuotation.items.length > 0 
                          ? selectedQuotation.items
                              .reduce((total, item) => {
                                const quantity = parseFloat(item.quantity) || 0;
                                const amount = parseFloat(item.amount) || 0;
                                return total + (quantity * amount);
                              }, 0)
                              .toLocaleString()
                          : '0'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suppliers Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Selected Suppliers</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedQuotation.suppliers && selectedQuotation.suppliers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedQuotation.suppliers.map((supplier, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FAAD00] bg-opacity-10 text-[#000000]"
                        >
                          {supplier}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No suppliers selected</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowQuotationDetail(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedQuotation.status === 'pending' && (
                  <button
                    onClick={() => handleEditQuotation(selectedQuotation)}
                    className="px-4 py-2 border border-[#FAAD00] text-[#FAAD00] rounded-lg hover:bg-[#FAAD00]/10 transition-colors duration-200"
                  >
                    Edit
                  </button>
                )}
                {selectedQuotation.status === 'sent' && (
                  <button
                    onClick={() => handleViewResponses(selectedQuotation)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>View Response</span>
                    {responseCounts[selectedQuotation.qId] > 0 && (
                      <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full">
                        {responseCounts[selectedQuotation.qId]}
                      </span>
                    )}
                  </button>
                )}
                {selectedQuotation.status === 'RECEIVED' && (
                  <button
                    className="px-6 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
                  >
                    Process Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Send Quotation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to send this quotation request to suppliers? 
              Once sent, the status will be changed to "sent" and the quotation cannot be edited.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => processQuotationSubmission('send')}
                className="px-6 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
              >
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedQuotation && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Responses for Quotation Q{selectedQuotation.qId.toString().padStart(3, '0')}
                </h3>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {responseLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAAD00]"></div>
                  <span className="ml-2 text-gray-600">Loading responses...</span>
                </div>
              ) : quotationResponses.length > 0 ? (
                <div className="space-y-4">
                  {quotationResponses.map((response, index) => (
                    <div key={response.responseId} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{response.supplierName}</h4>
                          <p className="text-sm text-gray-600">{response.supplierEmail} | {response.supplierPhone}</p>
                          <p className="text-sm text-gray-600">{response.supplierAddress}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#FAAD00]">
                            Rs. {response.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Delivery: {response.deliveryDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Response Date:</span>
                          <span className="ml-2 text-sm text-gray-900">{response.respondDate}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            response.status === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {response.status}
                          </span>
                        </div>
                      </div>

                      {response.additionalNote && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-600">Additional Notes:</span>
                          <p className="text-sm text-gray-900 mt-1">{response.additionalNote}</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={() => handlePurchaseResponse(response)}
                          className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
                        >
                          Select for Purchase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No responses received yet for this quotation.</p>
                </div>
              )}

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchasing;

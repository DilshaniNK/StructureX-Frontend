import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Eye, FileDown, CheckCircle, Clock, 
  X, Calendar, Package, User, Building, MapPin, DollarSign, Edit,
  Mail, Loader
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
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);
  const [purchaseOrdersError, setPurchaseOrdersError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuotationDetail, setShowQuotationDetail] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showPurchaseOrderDetail, setShowPurchaseOrderDetail] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [quotationResponses, setQuotationResponses] = useState([]);
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseCounts, setResponseCounts] = useState({});
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSendingOrder, setEmailSendingOrder] = useState(null);
  const [quotationCloseStatus, setQuotationCloseStatus] = useState(null);
  const [closingQuotation, setClosingQuotation] = useState(false);
  const [checkingCloseStatus, setCheckingCloseStatus] = useState(false);
  const [filters, setFilters] = useState({
    project: '',
    dateFrom: '',
    dateTo: '',
    supplier: '',
    quotationId: '',
    status: '',
    description: ''
  });
  const [purchaseOrderFilters, setPurchaseOrderFilters] = useState({
    project: '',
    supplier: '',
    dateFrom: '',
    dateTo: '',
    orderId: '',
    status: ''
  });
  const [activeSection, setActiveSection] = useState('ongoing'); // 'ongoing' or 'closed'
  const [activePurchaseSection, setActivePurchaseSection] = useState('pending'); // 'pending' or 'completed'

  // Pagination states
  const [quotationCurrentPage, setQuotationCurrentPage] = useState(1);
  const [purchaseOrderCurrentPage, setPurchaseOrderCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock QS ID - In real app, this would come from authentication context  
  const qsId = 2; // Different ID for SQS
  const qsEmpId = 'EMP_002'; // SQS Employee ID for fetching projects

  // State for projects from API
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  
  // State for suppliers from API
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

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
            projectName: item.projectName || 'Unknown Project',
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

  const fetchPurchaseOrders = async () => {
    setPurchaseOrdersLoading(true);
    setPurchaseOrdersError(null);
    try {
      const response = await fetch(`http://localhost:8086/api/v1/purchase-order/qs/${qsEmpId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('SQS Purchase orders API response:', data);
        
        if (data.success && Array.isArray(data.orders)) {
          setPurchaseOrders(data.orders);
        } else {
          setPurchaseOrders([]);
        }
      } else {
        throw new Error(`Failed to fetch purchase orders: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setPurchaseOrdersError('Error fetching purchase orders: ' + error.message);
      console.error('Error fetching purchase orders:', error);
      setPurchaseOrders([]);
    } finally {
      setPurchaseOrdersLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      console.log('Fetching projects for SQS:', qsEmpId);
      const response = await fetch(`http://localhost:8086/api/v1/qs/projects/${qsEmpId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('SQS Projects API response:', data);
      
      // Handle different possible response structures
      let projectsArray = [];
      if (Array.isArray(data)) {
        projectsArray = data;
      } else if (data && Array.isArray(data.projects)) {
        projectsArray = data.projects;
      } else if (data && data.data && Array.isArray(data.data)) {
        projectsArray = data.data;
      }
      
      setOngoingProjects(projectsArray);
      console.log('Processed SQS projects:', projectsArray);
    } catch (error) {
      console.error('Error fetching SQS projects:', error);
      // Fallback to empty array if API fails
      setOngoingProjects([]);
      setError('Failed to load projects: ' + error.message);
    } finally {
      setProjectsLoading(false);
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

  // Function to send quotation request documents to suppliers via email
  const sendQuotationEmails = async (quotationId, supplierIds) => {
    try {
      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
      
      const response = await fetch(`http://localhost:8086/api/v1/quotation/${quotationId}/send-quotation-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierIds: supplierIds
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Failed to send emails: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If the error response is not valid JSON, just use the HTTP status message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending quotation emails:', error);
      
      // Handle timeout specifically
      if (error.name === 'AbortError') {
        throw new Error('Request timed out while sending emails. The server may be busy, please try again later.');
      }
      
      throw error;
    }
  };

  // Function to send purchase order notification to supplier via email
  const sendPurchaseOrderEmail = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/quotation/purchase-orders/${orderId}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to send purchase order notification: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending purchase order notification:', error);
      throw error;
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

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    setSuppliersLoading(true);
    try {
      const response = await fetch('http://localhost:8086/api/v1/quotation/suppliers/contacts');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.contacts)) {
          // Transform the supplier data to match the expected format
          const transformedSuppliers = data.contacts.map(supplier => ({
            id: supplier.supplierId,
            name: supplier.supplierName,
            email: supplier.email
          }));
          setSuppliers(transformedSuppliers);
          console.log('Suppliers fetched successfully:', transformedSuppliers);
        } else {
          console.error('Invalid supplier data format:', data);
          setSuppliers([]);
        }
      } else {
        throw new Error(`Failed to fetch suppliers: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Fallback to empty array if API fails
      setSuppliers([]);
    } finally {
      setSuppliersLoading(false);
    }
  };

  // Load quotations and projects on component mount
  useEffect(() => {
    fetchQuotations();
    fetchProjects();
    fetchPurchaseOrders();
    fetchSuppliers(); // Add supplier fetch
  }, []);

  // Fetch response counts when quotations change
  useEffect(() => {
    if (quotations.length > 0) {
      fetchResponseCounts();
    }
  }, [quotations]);

  // Reset pagination when switching between tabs
  useEffect(() => {
    setQuotationCurrentPage(1);
  }, [activeSection]);

  // Reset purchase order pagination when switching between tabs
  useEffect(() => {
    setPurchaseOrderCurrentPage(1);
  }, [activePurchaseSection]);

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

      let createdOrUpdatedQuotation;
      
      if (isEditMode && selectedQuotation) {
        createdOrUpdatedQuotation = await updateQuotation(selectedQuotation.qId, quotationData, status);
        setIsEditMode(false);
        setSelectedQuotation(null);
      } else {
        createdOrUpdatedQuotation = await createQuotation(quotationData, status);
      }
      
      // If status is 'sent', send emails to all selected suppliers
      if (status === 'sent' && createdOrUpdatedQuotation) {
        try {
          const quotationId = createdOrUpdatedQuotation.quotation?.qid || 
                              createdOrUpdatedQuotation.qId || 
                              createdOrUpdatedQuotation.quotationId || 
                              (isEditMode ? selectedQuotation.qId : null);
          
          if (quotationId) {
            // Set a loading state to indicate emails are being sent
            setLoading(true);
            
            // Send emails to the selected suppliers
            await sendQuotationEmails(quotationId, quotationData.supplierIds);
            
            alert(`Quotation has been sent successfully and email notifications have been sent to the selected suppliers.`);
          } else {
            alert(`Quotation ${status === 'sent' ? 'sent' : isEditMode ? 'updated' : 'saved as draft'} successfully, but could not send email notifications.`);
          }
        } catch (emailError) {
          console.error('Error sending emails:', emailError);
          alert(`Quotation ${status === 'sent' ? 'sent' : isEditMode ? 'updated' : 'saved as draft'} successfully, but there was an issue sending email notifications.`);
        } finally {
          setLoading(false);
        }
      } else {
        alert(`Quotation ${status === 'sent' ? 'sent' : isEditMode ? 'updated' : 'saved as draft'} successfully!`);
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
    if (suppliersLoading || suppliers.length === 0) {
      return [];
    }
    
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
    } else if (upperStatus === 'SENT') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Sent
        </span>
      );
    } else if (upperStatus === 'CLOSED' || upperStatus === 'COMPLETED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {upperStatus === 'COMPLETED' ? 'Completed' : 'Closed'}
        </span>
      );
    } else if (upperStatus === 'CANCELLED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          Cancelled
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

  // Function to check if a quotation can be closed
  const checkQuotationCloseStatus = async (quotationId) => {
    setCheckingCloseStatus(true);
    setQuotationCloseStatus(null);
    
    try {
      const apiUrl = `http://localhost:8086/api/v1/quotation/${quotationId}/close-status`;
      console.log('Checking quotation close status URL:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Close status response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Quotation close status data:', data);
        
        // If the API returns the status successfully but doesn't explicitly set canClose,
        // we'll add a fallback logic based on the quotation status
        if (data.canClose === undefined) {
          console.log('canClose property not found in response, using fallback logic');
          // For testing purposes, let's allow closing if the API responds but doesn't specify
          data.canClose = true;
          data.closeReason = data.closeReason || 'Manual close enabled for testing';
        }
        
        setQuotationCloseStatus(data);
        return data;
      } else {
        // If we get a 404, it might mean the API endpoint doesn't exist - let's be permissive and allow closing
        if (response.status === 404) {
          console.warn('Close status endpoint not found (404), allowing close operation as fallback');
          const fallbackStatus = {
            canClose: true,
            quotationId: quotationId,
            currentStatus: 'sent',
            closeReason: 'API endpoint not found, allowing manual close',
            success: true
          };
          setQuotationCloseStatus(fallbackStatus);
          return fallbackStatus;
        }
        
        // Otherwise, try to get the error message from the response
        try {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || `Server error: ${response.status}`);
          } catch (e) {
            throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
          }
        } catch (e) {
          throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error checking quotation close status:', error);
      
      // Provide a fallback status that allows closing (for testing)
      const fallbackStatus = {
        canClose: true, 
        quotationId: quotationId,
        closeReason: 'Error checking close status, allowing manual close as fallback',
        success: true
      };
      setQuotationCloseStatus(fallbackStatus);
      return fallbackStatus;
    } finally {
      setCheckingCloseStatus(false);
    }
  };
  
  // Function to close a quotation
  const closeQuotation = async (quotationId) => {
    try {
      console.log(`Attempting to close quotation with ID: ${quotationId}`);
      
      const apiUrl = `http://localhost:8086/api/v1/quotation/${quotationId}/close-if-no-responses-or-rejected`;
      console.log('API URL:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Quotation closed successfully:', data);
          
          // Refresh quotations list after successful close
          await fetchQuotations();
          return data;
        } else {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || `Server error: ${response.status}`);
          } catch (e) {
            throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: The server took too long to respond');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error closing quotation:', error);
      throw error;
    }
  };

  // Handle closing a quotation
  const handleCloseQuotation = async () => {
    if (!selectedQuotation || !quotationCloseStatus) return;
    
    // Check if the quotation can be closed
    if (!quotationCloseStatus.canClose) {
      alert(`Cannot close this quotation. ${quotationCloseStatus.closeReason || 'Unknown reason.'}`);
      return;
    }
    
    // Show confirmation dialog for closing
    const confirmed = window.confirm(
      `Are you sure you want to end this quotation request?\n\n` +
      `Quotation ID: Q${selectedQuotation.qId.toString().padStart(3, '0')}\n` +
      `Project: ${selectedQuotation.projectName}\n` +
      `Total Responses: ${quotationCloseStatus.totalResponses || 0}\n` +
      `Pending Responses: ${quotationCloseStatus.pendingResponses || 0}\n` +
      `Accepted Responses: ${quotationCloseStatus.acceptedResponses || 0}\n` +
      `Rejected Responses: ${quotationCloseStatus.rejectedResponses || 0}\n\n` +
      `This will update the quotation status to "closed" and suppliers will no longer be able to send responses.`
    );
    
    if (!confirmed) return;
    
    setClosingQuotation(true);
    
    try {
      console.log(`Attempting to close quotation ID: ${selectedQuotation.qId}`);
      
      // First try the direct status update method as it's more reliable
      try {
        const updateResult = await updateQuotationStatus(selectedQuotation.qId, 'closed');
        console.log('Status update result:', updateResult);
        
        // Refresh the quotations list
        await fetchQuotations();
        
        // Success message and cleanup
        alert('Quotation has been closed successfully.');
        setShowQuotationDetail(false);
        setQuotationCloseStatus(null);
        return;
      } catch (updateError) {
        console.error('Direct status update failed:', updateError);
        // Continue to try the specialized endpoint
      }
      
      // If direct update fails, try the specialized endpoint
      try {
        const result = await closeQuotation(selectedQuotation.qId);
        console.log('Close quotation result:', result);
        
        // Refresh the quotations list
        await fetchQuotations();
        
        // Success message and cleanup
        alert('Quotation has been closed successfully using alternate method.');
        setShowQuotationDetail(false);
        setQuotationCloseStatus(null);
        return;
      } catch (specializedEndpointError) {
        console.error('Specialized endpoint failed:', specializedEndpointError);
        throw new Error('Failed to close quotation using both available methods.');
      }
    } catch (error) {
      console.error('Error in handleCloseQuotation:', error);
      
      // Show more user-friendly error messages
      let errorMessage = error.message || 'Unknown error occurred';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network error')) {
        errorMessage = 'Cannot connect to the server. Please ensure the backend service is running.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'The server took too long to respond. Please try again later.';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Server encountered an error. Please contact the administrator.';
      } else if (errorMessage.includes('403')) {
        errorMessage = 'You do not have permission to close this quotation.';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Quotation not found. It may have been deleted or modified.';
      }
      
      alert(`Failed to close quotation: ${errorMessage}`);
    } finally {
      setClosingQuotation(false);
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
    
    // If the quotation status is "sent", check if it can be closed
    if (quotation.status?.toLowerCase() === 'sent') {
      checkQuotationCloseStatus(quotation.qId);
    } else {
      setQuotationCloseStatus(null); // Reset the close status for other quotation types
    }
    
    setShowQuotationDetail(true);
  };

  const handleViewResponses = async (quotation) => {
    await fetchQuotationResponses(quotation.qId);
    setSelectedQuotation(quotation);
    setShowResponseModal(true);
  };

  const handleViewPurchaseOrder = (order) => {
    setSelectedPurchaseOrder(order);
    setShowPurchaseOrderDetail(true);
  };
  
  // Function to handle sending purchase order email
  const handleSendPurchaseOrderEmail = async (order) => {
    if (sendingEmail) return; // Prevent multiple clicks
    
    const confirmed = window.confirm(
      `Are you sure you want to send this purchase order notification to ${order.supplierDetails.supplierName}?\n\n` +
      `Email: ${order.supplierDetails.supplierEmail}\n` +
      `Purchase Order ID: PO${order.orderId.toString().padStart(3, '0')}\n` +
      `Project: ${order.projectName}\n`
    );
    
    if (confirmed) {
      try {
        setEmailSendingOrder(order.orderId);
        setSendingEmail(true);
        
        await sendPurchaseOrderEmail(order.orderId);
        
        alert(`Purchase order notification successfully sent to ${order.supplierDetails.supplierName} (${order.supplierDetails.supplierEmail}).`);
      } catch (error) {
        alert(`Failed to send purchase order notification: ${error.message}`);
      } finally {
        setSendingEmail(false);
        setEmailSendingOrder(null);
      }
    }
  };

  // Function to download invoice
  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/pdf/invoice/${orderId}/download/format`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        // Get the filename from the response headers or use a default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `invoice_${orderId}.pdf`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const handleDownloadQuotation = async (quotationId) => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/pdf/quotation/${quotationId}/download/format`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        // Get the filename from the response headers or use a default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `quotation_Q${quotationId.toString().padStart(3, '0')}.pdf`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download quotation');
      }
    } catch (error) {
      console.error('Error downloading quotation:', error);
      alert('Failed to download quotation. Please try again.');
    }
  };

  // Function to download purchase order
  const handleDownloadPurchaseOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8086/api/v1/purchase-order-pdf/${orderId}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        // Get the filename from the response headers or use a default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `purchase_order_PO${orderId.toString().padStart(3, '0')}.pdf`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download purchase order');
      }
    } catch (error) {
      console.error('Error downloading purchase order:', error);
      alert('Failed to download purchase order. Please try again.');
    }
  };

  // Function to update quotation status
  const updateQuotationStatus = async (quotationId, status) => {
    try {
      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      const response = await fetch(`http://localhost:8086/api/v1/quotation/${quotationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        // Refresh quotations list after successful status update
        await fetchQuotations();
        return data;
      } else {
        let errorMessage = `Failed to update quotation status: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If the error response is not valid JSON, just use the HTTP status message
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating quotation status:', error);
      
      // Handle timeout specifically
      if (error.name === 'AbortError') {
        throw new Error('Request timed out while updating quotation status. The server may be busy, please try again later.');
      }
      
      throw error;
    }
  };

  // Pagination helper functions
  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage);
  };

  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Pagination component
  const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)} of {totalPages * itemsPerPage} entries
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-[#FAAD00] text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const handlePurchaseResponse = (response) => {
    // Check if the response status is rejected
    if (response.status?.toLowerCase() === 'rejected') {
      alert('Cannot proceed with purchase. This supplier response has been rejected.');
      return;
    }

    // Show confirmation dialog for purchase
    const confirmed = window.confirm(
      `Are you sure you want to select this quotation for purchase?\n\n` +
      `Supplier: ${response.supplierName}\n` +
      `Email: ${response.supplierEmail || 'Not specified'}\n` + 
      `Total Amount: Rs. ${response.totalAmount.toLocaleString()}\n` +
      `Delivery Date: ${response.deliveryDate}\n\n` +
      `This will update the quotation status to "closed" and send an email notification to the supplier.`
    );

    if (confirmed) {
      processPurchaseOrder(response);
    }
  };

  const processPurchaseOrder = async (response) => {
    try {
      setLoading(true);
      
      // Create purchase order using the API
      const purchaseOrderResponse = await fetch(`http://localhost:8086/api/v1/quotation/responses/${response.responseId}/create-purchase-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add any additional data required for purchase order creation
          // The API should handle the purchase order creation based on the response ID
        }),
      });

      if (!purchaseOrderResponse.ok) {
        const errorData = await purchaseOrderResponse.json();
        throw new Error(errorData.message || `Failed to create purchase order: ${purchaseOrderResponse.status} ${purchaseOrderResponse.statusText}`);
      }

      const purchaseOrderData = await purchaseOrderResponse.json();
      console.log('Purchase order created:', purchaseOrderData);
      
      // Update the quotation status to "closed" (this should already be handled by the API, but we'll keep it as fallback)
      try {
        await updateQuotationStatus(selectedQuotation.qId, 'closed');
      } catch (statusError) {
        console.warn('Status update failed, but purchase order was created:', statusError);
        // Don't throw error here since the main operation (purchase order creation) succeeded
      }
      
      // Send email notification to the supplier
      let emailSentSuccessfully = false;
      let emailErrorMessage = '';
      try {
        setSendingEmail(true);
        await sendPurchaseOrderEmail(purchaseOrderData.purchaseOrderId || purchaseOrderData.orderId);
        emailSentSuccessfully = true;
      } catch (emailError) {
        console.error('Error sending purchase order notification:', emailError);
        emailErrorMessage = emailError.message;
      } finally {
        setSendingEmail(false);
      }
      
      // Refresh quotations list to reflect the status change
      await fetchQuotations();
      
      // Refresh purchase orders list to show the new purchase order
      await fetchPurchaseOrders();
      
      // Close modals
      setShowResponseModal(false);
      setShowQuotationDetail(false);
      
      // Show success message with purchase order details
      alert(
        `Purchase order created successfully!\n\n` +
        `Purchase Order ID: ${purchaseOrderData.purchaseOrderId || 'Generated'}\n` +
        `Supplier: ${response.supplierName}\n` +
        `Total Amount: Rs. ${response.totalAmount.toLocaleString()}\n` +
        `Delivery Date: ${response.deliveryDate}\n` +
        `Quotation status updated to "Closed"\n` +
        (emailSentSuccessfully 
          ? `\nEmail notification sent to ${response.supplierName} (${response.supplierEmail || 'supplier'})` 
          : `\nFailed to send email notification: ${emailErrorMessage}`)
      );
      
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert(`Failed to process purchase order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter quotations based on selected filters and separate by status
  const allFilteredQuotations = quotations.filter(quotation => {
    // Project filter (check multiple possible fields)
    if (filters.project) {
      const searchTerm = filters.project.toLowerCase();
      const projectName = quotation.projectName?.toLowerCase() || '';
      const projectId = quotation.projectId?.toString().toLowerCase() || '';
      
      // Check if project name or ID contains the search term
      if (!projectName.includes(searchTerm) && !projectId.includes(searchTerm)) {
        return false;
      }
    }

    // Quotation ID filter
    if (filters.quotationId && quotation.qId) {
      if (!quotation.qId.toString().includes(filters.quotationId)) {
        return false;
      }
    }

    // Status filter
    if (filters.status && quotation.status) {
      if (quotation.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    // Description filter
    if (filters.description && quotation.description) {
      if (!quotation.description.toLowerCase().includes(filters.description.toLowerCase())) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateFrom && quotation.createdDate) {
      const quotationDate = new Date(quotation.createdDate);
      const fromDate = new Date(filters.dateFrom);
      if (quotationDate < fromDate) {
        return false;
      }
    }
    
    if (filters.dateTo && quotation.createdDate) {
      const quotationDate = new Date(quotation.createdDate);
      const toDate = new Date(filters.dateTo);
      if (quotationDate > toDate) {
        return false;
      }
    }
    
    // Supplier filter
    if (filters.supplier && quotation.suppliers) {
      const hasSupplier = quotation.suppliers.some(supplier => 
        supplier.toLowerCase().includes(filters.supplier.toLowerCase())
      );
      if (!hasSupplier) {
        return false;
      }
    }
    
    return true;
  });

  // Separate quotations into ongoing and closed
  const ongoingQuotations = allFilteredQuotations.filter(quotation => {
    const status = quotation.status?.toUpperCase();
    return status !== 'CLOSED' && status !== 'COMPLETED' && status !== 'CANCELLED';
  });

  const closedQuotations = allFilteredQuotations.filter(quotation => {
    const status = quotation.status?.toUpperCase();
    return status === 'CLOSED' || status === 'COMPLETED' || status === 'CANCELLED';
  });

  // Filter purchase orders based on selected filters
  const allFilteredPurchaseOrders = purchaseOrders.filter(order => {
    // Project filter
    if (purchaseOrderFilters.project && order.projectName) {
      if (!order.projectName.toLowerCase().includes(purchaseOrderFilters.project.toLowerCase())) {
        return false;
      }
    }

    // Supplier filter
    if (purchaseOrderFilters.supplier && order.supplierName) {
      if (!order.supplierName.toLowerCase().includes(purchaseOrderFilters.supplier.toLowerCase())) {
        return false;
      }
    }

    // Order ID filter
    if (purchaseOrderFilters.orderId && order.orderId) {
      if (!order.orderId.toString().includes(purchaseOrderFilters.orderId)) {
        return false;
      }
    }

    // Date range filter
    if (purchaseOrderFilters.dateFrom && order.orderDate) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(purchaseOrderFilters.dateFrom);
      if (orderDate < fromDate) {
        return false;
      }
    }

    if (purchaseOrderFilters.dateTo && order.orderDate) {
      const orderDate = new Date(order.orderDate);
      const toDate = new Date(purchaseOrderFilters.dateTo);
      if (orderDate > toDate) {
        return false;
      }
    }

    // Status filter
    if (purchaseOrderFilters.status) {
      let orderPaymentStatus = '';
      if (order.paymentStatus === 'paid' || order.paymentStatus === 'completed') {
        orderPaymentStatus = 'completed';
      } else if (order.paymentStatus === 'partial') {
        orderPaymentStatus = 'partial';
      } else {
        orderPaymentStatus = 'pending';
      }
      
      if (orderPaymentStatus !== purchaseOrderFilters.status.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // Separate purchase orders into pending and completed
  const pendingPurchaseOrders = allFilteredPurchaseOrders.filter(order => {
    return order.orderStatus === false || order.orderStatus === 0;
  });

  const completedPurchaseOrders = allFilteredPurchaseOrders.filter(order => {
    return order.orderStatus === true || order.orderStatus === 1;
  });

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

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Project Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Project</label>
            <select
              value={filters.project}
              onChange={(e) => setFilters({...filters, project: e.target.value})}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
              disabled={projectsLoading}
            >
              <option value="">
                {projectsLoading ? 'Loading projects...' : 
                 ongoingProjects.length === 0 ? 'No projects available' : 'All Projects'}
              </option>
              {Array.isArray(ongoingProjects) && ongoingProjects.map((project) => (
                <option key={project.projectId || project.id} value={project.projectId || project.id}>
                  {project.projectName || project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
            />
          </div>

          {/* Date To Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
            />
          </div>

          {/* Supplier Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
            <select
              value={filters.supplier}
              onChange={(e) => setFilters({...filters, supplier: e.target.value})}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
            >
              <option value="">
                {suppliersLoading ? 'Loading suppliers...' : 'All Suppliers'}
              </option>
              {!suppliersLoading && suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setFilters({ project: '', dateFrom: '', dateTo: '', supplier: '' })}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Quotations Sections with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveSection('ongoing')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeSection === 'ongoing'
                  ? 'border-[#FAAD00] text-[#FAAD00] bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ongoing Quotations ({ongoingQuotations.length})
            </button>
            <button
              onClick={() => setActiveSection('closed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeSection === 'closed'
                  ? 'border-[#FAAD00] text-[#FAAD00] bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Closed Quotations ({closedQuotations.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeSection === 'ongoing' ? 'Ongoing Quotation Requests' : 'Closed Quotation Requests'}
            </h2>
          </div>

          {/* Quotation Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quotation ID</label>
                <input
                  type="text"
                  placeholder="Search by ID..."
                  value={filters.quotationId}
                  onChange={(e) => setFilters(prev => ({ ...prev, quotationId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <input
                  type="text"
                  placeholder="Search by project..."
                  value={filters.project}
                  onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  placeholder="Search by supplier..."
                  value={filters.supplier}
                  onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Search description..."
                  value={filters.description}
                  onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    project: '',
                    dateFrom: '',
                    dateTo: '',
                    supplier: '',
                    quotationId: '',
                    status: '',
                    description: ''
                  })}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
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
                ) : (() => {
                  const currentQuotations = activeSection === 'ongoing' ? ongoingQuotations : closedQuotations;
                  const paginatedQuotations = getPaginatedData(currentQuotations, quotationCurrentPage);
                  return !Array.isArray(currentQuotations) || currentQuotations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No {activeSection} quotations found
                      </td>
                    </tr>
                  ) : (
                    paginatedQuotations.map((quotation) => (
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
                            {quotation.status === 'pending' && activeSection === 'ongoing' && (
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
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
        {/* Quotations Pagination */}
        {(() => {
          const currentQuotations = activeSection === 'ongoing' ? ongoingQuotations : closedQuotations;
          const totalPages = getTotalPages(currentQuotations.length);
          return (
            <PaginationComponent 
              currentPage={quotationCurrentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setQuotationCurrentPage(page);
              }}
            />
          );
        })()}
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActivePurchaseSection('pending')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activePurchaseSection === 'pending'
                  ? 'border-[#FAAD00] text-[#FAAD00] bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Orders ({pendingPurchaseOrders.length})
            </button>
            <button
              onClick={() => setActivePurchaseSection('completed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activePurchaseSection === 'completed'
                  ? 'border-[#FAAD00] text-[#FAAD00] bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Orders ({completedPurchaseOrders.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activePurchaseSection === 'pending' ? 'Pending Purchase Orders' : 'Completed Purchase Orders'}
            </h2>
          </div>

          {/* Purchase Order Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  placeholder="Search by Order ID..."
                  value={purchaseOrderFilters.orderId}
                  onChange={(e) => setPurchaseOrderFilters(prev => ({ ...prev, orderId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <input
                  type="text"
                  placeholder="Search by project..."
                  value={purchaseOrderFilters.project}
                  onChange={(e) => setPurchaseOrderFilters(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  placeholder="Search by supplier..."
                  value={purchaseOrderFilters.supplier}
                  onChange={(e) => setPurchaseOrderFilters(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={purchaseOrderFilters.dateFrom}
                  onChange={(e) => setPurchaseOrderFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={purchaseOrderFilters.dateTo}
                  onChange={(e) => setPurchaseOrderFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={purchaseOrderFilters.status}
                  onChange={(e) => setPurchaseOrderFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setPurchaseOrderFilters({
                    project: '',
                    supplier: '',
                    dateFrom: '',
                    dateTo: '',
                    orderId: '',
                    status: ''
                  })}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Date
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
              {purchaseOrdersLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading purchase orders...
                  </td>
                </tr>
              ) : purchaseOrdersError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-red-500">
                    {purchaseOrdersError}
                  </td>
                </tr>
              ) : (() => {
                const currentPurchaseOrders = activePurchaseSection === 'pending' ? pendingPurchaseOrders : completedPurchaseOrders;
                return !Array.isArray(currentPurchaseOrders) || currentPurchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No {activePurchaseSection} purchase orders found
                    </td>
                  </tr>
                ) : (
                  getPaginatedData(currentPurchaseOrders, purchaseOrderCurrentPage).map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      PO{order.orderId.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.projectName || order.projectDetails?.projectName || order.projectId}</div>
                        <div className="text-xs text-gray-400">
                          {order.projectId} • {order.projectDetails?.projectLocation || order.projectLocation || 'Location not specified'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.supplierDetails.supplierName}</div>
                        <div className="text-xs text-gray-400">{order.supplierDetails.supplierEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.estimatedDeliveryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.orderStatus === 1 || order.orderStatus === true
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.orderStatus === 1 || order.orderStatus === true ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {order.orderStatus === 1 || order.orderStatus === true ? 'Completed' : 'Pending'}
                        </span>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {order.paymentStatusText}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPurchaseOrder(order)}
                          className="text-[#FAAD00] hover:text-[#FAAD00]/80 flex items-center"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                );
              })()}
            </tbody>
          </table>
        </div>
        
        {/* Purchase Orders Pagination */}
        {(() => {
          const currentPurchaseOrders = activePurchaseSection === 'pending' ? pendingPurchaseOrders : completedPurchaseOrders;
          const totalPages = getTotalPages(currentPurchaseOrders.length);
          return (
            <PaginationComponent 
              currentPage={purchaseOrderCurrentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setPurchaseOrderCurrentPage(page);
              }}
            />
          );
        })()}
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
                    disabled={projectsLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                  >
                    <option value="">
                      {projectsLoading ? 'Loading projects...' : 
                       ongoingProjects.length === 0 ? 'No projects available' : 'Choose a project...'}
                    </option>
                    {Array.isArray(ongoingProjects) && ongoingProjects.map((project) => (
                      <option key={project.projectId || project.id} value={project.projectId || project.id}>
                        {project.projectName || project.name}
                        {(project.location || project.projectLocation) && ` - ${project.location || project.projectLocation}`}
                      </option>
                    ))}
                  </select>
                  {!projectsLoading && ongoingProjects.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      No projects available. Please contact your administrator.
                    </p>
                  )}
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
                    placeholder="Estimated Amount"
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
                            Amount
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  {/* Supplier Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Select from List
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAAD00] focus:border-transparent"
                      onChange={(e) => {
                        if (e.target.value) {
                          addSupplier(e.target.value);
                          e.target.value = ""; // Reset dropdown after selection
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {suppliersLoading 
                          ? 'Loading suppliers...' 
                          : suppliers.length === 0 
                            ? 'No suppliers available' 
                            : 'Select a supplier'}
                      </option>
                      {!suppliersLoading && suppliers
                        .filter(supplier => !quotationFormData.suppliers.includes(supplier.name))
                        .map(supplier => (
                          <option key={supplier.id} value={supplier.name}>
                            {supplier.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Supplier Search */}
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Search Suppliers
                    </label>
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

                    {/* Supplier Search Dropdown */}
                    {showSupplierDropdown && getFilteredSuppliers().length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {getFilteredSuppliers().map((supplier) => (
                          <div
                            key={supplier.id}
                            onClick={() => addSupplier(supplier.name)}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          >
                            <span className="text-sm text-gray-700">{supplier.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  <h4 className="font-semibold text-gray-900 mb-3">SQS Officer Details</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">SQS ID:</span>
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
                  onClick={() => handleDownloadQuotation(selectedQuotation.qId)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
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
                
                {selectedQuotation.status?.toLowerCase() === 'sent' && (
                  <>
                    {checkingCloseStatus ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg flex items-center space-x-2 opacity-75 cursor-not-allowed"
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Checking...</span>
                      </button>
                    ) : quotationCloseStatus ? (
                      quotationCloseStatus.canClose ? (
                        <button
                          onClick={handleCloseQuotation}
                          disabled={closingQuotation}
                          className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 ${
                            closingQuotation ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                          title="End this quotation and prevent further responses"
                        >
                          {closingQuotation ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              <span>Closing...</span>
                            </>
                          ) : (
                            <span>End Quotation</span>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg flex items-center space-x-2 opacity-75 cursor-not-allowed"
                          title={quotationCloseStatus.closeReason || "Cannot close this quotation"}
                        >
                          <span>Cannot Close</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => checkQuotationCloseStatus(selectedQuotation.qId)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        title="Check if this quotation can be closed"
                      >
                        Check Close Status
                      </button>
                    )}
                  </>
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
              Once sent, the status will be changed to "sent", email notifications will be sent to all selected suppliers, and the quotation cannot be edited.
            </p>
            {quotationFormData.suppliers.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Email will be sent to these suppliers:
                </p>
                <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                  <ul className="list-disc pl-5 space-y-1">
                    {quotationFormData.suppliers.map((supplierName) => {
                      const supplier = suppliers.find(s => s.name === supplierName);
                      return (
                        <li key={supplier?.id || supplierName} className="text-sm">
                          {supplierName} {supplier?.email && <span className="text-gray-500">({supplier.email})</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => processQuotationSubmission('send')}
                disabled={loading}
                className={`px-6 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200 flex items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : 'Confirm Send'}
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
                            response.status?.toLowerCase() === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : response.status?.toLowerCase() === 'rejected'
                              ? 'bg-red-100 text-red-800'
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
                        {response.status?.toLowerCase() === 'rejected' ? (
                          <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                            Cannot Purchase (Rejected)
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePurchaseResponse(response)}
                            className="px-4 py-2 bg-[#FAAD00] text-white rounded-lg hover:bg-[#FAAD00]/80 transition-colors duration-200"
                          >
                            Select for Purchase
                          </button>
                        )}
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

      {/* Purchase Order Detail Modal */}
      {showPurchaseOrderDetail && selectedPurchaseOrder && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Purchase Order Details - PO{selectedPurchaseOrder.orderId.toString().padStart(3, '0')}
                </h3>
                <button
                  onClick={() => setShowPurchaseOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Order ID:</span>
                      <span className="font-medium">PO{selectedPurchaseOrder.orderId.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Quotation ID:</span>
                      <span className="font-medium">Q{selectedPurchaseOrder.quotationId.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Order Date:</span>
                      <span className="font-medium">{selectedPurchaseOrder.orderDate}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Order Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedPurchaseOrder.orderStatus === 1 || selectedPurchaseOrder.orderStatus === true
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedPurchaseOrder.orderStatus === 1 || selectedPurchaseOrder.orderStatus === true ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {selectedPurchaseOrder.orderStatus === 1 || selectedPurchaseOrder.orderStatus === true ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Information</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Project:</span>
                      <span className="font-medium">{selectedPurchaseOrder.projectName || selectedPurchaseOrder.projectDetails?.projectName || selectedPurchaseOrder.projectId}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Project ID:</span>
                      <span className="font-medium">{selectedPurchaseOrder.projectId}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Location:</span>
                      <span className="font-medium">{selectedPurchaseOrder.projectDetails?.projectLocation || selectedPurchaseOrder.projectLocation || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Category:</span>
                      <span className="font-medium capitalize">{selectedPurchaseOrder.projectDetails?.projectCategory || selectedPurchaseOrder.projectCategory || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Original Delivery Date:</span>
                      <span className="font-medium">{selectedPurchaseOrder.originalDeliveryDate}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Estimated Delivery Date:</span>
                      <span className="font-medium">{selectedPurchaseOrder.estimatedDeliveryDate}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Payment Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedPurchaseOrder.paymentStatus === 'paid' || selectedPurchaseOrder.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedPurchaseOrder.paymentStatus === 'paid' || selectedPurchaseOrder.paymentStatus === 'completed' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {selectedPurchaseOrder.paymentStatusText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Supplier Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Supplier Name:</span>
                      <span className="font-medium">{selectedPurchaseOrder.supplierDetails.supplierName}</span>
                    </div>
                    <div className="flex flex-col space-y-1 mt-2">
                      <span className="text-gray-600 text-sm">Email:</span>
                      <span className="font-medium">{selectedPurchaseOrder.supplierDetails.supplierEmail}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-600 text-sm">Phone:</span>
                      <span className="font-medium">{selectedPurchaseOrder.supplierDetails.supplierPhone}</span>
                    </div>
                    <div className="flex flex-col space-y-1 mt-2">
                      <span className="text-gray-600 text-sm">Address:</span>
                      <span className="font-medium">{selectedPurchaseOrder.supplierDetails.supplierAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
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
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPurchaseOrder.items && selectedPurchaseOrder.items.length > 0 ? (
                        selectedPurchaseOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Item #{item.itemId}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {item.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rs. {parseFloat(item.unitPrice).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rs. {(parseFloat(item.unitPrice) * parseInt(item.quantity)).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Total Amounts */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-700 font-medium">Original Quotation Amount:</span>
                      <span className="text-xl font-bold text-blue-900">
                        Rs. {selectedPurchaseOrder.totalQuotationAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#FAAD00] bg-opacity-10 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 font-medium">Final Order Amount:</span>
                      <span className="text-xl font-bold text-black">
                        Rs. {selectedPurchaseOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPurchaseOrderDetail(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadPurchaseOrder(selectedPurchaseOrder.orderId)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4 mr-1" />
                  <span>Download PO</span>
                </button>
                {(selectedPurchaseOrder.paymentStatus === 'paid' || selectedPurchaseOrder.paymentStatus === 'completed') && (
                  <button
                    onClick={() => handleDownloadInvoice(selectedPurchaseOrder.orderId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download Invoice</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchasing;

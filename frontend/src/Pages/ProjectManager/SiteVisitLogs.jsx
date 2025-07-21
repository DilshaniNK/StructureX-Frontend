import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';
import {
  Plus,
  Check,
  Search,
  CircleCheckBig,
  CircleMinus,
  Calendar,
  Camera,
  Download,
  Filter,
  MapPin,
  Clock,
  User,
  Edit,
  X,
  Save
} from 'lucide-react';

const SiteVisitLogs = ({ setShowAddForm }) => {
  // Custom CSS animations
  const customStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes numberCount {
      from {
        transform: scale(0.8);
      }
      to {
        transform: scale(1);
      }
    }

    @keyframes spinSlow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes pulseSlow {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }

    .animate-number-count {
      animation: numberCount 0.5s ease-out;
    }

    .animate-spin-slow {
      animation: spinSlow 3s linear infinite;
    }

    .animate-pulse-slow {
      animation: pulseSlow 2s ease-in-out infinite;
    }

    /* Loading shimmer effect */
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }

    .shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200px 100%;
      animation: shimmer 1.5s infinite;
    }
  `;

  const [showAddForme, setShowAddForme] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);


  // Visit requests state
  const [visitRequests, setVisitRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);



  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  // Reject confirmation popup state
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);


  const [formData, setFormData] = useState({
    project_id: '',
    date: '',
    description: '',
    status: '',
  });


  // Fetch visits data from database
  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8086/api/v1/project_manager/visits', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setVisits(response.data.visits || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      setErrorMessage('Failed to fetch visit logs');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };



  // Fetch visit requests data from database
  const fetchVisitRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await axios.get('http://localhost:8086/api/v1/project_manager/request', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Visit requests response:', response.data); // Debug log
        // Enhanced logging to see the structure of each request
        if (response.data && response.data.length > 0) {
          console.log('First request object structure:', response.data[0]);
          console.log('Available keys in first request:', Object.keys(response.data[0]));
        }
        setVisitRequests(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching visit requests:', error);
      setErrorMessage('Failed to fetch visit requests');
      setShowErrorAlert(true);
    } finally {
      setRequestsLoading(false);
    }
  };



  // Fetch visits on component mount
  useEffect(() => {
    fetchVisits();
    fetchVisitRequests();
  }, []);



  // Filter visits based on search and date
  const filteredVisits = visits.filter(visit => {
    const matchesSearch = !searchTerm ||
      visit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.project_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || visit.date === dateFilter;

    return matchesSearch && matchesDate;
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      project_id: formData.project_id,
      date: formData.date,
      description: formData.description,
      status: formData.status,
    };
    try {
      const response = await axios.post('http://localhost:8086/api/v1/project_manager/add_visit', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response);
      console.log(payload);

      if (response.status === 200) {
        setSuccessMessage('Visit log added successfully');
        setShowSuccessAlert(true);
        setShowAddForme(false);
        // Reset form
        setFormData({
          project_id: '',
          date: '',
          description: '',
          status: '',
        });
        // Refresh the visits list
        fetchVisits();
      } else {
        setErrorMessage('Failed to add visit log');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error adding visit log:', error);
      setErrorMessage('An error occurred while adding the visit log');
      setShowErrorAlert(true);
    }
  };



  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8086/api/v1/project_manager/visits/${editingVisit.id}`, editingVisit, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Visit log updated successfully');
        setShowSuccessAlert(true);
        setShowEditForm(false);
        setEditingVisit(null);
        fetchVisits(); // Refresh the list
      } else {
        setErrorMessage('Failed to update visit log');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error updating visit log:', error);
      setErrorMessage('An error occurred while updating the visit log');
      setShowErrorAlert(true);
    }
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setShowEditForm(true);
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const downloadReport = () => {
    setSuccessMessage('Site Visit Report downloaded successfully!');
    setShowSuccessAlert(true);
  };



  // Handle accept/reject visit requests
  const handleAcceptRequest = async (requestId) => {
    try {
      // Enhanced validation with detailed logging
      console.log('Accept request called with ID:', requestId);
      if (!requestId) {
        console.error('Request ID is undefined');
        setErrorMessage('Invalid request ID - ID is missing');
        setShowErrorAlert(true);
        return;
      }

      console.log('Making API call to accept request:', requestId);
      const response = await axios.put(`http://localhost:8086/api/v1/project_manager/request/${requestId}/accept`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Visit request accepted and marked as completed!');
        setShowSuccessAlert(true);
        fetchVisitRequests(); // Refresh the requests list
      } else {
        setErrorMessage('Failed to accept visit request');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error accepting visit request:', error);
      setErrorMessage('An error occurred while accepting the visit request');
      setShowErrorAlert(true);
    }
  };



  const handleRejectRequest = async (requestId) => {
    try {
      // Enhanced validation with detailed logging
      console.log('Reject request called with ID:', requestId);
      if (!requestId) {
        console.error('Request ID is undefined');
        setErrorMessage('Invalid request ID - ID is missing');
        setShowErrorAlert(true);
        return;
      }

      console.log('Making API call to reject request:', requestId);
      const response = await axios.put(`http://localhost:8086/api/v1/project_manager/request/${requestId}/reject`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Visit request rejected and marked as cancelled!');
        setShowSuccessAlert(true);
        fetchVisitRequests(); // Refresh the requests list
      } else {
        setErrorMessage('Failed to reject visit request');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error rejecting visit request:', error);
      setErrorMessage('An error occurred while rejecting the visit request');
      setShowErrorAlert(true);
    }
  };



  // Show reject confirmation popup
  const showRejectConfirmation = (requestId) => {
    console.log('showRejectConfirmation called with:', requestId);
    if (!requestId) {
      console.error('Cannot show reject confirmation - requestId is undefined');
      setErrorMessage('Cannot process request - Invalid ID');
      setShowErrorAlert(true);
      return;
    }
    setRejectRequestId(requestId);
    setShowRejectConfirm(true);
  };




  // Handle reject confirmation
  const confirmReject = () => {
    if (rejectRequestId) {
      handleRejectRequest(rejectRequestId);
    }
    setShowRejectConfirm(false);
    setRejectRequestId(null);
  };



  // Cancel reject confirmation
  const cancelReject = () => {
    setShowRejectConfirm(false);
    setRejectRequestId(null);
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Follow-up Required':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };



  return (
    <div className="space-y-8">
      {/* Inject custom CSS animations */}
      <style>{customStyles}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={generateReport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download size={20} className="mr-2" />
            Generate Report
          </button>
          <button
            onClick={() => setShowAddForme(true)}
            className="px-4 py-2 bg-primary-500 bg-amber-400 text-gray-900 rounded-lg cursor-pointer hover:bg-amber-200 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Log New Visit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton cards with shimmer effect
          <>
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded shimmer w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Total Visits Card */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow-50 group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-yellow-600">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900 transition-all duration-500 transform group-hover:scale-110 group-hover:text-yellow-700">
                    <span className="inline-block animate-number-count">{visits.length}</span>
                  </p>
                </div>
                <div className=" bg-yellow-100 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-200 group-hover:rotate-12 group-hover:scale-110">
                  <MapPin className="text-primary-600 transition-colors duration-300 group-hover:text-yellow-700" size={24} />
                </div>
              </div>
            </div>

            {/* This Month Card */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow-50 group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-yellow-600">This Month</p>
                  <p className="text-2xl font-bold text-secondary-600 transition-all duration-500 transform group-hover:scale-110 group-hover:text-yellow-700">
                    <span className="inline-block animate-number-count">
                      {visits.filter(visit => {
                        const visitDate = new Date(visit.date);
                        const currentDate = new Date();
                        return visitDate.getMonth() === currentDate.getMonth() &&
                          visitDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </span>
                  </p>
                </div>
                <div className=" bg-yellow-100 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-200 group-hover:rotate-12 group-hover:scale-110">
                  <Calendar className="text-secondary-600 transition-colors duration-300 group-hover:text-yellow-700" size={24} />
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow-50 group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold transition-all duration-500 transform group-hover:scale-110 group-hover:text-yellow-700">
                    <span className="inline-block animate-number-count animate-pulse-slow">
                      {visits.filter(visit => visit.status === 'pending').length}
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-200 group-hover:rotate-12 group-hover:scale-110">
                  <Clock className="text-yellow-600 transition-colors duration-300 group-hover:text-yellow-700 animate-spin-slow" size={24} />
                </div>
              </div>
            </div>

            {/* Completed Visits Card */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow-50 group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-yellow-600">Completed Visits</p>
                  <p className="text-2xl font-bold transition-all duration-500 transform group-hover:scale-110 group-hover:text-yellow-700">
                    <span className="inline-block animate-number-count">
                      {visits.filter(visit => visit.status === 'completed').length}
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-200 group-hover:rotate-12 group-hover:scale-110">
                  <User className="text-yellow-600 transition-colors duration-300 group-hover:text-yellow-700" size={24} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Request for Site Visit */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Site Visit Requests</h2>
          <p className="text-gray-600 mt-1">Manage incoming site visit requests</p>
        </div>

        {requestsLoading ? (
          <div className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Loading visit requests...</p>
            </div>
          </div>
        ) : visitRequests.length === 0 ? (
          <div className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">No visit requests found.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitRequests.map((request, index) => {
                  // Enhanced logging to debug the request object
                  console.log(`Request ${index}:`, request);
                  
                  // Try to get the ID from various possible field names
                  const requestId = request.id || request._id || request.requestId || request.visitRequestId;
                  console.log(`Request ${index} ID:`, requestId);
                  
                  return (
                    <tr key={requestId || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {request.projectId || request.project_id || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {request.fromDate || request.from_date ?
                          new Date(request.fromDate || request.from_date).toLocaleDateString() :
                          'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {request.toDate || request.to_date ?
                          new Date(request.toDate || request.to_date).toLocaleDateString() :
                          'N/A'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 max-w-xs truncate" title={request.purpose}>
                          {request.purpose || 'No note provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === 'pending' || !request.status ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                console.log('Accept button clicked for request:', request);
                                console.log('Using ID:', requestId);
                                handleAcceptRequest(requestId);
                              }}
                              className="flex items-center px-3 py-2 bg-green-500 text-white cursor-pointer hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
                            >
                              <CircleCheckBig size={16} className="mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                console.log('Reject button clicked for request:', request);
                                console.log('Using ID:', requestId);
                                showRejectConfirmation(requestId);
                              }}
                              className="flex items-center px-3 py-2 bg-red-500 text-white cursor-pointer hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
                            >
                              <CircleMinus size={16} className="mr-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            {request.status === 'completed' ? 'Completed' : 
                             request.status === 'cancelled' ? 'Cancelled' : 
                             request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visit Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Loading visit logs...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No visit logs found. {searchTerm || dateFilter ? 'Try adjusting your filters.' : 'Add your first visit log!'}</p>
          </div>
        ) : (
          filteredVisits.map((visit, index) => (
            <div key={visit.id || index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">Project: {visit.project_id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)} whitespace-nowrap`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{new Date(visit.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">ID: {visit.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Description</h4>
                  <p className="text-gray-600 text-xs line-clamp-3">{visit.description || 'No description provided'}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(visit)}
                    className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Edit size={12} className="mr-1" />
                    Edit
                  </button>
                  {/* <button 
                    onClick={() => handleDelete(visit.id)}
                    className="px-2 py-1 text-xs border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors flex items-center"
                  >
                    <X size={12} className="mr-1" />
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Visit Form Modal */}
      {showAddForme && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Log New Site Visit</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Project ID Field */}
              <div>
                <label className="block text-sm font-medium mb-1">Project ID</label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Project</option>
                  <option value="PJT001">PJT001</option>
                  <option value="PJT002">PJT002</option>
                  <option value="PJT003">PJT003</option>
                  <option value="PJT004">PJT004</option>
                  <option value="PJT005">PJT005</option>
                </select>
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed observations..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                ></textarea>
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option>Completed</option>
                  <option>Follow-up Required</option>
                  <option>Pending</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 text-gray-900 rounded-lg py-2 hover:bg-amber-500"
                >
                  Log Visit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForme(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visit Form Modal */}
      {showEditForm && editingVisit && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Site Visit</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                  <input
                    type="text"
                    value={editingVisit.project_id}
                    onChange={(e) => setEditingVisit({ ...editingVisit, project_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingVisit.date}
                    onChange={(e) => setEditingVisit({ ...editingVisit, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingVisit.description}
                  onChange={(e) => setEditingVisit({ ...editingVisit, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingVisit.status}
                  onChange={(e) => setEditingVisit({ ...editingVisit, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option>Completed</option>
                  <option>Follow-up Required</option>
                  <option>Pending</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 bg-primary-500 text-gray-900 bg-amber-400 rounded-lg py-2 hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            {/* Report Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Site Visit Logs Report</h2>
                <p className="text-gray-600">Comprehensive site visit summary</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-primary-500 bg-amber-400 text-gray-900 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                >
                  <Download size={20} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {/* Summary Statistics */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Total Visits</p>
                    <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {visits.filter(v => v.status === 'Completed').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Follow-up Required</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {visits.filter(v => v.status === 'Follow-up Required').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Set(visits.map(v => v.visitor)).size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              {/* <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Visit Details</h3>
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{visit.visitor} - {visit.role}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-2">
                        <div>
                          <p className="text-gray-600">Date & Time</p>
                          <p className="font-medium">{visit.date} at {visit.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Purpose</p>
                          <p className="font-medium">{visit.purpose}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Weather</p>
                          <p className="font-medium">{visit.weather}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Remarks</p>
                        <p className="text-gray-900">{visit.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Report Footer */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Project Manager: John Smith | Construction Manager Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-red-400 rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reject Visit Request</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reject this visit request? This action will mark the request as cancelled.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmReject}
                  className="flex-1 bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 transition-colors font-medium"
                >
                  Yes, Reject
                </button>
                <button
                  onClick={cancelReject}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors font-medium"
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title="Success!"
        message={successMessage}
      />

      {/* Error Alert */}
      <ErrorAlert
        show={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        title="Error!"
        message={errorMessage}
      />
    </div>
  );
};

export default SiteVisitLogs;
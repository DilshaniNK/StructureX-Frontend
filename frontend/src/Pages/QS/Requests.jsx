import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';

function Requests() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [qsId, setQsId] = useState(null)
  const [filters, setFilters] = useState({
    project: '',
    type: '',
    status: ''
  })

  // Extract employeeId from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setQsId(decoded.employeeId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Fetch data from API
  useEffect(() => {
    if (!qsId) return; // Don't fetch until we have the employeeId

    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8086/api/v1/qs/requests/${qsId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform the API data to include status
        const transformedRequests = data.map(request => ({
          ...request,
          status: request.qsApproval === "1" ? 'accepted' : request.qsApproval === "-1" ? 'rejected' : 'pending'
        }))
        
        setRequests(transformedRequests)
        setFilteredRequests(transformedRequests)
      } catch (error) {
        console.error('Error fetching requests:', error)
        setRequests([])
        setFilteredRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [qsId])

  // Filter requests based on selected filters
  useEffect(() => {
    let filtered = requests

    if (filters.project) {
      filtered = filtered.filter(request => {
        const projectName = request.projectName || request.projectId
        return projectName.toLowerCase().includes(filters.project.toLowerCase())
      })
    }

    if (filters.type) {
      filtered = filtered.filter(request => request.requestType === filters.type)
    }

    if (filters.status) {
      filtered = filtered.filter(request => request.status === filters.status)
    }

    setFilteredRequests(filtered)
  }, [requests, filters])

  // Get unique values for filter dropdowns
  const getUniqueProjects = () => {
    const projects = [...new Set(requests.map(req => req.projectName || req.projectId))]
    return projects.sort()
  }

  const getUniqueTypes = () => {
    const types = [...new Set(requests.map(req => req.requestType))]
    return types.sort()
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      project: '',
      type: '',
      status: ''
    })
  }

  const refreshData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8086/api/v1/qs/requests/${qsId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform the API data to include status
      const transformedRequests = data.map(request => ({
        ...request,
        status: request.qsApproval === "1" ? 'accepted' : request.qsApproval === "-1" ? 'rejected' : 'pending'
      }))
      
      setRequests(transformedRequests)
      setFilteredRequests(transformedRequests)
    } catch (error) {
      console.error('Error refreshing requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  const handleAccept = async (requestId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to accept request #${requestId}? This action cannot be undone.`
    )
    
    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8086/api/v1/qs/requests/${requestId}/approval?qsApproval=1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update local state on successful API call
      setRequests(prev => 
        prev.map(req => 
          req.requestId === requestId ? { ...req, status: 'accepted', qsApproval: "1" } : req
        )
      )
      
      alert(`Request ${requestId} has been accepted!`)
    } catch (error) {
      console.error('Error accepting request:', error)
      alert(`Failed to accept request ${requestId}. Please try again.`)
    }
  }

  const handleReject = async (requestId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to reject request #${requestId}? This action cannot be undone.`
    )
    
    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8086/api/v1/qs/requests/${requestId}/approval?qsApproval=-1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update local state on successful API call
      setRequests(prev => 
        prev.map(req => 
          req.requestId === requestId ? { ...req, status: 'rejected', qsApproval: "-1" } : req
        )
      )
      
      alert(`Request ${requestId} has been rejected!`)
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert(`Failed to reject request ${requestId}. Please try again.`)
    }
  }

  const handleProceedToPurchase = (requestId) => {
    // Navigate to purchase/procurement process
    alert(`Proceeding to purchase for request ${requestId}`)
    // You can implement navigation to purchase page here
  }
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return '#ff4757'
      case 'medium': return '#ffa502'
      case 'low': return '#2ed573'
      default: return '#747d8c'
    }
  }

  const getRequestTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'material': return '#3742fa'
      case 'labor': return '#ff6348'
      case 'tool': return '#2ed573'
      default: return '#747d8c'
    }
  }

  const renderRequestsTable = () => (
    <div>
      {/* Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Project
            </label>
            <select
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Projects</option>
              {getUniqueProjects().map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Empty div for spacing to maintain 6-column layout */}
          <div></div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actions
            </label>
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              Clear Filters
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <button
              onClick={refreshData}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredRequests.length} requests
            {(filters.project || filters.type || filters.status) && (
              <span className="ml-2">
                (filtered by: {[
                  filters.project && `Project: ${filters.project}`,
                  filters.type && `Type: ${filters.type}`,
                  filters.status && `Status: ${filters.status}`
                ].filter(Boolean).join(', ')})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* No requests message */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="text-gray-500 text-lg">
            No requests found matching the current filters.
          </div>
        </div>
      )}

      {/* Table */}
      {filteredRequests.length > 0 && (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Supervisor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Count</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRequests.map(request => (
            <tr key={request.requestId} className={`hover:bg-gray-50 ${
              request.status === 'accepted' ? 'bg-green-50' : 
              request.status === 'rejected' ? 'bg-red-50' : ''
            }`}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">#{request.requestId}</td>
              <td className="px-4 py-3">
                <span 
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: getRequestTypeColor(request.requestType) }}
                >
                  {request.requestType}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.projectName || request.projectId}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.siteSupervisorName || request.siteSupervisorId}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.date}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.materials?.length || 0} items</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  request.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : request.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleView(request)}
                  >
                    View
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button 
                        className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => handleAccept(request.requestId)}
                      >
                        Accept
                      </button>
                      <button 
                        className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => handleReject(request.requestId)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      )}
    </div>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      )
    }

    if (requests.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No requests found.</p>
        </div>
      )
    }

    if (filteredRequests.length === 0) {
      return (
        <div>
          {renderRequestsTable()}
          <div className="text-center py-8">
            <p className="text-gray-500">No requests match the current filters.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear filters to see all requests
            </button>
          </div>
        </div>
      )
    }

    return renderRequestsTable()
  }
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal for viewing request details and items */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowModal(false)}>
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Request Details - #{selectedRequest.requestId}</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            {/* Request Header Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Request Type</span>
                  <p className="mt-1">
                    <span 
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: getRequestTypeColor(selectedRequest.requestType) }}
                    >
                      {selectedRequest.requestType}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Project Name</span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedRequest.projectName || selectedRequest.projectId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Site Supervisor</span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedRequest.siteSupervisorName || selectedRequest.siteSupervisorId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Request Date</span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedRequest.date}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">PM Approval</span>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedRequest.pmApproval === "1" 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedRequest.pmApproval === "1" ? 'Approved' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">QS Approval</span>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedRequest.qsApproval === "1" 
                        ? 'bg-green-100 text-green-800' 
                        : selectedRequest.qsApproval === "-1"
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedRequest.qsApproval === "1" ? 'Approved' : selectedRequest.qsApproval === "-1" ? 'Rejected' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedRequest.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Items</span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedRequest.materials?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Requested Items Table */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Requested Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedRequest.materials?.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">#{item.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.materialName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3">
                          <span 
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                            style={{ backgroundColor: getUrgencyColor(item.priority) }}
                          >
                            {item.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              {selectedRequest.status === 'pending' && (
                <>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => {
                      handleAccept(selectedRequest.requestId)
                      setShowModal(false)
                    }}
                  >
                    Accept Request
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => {
                      handleReject(selectedRequest.requestId)
                      setShowModal(false)
                    }}
                  >
                    Reject Request
                  </button>
                </>
              )}
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Requests

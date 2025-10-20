import React, { useState, useEffect } from 'react'

function Requests() {
  const [myRequests, setMyRequests] = useState([])
  const [otherRequests, setOtherRequests] = useState([])
  const [filteredMyRequests, setFilteredMyRequests] = useState([])
  const [filteredOtherRequests, setFilteredOtherRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('my-requests')
  const [filters, setFilters] = useState({
    project: '',
    type: '',
    status: '',
    qsOfficer: '' // Filter for specific QS officer in other requests
  })

  // Senior QS ID - this would typically come from authentication/context
  const seniorQsId = 'EMP_002' // Senior QS employee ID

  // Fetch data from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        // Fetch all requests - you might need different endpoints for this
        const response = await fetch('http://localhost:8086/api/v1/sqs/requests') // Assuming this endpoint exists
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform and separate requests
        const myReqs = []
        const otherReqs = []
        
        data.forEach(request => {
          const transformedRequest = {
            ...request,
            status: request.qsApproval === "1" ? 'accepted' : request.qsApproval === "-1" ? 'rejected' : 'pending'
          }
          
          if (request.qsId === seniorQsId) {
            myReqs.push(transformedRequest)
          } else {
            otherReqs.push(transformedRequest)
          }
        })
        
        setMyRequests(myReqs)
        setOtherRequests(otherReqs)
        setFilteredMyRequests(myReqs)
        setFilteredOtherRequests(otherReqs)
      } catch (error) {
        console.error('Error fetching requests:', error)
        setMyRequests([])
        setOtherRequests([])
        setFilteredMyRequests([])
        setFilteredOtherRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  // Filter requests based on selected filters
  useEffect(() => {
    const applyFilters = (requests, isOtherRequests = false) => {
      let filtered = requests

      if (filters.project) {
        filtered = filtered.filter(request => 
          (request.projectName || request.projectId).toLowerCase().includes(filters.project.toLowerCase())
        )
      }

      if (filters.type) {
        filtered = filtered.filter(request => request.requestType === filters.type)
      }

      if (filters.status) {
        filtered = filtered.filter(request => request.status === filters.status)
      }

      // Apply QS officer filter only for other requests
      if (isOtherRequests && filters.qsOfficer) {
        filtered = filtered.filter(request => 
          (request.qsOfficerName || request.qsId) === filters.qsOfficer
        )
      }

      return filtered
    }

    setFilteredMyRequests(applyFilters(myRequests, false))
    setFilteredOtherRequests(applyFilters(otherRequests, true))
  }, [myRequests, otherRequests, filters])

  // Get unique values for filter dropdowns
  const getUniqueProjects = () => {
    const allRequests = [...myRequests, ...otherRequests]
    const projects = [...new Set(allRequests.map(req => req.projectId))]
    return projects.sort()
  }

  const getUniqueTypes = () => {
    const allRequests = [...myRequests, ...otherRequests]
    const types = [...new Set(allRequests.map(req => req.requestType))]
    return types.sort()
  }

  const getUniqueQSOfficers = () => {
    // Only get QS officers from other requests (excluding current senior QS)
    const qsOfficers = [...new Set(otherRequests.map(req => req.qsOfficerName || req.qsId))]
    return qsOfficers.sort()
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
      status: '',
      qsOfficer: ''
    })
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    // Clear QS Officer filter when switching to "My Requests" tab
    if (newTab === 'my-requests' && filters.qsOfficer) {
      setFilters(prev => ({
        ...prev,
        qsOfficer: ''
      }))
    }
  }

  const refreshData = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8086/api/v1/sqs/requests')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      const myReqs = []
      const otherReqs = []
      
      data.forEach(request => {
        const transformedRequest = {
          ...request,
          status: request.qsApproval === "1" ? 'accepted' : request.qsApproval === "-1" ? 'rejected' : 'pending'
        }
        
        if (request.qsId === seniorQsId) {
          myReqs.push(transformedRequest)
        } else {
          otherReqs.push(transformedRequest)
        }
      })
      
      setMyRequests(myReqs)
      setOtherRequests(otherReqs)
      setFilteredMyRequests(myReqs)
      setFilteredOtherRequests(otherReqs)
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

  // Only allow accept/reject for Senior QS's own requests
  const handleAccept = async (requestId) => {
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
      setMyRequests(prev => 
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
      setMyRequests(prev => 
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
    alert(`Proceeding to purchase for request ${requestId}`)
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

  const renderRequestsTable = (requests, canModify = false) => (
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

          {/* QS Officer filter - only show for Other QS Requests tab */}
          {activeTab === 'other-requests' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by QS Officer
              </label>
              <select
                value={filters.qsOfficer}
                onChange={(e) => handleFilterChange('qsOfficer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All QS Officers</option>
                {getUniqueQSOfficers().map(qsId => (
                  <option key={qsId} value={qsId}>{qsId}</option>
                ))}
              </select>
            </div>
          )}

          {/* Empty div for spacing when QS Officer filter is not shown */}
          {activeTab === 'my-requests' && <div></div>}

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
            Showing {requests.length} requests
            {(filters.project || filters.type || filters.status || filters.qsOfficer) && (
              <span className="ml-2">
                (filtered by: {[
                  filters.project && `Project: ${filters.project}`,
                  filters.type && `Type: ${filters.type}`,
                  filters.status && `Status: ${filters.status}`,
                  filters.qsOfficer && `QS Officer: ${filters.qsOfficer}`
                ].filter(Boolean).join(', ')})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* No requests message */}
      {requests.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="text-gray-500 text-lg">
            {activeTab === 'my-requests' 
              ? 'No requests found. You haven\'t made any requests yet.' 
              : 'No other QS requests found.'}
          </div>
        </div>
      )}

      {/* Table */}
      {requests.length > 0 && (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Supervisor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QS Officer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Count</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(request => (
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
                <td className="px-4 py-3 text-sm text-gray-900">{request.qsOfficerName || request.qsId}</td>
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
                    {/* Only show Accept/Reject buttons for own requests and if status is pending */}
                    {canModify && request.status === 'pending' && (
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
                    {/* Show view-only indicator for other requests */}
                    {!canModify && (
                      <span className="inline-flex items-center px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md">
                        View Only
                      </span>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )
    }

    const currentRequests = activeTab === 'my-requests' 
      ? filteredMyRequests 
      : filteredOtherRequests

    return (
      <div className="bg-white">
        {renderRequestsTable(currentRequests, activeTab === 'my-requests')}
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button 
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'my-requests' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('my-requests')}
              >
                My Requests ({filteredMyRequests.filter(r => r.status === 'pending').length} pending)
              </button>
              <button 
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'other-requests' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('other-requests')}
              >
                Other QS Officers ({filteredOtherRequests.filter(r => r.status === 'pending').length} pending)
              </button>
            </nav>
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal for viewing request details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowModal(false)}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">Request ID:</span>
                  <p className="text-gray-900">#{selectedRequest.requestId}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Project Name:</span>
                  <p className="text-gray-900">{selectedRequest.projectName || selectedRequest.projectId}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Site Supervisor:</span>
                  <p className="text-gray-900">{selectedRequest.siteSupervisorName || selectedRequest.siteSupervisorId}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">QS Officer:</span>
                  <p className="text-gray-900">{selectedRequest.qsOfficerName || selectedRequest.qsId}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Request Date:</span>
                  <p className="text-gray-900">{selectedRequest.date}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Request Type:</span>
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ml-2"
                    style={{ backgroundColor: getRequestTypeColor(selectedRequest.requestType) }}
                  >
                    {selectedRequest.requestType}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">PM Approval:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    selectedRequest.pmApproval === "1" 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRequest.pmApproval === "1" ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">QS Approval:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    selectedRequest.qsApproval === "1" 
                      ? 'bg-green-100 text-green-800' 
                      : selectedRequest.qsApproval === "-1"
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRequest.qsApproval === "1" ? 'Approved' : selectedRequest.qsApproval === "-1" ? 'Rejected' : 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    selectedRequest.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : selectedRequest.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Received:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    selectedRequest.isReceived 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedRequest.isReceived ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {selectedRequest.materials && selectedRequest.materials.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700">Requested Items:</span>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.materials.map((material, index) => (
                      <div key={material.id || index} className="bg-gray-50 p-3 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Material Name:</span>
                            <p className="text-sm text-gray-900">{material.materialName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Quantity:</span>
                            <p className="text-sm text-gray-900">{material.quantity}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Priority:</span>
                            <span 
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                              style={{ backgroundColor: getUrgencyColor(material.priority) }}
                            >
                              {material.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              {/* Only show accept/reject buttons for own requests and if status is pending */}
              {activeTab === 'my-requests' && selectedRequest.status === 'pending' && (
                <>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      handleReject(selectedRequest.requestId)
                      setShowModal(false)
                    }}
                  >
                    Reject
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => {
                      handleAccept(selectedRequest.requestId)
                      setShowModal(false)
                    }}
                  >
                    Accept Request
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

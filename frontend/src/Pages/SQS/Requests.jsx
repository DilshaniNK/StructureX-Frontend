import React, { useState, useEffect } from 'react'

function Requests() {
  const [activeTab, setActiveTab] = useState('materials')
  const [requests, setRequests] = useState({
    materials: [],
    labor: [],
    tools: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests({
        materials: [
          {
            id: 1,
            siteSupervisor: 'John Smith',
            projectName: 'Building A Construction',
            itemName: 'Portland Cement',
            quantity: 50,
            unit: 'bags',
            urgency: 'High',
            requestDate: '2025-06-20',
            estimatedCost: 2500,
            description: 'Required for foundation work',
            status: 'pending'
          },
          {
            id: 2,
            siteSupervisor: 'Jane Doe',
            projectName: 'Road Expansion',
            itemName: 'Steel Rebar',
            quantity: 100,
            unit: 'pieces',
            urgency: 'Medium',
            requestDate: '2025-06-19',
            estimatedCost: 5000,
            description: 'For reinforcement structure',
            status: 'pending'
          },
          {
            id: 3,
            siteSupervisor: 'Mike Wilson',
            projectName: 'Bridge Construction',
            itemName: 'Concrete Blocks',
            quantity: 200,
            unit: 'pieces',
            urgency: 'Low',
            requestDate: '2025-06-18',
            estimatedCost: 3500,
            description: 'Standard concrete blocks for construction',
            status: 'pending'
          }
        ],
        labor: [
          {
            id: 1,
            siteSupervisor: 'Mike Johnson',
            projectName: 'Building A Construction',
            laborType: 'Skilled Mason',
            quantity: 5,
            duration: '2 weeks',
            urgency: 'High',
            requestDate: '2025-06-21',
            estimatedCost: 15000,
            description: 'Experienced masons for brick work',
            status: 'pending'
          },
          {
            id: 2,
            siteSupervisor: 'Sarah Wilson',
            projectName: 'Bridge Construction',
            laborType: 'Heavy Equipment Operator',
            quantity: 2,
            duration: '1 month',
            urgency: 'Medium',
            requestDate: '2025-06-18',
            estimatedCost: 20000,
            description: 'Crane and excavator operators',
            status: 'pending'
          }
        ],
        tools: [
          {
            id: 1,
            siteSupervisor: 'Tom Brown',
            projectName: 'Road Expansion',
            toolName: 'Concrete Mixer',
            quantity: 2,
            rentalPeriod: '1 month',
            urgency: 'High',
            requestDate: '2025-06-22',
            estimatedCost: 3000,
            description: 'Heavy duty concrete mixers',
            status: 'pending'
          },
          {
            id: 2,
            siteSupervisor: 'Lisa Davis',
            projectName: 'Building A Construction',
            toolName: 'Power Drill Set',
            quantity: 10,
            rentalPeriod: '2 weeks',
            urgency: 'Low',
            requestDate: '2025-06-20',
            estimatedCost: 800,
            description: 'Professional grade drill sets',
            status: 'pending'
          }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleView = (type, request) => {
    setSelectedRequest({ ...request, type })
    setShowModal(true)
  }

  const handleAccept = (type, id) => {
    setRequests(prev => ({
      ...prev,
      [type]: prev[type].map(req => 
        req.id === id ? { ...req, status: 'accepted' } : req
      )
    }))
    alert(`${type} request ${id} has been accepted!`)
  }

  const handleProceedToPurchase = (type, id) => {
    // Navigate to purchase/procurement process
    alert(`Proceeding to purchase for ${type} request ${id}`)
    // You can implement navigation to purchase page here
  }
  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return '#ff4757'
      case 'medium': return '#ffa502'
      case 'low': return '#2ed573'
      default: return '#747d8c'
    }
  }

  const renderMaterialsTable = () => (
    <div>
      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm table-fixed">        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Supervisor</th>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.materials.map(request => (            <tr key={request.id} className={`hover:bg-gray-50 ${request.status === 'accepted' ? 'bg-green-50' : ''}`}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{request.siteSupervisor}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.projectName}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.itemName}</div>
                  <div className="text-sm text-gray-500">{request.description}</div>
                </div>
              </td>              <td className="px-4 py-3 text-sm text-gray-900">{request.quantity} {request.unit}</td>
              <td className="px-4 py-3">
                <span 
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                >
                  {request.urgency}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.requestDate}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleView('materials', request)}
                  >
                    View
                  </button>
                  {request.status === 'pending' && (
                    <button 
                      className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => handleAccept('materials', request.id)}
                    >
                      Accept
                    </button>
                  )}
                  <button 
                    className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => handleProceedToPurchase('materials', request.id)}
                  >
                    Purchase
                  </button>
                </div>
              </td>
            </tr>
          ))}        </tbody>
      </table>
    </div>
  )
  const renderLaborTable = () => (
    <div>
      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Supervisor</th>
            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labor Type</th>
            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.labor.map(request => (
            <tr key={request.id} className={`hover:bg-gray-50 ${request.status === 'accepted' ? 'bg-green-50' : ''}`}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{request.siteSupervisor}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.projectName}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.laborType}</div>
                  <div className="text-sm text-gray-500">{request.description}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.quantity} workers</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.duration}</td>              <td className="px-4 py-3">
                <span 
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                >
                  {request.urgency}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.requestDate}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleView('labor', request)}
                  >
                    View
                  </button>
                  {request.status === 'pending' && (
                    <button 
                      className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => handleAccept('labor', request.id)}
                    >
                      Accept
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}</tbody>
      </table>
    </div>
  )
  const renderToolsTable = () => (
    <div>
      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Supervisor</th>
            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool/Equipment</th>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
            <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>        <tbody className="bg-white divide-y divide-gray-200">
          {requests.tools.map(request => (
            <tr key={request.id} className={`hover:bg-gray-50 ${request.status === 'accepted' ? 'bg-green-50' : ''}`}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{request.siteSupervisor}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.projectName}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.toolName}</div>
                  <div className="text-sm text-gray-500">{request.description}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.quantity} units</td>
              <td className="px-4 py-3">
                <span 
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                >
                  {request.urgency}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{request.requestDate}</td>              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleView('tools', request)}
                  >
                    View
                  </button>
                  {request.status === 'pending' && (
                    <button 
                      className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => handleAccept('tools', request.id)}
                    >
                      Accept
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}</tbody>
      </table>
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

    switch (activeTab) {
      case 'materials':
        return renderMaterialsTable()
      case 'labor':
        return renderLaborTable()
      case 'tools':
        return renderToolsTable()
      default:        return renderMaterialsTable()
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
     
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button 
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'materials' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('materials')}
              >
                Materials ({requests.materials.filter(r => r.status === 'pending').length})
              </button>
              <button 
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'labor' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('labor')}
              >
                Labor ({requests.labor.filter(r => r.status === 'pending').length})
              </button>
              <button 
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'tools' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tools')}
              >
                Tools & Equipment ({requests.tools.filter(r => r.status === 'pending').length})
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
                  <span className="font-semibold text-gray-700">Site Supervisor:</span>
                  <p className="text-gray-900">{selectedRequest.siteSupervisor}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Project:</span>
                  <p className="text-gray-900">{selectedRequest.projectName}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Request Date:</span>
                  <p className="text-gray-900">{selectedRequest.requestDate}</p>
                </div>                <div>
                  <span className="font-semibold text-gray-700">Urgency:</span>
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ml-2"
                    style={{ backgroundColor: getUrgencyColor(selectedRequest.urgency) }}
                  >
                    {selectedRequest.urgency}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    selectedRequest.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              {selectedRequest.type === 'materials' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">Material:</span>
                    <p className="text-gray-900">{selectedRequest.itemName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Quantity:</span>
                    <p className="text-gray-900">{selectedRequest.quantity} {selectedRequest.unit}</p>
                  </div>
                </div>
              )}
              
              {selectedRequest.type === 'labor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">Labor Type:</span>
                    <p className="text-gray-900">{selectedRequest.laborType}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Workers Needed:</span>
                    <p className="text-gray-900">{selectedRequest.quantity}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <p className="text-gray-900">{selectedRequest.duration}</p>
                  </div>
                </div>
              )}
                {selectedRequest.type === 'tools' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">Tool/Equipment:</span>
                    <p className="text-gray-900">{selectedRequest.toolName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Quantity:</span>
                    <p className="text-gray-900">{selectedRequest.quantity} units</p>
                  </div>
                </div>
              )}
              
              <div>
                <span className="font-semibold text-gray-700">Description:</span>
                <p className="text-gray-900 mt-1">{selectedRequest.description}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              {selectedRequest.status === 'pending' && (
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => {
                    handleAccept(selectedRequest.type, selectedRequest.id)
                    setShowModal(false)
                  }}
                >
                  Accept Request
                </button>
              )}
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  handleProceedToPurchase(selectedRequest.type, selectedRequest.id)
                  setShowModal(false)
                }}
              >
                {selectedRequest.type === 'materials' ? 'Proceed to Purchase' : 
                 selectedRequest.type === 'labor' ? 'Proceed to Hire' : 'Proceed to Rent'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Requests

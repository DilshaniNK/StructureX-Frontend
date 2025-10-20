import React, { useState, useEffect } from 'react'

function SiteVisitList({ projectId }) {
  const [siteVisits, setSiteVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedVisitId, setExpandedVisitId] = useState(null)
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    if (!projectId) return
    
    const fetchSiteVisits = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/qs/projects/site-visits/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch site visits')
        }
        
        const data = await response.json()
        setSiteVisits(data)
      } catch (err) {
        console.error('Error fetching site visits:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSiteVisits()
  }, [projectId])

  const toggleParticipants = (visitId) => {
    setExpandedVisitId(expandedVisitId === visitId ? null : visitId)
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || ''
    switch (statusLower) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmployeeTypeColor = (type) => {
    const typeLower = type?.toLowerCase() || ''
    if (typeLower.includes('qs')) {
      return 'bg-blue-50 text-blue-700 border-blue-200'
    } else if (typeLower.includes('supervisor')) {
      return 'bg-purple-50 text-purple-700 border-purple-200'
    } else if (typeLower.includes('manager')) {
      return 'bg-orange-50 text-orange-700 border-orange-200'
    }
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getFilteredVisits = () => {
    let filtered = siteVisits

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(visit => 
        visit.status?.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(visit => visit.date === dateFilter)
    }

    return filtered
  }

  const clearFilters = () => {
    setStatusFilter('all')
    setDateFilter('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading site visits: {error}</p>
      </div>
    )
  }

  const filteredVisits = getFilteredVisits()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Site Visit Logs</h3>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(statusFilter !== 'all' || dateFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Site Visits List */}
      {filteredVisits.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-600">
            {statusFilter !== 'all' || dateFilter 
              ? 'No site visits found matching the selected filters.' 
              : 'No site visits recorded for this project yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <div 
              key={visit.visit_id} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Visit Header */}
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        Visit #{visit.visit_id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(visit.status)}`}>
                        {visit.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(visit.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleParticipants(visit.visit_id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>
                      {expandedVisitId === visit.visit_id ? 'Hide' : 'Show'} Participants ({visit.participants?.length || 0})
                    </span>
                    <svg 
                      className={`w-4 h-4 transform transition-transform ${expandedVisitId === visit.visit_id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Description: </span>
                    {visit.description}
                  </p>
                </div>
              </div>

              {/* Participants Section (Expandable) */}
              {expandedVisitId === visit.visit_id && visit.participants && visit.participants.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Participants
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {visit.participants.map((participant, index) => (
                      <div 
                        key={index}
                        className={`border rounded-lg p-3 ${getEmployeeTypeColor(participant.employee_type)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {participant.employee_name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              ID: {participant.employee_id}
                            </p>
                            <p className="text-xs font-medium mt-1">
                              {participant.employee_type.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SiteVisitList

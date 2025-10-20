import React, { useState, useEffect } from 'react'

const DailyUpdatesView = ({ projectId }) => {
  const [dailyUpdates, setDailyUpdates] = useState([])
  const [filteredUpdates, setFilteredUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchDate, setSearchDate] = useState('')

  useEffect(() => {
    const fetchDailyUpdates = async () => {
      if (!projectId) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `http://localhost:8086/api/v1/qs/projects/daily-updates/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch daily updates')
        }

        const data = await response.json()
        setDailyUpdates(data)
        setFilteredUpdates(data)
      } catch (err) {
        console.error('Error fetching daily updates:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyUpdates()
  }, [projectId])

  // Filter updates when search date changes
  useEffect(() => {
    if (searchDate === '') {
      setFilteredUpdates(dailyUpdates)
    } else {
      const filtered = dailyUpdates.filter(update => {
        const updateDate = new Date(update.date).toISOString().split('T')[0]
        return updateDate === searchDate
      })
      setFilteredUpdates(filtered)
    }
  }, [searchDate, dailyUpdates])

  const handleDateFilterChange = (e) => {
    setSearchDate(e.target.value)
  }

  const clearDateFilter = () => {
    setSearchDate('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDateLabel = (dateString) => {
    const today = new Date()
    const updateDate = new Date(dateString)
    const diffTime = today - updateDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-800">Error loading daily updates: {error}</p>
        </div>
      </div>
    )
  }

  if (dailyUpdates.length === 0 && searchDate === '') {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Daily Updates Yet</h3>
        <p className="text-gray-600">There are no daily updates recorded for this project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Daily Updates</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">
              Filter by date:
            </label>
            <input
              type="date"
              id="dateFilter"
              value={searchDate}
              onChange={handleDateFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {searchDate && (
              <button
                onClick={clearDateFilter}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {filteredUpdates.length} update{filteredUpdates.length !== 1 ? 's' : ''}
            {searchDate && ` on ${new Date(searchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </div>
        </div>
      </div>

      {filteredUpdates.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates Found</h3>
          <p className="text-gray-600">
            {searchDate 
              ? `No updates found for ${new Date(searchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
              : 'There are no daily updates recorded for this project.'}
          </p>
          {searchDate && (
            <button
              onClick={clearDateFilter}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear filter to see all updates
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
          <div 
            key={update.update_id} 
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{update.employee_name}</h4>
                  <p className="text-sm text-gray-500">Employee ID: {update.employee_id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {getDateLabel(update.date)}
                </span>
                <p className="text-xs text-gray-500 mt-1">{formatDate(update.date)}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-gray-800 leading-relaxed">{update.note}</p>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Update ID: {update.update_id}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Project: {update.project_id}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default DailyUpdatesView

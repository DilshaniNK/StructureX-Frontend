import React, { useState, useEffect } from 'react'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    project: 'all',
    category: 'all',
    status: 'all',
    priority: 'all',
    dateRange: 'all'
  })

  // Mock notification data
  useEffect(() => {
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          title: 'Material Request Approved',
          message: 'Your request for Portland Cement (50 bags) has been approved and is ready for purchase.',
          category: 'Material Request',
          project: 'Building A Construction',
          priority: 'High',
          status: 'unread',
          timestamp: '2025-06-22 10:30 AM',
          date: '2025-06-22',
          sender: 'John Smith',
          type: 'approval'
        },
        {
          id: 2,
          title: 'Labor Request Submitted',
          message: 'New labor request for 5 skilled masons has been submitted for Building A Construction.',
          category: 'Labor Request',
          project: 'Building A Construction',
          priority: 'Medium',
          status: 'read',
          timestamp: '2025-06-22 09:15 AM',
          date: '2025-06-22',
          sender: 'Mike Johnson',
          type: 'request'
        },
        {
          id: 3,
          title: 'BOQ Update Required',
          message: 'Bill of Quantities for Road Expansion project needs immediate update due to design changes.',
          category: 'BOQ',
          project: 'Road Expansion',
          priority: 'High',
          status: 'unread',
          timestamp: '2025-06-21 04:45 PM',
          date: '2025-06-21',
          sender: 'System',
          type: 'update'
        },
        {
          id: 4,
          title: 'Tool Rental Expiring',
          message: 'Concrete Mixer rental for Road Expansion project expires in 3 days.',
          category: 'Tool Management',
          project: 'Road Expansion',
          priority: 'Medium',
          status: 'read',
          timestamp: '2025-06-21 02:20 PM',
          date: '2025-06-21',
          sender: 'System',
          type: 'reminder'
        },
        {
          id: 5,
          title: 'Budget Alert',
          message: 'Bridge Construction project has exceeded 80% of allocated budget.',
          category: 'Budget',
          project: 'Bridge Construction',
          priority: 'High',
          status: 'unread',
          timestamp: '2025-06-21 11:30 AM',
          date: '2025-06-21',
          sender: 'Financial Officer',
          type: 'alert'
        },
        {
          id: 6,
          title: 'Purchase Order Completed',
          message: 'Steel Rebar purchase order #PO-2025-001 has been completed successfully.',
          category: 'Purchase Order',
          project: 'Road Expansion',
          priority: 'Low',
          status: 'read',
          timestamp: '2025-06-20 03:15 PM',
          date: '2025-06-20',
          sender: 'Procurement Team',
          type: 'completion'
        },
        {
          id: 7,
          title: 'Quality Inspection Scheduled',
          message: 'Quality inspection for concrete blocks is scheduled for tomorrow at 10:00 AM.',
          category: 'Quality Control',
          project: 'Bridge Construction',
          priority: 'Medium',
          status: 'unread',
          timestamp: '2025-06-20 01:45 PM',
          date: '2025-06-20',
          sender: 'QC Inspector',
          type: 'schedule'
        },
        {
          id: 8,
          title: 'Urgent Material Shortage',
          message: 'Critical shortage of concrete blocks detected for Bridge Construction project.',
          category: 'Material Request',
          project: 'Bridge Construction',
          priority: 'Critical',
          status: 'unread',
          timestamp: '2025-06-19 05:30 PM',
          date: '2025-06-19',
          sender: 'Site Supervisor',
          type: 'alert'
        }
      ]
      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter notifications based on selected filters
  useEffect(() => {
    let filtered = notifications

    if (filters.project !== 'all') {
      filtered = filtered.filter(notification => notification.project === filters.project)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(notification => notification.category === filters.category)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(notification => notification.status === filters.status)
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === filters.priority)
    }

    if (filters.dateRange !== 'all') {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)

      filtered = filtered.filter(notification => {
        const notificationDate = new Date(notification.date)
        switch (filters.dateRange) {
          case 'today':
            return notificationDate.toDateString() === today.toDateString()
          case 'yesterday':
            return notificationDate.toDateString() === yesterday.toDateString()
          case 'lastWeek':
            return notificationDate >= lastWeek
          default:
            return true
        }
      })
    }

    setFilteredNotifications(filtered)
  }, [filters, notifications])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' }
          : notification
      )
    )
  }
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: 'read' }))
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const uniqueProjects = [...new Set(notifications.map(n => n.project))]
  const uniqueCategories = [...new Set(notifications.map(n => n.category))]
  const unreadCount = notifications.filter(n => n.status === 'unread').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading notifications...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Mark All as Read
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <div className="text-sm text-gray-600">Total Notifications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.priority === 'Critical' || n.priority === 'High').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.date === '2025-06-22').length}
            </div>
            <div className="text-sm text-gray-600">Today</div>
          </div>
        </div>


        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={filters.project}
                onChange={(e) => handleFilterChange('project', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Projects</option>
                {uniqueProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last 7 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    notification.status === 'unread' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`text-sm font-medium ${
                            notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          {notification.status === 'unread' && (
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{notification.timestamp}</span>
                          <span>•</span>
                          <span>{notification.project}</span>
                          <span>•</span>
                          <span>{notification.sender}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {notification.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        
      </div>
    </div>
  )
}

export default Notifications

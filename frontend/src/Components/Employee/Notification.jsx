import React, { useState } from 'react';
import { Bell, Search, Eye, Trash2, Clock } from 'lucide-react';

export default function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Project Approved',
      message: 'Your design for Building A-12 has been approved by the QS Officer.',
      time: '2 hours ago',
      read: false,
      category: 'project'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Deadline Reminder',
      message: 'Project XYZ-789 deadline is approaching in 3 days.',
      time: '4 hours ago',
      read: false,
      category: 'deadline'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Message',
      message: 'You have a new message from Site Supervisor regarding material specifications.',
      time: '6 hours ago',
      read: true,
      category: 'message'
    },
    {
      id: 4,
      type: 'success',
      title: 'Task Completed',
      message: 'Foundation design calculations have been successfully submitted.',
      time: '1 day ago',
      read: true,
      category: 'task'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Quality Check Required',
      message: 'Building C-15 requires quality inspection before proceeding to next phase.',
      time: '1 day ago',
      read: false,
      category: 'quality'
    },
    {
      id: 6,
      type: 'info',
      title: 'Meeting Scheduled',
      message: 'Project review meeting scheduled for tomorrow at 10:00 AM.',
      time: '2 days ago',
      read: true,
      category: 'meeting'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'unread' && !notif.read) ||
      (selectedFilter === 'read' && notif.read);
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-[#FAAD00]/5 to-white shadow-lg border-b border-gray-100">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#FAAD00] rounded-xl shadow-lg">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    Notifications
                  </h1>
                  <p className="text-xl text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-semibold"
              >
                Mark All Read
              </button>
              <button 
                className="px-6 py-3 text-white rounded-2xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-semibold"
                style={{ backgroundColor: '#FAAD00' }}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="px-8 py-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#FAAD00]/20 focus:border-[#FAAD00] outline-none transition-all duration-300 text-lg"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-4">
            {['all', 'read', 'unread'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 text-lg ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-[#FAAD00] to-yellow-500 text-white shadow-lg hover:shadow-xl'
                    : 'text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4' : ''
                }`}
                style={!notification.read ? { borderLeftColor: '#FAAD00' } : {}}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Bell size={18} className="text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span 
                              className="ml-2 w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: '#FAAD00' }}
                            ></span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-2 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center mt-3">
                          <Clock size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{notification.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
                            title="Mark as read"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50"
                          title="Delete notification"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
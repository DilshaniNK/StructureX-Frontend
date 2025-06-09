import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Trash2, 
  Check, 
  Eye,
  AlertTriangle,
  Info,
  CheckCircle,
  Users,
  Shield,
  Server,
  Clock,
  Filter
} from 'lucide-react';

const AdminNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'security',
      title: 'Failed Login Attempts Detected',
      message: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false
    },
    {
      id: 2,
      type: 'system',
      title: 'Server Maintenance Scheduled',
      message: 'Scheduled maintenance for primary database server on June 15th',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: 3,
      type: 'user',
      title: 'New User Registration',
      message: 'Sarah Johnson has registered and is pending approval',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Completed Successfully',
      message: 'Daily backup process completed successfully',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'Storage Space Warning',
      message: 'Server storage is at 85% capacity',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isRead: false
    }
  ]);

  const getNotificationIcon = () => {
    return <Bell className="w-5 h-5 text-[#FAAD00]" />;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notification.isRead) ||
                         (selectedFilter === 'read' && notification.isRead);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FAAD00] mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8" />
          Notifications
        </h1>
        <p className="text-gray-400">Stay updated with system alerts and updates</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Notifications</p>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
              </div>
              <div className="p-3 bg-[#FAAD00]/10 rounded-lg border border-[#FAAD00]/20">
                <Bell className="w-6 h-6 text-[#FAAD00]" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread</p>
                <p className="text-2xl font-bold text-white">{unreadCount}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#FAAD00] focus:outline-none transition-colors"
              />
            </div>

            {/* Filter & Actions */}
            <div className="flex gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#FAAD00] focus:outline-none"
              >
                <option value="all">All</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>

              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-3 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
              <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-800 rounded-xl p-6 border transition-all duration-200 hover:border-gray-600 ${
                  notification.isRead ? 'border-gray-700' : 'border-[#FAAD00]/30 bg-gray-800/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    <div className="p-3 rounded-lg bg-[#FAAD00]/10 border border-[#FAAD00]/20">
                      {getNotificationIcon()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-semibold ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#FAAD00] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-sm leading-relaxed mb-4 ${
                      notification.isRead ? 'text-gray-400' : 'text-gray-300'
                    }`}>
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleNotificationRead(notification.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
                          notification.isRead 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                            : 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        {notification.isRead ? 'Mark Unread' : 'Mark Read'}
                      </button>

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-2 px-3 py-2 border border-red-500 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
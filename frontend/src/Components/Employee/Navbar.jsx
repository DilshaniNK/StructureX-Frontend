import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, ChevronDown, User, MessageSquare, Settings, AlertTriangle, CheckCircle, Menu, X
} from 'lucide-react';
import { useNavigate , useParams } from 'react-router-dom';
import name from '../../assets/name.png'; // Adjust the path as necessary

const Navbar = ({ 
  userRole = 'Designer', 
  userName = 'John Doe',
  isSidebarOpen,
  toggleSidebar 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications] = useState([
    {
      id: 1,
      type: 'task',
      icon: CheckCircle,
      title: 'New task assigned',
      message: 'Project Alpha review task has been assigned to you',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'meeting',
      icon: MessageSquare,
      title: 'Meeting reminder',
      message: 'Team standup meeting starts in 30 minutes',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'system',
      icon: Settings,
      title: 'System update completed',
      message: 'All systems have been successfully updated',
      time: '3 hours ago',
      read: true
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileMenu]);

  const getProfileInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getNotificationIconColor = (type) => {
    const colorMap = {
      task: 'text-green-500',
      meeting: 'text-blue-500',
      system: 'text-gray-500',
      alert: 'text-red-500',
      default: 'text-gray-500'
    };
    return colorMap[type] || colorMap.default;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = useNavigate();
  const { employeeId, supplierId, clientId, adminId } = useParams();
  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <nav className="bg-white h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>

        <div className="flex items-center">
          <img src={name} alt="Logo" className="w-auto h-12 mr-2" /> 
        </div>
      </div>
        
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 hover:bg-[#FAAD00]/10 rounded-full transition-all duration-200 group"
          >
            <Bell className="w-6 h-6 text-gray-700 group-hover:text-[#FAAD00]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/5 to-transparent">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">{unreadCount} unread notifications</p>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 border-b border-gray-50 transition-all duration-150 cursor-pointer ${
                        !notification.read ? 'bg-[#FAAD00]/5 border-l-4 border-l-[#FAAD00]' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${!notification.read ? 'bg-[#FAAD00]/10' : 'bg-gray-100'}`}>
                          <IconComponent className={`w-4 h-4 ${getNotificationIconColor(notification.type)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium text-gray-800 ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#FAAD00] rounded-full ml-2"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-3 p-2 hover:bg-[#FAAD00]/10 rounded-xl transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#FAAD00] to-[#FAAD00]/80 rounded-full flex items-center justify-center border-2 border-[#FAAD00]/20 shadow-md">
              <span className="text-white font-bold text-sm">
                {getProfileInitials(userName)}
              </span>
            </div>
            
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-800 group-hover:text-[#FAAD00] transition-colors duration-200">
                {userName}
              </div>
              <div className="text-xs text-gray-600">{getRoleDisplayName(userRole)}</div>
            </div>
            
            <ChevronDown className={`w-4 h-4 text-gray-600 group-hover:text-[#FAAD00] transition-all duration-200 ${
              showProfileMenu ? 'rotate-180' : ''
            }`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/5 to-transparent">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-600">{getRoleDisplayName(userRole)}</p>
              </div>
              <div className="py-2">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setShowProfileMenu(false);

                    const currentPath = window.location.pathname;

                    // ✅ Only navigate if we’re NOT already on /profile
                    if (!currentPath.endsWith('/profile')) {
                      // Remove any trailing slashes, just in case
                      const cleanedPath = currentPath.replace(/\/+$/, '');
                      navigate(`${cleanedPath}/profile`);
                    }
                  }}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] transition-all duration-150 font-medium"
                >
                  My Profile
                </a>
                <a href="#help" className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] transition-all duration-150 font-medium">
                  Help & Support
                </a>
                <hr className="my-2 border-gray-100" />
                <a
                  href="#logout"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="block px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 font-medium"
                >
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
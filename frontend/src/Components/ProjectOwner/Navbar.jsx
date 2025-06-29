import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CreditCard, FileText, Home, MessageSquare, Settings, User, Hammer, AlertCircle, ChevronDown, Menu, X, LogOut
} from 'lucide-react';

import name from '../../assets/name.png';

const Navbar = ({ 
  activeTab = 'dashboard',
  setActiveTab,
  userRole = 'Product Owner', 
  userName = 'John Doe',
  isSidebarOpen,
  toggleSidebar 
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications] = useState([
    {
      id: 1,
      message: "Payment reminder: $5,000 due in 3 days",
      type: "payment",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      message: "Construction progress updated - 65% complete",
      type: "progress",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      message: "New message from Site Supervisor",
      type: "message",
      time: "2 days ago",
      read: true
    },
    {
      id: 4,
      message: "Material delivery scheduled for tomorrow",
      type: "delivery",
      time: "3 days ago",
      read: true
    }
  ]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: '/project_owner/dashboard' },
    { id: "project", label: "Project", icon: FileText, path: '/project_owner/project' },
    { id: "payments", label: "Payments", icon: CreditCard, path: '/project_owner/payments' },
    { id: "materials", label: "Materials", icon: Settings, path: '/project_owner/materials' },
    { id: "communications", label: "Messages", icon: MessageSquare, path: '/project_owner/messages' },
  ];

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

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  const getProfileInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      payment: CreditCard,
      progress: Hammer,
      message: MessageSquare,
      delivery: Settings,
      default: AlertCircle
    };
    return iconMap[type] || iconMap.default;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-white h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 border-b border-gray-200 shadow-sm">
        {/* Left Section - Logo and Mobile Menu */}
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
            <img src={name} alt="StructureX" className="w-auto h-12 mr-2" /> 
          </div>
        </div>

        {/* Center Section - Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`group flex items-center px-5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FAAD00] text-white shadow-md transform scale-105 rounded-lg'
                    : 'text-gray-700 hover:text-[#FAAD00] hover:bg-transparent'
                }`}
              >
                <Icon className={`mr-3 h-4 w-4 transition-transform duration-200 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Right Section - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
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
            
            {/* Notifications Dropdown */}
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
                    const IconComponent = getNotificationIcon(notification.type);
                    return (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 border-b border-gray-50 transition-all duration-150 cursor-pointer ${
                          !notification.read ? 'bg-[#FAAD00]/5 border-l-4 border-l-[#FAAD00]' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${!notification.read ? 'bg-[#FAAD00]/10' : 'bg-gray-100'}`}>
                            <IconComponent className={`w-4 h-4 ${
                              notification.type === 'payment' ? 'text-green-500' :
                              notification.type === 'progress' ? 'text-blue-500' :
                              notification.type === 'message' ? 'text-purple-500' :
                              'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium text-gray-800 ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#FAAD00] rounded-full ml-2"></div>
                              )}
                            </div>
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

          {/* Profile Menu */}
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

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/5 to-transparent">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-600">{getRoleDisplayName(userRole)}</p>
                </div>
                <div className="py-2">
                  <a href="#profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] transition-all duration-150 font-medium">
                    My Profile
                  </a>
                  <a href="#settings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] transition-all duration-150 font-medium">
                    Settings
                  </a>
                  <a href="#help" className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] transition-all duration-150 font-medium">
                    Help & Support
                  </a>
                  <hr className="my-2 border-gray-100" />
                  <a href="#logout" className="block px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 font-medium">
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-sm ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`group flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FAAD00] text-white shadow-md rounded-lg'
                      : 'text-gray-700 hover:text-[#FAAD00] hover:bg-transparent'
                  }`}
                >
                  <Icon className={`mr-4 h-5 w-5 transition-transform duration-200 ${
                    isActive ? '' : 'group-hover:scale-110'
                  }`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

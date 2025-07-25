import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Home, Users, BarChart3, Clipboard,BadgeCheck, BookOpen, Shield,ChevronRight, Bell, MessageSquare, Settings, LogOut,Rocket,Loader, ShoppingCart, FileText, AlertCircle
} from 'lucide-react';

const Sidebar = ({ 
  userRole = 'QSOfficer', 
  activeItem = 'home',
  onNavigate,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const menuItems = {
    QSOfficer: [      { id: 'home', label: 'Home', icon: Home, path: '/qs', badge: null },
      { id: 'projects', label: 'Projects', icon: Rocket, path: '/qs/projects'},
      { id: 'purchasing', label: 'Purchasing', icon: ShoppingCart, path: '/qs/purchasing', badge: null },
      { id: 'boq', label: 'Bill Of Quantity', icon: BadgeCheck , path: '/qs/boq', badge: null },
      { id: 'request', label: 'Requests', icon: AlertCircle , path: '/qs/requests', badge: null },
      { id: 'notification', label: 'Notifications', icon: Bell, path: '/qs/notifications', badge: '12' },
      { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/qs/chat', badge: '5' }
    ]
  };

  const currentMenu = menuItems.QSOfficer;

  const handleItemClick = (item) => {
    if (onNavigate) {
      onNavigate(item.id, item.path);
    } else if (item.path) {
      navigate(item.path);
    }
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Example logout logic
    localStorage.clear();
    navigate('/'); 
  };

  const getRoleTitle = (role) => {
    const titles = {
      admin: 'Administration',
      Designer: 'Designer Portal',
      employee: 'Employee Portal',
      Example: 'example portal',
      QSOfficer: 'QS Officer Portal',
    };
    return titles[role] || 'Dashboard';
  };

  const sidebarWidth = (isDesktopHovered || isSidebarOpen) ? 'w-72' : 'w-20';

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out shadow-lg ml-20${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarWidth}`}
        onMouseEnter={() => setIsDesktopHovered(true)}
        onMouseLeave={() => {
          setIsDesktopHovered(false);
          setHoveredItem(null);
        }}
      >
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/5 to-white transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FAAD00] to-[#FAAD00]/80 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {userRole.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className={`transition-all duration-300 ${
              (isDesktopHovered || isSidebarOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:opacity-0 lg:-translate-x-4'
            }`}>
              <h2 className="text-gray-800 font-bold text-lg whitespace-nowrap">{getRoleTitle(userRole)}</h2>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-2">
            {currentMenu.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;
              const isItemHovered = hoveredItem === item.id;
              const isExpanded = isDesktopHovered || isSidebarOpen;

              return (
                <div key={item.id} className="relative">
                  {!isExpanded && isItemHovered && window.innerWidth >= 1024 && (
                    <div className="absolute left-20 top-1/2 transform -translate-y-1/2 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg pointer-events-none">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-[#FAAD00] text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}

                  <button
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group w-full flex items-center rounded-xl text-left transition-all duration-300 ${
                        isExpanded ? 'px-4 py-4 justify-between' : 'px-3 py-3 justify-center'
                    } ${
                        isActive
                        ? 'bg-gradient-to-r from-[#FAAD00] to-[#FAAD00]/90 text-white shadow-lg shadow-[#FAAD00]/25 scale-105'
                        : 'text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] hover:scale-105'
                    }`}
                    >
                    <div className={`flex items-center ${!isExpanded ? 'justify-center w-full' : ''}`}>
                      <div className={`flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0 ${
                        isExpanded ? 'w-10 h-10 mr-4' : 'w-12 h-12'
                      } ${
                        isActive
                        ? 'bg-white/20 backdrop-blur-sm'
                        : isExpanded 
                            ? 'bg-gray-100 group-hover:bg-[#FAAD00]/20' 
                            : 'bg-gray-50 group-hover:bg-[#FAAD00]/10 border border-gray-200 group-hover:border-[#FAAD00]/30'
                      }`}>
                        <IconComponent className={`transition-all duration-300 ${
                          isExpanded ? 'w-5 h-5' : 'w-6 h-6'
                        } ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-[#FAAD00]'}`} />
                      </div>

                      <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                      }`}>
                        {item.label}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs font-bold rounded-full transition-colors duration-300 ${
                            isActive
                              ? 'bg-white/20 text-white backdrop-blur-sm'
                              : 'bg-[#FAAD00] text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                          isActive ? 'rotate-90 text-white' : 'text-gray-400 group-hover:text-[#FAAD00]'
                        }`} />
                      </div>
                    )}
                    {!isExpanded && item.badge && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FAAD00] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">!</span>
                      </div>
                    )}
                  </button>

                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#FAAD00] rounded-r-full shadow-lg"></div>
                  )}
                </div>
              );
            })}

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className={`group w-full flex items-center rounded-xl text-left transition-all duration-300 ${
                  isDesktopHovered || isSidebarOpen ? 'px-4 py-4 justify-start' : 'px-3 py-3 justify-center'
                } text-red-600 hover:bg-red-50 hover:text-red-700`}
              >
                <div className={`flex items-center ${!isSidebarOpen && !isDesktopHovered ? 'justify-center w-full' : ''}`}>
                  <div className="flex items-center justify-center rounded-lg bg-red-100 group-hover:bg-red-200 w-10 h-10 mr-4">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                    isSidebarOpen || isDesktopHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                  }`}>
                    Logout
                  </span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        <div className={`p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white transition-all duration-300 ${
          (isDesktopHovered || isSidebarOpen) ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">StructuraX v2.0</p>
            <p className="text-xs text-gray-400">© 2024 All rights reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

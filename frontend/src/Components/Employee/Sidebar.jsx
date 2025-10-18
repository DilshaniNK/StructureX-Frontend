import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import Projects from '@mui/icons-material/FolderOpenOutlined';
import Payments from '@mui/icons-material/ReceiptOutlined';
import Labors from '@mui/icons-material/Groups2Outlined';
import Calendar from '@mui/icons-material/CalendarMonthOutlined';
import Materials from '@mui/icons-material/HandymanOutlined';
import Inventory from '@mui/icons-material/Inventory2Outlined';
import TodoList from '@mui/icons-material/ListAltOutlined';

import {
  Home, Users, BarChart3, BookmarkCheck, ClipboardPenLine, UserRoundSearch, Clipboard, BadgeCheck, BookOpen, Shield, ChevronRight, Bell, MessageSquare, Settings, LogOut, Rocket, Loader, FileText, Truck, Package, Receipt, FolderOpen, User, MapPin, X
} from 'lucide-react';

const Sidebar = ({
  userRole = 'Designer',
  activeItem = 'home',
  onNavigate,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const { employeeId } = useParams(); //get employeeId from URL params
  const { supplierId } = useParams();


  const menuItems = {
    Designer: [
      { id: 'home', label: 'Home', icon: Home, path: `/designer/${employeeId}/home`, badge: null },
      { id: 'initialize', label: 'Project Initialization', icon: Rocket, path: `/designer/${employeeId}/initialize` },
      { id: 'ongoing', label: 'Ongoing Projects', icon: Loader, path: `/designer/${employeeId}/ongoing`, badge: null },
      { id: 'completed', label: 'Completed Projects', icon: BadgeCheck, path: `/designer/${employeeId}/completed`, badge: null },
      { id: 'notification', label: 'Notifications', icon: Bell, path: `/designer/${employeeId}/notifications`, badge: '12' },
      { id: 'chat', label: 'Chat', icon: MessageSquare, path: `/designer/${employeeId}/chat`, badge: '5' }
    ],

    Project_Manager: [
      { id: 'home', label: 'Home', icon: Home, path: `/projectmanager/${employeeId}/home/`, badge: null },
      { id: 'dailyupdates', label: 'Daily Updates', icon: Rocket, path: `/projectmanager/${employeeId}/dailyupdates`, badge: null },
      { id: 'projects', label: 'Projects', icon: Loader, path: `/projectmanager/${employeeId}/projects`, badge: null },
      { id: 'materials', label: 'Materials', icon: BadgeCheck, path: `/projectmanager/${employeeId}/materials`, badge: null },
      { id: 'sitevisitlogs', label: 'Site Visit Logs', icon: BookmarkCheck, path: `/projectmanager/${employeeId}/sitevisitlogs`, badge: null },
      { id: 'todolist', label: 'Todo List', icon: ClipboardPenLine, path: `/projectmanager/${employeeId}/todolist`, badge: null },
      { id: 'chat', label: 'Chat', icon: UserRoundSearch, path: `/projectmanager/${employeeId}/chat`, badge: null },
    ],

    FinancialOfficer: [
      { id: 'home', label: 'Home', icon: Home, path: `/financial_officer/${employeeId}/home`, badge: null },
      { id: 'projects', label: 'Projects', icon: Projects, path: `/financial_officer/${employeeId}/projects` },
      { id: 'payments', label: 'Payments', icon: Payments, path: `/financial_officer/${employeeId}/payments`, badge: null },
      { id: 'calendar', label: 'Calendar', icon: Calendar, path: `/financial_officer/${employeeId}/calendar`, badge: null },
      { id: 'daily labors', label: 'Daily Labors', icon: Labors, path: `/financial_officer/${employeeId}/daily_labors`, badge: '12' },
      { id: 'settings', label: 'Settings', icon: Settings, path: `/financial_officer/${employeeId}/settings`, badge: '5' }
    ],
    Legal_Officer: [

      { id: 'home', label: 'Home', icon: Home, path: `/legalofficer/${employeeId}/home`, badge: null },
      { id: 'action', label: 'Action', icon: Loader, path: `/legalofficer/${employeeId}/action`, badge: null },
      { id: 'chat', label: 'Chat', icon: UserRoundSearch, path: `/legalofficer/${employeeId}/chat`, badge: null },

    ],
    Site_Supervisor: [
      { id: 'home', label: 'Home', icon: Home, path: `/site_supervisor/${employeeId}`, badge: null },
      { id: 'projects', label: 'Projects', icon: Projects, path: `/site_supervisor/${employeeId}/projects` },
      { id: 'labors', label: 'Labors', icon: Labors, path: `/site_supervisor/${employeeId}/labors`, badge: null },
      { id: 'progress', label: 'Progress', icon: BadgeCheck, path: `/site_supervisor/${employeeId}/progress`, badge: null },
      { id: 'materials', label: 'Materials', icon: Materials, path: `/site_supervisor/${employeeId}/materials`, badge: '12' },
      { id: 'inventory', label: 'Inventory', icon: Inventory, path: `/site_supervisor/${employeeId}/inventory`, badge: '5' },
      { id: 'to do', label: 'To-Do', icon: TodoList, path: `/site_supervisor/${employeeId}/to-do`, badge: '5' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, path: `/site_supervisor/${employeeId}/calendar`, badge: null },
      { id: 'settings', label: 'Settings', icon: Settings, path: `/site_supervisor/${employeeId}/settings`, badge: '5' }
    ],
    Supplier: [
      { id: 'home', label: 'Home', icon: Home, path: `/supplier/${supplierId}/home`, badge: null },
      { id: 'catalogue', label: 'Product Catalogue', icon: Projects, path: `/supplier/${supplierId}/catalogue` },
      { id: 'quotations', label: 'Quotations', icon: FileText, path: `/supplier/${supplierId}/quotations`, badge: null },
      { id: 'orders', label: 'Material Orders', icon: Materials, path: `/supplier/${supplierId}/orders`, badge: '12' },
      { id: 'delivery', label: 'Delivery Information', icon: Truck, path: `/supplier/${supplierId}/delivery`, badge: '5' },
      { id: 'payments', label: 'Payments', icon: Payments, path: `/supplier/${supplierId}/payments`, badge: '10' },
      { id: 'shistory', label: 'Supply History', icon: Package, path: `/supplier/${supplierId}/shistory`, badge: '5' },
      { id: 'invoices', label: 'Invoices', icon: Receipt, path: `/supplier/${supplierId}/invoices`, badge: null },
      { id: 'messages', label: 'Messages', icon: MessageSquare, path: `/supplier/${supplierId}/messages`, badge: null }
    ],
    Director: [

      { id: 'home', label: 'Home', icon: Home, path: `/director/home`, badge: null },
      { id: 'projects', label: 'Projects', icon: FolderOpen, path: `/director/projects` },
      { id: 'teammanagment', label: 'Team Management', icon: User, path: `/director/teammanagment` },
      { id: 'sitevisit', label: 'Site Visite', icon: MapPin, path: `/director/sitevisit` },
      { id: 'inventory', label: 'Inventory', icon: Package, path: `/director/inventory` },
      { id: 'documents', label: 'Documents', icon: FileText, path: `/director/documents` },



    ]
  };

  const currentMenu = menuItems[userRole] || menuItems.Designer;

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
    localStorage.clear();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const getRoleTitle = (role) => {
    const titles = {
      admin: 'Administration',
      Designer: 'Designer Portal',
      employee: 'Employee Portal',
      Example: 'example portal'
    };
    return titles[role] || 'Dashboard';
  };

  const sidebarWidth = (isDesktopHovered || isSidebarOpen) ? 'w-72' : 'w-20';

  return (
    <>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-8 m-4 max-w-md w-full transform transition-all duration-500 scale-100 opacity-100">

            {/* Animated Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 via-red-50 to-red-100 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-700 hover:scale-110 hover:rotate-3">
                  <div className="absolute inset-0 bg-red-500/10 rounded-2xl animate-pulse"></div>
                  <LogOut className="w-8 h-8 text-red-600 relative z-10 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-ping">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 hover:rotate-90 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Enhanced Content */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Confirm Logout
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-300 mx-auto rounded-full mb-4"></div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Are you sure you want to logout from your account?
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You'll need to sign in again to access your dashboard.
              </p>
            </div>

            {/* Interactive Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-4 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-200 hover:border-gray-300 hover:translate-y-[-2px]"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-4 text-white bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg shadow-red-500/25 hover:translate-y-[-2px]"
              >
                <span className="flex items-center justify-center space-x-2">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </span>
              </button>
            </div>

            {/* Subtle Footer Animation */}
            <div className="mt-6 text-center">
              <div className="flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-sm border-r border-gray-200 z-40 transition-all duration-300 ease-in-out shadow-lg ${sidebarWidth} flex flex-col overflow-hidden flex flex-col`}
        onMouseEnter={() => setIsDesktopHovered(true)}
        onMouseLeave={() => {
          setIsDesktopHovered(false);
          setHoveredItem(null);
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FAAD00]/8 via-[#FAAD00]/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAAD00]/10 to-transparent opacity-50"></div>
          <div className="flex items-center space-x-3 relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FAAD00] via-[#FAAD00]/90 to-[#FAAD00]/80 rounded-2xl flex items-center justify-center shadow-lg shadow-[#FAAD00]/25 flex-shrink-0 ring-2 ring-[#FAAD00]/20">
              <span className="text-white font-bold text-base tracking-wide">
                {userRole.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className={`transition-all duration-300 ${(isDesktopHovered || isSidebarOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:opacity-0 lg:-translate-x-4'
              }`}>
              <h2 className="text-gray-800 font-bold text-xl whitespace-nowrap tracking-tight">
                {getRoleTitle(userRole)}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#FAAD00] to-[#FAAD00]/50 rounded-full mt-1"></div>
            </div>
          </div>
        </div>

        {/* Navigation Items - Scrollable Area */}
        {/* Added hide-scrollbar class for universal scrollbar hiding */}
        <div className="flex-1 overflow-y-auto px-3 hide-scrollbar">
          <nav className="space-y-1 pb-40 lg:pb-32">
            <div className="space-y-1 pb-40 lg:pb-32">
              {currentMenu.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;
                const isItemHovered = hoveredItem === item.id;
                const isExpanded = isDesktopHovered || isSidebarOpen;

                return (
                  <div key={item.id} className="relative group">
                    {/* Tooltip for collapsed state */}
                    {!isExpanded && isItemHovered && window.innerWidth >= 1024 && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap shadow-2xl pointer-events-none transition-all duration-200">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs bg-[#FAAD00] text-white rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}

                    <button
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`group w-full flex items-center rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${isExpanded ? 'px-3 lg:px-4 py-2 lg:py-3 justify-between' : 'px-2 lg:px-3 py-2 lg:py-3 justify-center'
                        } ${isActive
                          ? 'bg-gradient-to-r from-[#FAAD00] via-[#FAAD00]/95 to-[#FAAD00]/90 text-white shadow-lg shadow-[#FAAD00]/30 scale-[1.02] border border-[#FAAD00]/20'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#FAAD00]/10 hover:to-[#FAAD00]/5 hover:text-[#FAAD00] hover:scale-[1.01] hover:shadow-md hover:shadow-[#FAAD00]/10'
                        }`}
                    >
                      {/* Active indicator line */}
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FAAD00] rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}></div>

                      <div className={`flex items-center ${!isExpanded ? 'justify-center w-full' : ''}`}>
                        <div className={`flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0 ${isExpanded ? 'w-8 h-8 lg:w-11 lg:h-11 mr-2 lg:mr-4' : 'w-10 h-10 lg:w-12 lg:h-12'
                          } ${isActive
                            ? 'bg-white/20 backdrop-blur-sm shadow-inner'
                            : isExpanded
                              ? 'bg-gray-100 group-hover:bg-[#FAAD00]/20 shadow-sm'
                              : 'bg-gray-50 group-hover:bg-[#FAAD00]/15 border border-gray-200 group-hover:border-[#FAAD00]/30 shadow-sm'
                          }`}>
                          <IconComponent className={`transition-all duration-300 ${isExpanded ? 'w-4 h-4 lg:w-5 lg:h-5' : 'w-5 h-5 lg:w-6 lg:h-6'
                            } ${isActive ? 'text-white drop-shadow-sm' : 'text-gray-700 group-hover:text-[#FAAD00]'
                            }`} />
                        </div>

                        <span className={`font-semibold text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0 block' : 'opacity-0 -translate-x-4 w-0 overflow-hidden hidden lg:block'
                          }`}>
                          {item.label}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 shadow-sm ${isActive
                                ? 'bg-white/25 text-white backdrop-blur-sm border border-white/20'
                                : 'bg-[#FAAD00] text-white shadow-[#FAAD00]/25'
                              }`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'rotate-90 text-white' : 'text-gray-400 group-hover:text-[#FAAD00]'
                            }`} />
                        </div>
                      )}

                      {/* Badge indicator for collapsed state */}
                      {!isExpanded && item.badge && (
                        <div className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 bg-[#FAAD00] rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-pulse">
                          <span className="text-[8px] lg:text-[9px] text-white font-bold">•</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Fixed Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
          {/* Logout Button */}
          <div className="p-2 lg:p-3">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`group w-full flex items-center rounded-2xl text-left transition-all duration-300 ${isDesktopHovered || isSidebarOpen ? 'px-3 lg:px-4 py-2 lg:py-3 justify-start' : 'px-2 lg:px-3 py-2 lg:py-3 justify-center'
                } text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-[1.01] hover:shadow-md hover:shadow-red-500/10`}
            >
              <div className={`flex items-center ${!isSidebarOpen && !isDesktopHovered ? 'justify-center w-full' : ''}`}>
                <div className="flex items-center justify-center rounded-xl bg-red-100 group-hover:bg-red-200 w-8 h-8 lg:w-11 lg:h-11 mr-0 lg:mr-4 shadow-sm transition-all duration-300">
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <span className={`font-semibold text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ml-3 lg:ml-0 ${isSidebarOpen || isDesktopHovered ? 'opacity-100 translate-x-0 block' : 'opacity-0 -translate-x-4 w-0 overflow-hidden hidden lg:block'
                  }`}>
                  Logout
                </span>
              </div>
            </button>
          </div>

          {/* Version Footer */}
          <div className={`p-2 lg:p-4 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent transition-all duration-300 ${(isDesktopHovered || isSidebarOpen) ? 'opacity-100 block' : 'opacity-0 hidden lg:block'
            }`}>
            <div className="text-center space-y-1">
              <p className="text-[10px] lg:text-xs text-gray-600 font-semibold tracking-wide">StructuraX v2.0</p>
              <p className="text-[9px] lg:text-xs text-gray-400 font-medium">© 2025 All rights reserved</p>
              <div className="w-8 lg:w-12 h-0.5 bg-gradient-to-r from-[#FAAD00] to-transparent mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

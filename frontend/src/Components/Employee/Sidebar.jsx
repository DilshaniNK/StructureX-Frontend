import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import Projects from '@mui/icons-material/FolderOpenOutlined';
import Payments from '@mui/icons-material/ReceiptOutlined';
import Labors from '@mui/icons-material/Groups2Outlined';
import Calendar from '@mui/icons-material/CalendarMonthOutlined';
import Materials from '@mui/icons-material/HandymanOutlined';
import Inventory from '@mui/icons-material/Inventory2Outlined';
import TodoList from '@mui/icons-material/ListAltOutlined';
// ADDED this import


import { 
  Home, Users, BarChart3,ChartSpline ,BookmarkCheck ,ClipboardPenLine ,UserRoundSearch , Clipboard,BadgeCheck, BookOpen, Shield,ChevronRight, Bell, MessageSquare, Settings, LogOut,Rocket,Loader, FileText, Truck, Package, Receipt, icons,FolderOpen,User,MapPin
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
  const navigate = useNavigate();
  const location = useLocation();

   const { employeeId } = useParams(); //get employeeId from URL params

  const menuItems = {
    Example: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', badge: null },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/profile', badge: null },
      { id: 'users', label: 'User Management', icon: Users, path: '/users', badge: '12' },
      { id: 'security', label: 'Security', icon: Shield, path: '/security', badge: null },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', badge: null }
    ],
    Designer: [
      { id: 'home', label: 'Home', icon: Home, path: '/designer/home', badge: null },
      { id: 'initialize', label: 'Project Initialization', icon: Rocket, path: '/designer/initialize' },
      { id: 'ongoing', label: 'Ongoing Projects', icon: Loader, path: '/designer/ongoing', badge: null },
      { id: 'completed', label: 'Completed Projects', icon: BadgeCheck, path: '/designer/completed', badge: null },
      { id: 'notification', label: 'Notifications', icon: Bell, path: '/designer/notifications', badge: '12' },
      { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/designer/chat', badge: '5' }
    ],

    Project_Manager: [
      { id: 'home', label: 'Home', icon: Home, path: '/projectmanager/home', badge: null },
      { id: 'dailyupdates', label: 'Daily Updates', icon: Rocket, path: '/projectmanager/dailyupdates', badge: null },
      { id: 'projects', label: 'Projects', icon: Loader, path: '/projectmanager/projects', badge: null },
      { id: 'materials', label: 'Materials', icon: BadgeCheck, path: '/projectmanager/materials', badge: null },
      { id: 'sitevisitlogs', label: 'Site Visit Logs', icon: BookmarkCheck, path: '/projectmanager/sitevisitlogs', badge: null },
      { id: 'todolist', label: 'Todo List', icon: ClipboardPenLine, path: '/projectmanager/todolist', badge: null },
      { id: 'chat', label: 'Chat', icon: UserRoundSearch, path: '/projectmanager/chat', badge: null },
    ],

    FinancialOfficer: [
      { id: 'home', label: 'Home', icon: Home, path: '/financial_officer/home', badge: null },
      { id: 'projects', label: 'Projects', icon: Projects, path: '/financial_officer/projects' },
      { id: 'payments', label: 'Payments', icon: Payments, path: '/financial_officer/payments', badge: null },

      { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/financial_officer/calendar', badge: null },
      { id: 'daily labors', label: 'Daily Labors', icon: Labors, path: '/financial_officer/daily_labors', badge: '12' },

      { id: 'settings', label: 'Settings', icon: Settings, path: '/financial_officer/settings', badge: '5' }
    ],
    Legal_Officer: [
      { id: 'home', label: 'Home', icon: Home, path: '/legalofficer/dashboard', badge: null },
    ],
    Site_Supervisor: [
      { id: 'home', label: 'Home', icon: Home, path: '/site_supervisor/home', badge: null },
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
      { id: 'home', label: 'Home', icon: Home, path: '/supplier/home', badge: null },
      { id: 'catalogue', label: 'Product Catalogue', icon: Projects, path: '/supplier/catalogue'},
      { id: 'quotations', label: 'Quotations', icon: FileText, path: '/supplier/quotations', badge: null },
      { id: 'orders', label: 'Material Orders', icon: Materials, path: '/supplier/orders', badge: '12' },
      { id: 'delivery', label: 'Delivery Information', icon: Truck, path: '/supplier/delivery', badge: '5' },
      { id: 'payments', label: 'Payments', icon: Payments, path: '/supplier/payments', badge: '10' },
      { id: 'shistory', label: 'Supply History', icon: Package, path: '/supplier/shistory', badge: '5' },
      { id: 'invoices', label: 'Invoices', icon: Receipt, path: '/supplier/invoices', badge: null },
      { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/supplier/messages', badge: null }
    ],
    Director: [
      { id: 'home', label: 'Home', icon: Home, path: '/director/home', badge: null},
      { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/director/projects'},
      { id: 'teammanagment', label: 'Team Management', icon: User, path: '/director/teammanagment'},
      { id: 'sitevisit', label: 'Site Visite', icon: MapPin, path: '/director/sitevisit'},
      { id: 'inventory', label: 'Inventory', icon: Package, path: '/director/inventory'},
      { id: 'documents', label: 'Documents', icon: FileText, path: '/director/documents'},


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
    // Example logout logic
    localStorage.clear();
    navigate('/');
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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out shadow-lg ml-20${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
            <div className={`transition-all duration-300 ${(isDesktopHovered || isSidebarOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:opacity-0 lg:-translate-x-4'
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
                    className={`group w-full flex items-center rounded-xl text-left transition-all duration-300 ${isExpanded ? 'px-4  justify-between' : 'px-3  justify-center'
                      } ${isActive
                        ? 'bg-gradient-to-r from-[#FAAD00] to-[#FAAD00]/90 text-white shadow-lg shadow-[#FAAD00]/25 scale-105'
                        : 'text-gray-700 hover:bg-[#FAAD00]/10 hover:text-[#FAAD00] hover:scale-105'
                      }`}
                  >
                    <div className={`flex items-center ${!isExpanded ? 'justify-center w-full' : ''}`}>
                      <div className={`flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0 ${isExpanded ? 'w-10 h-10 mr-4' : 'w-12 h-12'
                        } ${isActive
                          ? 'bg-white/20 backdrop-blur-sm'
                          : isExpanded
                            ? 'bg-gray-100 group-hover:bg-[#FAAD00]/20'
                            : 'bg-gray-50 group-hover:bg-[#FAAD00]/10 border border-gray-200 group-hover:border-[#FAAD00]/30'
                        }`}>
                        <IconComponent className={`transition-all duration-300 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'
                          } ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-[#FAAD00]'}`} />
                      </div>

                      <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                        }`}>
                        {item.label}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs font-bold rounded-full transition-colors duration-300 ${isActive
                              ? 'bg-white/20 text-white backdrop-blur-sm'
                              : 'bg-[#FAAD00] text-white'
                            }`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'rotate-90 text-white' : 'text-gray-400 group-hover:text-[#FAAD00]'
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
                className={`group w-full flex items-center rounded-xl text-left transition-all duration-300 ${isDesktopHovered || isSidebarOpen ? 'px-4 py-4 justify-start' : 'px-3 py-3 justify-center'
                  } text-red-600 hover:bg-red-50 hover:text-red-700`}
              >
                <div className={`flex items-center ${!isSidebarOpen && !isDesktopHovered ? 'justify-center w-full' : ''}`}>
                  <div className="flex items-center justify-center rounded-lg bg-red-100 group-hover:bg-red-200 w-10 h-10 mr-4">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isSidebarOpen || isDesktopHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                    }`}>
                    Logout
                  </span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        <div className={`p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white transition-all duration-300 ${(isDesktopHovered || isSidebarOpen) ? 'opacity-100' : 'opacity-0'
          }`}>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">StructuraX v2.0</p>
            <p className="text-xs text-gray-400">© 2025 All rights reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

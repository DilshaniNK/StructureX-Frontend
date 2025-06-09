import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../assets/logo.png';
import name from '../../assets/name.png';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import EngineeingIcon from '@mui/icons-material/Engineering';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // by default sidebar is open

  const toggleSidebar = () => { // toggle between states
    setSidebarOpen(!sidebarOpen);
  };

  const links = [
    { path: '/financial_officer/dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/financial_officer/projects', name: 'Projects', icon: <FolderIcon /> },
    { path: '/financial_officer/payments', name: 'Payments', icon: <PaymentIcon /> },
    { path: '/financial_officer/calendar', name: 'Calendar', icon: <CalendarTodayIcon /> },
    { path: '/financial_officer/labors', name: 'Daily Labors', icon: <EngineeingIcon /> },
    { path: '/financial_officer/reports', name: 'Reports', icon: <AssessmentIcon /> },
    { path: '/financial_officer/settings', name: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-60' : 'w-16'   // width changes based on sidebar state
        } bg-white transition-all duration-300 ease-in-out shadow-md h-full`}
      >
        <div className="flex items-center justify-center h-16">
          {sidebarOpen ? (
            <img src={name} alt="Full Logo" className="h-14 p-2" />  // full name when sidebar open
          ) : (
            <img src={logo} alt="Mini Logo" className="h-8" />  //only small logo  when sidebar collapsed
          )}
        </div>

        <nav className="p-3 space-y-2 ">
      {links.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded font-semibold text-sm text-black hover:bg-black hover:text-amber-500 ${
              isActive ? 'bg-amber-500 text-black' : ''
            }`
          }
        >
          <div className="text-lg">
            {sidebarOpen ? item.icon : item.icon} {/*if sidebar collapse then display only the icon*/}
          </div>
          <span className={`${sidebarOpen ? 'inline' : 'hidden'}`}>
            {item.name}
          </span>
        </NavLink>
      ))}
    </nav>
      </div>


      {/*Top bar*/}
      <div className="flex flex-col flex-1 overflow-hidden">
       
        <header className="flex items-center justify-between h-16 bg-white px-4 shadow-md">
          <button
            className="text-gray-700"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          

          <div className="flex items-center space-x-4">
            <div className="relative">
              <NotificationsActiveIcon className="text-gray-700" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>
            <img
              src={logo}
              alt="User Avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </div>
        </header>

         
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

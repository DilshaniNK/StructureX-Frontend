import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
// import Sidebar from '../../Components/Employee/Sidebar';
import Main from './Dashboard';

import Notification from '../../Components/Employee/Notification'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Legal_Officer'; 
  const userName = 'Ramesh Peshala';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/legal_officer/dashboard') || path === '/') return 'dashboard';
    if (path.includes('/legal_officer/notifications')) return 'notifications';
    return 'home'; // default
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userRole={userRole}
        userName={userName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
{/* 
      <Sidebar
        userRole={userRole}
        activeItem={getActiveItem()}
        onNavigate={handleSidebarNavigate}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      /> */}

      {/* Main content area - adjusted for sidebar */}
      <div className="pt-16 ml-20 transition-all duration-300">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/dashboard" element={<Main />} />
            <Route path="/notifications" element={<Notification />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
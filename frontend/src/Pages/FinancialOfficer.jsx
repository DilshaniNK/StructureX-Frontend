import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Components/Employee/Navbar';
import Sidebar from '../Components/Employee/Sidebar';

import Dashboard from './Financial_officer/Dashboard';
import Projects from './Financial_officer/Projects'
import ProjectDetails from './Financial_officer/ProjectDetails';
import Calendar from './Financial_officer/Calender';
import Labors from './Financial_officer/Labors';
import Payments from './Financial_officer/Payments';

export default function Financial_officer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'FinancialOfficer'; // Change this based on your user's actual role
  const userName = 'Amila';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/financial_officer/home') || path === '/') return 'home';
    if (path.includes('/financial_officer/projects')) return 'projects';
    if (path.includes('/financial_officer/project_details')) return 'prohect_details';
    if (path.includes('/financial_officer/calendar')) return 'calendar';
    if (path.includes('/financial_officer/payments')) return 'payments';
    if (path.includes('/financial_officer/daily_labors')) return 'labors';
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
      
      <Sidebar 
        userRole={userRole}
        activeItem={getActiveItem()}
        onNavigate={handleSidebarNavigate}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Main content area - adjusted for sidebar */}
      <div className="pt-16 ml-20 transition-all duration-300">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project_details" element={<ProjectDetails />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/daily_labors" element={<Labors/>} />
            <Route path="/calendar" element={<Calendar/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
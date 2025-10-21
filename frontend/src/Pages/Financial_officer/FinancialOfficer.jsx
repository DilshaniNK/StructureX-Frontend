import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation,useParams } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
import Sidebar from '../../Components/Employee/Sidebar';

import Dashboard from './Dashboard';
import Projects from './Projects'
import ProjectDetails from './ProjectDetails';
import Calendar from './Calender';
import Labors from './Labors';
import Payments from './Payments';
import PettyCash from './PettyCash';
import Profile from '../../Components/Employee/Profile';

export default function Financial_officer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'FinancialOfficer'; // Change this based on your user's actual role
  const userName = 'Amila';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };
  const { employeeId } = useParams(); //fetch employeeId from url

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/home') || path === '/') return 'home';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/project_details')) return 'prohect_details';
    if (path.includes('/calendar')) return 'calendar';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/daily_labors')) return 'labors';
    if (path.includes('/petty_cash')) return 'petty_cash';
    if (path.includes('/profile')) return 'profile';
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
            <Route path="/petty_cash" element={<PettyCash/>} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
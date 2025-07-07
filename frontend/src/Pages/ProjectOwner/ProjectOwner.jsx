import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../Components/ProjectOwner/Navbar';

import Dashboard from './Dashboard';
import Project from './Project';
import Materials from './Materials';
import Messages from './Messages';
import Payments from './Payments';

export default function ProjectOwner() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [user, setUser] = useState({
    role: 'ProjectOwner',
    name: 'Thagshan'
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/project_owner/dashboard')) return 'dashboard';
    if (path.includes('/project_owner/project')) return 'project';
    if (path.includes('/project_owner/materials')) return 'materials';
    if (path.includes('/project_owner/messages')) return 'communications';
    if (path.includes('/project_owner/payments')) return 'payments';
    return 'dashboard'; // default
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userRole={user.role}
        userName={user.name}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={getActiveTab()}
        setActiveTab={setActiveTab}
      />
      
      <div className="pt-12 transition-all duration-300">
        <div className="p-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project" element={<Project />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

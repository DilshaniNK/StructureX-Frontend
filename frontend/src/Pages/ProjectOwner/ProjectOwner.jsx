import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation,useParams } from 'react-router-dom';
import Navbar from '../../Components/ProjectOwner/Navbar';

import Dashboard from './Dashboard';
import Project from './Project';
import Materials from './Materials';
import Messages from './Messages';
import Payments from './Payments';
import Profile from '../../Components/Employee/Profile';

export default function ProjectOwner() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [user, setUser] = useState({
    role: 'Project_Owner',
    name: 'Thagshan'
  });
 

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { clientId } = useParams();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/project')) return 'project';
    if (path.includes('/materials')) return 'materials';
    if (path.includes('/messages')) return 'communications';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/profile')) return 'profile';
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
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

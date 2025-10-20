import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
import Sidebar from '../../Components/Employee/Sidebar';
import Main from './Dashboard';

import Notification from '../../Components/Employee/Notification'
import Chat from './Chat';
import ProjectDetails from './ProjectDetails';
import ProjectList from './ProjectList';
import Profile from '../../Components/Employee/Profile';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Legal_Officer';
  const userName = 'Ramesh Peshala';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };

  const {employeeId} = useParams()

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;

    if (path.includes('/dashboard') || path === '/') return 'dashboard';
    if (path.includes('/chat')) return 'chat';
    if (path.includes('/notifications')) return 'notifications';
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
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<Main />} />
            <Route path='/action' element={<ProjectList />} />
            <Route path='/action/:projectId' element={<ProjectDetails 
              projectId={location.pathname.split('/').pop()} 
              user={{ name: userName, role: userRole }}
              onBack={() => navigate('/legalofficer/action')}
            />} />
            <Route path='/chat' element={<Chat />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
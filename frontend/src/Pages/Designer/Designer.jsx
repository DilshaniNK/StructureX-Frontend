import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
import Sidebar from '../../Components/Employee/Sidebar';
import Main from './Home'
import ProjectInitializer from './ProjectInitialize';
import OngoingProjects from './OngoingProjects';
import Chat from './Chat';
import CompletedProjects from './CompletedProjects';
import Notification from '../../Components/Employee/Notification'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Designer';
  const userName = 'John Doe';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/designer/home') || path === '/') return 'home';
    if (path.includes('/designer/initialize')) return 'initialize';
    if (path.includes('/designer/ongoing')) return 'ongoing';
    if (path.includes('/designer/completed')) return 'completed';
    if (path.includes('/designer/chat')) return 'chat';
    if (path.includes('/designer/notifications')) return 'notifications';
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
      <div className="pt-15 ml-20 transition-all duration-300">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<Main />} />
            <Route path="/initialize" element={<ProjectInitializer />} />
            <Route path="/ongoing" element={<OngoingProjects />} />
            <Route path="/completed" element={<CompletedProjects />} />
            <Route path="/notifications" element={<Notification/>} />
            <Route path="/chat" element={<Chat/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
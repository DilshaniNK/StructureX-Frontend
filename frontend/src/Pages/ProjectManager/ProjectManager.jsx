import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
import Sidebar from '../../Components/Employee/Sidebar';
import Main from './Home';
import DailyUpdates from './DailyUpdates';
import FinancialStatus from './FinancialStatus';
import Materials from './Materials';
import ProjectProgress from './ProjectProgress';
import SiteVisitLogs from './SiteVisitLogs';
import TodoList from './TodoList';
import Chat from './Chat';

import Notification from '../../Components/Employee/Notification'
import Projectdetails from './Projectdetails';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Project_Manager';
  const userName = 'Ramesh Peshala';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/project_manager/home') || path === '/') return 'home';
    if (path.includes('/project_manager/dailyupdates')) return 'dailyupdates';
    if (path.includes('/project_manager/financialstatus')) return 'financialstatus';
    if (path.includes('/project_manager/materials')) return 'materials';
    if (path.includes('/project_manager/projectprogress')) return 'projectprogress';
    if (path.includes('/project_manager/sitevisitlogs')) return 'sitevisitlogs';
    if (path.includes('/project_manager/todolist')) return 'todolist';
    if (path.includes('/project_manager/chat')) return 'chat';
    if (path.includes('/project_manager/projectdetails')) return 'projectdetails';
    if (path.includes('/project_manager/notifications')) return 'notifications';
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
            <Route path="/dailyupdates" element={<DailyUpdates />} />
            <Route path="/financialstatus" element={<FinancialStatus />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/projectprogress" element={<ProjectProgress />} />
            <Route path="/sitevisitlogs" element={<SiteVisitLogs />} />
            <Route path="/todolist" element={<TodoList />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/projectdetails" element={<Projectdetails />} />
            {/* Add more routes as needed */}

          </Routes>
        </div>
      </div>
    </div>
  );
}
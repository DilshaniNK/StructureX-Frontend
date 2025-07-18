import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation ,useParams} from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
import Sidebar from '../../Components/Employee/Sidebar';

import Dashboard from './Dashboard';
import Projects from './Projects'
import ProjectDetails from './ProjectDetails';
import Progress from './Progress';
import Labors from './Labors';
import Materials from './Materials';
import Inventory from './Inventory';
import Todo from './Todo';
import S_calendar from './Calendar';

export default function SiteSupervisor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Site_Supervisor'; // Change this based on your user's actual role
  const userName = 'Nadun';
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };
  const { employeeId } = useParams();

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes(`/site_supervisor/${employeeId}`) || path === '/') return 'home';
    if (path.includes(`/site_supervisor/${employeeId}/projects`)) return 'projects';
    if (path.includes('/site_supervisor/project_details')) return 'project_details';
    if (path.includes('/site_supervisor/to-do')) return 'to do';
    if (path.includes('/site_supervisor/progress')) return 'progress';
    if (path.includes('/site_supervisor/labors')) return 'labors';
    if (path.includes('/site_supervisor/materials')) return 'materials';
    if (path.includes('/site_supervisor/inventory')) return 'inventory';
    if (path.includes('/site_supervisor/calendar')) return 'S_calendar';
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
            <Route path="/progress" element={<Progress />} />
            <Route path="/labors" element={<Labors/>} />
            <Route path="/to-do" element={<Todo/>} />
            <Route path="/calendar" element={<S_calendar/>} />
            <Route path="/materials" element={<Materials/>} />
            <Route path="/inventory" element={<Inventory/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
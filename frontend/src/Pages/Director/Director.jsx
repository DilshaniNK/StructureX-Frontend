import React, { useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar'
import Sidebar from '../../Components/Employee/Sidebar'
import Dashboard from './Dashboard';
import Projects from './Projects';
import TeamManagment from './TeamManagment';
import SiteVisit from './SiteVisit';
import Inventory from './Inventory';
import Document from './Document';





const Director = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Director'; // Change this based on your user's actual role
  const userName = 'John Doe'; // Get this from your user context/state
  const navigate = useNavigate();
  const location = useLocation();
  


  const handleSidebarNavigate = (id, path) => {
    navigate(path); // This will navigate when a Sidebar item is clicked
  };

  const getActiveItem =() =>{
    const path = location.pathname;
    if(path.includes('/director/home') || path==='/') return 'home';
    if(path.includes('/director/projects')) return 'projects';
    if(path.includes('/director/teammanagment')) return 'teammanagment';
    if(path.includes('director/sitevisit')) return 'sitevisit';
    if(path.includes('director/inventory')) return 'inventory';
   
    return 'home';
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar 
        userRole={userRole}
        userName={userName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Sidebar 
        userRole={userRole} 
        activeItem="dashboard"
        onNavigate={handleSidebarNavigate}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="pt-20 p-8 ml-18">
        <div className='p-6'>
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/home' element={<Dashboard/>}/>
            <Route path='/projects' element={<Projects/>}/>
            
            <Route path='/teammanagment' element={<TeamManagment/>}/>
            <Route path='/sitevisit' element={<SiteVisit/>}/>
            <Route path='/inventory' element={<Inventory/>}/>
            <Route path='/documents' element={<Document/>}/>
            
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default Director


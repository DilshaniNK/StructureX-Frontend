import React, { useState } from 'react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar'
import Sidebar from '../../Components/Employee/Sidebar'
import Dashboard from './Dashboard';
import Projects from './Projects';
import TeamManagment from './TeamManagment';
import SiteVisit from './SiteVisit';
import Inventory from './Inventory';
import Document from './Document';
import Profile from '../../Components/Employee/Profile';




const Director = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Director'; // Change this based on your user's actual role
  const userName = 'Dilshani Nadeesha'; // Get this from your user context/state
  const navigate = useNavigate();
  const location = useLocation();

  const {employeeId}= useParams()
  


  const handleSidebarNavigate = (id, path) => {
    navigate(path); // This will navigate when a Sidebar item is clicked
  };

  const getActiveItem =() =>{
    const path = location.pathname;
    if(path.includes('/home') || path==='/') return 'home';
    if(path.includes('/projects')) return 'projects';
    if(path.includes('/teammanagment')) return 'teammanagment';
    if(path.includes('/sitevisit')) return 'sitevisit';
    if(path.includes('/inventory')) return 'inventory';
    if(path.includes('/profile')) return 'profile';
   
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
            <Route path='/profile' element={<Profile/>}/>
            
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default Director


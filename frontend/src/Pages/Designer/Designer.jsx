import React from 'react'
import { useNavigate } from 'react-router-dom';
//https://planner5d.com/use/free-floor-plan-creator
import Navbar from '../../Components/Employee/Navbar'
import Sidebar from '../../Components/Employee/Sidebar' 

export default function Home() {
  const userRole = 'Designer'; // Change this based on your user's actual role
  const userName = 'John Doe'; // Get this from your user context/state

  const navigate = useNavigate();

  const handleSidebarNavigate = (id, path) => {
    navigate(path); // This will navigate when a Sidebar item is clicked
  };

  return (
    <div>
      <Navbar 
        userRole={userRole}
        userName={userName}
      />
      <Sidebar 
        userRole={userRole} 
        activeItem="overview"
        onNavigate={handleSidebarNavigate}
      />
      
      <div className="pt-20 p-8 ml-18">
        Designer Page
      </div>
    </div>
  );
}
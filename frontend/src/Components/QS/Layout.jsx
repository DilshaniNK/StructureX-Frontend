import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import Navbar from '../Employee/Navbar'
import Sidebar from "../Employee/Sidebar";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const userRole = 'QSOfficer'; // Change this based on your user's actual role
    const userName = 'Malith'; // Get this from your user context/state

    const navigate = useNavigate();
    const location = useLocation();

    const handleSidebarNavigate = (id, path) => {
        navigate(path); // This will navigate when a Sidebar item is clicked
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Determine active item based on current path
    const getActiveItem = () => {
        const path = location.pathname;
        if (path.includes('/projects')) return 'projects';
        if (path.includes('/purchasing')) return 'purchasing';
        if (path.includes('/boq')) return 'boq';
        if (path.includes('/requests')) return 'request';
        if (path.includes('/notifications')) return 'notification';
        if (path.includes('/chat')) return 'chat';
        return 'home';
    };

    return (
        <div>
            <Navbar
                userRole={userRole}
                userName={userName}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <Sidebar
                userRole={userRole}
                activeItem={getActiveItem()}
                onNavigate={handleSidebarNavigate}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="pt-20 p-8 ml-20 lg:ml-20">
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout;
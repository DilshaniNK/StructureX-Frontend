import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from "./Sidebar";

const Layout = () => {
    const userRole = 'QSOfficer'; // Change this based on your user's actual role
    const userName = 'Malith'; // Get this from your user context/state

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
                activeItem="dashboard"
                onNavigate={handleSidebarNavigate}
            />

            <div className="pt-20 p-8 ml-18">
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout;
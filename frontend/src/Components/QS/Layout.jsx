import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Employee/Navbar'
import Sidebar from "../QS/Sidebar";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('QS Officer');
    const userRole = 'QSOfficer';
    const { employeeId } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    // Extract user info from JWT token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // You can set userName from JWT if available
                setUserName(decoded.name || decoded.email || 'QS Officer');
            } catch (error) {
                console.error('Error decoding token:', error);
                navigate('/unauthorized');
            }
        } else {
            navigate('/unauthorized');
        }
    }, [navigate]);

    const handleSidebarNavigate = (id, path) => {
        // Path already includes employeeId from Sidebar, just navigate directly
        navigate(path);
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
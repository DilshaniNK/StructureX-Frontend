import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar'
import Sidebar from '../../Components/Employee/Sidebar' 

import Dashboard from './Dashboard';
import Catalogue from './Catalogue';
import Orders from './Orders';
import Delivery from './Delivery';
import Payments from './Payments';
import Invoices from './Invoices';
import Quotations from './Quotations';
import Shistory from './Shistory';
import Messages from './Messages';

export default function Supplier() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = 'Supplier'; // Change this based on your user's actual role
  const userName = 'Shan'; // Get this from your user context/state
  const location = useLocation();
  const navigate = useNavigate();

  const handleSidebarNavigate = (id, path) => {
    navigate(path); // This will navigate when a Sidebar item is clicked
  };

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/supplier/home')) return 'home';
    if (path.includes('/supplier/catalogue')) return 'catalogue';
    if (path.includes('/supplier/orders')) return 'orders';
    if (path.includes('/supplier/delivery')) return 'delivery';
    if (path.includes('/supplier/payments')) return 'payments';
    if (path.includes('/supplier/invoices')) return 'invoices';
    if (path.includes('/supplier/quotations')) return 'quotations';
    if (path.includes('/supplier/shistory')) return 'shistory';
    if (path.includes('/supplier/messages')) return 'messages';
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
      
      <div className="pt-20 ml-20 transition-all duration-300">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/quotations" element={<Quotations/>} /> 
            <Route path="/shistory" element={<Shistory/>} />
            <Route path="/messages" element={<Messages/>} />
          </Routes>  
        </div>
      </div>
    </div>
  );
}
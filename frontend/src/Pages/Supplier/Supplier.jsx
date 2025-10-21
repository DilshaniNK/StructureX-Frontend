import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from '../../Components/Employee/Navbar';
import Sidebar from '../../Components/Employee/Sidebar';
import Profile from '../../Components/Employee/Profile';

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
  const [userName, setUserName] = useState(''); // <-- use state for username
  const userRole = 'Supplier'; // Change this based on your user's actual role
  const location = useLocation();
  const navigate = useNavigate();
  const { supplierId } = useParams();

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch(`/api/suppliers/${supplierId}`)
      .then(res => res.json())
      .then(data => setUserName(data.username)) // Adjust property as per your API response
      .catch(() => setUserName(''));
  }, [supplierId]);

  const handleSidebarNavigate = (id, path) => {
    navigate(path);
  };

  // Improved: Match the sidebar item id based on the current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.match(/\/supplier\/[^/]+\/home/)) return 'home';
    if (path.match(/\/supplier\/[^/]+\/catalogue/)) return 'catalogue';
    if (path.match(/\/supplier\/[^/]+\/orders/)) return 'orders';
    if (path.match(/\/supplier\/[^/]+\/delivery/)) return 'delivery';
    if (path.match(/\/supplier\/[^/]+\/payments/)) return 'payments';
    if (path.match(/\/supplier\/[^/]+\/invoices/)) return 'invoices';
    if (path.match(/\/supplier\/[^/]+\/quotations/)) return 'quotations';
    if (path.match(/\/supplier\/[^/]+\/shistory/)) return 'shistory';
    if (path.match(/\/supplier\/[^/]+\/messages/)) return 'messages';
    if (path.match(/\/supplier\/[^/]+\/profile/)) return 'profile';
    return 'home';
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
            <Route path="/" element={<Catalogue />} />
            {/* <Route path="/home" element={<Dashboard />} /> */}
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/shistory" element={<Shistory />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}
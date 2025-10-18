// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/unauthorized" />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.type?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(type => type.toLowerCase());

    return normalizedAllowedRoles.includes(userRole) ? children : <Navigate to="/unauthorized" />;
  } catch (error) {
    return <Navigate to="/unauthorized" />;
  }
};


export default ProtectedRoute;

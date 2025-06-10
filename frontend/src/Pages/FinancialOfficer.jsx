// FinancialOfficer.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import FO_Dashboard from './Financial_officer/Dashboard';
import FO_Projects from './Financial_officer/Projects';
import FO_ProjectDetails from './Financial_officer/ProjectDetails';
import FO_Labors from './Financial_officer/Labors';
import FO_Calendar from './Financial_officer/Calender';
import FO_Payments from './Financial_officer/Payments';


const FinancialOfficer = () => {
  return (
    
    <Routes>
      <Route path="dashboard" element={<FO_Dashboard />} />
      <Route path="projects" element={<FO_Projects />} />
      <Route path="labors" element={<FO_Labors />} />
      <Route path="project_details" element={<FO_ProjectDetails />} />
      <Route path="calendar" element={<FO_Calendar />} />
      <Route path="payments" element={<FO_Payments />} />
    </Routes>
   
  );
};

export default FinancialOfficer;

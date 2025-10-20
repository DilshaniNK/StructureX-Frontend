import React from 'react';
import '../../CSS/Admin/Admin.CSS'
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../../Contexts/ThemeContexts';

import Layout from '../../Components/SQS/Layout';
import EmployeesPage from '../../Components/Admin/Dashboard/Employees'
import Dashboard from '../../Pages/SQS/Dashboard'
import BOQ from './BOQ';
import Projects from './Projects';
import Purchasing from './Purchasing';
import Requests from './Requests';
import Notifications from './Notifications';
import Profile from '../../Components/Employee/Profile';

export default function SQS() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="boq" element={<BOQ/>} />
          <Route path="projects" element={<Projects/>} />
          <Route path="purchasing" element={<Purchasing/>} />
          <Route path="requests" element={<Requests/>} />
          <Route path="notifications" element={<Notifications/>} />
          <Route path="profile" element={<Profile/>} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
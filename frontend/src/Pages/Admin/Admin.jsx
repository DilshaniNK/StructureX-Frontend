import React from 'react';
import '../../CSS/Admin/Admin.CSS'
import { Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider } from '../../Contexts/ThemeContexts';

import Layout from '../../Components/Admin/Layout';
import DashboardPage from '../../Components/Admin/Dashboard/Page'
import EmployeesPage from '../../Components/Admin/Dashboard/Employees'
import AddEmployeesPage from '../../Components/Admin/Dashboard/AddEmployees'
import ProjectOverview from '../../Components/Admin/Dashboard/ProjectOverview'
import AdminProfile from '../../Components/Admin/Dashboard/Profile'
import Notification from '../../Components/Admin/Dashboard/Notification'
import Publish from '../../Components/Admin/Dashboard/Publish'
import Support from '../../Components/Admin/Dashboard/Support'
import Reports from '../../Components/Admin/Dashboard/Reports'
import Analytics from '../../Components/Admin/Dashboard/Analatics'
import AddSupplierPage from '../../Components/Admin/Dashboard/AddSupplier'

export default function Admin() {

  const{adminId}=useParams();
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<Analytics/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="employees" element={<EmployeesPage/>} />
          <Route path="add-employee" element={<AddEmployeesPage/>} />
          <Route path="projects" element={<ProjectOverview/>} />
          <Route path="profile" element={<AdminProfile/>} />
          <Route path="publish" element={<Publish/>} />
          <Route path="contact-support" element={<Support/>} />
          <Route path="notification" element={<Notification/>} />
          <Route path="add-supplier" element={<AddSupplierPage/>} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
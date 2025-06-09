import React from 'react';
import '../CSS/Admin/Admin.CSS'
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../Contexts/ThemeContexts';

import Layout from '../Components/Admin/Layout';
import DashboardPage from '../Components/Admin/Dashboard/Page'
import EmployeesPage from '../Components/Admin/Dashboard/Employees'
import AddEmployeesPage from '../Components/Admin/Dashboard/AddEmployees'
import ProjectOverview from '../Components/Admin/Dashboard/ProjectOverview'
import AdminProfile from '../Components/Admin/Dashboard/Profile'
import Notification from '../Components/Admin/Dashboard/Notification'
import Publish from '../Components/Admin/Dashboard/Publish'

export default function Admin() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<h1 className="title">Analytics</h1>} />
          <Route path="reports" element={<h1 className="title">Reports</h1>} />
          <Route path="employees" element={<EmployeesPage/>} />
          <Route path="add-employee" element={<AddEmployeesPage/>} />
          <Route path="projects" element={<ProjectOverview/>} />
          <Route path="profile" element={<AdminProfile/>} />
          <Route path="publish" element={<Publish/>} />
          <Route path="notification" element={<Notification/>} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
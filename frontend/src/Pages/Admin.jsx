import React from 'react';
import '../CSS/Admin/Admin.CSS'
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../Contexts/ThemeContexts';

import Layout from '../Components/Admin/Layout';
import DashboardPage from '../Components/Admin/Dashboard/Page'
import EmployeesPage from '../Components/Admin/Dashboard/Employees'
import AddEmployeesPage from '../Components/Admin/Dashboard/AddEmployees'

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
          <Route path="verified-customers" element={<h1 className="title">Verified Customers</h1>} />
          <Route path="products" element={<h1 className="title">Products</h1>} />
          <Route path="new-product" element={<h1 className="title">New Product</h1>} />
          <Route path="inventory" element={<h1 className="title">Inventory</h1>} />
          <Route path="settings" element={<h1 className="title">Settings</h1>} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
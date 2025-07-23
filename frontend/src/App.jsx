import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from './Components/Employee/ProtectedRoute';
import Unauthorized from './Pages/Unauthorized';

import Example from './Pages/Example'
import FinancialOfficer from './Pages/Financial_officer/FinancialOfficer'
import SiteSupervisor from './Pages/Site_supervisor/SiteSupervisor';

import Home from './Pages/Home'
import Admin from './Pages/Admin/Admin'
import Designer from './Pages/Designer/Designer'
import Director from './Pages/Director/Director';
import DirectorCont from './Pages/Director/DirectorCont';


import QS from './Pages/QS/QS'
import SQS from './Pages/SQS/SQS'

import ProjectManager from './Pages/ProjectManager/ProjectManager'
import Supplier from './Pages/Supplier/Supplier'
import ProjectOwner from './Pages/ProjectOwner/ProjectOwner'
import LegalOfficer from './Pages/LegalOfficer/LegalOfficer';


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/projectmanager/:employeeId/*" element={
              <ProtectedRoute allowedRoles={['Project_Manager']}>
                <ProjectManager />
              </ProtectedRoute>
            } />
            <Route path="/legalofficer/:employeeId/*" element={
              <ProtectedRoute allowedRoles={['Legal_Officer']}>
                <LegalOfficer />
              </ProtectedRoute>
            } />
            <Route path="/example/*" element={<Example />} />
            <Route path="/qs/*" element={<QS />} />
            <Route path="/sqs/*" element={<SQS />} />
            <Route path="/supplier/:supplierId/*" element={
              <ProtectedRoute allowedRoles={['Supplier']}>
                <Supplier />
              </ProtectedRoute>
            } />
            <Route path="/project_owner/:clientId/*" element={
              <ProtectedRoute allowedRoles={['Project_Owner']}>
                <ProjectOwner />
              </ProtectedRoute>
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin/:adminId/*" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/financial_officer/:employeeId/*" element={
              <ProtectedRoute allowedRoles={['Financial_Officer']}>
                <FinancialOfficer />
              </ProtectedRoute>
            } />
            <Route path="/site_supervisor/:employeeId/*" element={
              <ProtectedRoute allowedRoles={['Site_Supervisor']}>
                <SiteSupervisor />
              </ProtectedRoute>
            } />

            <Route path="/example/*" element={<Example />} />
            <Route path="/designer/:employeeId/*" element={
              <ProtectedRoute allowedRoles={['Designer']}>
                <Designer />
              </ProtectedRoute>
            } />
            <Route path='/director/*' element={<Director />} />
            <Route path='/directorcont/*' element={<DirectorCont />} />




          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

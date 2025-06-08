import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

//financial officer pages
import FO_Dashboard from './Pages/Financial_officer/Dashboard'
import FO_Projects from './Pages/Financial_officer/Projects'
import FO_Payments from './Pages/Financial_officer/Payments'

import Home from './Pages/Home'
import Admin from './Pages/Admin'
import Di_Dashboard from './Pages/Director/Dashboad';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/*" element={<Admin/>}/>
            <Route path="/director/dashboard" element={<Di_Dashboard/>}/>
            <Route path="/financial_officer/dashboard" element={<FO_Dashboard/>}/>
            <Route path="/financial_officer/projects" element={<FO_Projects/>}/>
            <Route path="/financial_officer/payments" element={<FO_Payments/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

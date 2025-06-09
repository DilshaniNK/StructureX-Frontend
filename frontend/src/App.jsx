import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

//financial officer pages
import FO_Dashboard from './Pages/Financial_officer/Dashboard'
import FO_Projects from './Pages/Financial_officer/Projects'
import FO_ProjectDetails from './Pages/Financial_officer/ProjectDetails'
import FO_Labors from './Pages/Financial_officer/Labors'


import Home from './Pages/Home'
import Admin from './Pages/Admin'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/*" element={<Admin/>}/>
            <Route path="/financial_officer/dashboard" element={<FO_Dashboard/>}/>
            <Route path="/financial_officer/projects" element={<FO_Projects/>}/>
            <Route path="/financial_officer/labors" element={<FO_Labors/>}/>
            <Route path="/financial_officer/project_details" element={<FO_ProjectDetails/>}/>
            
          
        </Routes>
      </Router>
    </>
  )
}

export default App

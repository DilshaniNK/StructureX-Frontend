import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

//Example page import
import Example from './Pages/Example'

//financial officer pages
import FO_Dashboard from './Pages/Financial_officer/Dashboard'
import FO_Projects from './Pages/Financial_officer/Projects'
import FO_Payments from './Pages/Financial_officer/Payments'
import FO_ProjectDetails from './Pages/Financial_officer/ProjectDetails'
import FO_Labors from './Pages/Financial_officer/Labors'
import FO_Calendar from './Pages/Financial_officer/Calender'
import Home from './Pages/Home'
import Admin from './Pages/Admin'
import Designer from './Pages/Designer/Designer'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/*" element={<Admin/>}/>
            <Route path="/example/*" element={<Example/>}/>
            <Route path="/financial_officer/dashboard" element={<FO_Dashboard/>}/>
            <Route path="/financial_officer/projects" element={<FO_Projects/>}/>
            <Route path="/financial_officer/payments" element={<FO_Payments/>}/>
            <Route path="/designer/*" element={<Designer/>}/>
            <Route path="/financial_officer/labors" element={<FO_Labors/>}/>
            <Route path="/financial_officer/project_details" element={<FO_ProjectDetails/>}/>
            <Route path="/financial_officer/calendar" element={<FO_Calendar/>}/>
           </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

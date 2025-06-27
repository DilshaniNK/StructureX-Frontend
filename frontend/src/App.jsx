import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




import Example from './Pages/Example'
import FinancialOfficer from './Pages/Financial_officer/FinancialOfficer'
import SiteSupervisor from './Pages/Site_supervisor/SiteSupervisor';

import Home from './Pages/Home'
import Admin from './Pages/Admin/Admin'
import Designer from './Pages/Designer/Designer'
import ProjectManager from './Pages/ProjectManager/ProjectManager'
import Supplier from './Pages/Supplier/Supplier'
import ProjectOwner from './Pages/ProjectOwner/ProjectOwner'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>

            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/financial_officer/*" element={<FinancialOfficer />} />
            <Route path="/project_manager/*" element={<ProjectManager/>} />
            <Route path="/site_supervisor/*" element={<SiteSupervisor/>}/>
            <Route path="/example/*" element={<Example/>}/>
            <Route path="/designer/*" element={<Designer/>}/>
            <Route path="/supplier/*" element={<Supplier/>}/>
            <Route path="/project_owner/*" element={<ProjectOwner/>}/>

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

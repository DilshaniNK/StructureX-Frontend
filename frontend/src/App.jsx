import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




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


            
            <Route path="/projectmanager/*" element={<ProjectManager />} />
            <Route path="/legalofficer/*" element={<LegalOfficer />} />

            <Route path="/qs/*" element={<QS/>}/>
            <Route path="/sqs/*" element={<SQS/>}/>
            <Route path="/supplier/*" element={<Supplier/>}/>
            <Route path="/project_owner/*" element={<ProjectOwner/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/*" element={<Admin/>}/>
            <Route path="/financial_officer/*" element={<FinancialOfficer/>}/>
            <Route path="/site_supervisor/*" element={<SiteSupervisor/>}/>
            <Route path="/example/*" element={<Example/>}/>
            <Route path="/designer/*" element={<Designer/>}/>
            <Route path='/director/*' element={<Director/>}/>
            <Route path='/directorcont/*' element={<DirectorCont/>}/>
            

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

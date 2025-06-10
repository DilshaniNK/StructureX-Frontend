import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";




import Example from './Pages/Example'
import FinancialOfficer from './Pages/FinancialOfficer'

import Home from './Pages/Home'
import Admin from './Pages/Admin/Admin'
import Designer from './Pages/Designer/Designer'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/*" element={<Admin/>}/>
            <Route path="/financial_officer/*" element={<FinancialOfficer/>}/>
            
          

            <Route path="/example/*" element={<Example/>}/>
            <Route path="/designer/*" element={<Designer/>}/>
            
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

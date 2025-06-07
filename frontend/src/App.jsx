import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Home from './Pages/Home'
import Admin from './Pages/Admin'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/*" element={<Admin/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

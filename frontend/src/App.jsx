import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Home from './Pages/Home'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Home/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

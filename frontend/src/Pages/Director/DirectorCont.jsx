import React from 'react'
import Navbar from '../../Components/Employee/Navbar'
import { Routes,Route } from 'react-router-dom'

import ProjectDetails from './ProjectDetails'
import Clientdetails from './Clientdetails'

const DirectorCont = () => {

    const getActiveItem =() =>{
    const path = location.pathname;
        if(path.includes('/directorcont/home') || path==='/') return 'home';
    return 'home';
    }
       
  return (
    <div className='min-h-screen bg-gray-50'> 
      <Navbar/>
      <Routes>
        <Route path='/project/:id' element={<ProjectDetails/>}/>
        <Route path='/clientdetails' element={<Clientdetails/>}/>

      </Routes>
    </div>
  )
}

export default DirectorCont

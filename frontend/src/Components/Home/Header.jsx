import React, { useState } from 'react'
import {FaXmark, FaBars } from 'react-icons/fa6'
import { Link, scroller } from 'react-scroll' // Import scroller
import LoginForm from '../Employee/LoginForm'

const Header = () => {
  const [IsMenuOpen,setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleMenu = () =>{
    setIsMenuOpen(!IsMenuOpen);
  }

  const closeMenu = () =>{
    setIsMenuOpen(false);
  }

  const openLogin = () => {
    setIsLoginOpen(true);
  }

  const closeLogin = () => {
    setIsLoginOpen(false);
  }

  // Add this function to handle navigation to contact section
  const navigateToContact = () => {
    scroller.scrollTo('contact', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -100
    });
  }

  const navItems=[
    {
      link: 'Home' , path: 'home'
    },
    {
      link: 'About' , path: 'about'
    },
    {
      link: 'Services' , path: 'services'
    },
    {
      link: 'Projects' , path: 'projects'
    },
    {
      link: 'Contact' , path: 'contact'
    },
  ]

  return (
    <>
      <nav className='w-full flex bg-white justify-between items-center gap-1 lg:px-16 px-6
            py-4 sticky top-0 z-50 '>
        <h1 className='text-black md:text-4xl text-3xl font-bold font-rubik '>Structura
          <span className='text-yellow-500 italic '>X</span>
        </h1>

        <ul className='lg:flex justify-center items-center gap-6 hidden'>
          {
            navItems.map(({link,path})=>(
              <Link key={path} className='text-black uppercase font-bold cursor-pointer
              p-3 rounded-full hover:bg-yellow-500 hover:text-black text-[15px]' to={path}
              spy={true} offset={-100} smooth={true}>{link}</Link>
            ))
          }
        </ul>

        <button 
          className='bg-yellow-500 hover:bg-black hover:text-white text-black
          px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform
          duration-300 cursor-pointer md:flex hidden'
          onClick={openLogin}
        >
          LOGIN
        </button>

        {/* mobile menu start here */}
        <div className='flex justify-between items-center lg:hidden mt-3' onClick={toggleMenu}>
          <div>
            {
              IsMenuOpen ? <FaXmark className='text-yellow-500 text-3xl cursor-pointer'/
              >:<FaBars className='text-yellow-500 text-3xl cursor-pointer'/>
            }
          </div>
        </div>

        <div className={`${IsMenuOpen ? 'flex' : 'hidden'} w-full h-fit bg-yellow-500 p-4 absolute
        top-[72px] left-0 lg:hidden`} onClick={closeMenu}>
          <ul className='flex flex-col justify-center items-center gap-2 w-full'>
            {
              navItems.map(({link,path})=>(
                <Link key={path} className='text-black uppercase font-semibold cursor-pointer
                p-2 rounded-lg hover:bg-black hover:text-white w-full text-center' to={path} spy={true} offset={-100}
                smooth={true} onClick={closeMenu}>
                {link}
                </Link>
              ))
            }
            {/* Login button for mobile */}
            <button 
              className='bg-black text-white px-6 py-2 rounded-lg font-semibold
              hover:bg-gray-800 transition-colors duration-300 mt-2 w-full'
              onClick={() => {
                closeMenu();
                openLogin();
              }}
            >
              LOGIN
            </button>
           </ul>
         </div>
     </nav>

     {/* Login Form Modal - Pass the navigation function */}
     {isLoginOpen && (
       <LoginForm 
         onClose={closeLogin} 
         onNavigateToContact={navigateToContact}
       />
     )}
    </>
  )
}

export default Header
import React from 'react'
import Header from '../Components/Home/Header'
import Hero from '../Components/Home/Hero'
import About from '../Components/Home/About'
import Services from '../Components/Home/Services'
import Portfolio from '../Components/Home/Portfolio'
import Testimonials from '../Components/Home/Testimonials'
import Contact from '../Components/Home/Contact'
import Footer from '../Components/Home/Footer'
import Working from '../Components/Home/Working'

export default function LandingPage() {
  return (
    <div style={{
      backgroundColor: 'rgb(45, 42, 42)'
    }}>
      <Header/>
      <Hero/>
      <About/>
      <Services/>
      <Portfolio/>
      <Working/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </div>
  )
}

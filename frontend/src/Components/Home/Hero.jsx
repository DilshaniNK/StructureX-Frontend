import React, { useState, useEffect } from 'react'
import backgroundImage from '../../assets/hero.jpg'
import { motion, AnimatePresence } from 'framer-motion'
import { slideUpVariants, zoomInVariants } from './animation'

const Hero = () => {
  const cards = [
    {
      id: 1,
      title: "Smart Project Tracking",
      description: "Real-time progress monitoring and automated reporting"
    },
    {
      id: 2,
      title: "Resource Management",
      description: "Optimize materials, equipment, and workforce allocation"
    },
    {
      id: 3,
      title: "Quality Assurance",
      description: "Comprehensive quality control and safety compliance"
    },
    {
      id: 4,
      title: "Budget Control",
      description: "Advanced cost tracking and financial planning tools"
    },
    {
      id: 5,
      title: "Team Collaboration",
      description: "Seamless communication between all project stakeholders"
    },
    {
      id: 6,
      title: "Safety Management",
      description: "Digital safety protocols and incident reporting system"
    },
    {
      id: 7,
      title: "Document Control",
      description: "Centralized document management and version control"
    },
    {
      id: 8,
      title: "Time Scheduling",
      description: "Intelligent scheduling with dependency management"
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [cards.length])

  const getVisibleCards = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % cards.length
      visible.push({
        ...cards[index],
        position: i // 0: top, 1: center, 2: bottom
      })
    }
    return visible
  }

  const getCardStyle = (position) => {
    const baseStyle = {
      position: 'absolute',
      right: 0,
      width: '16rem',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    }

    switch (position) {
      case 0:
        return { ...baseStyle, top: '0%', scale: 0.8, opacity: 0.6, zIndex: 1 }
      case 1:
        return { ...baseStyle, top: '50%', transform: 'translateY(-50%)', scale: 1.1, opacity: 1, zIndex: 3 }
      case 2:
        return { ...baseStyle, top: '100%', transform: 'translateY(-100%)', scale: 0.8, opacity: 0.6, zIndex: 1 }
      default:
        return baseStyle
    }
  }

  return (
    <div 
      id='hero' 
      className='relative bg-black w-full lg:h-[700px] h-fit m-auto pt-[60px] lg:pt-[0px] lg:px-[150px] px-[20px] flex justify-between items-center lg:flex-row flex-col lg:gap-5 gap-[50px] bg-cover bg-center overflow-hidden' 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 z-30"></div>
      
      {/* Particles */}
      <div className="absolute inset-0 z-20">
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white/20 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-yellow-500/20 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Left Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className='relative z-30 lg:w-[60%] w-full flex flex-col justify-center items-start lg:gap-8 gap-4 !ml-[20px]'
      >
        <motion.div variants={slideUpVariants} className='flex items-center gap-3'>
          <div className='w-12 h-[2px] bg-yellow-500'></div>
          <h1 className='text-yellow-500 text-xl font-semibold tracking-wider'>CONSTRUCTION EXCELLENCE</h1>
        </motion.div>

        <motion.h1
          variants={slideUpVariants}
          className='text-white uppercase text-[42px] lg:text-[56px] font-bold leading-tight hover:text-yellow-500 transition-colors duration-300'
        >
          Building Tomorrow's
          <span className='block text-yellow-500'>Infrastructure Today</span>
        </motion.h1>

        <motion.div 
          variants={slideUpVariants}
          className='w-[120px] h-[6px] bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full'
        ></motion.div>

        <motion.p 
          variants={slideUpVariants}
          className='text-gray-200 text-[18px] lg:text-[20px] leading-relaxed max-w-[500px]'
        >
          Transform your construction projects with our comprehensive management system. 
          From planning to completion, we deliver excellence through innovative technology 
          and proven expertise in every build.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className='flex justify-center items-center gap-5 flex-wrap'
        >
          <motion.button
            variants={zoomInVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(234, 179, 8, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className='bg-yellow-500 hover:bg-yellow-400 hover:text-black px-10 py-4 rounded-lg text-black font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl'
          >
            EXPLORE PROJECTS
          </motion.button>
          
          <motion.button
            variants={zoomInVariants}
            whileHover={{
              scale: 1.05,
              borderColor: "#eab308",
              color: "#eab308",
              boxShadow: "0 0 20px rgba(234, 179, 8, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className='border-white hover:border-yellow-500 hover:text-yellow-500 border-2 px-10 py-4 rounded-lg text-white font-bold text-sm tracking-wide transition-all duration-300 backdrop-blur-sm'
          >
            GET CONSULTATION
          </motion.button>
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          className='flex items-center gap-8 mt-4 text-gray-300'
        >
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center'>
              <span className='text-yellow-500 font-bold text-sm'>500+</span>
            </div>
            <span className='text-sm'>Projects Completed</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center'>
              <span className='text-yellow-500 font-bold text-sm'>24/7</span>
            </div>
            <span className='text-sm'>Support Available</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Sliding Card Carousel */}
      <motion.div 
        className='relative z-30 lg:w-[40%] w-full lg:h-[400px] h-[300px] flex justify-end items-center lg:mt-0 mt-10'
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className='relative w-64 h-full'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-32 bg-yellow-500/10 rounded-full blur-3xl'></div>

          <AnimatePresence mode="wait">
            {getVisibleCards().map((card) => (
              <motion.div
                key={`${card.id}-${card.position}`}
                style={getCardStyle(card.position)}
                className={`bg-white/10 backdrop-blur-md border rounded-lg p-4 cursor-pointer
                  ${card.position === 1 
                    ? 'border-yellow-500/50 bg-white/15 shadow-xl shadow-yellow-500/20' 
                    : 'border-white/20'
                  }`}
                whileHover={card.position === 1 ? {
                  scale: 1.15,
                  x: -10,
                  boxShadow: "0 20px 40px rgba(234, 179, 8, 0.3)"
                } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                  card.position === 1 ? 'text-yellow-400 text-lg' : 'text-yellow-500'
                }`}>
                  {card.title}
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  card.position === 1 ? 'text-white' : 'text-gray-300'
                }`}>
                  {card.description}
                </p>
                {card.position === 1 && (
                  <div className='absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-500 rounded-full'></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-yellow-500 w-6' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero

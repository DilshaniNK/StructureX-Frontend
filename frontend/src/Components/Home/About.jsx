import React from 'react';
import { motion } from 'framer-motion';
import { slideUpVariants, zoomInVariants } from './animation';

const About = () => {
  return (
    <div
      className="lg:w-[80%] w-[90%] m-auto py-[80px] flex lg:flex-row flex-col justify-between items-start gap-[50px] !mt-[50px] relative"
      id="about"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl"></div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-[60%] w-full flex flex-col justify-center items-start gap-8 !ml-[20px] relative z-10"
      >
        {/* Welcome badge */}
        <motion.div 
          variants={slideUpVariants}
          className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-2 backdrop-blur-sm"
        >
          <motion.h1 className="text-yellow-500 text-lg font-semibold tracking-wider">
            WELCOME TO
          </motion.h1>
        </motion.div>
        
        {/* Main title with enhanced styling */}
        <motion.div variants={slideUpVariants} className="relative">
          <motion.h1
            className="text-white uppercase text-[45px] lg:text-[55px] font-bold leading-tight tracking-wide"
          >
            Structura{' '}
            <span className="relative">
              X
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"></div>
            </span>
          </motion.h1>
          {/* Decorative line */}
          <div className="w-[140px] h-[6px] bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full mt-4 shadow-lg shadow-yellow-500/20"></div>
        </motion.div>
        
        {/* Enhanced tagline */}
        <motion.div 
          variants={slideUpVariants}
          className="mt-[40px] p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
        >
          <p className="text-2xl lg:text-3xl italic text-gray-50 font-light leading-relaxed">
            Empowering construction with{' '}
            <span className="text-yellow-500 font-medium">intelligent management</span>.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-[40%] w-full flex flex-col justify-center items-start gap-8 relative z-10"
      >
        {/* Enhanced description card */}
        <motion.div 
          variants={slideUpVariants}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <p className="text-white text-lg text-justify leading-relaxed">
            <span className="text-yellow-500 font-semibold text-xl">Structura X</span> is a smart and scalable construction management platform
            designed to streamline operations, improve collaboration, and deliver
            results on time and within budget. From planning to execution, we help
            contractors, engineers, and project managers stay connected, organized,
            and in control.
          </p>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent my-6"></div>
          
          <p className="text-gray-300 text-lg leading-relaxed">
            Our platform offers <span className="text-yellow-500 font-medium">real-time tracking</span>, 
            <span className="text-yellow-500 font-medium"> resource allocation</span>, and 
            <span className="text-yellow-500 font-medium"> data-driven insights</span> that drive efficiency at every stage
            of construction.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div 
          variants={slideUpVariants}
          className="flex flex-wrap gap-3 mt-4"
        >
          {['Real-time Tracking', 'Smart Analytics', 'Team Collaboration'].map((feature, index) => (
            <div 
              key={index}
              className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-sm font-medium backdrop-blur-sm"
            >
              {feature}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
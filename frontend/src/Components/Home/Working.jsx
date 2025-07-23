import React from 'react'
import { motion } from 'framer-motion'
import { slideUpVariants, zoomInVariants } from './animation'

import { IoDocumentTextSharp } from "react-icons/io5"
import { MdOutlineDesignServices } from "react-icons/md"
import { FaRegBuilding } from "react-icons/fa"
import { FaSitemap } from "react-icons/fa"

const Working = () => {
  const planning = [
    {
      icon: IoDocumentTextSharp,
      title: "Planning",
      about: "We start by understanding your requirements and creating a clear project plan tailored to your goals.",
    },
    {
      icon: MdOutlineDesignServices,
      title: "Design",
      about: "Our expert team creates innovative and functional designs that meet both aesthetic and practical needs.",
    },
    {
      icon: FaRegBuilding,
      title: "Building",
      about: "With experienced professionals and quality materials, we construct your vision with precision and care.",
    },
    {
      icon: FaSitemap,
      title: "Finish",
      about: "We ensure every detail is finalized to perfection and deliver a complete, ready-to-use result.",
    },
  ];

  return (
    <div id='working' className='w-full bg-white'>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className='py-[60px] flex flex-col justify-center items-center gap-[20px]'
      >
        <motion.h1
          variants={slideUpVariants}
          className='text-yellow-500 text-2xl'
        >
          STEP BY STEP
        </motion.h1>
        <motion.h1
          variants={slideUpVariants}
          className='text-black uppercase text-[40px] font-bold text-center'
        >
          HOW IT'S WORKING
        </motion.h1>
        <motion.div
          variants={slideUpVariants}
          className='w-[120px] h-[6px] bg-yellow-500'
        ></motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className='w-full grid lg:grid-cols-4 grid-cols-1 justify-center items-start gap-[40px] mt-[20px] p-6'
        >
          {planning.map((item, index) => (
            <div
              key={index}
              className='flex flex-col justify-center items-center gap-5 border-2 border-yellow-500 rounded-mg p-6'
            >
              <div>
                <item.icon className='size-[80px] bg-yellow-500 hover:bg-black hover:fill-white p-4 rounded-full cursor-pointer' />
              </div>
              <h1 className='text-2xl font-bold uppercase'>{item.title}</h1>
              <p className='text-[20px] text-center text-gray-600'>{item.about}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Working

"use client";

import React from 'react';
import { motion } from 'motion/react'

// der => izq

const TransitionEffect = () => {
  return (
    <>
      <motion.div className='fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-[#AC485C]'
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        exit={{ x: ["0%", "100%"], width: ["0%", "100%"] }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div className='fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-[#EF9E34]'
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        exit={{ x: ["0%", "100%"], width: ["0%", "100%"] }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div className='fixed top-0 bottom-0 right-full w-screen h-screen z-10  bg-[#2F889E]'
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        exit={{ x: ["0%", "100%"], width: ["0%", "100%"] }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
      />
    </>
  );
}

export default TransitionEffect;

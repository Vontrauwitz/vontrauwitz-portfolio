import React from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"

const Logo = () => {

  const MotionLink = motion(Link);

  return (
    <div
      className='flex items-center justify-center mt-2 drop-shadow-[2px_3px_2px_rgba(0,0,0,0.4)]'
    >
      <MotionLink
        href="/"
        className='w-16 h-16 bg-dark text-light flex items-center justify-center rounded-full text-2xl font-bold border border-solid border-transparent dark:border-light'
        whileHover={{
          // scale: 1.1,
          backgroundColor: ["#121212", "#EF9E34", "#2F889E", "#AC485C"],
          transition: { duration: 1, repeat: Infinity }
        }}
      >HT
      </MotionLink>
    </div>
  )
}

export default Logo


import React from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"
import Image from 'next/image';
import charizard from '../../public/images/gifs/charizard.gif'
import casa from '../../public/images/gifs/casa.gif'


const Logo = () => {

  const MotionLink = motion(Link);

  return (
    <div
      className='mx-3 flex items-center justify-center my -2 '
    >
      {/* <MotionLink
        href="/"
        className='w-16 h-16 bg-dark text-light flex items-center justify-center rounded-full text-2xl font-bold border border-solid border-transparent dark:border-light'
        whileHover={{
          // scale: 1.1,
          backgroundColor: ["#121212", "#EF9E34", "#2F889E", "#AC485C"],
          transition: { duration: 1, repeat: Infinity }
        }}
      >HT
      </MotionLink> */}
      <MotionLink
        href="/"
        className='w-16  flex items-center justify-center rounded-full'
      >

        <Image
          alt="testimonial photo"
          src={casa}
          // src={charizard}
          priority
          sizes='(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                50vw'

          className="
    w-16
    h-16
    rounded-full
    object-cover
    mr-4
    drop-shadow-[2px_3px_2px_rgba(255,255,255,.4)]
    dark:drop-shadow-[2px_3px_2px_rgba(0,0,0,.4)]
    "
        />
      </MotionLink>
    </div>
  )
}

export default Logo


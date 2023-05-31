import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { useRouter } from 'next/router';
import { TwitterIcon, GithubIcon, LinkedinIcon } from './Icons';
import { motion } from 'framer-motion';

const CustomLink = ({ href, title, className = "" }) => {
  const router = useRouter();
  // console.log(router);

  return (
    <Link
      href={href}
      className={`${className} relative group`}
    >
      {title}
      <span
        className={`h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300
        ${router.asPath === href ? 'w-full' : 'w-0'}
        `}
      >
        &nbsp;
      </span>
    </Link>
  )
}

const NavBar = () => {
  return (
    <header
      className='w-full px-20 py-2 font-medium flex items-center justify-between'
    >
      <Logo />
      <nav>
        <CustomLink href="/" title="Home" className='mr-4' />
        <CustomLink href="/about" title="About" className='mx-4' />
        <CustomLink href="/projects" title="Projects" className='mx-4' />
        <CustomLink href="/certifications" title="Certifications" className='ml-4' />
      </nav>

      <nav
        className='flex items-center justify-center flex-wrap'
      >
        <motion.a href="https://twitter.com" target={"_blank"}
          className="w-6 mr-3"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <TwitterIcon />
        </motion.a>

        <motion.a href="https://github.com/Vontrauwitz" target={"_blank"}
          className="w-6 mx-3"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <GithubIcon />
        </motion.a>

        <motion.a href="https://www.linkedin.com/in/vontrauwitzdev/" target={"_blank"}
          className="w-6 ml-3"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <LinkedinIcon />
        </motion.a>
        {/* <Link href="/" target={"_blank"}>T</Link>
        <Link href="/" target={"_blank"}>T</Link>
        <Link href="/" target={"_blank"}>T</Link> */}

      </nav>
    </header>
  )
}

export default NavBar

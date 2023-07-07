import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { useRouter } from 'next/router';
import { TwitterIcon, GithubIcon, LinkedinIcon, SunIcon, MoonIcon } from './Icons';
import { motion } from 'framer-motion';
import UseThemeSwitcher from './hooks/useThemeSwitcher';

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
        dark:bg-light`}

      >
        &nbsp;
      </span>
    </Link>
  )
}

const NavBar = () => {

  const [mode, setMode] = UseThemeSwitcher();

  return (
    <header
      className='w-full px-20 py-2 font-medium flex items-center justify-between dark:text-light'
    >
      <Logo />
      <nav>
        <CustomLink href="/" title="Home" className='mr-4' />
        <CustomLink href="/about" title="About" className='mx-4' />
        <CustomLink href="/projects" title="Projects" className='mx-4' />
        <CustomLink href="/contact" title="Contact" className='ml-4' />
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

        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className={`ml-3 items-center justify-center rounded-full p-1
          ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}
          `}
        >
          {
            mode === "dark"
              ?
              <SunIcon className={"fill-dark"} />
              :
              <MoonIcon className={"fill-dark"} />
          }

        </button>

        {/* <motion.a href="https://www.linkedin.com/in/vontrauwitzdev/" target={"_blank"}
          className="w-6 ml-3"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          >
          <React />
        </motion.a> */}
        {/* <Link href="/" target={"_blank"}>T</Link>
        <Link href="/" target={"_blank"}>T</Link>
        <Link href="/" target={"_blank"}>T</Link> */}

      </nav>
    </header>
  )
}

export default NavBar

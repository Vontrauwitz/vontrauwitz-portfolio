"use client";

// App-Router-compatible fork of src/components/NavBar.js, created for
// Checkpoint 2.3. That file uses `useRouter` from `next/router` (Pages
// Router only), which throws when rendered without a mounted Pages Router
// context — which the App Router never provides. This fork is otherwise
// identical, ported to `next/navigation`'s `usePathname()`/`useRouter()`.
//
// The old src/components/NavBar.js is unchanged and still used by
// src/pages/_app.js for the routes that haven't migrated yet. Both exist
// side by side until Checkpoint 2.8 removes the Pages Router entirely, at
// which point this file becomes the only NavBar and the old one is deleted.
// See the Checkpoint 2.3 report for the full rationale.

import React, { useState, useEffect, useRef, type ComponentType } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { usePathname, useRouter } from 'next/navigation';
import {
  TwitterIcon,
  GithubIcon as GithubIconRaw,
  LinkedinIcon as LinkedinIconRaw,
  SunIcon,
  MoonIcon,
  InstagramIcon as InstagramIconRaw,
} from '@/components/Icons';
import { motion } from 'motion/react';
import UseThemeSwitcher from '@/components/hooks/useThemeSwitcher';

// Icons.js is still untyped JS (Checkpoint 2.9 converts it, not this one).
// TS infers `className` as a required prop for these three from their
// implementation, but every call site here renders them with no props at
// all (sized via the parent element's classes instead) — exactly as the
// original NavBar.js already did. Re-typing the import as accepting an
// optional className is compile-time only and changes nothing at runtime.
const InstagramIcon = InstagramIconRaw as ComponentType<{ className?: string }>;
const GithubIcon = GithubIconRaw as ComponentType<{ className?: string }>;
const LinkedinIcon = LinkedinIconRaw as ComponentType<{ className?: string }>;

type CustomLinkProps = {
  href: string;
  title: string;
  className?: string;
};

//! desktop
const CustomLink = ({ href, title, className = "" }: CustomLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${className} relative group`}
    >
      {title}
      <span
        className={`h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300
        ${pathname === href ? 'w-full' : 'w-0'}
        dark:bg-light`}

      >
        &nbsp;
      </span>
    </Link>
  );
};

type CustomMobilLinkProps = CustomLinkProps & {
  toggle: () => void;
};

//! mobile
const CustomMobilLink = ({ href, title, className = "", toggle }: CustomMobilLinkProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href)
  }

  return (
    <button
      className={`${className} relative group text-light dark:text-dark my-2`}
      onClick={handleClick}
    >
      {title}
      <span
        className={`h-[1px] inline-block bg-light absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300
        ${pathname === href ? 'w-full' : 'w-0'}
        dark:bg-dark`}

      >
        &nbsp;
      </span>
    </button>
  );
};

const NavBar = () => {

  // useThemeSwitcher.js is still untyped JS (converting it is Checkpoint 2.9's
  // job, not this one) — without a type annotation TS infers a plain array
  // (not a tuple), so both destructured elements come back typed as
  // `string | Dispatch<SetStateAction<string>>`. Asserting the real shape
  // here is compile-time only; it changes nothing at runtime.
  const [mode, setMode] = UseThemeSwitcher() as [string, (mode: string) => void];
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header
      className='w-full px-20 py-2 font-medium flex items-center justify-between dark:text-light relative'
    >

      <button className='flex-col justify-center items-center hidden lg:flex' onClick={handleClick}>
        <span className={`bg-dark dark:bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
        <span className={`bg-dark dark:bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`bg-dark dark:bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm translate-y-0.5 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
      </button>

      <Logo />

      {/* //! DESKTOP */}
      <div className='w-full flex justify-between items-center lg:hidden'>
        <nav>
          <CustomLink href="/" title="Home" className='mr-4' />
          <CustomLink href="/about" title="About" className='mx-4' />
          <CustomLink href="/projects" title="Projects" className='mx-4' />
          <CustomLink href="/contact" title="Contact" className='ml-4' />
        </nav>

        <nav
          className='flex items-center justify-center flex-wrap'
        >
          <motion.a href="https://www.instagram.com/trauwitz1/" target={"_blank"}
            className="w-6 mr-3"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <InstagramIcon />
          </motion.a>

          <motion.a href="https://github.com/Vontrauwitz" target={"_blank"}
            className="w-6 mx-3"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon />
          </motion.a>

          <motion.a href="https://www.linkedin.com/in/vontrauwitzdev/" target={"_blank"}
            className="w-6 ml-3 mr-6"
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

        </nav>
      </div>


      {/* //! MOBIL */}

      {
        isOpen ?
          <motion.div
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%", }}
            animate={{ scale: 1, opacity: 1 }}
            className='min-w-[70vw] flex flex-col justify-between z-30 items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark/90 dark:bg-light/75 rounded-lg backdrop-blur-md py-32'
            ref={menuRef}
          >
            <nav className='flex items-center flex-col justify-center'>
              <CustomMobilLink href="/" title="Home" className='' toggle={handleClick} />
              <CustomMobilLink href="/about" title="About" className='' toggle={handleClick} />
              <CustomMobilLink href="/projects" title="Projects" className='' toggle={handleClick} />
              <CustomMobilLink href="/contact" title="Contact" className='' toggle={handleClick} />
            </nav>

            <nav
              className='flex items-center justify-center flex-wrap mt-2'
            >
              <motion.a href="https://www.instagram.com/trauwitz1/" target={"_blank"}
                className="w-6 mr-3 sm:mx-1"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <InstagramIcon />
              </motion.a>

              <motion.a href="https://github.com/Vontrauwitz" target={"_blank"}
                className="w-6 mx-3 sm:mx-1 bg-light rounded-full dark:bg-dark"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <GithubIcon />
              </motion.a>

              <motion.a href="https://www.linkedin.com/in/vontrauwitzdev/" target={"_blank"}
                className="w-6 ml-3 sm:mx-1 "
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

            </nav>
          </motion.div>
          : null
      }



    </header>
  )
}

export default NavBar

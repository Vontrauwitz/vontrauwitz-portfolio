import React from 'react';
import Layout from './Layout';

const Footer = () => {
  return (
    <footer className='w-full flex flex-row items-center px-10 py-2 lg:py-3 justify-between border-t-2 border-solid border-dark font-medium text-lg lg:flex-col lg:py4 md:text-xs md:text-center dark:text-light dark:border-light'>
      <span>{new Date().getFullYear()} &copy; All Right Reserved.</span>
      <div className='flex items-center '>
        Designed and Developed by VonTrauwitzDev
      </div>
    </footer>
  );
}

export default Footer;

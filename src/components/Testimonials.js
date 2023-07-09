import Link from 'next/link';
import React from 'react';

const Testimonials = () => {
  return (
    <>
      <footer className='flex flex-row items-center justify-between'>

        <span>
          Designed and Developed by Vontrauwitz
        </span>
        <div>
          {new Date().getFullYear()} <span className='text-primary text-bold text-2xl px-1'>&copy;</span>All Right Reserved.</div>
      </footer>

    </>
  );
}

export default Testimonials;

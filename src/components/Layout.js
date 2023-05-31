import React from 'react';

const Layout = ({ children, className = "" }) => {
  return (
    <div className={`w-full h-full inline-block z-0 bg-light pl-16 pt-8 pr-16 ${className}`}>
      {children}
    </div>
  );
}

export default Layout;

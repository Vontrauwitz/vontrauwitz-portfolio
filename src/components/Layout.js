import React from 'react';

const Layout = ({ children, className = "" }) => {
  return (
    <div className={`w-full h-full bg-light dark:bg-dark p-4 sm:px-4 md:px-8 lg:px-8 xl:px-8 2xl:px-8 ${className}`}>
      <div className="mx-auto">{children}</div>
    </div>
  );
}

export default Layout;

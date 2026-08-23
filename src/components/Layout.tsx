import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const Layout = ({ children, className = "" }: LayoutProps) => {
  return (
    <div className={`w-full h-full bg-light dark:bg-dark p-4 sm:px-4 md:px-8 lg:px-8 xl:px-8 2xl:px-8 ${className}`}>
      <div className="mx-auto">{children}</div>
    </div>
  );
}

export default Layout;

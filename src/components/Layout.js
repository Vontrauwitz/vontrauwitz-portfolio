import React from 'react';

// const Layout = ({ children, className = "" }) => {
//   return (
//     <div className={`w-full h-full inline-block z-0 bg-light p-32 dark:bg-dark xl:p-24 lg:p-16 md:p-12 sm:p-8 ${className}`}>
//       {children}
//     </div>
//   );
// }

// export default Layout;



// const Layout = ({ children, className = "" }) => {
//   return (
//     <div className={`w-full h-full inline-block z-0 bg-light p-8 sm:p-12 md:p-16 lg:p-24 xl:p-32 2xl:p-40 ${className}`} style={{ paddingTop: '0', marginTop: '0' }}>
//       {children}
//     </div>
//   );
// }

// export default Layout;

const Layout = ({ children, className = "" }) => {
  return (
    <div className={`w-full h-full bg-light p-8 sm:px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-20 ${className}`}>
      <div className="mx-auto">{children}</div>
    </div>
  );
}

export default Layout;

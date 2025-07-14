// import React, { useRef, useEffect, useState } from 'react';
// import Scrollbars from 'react-custom-scrollbars';
// import { BrowserRouter as Router, useLocation } from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes';
// import NavHeader from './components/Admin/Navigation/NavHeader';
// import NavHeaderClient from './components/Client/Navigation/NavHeader';
// import { ToastContainer } from 'react-toastify';
// import { UserContext } from './context/UserContext';
// import { Rings } from 'react-loader-spinner';
// import 'react-toastify/dist/ReactToastify.css';

// const Layout = () => {
//   const scrollbarRef = useRef();
//   const location = useLocation();
//   const { user } = React.useContext(UserContext);
//   const [scrollHeight, setScrollHeight] = useState(window.innerHeight);

//   useEffect(() => {
//     setScrollHeight(window.innerHeight);
//   }, []);

//   // Scroll to top mỗi khi path đổi
//   useEffect(() => {
//     if (scrollbarRef.current) {
//       scrollbarRef.current.scrollToTop();
//     }
//   }, [location.pathname]);

//   const isAdminRoute = location.pathname.startsWith('/admin');

//   return (
//     <Scrollbars autoHide style={{ height: scrollHeight }} ref={scrollbarRef}>
//       {user && user.isLoading ? (
//         <div className="loading-container">
//           <Rings height="100" width="100" color="#1877f2" ariaLabel="loading" />
//           <div>Loading data...</div>
//         </div>
//       ) : (
//         <>
//           <div className="app-header">
//             {isAdminRoute ? <NavHeader /> : <NavHeaderClient />}
//           </div>
//           <div className="app-container">
//             <AppRoutes />
//           </div>
//         </>
//       )}

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick={false}
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </Scrollbars>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// };

// export default App;


import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import NavHeader from './components/Admin/Navigation/NavHeader';
import NavHeaderClient from './components/Client/Navigation/NavHeader';
import { ToastContainer } from 'react-toastify';
import { UserContext } from './context/UserContext';
import { Rings } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  const { user } = React.useContext(UserContext);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {user && user.isLoading ? (
        <div className="loading-container">
          <Rings height="100" width="100" color="#1877f2" ariaLabel="loading" />
          <div>Loading data...</div>
        </div>
      ) : (
        <>
          <div className="app-header">
            {isAdminRoute ? <NavHeader /> : <NavHeaderClient />}
          </div>
          <div className="app-container">
            <AppRoutes />
          </div>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;


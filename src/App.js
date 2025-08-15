import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import NavHeader from './components/Admin/Navigation/NavHeader';
import NavHeaderClient from './components/Client/Navigation/NavHeader';
import { ToastContainer } from 'react-toastify';
import { UserContext } from './context/UserContext';
import { Rings } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Client/Footer/Footer';
import axios from './setup/axios';
import './App.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const Layout = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // ✅ Cập nhật favicon theo API logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get('/api/v1/client/logo?section=logo');
        if (res?.EC === 0 && res?.DT?.image) {
          const logoUrl = `${BACKEND_URL}${res.DT.image}`;
          const favicon = document.querySelector("link[rel~='icon']");
          if (favicon) {
            favicon.href = logoUrl;
          } else {
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = logoUrl;
            document.head.appendChild(newFavicon);
          }
        }
      } catch (err) {
        console.error('Error fetching favicon logo:', err);
      }
    };

    fetchLogo();
  }, []);

  return (
    <>
      {user && user.isLoading ? (
        <div className="loading-container">
          <Rings height="100" width="100" color="#1877f2" ariaLabel="loading" />
          <div>Loading data...</div>
        </div>
      ) : (
        <div className="page-layout">
          <div className="app-header">
            {isAdminRoute ? <NavHeader /> : <NavHeaderClient />}
          </div>

          <div className="app-container">
            <AppRoutes />
          </div>

          <div className="app-footer">
            {!isAdminRoute && <Footer />}
          </div>
        </div>
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

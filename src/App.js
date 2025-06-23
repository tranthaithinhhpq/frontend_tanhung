import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useContext } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Rings } from 'react-loader-spinner';
import { UserContext } from './context/UserContext';
import Scrollbars from 'react-custom-scrollbars';


const App = () => {
  const { user } = useContext(UserContext);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    let windowHeight = window.innerHeight;
    setScrollHeight(windowHeight);
  }, [user]);

  return (
    <Scrollbars autoHide style={{ height: scrollHeight }}>
      <Router>
        {user && user.isLoading ? (
          <div className="loading-container">
            <Rings
              height="100"
              width="100"
              color="#1877f2"
              ariaLabel="loading"
            />
            <div>Loading data...</div>
          </div>
        ) : (
          <>


            <div className="app-header">
              <NavHeader />
            </div>


            <div className="app-container">
              <AppRoutes />
            </div>
          </>
        )}
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Scrollbars>
  );
}

export default App;
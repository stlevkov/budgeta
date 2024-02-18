import React, { Suspense, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './index.css';
import Login from './login/login'

// const Login = React.lazy(() => import('./login/login')); // Lazy load the Login component
const App = React.lazy(() => import('./App')); // Lazy load the App component

function AppRouter() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ProSidebarProvider>
          <MainRouter />
        </ProSidebarProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

function MainRouter() {
  const location = useLocation();
  const [showApp, setShowApp] = useState(location.pathname === '/');

  useEffect(() => {
    setShowApp(location.pathname === '/');
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Suspense fallback={<LoadingSpinner />}><Login /></Suspense>} />
      {showApp && <Route path="/" element={<Suspense fallback={<LoadingSpinner />}><App /></Suspense>} />}
    </Routes>
  );
}

function LoadingSpinner() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<AppRouter />);

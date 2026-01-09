import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useNavigate, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app'; // Renamed to avoid conflict

import './index.css';
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Focusmode from './pages/Focusmode.jsx';
import Tools from './pages/Tools.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import GoogleAuth from './components/GoogleAuth.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StatusBar, Style } from '@capacitor/status-bar';

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#ffffff' });
  StatusBar.setOverlaysWebView({ overlay: false });
}

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setupListener = async () => {
      const backListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/' || location.pathname === '/dashboard') {
          CapApp.exitApp();
        } else {
          navigate(-1);
        }
      });
      return backListener;
    };

    const listenerPromise = setupListener();

    return () => {
      listenerPromise.then(l => l.remove());
    };
  }, [location, navigate]);

  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <BackButtonHandler />
        <App />
      </>
    ),
  },
  { path: '/auth', element: <GoogleAuth /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  {
    path: '/dashboard',
    element: <ProtectedRoute><BackButtonHandler /><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/focusmode',
    element: <ProtectedRoute><BackButtonHandler /><Focusmode /></ProtectedRoute>
  },
  {
    path: '/tools',
    element: <ProtectedRoute><BackButtonHandler /><Tools /></ProtectedRoute>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
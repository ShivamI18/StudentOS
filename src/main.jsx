import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Focusmode from './pages/Focusmode.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GoogleAuth from './components/GoogleAuth.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Tools from './pages/Tools.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path:'/auth',
    element:<GoogleAuth/>
  },
  {
    path:'/verify-email',
    element:<VerifyEmail/>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard/></ProtectedRoute>,
  },
  {
    path:'/focusmode',
    element: <ProtectedRoute><Focusmode /></ProtectedRoute>
  },
  {
    path:'/tools',
    element: <ProtectedRoute><Tools/></ProtectedRoute>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)

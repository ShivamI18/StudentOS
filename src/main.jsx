import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Session from './pages/Session.jsx'
import Analysis from './pages/Analysis.jsx'
import Notes from './pages/Notes.jsx'
import Focusmode from './pages/Focusmode.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GoogleAuth from './components/GoogleAuth.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

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
    children:[
      {
        path:'/dashboard/session',
        element: <Session/>
      },
      {
        path:'/dashboard/analysis',
        element: <Analysis/>
      },
      {
        path:'/dashboard/notes',
        element: <Notes />
      }
    ]
  },
  {
    path:'/focusmode',
    element: <ProtectedRoute><Focusmode /></ProtectedRoute>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)

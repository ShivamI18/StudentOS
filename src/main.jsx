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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
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
    element: <Focusmode />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)

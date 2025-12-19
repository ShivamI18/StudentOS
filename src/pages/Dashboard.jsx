import React from 'react'
import { Link,Outlet } from 'react-router-dom'
const Dashboard = () => {
  return (
    <div>
      Dashboard - <nav>
        <Link to={'/dashboard/session'} >Session</Link>
        <Link to={'/dashboard/analysis'} >Analysis</Link>
        <Link to={'/dashboard/notes'} >Notes</Link>
        </nav> 
        <Outlet />

    </div>
  )
}

export default Dashboard

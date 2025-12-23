import React from "react";
import { useState, useEffect } from "react";
import { Link,Outlet } from "react-router-dom";
const Dashboard = () => {
  return (
    <div>
      <div>Dashboard - <Link to={'/focusmode'}>Focus Mode</Link></div>
      <div>Profile: Name: Shivam Ingulkar</div>
      <div>Analysis: <span>Total time Spent: 2hrs</span> </div>
      <nav>
        <Link to={'/dashboard/session'} >Sessions</Link>
        <Link to={'/dashboard/analysis'}>Analysis</Link>
        <Link to={'/dashboard/notes'}>Notes</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await UsageStats.getUsageStats();

      // Sort: Most used apps first
      const sortedData = result.data.sort(
        (a, b) => b.totalTimeForeground - a.totalTimeForeground
      );

      setUsageData(sortedData);
    } catch (err) {
      console.error("Error:", err);
      // Alert the user why they are being sent to settings
      alert("Please enable 'Usage Access' for this app in the next screen.");
      await UsageStats.openUsageAccessSettings();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={logout}
        className="authbtn"
        style={{
          position: "fixed",
          right: "0",
          top: "0",
          margin: "1em",
          fontSize: "0.8em",
        }}
      >
        log out
      </button>
      <div className="dashboardcontainer">
        <div
          className="monebold"
        >
          Welcome Back!
        </div>
        <div className="appusage">
          <h3>Today's App Usage</h3>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="switchbtn"
          >
            {loading ? "Fetching..." : "Refresh Usage Data"}
          </button>
          {usageData.map((app, index) => (
          <div key={index} style={{ 
            borderBottom: '1px solid #ddd', 
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <strong>{app.packageName}</strong>
            <span>{app.totalTimeForeground}</span>
          </div>
        ))}
        </div>
        <div className="navsection">
          <NavLink style={({ isActive }) => ({
            padding: "1em",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#fff" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })} to={"/dashboard/session"}>Sessions</NavLink>
          <NavLink style={({ isActive }) => ({
            padding: "1em",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#fff" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })} to={"/dashboard/analysis"}>Analysis</NavLink>
          <NavLink style={({ isActive }) => ({
            padding: "1em",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#fff" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })} to={"/dashboard/notes"}>Notes</NavLink>
        <Outlet />
        </div>
      </div>
      <div className="navcontainer">
        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#fff" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })}
          className="flex-col monthin"
          to={"/dashboard"}
        >
          Dashboard
        </NavLink>

        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#fff" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })}
          className="flex-col monthin"
          to={"/focusmode"}
        >
          Focus
        </NavLink>

        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            background: isActive ? "#1d4ed8" : "transparent",
            color: isActive ? "#fff" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })}
          className="flex-col monthin"
          to={"/"}
        >
          Insight
        </NavLink>
      </div>
    </div>
  );
};

export default Dashboard;

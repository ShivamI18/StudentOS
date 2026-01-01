import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import UsageStats from "../plugins/usageStats.js";
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
        // (a, b) => b.totalTimeForegroundMs - a.totalTimeForegroundMs
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
        <div className="monebold">Welcome Back!</div>
        <div className="appusage">
          <h3>Today's App Usage</h3>
          <button onClick={fetchStats} disabled={loading} className="switchbtn">
            {loading ? "Fetching..." : "Refresh Usage Data"}
          </button>
          <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            {usageData.map((app, index) => {
              // Calculate percentage for the bar
              // maxTime can be the max time in dataset for scaling
              const maxTime = Math.max(
                ...usageData.map((a) => a.totalTimeForegroundMs)
              );
              const percentage = Math.round(
                (app.totalTimeForegroundMs / maxTime) * 100
              );

              return (
                <div
                  key={index}
                  style={{
                    marginBottom: "16px",
                  }}
                >
                  {/* App name and time */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>
                      {app.appName}
                    </span>
                    <span style={{ fontSize: "12px", color: "#555" }}>
                      {app.totalTimeForeground + "(HRS:MIN)"}
                    </span>
                  </div>

                  {/* Range bar */}
                  <div
                    style={{
                      height: "10px",
                      width: "100%",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: '#1d4ed8',
                        borderRadius: "5px",
                        transition: "width 0.5s ease-in-out",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="navfeature">
          <div className="navlink">
            <NavLink
              style={({ isActive }) => ({
                padding: "1em 2em",
                background: isActive ? "#1d4ed8" : "transparent",
                color: isActive ? "#fff" : "#000",
                fontSize: "0.7em",
                borderRadius:'2em',
              })}
              to={"/dashboard/session"}
            >
              Sessions
            </NavLink>
            <NavLink
              style={({ isActive }) => ({
                padding: "1em 2em",
                background: isActive ? "#1d4ed8" : "transparent",
                color: isActive ? "#fff" : "#000",
                fontSize: "0.7em",
                borderRadius:'2em',
              })}
              to={"/dashboard/analysis"}
            >
              Analysis
            </NavLink>
            <NavLink
              style={({ isActive }) => ({
                padding: "1em 2em",
                background: isActive ? "#1d4ed8" : "transparent",
                color: isActive ? "#fff" : "#000",
                fontSize: "0.7em",
                borderRadius:'2em',
              })}
              to={"/dashboard/notes"}
            >
              Notes
            </NavLink>
          </div>
          <Outlet />
        </div>
      </div>
      <div className="navcontainer">
        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            color: isActive ? "#1d4ed8" : "#000",
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
            color: isActive ? "#1d4ed8" : "#000",
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
            color: isActive ? "#1d4ed8" : "#000",
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

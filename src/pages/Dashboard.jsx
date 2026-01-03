import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import UsageStats from "../plugins/usageStats.js";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [apprefreshtime, setApprefreshtime] = useState("");

  const fetchSessions = async () => {
    if (!user) return;

    const sessionsRef = collection(db, "users", user.uid, "sessions");
    const q = query(sessionsRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    const sessionsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(sessionsData);

    setSessions(sessionsData);
  };

  useEffect(() => {
    fetchSessions();
    fetchStats();
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12;

    setApprefreshtime(`${hours}:${minutes}${ampm}`);
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await UsageStats.getUsageStats();
      const sortedData = result.data.sort();
      setUsageData(sortedData);
    } catch (err) {
      console.error("Error:", err);
      alert("Please enable 'Usage Access' for this app in the next screen.");
      await UsageStats.openUsageAccessSettings();
    } finally {
      setLoading(false);
    }
  };

  const updateTime = () => {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // convert 0 → 12

    setTime(`${hours}:${minutes}${ampm}`);
  };

  function formatSessionDate(timestamp) {
    if (!timestamp) return "";

    const date = timestamp.toDate?.() ?? new Date(timestamp);

    const day = date.getDate();
    const month = date
      .toLocaleString("en-GB", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    const time = date
      .toLocaleString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();

    return `${day} ${month} ${year} - ${time}`;
  }

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
          <div>last refresh: {apprefreshtime}</div>
          <button
            onClick={() => {
              fetchStats();
              updateTime();
            }}
            disabled={loading}
            className="switchbtn"
          >
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
                        backgroundColor: "#1d4ed8",
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
          <div>
            <h2>Sessions</h2>

            {sessions.length === 0 && <p>No sessions found.</p>}

            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSession(session);
                }}
                className="sessioncard"
              >
                <div
                  style={{
                    borderBottom: " 2px solid rgba(0,0,0,0.1)",
                    padding: "0 0 1em 0",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {formatSessionDate(session.createdAt)}
                </div>
                <div>
                  {session.userData.subject} - {session.userData.topics}
                </div>
                <div>Time Spent: {session.userData.time} mins</div>
              </div>
            ))}
            {activeSession && (
              <div
                className="session-overlay"
                onClick={() => setActiveSession(null)}
              >
                <div
                  className="session-modal"
                  onClick={(e) => e.stopPropagation()} // prevent close on inner click
                >
                  <button
                    className="close-btn"
                    onClick={() => setActiveSession(null)}
                  >
                    ✕
                  </button>

                  <h2>{formatSessionDate(activeSession.createdAt)}</h2>
                  <p>
                    <strong>Subject:</strong> {activeSession.userData.subject}
                  </p>
                  <p>
                    <strong>Topics:</strong> {activeSession.userData.topics}
                  </p>
                  <p>
                    <strong>Time Spent:</strong> {activeSession.userData.time}
                    mins
                  </p>
                  <div>Analysis: {activeSession.Analysis.analysis} </div>
                  <div>notes: {activeSession.Analysis.notes}</div>
                  <div>
                    Question:{" "}
                    <ol style={{
                      listStyleType:'decimal',
                      listStyle:'inside'
                    }}>
                      {activeSession.Analysis.questions.map((itm, idx) => {
                        return (
                          <div style={{
                            padding:'0.5em 0'
                          }}>
                          <li>
                            {itm.q}
                          </li>
                          <div>Ans: {itm.a}</div>
                          </div>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
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
          to={"/tools"}
        >
          Tools
        </NavLink>
      </div>
    </div>
  );
};

export default Dashboard;

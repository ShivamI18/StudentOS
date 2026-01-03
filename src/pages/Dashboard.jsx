import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div
  style={{
    minHeight: "100vh",
    backgroundColor: "#ECEFF4",
    paddingBottom: "10vh",
  }}
>
  {/* Logout */}
  <button
    onClick={logout}
    style={{
      position: "fixed",
      top: "2vh",
      right: "4vw",
      padding: "0.6rem 1.2rem",
      fontSize: "0.75rem",
      borderRadius: "1rem",
      border: "none",
      backgroundColor: "#ECEFF4",
      color: "#5E81AC",
      boxShadow:
        "0.3rem 0.3rem 0.6rem #D1D9E6, -0.3rem -0.3rem 0.6rem #FFFFFF",
      cursor: "pointer",
      zIndex: 10,
    }}
  >
    Log out
  </button>

  {/* Main content */}
  <div
    style={{
      padding: "6vh 5vw 2vh",
      maxWidth: "60rem",
      margin: "0 auto",
    }}
  >
    <div
      style={{
        fontSize: "1.6rem",
        fontWeight: "600",
        color: "#2E3440",
        marginBottom: "2rem",
      }}
    >
      Welcome Back!
    </div>

    {/* App Usage Card */}
    <div
      style={{
        backgroundColor: "#ECEFF4",
        borderRadius: "1.5rem",
        padding: "2rem",
        marginBottom: "2.5rem",
        boxShadow:
          "0.6rem 0.6rem 1.2rem #D1D9E6, -0.6rem -0.6rem 1.2rem #FFFFFF",
      }}
    >
      <h3
        style={{
          fontSize: "1.2rem",
          color: "#2E3440",
          marginBottom: "0.5rem",
        }}
      >
        Today’s App Usage
      </h3>

      <div
        style={{
          fontSize: "0.75rem",
          color: "#4C566A",
          marginBottom: "1rem",
        }}
      >
        Last refresh: {apprefreshtime}
      </div>

      <button
        onClick={() => {
          fetchStats();
          updateTime();
        }}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.8rem",
          marginBottom: "1.5rem",
          borderRadius: "1rem",
          border: "none",
          fontSize: "0.85rem",
          backgroundColor: "#ECEFF4",
          color: "#5E81AC",
          boxShadow:
            "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
        }}
      >
        {loading ? "Fetching..." : "Refresh Usage Data"}
      </button>

      <div style={{ width: "100%" }}>
        {usageData.map((app, index) => {
          const maxTime = Math.max(
            ...usageData.map((a) => a.totalTimeForegroundMs)
          );
          const percentage = Math.round(
            (app.totalTimeForegroundMs / maxTime) * 100
          );

          return (
            <div key={index} style={{ marginBottom: "1.2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  marginBottom: "0.4rem",
                  color: "#2E3440",
                }}
              >
                <span>{app.appName}</span>
                <span style={{ color: "#4C566A" }}>
                  {app.totalTimeForeground}
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "0.6rem",
                  backgroundColor: "#D1D9E6",
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: "#5E81AC",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Sessions */}
    <div>
      <h2
        style={{
          fontSize: "1.3rem",
          color: "#2E3440",
          marginBottom: "1rem",
        }}
      >
        Sessions
      </h2>

      {sessions.length === 0 && (
        <p style={{ color: "#4C566A", fontSize: "0.85rem" }}>
          No sessions found.
        </p>
      )}

      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => setActiveSession(session)}
          style={{
            padding: "1.2rem",
            marginBottom: "1rem",
            borderRadius: "1.2rem",
            backgroundColor: "#ECEFF4",
            boxShadow:
              "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "#4C566A",
              marginBottom: "0.6rem",
            }}
          >
            {formatSessionDate(session.createdAt)}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#2E3440" }}>
            {session.userData.subject} – {session.userData.topics}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#4C566A" }}>
            Time Spent: {session.userData.time} mins
          </div>
        </div>
      ))}
    </div>
  </div>
  {activeSession && (
  <div
    onClick={() => setActiveSession(null)}
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(236,239,244,0.85)",
      backdropFilter: "blur(6px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5vh 5vw",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        height: "80vh",
        maxWidth: "50rem",
        backgroundColor: "#ECEFF4",
        borderRadius: "1.5rem",
        padding: "2rem",
        overflowY: "auto",
        boxShadow:
          "0.8rem 0.8rem 1.6rem #D1D9E6, -0.8rem -0.8rem 1.6rem #FFFFFF",
        position: "relative",
      }}
    >
      {/* Close */}
      <button
        onClick={() => setActiveSession(null)}
        style={{
          position: "absolute",
          top: "1.2rem",
          right: "1.2rem",
          border: "none",
          background: "none",
          fontSize: "1.2rem",
          cursor: "pointer",
          color: "#4C566A",
        }}
      >
        ✕
      </button>

      <h2
        style={{
          fontSize: "1.4rem",
          color: "#2E3440",
          marginBottom: "1rem",
        }}
      >
        {formatSessionDate(activeSession.createdAt)}
      </h2>

      <p style={{ fontSize: "0.9rem", color: "#4C566A" }}>
        <strong>Subject:</strong> {activeSession.userData.subject}
      </p>

      <p style={{ fontSize: "0.9rem", color: "#4C566A" }}>
        <strong>Topics:</strong> {activeSession.userData.topics}
      </p>

      <p style={{ fontSize: "0.9rem", color: "#4C566A", marginBottom: "1rem" }}>
        <strong>Time Spent:</strong> {activeSession.userData.time} mins
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Analysis:</strong>
        <div style={{ fontSize: "0.85rem", color: "#4C566A" }}>
          {activeSession.Analysis.analysis}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Notes:</strong>
        <div style={{ fontSize: "0.85rem", color: "#4C566A" }}>
          {activeSession.Analysis.notes}
        </div>
      </div>

      <div>
        <strong>Questions:</strong>
        <ol
          style={{
            listStyle: "decimal inside",
            padding: 0,
            marginTop: "0.5rem",
          }}
        >
          {activeSession.Analysis.questions.map((itm, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "0.8rem",
                fontSize: "0.85rem",
                color: "#2E3440",
              }}
            >
              {itm.q}
              <div style={{ color: "#4C566A", marginTop: "0.2rem" }}>
                Ans: {itm.a}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </div>
)}


  {/* Bottom Nav */}
  <div
    style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      height: "8vh",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#ECEFF4",
      boxShadow:
        "0 -0.4rem 0.8rem #D1D9E6, 0 0.4rem 0.8rem #FFFFFF",
    }}
  >
    {[
      { label: "Dashboard", path: "/dashboard" },
      { label: "Focus", path: "/focusmode" },
      { label: "Tools", path: "/tools" },
    ].map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        style={({ isActive }) => ({
          fontSize: "0.75rem",
          color: isActive ? "#5E81AC" : "#4C566A",
          textDecoration: "none",
        })}
      >
        {item.label}
      </NavLink>
    ))}
  </div>
</div>

  );
};

export default Dashboard;

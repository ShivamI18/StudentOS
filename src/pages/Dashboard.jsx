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

    setApprefreshtime(`${hours}:${minutes}${ampm}`);
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
    background: "linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%)",
    paddingBottom: "12vh",
    fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#4A4A4A",
  }}
>
  {/* Logout */}
  <button
    onClick={logout}
    style={{
      position: "fixed",
      top: "1.5rem",
      right: "1.2rem",
      padding: "0.6rem 1.2rem",
      fontSize: "0.75rem",
      borderRadius: "100px",
      border: "1px solid rgba(255, 183, 197, 0.3)",
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "#D6336C",
      boxShadow: "0 4px 15px rgba(214, 51, 108, 0.08)",
      cursor: "pointer",
      zIndex: 100,
      fontWeight: 600,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}
  >
    Log out
  </button>

  {/* Main content */}
  <div
    style={{
      padding: "5rem 1.25rem 2rem",
      maxWidth: "48rem",
      margin: "0 auto",
    }}
  >
    <div
      style={{
        fontSize: "2rem",
        fontWeight: 700,
        color: "#2D3436",
        marginBottom: "2rem",
        letterSpacing: "-0.02em",
      }}
    >
      Welcome Back <span style={{ opacity: 0.8 }}>🌸</span>
    </div>

    {/* App Usage */}
    <div
      style={{
        padding: "1.75rem",
        marginBottom: "2.5rem",
        borderRadius: "2rem",
        background: "#FFFFFF",
        border: "1px solid rgba(255, 225, 230, 0.5)",
        boxShadow: "0 20px 40px rgba(255, 183, 197, 0.12)",
      }}
    >
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "#2D3436",
          marginBottom: "0.25rem",
        }}
      >
        Today’s App Usage
      </h3>

      <div
        style={{
          fontSize: "0.75rem",
          color: "#A0A0A0",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFB7C5" }}></span>
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
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "1.25rem",
          border: "none",
          fontSize: "0.9rem",
          fontWeight: 600,
          background: "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)",
          color: "#FFFFFF",
          boxShadow: "0 10px 25px rgba(255, 143, 177, 0.3)",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Refreshing..." : "Refresh Usage Data"}
      </button>

      {usageData.map((app, index) => {
        const maxTime = Math.max(
          ...usageData.map((a) => a.totalTimeForegroundMs)
        );
        const percentage = Math.round(
          (app.totalTimeForegroundMs / maxTime) * 100
        );

        return (
          <div key={index} style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
                color: "#4A4A4A",
                fontWeight: 500,
              }}
            >
              <span style={{ color: "#2D3436" }}>{app.appName}</span>
              <span style={{ color: "#FF8FB1", fontWeight: 600 }}>
                {app.totalTimeForeground}
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "0.5rem",
                backgroundColor: "#FFF0F3",
                borderRadius: "100px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #FFB7C5, #FF8FB1)",
                  borderRadius: "100px",
                  transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>

    {/* Sessions */}
    <div>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#2D3436",
          marginBottom: "1.25rem",
          paddingLeft: "0.5rem",
        }}
      >
        Recent Sessions
      </h2>

      {sessions.length === 0 && (
        <p style={{ color: "#A0A0A0", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
          No sessions found yet.
        </p>
      )}

      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => setActiveSession(session)}
          style={{
            padding: "1.5rem",
            marginBottom: "1rem",
            borderRadius: "1.5rem",
            background: "#FFFFFF",
            border: "1px solid rgba(255, 225, 230, 0.4)",
            boxShadow: "0 10px 25px rgba(255, 183, 197, 0.08)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              color: "#FF8FB1",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            {formatSessionDate(session.createdAt)}
          </div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#2D3436",
              marginBottom: "0.25rem",
            }}
          >
            {session.userData.subject}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#636E72", display: "flex", justifyContent: "space-between" }}>
            <span>{session.userData.topics}</span>
            <span style={{ fontWeight: 500 }}>{session.userData.time}m</span>
          </div>
        </div>
      ))}

      {activeSession && (
        <div
          onClick={() => setActiveSession(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(45, 52, 54, 0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              height: "88vh",
              maxWidth: "42rem",
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: "2.5rem",
              borderTopRightRadius: "2.5rem",
              padding: "1.5rem 1.5rem 3rem",
              overflowY: "auto",
              boxShadow: "0 -20px 50px rgba(0,0,0,0.1)",
              animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <style>
              {`
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              `}
            </style>
            
            {/* Drag Indicator */}
            <div
              style={{
                width: "2.5rem",
                height: "0.3rem",
                background: "#FFE0E6",
                borderRadius: "100px",
                margin: "0 auto 2rem",
              }}
            />

            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#2D3436",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              {formatSessionDate(activeSession.createdAt)}
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "100px",
                  backgroundColor: "#FFF0F3",
                  color: "#D6336C",
                  fontWeight: 600,
                  border: "1px solid rgba(255, 183, 197, 0.3)",
                }}
              >
                📘 {activeSession.userData.subject}
              </span>

              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "100px",
                  backgroundColor: "#FFF0F3",
                  color: "#D6336C",
                  fontWeight: 600,
                  border: "1px solid rgba(255, 183, 197, 0.3)",
                }}
              >
                ⏱ {activeSession.userData.time} mins
              </span>
            </div>

            <div style={{ padding: "0 0.5rem" }}>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#636E72",
                  lineHeight: "1.6",
                  marginBottom: "2rem",
                }}
              >
                <strong style={{ color: "#2D3436", display: "block", marginBottom: "0.25rem" }}>Topics Explored</strong>{" "}
                {activeSession.userData.topics}
              </p>

              <div
                style={{
                  height: "1px",
                  background: "linear-gradient(90deg, rgba(255,183,197,0) 0%, rgba(255,183,197,0.5) 50%, rgba(255,183,197,0) 100%)",
                  margin: "2rem 0",
                }}
              />

              {/* Analysis */}
              <section style={{ marginBottom: "2rem" }}>
                <strong
                  style={{
                    fontSize: "0.95rem",
                    color: "#2D3436",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  Insights & Analysis
                </strong>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#636E72",
                    lineHeight: "1.7",
                    padding: "1.25rem",
                    backgroundColor: "#FFF9FA",
                    borderRadius: "1.25rem",
                    border: "1px solid rgba(255, 183, 197, 0.2)",
                  }}
                >
                  {activeSession.Analysis.analysis}
                </div>
              </section>

              {/* Notes */}
              <section style={{ marginBottom: "2rem" }}>
                <strong
                  style={{
                    fontSize: "0.95rem",
                    color: "#2D3436",
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  Key Notes
                </strong>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#636E72",
                    lineHeight: "1.7",
                    paddingLeft: "0.5rem",
                  }}
                >
                  {activeSession.Analysis.notes}
                </p>
              </section>

              {/* Questions */}
              <section>
                <strong
                  style={{
                    fontSize: "0.95rem",
                    color: "#2D3436",
                    display: "block",
                    marginBottom: "1rem",
                    fontWeight: 700,
                  }}
                >
                  Review Questions
                </strong>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {activeSession.Analysis.questions.map((q, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "1.25rem",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #F0F0F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#2D3436",
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {q.q}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#FF8FB1",
                          fontWeight: 500,
                          fontStyle: "italic",
                        }}
                      >
                        {q.a}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Bottom Nav */}
  <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "24rem",
        height: "4.5rem",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "100px",
        boxShadow: "0 15px 35px rgba(255, 143, 177, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        zIndex: 100,
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
            fontSize: "0.8rem",
            fontWeight: 700,
            color: isActive ? "#D6336C" : "#A0A0A0",
            textDecoration: "none",
            padding: "0.75rem 1rem",
            borderRadius: "100px",
            backgroundColor: isActive ? "#FFF0F3" : "transparent",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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

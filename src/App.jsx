import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function App() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      }
    }
  }, []);
  return (
<div
  style={{
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, #FFF8F9 0%, #FFFFFF 100%)",
    padding: "0 8vw",
    /* Upgraded Font Stack: Prioritizes SF Pro, Inter, and modern system weight-variable fonts */
    fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif",
    color: "#2D3436",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    animation: "fadeIn 1.4s ease-out",
  }}
>
  <style>
    {`
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes softPulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
    `}
  </style>

  {/* Top Bar */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4.5vh 0",
      marginBottom: "2vh",
    }}
  >
    <div style={{ 
      fontSize: "1.3rem", 
      fontWeight: 800, 
      letterSpacing: "-0.04em", 
      color: "#1A1A1A" 
    }}>
      Student<span style={{ color: "#FFB7C5", fontWeight: 900 }}>OS</span>
    </div>

    <Link
      to="/auth"
      style={{
        padding: "0.65rem 1.5rem",
        borderRadius: "40px",
        fontSize: "0.85rem",
        fontWeight: 600,
        textDecoration: "none",
        color: "#FF8E9D",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 183, 197, 0.25)",
        boxShadow: "0 8px 20px rgba(255, 142, 157, 0.12)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      Login
    </Link>
  </div>

  {/* Hero */}
  <div style={{ textAlign: "center", marginBottom: "6vh" }}>
    <div
      style={{
        fontSize: "2.8rem",
        fontWeight: 800,
        lineHeight: "1.05",
        letterSpacing: "-0.06em",
        marginBottom: "1.5rem",
        color: "#1A1A1A",
      }}
    >
      Focus better.
      <br />
      <span style={{ 
        background: "linear-gradient(135deg, #FFB7C5 0%, #FF8E9D 100%)", 
        WebkitBackgroundClip: "text", 
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.05em"
      }}>
        Live smarter.
      </span>
    </div>

    <div
      style={{
        fontSize: "1.1rem",
        color: "#636E72",
        lineHeight: "1.7",
        padding: "0 2vw",
        maxWidth: "480px",
        margin: "0 auto",
        fontWeight: 450,
        letterSpacing: "-0.01em",
        opacity: 0.95
      }}
    >
      StudentOS helps you focus, track habits, and understand your time — all in
      one calm, distraction-free app.
    </div>
  </div>

  {/* Primary CTA */}
  <div style={{ textAlign: "center", marginBottom: "8vh" }}>
    <Link
      to="/auth"
      style={{
        display: "inline-block",
        padding: "1.2rem 3.4rem",
        borderRadius: "100px",
        fontSize: "1.05rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        textDecoration: "none",
        color: "#FFFFFF",
        background: "linear-gradient(135deg, #FFB7C5 0%, #FF8E9D 100%)",
        boxShadow: "0 18px 40px rgba(255, 142, 157, 0.4)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      Get Started
    </Link>
  </div>

  {/* Features */}
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: "2.5rem", 
    maxWidth: "420px", 
    margin: "0 auto" 
  }}>
    {[
      {
        title: "Focus Timer",
        text: "Scientifically timed sessions to keep your mind sharp.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#FF8E9D"><path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Zm320-80Zm0-640Z"/></svg>,
      },
      {
        title: "Habit Tracker",
        text: "Build lasting routines with gentle daily reminders.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#FF8E9D"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-22-81-33t-91-11q-134 0-227 93t-93 227q0 134 93 227t227 93q134 0 227-93t93-227q0-24-3-47.5T784-616l62-62q20 46 27 94.5t7 99.5q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>,
      },
      {
        title: "Todo List",
        text: "Minimalist task management for clarity of thought.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#FF8E9D"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 400v-560 560Z"/></svg>,
      },
      {
        title: "Usage Tracking",
        text: "See exactly where your attention goes every day.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#FF8E9D"><path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>,
      },
      {
        title: "Reflections",
        text: "Understand distractions and improve over time.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#FF8E9D"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/></svg>,
      },
    ].map((f, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          animation: `slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both ${0.6 + i * 0.1}s`,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: "56px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 240, 243, 0.8)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 183, 197, 0.3)",
            boxShadow: "0 4px 15px rgba(255, 142, 157, 0.08)",
          }}
        >
          {f.icon}
        </div>

        <div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: "0.2rem",
              letterSpacing: "-0.03em"
            }}
          >
            {f.title}
          </div>
          <div
            style={{
              fontSize: "0.92rem",
              color: "#636E72",
              lineHeight: "1.5",
              fontWeight: 400,
              letterSpacing: "-0.01em"
            }}
          >
            {f.text}
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Footer */}
  <div
    style={{
      marginTop: "10vh",
      paddingBottom: "5vh",
      textAlign: "center",
      fontSize: "0.82rem",
      color: "#B2BEC3",
      fontWeight: 600,
      letterSpacing: "0.02em",
      animation: "softPulse 3s infinite ease-in-out"
    }}
  >
    © 2026 StudentOS — Designed for calm productivity 🌸
  </div>
</div>
  );
}

export default App;

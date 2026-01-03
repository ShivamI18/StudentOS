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
    backgroundColor: "#EEF2F7",
    padding: "3vh 5vw",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#1F2937",
  }}
>
  {/* Top Bar */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6vh",
    }}
  >
    <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>
      Student<span style={{ color: "#2563EB" }}>OS</span>
    </div>

    <Link
      to={"/auth"}
      style={{
        padding: "0.6rem 1.4rem",
        borderRadius: "1rem",
        fontSize: "0.85rem",
        textDecoration: "none",
        color: "#2563EB",
        backgroundColor: "#EEF2F7",
        boxShadow:
          "0.4rem 0.4rem 0.8rem #C8D0DA, -0.4rem -0.4rem 0.8rem #FFFFFF",
      }}
    >
      Login
    </Link>
  </div>

  {/* Hero Section */}
  <div
    style={{
      padding: "4vh 6vw",
      borderRadius: "2.2rem",
      backgroundColor: "#EEF2F7",
      boxShadow:
        "1rem 1rem 2rem #C8D0DA, -1rem -1rem 2rem #FFFFFF",
      textAlign: "center",
      marginBottom: "8vh",
    }}
  >
    <div
      style={{
        fontSize: "2.2rem",
        fontWeight: 800,
        lineHeight: "1.2",
        marginBottom: "1.5rem",
      }}
    >
      Stay Focused.
      <br />
      <span style={{ color: "#2563EB" }}>Be Productive.</span>
    </div>

    <div
      style={{
        fontSize: "1rem",
        color: "#6B7280",
        lineHeight: "1.6",
        maxWidth: "32rem",
        margin: "0 auto",
      }}
    >
      StudentOS helps you manage focus, track habits, and understand how you
      spend your time — built specifically for students.
    </div>

    <div style={{ marginTop: "2.5rem" }}>
      <Link
        to={"/auth"}
        style={{
          padding: "1rem 2.6rem",
          borderRadius: "1.6rem",
          fontSize: "1rem",
          fontWeight: 600,
          textDecoration: "none",
          color: "#2563EB",
          backgroundColor: "#EEF2F7",
          boxShadow:
            "0.5rem 0.5rem 1rem #C8D0DA, -0.5rem -0.5rem 1rem #FFFFFF",
          display: "inline-block",
        }}
      >
        Get Started
      </Link>
    </div>
  </div>

  {/* Features */}
  <div
    style={{
      display: "grid",
      gap: "2.5rem",
      marginBottom: "10vh",
    }}
  >
    {[
      {
        title: "Focus Timer",
        text:
          "Scientifically-timed Pomodoro sessions to help you stay deeply focused.",
        icon: "⏱️",
      },
      {
        title: "Usage Tracking",
        text:
          "Understand which apps consume your attention and time each day.",
        icon: "📊",
      },
      {
        title: "Session Reflections",
        text:
          "Review your sessions and reflect on what helped or distracted you.",
        icon: "📓",
      },
      {
        title: "AI Insights",
        text:
          "Smart recommendations based on your productivity patterns.",
        icon: "🧠",
      },
    ].map((f, i) => (
      <div
        key={i}
        style={{
          padding: "2.2rem",
          borderRadius: "2rem",
          backgroundColor: "#EEF2F7",
          boxShadow:
            "0.6rem 0.6rem 1.2rem #C8D0DA, -0.6rem -0.6rem 1.2rem #FFFFFF",
        }}
      >
        <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
          {f.icon}
        </div>
        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          {f.title}
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            color: "#6B7280",
            lineHeight: "1.5",
          }}
        >
          {f.text}
        </div>
      </div>
    ))}
  </div>

  {/* Footer */}
  <div
    style={{
      textAlign: "center",
      fontSize: "0.75rem",
      color: "#6B7280",
      paddingBottom: "2vh",
    }}
  >
    © 2025 StudentOS — Built for focused students.
  </div>
</div>

  );
}

export default App;

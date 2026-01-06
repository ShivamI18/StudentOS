import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { user, resendVerificationEmail, reloadUser,logout } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!user || user.emailVerified) return;

    try {
      setLoading(true);
      await resendVerificationEmail();
      setMessage("Verification email sent. Please check your inbox.");
    } catch {
      setMessage("Failed to send verification email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault(); // stop Link default navigation
    await reloadUser(); // 🔑 refresh Firebase user
    navigate("/dashboard");
  };

  return (
  <div
  style={{
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%)",
    padding: "4vh 5vw",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }}
>
  <button
    onClick={()=>{
      logout()
      navigate('/')
    }}
    style={{
      position: "fixed",
      top: "2vh",
      right: "4vw",
      padding: "0.6rem 1.4rem",
      fontSize: "0.75rem",
      borderRadius: "999px",
      border: "none",
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(12px)",
      color: "#EC4899",
      boxShadow: "0 8px 24px rgba(236,72,153,0.25)",
      cursor: "pointer",
      zIndex: 10,
      fontWeight: 600,
    }}
  >
    Log out
  </button>
  <div
    style={{
      width: "100%",
      maxWidth: "26rem",
      borderRadius: "2rem",
      padding: "2.8rem 2.2rem",
      textAlign: "center",
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(18px)",
      boxShadow: "0 24px 48px rgba(255,154,162,0.25)",
    }}
  >
    <h2
      style={{
        fontSize: "1.65rem",
        fontWeight: 800,
        color: "#1F2937",
        marginBottom: "1.6rem",
      }}
    >
      Verify Your Email
    </h2>

    {user && !user.emailVerified ? (
      <>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#6B7280",
            lineHeight: "1.6",
            marginBottom: "2.2rem",
          }}
        >
          Your email address is not verified yet. Please check your inbox and
          verify your email to continue.
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            borderRadius: "999px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            background:
              "linear-gradient(135deg, #FF9AA2 0%, #F472B6 100%)",
            color: "#FFFFFF",
            boxShadow:
              "0 12px 30px rgba(255,154,162,0.45)",
            marginBottom: "1.4rem",
          }}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        {message && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "#FF9AA2",
              marginBottom: "1.2rem",
            }}
          >
            {message}
          </p>
        )}

        <Link
          to="/dashboard"
          onClick={handleContinue}
          style={{
            fontSize: "0.85rem",
            color: "#FF9AA2",
            textDecoration: "none",
            fontWeight: 600,
            cursor:'pointer',
          }}
        >
          Refresh Page
        </Link>
      </>
    ) : (
      <>
        <p
          style={{
            fontSize: "1rem",
            color: "#22C55E",
            marginBottom: "2.2rem",
            fontWeight: 600,
          }}
        >
          Your email is already verified!
        </p>

        <Link
          to="/dashboard"
          onClick={handleContinue}
          style={{
            display: "inline-block",
            padding: "0.9rem 2.4rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            borderRadius: "999px",
            textDecoration: "none",
            color: "#FFFFFF",
            background:
              "linear-gradient(135deg, #FF9AA2 0%, #F472B6 100%)",
            boxShadow:
              "0 12px 30px rgba(255,154,162,0.45)",
          }}
        >
          Continue
        </Link>
      </>
    )}
  </div>
</div>

  );
};

export default VerifyEmail;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { user, resendVerificationEmail, reloadUser } = useAuth();
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
    backgroundColor: "#ECEFF4",
    padding: "4vh 5vw",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "26rem",
      backgroundColor: "#ECEFF4",
      borderRadius: "1.5rem",
      padding: "2.5rem 2rem",
      boxShadow:
        "0.8rem 0.8rem 1.6rem #D1D9E6, -0.8rem -0.8rem 1.6rem #FFFFFF",
      textAlign: "center",
    }}
  >
    <h2
      style={{
        fontSize: "1.6rem",
        fontWeight: "600",
        color: "#2E3440",
        marginBottom: "1.5rem",
      }}
    >
      Verify Your Email
    </h2>

    {user && !user.emailVerified ? (
      <>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#4C566A",
            lineHeight: "1.5",
            marginBottom: "2rem",
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
            padding: "0.9rem",
            fontSize: "0.95rem",
            fontWeight: "500",
            borderRadius: "0.9rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#ECEFF4",
            color: "#5E81AC",
            boxShadow:
              "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
            marginBottom: "1.2rem",
          }}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        {message && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "#5E81AC",
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
            color: "#5E81AC",
            textDecoration: "none",
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
            color: "#4CAF50",
            marginBottom: "2rem",
          }}
        >
          ✅ Your email is already verified!
        </p>

        <Link
          to="/dashboard"
          onClick={handleContinue}
          style={{
            display: "inline-block",
            padding: "0.8rem 2rem",
            fontSize: "0.95rem",
            borderRadius: "1rem",
            textDecoration: "none",
            color: "#5E81AC",
            backgroundColor: "#ECEFF4",
            boxShadow:
              "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
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

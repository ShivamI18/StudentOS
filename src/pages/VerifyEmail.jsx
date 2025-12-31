import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

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
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Verify Your Email</h2>

        {user && !user.emailVerified ? (
          <>
            <p className="verify-text">
              Your email address is not verified yet. Please check your inbox
              and verify your email to continue.
            </p>

            <button
              className="verify-btn"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>

            {message && <p className="verify-message">{message}</p>}

            <Link
              to="/dashboard"
              onClick={handleContinue}
              className="verify-link"
            >
              Refresh Page
            </Link>
          </>
        ) : (
          <div>
            <p className="verify-success">
              ✅ Your email is already verified!
            </p>

            <Link
              to="/dashboard"
              onClick={handleContinue}
              className="verify-link"
            >
              Continue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

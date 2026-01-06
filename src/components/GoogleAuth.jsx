import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function GoogleAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithEmailPassword, signupWithEmailPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const authErrorStyle = {
    color: "red",
    fontSize: "0.7em",
  };

  const handleAuth = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      const user = isLogin
        ? await loginWithEmailPassword(email, password)
        : await signupWithEmailPassword(email, password);

      if (!user) {
        throw new Error("Authentication failed");
      }

      reset();
      navigate("/dashboard");
    } catch (err) {
      setError(
        isLogin
          ? "Invalid email or password"
          : "Error creating account. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<div
  style={{
    minHeight: "100vh",
    background: "radial-gradient(circle at top right, #FFF5F7 0%, #FFFFFF 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4vh 6vw",
    fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', sans-serif",
    color: "#2D3436",
    animation: "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  }}
>
  <style>
    {`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes modalUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      input::placeholder { color: #A0A0A0; opacity: 0.8; }
      input:focus { border-color: #FFB7C5 !important; box-shadow: 0 0 0 4px rgba(255, 183, 197, 0.15) !important; }
    `}
  </style>

  {/* Back */}
  <Link
    to="/"
    style={{
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(12px)",
      borderRadius: "50%",
      padding: "0.7rem",
      position: "absolute",
      top: "2rem",
      left: "2rem",
      boxShadow: "0 8px 24px rgba(255, 154, 162, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.2s ease",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#FF8E9D"
    >
      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  </Link>

  {/* Logo */}
  <div
    style={{
      fontSize: "1.8rem",
      fontWeight: 800,
      marginBottom: "4vh",
      letterSpacing: "-0.04em",
      color: "#4A4A4A"
    }}
  >
    Student<span style={{ color: "#FFB7C5", fontWeight: 900 }}>OS</span>
  </div>

  {/* Auth Container */}
  <div
    style={{
      width: "100%",
      maxWidth: "24rem",
      padding: "3rem 2.5rem",
      borderRadius: "2.5rem",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(25px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      boxShadow: "0 25px 60px rgba(255, 154, 162, 0.18)",
      animation: "modalUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        fontSize: "1.6rem",
        fontWeight: 800,
        marginBottom: "2.5rem",
        letterSpacing: "-0.03em",
        color: "#1A1A1A",
      }}
    >
      {isLogin ? "Welcome back" : "Create account"}
    </h2>

    <form noValidate onSubmit={handleSubmit(handleAuth)}>
      {/* Email */}
      <div style={{ marginBottom: "1.4rem" }}>
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email",
            },
          })}
          style={{
            width: "100%",
            padding: "1.1rem 1.2rem",
            borderRadius: "1.1rem",
            border: "1px solid rgba(255, 154, 162, 0.15)",
            outline: "none",
            fontSize: "0.95rem",
            background: "#FFFFFF",
            color: "#2D3436",
            boxSizing: "border-box",
            transition: "all 0.3s ease",
          }}
        />
        {errors.email && (
          <p style={{ ...authErrorStyle, marginTop: "0.5rem", fontSize: "0.75rem", paddingLeft: "0.5rem" }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="password"
          placeholder="Password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          style={{
            width: "100%",
            padding: "1.1rem 1.2rem",
            borderRadius: "1.1rem",
            border: "1px solid rgba(255, 154, 162, 0.15)",
            outline: "none",
            fontSize: "0.95rem",
            background: "#FFFFFF",
            color: "#2D3436",
            boxSizing: "border-box",
            transition: "all 0.3s ease",
          }}
        />
        {errors.password && (
          <p style={{ ...authErrorStyle, marginTop: "0.5rem", fontSize: "0.75rem", paddingLeft: "0.5rem" }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "1.1rem",
          borderRadius: "100px",
          border: "none",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #FFB7C5 0%, #FF8E9D 100%)",
          boxShadow: "0 15px 35px rgba(255, 142, 157, 0.35)",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading
          ? "Please wait..."
          : isLogin
          ? "Login"
          : "Sign Up"}
      </button>
    </form>

    {/* Server Error */}
    {error && (
      <p
        style={{
          ...authErrorStyle,
          marginTop: "1.2rem",
          textAlign: "center",
          fontSize: "0.8rem",
          background: "rgba(255, 154, 162, 0.1)",
          padding: "0.6rem",
          borderRadius: "0.8rem",
        }}
      >
        {error}
      </p>
    )}

    {/* Switch */}
    <p
      style={{
        fontSize: "0.85rem",
        color: "#95A5A6",
        textAlign: "center",
        marginTop: "2.2rem",
        fontWeight: 400
      }}
    >
      {isLogin
        ? "Don't have an account?"
        : "Already have an account?"}
    </p>

    <button
      onClick={() => {
        setIsLogin(!isLogin);
        setError("");
        reset();
      }}
      style={{
        marginTop: "0.6rem",
        width: "100%",
        background: "none",
        border: "none",
        color: "#FF8E9D",
        fontSize: "0.9rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "opacity 0.2s ease",
      }}
    >
      {isLogin ? "Create Account" : "Login here"}
    </button>
  </div>
</div>
  );
}

export default GoogleAuth;

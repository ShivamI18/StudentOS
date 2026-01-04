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
    backgroundColor: "#EEF2F7",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4vh 6vw",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#1F2937",
  }}
>
  <Link to={'/'} style={{
        background: "none",
        border: "none",
        fontSize: "0.85rem",
        fontWeight:'900',
        cursor: "pointer",
        textAlign:'center',
        position:'absolute',
        top:'0',left:'0',
        margin:'2em',
      }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2563EB"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></Link>
  {/* Logo */}
  <div
    style={{
      fontSize: "2rem",
      fontWeight: 800,
      marginBottom: "4vh",
    }}
  >
    Student<span style={{ color: "#2563EB" }}>OS</span>
  </div>

  {/* Auth Card */}
  <div
    style={{
      width: "100%",
      maxWidth: "22rem",
      padding: "2.5rem 2rem",
      borderRadius: "2rem",
      backgroundColor: "#EEF2F7",
      boxShadow:
        "1rem 1rem 2rem #C8D0DA, -1rem -1rem 2rem #FFFFFF",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        fontSize: "1.4rem",
        fontWeight: 700,
        marginBottom: "2rem",
      }}
    >
      {isLogin ? "Login" : "Sign Up"}
    </h2>

    <form noValidate onSubmit={handleSubmit(handleAuth)}>
      {/* Email */}
      <div style={{ marginBottom: "1.2rem" }}>
        <input
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value:
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email",
            },
          })}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",
            borderRadius: "1rem",
            border: "none",
            outline: "none",
            fontSize: "0.9rem",
            backgroundColor: "#EEF2F7",
            boxShadow:
              "inset 0.3rem 0.3rem 0.6rem #C8D0DA, inset -0.3rem -0.3rem 0.6rem #FFFFFF",
          }}
        />
        {errors.email && (
          <p style={{ ...authErrorStyle, marginTop: "0.4rem" }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: "1.6rem" }}>
        <input
          type="password"
          placeholder="Enter your password"
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
            padding: "0.9rem 1rem",
            borderRadius: "1rem",
            border: "none",
            outline: "none",
            fontSize: "0.9rem",
            backgroundColor: "#EEF2F7",
            boxShadow:
              "inset 0.3rem 0.3rem 0.6rem #C8D0DA, inset -0.3rem -0.3rem 0.6rem #FFFFFF",
          }}
        />
        {errors.password && (
          <p style={{ ...authErrorStyle, marginTop: "0.4rem" }}>
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
          padding: "0.9rem",
          borderRadius: "1.2rem",
          border: "none",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#2563EB",
          backgroundColor: "#EEF2F7",
          boxShadow:
            "0.4rem 0.4rem 0.8rem #C8D0DA, -0.4rem -0.4rem 0.8rem #FFFFFF",
          cursor: "pointer",
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
      <p style={{ ...authErrorStyle, marginTop: "1rem", textAlign: "center" }}>
        {error}
      </p>
    )}

    {/* Switch */}
    <p
      style={{
        fontSize: "0.8rem",
        color: "#6B7280",
        textAlign: "center",
        marginTop: "1.6rem",
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
        color: "#2563EB",
        fontSize: "0.85rem",
        cursor: "pointer",
      }}
    >
      {isLogin ? "Create Account" : "Login here"}
    </button>
  </div>
</div>

  );
}

export default GoogleAuth;

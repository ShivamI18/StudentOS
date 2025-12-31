import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./GoogleAuth.css";

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
    <div>
      <div className="loginlogo">StudentOS</div>

      <div className="container">
        <h2 className="monebold formtitle">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="authform" noValidate onSubmit={handleSubmit(handleAuth)}>
          <div>
            <input
              className="forminput"
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
            />
            {errors.email && (
              <p className="monthin" style={authErrorStyle}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="forminput"
              type="password"
              placeholder="Enter your password"
              autoComplete={
                isLogin ? "current-password" : "new-password"
              }
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="monthin" style={authErrorStyle}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className="formbtn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {error && (
          <p className="monthin" style={authErrorStyle}>
            {error}
          </p>
        )}

        <p
          className="formsubtext monethin"
          style={{ fontSize: "0.8em", padding: "1em 0 0.5em 0" }}
        >
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>

        <button
          className="switchbtn"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            reset();
          }}
        >
          {isLogin ? "Create Account" : "Login here"}
        </button>
      </div>
    </div>
  );
}

export default GoogleAuth;

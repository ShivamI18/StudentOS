import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function GoogleAuth() {
  const [isLogin, setIsLogin] = useState(true); 
  const [error, setError] = useState("");
  const { loginWithEmailPassword, signupWithEmailPassword } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmitLogin = async (data) => {
    const { email, password } = data;
    try {
      await loginWithEmailPassword(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const onSubmitSignUp = async (data) => {
    const { email, password } = data;
    try {
      await signupWithEmailPassword(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Error signing up");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit(isLogin ? onSubmitLogin : onSubmitSignUp)}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { 
              required: "Email is required", 
              pattern: /^[^@]+@[^@]+\.[^@]+$/i 
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Password must be at least 6 characters" } 
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
      <button onClick={() => { setError(""); setIsLogin(!isLogin); }}>
        {isLogin ? "Sign up here" : "Login here"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}

export default GoogleAuth;

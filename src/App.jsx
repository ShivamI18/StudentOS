import "./App.css";
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
    <div>
      <div className="navbarsection">
        <div className="logo monebold">StudentOS</div>
        <div className="navbtn">
          <Link to={"/auth"}>Sign Up</Link>
          <Link to={"/auth"}>Log in</Link>
        </div>
      </div>
      <div className="herosection">
        <div className="herotitle">
          <div className="monebold"
            
          >
            Stay Focused
          </div>
          <div className="monebold" style={{
              color: "#1D4ED8",
            }}>Be Productive</div>
        </div>
      </div>
    </div>
  );
}

export default App;

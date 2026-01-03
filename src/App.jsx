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
        <div className="logo">
          Student<span className="monebold">OS</span>
        </div>
        <div className="navbtn">
          <Link to={"/auth"} className="authbtn focus">Sign Up</Link>
          <Link to={"/auth"} className="authbtn">Log in</Link>
        </div>
      </div>
      <div className="herosection">
        <div className="herotitle">
          <div>Stay Focused</div>
          <div
            style={{
              color: "#1D4ED8",
            }}
          >
            Be Productive
          </div>
        </div>
        <div className="herocontent">
          Test is a student productivity app designed to help you manage your
          time, track your focus, and gain insights into your daily habits.
        </div>
        <div className="authbtn">
          <Link to={'/auth'}
            style={{
              fontSize: "0.9em",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="featuresection">
        <div
          className="monebold"
          style={{
            textAlign: "center",
            fontSize: "1.5em",
          }}
        >
          Features
        </div>
        <div className="featurebox">
          <div className="box">
            <div className="featurelogo"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1D4ED8"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg></div>
            <div className="featuretitle monebold">Focus Timer</div>
            <div className="featurecontent monethin">
              Use the Pomodoro technique to maintain focus with scientifically-timed work sessions.
            </div>
          </div>
          <div className="box">
            <div className="featurelogo"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1D4ED8"><path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/></svg></div>
            <div className="featuretitle monebold">Usage Tracking</div>
            <div className="featurecontent monethin">
              Monitor your app usage patterns and understand where your time goes each day.
            </div>
          </div>
          <div className="box">
            <div className="featurelogo"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1D4ED8"><path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/></svg></div>
            <div className="featuretitle monebold">Session Reflections</div>
            <div className="featurecontent monethin">
              Reflect on your day and track your progress towards your goals.
            </div>
          </div>
          <div className="box">
            <div className="featurelogo"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1D4ED8"><path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/></svg></div>
            <div className="featuretitle monebold">AI Insights</div>
            <div className="featurecontent monethin">
             Get personalized recommendations based on your productivity patterns.
            </div>
          </div>
        </div>
      </div>
      <div className="footer"><div className="monethin"> © 2025 StudentOS. Helping students stay productive.</div></div>
    </div>
  );
}

export default App;

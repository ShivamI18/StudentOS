import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UsageStats from "../plugins/usageStats";
import TreeGrowthTimer from "../components/TreeGrowthTimer.jsx";
import { useAuth } from "../context/AuthContext";

const Focusmode = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [usageData, setUsageData] = useState([]);
  const [userData, setUserData] = useState({});
  const [Analysis, setAnalysis] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [sessionsaved, setSessionsaved] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const saveSession = async (user) => {
    const sessionsRef = collection(db, "users", user.uid, "sessions");

    await addDoc(sessionsRef, {
      userData,
      usageData,
      Analysis,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    setUsageData([]);
    setUserData({});
  }, [sessionsaved]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await UsageStats.getUsageStats();
      const sortedData = result.data.sort(
        (a, b) => b.totalTimeForeground - a.totalTimeForeground
      );
      setUsageData(sortedData);
    } catch (err) {
      console.error("Error:", err);
      alert("Please enable 'Usage Access' for this app in the next screen.");
      await UsageStats.openUsageAccessSettings();
    } finally {
      setLoading(false);
    }
  };

  const onsubmit = async (data) => {
    if (loading) return;
    await fetchStats();
    setUserData({
      subject: data.subject,
      topics: data.topics,
      rating: data.rating,
      time: formatTime(seconds),
    });
  };

  const handleAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_KEY}/api/usage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usageData),
        }
      );

      await response.json();

      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_API_KEY}/api/focusmode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const res = await resp.json();
      const parsed = await parseAIResponse(res.advice);
      setAnalysis(parsed);
      console.log("Analysis is saved.");
    } catch (err) {
      console.error(err);
    }
    setAnalysisLoading(false);
  };

  const extractJSON = (raw) => {
    const match = raw.match(/```json([\s\S]*?)```/i);
    if (!match) return raw;
    return match[1].trim();
  };

  const sanitizeJSON = (jsonString) => {
    return jsonString
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
  };

  const parseAIResponse = async (raw) => {
    try {
      const extracted = extractJSON(raw);
      const sanitized = sanitizeJSON(extracted);
      console.log(sanitizeJSON);
      return JSON.parse(sanitized);
    } catch (err) {
      console.error("Invalid AI JSON format:", err.message);
      return null;
    }
  };

  const formatTime = (sec) => {
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEdit = async (data) => {
    setSeconds(data.mins * 60);
    reset();
    setShowSetting(false);
  };

  return (
    <div
  style={{
    minHeight: "100vh",
    backgroundColor: "#FFF9FA",
    background: "linear-gradient(180deg, #FFF1F4 0%, #FFFFFF 100%)",
    paddingBottom: "12vh",
    fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "1.5rem 1.5rem 1rem",
      alignItems: "center",
    }}
  >
    <div>
      <Link
        to={"/focusmode"}
        onClick={() => {
          setUserData(null);
          setUsageData(null);
          setAnalysis(null);
          setIsSessionComplete(false);
          setSessionsaved(false);
        }}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 183, 197, 0.3)",
          boxShadow: "0 4px 12px rgba(255, 143, 177, 0.12)",
          transition: "transform 0.2s ease",
        }}
      >
        <div style={{ display: "flex", transform: "translateX(-1px)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22px"
            viewBox="0 -960 960 960"
            width="22px"
            fill="#D6336C"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </div>
      </Link>
    </div>
    <div>
      <button
        style={{
          border: "none",
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 183, 197, 0.3)",
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(255, 143, 177, 0.12)",
          cursor: "pointer",
        }}
        onClick={() => setShowSetting(!showSetting)}
      >
        {showSetting ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#D6336C"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#D6336C"
          >
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
          </svg>
        )}
      </button>
    </div>
  </div>

  {isSessionComplete ? (
    <div>
      {!Analysis ? (
        <div
          style={{
            padding: "2vh 1.5rem 2vh",
            maxWidth: "32rem",
            margin: "0 auto",
          }}
        >
          <form
            onSubmit={handleSubmit(onsubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              padding: "2rem",
              backgroundColor: "#FFFFFF",
              borderRadius: "2rem",
              boxShadow: "0 20px 40px rgba(255, 183, 197, 0.15)",
              border: "1px solid rgba(255, 183, 197, 0.2)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#2D3436", marginBottom: "0.5rem" }}>Session Review</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FF8FB1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</label>
              <input
                type="text"
                defaultValue="DSA"
                {...register("subject", { required: true })}
                style={{
                  padding: "0.9rem 1.2rem",
                  borderRadius: "1rem",
                  border: "1px solid #FFF0F3",
                  backgroundColor: "#FFF9FA",
                  fontSize: "0.95rem",
                  color: "#2D3436",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FF8FB1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Topics Studied</label>
              <input
                type="text"
                defaultValue="Array and List"
                {...register("topics", { required: true })}
                style={{
                  padding: "0.9rem 1.2rem",
                  borderRadius: "1rem",
                  border: "1px solid #FFF0F3",
                  backgroundColor: "#FFF9FA",
                  fontSize: "0.95rem",
                  color: "#2D3436",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FF8FB1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Rating (1-5)</label>
              <input
                type="text"
                defaultValue="4"
                {...register("rating", { required: true })}
                style={{
                  padding: "0.9rem 1.2rem",
                  borderRadius: "1rem",
                  border: "1px solid #FFF0F3",
                  backgroundColor: "#FFF9FA",
                  fontSize: "0.95rem",
                  color: "#2D3436",
                  outline: "none",
                }}
              />
            </div>

            <input
              type="submit"
              disabled={loading}
              value={loading ? "Saving..." : "Save Details"}
              style={{
                marginTop: "1rem",
                padding: "1rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                borderRadius: "1.25rem",
                border: "none",
                background: "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)",
                color: "#FFFFFF",
                boxShadow: "0 10px 20px rgba(255, 143, 177, 0.3)",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                opacity: loading ? 0.7 : 1,
              }}
            />
          </form>

          {(loading || analysisLoading) && (
            <div
              style={{
                marginTop: "1.5rem",
                color: "#FF8FB1",
                fontSize: "0.85rem",
                textAlign: "center",
                fontWeight: 600,
                animation: "pulse 2s infinite ease-in-out",
              }}
            >
              <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
              {loading ? "Syncing app usage..." : "🌸 Generating AI insights..."}
            </div>
          )}

          <button
            onClick={handleAnalysis}
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              width: "100%",
              borderRadius: "1.25rem",
              border: "1px solid #FFB7C5",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "#D6336C",
              fontSize: "0.9rem",
              fontWeight: 700,
              boxShadow: "0 8px 16px rgba(255, 183, 197, 0.1)",
              cursor: "pointer",
            }}
          >
            Get Detailed Analysis
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "2vh 1.5rem 2vh",
            maxWidth: "42rem",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <button
              onClick={() => {
                saveSession(user);
                setSessionsaved(true);
              }}
              disabled={sessionsaved}
              style={{
                flex: 1,
                padding: "0.8rem 1.2rem",
                borderRadius: "1.2rem",
                border: "none",
                background: sessionsaved ? "#FFF0F3" : "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)",
                color: sessionsaved ? "#FFB7C5" : "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.85rem",
                boxShadow: sessionsaved ? "none" : "0 8px 20px rgba(255, 143, 177, 0.3)",
                cursor: "pointer",
              }}
            >
              {sessionsaved ? "Saved ✓" : "Save Session"}
            </button>
            <Link
              to="/dashboard"
              onClick={() => {
                setSessionsaved(false);
                setIsSessionComplete(false);
                setAnalysis(null);
              }}
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "1.2rem",
                backgroundColor: "#FFFFFF",
                color: "#636E72",
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none",
                border: "1px solid rgba(255, 183, 197, 0.3)",
                display: "flex",
                alignItems: "center",
              }}
            >
              Exit
            </Link>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "2rem", border: "1px solid rgba(255, 183, 197, 0.2)", boxShadow: "0 15px 35px rgba(255, 183, 197, 0.1)" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2D3436", marginBottom: "1rem" }}>Session Analysis</h2>
            <p style={{ color: "#636E72", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "2rem" }}>
              {Analysis.analysis}
            </p>

            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2D3436", marginBottom: "0.75rem" }}>Core Notes</h2>
            <div style={{ backgroundColor: "#FFF9FA", padding: "1.25rem", borderRadius: "1.25rem", borderLeft: "4px solid #FFB7C5", marginBottom: "2rem" }}>
               <p style={{ color: "#4A4A4A", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                {Analysis.notes}
              </p>
            </div>

            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2D3436", marginBottom: "1rem" }}>Knowledge Check</h2>
            {Analysis.questions?.map((q, i) => (
              <div
                key={i}
                style={{
                  marginTop: "0.75rem",
                  padding: "1rem 1.25rem",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "1.25rem",
                  border: "1px solid #FFF0F3",
                  boxShadow: "0 4px 12px rgba(255, 183, 197, 0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    fontWeight: 600,
                    color: "#D6336C",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ flex: 1 }}>Q{i + 1}: {q.q}</span>
                  <span style={{ fontSize: "1.2rem", marginLeft: "0.5rem", opacity: 0.5 }}>{openIndex === i ? "−" : "+"}</span>
                </div>
                {openIndex === i && (
                  <div
                    style={{
                      marginTop: "0.8rem",
                      paddingTop: "0.8rem",
                      borderTop: "1px dashed #FFE0E6",
                      color: "#636E72",
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                    <strong style={{ color: "#FF8FB1" }}>Answer:</strong> {q.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div>
      {showSetting ? (
        <form
          className="timeform"
          noValidate
          onSubmit={handleSubmit(handleEdit)}
          style={{
            backgroundColor: "#FFFFFF",
            padding: "2.5rem 2rem",
            borderRadius: "2.5rem",
            boxShadow: "0 25px 50px rgba(255, 143, 177, 0.15)",
            border: "1px solid rgba(255, 183, 197, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxWidth: "22rem",
            margin: "2rem auto",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "-0.5rem" }}>⏱️</div>
          <label
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#2D3436",
            }}
          >
            Duration
          </label>

          <input
            type="number"
            className="forminput"
            placeholder="Mins"
            style={{
              padding: "1rem",
              fontSize: "1.2rem",
              borderRadius: "1.25rem",
              border: "1px solid #FFF0F3",
              textAlign: "center",
              outline: "none",
              backgroundColor: "#FFF9FA",
              color: "#D6336C",
              fontWeight: 700,
              boxShadow: errors.mins ? "0 0 0 2px #FF8FB1" : "none",
            }}
            {...register("mins", {
              required: true,
              min: { value: 10, message: "Minimum 10 mins" },
              max: { value: 120, message: "Maximum 120 mins" },
            })}
          />

          {errors.mins && (
            <p style={{ fontSize: "0.8rem", color: "#D6336C", marginTop: "-0.5rem", fontWeight: 600 }}>
              {errors.mins.message}
            </p>
          )}

          <input
            type="submit"
            className="authbtn"
            value="Update Timer"
            style={{
              marginTop: "0.5rem",
              padding: "1rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              borderRadius: "1.25rem",
              border: "none",
              background: "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)",
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(255, 143, 177, 0.3)",
              transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          />
        </form>
      ) : (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <h2 className="monebold" style={{ 
            textAlign: "center", 
            margin: "1.5rem 0", 
            fontSize: "1.5rem", 
            fontWeight: 800, 
            color: "#2D3436",
            letterSpacing: "-0.02em" 
          }}>
            Focus Session
          </h2>
          <TreeGrowthTimer
            durationInSeconds={seconds}
            setSession={setIsSessionComplete}
            isSession={isSessionComplete}
          />
        </div>
      )}
    </div>
  )}

  {/* Bottom Nav */}
  <div
    style={{
      position: "fixed",
      bottom: "1.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      maxWidth: "24rem",
      height: "4.5rem",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: "100px",
      boxShadow: "0 15px 35px rgba(255, 143, 177, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      zIndex: 100,
    }}
  >
    {[
      { label: "Dashboard", path: "/dashboard" },
      { label: "Focus", path: "/focusmode" },
      { label: "Tools", path: "/tools" },
    ].map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        style={({ isActive }) => ({
          fontSize: "0.8rem",
          fontWeight: 700,
          color: isActive ? "#D6336C" : "#A0A0A0",
          textDecoration: "none",
          padding: "0.75rem 1rem",
          borderRadius: "100px",
          backgroundColor: isActive ? "#FFF0F3" : "transparent",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        })}
      >
        {item.label}
      </NavLink>
    ))}
  </div>
</div>
  );
};

export default Focusmode;

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UsageStats from "../plugins/usageStats";
import "./Focusmode.css";
import CircularTimer from "../components/CircularTimer";
import { useAuth } from "../context/AuthContext";

const Focusmode = () => {
  const { register, handleSubmit, reset,formState:{errors} } = useForm();
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
  const [analysisLoading, setAnalysisLoading] = useState(false)

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
    setAnalysisLoading(true)
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
    setAnalysisLoading(false)
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
    <div>
      {isSessionComplete ? (
        <div>
          {!Analysis ? (
            <div
              style={{
                margin: "1em",
              }}
            >
              <form
                onSubmit={handleSubmit(onsubmit)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                  padding: "1.5em",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "0.75em",
                  boxShadow: "var(--shadow-sm)",
                  maxWidth: "100%",
                }}
              >
                <label
                  htmlFor="subject"
                  style={{
                    fontSize: "1em",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                  }}
                >
                  Subject:
                </label>
                <input
                  type="text"
                  defaultValue="DSA"
                  id="subject"
                  {...register("subject", { required: true })}
                  style={{
                    padding: "0.75em 1em",
                    fontSize: "1em",
                    borderRadius: "0.5em",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />

                <label
                  htmlFor="topics"
                  style={{
                    fontSize: "1em",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                  }}
                >
                  Topics Studied:
                </label>
                <input
                  type="text"
                  defaultValue="Array and List"
                  id="topics"
                  {...register("topics", { required: true })}
                  style={{
                    padding: "0.75em 1em",
                    fontSize: "1em",
                    borderRadius: "0.5em",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />

                <label
                  htmlFor="rating"
                  style={{
                    fontSize: "1em",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                  }}
                >
                  Rating:
                </label>
                <input
                  type="text"
                  defaultValue="4"
                  id="rating"
                  {...register("rating", { required: true })}
                  style={{
                    padding: "0.75em 1em",
                    fontSize: "1em",
                    borderRadius: "0.5em",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />

                <input
                  type="submit"
                  disabled={loading}
                  value="Save"
                  style={{
                    marginTop: "1em",
                    padding: "0.8em",
                    fontSize: "1em",
                    fontWeight: "600",
                    borderRadius: "0.6em",
                    border: "none",
                    backgroundColor: loading
                      ? "var(--btn-primary-disabled)"
                      : "var(--btn-primary-bg)",
                    color: "var(--btn-primary-text)",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                />
              </form>

              {loading && (
                <div
                  style={{
                    marginTop: "1em",
                    fontSize: "0.95em",
                    color: "var(--text-secondary)",
                  }}
                >
                  Wait while we are fetch app usage
                </div>
              )}
              {analysisLoading && (
                <div
                  style={{
                    marginTop: "1em",
                    fontSize: "0.95em",
                    color: "var(--text-secondary)",
                  }}
                >
                  Wait! while we are fetching ai response
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalysis}
                style={{
                  marginTop: "1.5em",
                  padding: "0.8em 1.2em",
                  fontSize: "1em",
                  fontWeight: "600",
                  borderRadius: "0.6em",
                  border: "none",
                  backgroundColor: "var(--btn-secondary-bg)",
                  color: "var(--btn-secondary-text)",
                  cursor: "pointer",
                }}
              >
                Analysis
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "1em",
              }}
            >
              <button
                onClick={() => {
                  saveSession(user);
                  setSessionsaved(true);
                }}
                disabled={sessionsaved}
                className="authbtn"
                style={{
                  margin:'0 1em 1em 0',
                }}
              >
                Save Session
              </button>
              <Link
                onClick={() => {
                  setSessionsaved(false);
                  setIsSessionComplete(false);
                  setAnalysis(null)
                }}
                className="authbtn"
                style={{
                  margin:'0 1em 1em 0',
                }}
                to={"/dashboard"} // checking navigate it to focusmode
              >
                Exit
              </Link>
              <h2
                style={{
                  color: "#1d4ed8",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px",
                }}
              >
                Analysis
              </h2>
              <div style={{ color: "#1f2933", marginTop: "8px" }}>
                {Analysis.analysis}
              </div>

              <h2
                style={{
                  color: "#1d4ed8",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px",
                  marginTop: "20px",
                }}
              >
                Notes
              </h2>
              <div style={{ color: "#1f2933", marginTop: "8px" }}>
                {Analysis.notes}
              </div>

              <h2
                style={{
                  color: "#1d4ed8",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px",
                  marginTop: "20px",
                }}
              >
                Questions
              </h2>

              {Analysis.questions?.map((q, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "12px",
                    marginTop: "10px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#1d4ed8",
                    }}
                  >
                    Question {i + 1}: {q.q}
                  </div>

                  {openIndex === i && (
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#475569",
                      }}
                    >
                      <strong style={{ color: "#14b8a6" }}>Answer:</strong>{" "}
                      {q.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="setting"
            onClick={() => setShowSetting(!showSetting)}
          >
            {showSetting ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                {" "}
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />{" "}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                {" "}
                <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />{" "}
              </svg>
            )}
          </button>

          {showSetting ? (
            <form className="timeform" noValidate onSubmit={handleSubmit(handleEdit)}>
              <label>Set new Timer (Mins)</label>
              <input
                type="number"
                className="forminput"
                style={{
                  border: "2px solid blue",
                }}
                {...register("mins", { required: true, min:{
                  value:10,
                  message:'Timer must be atleast 10 mins long'
                },
              max:{
                   value:120,
                  message:'Timer cannot be more than 120 mins'
              } })}
              />
              {errors.mins && <p>{errors.mins.message}</p> }
              <input
                type="submit"
                style={{
                  fontSize: "1em",
                }}
                className="authbtn"
                value="Save"
              />
            </form>
          ) : (
            <div>
              <h2 className="monebold" style={{ margin: "1em 0 0 1em" }}>
                Focus Session
              </h2>
              <CircularTimer
                durationInSeconds={seconds}
                setSession={setIsSessionComplete}
                isSession={isSessionComplete}
              />
            </div>
          )}
        </div>
      )}
      <div className="navcontainer">
              <NavLink
                style={({ isActive }) => ({
                  padding: "1em",
                  color: isActive ? "#1d4ed8" : "#000",
                  borderRadius: "8px",
                  fontSize: "0.7em",
                })}
                className="flex-col monthin"
                to={"/dashboard"}
              >
                Dashboard
              </NavLink>
      
              <NavLink
                style={({ isActive }) => ({
                  padding: "1em",
                  color: isActive ? "#1d4ed8" : "#000",
                  borderRadius: "8px",
                  fontSize: "0.7em",
                })}
                className="flex-col monthin"
                to={"/focusmode"}
              >
                Focus
              </NavLink>
      
              <NavLink
                style={({ isActive }) => ({
                  padding: "1em",
                  color: isActive ? "#1d4ed8" : "#000",
                  borderRadius: "8px",
                  fontSize: "0.7em",
                })}
                className="flex-col monthin"
                to={"/tools"}
              >
                Tools
              </NavLink>
            </div>
    </div>
  );
};

export default Focusmode;

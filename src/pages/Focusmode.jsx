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
        backgroundColor: "#ECEFF4",
        paddingBottom: "10vh",
      }}
    >
      {" "}
      {isSessionComplete ? (
        <div>
          {" "}
          {!Analysis ? (
            <div
              style={{
                padding: "6vh 5vw 2vh",
                maxWidth: "50rem",
                margin: "0 auto",
              }}
            >
              {" "}
              <form
                onSubmit={handleSubmit(onsubmit)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "2rem",
                  backgroundColor: "#ECEFF4",
                  borderRadius: "1.5rem",
                  boxShadow:
                    "0.6rem 0.6rem 1.2rem #D1D9E6, -0.6rem -0.6rem 1.2rem #FFFFFF",
                }}
              >
                {" "}
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#2E3440",
                  }}
                >
                  {" "}
                  Subject{" "}
                </label>{" "}
                <input
                  type="text"
                  defaultValue="DSA"
                  {...register("subject", { required: true })}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: "1rem",
                    border: "none",
                    backgroundColor: "#ECEFF4",
                    fontSize: "0.9rem",
                    boxShadow:
                      "inset 0.3rem 0.3rem 0.6rem #D1D9E6, inset -0.3rem -0.3rem 0.6rem #FFFFFF",
                  }}
                />{" "}
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#2E3440",
                  }}
                >
                  {" "}
                  Topics Studied{" "}
                </label>{" "}
                <input
                  type="text"
                  defaultValue="Array and List"
                  {...register("topics", { required: true })}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: "1rem",
                    border: "none",
                    backgroundColor: "#ECEFF4",
                    fontSize: "0.9rem",
                    boxShadow:
                      "inset 0.3rem 0.3rem 0.6rem #D1D9E6, inset -0.3rem -0.3rem 0.6rem #FFFFFF",
                  }}
                />{" "}
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#2E3440",
                  }}
                >
                  {" "}
                  Rating{" "}
                </label>{" "}
                <input
                  type="text"
                  defaultValue="4"
                  {...register("rating", { required: true })}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: "1rem",
                    border: "none",
                    backgroundColor: "#ECEFF4",
                    fontSize: "0.9rem",
                    boxShadow:
                      "inset 0.3rem 0.3rem 0.6rem #D1D9E6, inset -0.3rem -0.3rem 0.6rem #FFFFFF",
                  }}
                />{" "}
                <input
                  type="submit"
                  disabled={loading}
                  value="Save"
                  style={{
                    marginTop: "1.2rem",
                    padding: "0.9rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    borderRadius: "1.2rem",
                    border: "none",
                    backgroundColor: "#ECEFF4",
                    color: "#5E81AC",
                    boxShadow:
                      "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
                    cursor: "pointer",
                  }}
                />{" "}
              </form>{" "}
              {loading && (
                <div
                  style={{
                    marginTop: "1rem",
                    color: "#4C566A",
                    fontSize: "0.8rem",
                  }}
                >
                  {" "}
                  Fetching app usage…{" "}
                </div>
              )}{" "}
              {analysisLoading && (
                <div
                  style={{
                    marginTop: "1rem",
                    color: "#4C566A",
                    fontSize: "0.8rem",
                  }}
                >
                  {" "}
                  Generating AI insights…{" "}
                </div>
              )}{" "}
              <button
                onClick={handleAnalysis}
                style={{
                  marginTop: "2rem",
                  padding: "0.9rem",
                  width: "100%",
                  borderRadius: "1.2rem",
                  border: "none",
                  backgroundColor: "#ECEFF4",
                  color: "#5E81AC",
                  fontWeight: 600,
                  boxShadow:
                    "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
                }}
              >
                {" "}
                Analysis{" "}
              </button>{" "}
            </div>
          ) : (
            <div
              style={{
                padding: "6vh 5vw 2vh",
                maxWidth: "50rem",
                margin: "0 auto",
              }}
            >
              {" "}
              <button
                onClick={() => {
                  saveSession(user);
                  setSessionsaved(true);
                }}
                disabled={sessionsaved}
                style={{
                  marginRight: "1rem",
                  padding: "0.7rem 1.2rem",
                  borderRadius: "1rem",
                  border: "none",
                  backgroundColor: "#ECEFF4",
                  color: "#5E81AC",
                  boxShadow:
                    "0.3rem 0.3rem 0.6rem #D1D9E6, -0.3rem -0.3rem 0.6rem #FFFFFF",
                }}
              >
                {" "}
                Save Session{" "}
              </button>{" "}
              <Link
                to="/dashboard"
                onClick={() => {
                  setSessionsaved(false);
                  setIsSessionComplete(false);
                  setAnalysis(null);
                }}
                style={{
                  padding: "0.7rem 1.2rem",
                  borderRadius: "1rem",
                  backgroundColor: "#ECEFF4",
                  color: "#4C566A",
                  textDecoration: "none",
                  boxShadow:
                    "0.3rem 0.3rem 0.6rem #D1D9E6, -0.3rem -0.3rem 0.6rem #FFFFFF",
                }}
              >
                {" "}
                Exit{" "}
              </Link>{" "}
              <h2 style={{ marginTop: "2rem", color: "#2E3440" }}>
                Analysis
              </h2>{" "}
              <p style={{ color: "#4C566A", fontSize: "0.9rem" }}>
                {Analysis.analysis}
              </p>{" "}
              <h2 style={{ marginTop: "1.5rem", color: "#2E3440" }}>Notes</h2>{" "}
              <p style={{ color: "#4C566A", fontSize: "0.9rem" }}>
                {Analysis.notes}
              </p>{" "}
              <h2 style={{ marginTop: "1.5rem", color: "#2E3440" }}>
                Questions
              </h2>{" "}
              {Analysis.questions?.map((q, i) => (
                <div
                  key={i}
                  style={{
                    marginTop: "1rem",
                    padding: "1.2rem",
                    backgroundColor: "#ECEFF4",
                    borderRadius: "1.2rem",
                    boxShadow:
                      "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
                  }}
                >
                  {" "}
                  <div
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    style={{
                      fontWeight: 600,
                      color: "#5E81AC",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    {" "}
                    Question {i + 1}: {q.q}{" "}
                  </div>{" "}
                  {openIndex === i && (
                    <div
                      style={{
                        marginTop: "0.6rem",
                        color: "#4C566A",
                        fontSize: "0.85rem",
                      }}
                    >
                      {" "}
                      <strong>Answer:</strong> {q.a}{" "}
                    </div>
                  )}{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
        </div>
      ) : (
        <div>
          {" "}
          <h2
            style={{
              margin: "0vh 5vw 2vh",
              fontWeight: 600,
              fontSize: "1.4rem",
              color: "#2E3440",
              padding: "1.5vh 0 0 0",
            }}
          >
            {" "}
            Focus Session{" "}
          </h2>{" "}
          <TreeGrowthTimer
            durationInSeconds={seconds}
            setSession={setIsSessionComplete}
            isSession={isSessionComplete}
          />{" "}
        </div>
      )}{" "}
      {/* Bottom Nav */}{" "}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "8vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#ECEFF4",
          boxShadow: "0 -0.4rem 0.8rem #D1D9E6, 0 0.4rem 0.8rem #FFFFFF",
        }}
      >
        {" "}
        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Focus", path: "/focusmode" },
          { label: "Tools", path: "/tools" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              fontSize: "0.75rem",
              color: isActive ? "#5E81AC" : "#4C566A",
              textDecoration: "none",
            })}
          >
            {" "}
            {item.label}{" "}
          </NavLink>
        ))}{" "}
      </div>{" "}
    </div>
  );
};

export default Focusmode;

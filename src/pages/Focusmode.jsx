import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UsageStats from "../plugins/usageStats";
const API_URL = import.meta.env.VITE_API_URL;
const Focusmode = () => {
  const [seconds, setSeconds] = useState(3661);
  const [running, setRunning] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [usageData, setUsageData] = useState([]);
  const [Analysis, setAnalysis] = useState(null);

  const [userData, setUserData] = useState({
    subject: "",
    topics: "",
    rating: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await UsageStats.getUsageStats();
      const sortedData = result.data.sort(
        (a, b) => b.totalTimeForegroundMs - a.totalTimeForegroundMs
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
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const handleTimerStop = () => {
    setRunning(false);
    setIsSessionComplete(!isSessionComplete);
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
    try {
      const response = await fetch(`${API_URL}/api/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usageData),
      });

      const result = await response.json();
      console.log(result.message);

      const resp = await fetch(`${API_URL}/api/focusmode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const res = await resp.json();
      const parsed = await parseAIResponse(res.advice);
      console.log(res.message);
      setAnalysis(parsed);
    } catch (err) {
      console.error(err+" custom");
    }
  };

  const extractJSON = (raw) => {
    const match = raw.match(/```json([\s\S]*?)```/i);
    if (!match) return raw;
    return match[1].trim();
  };
  const sanitizeJSON = (jsonString) => {
    return jsonString
      .replace(/[“”]/g, '"') // smart quotes → normal quotes
      .replace(/[‘’]/g, "'") // smart single quotes
      .replace(/,\s*}/g, "}") // trailing commas
      .replace(/,\s*]/g, "]"); // trailing commas in arrays
  };
  const parseAIResponse = async (raw) => {
    try {
      const extracted = extractJSON(raw);
      const sanitized = sanitizeJSON(extracted);
      return JSON.parse(sanitized);
    } catch (err) {
      console.error("Invalid AI JSON format:", err.message);
      return null;
    }
  };

  const formatTime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      {isSessionComplete ? (
        <div>
          <form onSubmit={handleSubmit(onsubmit)}>
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              defaultValue={"DSA"}
              id="subject"
              placeholder="DSA"
              {...register("subject", { required: true })}
            />
            <label htmlFor="topics">Topics Studied:</label>
            <input
              type="text"
              defaultValue={"Array and List"}
              id="topics"
              placeholder="Array and Stack"
              {...register("topics", { required: true })}
            />
            <label htmlFor="rating">Rating:</label>
            <input
              type="text"
              defaultValue={"4"}
              id="rating"
              placeholder="out of 5"
              {...register("rating", { required: true })}
            />
            <input type="submit" disabled={loading} value="Save" />
          </form>
          {loading && <div>Wait while we are fetch app usage</div>}
          {usageData.map((app, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #ff0000ff",
                padding: "10px 0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>{app.packageName}</strong>
              <span>{app.totalTimeForeground}</span>
            </div>
          ))}
          {userData.subject} - {userData.topics} - {userData.rating} -{" "}
          {userData.time}
          <button type="button" onClick={handleAnalysis}>
            {" "}
            Analysis{" "}
          </button>
          <div>
            {Analysis && (
              <>
                <h2>Analysis</h2>
                <div>{Analysis.analysis}</div>

                <h2>Notes</h2>
                <div>{Analysis.notes}</div>

                <h2>Questions</h2>
                {Analysis.questions?.map((q, i) => (
                  <div key={i}>
                    <div>Question {i+1}: {q.q}</div>
                    <div>Answer: {q.a}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div>
            <Link to={"/dashboard"}>Dashboard</Link> - Focus mode
          </div>
          Focus mere bhai
          {formatTime(seconds)}
          <button
            onClick={() => {
              setRunning(!running);
            }}
          >
            {!running ? "Start" : "Pause"}
          </button>
          <button
            onClick={() => {
              handleTimerStop();
            }}
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default Focusmode;

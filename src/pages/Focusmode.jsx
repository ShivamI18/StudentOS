import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UsageStats from "../plugins/usageStats";
const Focusmode = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [usageData, setUsageData] = useState([]);
  const [userData, setUserData] = useState({
      subject: "",
      topics: "",
      rating: "",
      time : ""
    });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await UsageStats.getUsageStats();

      // Sort: Most used apps first
      const sortedData = result.data.sort(
        (a, b) => b.totalTimeForeground - a.totalTimeForeground
      );

      setUsageData(sortedData);
    } catch (err) {
        console.log("awsd");
        
      console.error("Error:", err);
      // Alert the user why they are being sent to settings
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
    time : formatTime(seconds),
  });
};


  const formatTime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div>
      {isSessionComplete ? (
        <div>
          <form onSubmit={handleSubmit(onsubmit)}>
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              placeholder="DSA"
              {...register("subject", { required: true })}
            />
            <label htmlFor="topics">Topics Studied:</label>
            <input
              type="text"
              id="topics"
              placeholder="Array and Stack"
              {...register("topics", { required: true })}
            />
            <label htmlFor="rating">Rating:</label>
            <input
              type="text"
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
              <strong>{app.packageName.split(".").pop()}</strong>
              <span>{formatTime(app.totalTimeForeground)}</span>
            </div>
          ))}
          {userData.subject} - {userData.topics} - {userData.rating} - {userData.time} 
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

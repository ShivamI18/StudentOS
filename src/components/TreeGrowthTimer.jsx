import React, { useEffect, useState } from "react";

const TreeGrowthTimer = ({ durationInSeconds, setSession }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [running, setRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = (timeLeft / durationInSeconds) * circumference;

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          setTimerCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, timeLeft]);

  const handleTimerStop = () => {
    setTimeLeft(durationInSeconds);
    setRunning(false);
    setTimerCompleted(false);
    setSession(true);
  };

  return (
   <div
  style={{
    backgroundColor: "#ECEFF4",
    borderRadius: "1.5rem",
    padding: "2rem",
    margin: "2em auto",
    maxWidth: "28rem",
    textAlign: "center",
    boxShadow: "0.6rem 0.6rem 1.2rem #D1D9E6, -0.6rem -0.6rem 1.2rem #FFFFFF",
  }}
>
  {/* Circular Timer */}
  <div
    style={{
      margin: "0 auto",
      width: radius * 2,
      height: radius * 2,
      transform: "rotate(-90deg)",
    }}
  >
    <svg height={radius * 2} width={radius * 2}>
      <circle
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        stroke="#D1D9E6"
        strokeWidth={stroke}
        fill="transparent"
      />
      <circle
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        stroke="#5E81AC"
        strokeWidth={stroke}
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  </div>

  {/* Time Display */}
  <div
    style={{
      marginTop: "1.2rem",
      fontSize: "2rem",
      fontWeight: 600,
      color: "#2E3440",
    }}
  >
    {formatTime(timeLeft)}
  </div>

  {/* Controls */}
  <div
    style={{
      marginTop: "1.5rem",
      display: "flex",
      justifyContent: "center",
      gap: "12px",
    }}
  >
    <button
      onClick={() => setRunning(!running)}
      disabled={timerCompleted}
      style={{
        backgroundColor: timerCompleted ? "#E5E9F0" : "#ECEFF4",
        color: "#5E81AC",
        border: "none",
        borderRadius: "1rem",
        padding: "0.8rem 1.4rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        cursor: timerCompleted ? "not-allowed" : "pointer",
        boxShadow: timerCompleted
          ? "inset 0.3rem 0.3rem 0.6rem #D1D9E6, inset -0.3rem -0.3rem 0.6rem #FFFFFF"
          : "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
        transition: "all 0.3s ease",
      }}
    >
      {!running ? "Start" : "Pause"}
    </button>

    {timerCompleted && (
      <button
        onClick={handleTimerStop}
        style={{
          backgroundColor: "#ECEFF4",
          color: "#5E81AC",
          border: "none",
          borderRadius: "1rem",
          padding: "0.8rem 1.4rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
          transition: "all 0.3s ease",
        }}
      >
        Continue
      </button>
    )}
  </div>
</div>



  );
};

export default TreeGrowthTimer;

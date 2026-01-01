import React, { useState, useEffect } from "react";

const CircularTimer = ({ durationInSeconds, setSession }) => {
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
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "16px",
        padding: "24px",
        margin: "2em",
        textAlign: "center",
        boxShadow: "var(--shadow-md)",
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
            stroke="var(--border-default)"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            stroke="var(--color-primary)"
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
          marginTop: "12px",
          fontSize: "2rem",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => setRunning(!running)}
          disabled={timerCompleted}
          style={{
            background: timerCompleted
              ? "var(--btn-primary-disabled)"
              : "var(--btn-primary-bg)",
            color: "var(--btn-primary-text)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: timerCompleted ? "not-allowed" : "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {!running ? "Start" : "Pause"}
        </button>

        {timerCompleted && (
          <button
            onClick={handleTimerStop}
            style={{
              background: "var(--btn-secondary-bg)",
              color: "var(--btn-secondary-text)",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            continue
          </button>
        )}
      </div>
    </div>
  );
};

export default CircularTimer;

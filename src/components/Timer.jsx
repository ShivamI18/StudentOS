import React, { useEffect, useState } from "react";

const Timer = ({ mins, setMins }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [initialMins, setInitialMins] = useState(mins);

  const formatTime = (totalMins) => {
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isRunning || mins <= 0) return;

    const timer = setInterval(() => {
      setMins((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [isRunning, mins, setMins]);

  const handleStartPause = () => {
    if (mins > 0) setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMins(initialMins);
  };

  return (
    <div className="timerbox">
      <div className="timer">{formatTime(mins)}</div>
      <div style={{ fontSize: "0.8em", color: "#6b7280" }}>Time Remaining</div>

      <div className="durationbox">
        <div style={{ fontSize: "0.8em", fontWeight: "600" }}>
          Study Duration (Hrs:Mins)
        </div>

        <div className="timecontroller">
          <button
            className="time"
            onClick={() => {
              setMins((prev) => prev + 1);
              setInitialMins((prev) => prev + 1);
            }}
          >
            +
          </button>

          <input
            type="number"
            min={0}
            value={mins}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMins(val);
              setInitialMins(val);
            }}
            className="time timerinput"
          />

          <button
            className="time"
            onClick={() => {
              setMins((prev) => Math.max(0, prev - 1));
              setInitialMins((prev) => Math.max(0, prev - 1));
            }}
          >
            -
          </button>
        </div>

        <div className="timerwrap">
          <button className="time timestart" onClick={handleStartPause}>
            {isRunning ? "Pause" : "Start"}
          </button>

          <button className="time timerreset" onClick={handleReset}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1f2937"
            >
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;

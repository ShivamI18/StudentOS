import React, { useEffect, useState } from "react";

const TreeGrowthTimer = ({ durationInSeconds = 1500, setSession }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [running, setRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Growth calculation: 0 (start) to 1 (full bloom)
  const growthProgress = (durationInSeconds - timeLeft) / durationInSeconds;

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

  const handleContinue = () => {
    if (setSession) setSession(true);
    resetState();
  };

  const resetState = () => {
    setTimeLeft(durationInSeconds);
    setRunning(false);
    setTimerCompleted(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#FFF9FA",
        borderRadius: "2.5rem",
        padding: "3.5rem 2rem",
        margin: "2em auto",
        maxWidth: "24rem",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(255, 183, 197, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
        fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', sans-serif",
        animation: "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        position: "relative"
      }}
    >
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
          @keyframes pulseShadow { 0% { box-shadow: 0 12px 30px rgba(255, 142, 157, 0.3); } 50% { box-shadow: 0 18px 45px rgba(255, 142, 157, 0.45); } 100% { box-shadow: 0 12px 30px rgba(255, 142, 157, 0.3); } }
          @keyframes sway { 0%, 100% { transform: rotate(-1.5deg); } 50% { transform: rotate(2deg); } }
          @keyframes petalFloat { 
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
          }
          .tree-path {
            transition: stroke-dashoffset 1.5s cubic-bezier(0.34, 1.3, 0.64, 1), 
                        stroke-width 1.5s cubic-bezier(0.34, 1.3, 0.64, 1);
          }
        `}
      </style>

      {/* Tree Illustration Container */}
      <div style={{ margin: "0 auto", width: "220px", height: "220px", display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: 'visible' }}>
          <ellipse cx="50" cy="95" rx="25" ry="5" fill="rgba(255, 183, 197, 0.08)" />
          
          <path
            className="tree-path"
            d={`M50,95 Q${60 - (growthProgress * 5)},${95 - (growthProgress * 20)} 50,50`}
            stroke="#5D4037"
            strokeWidth={3 + (growthProgress * 2)}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset={60 - (growthProgress * 60)}
          />

          <g style={{ animation: running ? "sway 5s infinite ease-in-out" : "none", transformOrigin: "50px 95px" }}>
            <path className="tree-path" d="M50,65 Q35,55 25,45" stroke="#5D4037" strokeWidth={1.5 + (growthProgress * 1)} fill="none" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={40 - (Math.max(0, growthProgress - 0.2) * 1.25 * 40)} />
            <path className="tree-path" d="M50,60 Q65,50 75,35" stroke="#5D4037" strokeWidth={1.5 + (growthProgress * 0.8)} fill="none" strokeLinecap="round" strokeDasharray="50" strokeDashoffset={50 - (Math.max(0, growthProgress - 0.3) * 1.4 * 50)} />
            <path className="tree-path" d="M50,50 Q45,35 52,20" stroke="#5D4037" strokeWidth={1 + (growthProgress * 0.8)} fill="none" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={40 - (Math.max(0, growthProgress - 0.4) * 1.6 * 40)} />
            
            <g style={{ transition: 'all 1.8s ease', transform: `scale(${growthProgress > 0.3 ? 1 : 0})`, transformOrigin: "50px 60px", opacity: growthProgress > 0.3 ? 1 : 0 }}>
              <g transform="translate(25, 45)"><circle r="8" fill="#FFB7C5" opacity="0.8" /><circle cx="-4" cy="-3" r="6" fill="#FFC0CB" opacity="0.6" /></g>
              <g transform="translate(75, 35)"><circle r="10" fill="#FFC0CB" opacity="0.8" /><circle cx="5" cy="-4" r="7" fill="#FFB7C5" opacity="0.6" /></g>
              <g transform="translate(52, 20)"><circle r="12" fill="#FFD1DC" opacity="0.9" /><circle cx="-6" cy="-2" r="8" fill="#FFB7C5" opacity="0.7" /></g>
            </g>
          </g>
        </svg>

        {/* Floating Petals */}
        {(running || timerCompleted) && growthProgress > 0.4 && [1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ position: "absolute", top: "30%", left: `${15 + i * 15}%`, width: "8px", height: "10px", background: "#FFB7C5", borderRadius: "80% 10% 80% 50%", animation: `petalFloat ${4 + i}s infinite linear`, animationDelay: `${i * 0.5}s`, opacity: 0 }} />
        ))}
      </div>

      <div style={{ marginTop: "1.5rem", fontSize: "3.5rem", fontWeight: 800, color: "#2D3436", letterSpacing: "-0.05em" }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ fontSize: "0.9rem", color: "#B2BEC3", fontWeight: 500, marginBottom: "2rem" }}>
        {timerCompleted ? "Your focus has blossomed." : "Watch your focus grow."}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {!timerCompleted ? (
          <>
            <button
              onClick={() => setRunning(!running)}
              style={{
                backgroundColor: running ? "#FFFFFF" : "#FF8E9D",
                color: running ? "#FF8E9D" : "#FFFFFF",
                border: running ? "2px solid #FF8E9D" : "none",
                borderRadius: "100px",
                padding: "1rem 3rem",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: running ? "0 4px 12px rgba(255, 142, 157, 0.1)" : "0 12px 30px rgba(255, 142, 157, 0.35)",
                transition: "all 0.4s ease",
                animation: running ? "none" : "pulseShadow 3s infinite ease-in-out",
              }}
            >
              {running ? "Pause" : "Start Session"}
            </button>
            
            {/* Cancel Button: Only visible when paused and session has started */}
            {!running && timeLeft < durationInSeconds && (
              <button 
                onClick={resetState}
                style={{ background: "none", border: "none", color: "#B2BEC3", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline", fontWeight: 500 }}
              >
                Cancel Session
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleContinue}
            style={{
              backgroundColor: "#FF8E9D", color: "#FFFFFF", border: "none", borderRadius: "100px", padding: "1rem 4rem", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 12px 30px rgba(255, 142, 157, 0.4)", transform: "scale(1.05)", transition: "all 0.4s ease"
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
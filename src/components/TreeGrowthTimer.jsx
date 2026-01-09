import React, { useEffect, useState, useRef } from "react";

const TreeGrowthTimer = ({
  durationInSeconds = 1500,
  setSession,
  setSessionactive,
  setIsmusicplaying,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [running, setRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const growthProgress = (durationInSeconds - timeLeft) / durationInSeconds;
  const audioRef = useRef(false);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!started) {
      return;
    }
    const sAtive = setInterval(() => {
      setSessionactive((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(sAtive);
    };
  }, [started]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (timerCompleted) {
      setIsmusicplaying(false)
      audio.loop = true;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error(
            "Playback prevented. Ensure user interacted with the page.",
            error
          );
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [timerCompleted]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          setTimerCompleted(true);
          setStarted(false);
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
    setStarted(false);
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
        boxShadow:
          "0 20px 50px rgba(255, 183, 197, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
        fontFamily:
          "'-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', sans-serif",
        animation: "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <audio ref={audioRef} src="/timer.wav"></audio>
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

      <div
        style={{
          margin: "0 auto",
          width: "220px",
          height: "220px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <ellipse
            cx="50"
            cy="95"
            rx="25"
            ry="5"
            fill="rgba(255, 183, 197, 0.46)"
          />

          <path
            d={`M46,95 L54,95 L51,45 L49,45 Z`}
            fill="#5D4037"
            style={{
              transition: "opacity 0.5s ease",
              opacity: growthProgress > 0 ? 1 : 0,
              transformOrigin: "50px 95px",
              transform: `scaleY(${Math.min(1, growthProgress / 0.25)})`,
            }}
          />

          <g>
            <path
              d="M49.5,74 L50,77 L24,61 L25,60 Z"
              fill="#5D4037"
              style={{
                transformOrigin: "50px 75px",
                transition: "transform 0.6s ease-out",
                transform: `scale(${Math.max(
                  0,
                  Math.min(1, (growthProgress - 0.3) / 0.25)
                )})`,
              }}
            />

            <path
              d="M50,72 L50.5,69 L76,56 L75,55 Z"
              fill="#5D4037"
              style={{
                transformOrigin: "50px 70px",
                transition: "transform 0.6s ease-out",
                transform: `scale(${Math.max(
                  0,
                  Math.min(1, (growthProgress - 0.4) / 0.25)
                )})`,
              }}
            />

            <path
              d="M49.5,61 L50.5,63 L19,46 L20,45 Z"
              fill="#5D4037"
              style={{
                transformOrigin: "50px 62px",
                transition: "transform 0.6s ease-out",
                transform: `scale(${Math.max(
                  0,
                  Math.min(1, (growthProgress - 0.5) / 0.25)
                )})`,
              }}
            />

            <path
              d="M49.5,54 L50.5,56 L81,36 L80,35 Z"
              fill="#5D4037"
              style={{
                transformOrigin: "50px 55px",
                transition: "transform 0.6s ease-out",
                transform: `scale(${Math.max(
                  0,
                  Math.min(1, (growthProgress - 0.6) / 0.2)
                )})`,
              }}
            />

            <path
              d="M50,47 L51,49 L34,29 L35,28 Z"
              fill="#5D4037"
              style={{
                transformOrigin: "50px 48px",
                transition: "transform 0.6s ease-out",
                transform: `scale(${Math.max(
                  0,
                  Math.min(1, (growthProgress - 0.65) / 0.2)
                )})`,
              }}
            />

            <path
              d="M49.3,45 L50.7,45 L50.4,12 L49.6,12 Z"
              fill="#5D4037"
              style={{
                transformOrigin: "50px 45px",
                transition: "transform 0.6s ease-out",
                transform: `scale(${Math.max(
                  0,
                  Math.min(1, (growthProgress - 0.7) / 0.15)
                )})`,
              }}
            />

            {(() => {
              const colors = ["#FFB7C5", "#FFC0CB", "#FFD1DC"];
              const clusters = [
                { x: 24.5, y: 60.5, r: 8, d: 0.1 },
                { x: 37, y: 68, r: 6, d: 0.05 },
                { x: 75.5, y: 55.5, r: 8, d: 0.2 },
                { x: 62, y: 63, r: 6, d: 0.15 },
                { x: 19.5, y: 45.5, r: 9, d: 0.3 },
                { x: 35, y: 53, r: 6, d: 0.25 },
                { x: 45, y: 58, r: 5, d: 0.2 },
                { x: 80.5, y: 35.5, r: 9, d: 0.4 },
                { x: 65, y: 45, r: 7, d: 0.35 },
                { x: 55, y: 52, r: 5, d: 0.3 },
                { x: 34.5, y: 28.5, r: 9, d: 0.45 },
                { x: 51, y: 12, r: 10, d: 0.5 },
                { x: 50.5, y: 25, r: 8, d: 0.45 },
                { x: 50, y: 38, r: 7, d: 0.4 },
              ];

              return (
                <g
                  style={{
                    opacity: growthProgress > 0.5 ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  {clusters.map((pos, i) => {
                    const individualScale = Math.max(
                      0,
                      (growthProgress - (0.6 + pos.d * 0.3)) /
                        (1 - (0.6 + pos.d * 0.3))
                    );
                    return (
                      individualScale > 0 && (
                        <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle
                            r={pos.r * individualScale}
                            fill={colors[i % 3]}
                            opacity="0.8"
                          />
                          <circle
                            cx={-pos.r / 4}
                            cy={-pos.r / 4}
                            r={pos.r * 0.6 * individualScale}
                            fill={colors[(i + 1) % 3]}
                            opacity="0.6"
                          />
                        </g>
                      )
                    );
                  })}
                </g>
              );
            })()}
          </g>
        </svg>

        {(running || timerCompleted) &&
          growthProgress > 0.8 &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "20%",
                left: `${10 + i * 12}%`,
                width: "8px",
                height: "10px",
                background: "#FFB7C5",
                borderRadius: "80% 10% 80% 50%",
                animation: `petalFloat ${5 + i}s infinite linear`,
                animationDelay: `${i * 0.7}s`,
                opacity: 0,
              }}
            />
          ))}

        <style>{`
    @keyframes petalFloat {
      0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(170px) translateX(25px) rotate(450deg); opacity: 0; }
    }
  `}</style>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          fontSize: "3.5rem",
          fontWeight: 800,
          color: "#2D3436",
          letterSpacing: "-0.05em",
        }}
      >
        {formatTime(timeLeft)}
      </div>

      <div
        style={{
          fontSize: "0.9rem",
          color: "#B2BEC3",
          fontWeight: 500,
          marginBottom: "2rem",
        }}
      >
        {timerCompleted
          ? "Your focus has blossomed."
          : "Watch your focus grow."}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {!timerCompleted ? (
          <>
            <button
              onClick={() => {
                if (audioRef.current && !started) {
                  const playPromise = audioRef.current.play();

                  if (playPromise !== undefined) {
                    playPromise
                      .then(() => {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      })
                      .catch((error) => {
                        console.log("Audio priming blocked:", error);
                      });
                  }
                }
                setRunning(!running);
                setStarted(true);
              }}
              style={{
                backgroundColor: running ? "#FFFFFF" : "#FF8E9D",
                color: running ? "#FF8E9D" : "#FFFFFF",
                border: running ? "2px solid #FF8E9D" : "none",
                borderRadius: "100px",
                padding: "1rem 3rem",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: running
                  ? "0 4px 12px rgba(255, 142, 157, 0.1)"
                  : "0 12px 30px rgba(255, 142, 157, 0.35)",
                transition: "all 0.4s ease",
                animation: running
                  ? "none"
                  : "pulseShadow 3s infinite ease-in-out",
              }}
            >
              {running ? "Pause" : "Start Session"}
            </button>

            {!running && timeLeft < durationInSeconds && (
              <button
                onClick={resetState}
                style={{
                  background: "none",
                  border: "none",
                  color: "#B2BEC3",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
              >
                Cancel Session
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleContinue}
            style={{
              backgroundColor: "#FF8E9D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "100px",
              padding: "1rem 4rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 12px 30px rgba(255, 142, 157, 0.4)",
              transform: "scale(1.05)",
              transition: "all 0.4s ease",
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

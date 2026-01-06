import { useEffect, useState } from "react";
import { updateHabitDB } from "./db.js";

export default function Habitbox({ habit, onDelete }) {
  const [count, setCount] = useState(habit.count);
  const [streak, setStreak] = useState(habit.streak);
  const [iscompleted, setIscompleted] = useState(habit.iscomplete);
  const [logs, setLogs] = useState(habit.logs || []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (habit.lastComplete !== today) {
      updateHabitDB({ ...habit, iscomplete: false });
      setIscompleted(false);
    }
  }, []);

  const handleComplete = () => {
    if (iscompleted) return; // Prevent double clicking if already done

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const newCount = count + 1;
    const newStreak = habit.lastComplete === yesterday ? streak + 1 : 1;
    const newLogs = logs.includes(today) ? logs : [...logs, today];

    setCount(newCount);
    setStreak(newStreak);
    setIscompleted(true);
    setLogs(newLogs);

    updateHabitDB({
      ...habit,
      count: newCount,
      streak: newStreak,
      lastComplete: today,
      iscomplete: true,
      logs: newLogs,
    });
  };

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div
      style={{
        width: "100%",
        minWidth: "18rem",
        maxWidth: "24rem",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: "2rem",
        padding: "1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 30px rgba(255, 183, 197, 0.15)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Row: Info & Delete */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#2D3436" }}>
            {habit.name}
          </h3>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#FF8FB1", fontWeight: 700 }}>
              🔥 {streak} DAY STREAK
            </span>
            <span style={{ fontSize: "0.75rem", color: "#A0A0A0", fontWeight: 600 }}>
              TOTAL: {count}
            </span>
          </div>
        </div>
        <button
          onClick={onDelete}
          style={{
            background: "#FFF0F3",
            border: "none",
            borderRadius: "50%",
            width: "2rem",
            height: "2rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFB7C5",
            fontSize: "1rem",
          }}
        >
          ×
        </button>
      </div>

      {/* 30 Day Activity Map */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {last30Days.map((date) => (
          <div
            key={date}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "2px",
              backgroundColor: logs.includes(date) ? "#FF8FB1" : "#FFF0F3",
              transition: "transform 0.2s ease",
            }}
            title={date}
          />
        ))}
      </div>

      {/* Completion Button */}
      <button
        onClick={handleComplete}
        disabled={iscompleted}
        style={{
          width: "100%",
          padding: "0.8rem",
          borderRadius: "1.2rem",
          border: "none",
          background: iscompleted 
            ? "#F0F0F0" 
            : "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)",
          color: iscompleted ? "#A0A0A0" : "#FFFFFF",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: iscompleted ? "default" : "pointer",
          boxShadow: iscompleted ? "none" : "0 8px 16px rgba(255, 143, 177, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}
      >
        {iscompleted ? (
          <>
            <span style={{ fontSize: "1rem" }}>✓</span> Done for today
          </>
        ) : (
          "Mark Complete"
        )}
      </button>

      {/* Subtle Background Accent */}
      <div style={{
        position: "absolute",
        bottom: "-10px",
        right: "-10px",
        fontSize: "4rem",
        opacity: 0.05,
        userSelect: "none",
        pointerEvents: "none"
      }}>
        🌸
      </div>
    </div>
  );
}
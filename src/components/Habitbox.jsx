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
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    const newCount = iscompleted ? count : count + 1;
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
    backgroundColor: "#ECEFF4",
    borderRadius: "1.2rem",
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow:
      "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
  }}
>
  {/* Header */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "#2E3440",
        }}
      >
        {habit.name}
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#4C566A",
          marginTop: "0.2rem",
        }}
      >
        Count: {count} | Streak: {streak}
      </div>
    </div>

    <button
      onClick={onDelete}
      style={{
        border: "none",
        backgroundColor: "#ECEFF4",
        color: "#BF616A",
        borderRadius: "0.6rem",
        padding: "0.3rem 0.6rem",
        fontSize: "0.75rem",
        cursor: "pointer",
        margin:'0.3em 1em',
        boxShadow:
          "0.2rem 0.2rem 0.4rem #D1D9E6, -0.2rem -0.2rem 0.4rem #FFFFFF",
      }}
    >
      ✕
    </button>
  </div>

  {/* 30-day grid */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(10, 1fr)",
      gap: "0.35rem",
    }}
  >
    {last30Days.map((day) => (
      <div
        key={day}
        title={day}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "0.35rem",
          backgroundColor: "#ECEFF4",
          boxShadow: logs.includes(day)
            ? "inset 0.2rem 0.2rem 0.4rem #A3BE8C, inset -0.2rem -0.2rem 0.4rem #FFFFFF"
            : "inset 0.2rem 0.2rem 0.4rem #D1D9E6, inset -0.2rem -0.2rem 0.4rem #FFFFFF",
        }}
      />
    ))}
  </div>

  {/* Complete button */}
  <button
    onClick={handleComplete}
    disabled={iscompleted}
    style={{
      marginTop: "0.6rem",
      padding: "0.7rem",
      fontSize: "0.8rem",
      fontWeight: 600,
      borderRadius: "1rem",
      border: "none",
      cursor: iscompleted ? "not-allowed" : "pointer",
      backgroundColor: "#ECEFF4",
      color: iscompleted ? "#A3BE8C" : "#5E81AC",
      boxShadow: iscompleted
        ? "inset 0.3rem 0.3rem 0.6rem #D1D9E6, inset -0.3rem -0.3rem 0.6rem #FFFFFF"
        : "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
    }}
  >
    {iscompleted ? "Done" : "Did it"}
  </button>
</div>


  );
}

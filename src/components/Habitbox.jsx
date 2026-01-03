import { useEffect, useState } from "react";
import { updateHabitDB } from "./db.js";
import "../pages/Dashboard.css";

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
    <div className="habitbox">
      <div className="habitbox-header">
        <div>
          <div className="habitbox-title">{habit.name}</div>
          <div className="habitbox-stats">
            Count: {count} | Streak: {streak}
          </div>
        </div>

        <button className="habitbox-delete" onClick={onDelete}>
          X
        </button>
      </div>

      <div className="habitbox-grid">
        {last30Days.map((day) => (
          <div
            key={day}
            title={day}
            className={`habitbox-day ${
              logs.includes(day) ? "active" : ""
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleComplete}
        disabled={iscompleted}
        className={`habitbox-complete ${
          iscompleted ? "disabled" : ""
        }`}
      >
        {iscompleted ? "Done" : "Did it"}
      </button>
    </div>
  );
}

import React, { useState } from 'react';

export default function StudyTaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish Binary Search Trees", priority: "High", completed: false },
    { id: 2, text: "Review React Hooks", priority: "Medium", completed: true },
  ]);
  const [input, setInput] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([{ id: Date.now(), text: input, priority: "Medium", completed: false }, ...tasks]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: "2rem",
      padding: "1.5rem",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      boxShadow: "0 10px 30px rgba(255, 183, 197, 0.15)",
      maxWidth: "24rem",
      width: "100%"
    }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: 800, color: "#2D3436" }}>
        Study Focus Tasks ✍️
      </h3>

      <form onSubmit={addTask} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's next?"
          style={{
            flex: 1,
            padding: "0.8rem 1.2rem",
            borderRadius: "1rem",
            border: "1px solid #FFF0F3",
            backgroundColor: "#FFF9FA",
            outline: "none",
            fontSize: "0.9rem"
          }}
        />
        <button type="submit" style={{
          backgroundColor: "#FFB7C5",
          border: "none",
          borderRadius: "1rem",
          width: "3rem",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}>+</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: task.completed ? "rgba(255, 255, 255, 0.4)" : "#FFFFFF",
              borderRadius: "1.2rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: task.completed ? "1px solid transparent" : "1px solid #FFF0F3",
              opacity: task.completed ? 0.6 : 1
            }}
          >
            <div style={{
              width: "1.2rem",
              height: "1.2rem",
              borderRadius: "50%",
              border: "2px solid #FFB7C5",
              backgroundColor: task.completed ? "#FFB7C5" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              color: "white"
            }}>
              {task.completed && "✓"}
            </div>
            <span style={{ 
              flex: 1, 
              fontSize: "0.9rem", 
              textDecoration: task.completed ? "line-through" : "none",
              color: "#4A4A4A",
              fontWeight: 500
            }}>
              {task.text}
            </span>
            {!task.completed && (
              <span style={{
                fontSize: "0.65rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "100px",
                backgroundColor: "#FFF0F3",
                color: "#D6336C",
                fontWeight: 700,
                textTransform: "uppercase"
              }}>
                {task.priority}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
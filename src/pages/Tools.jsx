import React, { useState, useEffect } from "react";
import {
  addHabitDB,
  getHabitsDB,
  resetDailyDB,
  deleteHabitDB,
  getTasksDB,
  addTaskDB,
  updateTaskDB,
  deleteTaskDB, // Recommended to add for full functionality
} from "../components/db.js";
import Habitbox from "../components/Habitbox.jsx";
import { useForm } from "react-hook-form";
import { NavLink } from 'react-router-dom';

const Tools = () => {
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [addHabit, setAddHabit] = useState(false);
  const [taskInput, setTaskInput] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 1. Initial Data Fetch from IndexedDB
  useEffect(() => {
    getHabitsDB().then(setHabits);
    getTasksDB().then(setTasks);
  }, []);

  // 2. Midnight Reset Logic for Habits
  useEffect(() => {
    const check = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDailyDB().then(() => window.location.reload());
      }
    }, 60000);
    return () => clearInterval(check);
  }, []);

  // --- Task List Handlers ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    
    const newTask = { 
      text: taskInput, 
      priority: "Medium", 
      completed: false,
      createdAt: new Date().toISOString() 
    };
    
    const id = await addTaskDB(newTask); // Save to IndexedDB
    setTasks([{ ...newTask, id }, ...tasks]); // Update UI
    setTaskInput("");
  };

  const toggleTask = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await updateTaskDB(updatedTask); // Update IndexedDB
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t)); // Update UI
  };

  const removeTask = async (e, id) => {
    e.stopPropagation(); // Prevent toggling when clicking delete
    await deleteTaskDB(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  // --- Habit Handlers ---
  const deleteHabit = (id) => {
    deleteHabitDB(id).then(() => {
      setHabits(habits.filter((h) => h.id !== id));
    });
  };

  const handleHabitSubmit = async (data) => {
    const habit = {
      name: data.habitName,
      count: 0,
      streak: 0,
      lastComplete: null,
      iscomplete: false,
      logs: [],
    };
    const id = await addHabitDB(habit);
    setHabits((h) => [...h, { ...habit, id }]);
    setAddHabit(false);
    reset();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF9FA",
        background: "linear-gradient(180deg, #FFF1F4 0%, #FFFFFF 100%)",
        paddingBottom: "15vh",
        fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "5rem 1.5rem 2rem" }}>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#2D3436", letterSpacing: "-0.04em", margin: 0 }}>
          Study Suite <span style={{ opacity: 0.8 }}>🌸</span>
        </h2>
        <p style={{ color: "#A0A0A0", fontSize: "0.9rem", marginTop: "0.5rem", fontWeight: 500 }}>
          Track your focus and build lasting routines.
        </p>
      </div>

      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "3.5rem" }}>
        
        {/* SECTION 1: STUDY TASK LIST (IndexedDB) */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FF8FB1", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Focus Tasks
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#B0B0B0", fontWeight: 600 }}>
              {tasks.filter(t => !t.completed).length} Pending
            </span>
          </div>

          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: "2.2rem",
            padding: "1.8rem",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 15px 35px rgba(255, 143, 177, 0.08)",
          }}>
            <form onSubmit={addTask} style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem" }}>
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="What's your next study goal?"
                style={{
                  flex: 1,
                  padding: "1rem 1.4rem",
                  borderRadius: "1.4rem",
                  border: "1px solid #FFF0F3",
                  backgroundColor: "#FFFFFF",
                  outline: "none",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  boxShadow: "inset 0 2px 4px rgba(255, 143, 177, 0.02)"
                }}
              />
              <button type="submit" style={{
                backgroundColor: "#FFB7C5",
                border: "none",
                borderRadius: "1.4rem",
                width: "3.8rem",
                color: "white",
                fontSize: "1.8rem",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(255, 143, 177, 0.3)",
                transition: "transform 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >+</button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    padding: "1.1rem",
                    backgroundColor: task.completed ? "rgba(255, 255, 255, 0.3)" : "#FFFFFF",
                    borderRadius: "1.4rem",
                    cursor: "pointer",
                    border: "1px solid #FFF5F7",
                    opacity: task.completed ? 0.6 : 1,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  <div style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    border: "2px solid #FFB7C5",
                    backgroundColor: task.completed ? "#FFB7C5" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    color: "white"
                  }}>{task.completed && "✓"}</div>
                  
                  <span style={{ 
                    flex: 1, 
                    fontSize: "1rem", 
                    textDecoration: task.completed ? "line-through" : "none", 
                    color: "#2D3436", 
                    fontWeight: 600 
                  }}>
                    {task.text}
                  </span>

                  <button 
                    onClick={(e) => removeTask(e, task.id)}
                    style={{ background: "none", border: "none", color: "#FFB7C5", cursor: "pointer", fontSize: "1.2rem", padding: "0 0.5rem" }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p style={{ textAlign: "center", color: "#D0D0D0", fontSize: "0.9rem", padding: "1rem" }}>
                  Your task list is empty. Add a goal to stay focused!
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: HABIT TRACKER (IndexedDB) */}
        <section>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FF8FB1", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1.2rem" }}>
            Daily Habits
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {habits.map((itm) => (
              <Habitbox key={itm.id} habit={itm} onDelete={() => deleteHabit(itm.id)} />
            ))}
            {habits.length === 0 && (
              <div style={{ 
                width: "100%", textAlign: "center", padding: "4rem 2rem", 
                backgroundColor: "rgba(255,255,255,0.4)", borderRadius: "2.5rem", 
                border: "2px dashed rgba(255, 183, 197, 0.3)" 
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌱</div>
                <p style={{ color: "#A0A0A0", fontWeight: 600 }}>Build a routine. Add your first habit!</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Habit Form Overlay */}
      {addHabit && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(45, 52, 54, 0.2)",
          backdropFilter: "blur(16px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <form onSubmit={handleSubmit(handleHabitSubmit)} style={{
            width: "90%", maxWidth: "24rem", backgroundColor: "#FFFFFF", padding: "3rem 2rem",
            borderRadius: "2.5rem", boxShadow: "0 40px 80px rgba(255, 143, 177, 0.25)", display: "flex", flexDirection: "column", gap: "1.5rem"
          }}>
            <div style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 800, color: "#2D3436" }}>New Habit</div>
            <input
              type="text"
              placeholder="E.g., Morning Coding, Meditation..."
              {...register("habitName", { required: true })}
              autoFocus
              style={{ 
                padding: "1.1rem 1.4rem", borderRadius: "1.4rem", border: "1px solid #FFF0F3", 
                backgroundColor: "#FFF9FA", outline: "none", fontSize: "1rem" 
              }}
            />
            <button type="submit" style={{
              padding: "1.1rem", borderRadius: "1.4rem", border: "none", fontWeight: 700,
              background: "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)", color: "white", 
              cursor: "pointer", boxShadow: "0 10px 20px rgba(255, 143, 177, 0.3)"
            }}>Start Tracking</button>
            <button type="button" onClick={() => setAddHabit(false)} style={{ background: "none", border: "none", color: "#A0A0A0", cursor: "pointer", fontWeight: 600 }}>Maybe later</button>
          </form>
        </div>
      )}

      {/* Floating Add Habit Button */}
      {!addHabit && (
        <div onClick={() => setAddHabit(true)} style={{
          position: "fixed", bottom: "11vh", right: "2rem", width: "4.5rem", height: "4.5rem",
          borderRadius: "50%", background: "linear-gradient(135deg, #FFB7C5 0%, #FF8FB1 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem",
          color: "#FFFFFF", cursor: "pointer", boxShadow: "0 15px 35px rgba(255, 143, 177, 0.4)", zIndex: 1100,
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1) rotate(90deg)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
        >+</div>
      )}

      {/* Bottom Nav Bar */}
      <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "24rem",
            height: "4.5rem",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "100px",
            boxShadow: "0 15px 35px rgba(255, 143, 177, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            zIndex: 100,
          }}
        >
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Focus", path: "/focusmode" },
            { label: "Tools", path: "/tools" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                fontSize: "0.8rem",
                fontWeight: 700,
                color: isActive ? "#D6336C" : "#A0A0A0",
                textDecoration: "none",
                padding: "0.75rem 1rem",
                borderRadius: "100px",
                backgroundColor: isActive ? "#FFF0F3" : "transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
    </div>
  );
};

export default Tools;
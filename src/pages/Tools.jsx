import { useState, useEffect } from "react";
import {
  addHabitDB,
  getHabitsDB,
  resetDailyDB,
  deleteHabitDB,
  getTasksDB,
  addTaskDB,
  updateTaskDB,
  deleteTaskDB,
} from "../components/db.js";
import Habitbox from "../components/Habitbox.jsx";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";

const Tools = () => {
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [addHabit, setAddHabit] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("P1");

  const { register, reset, handleSubmit } = useForm();

  // Priority Configuration
  const priorityConfig = {
    P1: { label: "Urgent & Important", color: "#FF6B6B", bg: "#FFF0F0", weight: 1 },
    P2: { label: "Important, Not Immediate", color: "#4DABF7", bg: "#E7F5FF", weight: 2 },
    P3: { label: "Immediate, Not Important", color: "#FCC419", bg: "#FFF9DB", weight: 3 },
    P4: { label: "Not Important / Not Immediate", color: "#A0A0A0", bg: "#F8F9FA", weight: 4 },
  };

  // Helper function to safely sort tasks without crashing on undefined priorities
  const sortTasks = (data) => {
    return [...data].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const weightA = priorityConfig[a.priority]?.weight ?? 5;
      const weightB = priorityConfig[b.priority]?.weight ?? 5;
      return weightA - weightB;
    });
  };

  useEffect(() => {
    getHabitsDB().then(setHabits);
    getTasksDB().then((data) => {
      setTasks(sortTasks(data));
    });
  }, []);

  useEffect(() => {
    const check = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDailyDB().then(() => window.location.reload());
      }
    }, 60000);
    return () => clearInterval(check);
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    const newTask = {
      text: taskInput,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const id = await addTaskDB(newTask);
    setTasks(sortTasks([{ ...newTask, id }, ...tasks]));
    setTaskInput("");
    setPriority("P1");
  };

  const toggleTask = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await updateTaskDB(updatedTask);
    const newTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));
    setTasks(sortTasks(newTasks));
  };

  const removeTask = async (e, id) => {
    e.stopPropagation();
    await deleteTaskDB(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

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
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ width: "95%", maxWidth: "60rem", margin: "0 auto", padding: "4rem 1rem 2rem" }}>
        <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.2rem)", fontWeight: 800, color: "#2D3436", margin: 0 }}>
          Study Suite <span style={{ opacity: 0.8 }}>🌸</span>
        </h2>
        <p style={{ color: "#A0A0A0", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Track your focus and build lasting routines.
        </p>
      </div>

      <div style={{ width: "95%", maxWidth: "60rem", margin: "0 auto", padding: "0 1rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FF8FB1", textTransform: "uppercase" }}>Focus Tasks</h3>
            <span style={{ fontSize: "0.75rem", color: "#B0B0B0" }}>{tasks.filter((t) => !t.completed).length} Pending</span>
          </div>
          

          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(12px)", borderRadius: "2.2rem", padding: "1.5rem", border: "1px solid rgba(255, 255, 255, 0.8)" }}>
            <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <input
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="What's your next study goal?"
                  style={{ flex: 1, padding: "1rem", borderRadius: "1.4rem", border: "1px solid #FFF0F3" }}
                />
                <button type="submit" style={{ backgroundColor: "#FFB7C5", border: "none", borderRadius: "1.4rem", width: "3.5rem", color: "white", fontSize: "1.8rem" }}>+</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {Object.keys(priorityConfig).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPriority(key)}
                    style={{
                      padding: "0.5rem 0.9rem",
                      borderRadius: "1rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      border: priority === key ? `2px solid ${priorityConfig[key].color}` : "1px solid #FFF0F3",
                      backgroundColor: priority === key ? priorityConfig[key].bg : "#FFFFFF",
                      color: priority === key ? priorityConfig[key].color : "#A0A0A0",
                    }}
                  >
                    {priorityConfig[key].label}
                  </button>
                ))}
              </div>
            </form>
{tasks.length === 0 && (
                <p style={{ textAlign: "center", color: "#D0D0D0", fontSize: "0.9rem", padding: "1rem" }}>
                  Your task list is empty. Add a goal to stay focused!
                </p>
              )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {tasks.map((task) => {
                // FALLBACKS: This prevents the "undefined reading color" error
                const config = priorityConfig[task.priority] || priorityConfig["P4"];
                
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1.1rem",
                      backgroundColor: task.completed ? "rgba(255, 255, 255, 0.3)" : "#FFFFFF",
                      borderRadius: "1.5rem",
                      border: "1px solid #FFF5F7",
                      opacity: task.completed ? 0.6 : 1,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", backgroundColor: config.color }} />
                    <div style={{
                      width: "1.4rem",
                      height: "1.4rem",
                      borderRadius: "50%",
                      border: `2px solid ${config.color}`,
                      backgroundColor: task.completed ? config.color : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: "white"
                    }}>
                      {task.completed && "✓"}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.95rem", textDecoration: task.completed ? "line-through" : "none", color: "#2D3436", fontWeight: 600 }}>
                        {task.text}
                      </span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: config.color, textTransform: "uppercase" }}>
                        {config.label}
                      </span>
                    </div>
                    <button onClick={(e) => removeTask(e, task.id)} style={{ background: "none", border: "none", color: "#FFB7C5", fontSize: "1.2rem" }}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FF8FB1", textTransform: "uppercase", marginBottom: "1.2rem" }}>Daily Habits</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {habits.map((itm) => (
              <Habitbox key={itm.id} habit={itm} onDelete={() => deleteHabit(itm.id)} />
            ))}
          </div>
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
        </section>
      </div>

      {addHabit && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(45, 52, 54, 0.2)", backdropFilter: "blur(16px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form onSubmit={handleSubmit(handleHabitSubmit)} style={{ width: "90%", maxWidth: "24rem", backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 800 }}>New Habit</div>
            <input type="text" placeholder="E.g., Meditation" {...register("habitName", { required: true })} style={{ padding: "1rem", borderRadius: "1.4rem", border: "1px solid #FFF0F3" }} />
            <button type="submit" style={{ padding: "1rem", borderRadius: "1.4rem", border: "none", background: "linear-gradient(135deg, #FFB7C5, #FF8FB1)", color: "white", fontWeight: 700 }}>Start Tracking</button>
            <button type="button" onClick={() => setAddHabit(false)} style={{ background: "none", border: "none", color: "#A0A0A0" }}>Cancel</button>
          </form>
        </div>
      )}

      {!addHabit && (
        <div onClick={() => setAddHabit(true)} style={{ position: "fixed", bottom: "12vh", right: "1.5rem", width: "4rem", height: "4rem", borderRadius: "50%", background: "linear-gradient(135deg, #FFB7C5, #FF8FB1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "#FFFFFF", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", zIndex: 1100 }}>+</div>
      )}

      {/* Bottom Nav Bar */}
      <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "24rem", height: "4.5rem", display: "flex", justifyContent: "space-around", alignItems: "center", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(20px)", borderRadius: "100px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", zIndex: 100 }}>
        {[{ label: "Dashboard", path: "/dashboard" }, { label: "Focus", path: "/focusmode" }, { label: "Tools", path: "/tools" }].map((item) => (
          <NavLink key={item.path} to={item.path} style={({ isActive }) => ({ fontSize: "0.75rem", fontWeight: 700, color: isActive ? "#D6336C" : "#A0A0A0", textDecoration: "none", padding: "0.6rem 1rem", borderRadius: "100px", backgroundColor: isActive ? "#FFF0F3" : "transparent" })}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Tools;
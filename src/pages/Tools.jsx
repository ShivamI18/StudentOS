import React from 'react'
import { useState, useEffect } from "react";
import {
  addHabitDB,
  getHabitsDB,
  resetDailyDB,
  deleteHabitDB,
} from "../components/db.js";
import Habitbox from "../components/Habitbox.jsx";
import { useForm } from "react-hook-form";
import { NavLink } from 'react-router-dom'
const Tools = () => {
    const [habits, setHabits] = useState([]);
  const [addHabit, setAddHabit] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getHabitsDB().then(setHabits);
  }, []);

  // Auto reset at midnight
  useEffect(() => {
    const check = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDailyDB().then(() => window.location.reload());
      }
    }, 60000);

    return () => clearInterval(check);
  }, []);

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
  logs: [], // ✅ REQUIRED FOR HEATMAP
};

    const id = await addHabitDB(habit);
    setHabits((h) => [...h, { ...habit, id }]);
    setAddHabit(false)
    reset();
  };
  return (
    <div
  style={{
    minHeight: "100vh",
    backgroundColor: "#ECEFF4",
    paddingBottom: "10vh",
  }}
>
  {/* Header */}
  <h2
    style={{
      padding: "6vh 5vw 2vh",
      fontSize: "1.6rem",
      fontWeight: 600,
      color: "#2E3440",
      maxWidth: "60rem",
      margin: "0 auto",
    }}
  >
    H-Tracker
  </h2>

  {/* Content */}
  <div
    style={{
      maxWidth: "60rem",
      margin: "0 auto",
      padding: "0 5vw",
    }}
  >
    {addHabit ? (
      /* Add Habit Overlay */
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(236,239,244,0.85)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <form
          onSubmit={handleSubmit(handleHabitSubmit)}
          style={{
            width: "90%",
            maxWidth: "22rem",
            backgroundColor: "#ECEFF4",
            padding: "2rem",
            borderRadius: "1.5rem",
            boxShadow:
              "0.6rem 0.6rem 1.2rem #D1D9E6, -0.6rem -0.6rem 1.2rem #FFFFFF",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "#2E3440",
            }}
          >
            Add Habit
          </div>

          <input
            type="text"
            placeholder="Habit Name"
            {...register("habitName", { required: true })}
            autoFocus
            style={{
              padding: "0.9rem 1rem",
              fontSize: "0.9rem",
              borderRadius: "1rem",
              border: "none",
              outline: "none",
              backgroundColor: "#ECEFF4",
              color: "#2E3440",
              boxShadow: errors.habitName
                ? "inset 0 0 0 1px #BF616A"
                : "inset 0.3rem 0.3rem 0.6rem #D1D9E6, inset -0.3rem -0.3rem 0.6rem #FFFFFF",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0.8rem",
              borderRadius: "1rem",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              backgroundColor: "#ECEFF4",
              color: "#5E81AC",
              boxShadow:
                "0.4rem 0.4rem 0.8rem #D1D9E6, -0.4rem -0.4rem 0.8rem #FFFFFF",
              cursor: "pointer",
            }}
          >
            Save Habit
          </button>
        </form>
      </div>
    ) : (
      /* Habit List */
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.2rem",
          paddingBottom: "2rem",
        }}
      >
        {habits.map((itm) => (
          <div key={itm.id}>
            {/* Imported component untouched */}
            <Habitbox
              habit={itm}
              onDelete={() => deleteHabit(itm.id)}
            />
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Floating Add Button */}
  <div
    onClick={() => setAddHabit(!addHabit)}
    style={{
      position: "fixed",
      bottom: "10vh",
      right: "6vw",
      width: "3.5rem",
      height: "3.5rem",
      borderRadius: "50%",
      backgroundColor: "#ECEFF4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.2rem",
      color: "#5E81AC",
      cursor: "pointer",
      transform: `rotate(${addHabit ? "45deg" : "0deg"})`,
      transition: "transform 0.3s ease",
      boxShadow:
        "0.5rem 0.5rem 1rem #D1D9E6, -0.5rem -0.5rem 1rem #FFFFFF",
    }}
  >
    +
  </div>

  {/* Bottom Nav */}
  <div
    style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      height: "8vh",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#ECEFF4",
      boxShadow:
        "0 -0.4rem 0.8rem #D1D9E6, 0 0.4rem 0.8rem #FFFFFF",
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
          fontSize: "0.75rem",
          color: isActive ? "#5E81AC" : "#4C566A",
          textDecoration: "none",
        })}
      >
        {item.label}
      </NavLink>
    ))}
  </div>
</div>


  )
}

export default Tools

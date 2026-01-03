import React from 'react'
import './Dashboard.css'
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
    <div>
      <div style={{
    filter:'drop-shadow(0px 0px 10px 10px rgba(255, 255, 255, 1))'
    }}>
      <h2 className="monebold" style={{ margin: "1em 0 0 1em" }}>H-Tacker</h2>
      {addHabit ? (
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection:"column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(handleHabitSubmit)} className="form">
            <div style={{
              fontSize:"1.5em",
              fontWeight:"900",
              margin:"0  0.4em",
            }}>Add Habit</div>
            <div className="centre">
              <input
              className="inputbox"
                type="text"
                placeholder="Habit Name"
                {...register("habitName", { required: true })}
                style={{
                  border: errors.habitName
                    ? "1px solid red"
                    : "1px solid transparent",
                }}
                autoFocus
              />
            </div>
            <div className="centre">
              <button type="submit"
              style={{
                backgroundColor:"white",
                color:"rgb(41,41,41)",
                fontWeight:"600"
              }}
              className="submitbutton"
              >Submit</button>
            </div>
          </form>
        </div>
      ) : (
        <div
        style={{
          display:"flex",
          flexWrap:"wrap",
          gap:'1em',
          padding:"2em"
        }}
        >
          {habits.map((itm) => {
            return (
              <div>
                <Habitbox
                habit={itm}
                key={itm.id}
                onDelete={() => deleteHabit(itm.id)}
              />
              </div>
            );
          })}
        </div>
      )}
      <div
        className="addButton"
        onClick={() => {
          setAddHabit(!addHabit);
        }}
        style={{ transform: `rotate(${addHabit ? "45deg" : "0deg"})` }}
      >
        <div style={{ fontSize: "3em", position: "relative", top: "-4px" }}>
          +
        </div>
      </div>
    </div>
      <div className="navcontainer">
        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            color: isActive ? "#1d4ed8" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })}
          className="flex-col monthin"
          to={"/dashboard"}
        >
          Dashboard
        </NavLink>

        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            color: isActive ? "#1d4ed8" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })}
          className="flex-col monthin"
          to={"/focusmode"}
        >
          Focus
        </NavLink>

        <NavLink
          style={({ isActive }) => ({
            padding: "1em",
            color: isActive ? "#1d4ed8" : "#000",
            borderRadius: "8px",
            fontSize: "0.7em",
          })}
          className="flex-col monthin"
          to={"/tools"}
        >
          Tools
        </NavLink>
      </div>
    </div>
  )
}

export default Tools

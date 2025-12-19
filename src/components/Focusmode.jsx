import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const Focusmode = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [stopped, setStopped] = useState(false)
  const [finalTime, setFinalTime] = useState('')

  const {
    register,
    handleSubmit,
    reset
  } = useForm()

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const handleStartPause = () => {
    setRunning((prev) => !prev);
  };

  const handleStop = () => {
    setFinalTime(formatTime())
    setRunning(false);
    setSeconds(0);
    setStopped(true);
  };

  const formatTime = () => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFormSubmit = (data)=>{
    console.log(data);
    setStopped(false)
    const prompt = {
      time : finalTime,
      subject : data.subject,
      topics : data.topics,
      rating : data.rating
    }

    

    reset()
  }

  return (
    <div>
      <h1>Focus Mode</h1>
      <h2>{formatTime()}</h2>

      <button onClick={handleStartPause}>{running ? "Pause" : "Start"}</button>

      <button onClick={handleStop} style={{ marginLeft: "10px" }}>
        Stop
      </button>
      {stopped && <div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <input type="text" {...register('subject')} />
          <input type="text" {...register('topic')} />
          <input type="number" min={1} max={5} {...register('rating')}/>
          <input type="submit" value="Submit" />
        </form>
      </div> }
    </div>
  );
};

export default Focusmode;

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [seconds, setSeconds] = useState(25*60);
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  
  useEffect(() => {
    let interval;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setTimerCompleted(true);
            setStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, timeLeft]);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  const resetState = () => {
    setTimeLeft(seconds);
    setRunning(false);
    setStarted(false);
    setTimerCompleted(false);
  };

  const value = {
    timeLeft, setTimeLeft,
    running, setRunning,
    started, setStarted,
    timerCompleted, setTimerCompleted,
    resetState,
    seconds,setSeconds
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => useContext(TimerContext);
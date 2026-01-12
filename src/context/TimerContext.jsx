import React, { createContext, useContext, useState, useEffect } from "react";
import { ForegroundService } from '@capawesome-team/capacitor-android-foreground-service';
import { NativeAudio } from '@capacitor-community/native-audio';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  // 1. Manage the Foreground Service based on 'running' state
  useEffect(() => {
    const manageService = async () => {
      if (running) {
        await ForegroundService.startForegroundService({
          id: 12345,
          title: "Timer Active",
          body: "Your countdown is running...",
          smallIcon: "res://drawable/ic_stat_name", // Ensure this exists in Android Studio
          importance: 3,
        });
      } else {
        await ForegroundService.stopForegroundService();
      }
    };

    manageService();
  }, [running]);

  // 2. Your existing Interval Logic (Will now stay alive)
  useEffect(() => {
    let interval;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete(); // Call a helper to stop service and play sound
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, timeLeft]);

  // Helper to handle completion
  const handleTimerComplete = () => {
    setRunning(false);
    setTimerCompleted(true);
    setStarted(false);
    
    // Play sound using Native Audio (Reliable in background)
    NativeAudio.play({ assetId: 'alarm_sound' }).catch(err => console.log(err));
  };

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
    seconds, setSeconds
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => useContext(TimerContext);
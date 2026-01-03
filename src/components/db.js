// db.js
import { openDB } from "idb";

export const db = await openDB("HabitDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("habits")) {
      db.createObjectStore("habits", { keyPath: "id", autoIncrement: true });
    }
  }
});

export const addHabitDB = (habit) => db.add("habits", habit);
export const getHabitsDB = () => db.getAll("habits");
export const updateHabitDB = (habit) => db.put("habits", habit);
export const deleteHabitDB = (id) => db.delete("habits", id);

export const resetDailyDB = async () => {
  const all = await db.getAll("habits");
  for (let h of all) {
    h.isRunning = false;
    h.isStopped = false;
    await db.put("habits", h);
  }
};
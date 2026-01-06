import { openDB } from "idb";

const DB_NAME = "StudySuiteDB";
const VERSION = 2; 

export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("habits")) {
        db.createObjectStore("habits", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// --- HABIT HELPERS ---

export const addHabitDB = async (habit) => {
  const db = await initDB();
  return db.add("habits", habit);
};

export const getHabitsDB = async () => {
  const db = await initDB();
  return db.getAll("habits");
};

export const updateHabitDB = async (habit) => {
  const db = await initDB();
  return db.put("habits", habit);
};

export const deleteHabitDB = async (id) => {
  const db = await initDB();
  return db.delete("habits", id);
};

export const resetDailyDB = async () => {
  const db = await initDB();
  const all = await db.getAll("habits");
  for (let h of all) {
    // Resetting daily completion status
    h.iscomplete = false; 
    await db.put("habits", h);
  }
};

// --- TASK HELPERS ---

export const getTasksDB = async () => {
  const db = await initDB();
  return db.getAll("tasks");
};

export const addTaskDB = async (task) => {
  const db = await initDB();
  return db.add("tasks", task);
};

export const updateTaskDB = async (task) => {
  const db = await initDB();
  return db.put("tasks", task);
};

export const deleteTaskDB = async (id) => {
  const db = await initDB();
  return db.delete("tasks", id);
};
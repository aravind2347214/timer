import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Timer } from "../types/timer";

// Load timers from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('timerState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// Save timers to localStorage
const saveState = (state: { timers: Timer[] }) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('timerState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const initialState = loadState() || {
  timers: [] as Timer[],
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(
        (timer:Timer) => timer.id !== action.payload
      );
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer:Timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer:Timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(
        (timer:Timer) => timer.id === action.payload.id
      );
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
    },
    updateRemainingTime: (state, action) => {
      const { id, remainingTime } = action.payload;
      const timer = state.timers.find((timer:Timer) => timer.id === id);
      if (timer) {
        timer.remainingTime = remainingTime;
      }
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  restartTimer,
  editTimer,
  updateRemainingTime,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) =>
      dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) =>
      dispatch(editTimer({ id, updates })),
    updateRemainingTime: (id: string, remainingTime: number) =>
      dispatch(updateRemainingTime({ id, remainingTime })),
  };
};
import {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactElement,
} from "react";

import { getTimers, saveTimers } from "@src/utils";

const TimersContext = createContext<TimersContextValues>({
  timers: [],
  addTimer: () => {},
  updateTimer: () => {},
  deleteTimer: () => {},
});

function useTimers() {
  return useContext(TimersContext);
}

function TimersContextProvider({ children }: { children: ReactElement }) {
  const [timers, setTimers] = useState(getTimers());

  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  return (
    <TimersContext.Provider
      value={{
        timers,
        addTimer,
        deleteTimer,
        updateTimer,
      }}
    >
      {children}
    </TimersContext.Provider>
  );

  function addTimer(timer: Timer) {
    setTimers([...timers, timer]);
  }

  function deleteTimer(id: number) {
    const newTimers = timers.filter((timer) => timer.id !== id);
    setTimers(newTimers);
  }

  function updateTimer(id: number, label: string, time: string) {
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id) {
        const newTimer = { id, time, label };
        return newTimer;
      }
      return timer;
    });

    setTimers(updatedTimers);
  }
}

export { useTimers, TimersContextProvider };

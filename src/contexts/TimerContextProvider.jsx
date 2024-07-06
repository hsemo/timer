import {useState, useContext, createContext, useEffect} from 'react';

const TimersContext = createContext({
  timers: [],
  addTimer: () => '',
  updateTimer: () => ''
});

const useTimers = () => {
  return useContext(TimersContext);
};

const saveTimers = (timers) => {
  localStorage.setItem('timers', JSON.stringify(timers));
};

const getTimers = () => {
  if(localStorage.getItem('timers') === null){
    saveTimers([
      {
        id: Date.now(),
        label: 'Meditation',
        time: '00:10'
      }
    ]);
  }

  const timers = JSON.parse(localStorage.getItem('timers'));
  return timers;
};

const TimersContextProvider = ({children}) => {
  const [timers, setTimers] = useState(getTimers());

  const addTimer = (timer) => {
    console.log("addTimer: ", timer);
    setTimers([...timers, timer]);
  };

  const deleteTimer = (id) => {
    console.log("deleteTimer: ", id);
    const newTimers = timers.filter((timer) => timer.id !== id);
    setTimers(newTimers);
  }

  const updateTimer = (id, time, label) => {
    console.log('updateTimer: ', {id, time, label});
    const updatedTimers = timers.map((timer) => {
      if(timer.id === id){
        const newTimer = {id, time, label};
        return(newTimer);
      }
      return timer;
    });

    setTimers(updatedTimers);
  };

  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  return(
    <TimersContext.Provider
      value={
        {
          timers,
          addTimer,
          deleteTimer,
          updateTimer
        }
      }
    >
      {children}
    </TimersContext.Provider>
  );
};

export {useTimers, TimersContextProvider};

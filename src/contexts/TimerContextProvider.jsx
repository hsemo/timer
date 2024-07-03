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
        time: '10:00'
      }
    ]);
  }

  const timers = JSON.parse(localStorage.getItem('timers'));
  return timers;
};

const TimersContextProvider = ({children}) => {
  const [timers, setTimers] = useState(getTimers());
  console.log('TimersContextProvider: ', timers);

  const addTimer = (timer) => {
    setTimers([...timers, timer]);
  };

  const updateTimer = ({id, time, label}) => {
    const updatedTimers = timers.map((timer) => {
      if(timer.id === id){
        return({id, time, label});
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
          updateTimer
        }
      }
    >
      {children}
    </TimersContext.Provider>
  );
};

export {useTimers, TimersContextProvider};

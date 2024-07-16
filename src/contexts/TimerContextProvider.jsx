import {useState, useContext, createContext, useEffect} from 'react';

const TimersContext = createContext({
  timers: [],
  addTimer: () => '',
  updateTimer: () => ''
});

function useTimers() {
  return useContext(TimersContext);
};


function TimersContextProvider({children}) {
  const [timers, setTimers] = useState(getTimers());

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

  function addTimer(timer) {
    console.log("addTimer: ", timer);
    setTimers([...timers, timer]);
  };

  function deleteTimer(id) {
    console.log("deleteTimer: ", id);
    const newTimers = timers.filter((timer) => timer.id !== id);
    setTimers(newTimers);
  }

  function updateTimer(id, time, label) {
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

};

function saveTimers(timers) {
  localStorage.setItem('timers', JSON.stringify(timers));
};

function getTimers() {
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

export {useTimers, TimersContextProvider};

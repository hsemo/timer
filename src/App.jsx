import { useState } from 'react';
import {Timer} from './components';
import {useTimers, TimersContextProvider} from './contexts/TimerContextProvider.jsx';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function TimersList(){
  const {timers} = useTimers();

  return(
    <div
      className="flex justify-center flex-wrap"
    >
      <ul>
        {
          timers.map((timer) => {
            return (
              <li
                key={timer.id}
              >
                <Timer
                  id={timer.id}
                  label={timer.label}
                  time={timer.time}
                />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

function AddTimerButton(){
  const {timers, addTimer} = useTimers();

  return(
    <div
      className="flex justify-center"
    >
    <button
      className="m-auto px-4 py-2 focus:outline-none text-2xl rounded-full bg-blue-600 hover:bg-blue-700"
      onClick={(e) => addTimer({id: Date.now(), time: "10:00", label:`Timer ${timers.length + 1}`})}
    >
      +
    </button>
    </div>
  );
}

function App() {

  return (
    <div
      id="App"
      className="w-full min-h-screen bg-neutral-700"
    >
      <TimersContextProvider>
        <TimersList />
        <AddTimerButton />
      </TimersContextProvider>
    </div>
  );
}

export default App;

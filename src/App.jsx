import { useState } from 'react';
import {Timer} from './components';
import {useTimers, TimersContextProvider} from './contexts/TimerContextProvider.jsx';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function TimersList(){
  const {timers} = useTimers();
  console.log('TimersList: ',timers);

  return(
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
  );
}

function App() {

  return (
    <TimersContextProvider>
      <TimersList />
    </TimersContextProvider>
  );
}

export default App;

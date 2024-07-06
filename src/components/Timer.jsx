import {useState, useEffect, useRef} from 'react';
import {useTimers} from '../contexts/TimerContextProvider.jsx';

import {beep1Mp3} from '../assets/sounds.js';
import beep from '../assets/beep1.mp3';

function Button({className, onClickHandlr, children}){
  className = className || '';

  return(
    <button
      className={"px-4 py-2 bg-green-500 hover:bg-green-600 focus:outline-none" + className}
      onClick={onClickHandlr}
    >
      {children}
    </button>
  );
}

const getTimeFromTm = (tm) => {
  if(!tm) return {minutes: 0, seconds: 0};
  const [minutes, seconds] = tm.split(':').map((str) => parseInt(str));
  return {
    minutes,
    seconds
  };
};

const timeToStr = ({minutes, seconds}) => {
  minutes = '' + minutes;
  seconds = '' + seconds;
  const timeStr = `${minutes.padStart(2,0)}:${seconds.padStart(2,0)}`;
  console.log(timeStr);
  return (timeStr);
}

const Timer = ({id, label: lbl, time: tm}) => {
  console.log('lbl: ', lbl);
  console.log('tm: ', tm);
  const [label, setLabel] = useState(lbl);
  const timeRef = useRef(getTimeFromTm(tm));
  const [time, setTime] = useState(timeToStr(timeRef.current));
  const [timer, setTimer] = useState(false);

  const {updateTimer, deleteTimer} = useTimers();

  const startTimer = () => {
    if(timer) return;
    setTimer(true);
    console.log("timer start");
  };

  const stopTimer = () => {
    if(!timer) return;
    setTimer(false);
    console.log("timer stop");
  };

  const resetTimer = () => {
    setTimer(false);
    timeRef.current = getTimeFromTm(tm);
    setTime(timeToStr(timeRef.current));
    console.log("timer reset");
  };

  const playBeep = () => {
    let sound = new Audio(beep);
    sound.play();
  };

  const updateTime = (e, id) => {
    if(e.key && e.key !== 'Enter') return;
    e.preventDefault();
    e.target.blur();
    const time = e.target.value;
    updateTimer(id, time, lbl);
  };

  const updateLabel = (e, id) => {
    if(e.key && e.key !== 'Enter') return;
    e.preventDefault();
    e.target.blur();
    const label = e.target.value;
    updateTimer(id, tm, label);
  };

  useEffect(() => {
    if(timer === false){
      return;
    }

    const interId = setInterval(() => {
      let {minutes, seconds} = timeRef.current;
      seconds--;
      if(seconds < 0){
        minutes--;
        seconds = 59;
        if(minutes === -1 && seconds === 59){
          // minutes = 0;
          // seconds = 0;
          playBeep();
        }
      }

      timeRef.current = {minutes, seconds};
      setTime(timeToStr(timeRef.current));
    }, 1000);

    console.log("interval started: ", interId);

    return(() => {
      clearInterval(interId);
      console.log("interval stopped: ", interId);
    });

  }, [timer]);

  return(
    <>
      <div
        className="p-4 m-4 rounded-lg text-center text-white bg-neutral-800 flex flex-col relative"
      >
        <button
          className="py-1 px-2 text-black rounded-full absolute top-2 right-2 bg-red-600 hover:bg-red-700"
          onClick={(e) => deleteTimer(id)}
        >
          X
        </button>

        <input
          className="w-full my-2 text-center text-lg font-semibold bg-neutral-800"
          onChange={(e) => setLabel(e.target.value)}
          onBlur={(e) => updateLabel(e, id)}
          onKeyUp={(e) => updateLabel(e, id)}
          value={label}
          disabled={timer}
        />

        <input
          className="w-full my-2 text-center text-5xl font-mono font-bold bg-neutral-800"
          onChange={(e) => setTime(e.target.value)}
          onKeyUp={(e) => updateTime(e, id)}
          onBlur={(e) => updateTime(e, id)}
          value={time}
          disabled={timer}
          size={5}
        />

        <div
          className="divide-x divide-slate-800"
        >
          <Button
            className="border rounded-l-lg"
            onClickHandlr={startTimer}
          >
            Start
          </Button>

          <Button
            onClickHandlr={stopTimer}
          >
            Stop
          </Button>

          <Button
            className="border rounded-r-lg bg-red-600 hover:bg-red-700"
            onClickHandlr={resetTimer}
          >
            Reset
          </Button>
        </div>
      </div>

    </>
  );
};

export default Timer;

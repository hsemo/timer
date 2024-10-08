import {useState, useEffect, useRef, useMemo} from 'react';
import {useTimers} from '../contexts/TimerContextProvider.jsx';
import {PlayFill, PauseFill, StopFill, XLg} from 'react-bootstrap-icons';

import beep from '/beep1.mp3';
import useWakeLock from '../hooks/useWakeLock.js';

function Timer({id, label: lbl, time: tm}) {
  const [label, setLabel] = useState(lbl);

  const timeRef = useRef(getTimeFromTm(tm));
  const [time, setTime] = useState(timeToStr(timeRef.current));

  const [timer, setTimer] = useState(false);

  const {updateTimer, deleteTimer} = useTimers();

  const sound = useMemo(() => new Audio(beep), []);

  const {requestWakeLock, releaseWakeLock} = useWakeLock();

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

  useEffect(() => {
    timeRef.current = getTimeFromTm(time);
  }, [time]);

  return(
    <>
      <div
        className="p-4 m-4 rounded-lg text-center text-white \
        bg-neutral-800 flex flex-col relative w-max"
      >
        <button
          className="p-2 text-black rounded-full absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 shadow-md shadow-black"
          onClick={(e) => deleteTimer(id)}
        >
          <XLg />
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
            <PlayFill size={24} />
          </Button>

          <Button
            onClickHandlr={stopTimer}
          >
            <PauseFill size={24} />
          </Button>

          <Button
            className="border rounded-r-lg bg-red-600 hover:bg-red-700"
            onClickHandlr={resetTimer}
          >
            <StopFill size={24} />
          </Button>
        </div>
      </div>

    </>
  );

  function startTimer() {
    if(timer) return;
    requestWakeLock();
    setTimer(true);
    console.log("timer start");
  };

  function stopTimer() {
    if(!timer) return;
    releaseWakeLock();
    setTimer(false);
    console.log("timer stop");
  };

  function resetTimer() {
    setTimer(false);
    timeRef.current = getTimeFromTm(tm);
    setTime(timeToStr(timeRef.current));
    releaseWakeLock();
    console.log("timer reset");
  };

  function playBeep() {
    sound.play();
  };

  function updateTime(e, id) {
    if(e.key && e.key !== 'Enter') return;
    e.preventDefault();
    e.target.blur();
    // const time = e.target.value;
    updateTimer(id, time, label);
  };

  function updateLabel(e, id) {
    if(e.key && e.key !== 'Enter') return;
    e.preventDefault();
    e.target.blur();
    // const label = e.target.value;
    updateTimer(id, time, label);
  };
};

function Button({className, onClickHandlr, children}){
  className = className || '';

  return(
    <button
      className={"p-2 bg-green-500 hover:bg-green-600 focus:outline-none hover:text-black focus:text-black" + className}
      onClick={onClickHandlr}
    >
      {children}
    </button>
  );
}

function getTimeFromTm(tm) {
  if(!tm) return {minutes: 0, seconds: 0};
  const [minutes, seconds] = tm.split(':').map((str) => parseInt(str));
  return {
    minutes,
    seconds
  };
};

function timeToStr({minutes, seconds}) {
  minutes = '' + minutes;
  seconds = '' + seconds;
  const timeStr = `${minutes.padStart(2,0)}:${seconds.padStart(2,0)}`;
  return (timeStr);
}

export default Timer;

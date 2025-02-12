import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  KeyboardEvent,
  FocusEvent,
} from "react";
import { PlayFill, PauseFill, StopFill, XLg } from "react-bootstrap-icons";

import Button from "@components/button";
import { useTimers } from "@contexts/TimerContextProvider";
import useWakeLock from "@hooks/useWakeLock";
import { getTimeFromTm, timeToStr } from "@utils/index";

import beep from "/beep1.mp3";

function Timer({ id, label: lbl, time: tm }: Timer) {
  const [label, setLabel] = useState(lbl);
  const [time, setTime] = useState<Time>(getTimeFromTm(tm));
  const [timer, setTimer] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  const { updateTimer, deleteTimer } = useTimers();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const sound = useMemo(() => new Audio(beep), []);

  const startTimer = useCallback(() => {
    if (timer) return;
    requestWakeLock();
    setTimer(true);
    console.log("timer start");
  }, [timer, requestWakeLock, setTimer]);

  const stopTimer = useCallback(() => {
    if (!timer) return;
    releaseWakeLock();
    setTimer(false);
    console.log("timer stop");
  }, [timer, releaseWakeLock, setTimer]);

  const resetTimer = useCallback(() => {
    setTimer(false);
    setTime(getTimeFromTm(tm));
    setTimerFinished(false);
    releaseWakeLock();
    console.log("timer reset");
  }, [setTimer, setTime, tm, releaseWakeLock]);

  const playBeep = useCallback(() => {
    sound.play();
  }, [sound]);

  const increaseTime = useCallback((prevTime: Time) => {
    let { minutes, seconds } = prevTime;
    seconds++;
    if (seconds >= 59) {
      minutes++;
      seconds = 0;
    }

    return { minutes, seconds };
  }, []);

  const decreaseTime = useCallback(
    (prevTime: Time) => {
      let { minutes, seconds } = prevTime;
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes === -1 && seconds === 59) {
          playBeep();
          setTimerFinished(true);
          minutes = 0;
          seconds = 1;
        }
      }

      return { minutes, seconds };
    },
    [setTimerFinished, playBeep],
  );

  const updateTime = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
      id: number,
    ) => {
      if ("key" in e && e.key && e.key !== "Enter") return;
      e.preventDefault();
      e.currentTarget.blur();
      updateTimer(id, label, timeToStr(time));
    },
    [time, label],
  );

  const updateLabel = useCallback(
    (
      e:
        | React.KeyboardEvent<HTMLInputElement>
        | React.FocusEvent<HTMLInputElement>,
      id: number,
    ) => {
      if ("key" in e && e.key && e.key !== "Enter") return;
      e.preventDefault();
      e.currentTarget.blur();
      // const label = e.target.value;
      updateTimer(id, timeToStr(time), label);
    },
    [time, label],
  );

  useEffect(() => {
    if (timer === false) {
      return;
    }

    const timerFunc = timerFinished ? increaseTime : decreaseTime;
    const interId = setInterval(() => setTime(timerFunc), 1000);

    return () => {
      clearInterval(interId);
    };
  }, [timer, increaseTime, decreaseTime, setTime, timerFinished]);

  return (
    <>
      <div
        className="p-4 m-4 rounded-lg text-center text-white \
        bg-neutral-800 flex flex-col relative w-max"
      >
        <button
          className="p-2 text-black rounded-full absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 shadow-md shadow-black"
          onClick={() => deleteTimer(id)}
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
          onChange={(e) => setTime(getTimeFromTm(e.target.value))}
          onKeyUp={(e) => updateTime(e, id)}
          onBlur={(e) => updateTime(e, id)}
          value={timeToStr(time)}
          disabled={timer}
          size={5}
        />

        <div className="divide-x divide-slate-800">
          <Button
            className="border rounded-l-lg"
            onClickHandlr={timer ? stopTimer : startTimer}
          >
            {timer ? <PauseFill size={24} /> : <PlayFill size={24} />}
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
}

export default Timer;

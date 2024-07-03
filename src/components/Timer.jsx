import {useState, useEffect, useRef} from 'react';
import {Button, Container, Label, Input} from 'semantic-ui-react';
import {beep1Mp3} from '../assets/sounds.js';
import beep from '../assets/beep1.mp3';

const getTimeFromTm = (tm) => {
  if(!tm) return {minutes: 0, seconds: 0};
  const [minutes, seconds] = tm.split(':').map((str) => parseInt(str));
  return {
    minutes,
    seconds
  };
};

const timeToStr = ({minutes, seconds}) => {
  return (
    ('' + minutes).padStart(2,0)
    + ':'
    + ('' + seconds).padStart(2,0)
  );
}

const Timer = ({label: lbl, time: tm}) => {
  console.log('lbl: ', lbl);
  console.log('tm: ', tm);
  const [label, setLabel] = useState(lbl);
  const timeRef = useRef(getTimeFromTm(tm));
  const [time, setTime] = useState(timeToStr(timeRef.current));
  const [timer, setTimer] = useState(false);

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
        if(minutes < 0){
          minutes = 0;
          seconds = 0;
          resetTimer();
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
    <Container
      textAlign="center"
    >
      <Label
        tag
        onChange={(e) => setLabel(e.target.value)}
        contentEditable={true}
      >
        {label}
      </Label>

      <Label
        basic
        circular
        size="huge"
        horizontal
      >
        {time}
      </Label>

      <Container>
        <Button
          onClick={startTimer}
        >
          Start
        </Button>

        <Button
          onClick={stopTimer}
        >
          Stop
        </Button>

        <Button
          onClick={resetTimer}
        >
          Reset
        </Button>
      </Container>
    </Container>
  );
};

export default Timer;

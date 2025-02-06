function getTimeFromTm(tm: string) {
  if (!tm) return { minutes: 0, seconds: 0 };
  const [minutes, seconds] = tm.split(":").map((str) => parseInt(str));
  return {
    minutes,
    seconds,
  };
}

function timeToStr({ minutes, seconds }: { minutes: number; seconds: number }) {
  const minutesStr = "" + minutes;
  const secondsStr = "" + seconds;
  const timeStr = `${minutesStr.padStart(2, "0")}:${secondsStr.padStart(2, "0")}`;
  return timeStr;
}

function saveTimers(timers: Timer[]) {
  localStorage.setItem("timers", JSON.stringify(timers));
}

function getTimers(): Timer[] {
  const timers: Timer[] = JSON.parse(localStorage.getItem("timers") || "");

  if (timers === null) {
    saveTimers([
      {
        id: Date.now(),
        label: "Meditation",
        time: "00:10",
      },
    ]);
  }

  return timers;
}

export { getTimeFromTm, timeToStr, getTimers, saveTimers };

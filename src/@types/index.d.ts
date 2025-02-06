interface Timer {
  id: number;
  label: string;
  time: string;
}

interface Time {
  minutes: number;
  seconds: number;
}

interface TimersContextValues {
  timers: Timer[];
  addTimer: (timer: Timer) => void;
  updateTimer: (id: number, label: string, time: string) => void;
  deleteTimer: (id: any) => void;
}

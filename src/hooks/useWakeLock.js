import {useRef} from 'react';

export default function useWakeLock(){
  const wakelock = useRef(null);

  async function requestWakeLock(){
    try {
      // screen is default
      wakelock.current = await navigator.wakeLock.request('screen');
      console.log("WakeLock acquired");
    } catch {
      console.log("Failed to acquire WakeLock");
      wakelock.current = null;
    }
  }

  async function releaseWakeLock(){
    if(wakelock.current !== null){
      try {
        await wakelock.current.release();
        wakelock.current = null;
        console.log("WakeLock released");
      } catch {
        console.log("Error: could not release WakeLock");
      }
    }
  }

  return {releaseWakeLock, requestWakeLock};
}

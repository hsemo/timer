import { useRef, useCallback } from "react";

export default function useWakeLock() {
  const wakelock = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      // "screen" is the default wake lock type
      wakelock.current = await navigator.wakeLock.request("screen");
      console.log("WakeLock acquired");
    } catch {
      console.error("Failed to acquire WakeLock");
      wakelock.current = null;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakelock.current !== null) {
      try {
        await wakelock.current.release();
        wakelock.current = null;
        console.log("WakeLock released");
      } catch {
        console.error("Error: could not release WakeLock");
      }
    }
  }, []);

  return { releaseWakeLock, requestWakeLock };
}

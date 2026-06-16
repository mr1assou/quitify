import { useCallback, useEffect, useRef, useState } from "react";

/** Reusable elapsed-time hook that ticks while `active` is true. */
export function useElapsedTimer(active: boolean) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || startedAtRef.current == null) return;

    const tick = () => {
      if (startedAtRef.current != null) {
        setElapsedMs(Date.now() - startedAtRef.current);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active]);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    setElapsedMs(0);
  }, []);

  const reset = useCallback(() => {
    startedAtRef.current = null;
    setElapsedMs(0);
  }, []);

  return { elapsedMs, start, reset };
}

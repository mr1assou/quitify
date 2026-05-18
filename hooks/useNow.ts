import { useEffect, useState } from "react";

/**
 * Returns a "now" timestamp that advances on the given interval.
 * - 1000ms → use for the home digital countdown
 * - 60000ms → enough for stats / progress (default)
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

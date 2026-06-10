import { MS_DAY, MS_HOUR, MS_MINUTE, MS_SECOND } from "@/utils/time/ms";

export type ElapsedBreakdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
};

export function getStreakElapsedMs(quitDateMs: number, now = Date.now()): number {
  if (!Number.isFinite(quitDateMs)) return 0;
  return Math.max(0, now - quitDateMs);
}

export function breakdownElapsedMs(elapsedMs: number): ElapsedBreakdown {
  const totalSeconds = Math.floor(elapsedMs / MS_SECOND);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays: Math.floor(elapsedMs / MS_DAY),
  };
}

export { MS_DAY };

import { getStreakElapsedMs, MS_DAY } from "@/utils/streak/elapsedBreakdown";

function streakStartMs(streakStart: string | Date | number): number {
  if (typeof streakStart === "number") return streakStart;
  return typeof streakStart === "string" ? Date.parse(streakStart) : streakStart.getTime();
}

export function smokeFreeDaysFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  return Math.floor(getStreakElapsedMs(streakStartMs(streakStart), now) / MS_DAY);
}

export function smokeFreeDaysInProgressFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  const elapsed = getStreakElapsedMs(streakStartMs(streakStart), now);
  if (elapsed <= 0) return 0;
  return Math.ceil(elapsed / MS_DAY);
}

export function minSmokeFreeDayGoalTargetFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  return smokeFreeDaysFromStreakStart(streakStart, now) + 2;
}

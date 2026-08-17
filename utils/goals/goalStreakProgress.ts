import { getStreakElapsedMs, MS_DAY } from "@/utils/streak/elapsedBreakdown";
import { formatStreakDuration } from "@/utils/streak/formatStreakLabel";

/** Floor for days-ahead goals. */
export const MIN_DAYS_AHEAD = 1;

/** Values below this in `baselineProgress` are legacy completed-day counts. */
const BASELINE_LEGACY_DAY_MAX = 1000;

function streakStartMs(streakStart: string | Date | number): number {
  if (typeof streakStart === "number") return streakStart;
  return typeof streakStart === "string" ? Date.parse(streakStart) : streakStart.getTime();
}

/** Min days-ahead for goals, based on completed streak days on the current attempt. */
export function minDaysAheadFromStreakDays(streakDays: number): number {
  if (streakDays < 3) return 1;
  if (streakDays < 14) return 2;
  if (streakDays < 30) return 3;
  if (streakDays < 40) return 4;
  if (streakDays < 50) return 5;
  return 6;
}

export function maxDaysAheadFromStreakDays(streakDays: number): number {
  if (streakDays < 3) return 3;
  if (streakDays < 14) return 7;
  if (streakDays < 30) return 14;
  if (streakDays < 40) return 21;
  if (streakDays < 50) return 30;
  return 45;
}

export function smokeFreeDaysFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  return Math.floor(getStreakElapsedMs(streakStartMs(streakStart), now) / MS_DAY);
}

export function minDaysAheadFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  return minDaysAheadFromStreakDays(smokeFreeDaysFromStreakStart(streakStart, now));
}

export function maxDaysAheadFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  return maxDaysAheadFromStreakDays(smokeFreeDaysFromStreakStart(streakStart, now));
}

export function smokeFreeDaysInProgressFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  const elapsed = getStreakElapsedMs(streakStartMs(streakStart), now);
  if (elapsed <= 0) return 0;
  return Math.ceil(elapsed / MS_DAY);
}

export function baselineElapsedMsFromStorage(baselineProgress: number): number {
  if (baselineProgress < BASELINE_LEGACY_DAY_MAX) {
    return baselineProgress * MS_DAY;
  }
  return baselineProgress;
}

export function goalDeadlineElapsedMs(
  streakStart: string | Date | number,
  now: number,
  daysAhead: number,
): number {
  const elapsedMs = getStreakElapsedMs(streakStartMs(streakStart), now);
  return elapsedMs + daysAhead * MS_DAY;
}

export function minGoalElapsedMsFromStreakStart(
  streakStart: string | Date | number,
  now = Date.now(),
): number {
  const minAhead = minDaysAheadFromStreakStart(streakStart, now);
  return goalDeadlineElapsedMs(streakStart, now, minAhead);
}

export function isSmokeFreeDaysAheadGoalMet(
  baselineElapsedMs: number,
  daysAhead: number,
  elapsedMs: number,
): boolean {
  return elapsedMs >= baselineElapsedMs + daysAhead * MS_DAY;
}

export function formatDaysAheadGoalDeadline(
  streakStart: string | Date | number,
  now: number,
  daysAhead: number,
): string {
  const deadlineMs = goalDeadlineElapsedMs(streakStart, now, daysAhead);
  return formatStreakDuration(deadlineMs, now, { includeSeconds: true });
}

export function totalSmokeFreeDaysAtGoalDeadline(
  streakStart: string | Date | number,
  now: number,
  daysAhead: number,
): number {
  return goalDeadlineElapsedMs(streakStart, now, daysAhead) / MS_DAY;
}

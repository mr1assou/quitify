import { DateTime } from "luxon";

export type CalendarStreakParts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCalendarStreakParts(
  quitDateMs: number,
  now = Date.now(),
): CalendarStreakParts | null {
  if (!Number.isFinite(quitDateMs)) return null;

  const start = DateTime.fromMillis(quitDateMs, { zone: "utc" });
  const end = DateTime.fromMillis(now, { zone: "utc" });
  if (!start.isValid || !end.isValid || end.toMillis() <= start.toMillis()) {
    return null;
  }

  const diff = end.diff(start, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ]);
  const p = diff.toObject();

  return {
    years: Math.floor(p.years ?? 0),
    months: Math.floor(p.months ?? 0),
    days: Math.floor(p.days ?? 0),
    hours: Math.floor(p.hours ?? 0),
    minutes: Math.floor(p.minutes ?? 0),
    seconds: Math.floor(p.seconds ?? 0),
  };
}

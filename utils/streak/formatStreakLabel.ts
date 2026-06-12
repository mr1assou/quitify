import { pluralize } from "@/utils/format";

import { getCalendarStreakParts, type CalendarStreakParts } from "./calendarBreakdown";
import {
  breakdownElapsedMs,
  getStreakElapsedMs,
  MS_DAY,
  type ElapsedBreakdown,
} from "./elapsedBreakdown";

function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function unit(n: number, abbrev: string): string {
  return `${n} ${abbrev}`;
}

function formatHms(hours: number, minutes: number, seconds: number): string {
  return `${pad2(hours)}h ${pad2(minutes)}min ${pad2(seconds)}s`;
}

function pluralCount(n: number, singular: string): string {
  return `${n} ${pluralize(n, singular)}`;
}

function formatProgressiveShort(b: ElapsedBreakdown): string {
  if (b.days > 0) {
    return `${pluralCount(b.days, "day")} ${formatHms(b.hours, b.minutes, b.seconds)}`;
  }
  if (b.hours > 0) {
    return formatHms(b.hours, b.minutes, b.seconds);
  }
  if (b.minutes > 0) {
    return `${b.minutes}min ${pad2(b.seconds)}s`;
  }
  return `${b.seconds}s`;
}

function formatProgressiveCalendar(
  p: CalendarStreakParts,
  mode: "months" | "years",
): string {
  const hms = formatHms(p.hours, p.minutes, p.seconds);
  const segments: string[] = [];

  if (mode === "years" && p.years > 0) {
    segments.push(unit(p.years, "yr"));
  }

  const monthCount = mode === "years" ? p.months : p.years * 12 + p.months;
  if (monthCount > 0) {
    segments.push(unit(monthCount, "mo"));
  }

  if (p.days > 0) {
    segments.push(pluralCount(p.days, "day"));
  }

  segments.push(hms);
  return segments.join(" ");
}

export function formatStreakDuration(durationMs: number, now = Date.now()): string {
  if (durationMs <= 0) return "0s";
  return formatCurrentStreak(now - durationMs, now);
}

export function formatCurrentStreak(quitDateMs: number, now = Date.now()): string {
  const elapsedMs = getStreakElapsedMs(quitDateMs, now);
  if (elapsedMs <= 0) return "0s";

  const totalDays = Math.floor(elapsedMs / MS_DAY);

  if (totalDays >= 30) {
    const calendar = getCalendarStreakParts(quitDateMs, now);
    if (calendar) {
      const mode = totalDays >= 365 ? "years" : "months";
      return formatProgressiveCalendar(calendar, mode);
    }
  }

  return formatProgressiveShort(breakdownElapsedMs(elapsedMs));
}

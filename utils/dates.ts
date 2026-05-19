export function dayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

import type { DropdownOption } from "@/types/ui";

/** Days in a calendar month (month is 1–12). Accounts for leap years in February. */
export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 31;
  return new Date(year, month, 0).getDate();
}

/** Keep day within the valid range for the given month (and year for February). */
export function clampDayToMonth(
  day: number,
  month: number,
  year?: number,
  fallbackYear = new Date().getFullYear(),
): number {
  const max = daysInMonth(year ?? fallbackYear, month);
  return Math.min(day, max);
}

/** Day dropdown options for a YMD picker; defaults to 31 until month is chosen. */
export function ymdDayDropdownOptions(
  month?: number,
  year?: number,
  fallbackYear = new Date().getFullYear(),
): DropdownOption[] {
  const count =
    month != null ? daysInMonth(year ?? fallbackYear, month) : 31;
  return Array.from({ length: count }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));
}

export function startOfLocalDay(ts: number = Date.now()): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysBetween(from: number, to: number = Date.now()): number {
  const ms = Math.max(0, to - from);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function isSameDay(a: number, b: number): boolean {
  return dayKey(a) === dayKey(b);
}

export function lastNDayKeys(n: number, ref: number = Date.now()): string[] {
  const out: string[] = [];
  const ref0 = startOfLocalDay(ref);
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayKey(ref0 - i * 24 * 60 * 60 * 1000));
  }
  return out;
}

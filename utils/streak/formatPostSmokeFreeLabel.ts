import { pluralize } from "@/utils/format";

import { formatCurrentStreak } from "./formatStreakLabel";

/** Compact smoke-free label for post headers (live streak from timestamp). */
export function formatPostSmokeFreeLabel(streakStartMs: number, now = Date.now()): string {
  return `${formatCurrentStreak(streakStartMs, now)} smoke-free`;
}

/** Smoke-free label from whole-day count (feed authors from API). */
export function formatSmokeFreeDaysLabel(wholeDays: number): string {
  const days = Math.max(0, Math.floor(wholeDays));
  if (days === 0) return "Starting smoke-free";
  return `${days} ${pluralize(days, "day")} smoke-free`;
}

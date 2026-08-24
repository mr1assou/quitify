import { formatUtcIsoInTimezone } from "@/utils/time/formatInTimezone";
import { MS_DAY } from "@/utils/time/ms";

/** UTC end instant for a smoke-free days-ahead goal: startedAt + target days. */
export function computeSmokeFreeGoalEndAtIso(
  startedAt: string,
  targetDays: number,
): string | null {
  const startMs = Date.parse(startedAt);
  if (Number.isNaN(startMs) || targetDays <= 0) return null;
  return new Date(startMs + targetDays * MS_DAY).toISOString();
}

/** Formats the goal end date and time in the user's timezone and app language. */
export function formatSmokeFreeGoalEndDate(
  startedAt: string,
  targetDays: number,
  timeZone: string,
  locale?: string,
): string | null {
  const iso = computeSmokeFreeGoalEndAtIso(startedAt, targetDays);
  if (!iso) return null;
  return formatUtcIsoInTimezone(iso, timeZone, locale);
}

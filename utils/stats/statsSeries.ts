import { RANGE_OPTIONS } from "@/constants/stats/statsRanges";
import type { CravingLog, UserProfile } from "@/types";
import type {
  CravingTimeBucket,
  CravingTimeBucketId,
  SavingsBreakdown,
  SeriesPoint,
  StatsRange,
} from "@/types/stats/statsDashboard";
import { startOfLocalDay } from "@/utils/shared/dates";
import { computeQuitImpact, dailySavings, elapsedMsSince } from "@/utils/stats/quitImpact";
import { MS_DAY } from "@/utils/time/ms";

export { dailySavings, moneyPerCigarette } from "@/utils/stats/quitImpact";

function shortWeekday(ts: number, locale?: string) {
  return new Date(ts).toLocaleDateString(locale, { weekday: "short" });
}

function shortMonthDay(ts: number, locale?: string) {
  return new Date(ts).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

function seriesLabel(
  range: StatsRange,
  index: number,
  dayCount: number,
  dayStart: number,
  locale?: string,
): string {
  if (range === "7d") return shortWeekday(dayStart, locale);
  if (range === "30d") {
    return index === 0 || index === dayCount - 1 || index % 6 === 0
      ? shortMonthDay(dayStart, locale)
      : "";
  }
  return index === 0 || index === dayCount - 1 || index % 14 === 0
    ? shortMonthDay(dayStart, locale)
    : "";
}

export function buildSavingsBreakdown(
  profile: UserProfile,
  now: number,
): SavingsBreakdown {
  const perDay = dailySavings(profile);
  const impact = computeQuitImpact(profile, elapsedMsSince(profile.quitDate, now));
  return {
    perDay,
    perWeek: perDay * 7,
    perMonth: perDay * 30,
    perYear: perDay * 365,
    totalSoFar: impact.moneySaved,
  };
}

export function buildSavingsSeries(
  profile: UserProfile,
  range: StatsRange,
  now: number,
  locale?: string,
): SeriesPoint[] {
  const perDay = dailySavings(profile);
  const quitDate = profile.quitDate;
  const def = RANGE_OPTIONS.find((r) => r.id === range) ?? RANGE_OPTIONS[0];
  const dayCount = def.buckets;
  const todayStart = startOfLocalDay(now);

  const points: SeriesPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const dayStart = todayStart - (dayCount - 1 - i) * MS_DAY;
    const dayEnd = dayStart + MS_DAY;
    const activeMs = Math.max(0, Math.min(dayEnd, now) - Math.max(dayStart, quitDate));
    const value = (activeMs / MS_DAY) * perDay;

    points.push({
      label: seriesLabel(range, i, dayCount, dayStart, locale),
      value,
      ts: dayStart,
    });
  }

  return points;
}

const TIME_BUCKETS: readonly {
  id: CravingTimeBucketId;
  label: string;
  startHour: number;
  endHour: number;
}[] = [
  { id: "morning", label: "Morning", startHour: 5, endHour: 12 },
  { id: "afternoon", label: "Afternoon", startHour: 12, endHour: 17 },
  { id: "evening", label: "Evening", startHour: 17, endHour: 22 },
  { id: "night", label: "Night", startHour: 22, endHour: 5 },
];

function isInBucket(hour: number, start: number, end: number) {
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export function buildCravingTimeBuckets(cravings: CravingLog[]): CravingTimeBucket[] {
  const counts: Record<CravingTimeBucketId, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  cravings.forEach((c) => {
    const hour = new Date(c.timestamp).getHours();
    const match = TIME_BUCKETS.find((b) => isInBucket(hour, b.startHour, b.endHour));
    if (match) counts[match.id] += 1;
  });

  return TIME_BUCKETS.map((b) => ({ ...b, count: counts[b.id] }));
}

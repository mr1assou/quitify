import { RANGE_OPTIONS } from "@/constants/statsRanges";
import type { CravingLog, UserProfile } from "@/types";
import type {
  CravingTimeBucket,
  CravingTimeBucketId,
  SavingsBreakdown,
  SeriesPoint,
  StatsRange,
} from "@/types/statsDashboard";
import { startOfLocalDay } from "@/utils/dates";

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

/** Money saved per cigarette, derived from pack cost and pack size. */
export function moneyPerCigarette(profile: UserProfile) {
  const packSize = Math.max(1, profile.cigarettesPerPack);
  return profile.packCost / packSize;
}

/** Money saved per day at the user's prior smoking rate. */
export function dailySavings(profile: UserProfile) {
  return moneyPerCigarette(profile) * Math.max(0, profile.cigarettesPerDay);
}

export function buildSavingsBreakdown(
  profile: UserProfile,
  now: number,
): SavingsBreakdown {
  const perDay = dailySavings(profile);
  const elapsedDays = Math.max(0, (now - profile.quitDate) / DAY);
  return {
    perDay,
    perWeek: perDay * 7,
    perMonth: perDay * 30,
    perYear: perDay * 365,
    totalSoFar: perDay * elapsedDays,
  };
}

function shortWeekday(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { weekday: "short" });
}

function shortMonthDay(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Savings earned per calendar day within the sliding window ending today.
 * One point per day; overlaps with quit date are clipped.
 */
export function buildSavingsSeries(
  profile: UserProfile,
  range: StatsRange,
  now: number,
): SeriesPoint[] {
  const perDay = dailySavings(profile);
  const quitDate = profile.quitDate;
  const def = RANGE_OPTIONS.find((r) => r.id === range) ?? RANGE_OPTIONS[0];
  const dayCount = def.buckets;
  const todayStart = startOfLocalDay(now);

  const points: SeriesPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const dayStart = todayStart - (dayCount - 1 - i) * DAY;
    const dayEnd = dayStart + DAY;
    const activeMs = Math.max(0, Math.min(dayEnd, now) - Math.max(dayStart, quitDate));
    const value = (activeMs / DAY) * perDay;

    let label = "";
    if (range === "7d") {
      label = shortWeekday(dayStart);
    } else if (range === "30d") {
      if (i === 0 || i === dayCount - 1 || i % 6 === 0) {
        label = shortMonthDay(dayStart);
      }
    } else {
      // 90d — sparse ticks to reduce clutter
      if (i === 0 || i === dayCount - 1 || i % 14 === 0) {
        label = shortMonthDay(dayStart);
      }
    }

    points.push({ label, value, ts: dayStart });
  }

  return points;
}

const TIME_BUCKETS: readonly { id: CravingTimeBucketId; label: string; startHour: number; endHour: number }[] = [
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

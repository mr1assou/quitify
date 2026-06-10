import type { CravingTimeBucket, CravingTimeBucketId } from "@/types/statsDashboard";

const TIME_BUCKETS: readonly Omit<CravingTimeBucket, "count">[] = [
  { id: "morning", label: "Morning", startHour: 5, endHour: 12 },
  { id: "afternoon", label: "Afternoon", startHour: 12, endHour: 17 },
  { id: "evening", label: "Evening", startHour: 17, endHour: 22 },
  { id: "night", label: "Night", startHour: 22, endHour: 5 },
];

function isInBucket(hour: number, start: number, end: number): boolean {
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export function buildSlipTimeBuckets(timestamps: string[]): CravingTimeBucket[] {
  const counts: Record<CravingTimeBucketId, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  timestamps.forEach((iso) => {
    const hour = new Date(iso).getHours();
    const match = TIME_BUCKETS.find((b) => isInBucket(hour, b.startHour, b.endHour));
    if (match) counts[match.id] += 1;
  });

  return TIME_BUCKETS.map((b) => ({ ...b, count: counts[b.id] }));
}

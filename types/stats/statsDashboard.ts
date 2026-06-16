export type StatsRange = "7d" | "30d" | "90d";

export type RangeOption = {
  id: StatsRange;
  label: string;
  /** Number of buckets in the resulting series. */
  buckets: number;
};

export type SeriesPoint = {
  /** Short label shown under the X axis (e.g. "Mon", "W2", "Mar"). */
  label: string;
  value: number;
  /** Bucket start timestamp — useful for tooltips later. */
  ts: number;
};

export type SavingsBreakdown = {
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
  totalSoFar: number;
};

export type CravingTimeBucketId = "morning" | "afternoon" | "evening" | "night";

export type CravingTimeBucket = {
  id: CravingTimeBucketId;
  label: string;
  /** Inclusive hour start. */
  startHour: number;
  /** Exclusive hour end (wraps over midnight if smaller than startHour). */
  endHour: number;
  count: number;
};

export type JourneyMilestone = {
  /** Days since streak start. */
  day: number;
  label: string;
  description: string;
  reached: boolean;
  /** Timestamp when this milestone unlocks. */
  unlocksAt: number;
};

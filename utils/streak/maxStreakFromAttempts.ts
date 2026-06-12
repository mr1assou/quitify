import type { AttemptStatsRow } from "@/types/userStats";

export function maxStreakDurationMs(attempts: AttemptStatsRow[]): number {
  if (attempts.length === 0) return 0;
  return Math.max(...attempts.map((attempt) => attempt.durationSeconds * 1000));
}

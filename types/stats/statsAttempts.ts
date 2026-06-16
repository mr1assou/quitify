import type { AttemptStatsRow, StatsEconomics } from "@/types/stats/userStats";

export type StatsAttemptsResponse = {
  currency: string;
  timezone: string;
  economics: StatsEconomics;
  attempts: AttemptStatsRow[];
};

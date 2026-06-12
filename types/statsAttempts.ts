import type { AttemptStatsRow, StatsEconomics } from "@/types/userStats";

export type StatsAttemptsResponse = {
  currency: string;
  timezone: string;
  economics: StatsEconomics;
  attempts: AttemptStatsRow[];
};

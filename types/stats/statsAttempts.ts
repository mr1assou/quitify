import type { AttemptStatsRow, StatsEconomics } from "@/types/stats/userStats";

export type StatsAttemptsResponse = {
  currency: string;
  economics: StatsEconomics;
  attempts: AttemptStatsRow[];
};

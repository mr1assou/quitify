import type { StatsEconomics, StatsFilterRange, StatsImpact } from "@/types/stats/userStats";

export type StatsOverviewByRange = Record<StatsFilterRange, StatsImpact>;

export type StatsOverviewResponse = {
  currency: string;
  economics: StatsEconomics;
  byRange: StatsOverviewByRange;
};

import type { StatsEconomics, StatsFilterRange, StatsImpact } from "@/types/userStats";

export type StatsOverviewByRange = Record<StatsFilterRange, StatsImpact>;

export type StatsOverviewResponse = {
  currency: string;
  economics: StatsEconomics;
  byRange: StatsOverviewByRange;
};

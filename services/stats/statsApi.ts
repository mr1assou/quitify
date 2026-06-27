import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { StatsAttemptsResponse } from "@/types/stats/statsAttempts";
import type { StatsFreedomPointsResponse } from "@/types/stats/statsFreedomPoints";
import type { StatsGoalsResponse } from "@/types/stats/statsGoals";
import type { StatsOverviewResponse } from "@/types/stats/statsOverview";

export async function fetchStatsOverview(): Promise<StatsOverviewResponse> {
  const res = await authenticatedFetch("/auth/me/stats/overview");

  if (!res.ok) {
    throw new Error("Could not load stats overview");
  }

  return res.json() as Promise<StatsOverviewResponse>;
}

export async function fetchStatsAttempts(): Promise<StatsAttemptsResponse> {
  const res = await authenticatedFetch("/auth/me/stats/attempts");

  if (!res.ok) {
    throw new Error("Could not load stats attempts");
  }

  return res.json() as Promise<StatsAttemptsResponse>;
}

export async function fetchStatsGoals(): Promise<StatsGoalsResponse> {
  const res = await authenticatedFetch("/auth/me/stats/goals");

  if (!res.ok) {
    throw new Error("Could not load stats goals");
  }

  return res.json() as Promise<StatsGoalsResponse>;
}

export async function fetchStatsFreedomPoints(): Promise<StatsFreedomPointsResponse> {
  const res = await authenticatedFetch("/auth/me/stats/freedom-points");

  if (!res.ok) {
    throw new Error("Could not load freedom points history");
  }

  return res.json() as Promise<StatsFreedomPointsResponse>;
}

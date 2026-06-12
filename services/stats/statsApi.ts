import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { StatsAttemptsResponse } from "@/types/statsAttempts";
import type { StatsOverviewResponse } from "@/types/statsOverview";

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

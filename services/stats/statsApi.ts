import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { UserStatsResponse } from "@/types/userStats";

export async function fetchUserStats(): Promise<UserStatsResponse> {
  const res = await authenticatedFetch("/auth/me/stats");

  if (!res.ok) {
    throw new Error("Could not load stats");
  }

  return res.json() as Promise<UserStatsResponse>;
}

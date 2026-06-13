import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { BackendLeaderboardResponse } from "@/types/leaderboardApi";

export async function fetchLeaderboard(): Promise<BackendLeaderboardResponse> {
  const res = await authenticatedFetch("/leaderboard");

  if (!res.ok) {
    throw new Error("Could not load leaderboard");
  }

  return res.json() as Promise<BackendLeaderboardResponse>;
}

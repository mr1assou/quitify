import { LEADERBOARD_PAGE_SIZE } from "@/constants/leaderboard/leaderboardPagination";
import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { BackendLeaderboardResponse } from "@/types/leaderboard/leaderboardApi";

export type FetchLeaderboardOptions = {
  offset?: number;
  limit?: number;
};

export async function fetchLeaderboard(
  options: FetchLeaderboardOptions = {},
): Promise<BackendLeaderboardResponse> {
  const params = new URLSearchParams();
  params.set("offset", String(options.offset ?? 0));
  params.set("limit", String(options.limit ?? LEADERBOARD_PAGE_SIZE));

  const res = await authenticatedFetch(`/leaderboard?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Could not load leaderboard");
  }

  return res.json() as Promise<BackendLeaderboardResponse>;
}

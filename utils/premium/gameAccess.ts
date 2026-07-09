import type { CravingGameId } from "@/constants/craving/games/cravingGames";

/** Game available without VIP (first item in catalog). */
export const FREE_GAME_ID: CravingGameId = "breathing";

export function isGameUnlocked(gameId: string, isPremium: boolean): boolean {
  if (isPremium) return true;
  return gameId === FREE_GAME_ID;
}

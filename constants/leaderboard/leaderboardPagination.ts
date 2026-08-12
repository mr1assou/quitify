export const LEADERBOARD_PAGE_SIZE = 10;

/**
 * Spot my rank window — sized to fit on one screen so YOU is visible
 * without scrolling (a few above + you + a few below).
 */
export const LEADERBOARD_AROUND_ABOVE = 2;
export const LEADERBOARD_AROUND_BELOW = 5;

/** Total rows fetched for Spot (~above + you + below). */
export const LEADERBOARD_AROUND_PAGE_SIZE =
  LEADERBOARD_AROUND_ABOVE + 1 + LEADERBOARD_AROUND_BELOW;

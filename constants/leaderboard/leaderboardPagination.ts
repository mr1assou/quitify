export const LEADERBOARD_PAGE_SIZE = 10;

/**
 * Players above + below you when Spot my rank jumps to your neighborhood.
 * Total window ≈ 2 * radius + 1 (must be <= backend max page size).
 */
export const LEADERBOARD_AROUND_RADIUS = 12;

/** Max rows for an around-me jump (radius*2+1). */
export const LEADERBOARD_AROUND_PAGE_SIZE = LEADERBOARD_AROUND_RADIUS * 2 + 1;

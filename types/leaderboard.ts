export type LeaderboardEntry = {
  /** Database user id when loaded from the API. */
  userId?: number;
  rank: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
  /** Highest badge tier this player has earned. */
  badgeId: string;
  /** PNG flag URL shown on the profile avatar. */
  countryFlag: string;
  countryCode?: string;
  imageUrl?: string;
  /** UI-only online presence (mock until WebSocket/backend). */
  isOnline?: boolean;
};

export type LeaderboardGap = {
  kind: "gap";
};

export type LeaderboardRowItem = {
  kind: "entry";
  entry: LeaderboardEntry;
};

export type LeaderboardRow = LeaderboardGap | LeaderboardRowItem;

export type LeaderboardSnapshot = {
  currentUser: LeaderboardEntry;
  /** Everyone else on loaded pages, sorted by rank (current user excluded). */
  others: LeaderboardRow[];
  totalUsers: number;
  hasMore: boolean;
  /** Next API offset for loading more rows. */
  nextOffset: number;
};

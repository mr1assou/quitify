export type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
  /** Highest badge tier this player has earned. */
  badgeId: string;
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
  /** Everyone else, sorted by rank (current user excluded). */
  others: LeaderboardRow[];
  totalUsers: number;
};

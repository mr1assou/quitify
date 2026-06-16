export type PlayerProfile = {
  id: string;
  /** Database user id when the profile maps to a real account. */
  userId?: number;
  name: string;
  rank: number;
  totalPlayers: number;
  freedomPoints: number;
  badgeId: string;
  countryFlag: string;
  countryLabel: string;
  /** UI-only online presence (mock until WebSocket/backend). */
  isOnline?: boolean;
  smokeFreeDays: number;
  bestSmokeFreeDays: number;
  isCurrentUser: boolean;
  bio: string;
  memberSinceLabel: string;
  avatarUrl?: string;
};

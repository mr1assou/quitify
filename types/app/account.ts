import type { UserRole } from "@/constants/auth/userRoles";

export type UserAccount = {
  userId?: number;
  name?: string;
  email: string;
  createdAt: number;
  role?: UserRole;
  /** Badge ids persisted on the server (e.g. first-step on signup). */
  earnedBadgeIds?: string[];
  freedomPoints?: number;
  goalsCompleted?: number;
  /** Last motivational card index (0-based), synced across devices. */
  motivationCardIndex?: number;
  /** Last tips card index (0-based), synced across devices. */
  tipsCardIndex?: number;
  /** Bookmarked tip card ids, synced across devices. */
  savedTipCardIds?: string[];
  /** Bookmarked motivation card ids, synced across devices. */
  savedMotivationCardIds?: string[];
};

export type AppFlags = {
  hasSeenSignupPrompt: boolean;
  hasSeenPaywall: boolean;
  hasLoggedFirstCraving: boolean;
};

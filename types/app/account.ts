export type UserAccount = {
  userId?: number;
  name?: string;
  email: string;
  createdAt: number;
  /** Badge ids persisted on the server (e.g. first-step on signup). */
  earnedBadgeIds?: string[];
  freedomPoints?: number;
  goalsCompleted?: number;
  /** Last motivational card index (0-based), synced across devices. */
  motivationCardIndex?: number;
  /** Last tips card index (0-based), synced across devices. */
  tipsCardIndex?: number;
};

export type AppFlags = {
  hasSeenSignupPrompt: boolean;
  hasSeenPaywall: boolean;
  hasLoggedFirstCraving: boolean;
};

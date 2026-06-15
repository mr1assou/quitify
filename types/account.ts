export type UserAccount = {
  userId?: number;
  name?: string;
  email: string;
  createdAt: number;
  /** Badge ids persisted on the server (e.g. first-step on signup). */
  earnedBadgeIds?: string[];
  freedomPoints?: number;
};

export type AppFlags = {
  hasSeenSignupPrompt: boolean;
  hasSeenPaywall: boolean;
  hasLoggedFirstCraving: boolean;
};

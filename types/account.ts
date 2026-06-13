export type UserAccount = {
  userId?: number;
  name?: string;
  email: string;
  createdAt: number;
};

export type AppFlags = {
  hasSeenSignupPrompt: boolean;
  hasSeenPaywall: boolean;
  hasLoggedFirstCraving: boolean;
};

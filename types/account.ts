export type UserAccount = {
  name?: string;
  email: string;
  createdAt: number;
};

export type AppFlags = {
  hasSeenSignupPrompt: boolean;
  hasSeenPaywall: boolean;
  hasLoggedFirstCraving: boolean;
};

import type { AppFlags, UserAccount } from "@/types/account";
import type { CravingLog } from "@/types/craving";
import type { MissionLog } from "@/types/mission";
import type { UserProfile } from "@/types/profile";

export type AppState = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  cravings: CravingLog[];
  missionLogs: Record<string, MissionLog>;
  isPremium: boolean;
  account: UserAccount | null;
  flags: AppFlags;
};

export type Gates = {
  shouldShowSignup: boolean;
  shouldShowPaywall: boolean;
};

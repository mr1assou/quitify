import type { AppFlags, UserAccount } from "@/types/app/account";
import type { CravingLog } from "@/types/craving/craving";
import type { MissionLog } from "@/types/progress/mission";
import type { UserProfile } from "@/types/profile/profile";

export type AppState = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  cravings: CravingLog[];
  missionLogs: Record<string, MissionLog>;
  isPremium: boolean;
  account: UserAccount | null;
  /** Game-earned FP kept on-device until backend sync exists. */
  localFreedomPoints: number;
  flags: AppFlags;
};

export type Gates = {
  shouldShowSignup: boolean;
  shouldShowPaywall: boolean;
};

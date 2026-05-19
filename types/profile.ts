import type {
  MotivationLevel,
  NicotineConsumptionFormId,
  PrimaryInterestId,
  PriorQuitAttempts,
  ProfileSex,
  QuitMethod,
} from "@/types/onboarding";

/** The persisted user profile saved at the end of onboarding. */
export type UserProfile = {
  name?: string;
  sex?: ProfileSex;
  /** Local midnight timestamp of the user's birth date. */
  birthDate?: number;
  quitDate: number;
  streakStart: number;
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packCost: number;
  countryCode?: string;
  currency: string;
  quitReasonIds?: string[];
  motivationLevel?: MotivationLevel;
  priorQuitAttempts?: PriorQuitAttempts;
  primaryInterests?: PrimaryInterestId[];
  nicotineConsumptionForm?: NicotineConsumptionFormId;
  nicotineHabitYears?: number;
  quitMethod?: QuitMethod;
};

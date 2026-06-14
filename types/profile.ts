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
  currentAttemptNumber: number;
  /** Lifetime cigarettes smoked during lapses (subtracted from avoided count). */
  slipCigarettesTotal?: number;
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packCost: number;
  countryCode?: string;
  /** PNG flag URL from onboarding / profile. */
  countryFlag?: string;
  /** User-uploaded profile photo URL (R2). */
  imageUrl?: string;
  currency: string;
  /** IANA timezone from profile, e.g. "Europe/Paris". */
  timezone?: string;
  quitReasonIds?: string[];
  motivationLevel?: MotivationLevel;
  priorQuitAttempts?: PriorQuitAttempts;
  primaryInterests?: PrimaryInterestId[];
  nicotineConsumptionForm?: NicotineConsumptionFormId;
  nicotineHabitYears?: number;
  quitMethod?: QuitMethod;
};

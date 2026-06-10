/**
 * Domain types for the onboarding flow.
 *
 * Const arrays of options live in `constants/onboarding*.ts`; this file
 * is the single source of truth for the *shapes* used across context,
 * UI components, and persisted profile data.
 */

import type {
  CigarettesPerDayBandId,
  NicotineHabitYearsBandId,
} from "@/constants/onboardingNicotineBands";

export type { CigarettesPerDayBandId, NicotineHabitYearsBandId };

/* ------------------------------ Profile sex ------------------------------ */

export type ProfileSex = "female" | "male" | "prefer_not_say";

export type ProfileSexOption = {
  id: ProfileSex;
  label: string;
};

/* ----------------------------- Motivation -------------------------------- */

export type MotivationLevel = "high" | "medium" | "low";

export type MotivationLevelOption = {
  id: MotivationLevel;
  label: string;
  hint: string;
};

/* ------------------------------ Reasons --------------------------------- */

export type QuitReasonId =
  | "health"
  | "family"
  | "money"
  | "freedom"
  | "smell"
  | "fitness"
  | "longevity"
  | "control"
  | "example"
  | "sleep"
  | "appearance"
  | "calm";

export type QuitReasonOption = {
  id: QuitReasonId;
  label: string;
};

/* --------------------------- Prior quit attempts ------------------------- */

export type PriorQuitAttempts = "never" | "once" | "multiple";

export type PriorQuitAttemptsOption = {
  id: PriorQuitAttempts;
  label: string;
  hint: string;
};

/* --------------------------- Primary interests --------------------------- */

export type PrimaryInterestId =
  | "streak"
  | "money"
  | "health"
  | "cravings"
  | "missions"
  | "stats"
  | "rewards"
  | "routine";

export type PrimaryInterestOption = {
  id: PrimaryInterestId;
  label: string;
  hint: string;
};

/* ------------------------ Nicotine consumption form ---------------------- */

/** Onboarding step 6 only collects cigarette consumption. */
export type NicotineConsumptionFormId = "cigarettes";

/* ----------------------------- Quit plan -------------------------------- */

export type QuitMethod = "cold_turkey" | "gradual";

export type QuitMethodOption = {
  id: QuitMethod;
  label: string;
  hint: string;
};

export type QuitStartPreset = "now" | "custom";

export type QuitStartPresetOption = {
  id: QuitStartPreset;
  label: string;
  hint: string;
};

/* ----------------------------- Onboarding draft -------------------------- */

/**
 * Mutable working copy of the user's answers as they go through onboarding.
 * Becomes a `UserProfile` via `buildProfile()` once the flow completes.
 */
export type OnboardingDraft = {
  username: string;
  sex?: ProfileSex;
  birthMonth?: number;
  birthDay?: number;
  birthYear?: number;
  quitReasonIds: string[];
  motivationLevel?: MotivationLevel;
  priorQuitAttempts?: PriorQuitAttempts;
  primaryInterestIds: PrimaryInterestId[];

  nicotineConsumptionForm?: NicotineConsumptionFormId;
  nicotineHabitYears?: number;
  nicotineHabitYearsBand?: NicotineHabitYearsBandId;

  cigarettesPerDay: number;
  cigarettesPerDayBand?: CigarettesPerDayBandId;
  cigarettesPerPack: number;
  /** Raw pack size text the user typed (whole number, min 1). */
  cigarettesPerPackInput?: string;
  packCost?: number;
  /** Raw pack cost text the user typed (for payload / DB). */
  packCostInput?: string;
  /** ISO 3166-1 alpha-2 from REST Countries (step 5). */
  countryCode?: string;
  /** Display name from REST Countries (step 5), used in payload / DB. */
  countryName?: string;
  /** PNG flag URL from REST Countries (step 5). */
  countryFlag?: string;
  currency: string;

  quitMethod?: QuitMethod;
  /** When to start: now or a custom calendar day. */
  quitStartPreset?: QuitStartPreset;
  /** Used when `quitStartPreset` is `custom`. */
  quitStartMonth?: number;
  quitStartDay?: number;
  quitStartYear?: number;
  /** Local midnight of the chosen quit / streak start day. */
  startTimestamp: number;
};

/** Public shape of the onboarding context (returned by `useOnboarding()`). */
export type OnboardingContextValue = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
  reset: () => void;
};

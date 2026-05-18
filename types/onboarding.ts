/**
 * Domain types for the onboarding flow.
 *
 * Const arrays of options live in `constants/onboarding*.ts`; this file
 * is the single source of truth for the *shapes* used across context,
 * UI components, and persisted profile data.
 */

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

  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packCost?: number;
  currency: string;
  startTimestamp: number;
};

/** Public shape of the onboarding context (returned by `useOnboarding()`). */
export type OnboardingContextValue = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
  reset: () => void;
};

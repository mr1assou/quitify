/**
 * Human-readable onboarding answers for all six steps.
 * Values match the labels / text the user sees in the UI (for DB storage).
 */
export type OnboardingPayload = {
  step1: OnboardingPayloadStep1;
  step2: OnboardingPayloadStep2;
  step3: OnboardingPayloadStep3;
  step4: OnboardingPayloadStep4;
  step5: OnboardingPayloadStep5;
  step6: OnboardingPayloadStep6;
};

export type OnboardingPayloadStep1 = {
  /** Selected quit reason labels, e.g. "Better health", "Save money". */
  quitReasons: string[];
  /** Free text when "Other" is selected. */
  otherText?: string;
};

export type OnboardingPayloadStep2 = {
  /** e.g. "High", "Medium", "Low", "Other". */
  motivation?: string;
  /** Free text when "Other" is selected. */
  otherText?: string;
};

export type OnboardingPayloadStep3 = {
  /** e.g. "Never", "Once", "Multiple times", "Other". */
  priorQuitAttempts?: string;
  /** Free text when "Other" is selected. */
  otherText?: string;
};

export type OnboardingPayloadStep4 = {
  /** Selected interest labels. */
  primaryInterests: string[];
  /** Free text when "Other" is selected. */
  otherText?: string;
};

export type OnboardingPayloadStep5 = {
  username: string;
  /** e.g. "Female", "Male", "Prefer not to say". */
  sex?: string;
  /** Country name as shown in the picker, e.g. "France". */
  country?: string;
  /** PNG flag URL, e.g. from REST Countries `flags.png`. */
  countryFlag?: string;
  /** Currency code as shown next to country, e.g. "EUR" or "$". */
  currency: string;
  /** Quit timing preset: "Now" or "Custom". */
  quitDatePreset?: string;
  /** UTC ISO-8601 quit instant (local quit-day midnight). */
  quitDate?: string;
};

export type OnboardingPayloadStep6 = {
  /** Representative count from the band, e.g. 21–30 → 25. */
  cigarettesPerDay: number;
  /** Subtitle under the range, e.g. "Light smoker". */
  cigarettesPerDayNote?: string;
  /** Pack cost entered by user, e.g. "€12.50". */
  packPrice?: string;
  /** e.g. "4–7 years". */
  yearsSmoking?: string;
  /** Whole number, e.g. 20. */
  cigarettesPerPack: number;
};

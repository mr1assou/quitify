import type { MotivationLevelOption } from "@/types/onboarding/onboarding";

export type { MotivationLevel, MotivationLevelOption } from "@/types/onboarding/onboarding";

export const MOTIVATION_LEVEL_OPTIONS: readonly MotivationLevelOption[] = [
  { id: "high", label: "High", hint: "" },
  { id: "medium", label: "Medium", hint: "" },
  { id: "low", label: "Low", hint: "" },
  { id: "other", label: "Other", hint: "" },
] as const;

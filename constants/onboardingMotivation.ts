import type { MotivationLevelOption } from "@/types/onboarding";

export type { MotivationLevel, MotivationLevelOption } from "@/types/onboarding";

export const MOTIVATION_LEVEL_OPTIONS: readonly MotivationLevelOption[] = [
  { id: "high", label: "High", hint: "I'm very ready and committed right now." },
  { id: "medium", label: "Medium", hint: "I want to quit, but some days are harder." },
  { id: "low", label: "Low", hint: "I'm exploring—every step still counts." },
] as const;

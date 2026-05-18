import type { PriorQuitAttemptsOption } from "@/types/onboarding";

export type { PriorQuitAttempts, PriorQuitAttemptsOption } from "@/types/onboarding";

export const PRIOR_QUIT_ATTEMPT_OPTIONS: readonly PriorQuitAttemptsOption[] = [
  {
    id: "never",
    label: "Never",
    hint: "This is my first real try, or I have not counted past tries before.",
  },
  {
    id: "once",
    label: "Once",
    hint: "I have tried to quit one time before.",
  },
  {
    id: "multiple",
    label: "Multiple times",
    hint: "I have tried to quit more than once.",
  },
] as const;

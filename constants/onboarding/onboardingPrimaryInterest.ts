import type { PrimaryInterestOption } from "@/types/onboarding/onboarding";

export type { PrimaryInterestId, PrimaryInterestOption } from "@/types/onboarding/onboarding";

export const PRIMARY_INTEREST_OPTIONS: readonly PrimaryInterestOption[] = [
  { id: "streak", label: "My smoke-free streak", hint: "Seeing days add up keeps me going." },
  { id: "money", label: "Money I save", hint: "Watching pounds or dollars stack up." },
  { id: "health", label: "Feeling healthier", hint: "Breathing, energy, and small wins." },
  { id: "cravings", label: "Handling cravings", hint: "Tools when the urge hits." },
  { id: "missions", label: "Daily missions", hint: "Small tasks that build momentum." },
  { id: "stats", label: "Stats & insights", hint: "Charts and numbers about my journey." },
  { id: "rewards", label: "Rewards & badges", hint: "Unlocking achievements along the way." },
  { id: "routine", label: "A calmer routine", hint: "Replacing the habit with something better." },
  { id: "other", label: "Other", hint: "" },
] as const;

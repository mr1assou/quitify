import type { PrimaryInterestOption } from "@/types/onboarding/onboarding";

export type { PrimaryInterestId, PrimaryInterestOption } from "@/types/onboarding/onboarding";

export const PRIMARY_INTEREST_OPTIONS: readonly PrimaryInterestOption[] = [
  { id: "streak", label: "My smoke-free streak", hint: "Seeing days add up keeps me going." },
  { id: "money", label: "Money I save", hint: "Watching pounds or dollars stack up." },
  { id: "health", label: "Feeling healthier", hint: "Breathing, energy, and small wins." },
  { id: "cravings", label: "Handling cravings", hint: "Tools when the urge hits." },
  { id: "other", label: "Other", hint: "" },
] as const;

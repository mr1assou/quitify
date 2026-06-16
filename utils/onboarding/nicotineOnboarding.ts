import { isValidCigarettesPerPack } from "@/constants/onboarding/onboardingNicotineBands";
import type { OnboardingDraft } from "@/types";

/** True when the user typed a value that is 0 or otherwise below the minimum. */
export function hasInvalidCigarettesPerPackInput(draft: OnboardingDraft): boolean {
  const input = draft.cigarettesPerPackInput?.trim();
  return (
    input != null &&
    input.length > 0 &&
    !isValidCigarettesPerPack(draft.cigarettesPerPack)
  );
}

function hasValidCigarettesPerPackInput(draft: OnboardingDraft): boolean {
  const input = draft.cigarettesPerPackInput?.trim();
  return (
    input != null &&
    input.length > 0 &&
    isValidCigarettesPerPack(draft.cigarettesPerPack)
  );
}

function hasValidPackCost(draft: OnboardingDraft): boolean {
  const input = draft.packCostInput?.trim();
  return (
    input != null &&
    input.length > 0 &&
    typeof draft.packCost === "number" &&
    Number.isFinite(draft.packCost) &&
    draft.packCost > 0
  );
}

export function isNicotineHabitsComplete(draft: OnboardingDraft): boolean {
  return (
    draft.cigarettesPerDayBand != null &&
    hasValidCigarettesPerPackInput(draft) &&
    hasValidPackCost(draft) &&
    draft.nicotineHabitYearsBand != null
  );
}

/** Step 6: cigarette habit fields (dropdowns + pack cost). */
export function isNicotineConsumptionStepComplete(draft: OnboardingDraft): boolean {
  return isNicotineHabitsComplete(draft);
}

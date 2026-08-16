import { isValidCigarettesPerPack } from "@/constants/onboarding/onboardingNicotineBands";
import type { OnboardingDraft } from "@/types";

export type NicotineFieldErrors = {
  cigsPerDay?: boolean;
  packSize?: boolean;
  packSizeInvalid?: boolean;
  price?: boolean;
  priceInvalid?: boolean;
  habitYears?: boolean;
};

/** True when the user typed a value that is 0 or otherwise below the minimum. */
export function hasInvalidCigarettesPerPackInput(draft: OnboardingDraft): boolean {
  const input = draft.cigarettesPerPackInput?.trim();
  return (
    input != null &&
    input.length > 0 &&
    !isValidCigarettesPerPack(draft.cigarettesPerPack)
  );
}

export function hasInvalidPackCostInput(draft: OnboardingDraft): boolean {
  const input = draft.packCostInput?.trim();
  if (!input) return false;
  return !(
    typeof draft.packCost === "number" &&
    Number.isFinite(draft.packCost) &&
    draft.packCost > 0
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

/** Missing / invalid fields after the user taps Continue. */
export function getNicotineFieldErrors(draft: OnboardingDraft): NicotineFieldErrors {
  const errors: NicotineFieldErrors = {};

  if (draft.cigarettesPerDayBand == null) errors.cigsPerDay = true;

  const packInput = draft.cigarettesPerPackInput?.trim() ?? "";
  if (!packInput) {
    errors.packSize = true;
  } else if (!isValidCigarettesPerPack(draft.cigarettesPerPack)) {
    errors.packSizeInvalid = true;
  }

  const priceInput = draft.packCostInput?.trim() ?? "";
  if (!priceInput) {
    errors.price = true;
  } else if (
    !(
      typeof draft.packCost === "number" &&
      Number.isFinite(draft.packCost) &&
      draft.packCost > 0
    )
  ) {
    errors.priceInvalid = true;
  }

  if (draft.nicotineHabitYearsBand == null) errors.habitYears = true;

  return errors;
}

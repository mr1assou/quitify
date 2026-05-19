import type { OnboardingDraft } from "@/types";
import { isQuitMethodComplete } from "@/utils/quitPlan";

function filledPositive(n: number | undefined): boolean {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

function filledNonNegative(n: number | undefined): boolean {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

export function isNicotineHabitsComplete(draft: OnboardingDraft): boolean {
  return (
    filledPositive(draft.cigarettesPerDay) &&
    filledNonNegative(draft.packCost) &&
    filledPositive(draft.cigarettesPerPack) &&
    filledNonNegative(draft.nicotineHabitYears)
  );
}

/** Step 6: cigarette habits + quit method. */
export function isNicotineConsumptionStepComplete(draft: OnboardingDraft): boolean {
  return isNicotineHabitsComplete(draft) && isQuitMethodComplete(draft);
}

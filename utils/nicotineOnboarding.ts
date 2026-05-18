import type { OnboardingDraft } from "@/types";

function filledPositive(n: number | undefined): boolean {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

function filledNonNegative(n: number | undefined): boolean {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

export function isNicotineConsumptionStepComplete(draft: OnboardingDraft): boolean {
  return (
    filledPositive(draft.cigarettesPerDay) &&
    filledNonNegative(draft.packCost) &&
    filledPositive(draft.cigarettesPerPack) &&
    filledNonNegative(draft.nicotineHabitYears)
  );
}

import {
  CIGARETTES_PER_DAY_BANDS,
  MIN_CIGARETTES_PER_PACK,
  NICOTINE_HABIT_YEARS_BANDS,
  type CigarettesPerDayBandId,
  type NicotineHabitYearsBandId,
} from "@/constants/onboardingNicotineBands";
import type { OnboardingDraft } from "@/types";
import {
  parseOptionalPositiveDecimal,
  parseOptionalPositiveInteger,
} from "@/utils/nicotineFormParsing";

export function patchForCigarettesPerDayBand(
  id: CigarettesPerDayBandId,
): Partial<OnboardingDraft> {
  const band = CIGARETTES_PER_DAY_BANDS.find((b) => b.id === id)!;
  return {
    cigarettesPerDayBand: id,
    cigarettesPerDay: band.cigarettesPerDay,
  };
}

export function patchForPackCostInput(raw: string): Partial<OnboardingDraft> {
  const packCostInput = raw;
  const parsed = parseOptionalPositiveDecimal(raw);
  return {
    packCostInput,
    packCost: parsed,
  };
}

export function patchForNicotineHabitYearsBand(
  id: NicotineHabitYearsBandId,
): Partial<OnboardingDraft> {
  const band = NICOTINE_HABIT_YEARS_BANDS.find((b) => b.id === id)!;
  return {
    nicotineHabitYearsBand: id,
    nicotineHabitYears: band.nicotineHabitYears,
  };
}

export function patchForCigarettesPerPackInput(raw: string): Partial<OnboardingDraft> {
  const digitsOnly = raw.replace(/\D/g, "");
  const parsed = parseOptionalPositiveInteger(digitsOnly, MIN_CIGARETTES_PER_PACK);
  return {
    cigarettesPerPackInput: digitsOnly,
    cigarettesPerPack: parsed ?? 0,
  };
}

import {
  CIGARETTES_PER_DAY_BANDS,
  isCustomCigarettesPerDayBand,
  MIN_CIGARETTES_PER_DAY,
  MIN_CIGARETTES_PER_PACK,
  NICOTINE_HABIT_YEARS_BANDS,
  type CigarettesPerDayBandId,
  type NicotineHabitYearsBandId,
} from "@/constants/onboarding/onboardingNicotineBands";
import type { OnboardingDraft } from "@/types";
import {
  parseOptionalPositiveDecimal,
  parseOptionalPositiveInteger,
} from "@/utils/onboarding/nicotineFormParsing";

export function patchForCigarettesPerDayBand(
  id: CigarettesPerDayBandId,
  customInput?: string,
): Partial<OnboardingDraft> {
  const band = CIGARETTES_PER_DAY_BANDS.find((b) => b.id === id)!;
  if (isCustomCigarettesPerDayBand(id)) {
    const digitsOnly = (customInput ?? "").replace(/\D/g, "");
    const parsed = parseOptionalPositiveInteger(
      digitsOnly,
      MIN_CIGARETTES_PER_DAY,
    );
    return {
      cigarettesPerDayBand: id,
      cigarettesPerDayCustomInput: digitsOnly,
      cigarettesPerDay: parsed ?? 0,
    };
  }
  return {
    cigarettesPerDayBand: id,
    cigarettesPerDay: band.cigarettesPerDay,
  };
}

export function patchForCigarettesPerDayCustomInput(
  raw: string,
): Partial<OnboardingDraft> {
  const digitsOnly = raw.replace(/\D/g, "");
  const parsed = parseOptionalPositiveInteger(
    digitsOnly,
    MIN_CIGARETTES_PER_DAY,
  );
  return {
    cigarettesPerDayBand: "custom",
    cigarettesPerDayCustomInput: digitsOnly,
    cigarettesPerDay: parsed ?? 0,
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

export function patchForCigarettesPerPackInput(
  raw: string,
): Partial<OnboardingDraft> {
  const digitsOnly = raw.replace(/\D/g, "");
  const parsed = parseOptionalPositiveInteger(
    digitsOnly,
    MIN_CIGARETTES_PER_PACK,
  );
  return {
    cigarettesPerPackInput: digitsOnly,
    cigarettesPerPack: parsed ?? 0,
  };
}

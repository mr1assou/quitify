import type { StringDropdownOption } from "@/types/shared/ui";

/** Fallback when building profile if pack size was not captured. */
export const DEFAULT_CIGARETTES_PER_PACK = 20;

export const MIN_CIGARETTES_PER_PACK = 1;

export function isValidCigarettesPerPack(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_CIGARETTES_PER_PACK;
}

export const CIGARETTES_PER_DAY_BANDS = [
  { id: "1_5", label: "1–5", hint: "Occasional smoker", cigarettesPerDay: 3 },
  { id: "6_10", label: "6–10", hint: "Light smoker", cigarettesPerDay: 8 },
  { id: "11_15", label: "11–15", hint: "Moderate smoker", cigarettesPerDay: 13 },
  { id: "16_20", label: "16–20", hint: "About 1 pack per day", cigarettesPerDay: 18 },
  { id: "21_30", label: "21–30", hint: "Heavy smoker", cigarettesPerDay: 25 },
  { id: "31_40", label: "31–40", hint: "Very heavy smoker", cigarettesPerDay: 35 },
  { id: "40_50", label: "40–50", hint: "About 2 packs per day", cigarettesPerDay: 45 },
  { id: "custom", label: "Custom", hint: "Enter your exact number", cigarettesPerDay: 0 },
] as const;

export const NICOTINE_HABIT_YEARS_BANDS = [
  { id: "less_than_1", label: "Less than 1 year", nicotineHabitYears: 0.5 },
  { id: "1_3", label: "1–3 years", nicotineHabitYears: 2 },
  { id: "4_7", label: "4–7 years", nicotineHabitYears: 5.5 },
  { id: "8_15", label: "8–15 years", nicotineHabitYears: 11.5 },
  { id: "16_25", label: "16–25 years", nicotineHabitYears: 20.5 },
  { id: "25_plus", label: "25+ years", nicotineHabitYears: 30 },
] as const;

export type CigarettesPerDayBandId = (typeof CIGARETTES_PER_DAY_BANDS)[number]["id"];
export type NicotineHabitYearsBandId = (typeof NICOTINE_HABIT_YEARS_BANDS)[number]["id"];

export const CUSTOM_CIGARETTES_PER_DAY_BAND_ID = "custom" as const;

export const MIN_CIGARETTES_PER_DAY = 1;

export function isCustomCigarettesPerDayBand(
  id: CigarettesPerDayBandId | undefined,
): boolean {
  return id === CUSTOM_CIGARETTES_PER_DAY_BAND_ID;
}

export function isValidCigarettesPerDay(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_CIGARETTES_PER_DAY;
}

export const CIGARETTES_PER_DAY_DROPDOWN_OPTIONS: StringDropdownOption[] =
  CIGARETTES_PER_DAY_BANDS.map((b) => ({ value: b.id, label: b.label }));

export const NICOTINE_HABIT_YEARS_DROPDOWN_OPTIONS: StringDropdownOption[] =
  NICOTINE_HABIT_YEARS_BANDS.map((b) => ({ value: b.id, label: b.label }));

export function cigarettesPerDayBandHint(
  id: CigarettesPerDayBandId | undefined,
): string | undefined {
  return CIGARETTES_PER_DAY_BANDS.find((b) => b.id === id)?.hint;
}

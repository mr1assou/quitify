import {
  CIGARETTES_PER_DAY_BANDS,
  CIGARETTES_PER_DAY_DROPDOWN_OPTIONS,
  type CigarettesPerDayBandId,
} from "@/constants/onboardingNicotineBands";

/** A lapse is always logged as a single cigarette. */
export const LAPSE_CIGARETTE_COUNT = 1;

export type SlipCigaretteBandId = CigarettesPerDayBandId;

export const SLIP_CIGARETTE_DROPDOWN_OPTIONS = CIGARETTES_PER_DAY_DROPDOWN_OPTIONS;

export function isSlipCigaretteBand(value: string): value is SlipCigaretteBandId {
  return SLIP_CIGARETTE_DROPDOWN_OPTIONS.some((option) => option.value === value);
}

export function slipCigarettesCountForBand(bandId: SlipCigaretteBandId): number {
  return CIGARETTES_PER_DAY_BANDS.find((band) => band.id === bandId)?.cigarettesPerDay ?? 1;
}

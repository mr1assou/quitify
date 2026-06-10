import {
  MINUTES_LIFE_PER_CIGARETTE_AVOIDED,
  MINUTES_RECLAIMED_PER_CIGARETTE,
} from "@/constants/health";
import type { UserProfile } from "@/types";
import { MS_DAY } from "@/utils/time/ms";

export type QuitImpact = {
  cigarettesAvoided: number;
  moneySaved: number;
  minutesReclaimed: number;
  lifeMinutesGained: number;
};

type SmokingEconomics = Pick<
  UserProfile,
  "packCost" | "cigarettesPerPack" | "cigarettesPerDay"
>;

export function elapsedMsSince(anchorMs: number, now = Date.now()): number {
  if (!Number.isFinite(anchorMs)) return 0;
  return Math.max(0, now - anchorMs);
}

export function cigarettesAvoided(cigarettesPerDay: number, sinceQuitMs: number): number {
  return (Math.max(0, cigarettesPerDay) * sinceQuitMs) / MS_DAY;
}

export function netCigarettesAvoided(
  cigarettesPerDay: number,
  sinceQuitMs: number,
  slipCigarettesSmoked: number,
): number {
  return Math.max(
    0,
    cigarettesAvoided(cigarettesPerDay, sinceQuitMs) - Math.max(0, slipCigarettesSmoked),
  );
}

export function moneyPerCigarette(
  profile: Pick<UserProfile, "packCost" | "cigarettesPerPack">,
): number {
  return profile.packCost / Math.max(1, profile.cigarettesPerPack);
}

export function moneySavedFromCigarettes(
  count: number,
  profile: Pick<UserProfile, "packCost" | "cigarettesPerPack">,
): number {
  return (count / Math.max(1, profile.cigarettesPerPack)) * profile.packCost;
}

export function dailySavings(profile: SmokingEconomics): number {
  return moneyPerCigarette(profile) * Math.max(0, profile.cigarettesPerDay);
}

export function computeQuitImpact(profile: UserProfile, sinceQuitMs: number): QuitImpact {
  const avoided = netCigarettesAvoided(
    profile.cigarettesPerDay,
    sinceQuitMs,
    profile.slipCigarettesTotal ?? 0,
  );

  return {
    cigarettesAvoided: avoided,
    moneySaved: moneySavedFromCigarettes(avoided, profile),
    minutesReclaimed: avoided * MINUTES_RECLAIMED_PER_CIGARETTE,
    lifeMinutesGained: avoided * MINUTES_LIFE_PER_CIGARETTE_AVOIDED,
  };
}

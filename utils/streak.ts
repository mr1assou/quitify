import { MINUTES_LIFE_PER_CIGARETTE_AVOIDED } from "@/constants/health";
import type { StreakStats, UserProfile } from "@/types";

import { daysBetween } from "./dates";

export type { StreakStats } from "@/types";

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MINUTES_PER_CIGARETTE = 6;

export function computeStreak(profile: UserProfile, now = Date.now()): StreakStats {
  const sinceStreak = Math.max(0, now - profile.streakStart);
  const sinceQuit = Math.max(0, now - profile.quitDate);

  const streakHours = sinceStreak / MS_PER_HOUR;
  const streakDays = streakHours / 24;
  const daysSinceQuit = sinceQuit / MS_PER_DAY;

  const cigarettesAvoided = (profile.cigarettesPerDay * sinceQuit) / MS_PER_DAY;
  const moneySaved =
    (cigarettesAvoided / Math.max(1, profile.cigarettesPerPack)) * profile.packCost;
  const minutesReclaimed = cigarettesAvoided * MINUTES_PER_CIGARETTE;
  const lifeMinutesGained = cigarettesAvoided * MINUTES_LIFE_PER_CIGARETTE_AVOIDED;

  return {
    streakDays,
    streakHours,
    daysSinceQuit,
    cigarettesAvoided,
    moneySaved,
    minutesReclaimed,
    lifeMinutesGained,
  };
}

export function currentMissionDay(profile: UserProfile, now = Date.now()): number {
  return Math.max(1, daysBetween(profile.streakStart, now) + 1);
}

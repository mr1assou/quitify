import type { StreakStats, UserProfile } from "@/types";
import { computeQuitImpact, elapsedMsSince } from "@/utils/stats/quitImpact";
import { MS_DAY, MS_HOUR } from "@/utils/time/ms";

import { daysBetween } from "@/utils/shared/dates";

export function computeStreak(profile: UserProfile, now = Date.now()): StreakStats {
  const sinceStreak = elapsedMsSince(profile.streakStart, now);
  const sinceQuit = elapsedMsSince(profile.quitDate, now);
  const impact = computeQuitImpact(profile, sinceQuit);

  return {
    streakDays: sinceStreak / MS_DAY,
    streakHours: sinceStreak / MS_HOUR,
    daysSinceQuit: sinceQuit / MS_DAY,
    ...impact,
  };
}

export function currentMissionDay(profile: UserProfile, now = Date.now()): number {
  return Math.max(1, daysBetween(profile.streakStart, now) + 1);
}

import {
  AUTO_MISSIONS,
  DAILY_BONUS_XP,
  DEFAULT_AVOID_TARGET,
  SUPPORT_CAPS,
  SUPPORT_MISSIONS,
} from "@/constants/progress/dailyFocus";
import type {
  AutoMissionState,
  DailyFocus,
  SupportMissionState,
} from "@/types/progress/dailyFocus";
import type { CravingLog, UserProfile } from "@/types";
import { startOfLocalDay } from "@/utils/shared/dates";

const MS_PER_HOUR = 1000 * 60 * 60;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Hours the user has been smoke-free TODAY (since midnight).
 * Capped to 24 — never reports tomorrow's progress.
 */
export function hoursSmokeFreeToday(streakStart: number, now: number) {
  const startOfDay = startOfLocalDay(now);
  const since = Math.max(streakStart, startOfDay);
  return Math.min(24, Math.max(0, (now - since) / MS_PER_HOUR));
}

/** Total hours since the streak began (no cap). */
export function hoursSinceStreakStart(streakStart: number, now: number) {
  return Math.max(0, (now - streakStart) / MS_PER_HOUR);
}

/** Cigarettes avoided today, derived from the user's reported daily intake. */
export function cigarettesAvoidedToday(profile: UserProfile, now: number) {
  const hours = hoursSmokeFreeToday(profile.streakStart, now);
  const perDay = Math.max(0, profile.cigarettesPerDay);
  return (hours / 24) * perDay;
}

function buildAutoMissions(profile: UserProfile, now: number): AutoMissionState[] {
  const todayHours = hoursSmokeFreeToday(profile.streakStart, now);
  const totalHours = hoursSinceStreakStart(profile.streakStart, now);
  const avoidTarget = profile.cigarettesPerDay > 0 ? profile.cigarettesPerDay : DEFAULT_AVOID_TARGET;
  const cigsAvoided = cigarettesAvoidedToday(profile, now);

  return AUTO_MISSIONS.map((def) => {
    let current = 0;
    let target = 24;

    switch (def.id) {
      case "smoke-free-today":
        current = todayHours;
        target = 24;
        break;
      case "reach-24h":
        current = Math.min(24, totalHours);
        target = 24;
        break;
      case "avoid-cigarettes":
        current = cigsAvoided;
        target = avoidTarget;
        break;
    }

    const progress = clamp01(current / target);
    return {
      id: def.id,
      title: def.title,
      icon: def.icon,
      current,
      target,
      progress,
      done: progress >= 1,
      unitLabel: def.unitLabel(target),
      accent: def.accent,
    };
  });
}

function buildSupportMissions(todayCravings: CravingLog[]): SupportMissionState[] {
  const loggedToday = todayCravings.length;
  const resistedToday = todayCravings.filter((c) => c.outcome === "resisted").length;

  return SUPPORT_MISSIONS.map((def) => {
    const cap = SUPPORT_CAPS[def.id];
    let current = 0;

    switch (def.id) {
      case "log-craving":
        current = loggedToday;
        break;
      case "resist-craving":
        current = resistedToday;
        break;
    }

    const capped = current >= cap;
    return {
      id: def.id,
      title: def.title,
      icon: def.icon,
      current: Math.min(current, cap),
      cap,
      xpPerStep: def.xpPerStep,
      progress: clamp01(current / cap),
      capped,
      accent: def.accent,
    };
  });
}

export function computeDailyFocus(
  profile: UserProfile,
  todayCravings: CravingLog[],
  now: number,
): DailyFocus {
  const auto = buildAutoMissions(profile, now);
  const support = buildSupportMissions(todayCravings);

  const completedAuto = auto.filter((m) => m.done).length;
  const totalAuto = auto.length;
  const overallProgress = totalAuto === 0 ? 0 : auto.reduce((sum, m) => sum + m.progress, 0) / totalAuto;
  const bonusUnlocked = completedAuto === totalAuto && totalAuto > 0;

  return {
    auto,
    support,
    completedAuto,
    totalAuto,
    overallProgress,
    bonusUnlocked,
    bonusXp: DAILY_BONUS_XP,
  };
}

/** Picks a single short message based on overall progress + completion state. */
export function pickMotivationMessage(focus: DailyFocus): string {
  if (focus.bonusUnlocked) return "Perfect day. Bonus unlocked.";
  const p = focus.overallProgress;
  if (p < 0.1) return "A new day, a new chance. Stay close to the app.";
  if (p < 0.25) return "You're just getting started — every minute counts.";
  if (p < 0.5) return "Solid start. Keep your momentum.";
  if (p < 0.75) return "You're more than halfway. Stay with it.";
  return "Almost there. Don't lose your streak now.";
}

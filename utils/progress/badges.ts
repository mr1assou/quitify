import { BADGES } from "@/constants/progress/badges";
import { XP_PER_SMOKE_FREE_DAY } from "@/constants/progress/levels";

type BadgeLike = {
  id: string;
  unlocked: boolean;
  daysRequired: number;
  premium?: boolean;
};

/** Highest unlocked badge by milestone, or null if none yet. */
export function resolveHighestUnlockedBadge<T extends BadgeLike>(
  badges: T[],
): T | null {
  let best: T | null = null;

  for (const badge of badges) {
    if (!badge.unlocked) continue;
    if (!best || badge.daysRequired > best.daysRequired) {
      best = badge;
    }
  }

  return best;
}

/** Highest earned badge id (by `daysRequired`), or null if none unlocked. */
export function resolveHighestUnlockedBadgeId(
  badges: BadgeLike[],
  isPremium = false,
): string | null {
  let bestId: string | null = null;
  let bestDays = -1;

  for (const badge of badges) {
    if (!badge.unlocked) continue;
    if (!isPremium && badge.premium) continue;
    if (badge.daysRequired >= bestDays) {
      bestDays = badge.daysRequired;
      bestId = badge.id;
    }
  }

  return bestId;
}

/** Rough smoke-free days implied by total FP (for synthetic leaderboard players). */
export function estimateSmokeFreeDaysFromXp(xp: number): number {
  return Math.max(0, Math.floor(xp / XP_PER_SMOKE_FREE_DAY));
}

/** Badge tier reached for a given smoke-free day count. */
export function resolveBadgeIdForSmokeFreeDays(
  days: number,
  isPremium = true,
): string {
  let bestId = BADGES[0].id;

  for (const badge of BADGES) {
    if (!isPremium && badge.premium) continue;
    if (days >= badge.daysRequired) {
      bestId = badge.id;
    }
  }

  return bestId;
}

export function resolveBadgeIdForXp(xp: number, isPremium = true): string {
  return resolveBadgeIdForSmokeFreeDays(estimateSmokeFreeDaysFromXp(xp), isPremium);
}

export function getBadgeName(badgeId: string): string {
  return BADGES.find((b) => b.id === badgeId)?.name ?? "Badge";
}

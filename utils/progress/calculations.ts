import { BADGES } from "@/constants/progress/badges";
import type { Badge, BadgeProgress } from "@/types";

export type { BadgeProgress } from "@/types";

export function getBadgeProgress(daysQuit: number, isPremium: boolean): BadgeProgress {
  const visible = BADGES.filter((b) => isPremium || !b.premium);
  let current: Badge | null = null;
  let next: Badge | null = null;

  for (const badge of visible) {
    if (daysQuit >= badge.daysRequired) {
      current = badge;
    } else {
      next = badge;
      break;
    }
  }

  let progress = 1;
  if (next) {
    const start = current?.daysRequired ?? 0;
    const span = Math.max(1, next.daysRequired - start);
    progress = Math.min(1, Math.max(0, (daysQuit - start) / span));
  }

  return { current, next, progress };
}

export function getUnlockedBadges(daysQuit: number): Badge[] {
  return BADGES.filter((b) => daysQuit >= b.daysRequired);
}

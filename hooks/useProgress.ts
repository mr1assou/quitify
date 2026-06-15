import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCravingSummary, useMissionsCompleted, useStats } from "@/hooks/useStats";
import type { ProgressSummary } from "@/types/progress";
import { buildProgressSummary } from "@/utils/progress";

/**
 * Composed Freedom points / rank / badges state for the Achievement tab.
 */
export function useProgress(): ProgressSummary | null {
  const stats = useStats();
  const cravingSummary = useCravingSummary();
  const missionsCompleted = useMissionsCompleted();
  const { state } = useApp();

  return useMemo(() => {
    if (!stats) return null;
    return buildProgressSummary({
      daysQuit: stats.streakDays,
      isPremium: state.isPremium,
      resistedCravings: cravingSummary.resisted,
      completedMissions: missionsCompleted,
      earnedBadgeIds: state.account?.earnedBadgeIds ?? [],
      freedomPoints: state.account?.freedomPoints,
    });
  }, [
    stats,
    state.isPremium,
    state.account?.earnedBadgeIds,
    state.account?.freedomPoints,
    cravingSummary.resisted,
    missionsCompleted,
  ]);
}

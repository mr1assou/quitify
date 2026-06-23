import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCravingSummary, useMissionsCompleted, useStats } from "@/hooks/stats/useStats";
import type { ProgressSummary } from "@/types/progress/progress";
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
    const hasCommittedToQuit = Boolean(state.isOnboarded && state.profile?.quitDate);
    const baseFp = state.account?.freedomPoints ?? 0;
    return buildProgressSummary({
      daysQuit: stats.streakDays,
      isPremium: state.isPremium,
      resistedCravings: cravingSummary.resisted,
      completedMissions: missionsCompleted,
      earnedBadgeIds: state.account?.earnedBadgeIds ?? [],
      freedomPoints: baseFp + state.localFreedomPoints,
      goalsCompleted: state.account?.goalsCompleted ?? 0,
      hasAccount: Boolean(state.account),
      hasCommittedToQuit,
    });
  }, [
    stats,
    state.isPremium,
    state.isOnboarded,
    state.profile?.quitDate,
    state.account,
    state.account?.earnedBadgeIds,
    state.account?.freedomPoints,
    state.localFreedomPoints,
    state.account?.goalsCompleted,
    cravingSummary.resisted,
    missionsCompleted,
  ]);
}

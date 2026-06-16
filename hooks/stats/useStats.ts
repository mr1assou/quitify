import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/shared/useNow";
import { dayKey, lastNDayKeys } from "@/utils/shared/dates";
import { getBadgeProgress, getUnlockedBadges } from "@/utils/progress/calculations";
import { computeStreak } from "@/utils/streak";
import type { DerivedStats } from "@/types";

export function useStats(intervalMs = 60_000): DerivedStats | null {
  const { state } = useApp();
  const now = useNow(intervalMs);
  return useMemo(() => {
    if (!state.profile) return null;
    return computeStreak(state.profile, now);
  }, [state.profile, now]);
}

export function useBadgeProgress() {
  const { state } = useApp();
  const stats = useStats();
  const days = stats?.streakDays ?? 0;
  return useMemo(() => getBadgeProgress(days, state.isPremium), [days, state.isPremium]);
}

export function useUnlockedBadges() {
  const stats = useStats();
  const days = stats?.streakDays ?? 0;
  return useMemo(() => getUnlockedBadges(days), [days]);
}

export function useTodayCravings() {
  const { state } = useApp();
  const today = dayKey();
  return useMemo(
    () => state.cravings.filter((c) => dayKey(c.timestamp) === today),
    [state.cravings, today],
  );
}

export function useCravingSummary() {
  const { state } = useApp();
  return useMemo(() => {
    const total = state.cravings.length;
    const resisted = state.cravings.filter((c) => c.outcome === "resisted").length;
    const today = state.cravings.filter(
      (c) => dayKey(c.timestamp) === dayKey(),
    ).length;
    return {
      total,
      resisted,
      smoked: total - resisted,
      today,
      winRate: total === 0 ? 0 : resisted / total,
    };
  }, [state.cravings]);
}

export function useCravingsLast7Days() {
  const { state } = useApp();
  return useMemo(() => {
    const keys = lastNDayKeys(7);
    const map = new Map<string, { resisted: number; smoked: number }>();
    keys.forEach((k) => map.set(k, { resisted: 0, smoked: 0 }));
    state.cravings.forEach((c) => {
      const k = dayKey(c.timestamp);
      const slot = map.get(k);
      if (!slot) return;
      if (c.outcome === "resisted") slot.resisted += 1;
      else slot.smoked += 1;
    });
    return keys.map((k) => ({ day: k, ...map.get(k)! }));
  }, [state.cravings]);
}

export function useMissionsCompleted() {
  const { state } = useApp();
  return useMemo(
    () => Object.values(state.missionLogs).filter((m) => m.completedAt).length,
    [state.missionLogs],
  );
}

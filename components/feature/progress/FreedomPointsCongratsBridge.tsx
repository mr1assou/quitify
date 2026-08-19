import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import { FreedomPointsCongratsModal } from "@/components/feature/progress/FreedomPointsCongratsModal";
import { useApp } from "@/context/AppContext";
import { useGoals } from "@/context/GoalsContext";
import { useRefreshAccount } from "@/hooks/auth/useRefreshAccount";
import {
  readFpCongratsBaseline,
  writeFpCongratsBaseline,
} from "@/utils/fp/fpCongratsBaseline";
import { MS_DAY } from "@/utils/time/ms";

/** Extra delay past the 24h boundary so the server sees the day as completed. */
const DAY_BOUNDARY_BUFFER_MS = 3_000;

/**
 * Congratulates the user once for every Freedom Points grant.
 *
 * The server is the source of truth: `/auth/me` grants pending smoke-free-day
 * FP and the goals endpoint grants goal bonuses. This bridge re-syncs both on
 * foreground and at each 24h streak boundary while the app stays open, then
 * compares the synced total against the last congratulated total. One popup
 * shows the whole difference (e.g. 3 missed days -> "+6 FP"), never one per day.
 */
export function FreedomPointsCongratsBridge() {
  const { state } = useApp();
  const { refresh: refreshGoals } = useGoals();
  const refreshAccount = useRefreshAccount();

  const [celebrationAmount, setCelebrationAmount] = useState<number | null>(null);
  const [dayTick, setDayTick] = useState(0);

  const userId = state.account?.userId;
  const freedomPoints = state.account?.freedomPoints;
  const streakStart = state.profile?.streakStart;
  const isOnboarded = state.isOnboarded;

  // Goal bonuses are granted when goals state is fetched; day FP when /auth/me runs.
  const syncFreedomPoints = useCallback(async () => {
    try {
      await refreshGoals();
    } catch {
      // goals refresh already degrades gracefully
    }
    try {
      await refreshAccount();
    } catch {
      // offline — next sync will catch up
    }
  }, [refreshGoals, refreshAccount]);

  // Detect newly earned FP whenever the synced total changes.
  useEffect(() => {
    if (userId == null || freedomPoints == null) return;

    let cancelled = false;

    void (async () => {
      const baseline = await readFpCongratsBaseline(userId);
      if (cancelled) return;

      if (baseline == null) {
        // First run on this device — start counting from here, no popup.
        await writeFpCongratsBaseline(userId, freedomPoints);
        return;
      }

      if (freedomPoints > baseline) {
        await writeFpCongratsBaseline(userId, freedomPoints);
        const earned = freedomPoints - baseline;
        if (!cancelled) {
          setCelebrationAmount((current) => (current ?? 0) + earned);
        }
      } else if (freedomPoints < baseline) {
        // Reconciliation or slip undo lowered the total — realign silently.
        await writeFpCongratsBaseline(userId, freedomPoints);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, freedomPoints]);

  // Re-sync when the app returns to the foreground.
  useEffect(() => {
    if (!isOnboarded) return;

    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") void syncFreedomPoints();
    });

    return () => subscription.remove();
  }, [isOnboarded, syncFreedomPoints]);

  // Re-sync at the next 24h streak boundary while the app stays open.
  useEffect(() => {
    if (!isOnboarded || streakStart == null) return;

    const elapsed = Date.now() - streakStart;
    if (elapsed < 0) return;

    const untilNextDay = MS_DAY - (elapsed % MS_DAY) + DAY_BOUNDARY_BUFFER_MS;
    const timer = setTimeout(() => {
      void syncFreedomPoints();
      setDayTick((tick) => tick + 1); // re-arm for the following day
    }, untilNextDay);

    return () => clearTimeout(timer);
  }, [isOnboarded, streakStart, syncFreedomPoints, dayTick]);

  return (
    <FreedomPointsCongratsModal
      visible={celebrationAmount != null && celebrationAmount > 0}
      amount={celebrationAmount ?? 0}
      onClose={() => setCelebrationAmount(null)}
    />
  );
}

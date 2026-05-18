import { useCallback, useRef } from "react";

import { useApp } from "@/context/AppContext";
import type { CravingOutcome } from "@/types";

export function useCravingOutcomeLog() {
  const { logCraving, deleteCraving, updateProfile, state } = useApp();
  const startedAt = useRef(Date.now());
  const streakBeforeRelapse = useRef<number | null>(null);

  const submit = useCallback(
    (outcome: CravingOutcome) => {
      if (outcome === "relapse" && state.profile) {
        streakBeforeRelapse.current = state.profile.streakStart;
      }
      logCraving({
        outcome,
        durationMs: Date.now() - startedAt.current,
      });
    },
    [logCraving, state.profile],
  );

  const undo = useCallback(() => {
    const latest = state.cravings[0];
    if (latest && (latest.outcome === "lapse" || latest.outcome === "relapse")) {
      deleteCraving(latest.id);
    }
    if (streakBeforeRelapse.current != null && state.profile) {
      updateProfile({ streakStart: streakBeforeRelapse.current });
      streakBeforeRelapse.current = null;
    }
  }, [deleteCraving, state.cravings, state.profile, updateProfile]);

  return { submit, undo };
}

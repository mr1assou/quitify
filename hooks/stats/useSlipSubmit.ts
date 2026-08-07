import { useCallback, useRef, useState } from "react";

import { LAPSE_CIGARETTE_COUNT } from "@/constants/stats/slipCigaretteCounts";
import { useApp } from "@/context/AppContext";
import { useGoals } from "@/context/GoalsContext";
import { createSlipEvent, deleteSlipEvent } from "@/services/slip/slipEventsApi";
import type { CravingResultSubmitInput } from "@/types/stats/slipFlow";
import {
  profilePatchFromSlipCreate,
  profilePatchFromSlipUndo,
} from "@/utils/slip/applySlipApiResult";

export function useSlipSubmit() {
  const { logCraving, deleteCraving, updateProfile, state } = useApp();
  const { refresh: refreshGoals } = useGoals();
  const startedAt = useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (input: CravingResultSubmitInput) => {
      if (input.outcome === "resisted") {
        logCraving({
          outcome: "resisted",
          durationMs: Date.now() - startedAt.current,
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const cigarettesCount =
          input.outcome === "lapse" ? LAPSE_CIGARETTE_COUNT : input.cigarettesCount;

        const result = await createSlipEvent({
          outcome: input.outcome,
          cigarettesCount,
        });

        logCraving({
          outcome: input.outcome,
          cigarettesCount,
          durationMs: Date.now() - startedAt.current,
          serverId: result.slipEventId,
        });

        updateProfile(profilePatchFromSlipCreate(result));
        // Backend fails active goals on slip — refresh so Home drops them immediately.
        await refreshGoals();
      } finally {
        setIsSubmitting(false);
      }
    },
    [logCraving, refreshGoals, updateProfile],
  );

  const undo = useCallback(async () => {
    const latest = state.cravings[0];
    if (!latest || (latest.outcome !== "lapse" && latest.outcome !== "relapse")) {
      return;
    }

    if (latest.serverId != null) {
      const result = await deleteSlipEvent(latest.serverId);
      updateProfile(profilePatchFromSlipUndo(result));
      // Undo restores goals failed by that slip — refresh Home goal cards.
      await refreshGoals();
    }

    deleteCraving(latest.id);
  }, [deleteCraving, refreshGoals, state.cravings, updateProfile]);

  return { submit, undo, isSubmitting };
}

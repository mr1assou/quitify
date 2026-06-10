import { useCallback, useRef, useState } from "react";

import { LAPSE_CIGARETTE_COUNT } from "@/constants/slipCigaretteCounts";
import { useApp } from "@/context/AppContext";
import { createSlipEvent, deleteSlipEvent } from "@/services/slip/slipEventsApi";
import type { CravingResultSubmitInput } from "@/types/slipFlow";
import {
  profilePatchFromSlipCreate,
  profilePatchFromSlipUndo,
} from "@/utils/slip/applySlipApiResult";

export function useSlipSubmit() {
  const { logCraving, deleteCraving, updateProfile, state } = useApp();
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [logCraving, updateProfile],
  );

  const undo = useCallback(async () => {
    const latest = state.cravings[0];
    if (!latest || (latest.outcome !== "lapse" && latest.outcome !== "relapse")) {
      return;
    }

    if (latest.serverId != null) {
      const result = await deleteSlipEvent(latest.serverId);
      updateProfile(profilePatchFromSlipUndo(result));
    }

    deleteCraving(latest.id);
  }, [deleteCraving, state.cravings, updateProfile]);

  return { submit, undo, isSubmitting };
}

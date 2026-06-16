import { useCallback, useEffect, useState } from "react";

import type {
  CravingResultInitialStage,
  CravingResultStage,
  CravingResultSubmitInput,
} from "@/types/stats/slipFlow";
import type { SlipSubmitPayload } from "@/types/stats/slip";

type Options = {
  initialStage?: CravingResultInitialStage;
  onSubmit: (input: CravingResultSubmitInput) => void | Promise<void>;
  onUndoSubmit?: () => void | Promise<void>;
  onOutcomeBackChange?: (handler: (() => void) | null) => void;
};

const BACK_STAGES: CravingResultStage[] = ["done-lapse", "done-relapse", "count"];

export function useCravingResultFlow({
  initialStage = "ask",
  onSubmit,
  onUndoSubmit,
  onOutcomeBackChange,
}: Options) {
  const [stage, setStage] = useState<CravingResultStage>(initialStage);

  const handleOutcomeBack = useCallback(() => {
    if (stage === "done-lapse" || stage === "done-relapse") {
      void onUndoSubmit?.();
      setStage("smoked");
      return;
    }
    if (stage === "count") {
      setStage("smoked");
    }
  }, [onUndoSubmit, stage]);

  useEffect(() => {
    const showBack = BACK_STAGES.includes(stage);
    onOutcomeBackChange?.(showBack ? handleOutcomeBack : null);
  }, [stage, handleOutcomeBack, onOutcomeBackChange]);

  useEffect(() => {
    return () => onOutcomeBackChange?.(null);
  }, [onOutcomeBackChange]);

  const submitSlip = useCallback(
    async (payload: SlipSubmitPayload) => {
      await onSubmit(payload);
      setStage(payload.outcome === "lapse" ? "done-lapse" : "done-relapse");
    },
    [onSubmit],
  );

  const submitResisted = useCallback(() => {
    void onSubmit({ outcome: "resisted" });
    setStage("done-resisted");
  }, [onSubmit]);

  return {
    stage,
    setStage,
    submitSlip,
    submitResisted,
  };
}

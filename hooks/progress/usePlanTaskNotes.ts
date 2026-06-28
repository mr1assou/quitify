import { useMemo } from "react";

import { usePlanState } from "@/hooks/progress/usePlanState";
import { collectPlanTaskNotes } from "@/utils/progress/planTaskNotes";

export function usePlanTaskNotes() {
  const { planState, loading, refresh } = usePlanState();

  const notes = useMemo(() => collectPlanTaskNotes(planState), [planState]);

  return {
    notes,
    noteCount: notes.length,
    loading,
    refresh,
  };
}

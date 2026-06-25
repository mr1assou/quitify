import { useCallback } from "react";

import type { QuitStartDateDraft } from "@/types/onboarding/quitStartDate";
import type { QuitStartPreset } from "@/types/onboarding/onboarding";
import {
  quitStartPatchForCustomYmd,
  quitStartPatchForPreset,
} from "@/utils/onboarding/quitPlan";

type Patch = (next: Partial<QuitStartDateDraft>) => void;

/** Quit date draft updates (onboarding + reset journey). */
export function useQuitPlanHandlers(draft: QuitStartDateDraft, patch: Patch) {
  const selectPreset = useCallback(
    (preset: QuitStartPreset) => patch(quitStartPatchForPreset(preset)),
    [patch],
  );

  const updateCustomMonth = useCallback(
    (month: number | undefined) =>
      patch(quitStartPatchForCustomYmd({ month }, draft)),
    [draft, patch],
  );

  const updateCustomDay = useCallback(
    (day: number | undefined) => patch(quitStartPatchForCustomYmd({ day }, draft)),
    [draft, patch],
  );

  const updateCustomYear = useCallback(
    (year: number | undefined) =>
      patch(quitStartPatchForCustomYmd({ year }, draft)),
    [draft, patch],
  );

  return {
    selectPreset,
    updateCustomMonth,
    updateCustomDay,
    updateCustomYear,
  };
}

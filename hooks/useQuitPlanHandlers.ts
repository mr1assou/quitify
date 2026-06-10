import { useCallback } from "react";

import type { OnboardingDraft } from "@/types";
import type { QuitStartPreset } from "@/types/onboarding";
import {
  quitStartPatchForCustomYmd,
  quitStartPatchForPreset,
} from "@/utils/quitPlan";

type Patch = (next: Partial<OnboardingDraft>) => void;

/** Quit date (step 5) draft updates. */
export function useQuitPlanHandlers(draft: OnboardingDraft, patch: Patch) {
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

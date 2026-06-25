import type { QuitStartDateDraft, QuitDateApiPayload } from "@/types/onboarding/quitStartDate";
import { isQuitStartDateComplete } from "@/utils/onboarding/quitPlan";
import { resolveQuitDateForApi } from "@/utils/onboarding/resolveQuitDateForApi";

export { isQuitStartDateComplete };

/** Maps draft → API body (`Now` / `Custom` + ISO instant). */
export function resolveQuitDatePayload(
  draft: QuitStartDateDraft,
  syncedAt = Date.now(),
): QuitDateApiPayload | null {
  if (!isQuitStartDateComplete(draft)) return null;

  const quitDatePreset = draft.quitStartPreset === "now" ? "Now" : "Custom";
  const quitDate = resolveQuitDateForApi(draft, syncedAt);

  return quitDate ? { quitDatePreset, quitDate } : { quitDatePreset };
}

export function initialQuitStartDateDraft(now = Date.now()): QuitStartDateDraft {
  return {
    quitStartPreset: "now",
    startTimestamp: now,
  };
}

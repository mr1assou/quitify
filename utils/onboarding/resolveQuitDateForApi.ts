import type { OnboardingDraft } from "@/types";

/**
 * UTC quit instant sent to the API.
 * - `now` preset → exact UTC moment at sync (not local midnight, not step-5 pick time)
 * - `custom` preset → local midnight of the chosen calendar day as ISO UTC
 */
export function resolveQuitDateForApi(
  draft: OnboardingDraft,
  syncedAt = Date.now(),
): string | undefined {
  if (draft.quitStartPreset === "now") {
    return new Date(syncedAt).toISOString();
  }

  if (draft.quitStartPreset === "custom" && Number.isFinite(draft.startTimestamp)) {
    return new Date(draft.startTimestamp).toISOString();
  }

  return undefined;
}

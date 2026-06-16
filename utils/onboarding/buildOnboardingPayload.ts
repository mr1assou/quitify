import type { OnboardingDraft } from "@/types";
import type { OnboardingPayload } from "@/types/onboarding/onboardingPayload";

import { resolveOnboardingPayloadText } from "./resolveOnboardingPayloadText";

/** Builds the onboarding `payload` from the draft (`syncedAt` = server save instant). */
export function buildOnboardingPayload(
  draft: OnboardingDraft,
  syncedAt = Date.now(),
): OnboardingPayload {
  return resolveOnboardingPayloadText(draft, syncedAt);
}

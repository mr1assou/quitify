import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";
import type { QuitDateApiPayload } from "@/types/onboarding/quitStartDate";

export async function resetJourneyOnServer(
  quitDate: QuitDateApiPayload,
): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/reset-journey", {
    method: "POST",
    body: JSON.stringify(quitDate),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Reset failed (${res.status})`);
  }

  return res.json() as Promise<AuthMeResponse>;
}

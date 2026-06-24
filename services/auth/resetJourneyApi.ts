import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";

export async function resetJourneyOnServer(): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/reset-journey", {
    method: "POST",
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Reset failed (${res.status})`);
  }

  return res.json() as Promise<AuthMeResponse>;
}

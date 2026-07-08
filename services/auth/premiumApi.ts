import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";

export async function updatePremiumOnServer(isPremium: boolean): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/premium", {
    method: "PATCH",
    body: JSON.stringify({ isPremium }),
  });

  if (!res.ok) {
    throw new Error("Could not update premium status");
  }

  return res.json() as Promise<AuthMeResponse>;
}


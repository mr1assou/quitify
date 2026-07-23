import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";

export async function updatePremiumOnServer(
  isPremium: boolean,
  revenueCatOriginalAppUserId?: string | null,
): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/premium", {
    method: "PATCH",
    body: JSON.stringify({
      isPremium,
      ...(isPremium && revenueCatOriginalAppUserId
        ? { revenueCatOriginalAppUserId }
        : {}),
    }),
  });

  if (!res.ok) {
    let message = "Could not update premium status";
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(" ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<AuthMeResponse>;
}

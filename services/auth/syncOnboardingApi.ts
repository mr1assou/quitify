import { API_URL } from "@/config/api";
import type { OnboardingPayload } from "@/types/onboardingPayload";
import { getAccessToken } from "@/utils/authStorage";

export async function syncOnboardingToBackend(
  payload: OnboardingPayload,
): Promise<void> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/me/onboarding`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}`);
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message =
      typeof body?.message === "string"
        ? body.message
        : Array.isArray(body?.message)
          ? body.message.join(", ")
          : "Could not save onboarding";
    throw new Error(message);
  }
}

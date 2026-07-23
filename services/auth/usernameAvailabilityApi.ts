import { API_URL } from "@/config/api";
import { normalizeOnboardingUsername } from "@/constants/onboarding/onboardingUsername";

export type UsernameAvailabilityResponse = {
  available: boolean;
  username: string;
};

export async function checkUsernameAvailable(
  username: string,
  excludeUserId?: number | null,
): Promise<UsernameAvailabilityResponse> {
  const normalized = normalizeOnboardingUsername(username);
  if (!normalized) {
    return { available: false, username: "" };
  }

  const params = new URLSearchParams({ username: normalized });
  if (excludeUserId != null) {
    params.set("excludeUserId", String(excludeUserId));
  }

  try {
    const res = await fetch(`${API_URL}/auth/username/available?${params}`, {
      cache: "no-store",
      headers: {
        "ngrok-skip-browser-warning": "1",
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      throw new Error(`Could not check username (${res.status})`);
    }

    return (await res.json()) as UsernameAvailabilityResponse;
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}`);
  }
}

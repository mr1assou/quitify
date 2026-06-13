import { API_URL } from "@/config/api";

/** Profile fields from `GET /auth/me` — source of truth for the mobile app. */
export type AuthMeResponse = {
  email: string;
  name?: string;
  hasCompletedOnboarding: boolean;
  sex?: string;
  country?: string;
  countryFlag?: string;
  currency?: string;
  quitDatePreset?: string;
  /** UTC ISO-8601 quit instant. */
  quitDate?: string;
  streakStart?: string;
  cigarettesPerDay?: number;
  cigarettesPerPack?: number;
  packPrice?: string;
  imageUrl?: string;
  timezone?: string;
  slipCigarettesTotal?: number;
  currentAttemptNumber?: number;
};

export async function fetchAuthMe(accessToken: string): Promise<AuthMeResponse> {
  const res = await fetch(`${API_URL}/auth/me`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "1",
      "Cache-Control": "no-cache",
    },
  });

  if (!res.ok || res.status === 304) {
    throw new Error("Session expired");
  }

  return res.json() as Promise<AuthMeResponse>;
}

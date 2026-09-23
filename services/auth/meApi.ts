import { API_URL } from "@/config/api";
import type { UserRole } from "@/constants/auth/userRoles";

/** Profile fields from `GET /auth/me` — source of truth for the mobile app. */
export type AuthMeResponse = {
  userId: number;
  email: string;
  name?: string;
  hasCompletedOnboarding: boolean;
  isPremium?: boolean;
  role?: UserRole;
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
  motivationCardIndex?: number;
  tipsCardIndex?: number;
  savedTipCardIds?: string[];
  savedMotivationCardIds?: string[];
  slipCigarettesTotal?: number;
  currentAttemptNumber?: number;
  freedomPoints?: number;
  goalsCompleted?: number;
  earnedBadgeIds?: string[];
  economicsSegments?: {
    effectiveFrom: string;
    cigarettesPerDay: number;
    cigarettesPerPack: number;
    packPrice?: string;
  }[];
};

/** HTTP failure from `/auth/me` (or similar). */
export class AuthHttpError extends Error {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Auth request failed (${status})`);
    this.name = "AuthHttpError";
    this.status = status;
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

export class AuthNetworkError extends Error {
  constructor(message = "Cannot reach the auth server") {
    super(message);
    this.name = "AuthNetworkError";
  }
}

export function isAuthHttpError(error: unknown): error is AuthHttpError {
  return error instanceof AuthHttpError;
}

export function isAuthNetworkError(error: unknown): error is AuthNetworkError {
  return error instanceof AuthNetworkError;
}

export async function fetchAuthMe(accessToken: string): Promise<AuthMeResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/me`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "1",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    throw new AuthNetworkError();
  }

  if (!res.ok || res.status === 304) {
    throw new AuthHttpError(res.status === 304 ? 401 : res.status, "Session expired");
  }

  return res.json() as Promise<AuthMeResponse>;
}

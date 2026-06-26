import { API_URL } from "@/config/api";
import type { GoogleAuthResponse } from "@/services/auth/types";

function readErrorMessage(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    (typeof body.message === "string" || Array.isArray(body.message))
  ) {
    return Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;
  }
  return fallback;
}

async function fetchJson<T>(
  path: string,
): Promise<{ ok: boolean; body: T | null }> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "ngrok-skip-browser-warning": "1" },
    });
  } catch {
    throw new Error(
      `Cannot reach the backend at ${API_URL}. ` +
        `Ensure npm run start:dev is running and your phone is on the same Wi‑Fi.`,
    );
  }

  const raw = await res.text();
  let body: T | null = null;
  try {
    body = raw ? (JSON.parse(raw) as T) : null;
  } catch {
  }

  if (!res.ok && body == null) {
    throw new Error(
      `Backend error (HTTP ${res.status}). Check npm run start:dev at ${API_URL}.`,
    );
  }

  return { ok: res.ok, body };
}

export async function getGoogleAuthUrl(returnUrl: string): Promise<string> {
  const params = new URLSearchParams({ returnUrl });
  const { ok, body } = await fetchJson<{ url?: string }>(
    `/auth/google/url?${params.toString()}`,
  );

  if (!ok || !body?.url) {
    throw new Error(readErrorMessage(body, "Could not start Google sign-in"));
  }

  return body.url;
}

export function parseGoogleAuthRedirect(
  redirectUrl: string,
): GoogleAuthResponse {
  const query = redirectUrl.includes("?")
    ? redirectUrl.slice(redirectUrl.indexOf("?") + 1)
    : "";
  const params = new URLSearchParams(query);

  const error = params.get("error");
  if (error) {
    throw new Error(error);
  }

  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const email = params.get("email");

  if (!accessToken || !refreshToken || !email) {
    throw new Error("Google sign-in did not return auth tokens");
  }

  return {
    accessToken,
    refreshToken,
    email,
    isNewUser: params.get("isNewUser") === "1",
  };
}

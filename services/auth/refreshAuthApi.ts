import { API_URL } from "@/config/api";

import { AuthHttpError, AuthNetworkError } from "./meApi";

export type RefreshAuthResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Exchanges a refresh JWT for a new access (+ refresh) pair.
 * Sends the token in both Authorization and body so mobile works without cookies.
 */
export async function refreshAuthTokens(
  refreshToken: string,
): Promise<RefreshAuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
        "ngrok-skip-browser-warning": "1",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    throw new AuthNetworkError();
  }

  if (!res.ok) {
    throw new AuthHttpError(res.status, "Could not refresh session");
  }

  const body = (await res.json()) as {
    accessToken?: string;
    refreshToken?: string;
  };

  if (typeof body.accessToken !== "string" || !body.accessToken) {
    throw new AuthHttpError(500, "Invalid refresh response");
  }

  // Backend may rotate refresh; fall back to the one we already hold.
  return {
    accessToken: body.accessToken,
    refreshToken:
      typeof body.refreshToken === "string" && body.refreshToken
        ? body.refreshToken
        : refreshToken,
  };
}

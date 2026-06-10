import { API_URL } from "@/config/api";

/** Invalidates refresh token on the server (best-effort). */
export async function fetchLogout(accessToken: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "1",
    },
  });
  if (!res.ok) {
    throw new Error(`Logout failed (${res.status})`);
  }
}

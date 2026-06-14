import { API_URL } from "@/config/api";

/** Marks the user offline on the server (best-effort). */
export async function reportPresenceOffline(accessToken: string): Promise<void> {
  const res = await fetch(`${API_URL}/presence/offline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "1",
    },
  });
  if (!res.ok) {
    throw new Error(`Presence offline failed (${res.status})`);
  }
}

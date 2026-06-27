import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";

export async function updateUsernameOnServer(username: string): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/username", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Could not save username (${res.status})`);
  }

  return res.json() as Promise<AuthMeResponse>;
}

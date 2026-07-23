import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";

export async function updateUsernameOnServer(username: string): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/username", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    let message = "";
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(" ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      // body already consumed or not JSON
    }
    throw new Error(message || `Could not save username (${res.status})`);
  }

  return res.json() as Promise<AuthMeResponse>;
}

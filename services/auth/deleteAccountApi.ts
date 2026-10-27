import { authenticatedFetch } from "@/services/api/authenticatedFetch";

/** Permanently deletes the signed-in account on the server. */
export async function deleteAccountOnServer(): Promise<void> {
  const res = await authenticatedFetch("/auth/me", { method: "DELETE" });

  if (!res.ok) {
    let message = "";
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(" ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      // Response was not JSON.
    }
    throw new Error(message || `Could not delete account (${res.status})`);
  }
}

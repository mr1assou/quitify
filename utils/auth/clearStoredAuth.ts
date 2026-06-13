import { fetchLogout } from "@/services/auth";
import { disconnectPresenceSocket } from "@/services/realtime/presenceSocket";
import { clearAuthTokens, getAccessToken } from "@/utils/authStorage";
import { clearAppSession } from "@/utils/sessionStorage";

/** Clears tokens, persisted session, and invalidates the server refresh token. */
export async function clearStoredAuth(): Promise<void> {
  disconnectPresenceSocket();

  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      await fetchLogout(accessToken);
    } catch {
      // Local sign-out still proceeds if the API is unreachable.
    }
  }
  await clearAuthTokens();
  await clearAppSession();
}

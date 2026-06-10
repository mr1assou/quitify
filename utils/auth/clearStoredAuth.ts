import { fetchLogout } from "@/services/auth";
import { clearAuthTokens, getAccessToken } from "@/utils/authStorage";
import { clearAppSession } from "@/utils/sessionStorage";

/** Clears tokens, persisted session, and invalidates the server refresh token. */
export async function clearStoredAuth(): Promise<void> {
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

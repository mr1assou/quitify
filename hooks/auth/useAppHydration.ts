import { useEffect, useState } from "react";

import { loadUserSessionFromApi } from "@/services/auth/loadUserSessionFromApi";
import {
  isAuthHttpError,
  isAuthNetworkError,
} from "@/services/auth/meApi";
import { refreshAuthTokens } from "@/services/auth/refreshAuthApi";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "@/utils/auth/authStorage";
import {
  clearAppSession,
  loadAppSession,
  saveAppSession,
  type PersistedAppSession,
} from "@/utils/auth/sessionStorage";
import type { UserAccount, UserProfile } from "@/types";

export type HydrationPayload = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  account: UserAccount | null;
};

const emptySession: HydrationPayload = {
  isOnboarded: false,
  profile: null,
  account: null,
};

function fromCache(cached: PersistedAppSession | null): HydrationPayload {
  if (!cached?.account) return emptySession;
  return {
    isOnboarded: cached.isOnboarded,
    profile: cached.profile,
    account: cached.account,
  };
}

type RefreshAttempt =
  | { status: "ok"; accessToken: string }
  | { status: "unauthorized" }
  | { status: "unavailable" };

async function tryRefreshAccessToken(): Promise<RefreshAttempt> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return { status: "unauthorized" };

  try {
    const next = await refreshAuthTokens(refreshToken);
    await saveAuthTokens(next.accessToken, next.refreshToken);
    return { status: "ok", accessToken: next.accessToken };
  } catch (error) {
    if (isAuthHttpError(error) && error.isUnauthorized) {
      return { status: "unauthorized" };
    }
    // Network / 5xx — keep existing tokens on disk.
    return { status: "unavailable" };
  }
}

async function clearLocalAuth(): Promise<void> {
  await clearAuthTokens();
  await clearAppSession();
}

/**
 * Restores the signed-in session on cold start.
 *
 * - Network / server errors: keep tokens and restore from the local session cache.
 * - Real auth rejection (401/403): try refresh once; clear tokens only if refresh is also rejected.
 */
export function useAppHydration(
  onRestore: (payload: HydrationPayload) => void,
): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const accessToken = await getAccessToken();
      const cached = await loadAppSession();
      let payload: HydrationPayload = emptySession;

      if (!accessToken) {
        await clearAppSession();
      } else {
        try {
          payload = await loadUserSessionFromApi(accessToken);
          await saveAppSession(payload);
        } catch (error) {
          const needsRefresh =
            isAuthHttpError(error) && error.isUnauthorized;

          if (needsRefresh) {
            const refresh = await tryRefreshAccessToken();

            if (refresh.status === "ok") {
              try {
                payload = await loadUserSessionFromApi(refresh.accessToken);
                await saveAppSession(payload);
              } catch (retryError) {
                if (isAuthHttpError(retryError) && retryError.isUnauthorized) {
                  await clearLocalAuth();
                  payload = emptySession;
                } else {
                  payload = fromCache(cached);
                }
              }
            } else if (refresh.status === "unavailable") {
              // Could not reach refresh — stay signed in from cache.
              payload = fromCache(cached);
            } else {
              await clearLocalAuth();
              payload = emptySession;
            }
          } else if (isAuthNetworkError(error) || isAuthHttpError(error)) {
            // Offline, timeout, 5xx — never wipe a valid login.
            payload = fromCache(cached);
          } else {
            // Unexpected error — keep tokens, prefer cache.
            payload = fromCache(cached);
          }
        }
      }

      if (!cancelled) {
        onRestore(payload);
        setIsHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onRestore]);

  return isHydrated;
}

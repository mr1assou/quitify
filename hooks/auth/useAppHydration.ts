import { useEffect, useState } from "react";

import { loadUserSessionFromApi } from "@/services/auth/loadUserSessionFromApi";
import { clearAuthTokens, getAccessToken } from "@/utils/auth/authStorage";
import { clearAppSession } from "@/utils/auth/sessionStorage";
import type { UserAccount, UserProfile } from "@/types";

export type HydrationPayload = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  account: UserAccount | null;
};

/** Hydrates app state from the API when a token exists (no local profile cache). */
export function useAppHydration(
  onRestore: (payload: HydrationPayload) => void,
): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await clearAppSession();

      const accessToken = await getAccessToken();
      let payload: HydrationPayload = {
        isOnboarded: false,
        profile: null,
        account: null,
      };

      if (accessToken) {
        try {
          payload = await loadUserSessionFromApi(accessToken);
        } catch {
          await clearAuthTokens();
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

import { useCallback, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { loadUserSessionFromApi } from "@/services/auth/loadUserSessionFromApi";
import { getAccessToken } from "@/utils/auth/authStorage";
import { saveAppSession } from "@/utils/auth/sessionStorage";

/** Re-fetches `/auth/me` so FP + earned badges stay in sync with the server. */
export function useRefreshAccount() {
  const { state, setAccount } = useApp();
  const accountRef = useRef(state.account);
  accountRef.current = state.account;
  const onboardedRef = useRef(state.isOnboarded);
  onboardedRef.current = state.isOnboarded;
  const profileRef = useRef(state.profile);
  profileRef.current = state.profile;

  return useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      const session = await loadUserSessionFromApi(token);
      if (!session.account) return;

      const previous = accountRef.current;
      const nextAccount = {
        ...previous,
        ...session.account,
        createdAt: previous?.createdAt ?? session.account.createdAt,
      };
      setAccount(nextAccount);
      await saveAppSession({
        isOnboarded: session.isOnboarded || onboardedRef.current,
        profile: session.profile ?? profileRef.current,
        account: nextAccount,
      });
    } catch {
      // Keep the in-memory session if the refresh call fails.
    }
  }, [setAccount]);
}

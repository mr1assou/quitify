import { useCallback, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { loadUserSessionFromApi } from "@/services/auth/loadUserSessionFromApi";
import { getAccessToken } from "@/utils/auth/authStorage";

/** Re-fetches `/auth/me` so FP + earned badges stay in sync with the server. */
export function useRefreshAccount() {
  const { state, setAccount } = useApp();
  const accountRef = useRef(state.account);
  accountRef.current = state.account;

  return useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    const session = await loadUserSessionFromApi(token);
    if (!session.account) return;

    const previous = accountRef.current;
    setAccount({
      ...previous,
      ...session.account,
      createdAt: previous?.createdAt ?? session.account.createdAt,
    });
  }, [setAccount]);
}

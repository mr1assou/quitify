import { useCallback } from "react";

import { useLogout } from "@/hooks/auth/useLogout";
import { deleteAccountOnServer } from "@/services/auth/deleteAccountApi";

/** Deletes the account on the server, then signs the user out locally. */
export function useDeleteAccount() {
  const signOut = useLogout();

  return useCallback(async () => {
    await deleteAccountOnServer();
    await signOut();
  }, [signOut]);
}

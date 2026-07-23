import { useEffect } from "react";

import { hydrateCachedPushTokenStatus } from "@/services/push/pushSettingsCache";

/** Restore last-known push toggle before home/settings render. */
export function usePushSettingsHydration() {
  useEffect(() => {
    void hydrateCachedPushTokenStatus();
  }, []);
}

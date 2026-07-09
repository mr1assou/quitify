import { useCallback } from "react";

import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { safeRouter } from "@/utils/app/safeRouter";

/** Opens paywall when the user is not VIP. Returns true if access is allowed. */
export function usePremiumGate() {
  const isPremium = useIsPremium();

  const requirePremium = useCallback((): boolean => {
    if (isPremium) return true;
    safeRouter.pushStack("/paywall");
    return false;
  }, [isPremium]);

  return { isPremium, requirePremium };
}

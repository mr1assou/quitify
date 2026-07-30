import { useCallback } from "react";

import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { PAYWALL_SOURCE } from "@/constants/analytics/paywall";
import { openPaywall } from "@/utils/analytics/openPaywall";

/** Opens paywall when the user is not VIP. Returns true if access is allowed. */
export function usePremiumGate() {
  const isPremium = useIsPremium();

  const requirePremium = useCallback((): boolean => {
    if (isPremium) return true;
    openPaywall(PAYWALL_SOURCE.premium_gate, "pushStack");
    return false;
  }, [isPremium]);

  return { isPremium, requirePremium };
}

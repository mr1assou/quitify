import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { PAYWALL_SOURCE } from "@/constants/analytics/paywall";
import { openPaywall } from "@/utils/analytics/openPaywall";

/** Sends non-VIP users to the paywall when they land on a VIP-only screen. */
export function usePremiumRouteGuard(active = true) {
  const isPremium = useIsPremium();

  useFocusEffect(
    useCallback(() => {
      if (!active || isPremium) return;
      openPaywall(PAYWALL_SOURCE.premium_gate, "pushStack");
    }, [active, isPremium]),
  );
}

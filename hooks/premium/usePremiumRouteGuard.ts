import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { safeRouter } from "@/utils/app/safeRouter";

/** Sends non-VIP users to the paywall when they land on a VIP-only screen. */
export function usePremiumRouteGuard(active = true) {
  const isPremium = useIsPremium();

  useFocusEffect(
    useCallback(() => {
      if (!active || isPremium) return;
      safeRouter.pushStack("/paywall");
    }, [active, isPremium]),
  );
}

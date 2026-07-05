import { useCallback, useState } from "react";
import { Alert } from "react-native";

import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import {
  purchasePaywallPlan,
  restorePlayPurchases,
  syncPremiumFromPlayStore,
} from "@/services/purchases";
import {
  isPurchaseCancelledError,
  purchaseErrorMessage,
} from "@/utils/purchases/purchaseErrors";

export function usePaywallPurchase() {
  const { setPremium } = useApp();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const purchasePlan = useCallback(
    async (planId: PaywallPlanId): Promise<boolean> => {
      if (purchasing || restoring) return false;

      setPurchasing(true);
      try {
        await purchasePaywallPlan(planId);
        const premium = await syncPremiumFromPlayStore();
        setPremium(premium);
        return premium;
      } catch (error) {
        if (isPurchaseCancelledError(error)) return false;

        Alert.alert(
          "Subscription",
          purchaseErrorMessage(
            error,
            "Could not open Google Play checkout. Try again in a moment.",
          ),
        );
        return false;
      } finally {
        setPurchasing(false);
      }
    },
    [purchasing, restoring, setPremium],
  );

  const restore = useCallback(async (): Promise<boolean> => {
    if (purchasing || restoring) return false;

    setRestoring(true);
    try {
      const premium = await restorePlayPurchases();
      setPremium(premium);

      Alert.alert(
        premium ? "Restored" : "No subscription found",
        premium
          ? "Your premium access is active again."
          : "We could not find an active subscription for this Google account.",
      );
      return premium;
    } catch (error) {
      Alert.alert(
        "Restore failed",
        purchaseErrorMessage(error, "Could not restore purchases."),
      );
      return false;
    } finally {
      setRestoring(false);
    }
  }, [purchasing, restoring, setPremium]);

  return {
    purchasing,
    restoring,
    busy: purchasing || restoring,
    purchasePlan,
    restore,
  };
}

import { useCallback, useState } from "react";
import { Alert } from "react-native";

import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import { persistPremiumStatus } from "@/services/auth/persistPremiumStatus";
import {
  purchasePaywallPlan,
  restoreRevenueCatPurchases,
  syncPremiumFromRevenueCat,
} from "@/services/purchases";
import {
  isPurchaseCancelledError,
  purchaseErrorMessage,
} from "@/utils/purchases/revenueCatErrors";

export function usePaywallPurchase() {
  const { state, setAccount } = useApp();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const purchasePlan = useCallback(
    async (planId: PaywallPlanId): Promise<boolean> => {
      if (purchasing || restoring) return false;

      setPurchasing(true);
      try {
        const entitled = await purchasePaywallPlan(planId);
        if (!entitled) return false;

        return await persistPremiumStatus(true, setAccount, state.account);
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
    [purchasing, restoring, setAccount, state.account],
  );

  const restore = useCallback(async (): Promise<boolean> => {
    if (purchasing || restoring) return false;

    setRestoring(true);
    try {
      const entitled = await restoreRevenueCatPurchases();
      const premium = entitled
        ? await persistPremiumStatus(true, setAccount, state.account)
        : await persistPremiumStatus(false, setAccount, state.account);

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
  }, [purchasing, restoring, setAccount, state.account]);

  const refreshPremium = useCallback(async (): Promise<boolean> => {
    try {
      const entitled = await syncPremiumFromRevenueCat();
      return await persistPremiumStatus(entitled, setAccount, state.account);
    } catch {
      return Boolean(state.account?.isPremium);
    }
  }, [setAccount, state.account]);

  return {
    purchasing,
    restoring,
    busy: purchasing || restoring,
    purchasePlan,
    restore,
    refreshPremium,
  };
}

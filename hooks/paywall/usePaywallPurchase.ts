import { useCallback, useState } from "react";
import { Alert } from "react-native";

import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import { updatePremiumOnServer } from "@/services/auth/premiumApi";
import {
  purchasePaywallPlan,
  restoreRevenueCatPurchases,
  syncPremiumFromRevenueCat,
} from "@/services/purchases";
import {
  isPurchaseCancelledError,
  purchaseErrorMessage,
} from "@/utils/purchases/revenueCatErrors";

async function persistPremiumToDb(
  setAccount: ReturnType<typeof useApp>["setAccount"],
  account: ReturnType<typeof useApp>["state"]["account"],
): Promise<boolean> {
  const me = await updatePremiumOnServer(true);
  if (!account) return Boolean(me.isPremium);

  setAccount({
    ...account,
    isPremium: Boolean(me.isPremium),
  });
  return Boolean(me.isPremium);
}

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

        return await persistPremiumToDb(setAccount, state.account);
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
        ? await persistPremiumToDb(setAccount, state.account)
        : false;

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
      if (!entitled) return false;
      return await persistPremiumToDb(setAccount, state.account);
    } catch {
      return false;
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

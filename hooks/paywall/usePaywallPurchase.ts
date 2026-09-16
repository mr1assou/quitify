import { useCallback, useState } from "react";
import { Alert } from "react-native";

import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import { persistPremiumStatus } from "@/services/auth/persistPremiumStatus";
import {
  getRevenueCatOwnershipIds,
  purchasePaywallPlan,
  restoreRevenueCatPurchases,
  syncPremiumFromRevenueCat,
} from "@/services/purchases";
import {
  isPurchaseCancelledError,
  purchaseErrorMessage,
} from "@/utils/purchases/revenueCatErrors";
import {
  logPaywallPurchaseFail,
  logPaywallPurchaseSuccess,
} from "@/services/analytics/firebaseEvents";

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
        if (!entitled) {
          logPaywallPurchaseFail("normal");
          return false;
        }

        const ownership = await getRevenueCatOwnershipIds();
        const premium = await persistPremiumStatus(
          true,
          setAccount,
          state.account,
          ownership?.originalAppUserId ?? String(state.account?.userId ?? ""),
        );
        if (premium) {
          logPaywallPurchaseSuccess("normal");
        } else {
          logPaywallPurchaseFail("normal");
        }
        return premium;
      } catch (error) {
        if (isPurchaseCancelledError(error)) return false;

        logPaywallPurchaseFail("normal");
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
      const result = await restoreRevenueCatPurchases();

      if (result.status === "other_account") {
        Alert.alert(
          "Subscription belongs to another account",
          "This Google Play purchase is already linked to a different Quitify account. Sign in with that account to use VIP.",
        );
        return false;
      }

      if (result.status === "restored") {
        const premium = await persistPremiumStatus(
          true,
          setAccount,
          state.account,
          result.originalAppUserId,
        );
        Alert.alert(
          premium ? "Restored" : "Could not restore",
          premium
            ? "Your premium access is active again."
            : "This subscription could not be linked to this Quitify account.",
        );
        return premium;
      }

      await persistPremiumStatus(false, setAccount, state.account);
      Alert.alert(
        "No subscription found",
        "We could not find an active subscription for this Quitify account.",
      );
      return false;
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
      const ownership = entitled ? await getRevenueCatOwnershipIds() : null;
      return await persistPremiumStatus(
        entitled,
        setAccount,
        state.account,
        ownership?.originalAppUserId,
      );
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

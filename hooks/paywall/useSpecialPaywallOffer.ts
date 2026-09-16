import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { useApp } from "@/context/AppContext";
import { persistPremiumStatus } from "@/services/auth/persistPremiumStatus";
import {
  getRevenueCatOwnershipIds,
  purchaseSpecialYearlyOffer,
} from "@/services/purchases";
import type { SpecialPaywallOfferDisplay } from "@/types/paywall/specialOffer";
import {
  getCachedSpecialPaywallOffer,
  prefetchSpecialPaywallOffer,
} from "@/utils/paywall/specialOfferCache";
import {
  isPurchaseCancelledError,
  purchaseErrorMessage,
} from "@/utils/purchases/revenueCatErrors";
import {
  logPaywallPurchaseFail,
  logPaywallPurchaseSuccess,
} from "@/services/analytics/firebaseEvents";

export function useSpecialPaywallOffer() {
  const { state, setAccount } = useApp();
  const cached = getCachedSpecialPaywallOffer();
  const [offer, setOffer] = useState<SpecialPaywallOfferDisplay | null>(
    () => (cached !== undefined ? cached : null),
  );
  const [loading, setLoading] = useState(() => cached === undefined);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const existing = getCachedSpecialPaywallOffer();
    if (existing !== undefined) {
      setOffer(existing);
      setLoading(false);
      return;
    }

    setLoading(true);
    void (async () => {
      const next = await prefetchSpecialPaywallOffer();
      if (!cancelled) {
        setOffer(next);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.account?.userId]);

  const purchaseOffer = useCallback(async (): Promise<boolean> => {
    if (purchasing) return false;

    setPurchasing(true);
    try {
      const entitled = await purchaseSpecialYearlyOffer();
      if (!entitled) {
        logPaywallPurchaseFail("special");
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
        logPaywallPurchaseSuccess("special");
      } else {
        logPaywallPurchaseFail("special");
      }
      return premium;
    } catch (error) {
      if (isPurchaseCancelledError(error)) return false;

      logPaywallPurchaseFail("special");
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
  }, [purchasing, setAccount, state.account]);

  return {
    offer,
    loading,
    purchasing,
    purchaseOffer,
  };
}

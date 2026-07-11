import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";
import Purchases, { type CustomerInfo } from "react-native-purchases";

import { useApp } from "@/context/AppContext";
import { persistPremiumStatus } from "@/services/auth/persistPremiumStatus";
import {
  premiumFromCustomerInfo,
  syncPremiumFromRevenueCat,
  syncRevenueCatUser,
  waitForRevenueCatReady,
} from "@/services/purchases/revenueCat";

/** Links RevenueCat to the logged-in user and keeps premium in sync with subscriptions. */
export function useRevenueCatBootstrap() {
  const { state, setAccount, isHydrated } = useApp();
  const userId = state.account?.userId;
  const accountRef = useRef(state.account);
  accountRef.current = state.account;

  const reconcilePremium = useCallback(async (): Promise<void> => {
    const account = accountRef.current;
    if (!account?.userId) return;

    try {
      const entitled = await syncPremiumFromRevenueCat();
      const current = Boolean(account.isPremium);
      if (entitled === current) return;

      await persistPremiumStatus(entitled, setAccount, account);
      if (__DEV__) {
        console.log(`[revenuecat] premium synced ${current} -> ${entitled}`);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[revenuecat] premium sync failed", error);
      }
    }
  }, [setAccount]);

  useEffect(() => {
    if (!isHydrated) return;

    if (userId == null) return;

    void (async () => {
      await syncRevenueCatUser(userId);
      await reconcilePremium();
    })();
  }, [isHydrated, userId, reconcilePremium]);

  useEffect(() => {
    if (!userId) return;

    const onCustomerInfoUpdated = (customerInfo: CustomerInfo) => {
      void (async () => {
        const account = accountRef.current;
        if (!account?.userId) return;

        const entitled = premiumFromCustomerInfo(customerInfo);
        const current = Boolean(account.isPremium);
        if (entitled === current) return;

        await persistPremiumStatus(entitled, setAccount, account);
        if (__DEV__) {
          console.log(`[revenuecat] entitlement update ${current} -> ${entitled}`);
        }
      })();
    };

    Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdated);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdated);
    };
  }, [userId, setAccount]);

  useEffect(() => {
    if (!userId) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;
      void waitForRevenueCatReady().then(reconcilePremium);
    });

    return () => subscription.remove();
  }, [userId, reconcilePremium]);
}

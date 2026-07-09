import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";

import {
  REVENUECAT_ANDROID_API_KEY,
  REVENUECAT_IOS_API_KEY,
} from "@/config/revenuecat";
import { REVENUECAT_PREMIUM_ENTITLEMENT } from "@/constants/paywall/revenueCat";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import {
  getRevenueCatConfigurePromise,
  isRevenueCatConfigured,
  markRevenueCatConfigured,
  setRevenueCatConfigurePromise,
} from "@/services/purchases/revenueCatConfig";

let linkedAppUserId: string | null = null;
let syncChain: Promise<void> = Promise.resolve();
let syncGeneration = 0;

function enqueueRevenueCatSync(task: () => Promise<void>): Promise<void> {
  syncChain = syncChain.then(task, task);
  return syncChain;
}

function isSyncStale(generation: number): boolean {
  return generation !== syncGeneration;
}

async function currentRevenueCatAppUserId(): Promise<string> {
  return Purchases.getAppUserID();
}

/** Links the RevenueCat customer to your DB user id (avoids anonymous RC ids). */
export async function syncRevenueCatUser(userId: number | undefined): Promise<void> {
  const generation = ++syncGeneration;

  return enqueueRevenueCatSync(async () => {
    if (isSyncStale(generation)) return;

    await ensureRevenueCatConfigured();
    if (isSyncStale(generation)) return;
    if (!isRevenueCatConfigured()) return;

    if (userId == null) {
      // Do not call Purchases.logOut() — it creates a new anonymous RC customer on every
      // app logout and clutters the dashboard. The device keeps the last identified user
      // until Purchases.logIn() runs for the next sign-in (same or different account).
      linkedAppUserId = null;
      if (__DEV__ && isRevenueCatConfigured()) {
        try {
          const rcId = await currentRevenueCatAppUserId();
          console.log(
            `[revenuecat] app logged out — RC customer unchanged (${rcId}); no anonymous user created`,
          );
        } catch {
          // ignore
        }
      }
      return;
    }

    const appUserId = String(userId);

    try {
      const rcUserId = await currentRevenueCatAppUserId();
      if (isSyncStale(generation)) return;

      if (linkedAppUserId === appUserId && rcUserId === appUserId) {
        if (__DEV__) {
          console.log(`[revenuecat] already linked as ${appUserId}`);
        }
        return;
      }

      const { customerInfo, created } = await Purchases.logIn(appUserId);
      if (isSyncStale(generation)) return;

      linkedAppUserId = appUserId;
      if (__DEV__) {
        console.log(
          `[revenuecat] linked user ${appUserId} (created=${created}, rcId=${customerInfo.originalAppUserId}, activeId=${await currentRevenueCatAppUserId()})`,
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[revenuecat] logIn failed for user", appUserId, error);
      }
    }
  });
}

function revenueCatApiKey(): string | null {
  return Platform.OS === "ios" ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
}

/** One-time RevenueCat SDK setup. Safe to call multiple times. */
export function ensureRevenueCatConfigured(): Promise<void> {
  const existing = getRevenueCatConfigurePromise();
  if (existing) return existing;

  const apiKey = revenueCatApiKey();
  if (!apiKey) {
    if (__DEV__) {
      console.warn(
        "[revenuecat] Missing API key. Set REVENUECAT_ANDROID_API_KEY in config/revenuecat.ts",
      );
    }
    return Promise.resolve();
  }

  const promise = (async () => {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }
    Purchases.configure({ apiKey });
    markRevenueCatConfigured();
  })();

  setRevenueCatConfigurePromise(promise);
  return promise;
}

export function hasPremiumEntitlement(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[REVENUECAT_PREMIUM_ENTITLEMENT] != null;
}

export function packageForPlan(
  offering: PurchasesOffering | null | undefined,
  planId: PaywallPlanId,
): PurchasesPackage | null {
  if (!offering) return null;

  if (planId === "monthly") {
    return (
      offering.monthly ??
      offering.availablePackages.find((pkg) => pkg.packageType === PACKAGE_TYPE.MONTHLY) ??
      null
    );
  }

  return (
    offering.annual ??
    offering.availablePackages.find((pkg) => pkg.packageType === PACKAGE_TYPE.ANNUAL) ??
    null
  );
}

export async function syncPremiumFromRevenueCat(): Promise<boolean> {
  await ensureRevenueCatConfigured();
  const customerInfo = await Purchases.getCustomerInfo();
  return hasPremiumEntitlement(customerInfo);
}

export async function purchasePaywallPlan(planId: PaywallPlanId): Promise<boolean> {
  await ensureRevenueCatConfigured();
  const offerings = await Purchases.getOfferings();
  const selectedPackage = packageForPlan(offerings.current, planId);

  if (!selectedPackage) {
    throw new Error("This plan is not available yet. Check your RevenueCat offering.");
  }

  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return hasPremiumEntitlement(customerInfo);
}

export async function restoreRevenueCatPurchases(): Promise<boolean> {
  await ensureRevenueCatConfigured();
  const customerInfo = await Purchases.restorePurchases();
  return hasPremiumEntitlement(customerInfo);
}

/** Current offering with localized store prices for the user's country. */
export async function fetchPaywallOffering(): Promise<PurchasesOffering | null> {
  await ensureRevenueCatConfigured();
  if (!isRevenueCatConfigured()) return null;

  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

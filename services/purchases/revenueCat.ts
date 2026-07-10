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

function revenueCatApiKey(): string | null {
  return Platform.OS === "ios" ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
}

function isRevenueCatLinked(): boolean {
  return isRevenueCatConfigured() && linkedAppUserId != null;
}

async function currentRevenueCatAppUserId(): Promise<string> {
  return Purchases.getAppUserID();
}

/**
 * Configure RevenueCat only for a known DB user (never anonymous).
 * Safe to call multiple times; configures once per app session.
 */
export function ensureRevenueCatConfigured(appUserId: number): Promise<void> {
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

  const id = String(appUserId);
  const promise = (async () => {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }
    Purchases.configure({ apiKey, appUserID: id });
    markRevenueCatConfigured();
    linkedAppUserId = id;
    if (__DEV__) {
      console.log(`[revenuecat] configured for user ${id}`);
    }
  })();

  setRevenueCatConfigurePromise(promise);
  return promise;
}

/**
 * Links the RevenueCat customer to your DB user id.
 * Call only on sign-up / log-in. On logout, pass undefined — no RC SDK calls.
 */
export async function syncRevenueCatUser(userId: number | undefined): Promise<void> {
  if (userId == null) {
    syncGeneration++;
    linkedAppUserId = null;
    if (__DEV__) {
      console.log("[revenuecat] app logged out — skipping RC (no new customer)");
    }
    return;
  }

  const generation = ++syncGeneration;
  const appUserId = String(userId);

  return enqueueRevenueCatSync(async () => {
    if (isSyncStale(generation)) return;

    await ensureRevenueCatConfigured(userId);
    if (isSyncStale(generation)) return;
    if (!isRevenueCatConfigured()) return;

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
          `[revenuecat] linked user ${appUserId} (created=${created}, rcId=${customerInfo.originalAppUserId})`,
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[revenuecat] logIn failed for user", appUserId, error);
      }
    }
  });
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
  if (!isRevenueCatLinked()) return false;
  const customerInfo = await Purchases.getCustomerInfo();
  return hasPremiumEntitlement(customerInfo);
}

export async function purchasePaywallPlan(planId: PaywallPlanId): Promise<boolean> {
  if (!isRevenueCatLinked()) {
    throw new Error("Sign in to purchase VIP.");
  }
  const offerings = await Purchases.getOfferings();
  const selectedPackage = packageForPlan(offerings.current, planId);

  if (!selectedPackage) {
    throw new Error("This plan is not available yet. Check your RevenueCat offering.");
  }

  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return hasPremiumEntitlement(customerInfo);
}

export async function restoreRevenueCatPurchases(): Promise<boolean> {
  if (!isRevenueCatLinked()) return false;
  const customerInfo = await Purchases.restorePurchases();
  return hasPremiumEntitlement(customerInfo);
}

/** Current offering with localized store prices (logged-in users only). */
export async function fetchPaywallOffering(): Promise<PurchasesOffering | null> {
  if (!isRevenueCatLinked()) return null;

  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

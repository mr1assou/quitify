import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  PRODUCT_CATEGORY,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  type PurchasesStoreProduct,
  type SubscriptionOption,
} from "react-native-purchases";

import {
  REVENUECAT_ANDROID_API_KEY,
  REVENUECAT_IOS_API_KEY,
} from "@/config/revenuecat";
import { REVENUECAT_PREMIUM_ENTITLEMENT } from "@/constants/paywall/revenueCat";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import {
  PLAY_MONTHLY_TRIAL_OFFER_ID,
  PLAY_YEARLY_SPECIAL_OFFER_IDS,
  PLAY_YEARLY_TRIAL_OFFER_ID,
} from "@/constants/paywall/purchases";
import type { SpecialPaywallOfferDisplay } from "@/types/paywall/specialOffer";
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

/**
 * True only when Premium is active AND the store purchase belongs to this Quitify user.
 * Stops Account B from restoring Account A's Google Play subscription.
 */
export function isPremiumOwnedByAppUser(
  customerInfo: CustomerInfo,
  appUserId: string,
): boolean {
  if (!hasPremiumEntitlement(customerInfo)) return false;
  return customerInfo.originalAppUserId === appUserId;
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
  await waitForRevenueCatReady();
  if (!isRevenueCatLinked() || !linkedAppUserId) return false;
  const customerInfo = await Purchases.getCustomerInfo();
  return isPremiumOwnedByAppUser(customerInfo, linkedAppUserId);
}

/** Wait until configure + logIn chain finished. */
export async function waitForRevenueCatReady(): Promise<void> {
  const configurePromise = getRevenueCatConfigurePromise();
  if (configurePromise) await configurePromise;
  await syncChain;
}

export function premiumFromCustomerInfo(
  customerInfo: CustomerInfo,
  appUserId?: string | null,
): boolean {
  const ownerId = appUserId ?? linkedAppUserId;
  if (!ownerId) return false;
  return isPremiumOwnedByAppUser(customerInfo, ownerId);
}

export function revenueCatOriginalAppUserIdFromInfo(
  customerInfo: CustomerInfo,
): string {
  return customerInfo.originalAppUserId;
}

function isProductAlreadyPurchasedError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  return (error as { code?: string }).code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR;
}

function logSubscriptionOptions(context: string, product: PurchasesStoreProduct): void {
  if (!__DEV__) return;

  const options = product.subscriptionOptions ?? [];
  console.log(`[revenuecat] ${context} ${product.identifier}`, {
    defaultOptionId: product.defaultOption?.id ?? null,
    options: options.map((option) => ({
      id: option.id,
      hasFreePhase: option.freePhase != null,
      phases: option.pricingPhases.map((phase) => ({
        price: phase.price.formatted,
        period: phase.billingPeriod.iso8601,
      })),
    })),
  });
}

async function freshStoreProduct(productId: string): Promise<PurchasesStoreProduct | null> {
  const products = await Purchases.getProducts([productId], PRODUCT_CATEGORY.SUBSCRIPTION);
  return products[0] ?? null;
}

function isTrialSubscriptionOption(option: SubscriptionOption): boolean {
  if (option.freePhase != null) return true;
  if (option.id.includes(PLAY_YEARLY_TRIAL_OFFER_ID)) return true;
  if (option.id.includes(PLAY_MONTHLY_TRIAL_OFFER_ID)) return true;
  return option.pricingPhases.some((phase) => phase.price.amountMicros === 0);
}

function trialSubscriptionOption(
  product: PurchasesStoreProduct,
  offerId: string,
): SubscriptionOption | null {
  if (Platform.OS !== "android") return null;

  const options = product.subscriptionOptions ?? [];
  if (!options.length) return null;

  const trialOfferSuffix = `:${offerId}`;
  const byOfferId = options.find(
    (option) => option.id.endsWith(trialOfferSuffix) && isTrialSubscriptionOption(option),
  );
  if (byOfferId) return byOfferId;

  return options.find((option) => isTrialSubscriptionOption(option)) ?? null;
}

function yearlyTrialSubscriptionOption(
  product: PurchasesStoreProduct,
): SubscriptionOption | null {
  return trialSubscriptionOption(product, PLAY_YEARLY_TRIAL_OFFER_ID);
}

function monthlyTrialSubscriptionOption(
  product: PurchasesStoreProduct,
): SubscriptionOption | null {
  return trialSubscriptionOption(product, PLAY_MONTHLY_TRIAL_OFFER_ID);
}

async function resolveStoreProduct(
  selectedPackage: PurchasesPackage,
  context: string,
): Promise<PurchasesStoreProduct> {
  const cachedProduct = selectedPackage.product;
  const freshProduct = await freshStoreProduct(cachedProduct.identifier);
  const product = freshProduct ?? cachedProduct;

  logSubscriptionOptions(context, product);
  return product;
}

/** New Google accounts get the trial offer; returning users pay full price immediately. */
async function purchaseYearlyPlan(
  selectedPackage: PurchasesPackage,
  product: PurchasesStoreProduct,
): Promise<CustomerInfo> {
  const trialOption = yearlyTrialSubscriptionOption(product);

  if (trialOption) {
    if (__DEV__) {
      console.log(`[revenuecat] purchasing yearly trial option ${trialOption.id}`);
    }
    const { customerInfo } = await Purchases.purchaseSubscriptionOption(trialOption);
    return customerInfo;
  }

  if (__DEV__) {
    console.log("[revenuecat] trial not eligible — purchasing yearly at full price");
  }
  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return customerInfo;
}

/** New Google accounts get the 3-day monthly trial; returning users pay full price. */
async function purchaseMonthlyPlan(
  selectedPackage: PurchasesPackage,
  product: PurchasesStoreProduct,
): Promise<CustomerInfo> {
  const trialOption = monthlyTrialSubscriptionOption(product);

  if (trialOption) {
    if (__DEV__) {
      console.log(`[revenuecat] purchasing monthly trial option ${trialOption.id}`);
    }
    const { customerInfo } = await Purchases.purchaseSubscriptionOption(trialOption);
    return customerInfo;
  }

  if (__DEV__) {
    console.log("[revenuecat] monthly trial not eligible — purchasing at full price");
  }
  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return customerInfo;
}

async function purchaseSelectedPackage(
  selectedPackage: PurchasesPackage,
  planId: PaywallPlanId,
): Promise<CustomerInfo> {
  if (planId === "yearly") {
    const product = await resolveStoreProduct(selectedPackage, "yearly product options");
    return purchaseYearlyPlan(selectedPackage, product);
  }

  if (planId === "monthly") {
    const product = await resolveStoreProduct(selectedPackage, "monthly product options");
    return purchaseMonthlyPlan(selectedPackage, product);
  }

  if (__DEV__) {
    console.log(`[revenuecat] purchasing ${planId} package ${selectedPackage.product.identifier}`);
  }
  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return customerInfo;
}

function yearlySpecialSubscriptionOption(
  product: PurchasesStoreProduct,
): SubscriptionOption | null {
  if (Platform.OS !== "android") return null;

  const options = product.subscriptionOptions ?? [];
  if (!options.length) return null;

  for (const offerId of PLAY_YEARLY_SPECIAL_OFFER_IDS) {
    const suffix = `:${offerId}`;
    const match = options.find((option) => option.id.endsWith(suffix));
    if (match) return match;
  }

  return null;
}

function formatMonthlyFromYearlyMicros(amountMicros: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountMicros / 1_000_000 / 12);
  } catch {
    return `${(amountMicros / 1_000_000 / 12).toFixed(2)}`;
  }
}

function buildSpecialOfferDisplay(
  product: PurchasesStoreProduct,
  option: SubscriptionOption,
): SpecialPaywallOfferDisplay {
  const paidPhases = option.pricingPhases.filter((phase) => phase.price.amountMicros > 0);
  const discountedPhase = option.introPhase ?? paidPhases[0] ?? null;
  const fullPhase =
    option.fullPricePhase ??
    paidPhases.find(
      (phase) =>
        discountedPhase == null ||
        phase.price.amountMicros !== discountedPhase.price.amountMicros,
    ) ??
    null;

  const discountedYearlyPrice =
    discountedPhase?.price.formatted ?? product.priceString;
  const originalYearlyPrice =
    fullPhase?.price.formatted ?? product.priceString;

  const discountedMicros = discountedPhase?.price.amountMicros ?? 0;
  const originalMicros =
    fullPhase?.price.amountMicros ??
    (typeof product.price === "number"
      ? Math.round(product.price * 1_000_000)
      : discountedMicros);
  const currencyCode =
    discountedPhase?.price.currencyCode ??
    fullPhase?.price.currencyCode ??
    product.currencyCode;

  const discountPercent =
    originalMicros > 0 && discountedMicros > 0 && discountedMicros < originalMicros
      ? Math.round(((originalMicros - discountedMicros) / originalMicros) * 100)
      : 0;

  const discountedMonthly = discountedPhase
    ? formatMonthlyFromYearlyMicros(discountedPhase.price.amountMicros, currencyCode)
    : (product.pricePerMonthString ?? discountedYearlyPrice);
  const originalMonthly = fullPhase
    ? formatMonthlyFromYearlyMicros(fullPhase.price.amountMicros, currencyCode)
    : (product.pricePerMonthString ?? originalYearlyPrice);

  return {
    plan: {
      id: "yearly",
      label: "Yearly plan",
      rightPrice: discountedMonthly,
      rightPeriod: "/mo",
      subPrice: discountedYearlyPrice,
      subPeriod: "/year",
      originalRightPrice:
        discountPercent > 0 ? originalMonthly : null,
      originalSubPrice: discountPercent > 0 ? originalYearlyPrice : null,
      trial: option.freePhase != null ? "7 days free trial" : null,
      recommended: true,
    },
    discountedYearlyPrice,
    originalYearlyPrice,
    discountPercent,
    hasFreeTrial: option.freePhase != null,
  };
}

async function resolveYearlyPackage(): Promise<PurchasesPackage> {
  if (!isRevenueCatLinked() || !linkedAppUserId) {
    throw new Error("Sign in to purchase VIP.");
  }
  const offerings = await Purchases.getOfferings();
  const selectedPackage = packageForPlan(offerings.current, "yearly");
  if (!selectedPackage) {
    throw new Error("This plan is not available yet. Check your RevenueCat offering.");
  }
  return selectedPackage;
}

/**
 * Localized special-offer prices from Play (`discount-29off` or win-back).
 * Returns null when the user is not eligible — do not fall back to base paywall prices.
 */
export async function fetchSpecialPaywallOffer(): Promise<SpecialPaywallOfferDisplay | null> {
  await waitForRevenueCatReady();
  if (!isRevenueCatLinked()) return null;

  try {
    const selectedPackage = await resolveYearlyPackage();
    const product = await resolveStoreProduct(selectedPackage, "yearly product options");
    const specialOption = yearlySpecialSubscriptionOption(product);

    if (!specialOption) {
      if (__DEV__) {
        console.warn(
          "[revenuecat] special/win-back offers not available for this account",
        );
      }
      return null;
    }

    if (__DEV__) {
      console.log(`[revenuecat] special offer available: ${specialOption.id}`);
    }
    return buildSpecialOfferDisplay(product, specialOption);
  } catch (error) {
    if (__DEV__) {
      console.warn("[revenuecat] fetchSpecialPaywallOffer failed", error);
    }
    return null;
  }
}

/** Purchase special/win-back yearly offer when available; otherwise standard yearly. */
export async function purchaseSpecialYearlyOffer(): Promise<boolean> {
  if (!isRevenueCatLinked() || !linkedAppUserId) {
    throw new Error("Sign in to purchase VIP.");
  }

  const selectedPackage = await resolveYearlyPackage();
  const product = await resolveStoreProduct(selectedPackage, "yearly product options");
  const specialOption = yearlySpecialSubscriptionOption(product);

  try {
    if (specialOption) {
      if (__DEV__) {
        console.log(`[revenuecat] purchasing special yearly option ${specialOption.id}`);
      }
      const { customerInfo } = await Purchases.purchaseSubscriptionOption(specialOption);
      return isPremiumOwnedByAppUser(customerInfo, linkedAppUserId);
    }

    if (__DEV__) {
      console.warn(
        "[revenuecat] special offer unavailable — falling back to standard yearly purchase",
      );
    }
    const customerInfo = await purchaseYearlyPlan(selectedPackage, product);
    return isPremiumOwnedByAppUser(customerInfo, linkedAppUserId);
  } catch (error) {
    if (isProductAlreadyPurchasedError(error)) {
      const customerInfo = await Purchases.restorePurchases();
      return isPremiumOwnedByAppUser(customerInfo, linkedAppUserId);
    }
    throw error;
  }
}

export async function purchasePaywallPlan(planId: PaywallPlanId): Promise<boolean> {
  if (!isRevenueCatLinked() || !linkedAppUserId) {
    throw new Error("Sign in to purchase VIP.");
  }
  const offerings = await Purchases.getOfferings();
  const selectedPackage = packageForPlan(offerings.current, planId);

  if (!selectedPackage) {
    throw new Error("This plan is not available yet. Check your RevenueCat offering.");
  }

  try {
    const customerInfo = await purchaseSelectedPackage(selectedPackage, planId);
    return isPremiumOwnedByAppUser(customerInfo, linkedAppUserId);
  } catch (error) {
    if (isProductAlreadyPurchasedError(error)) {
      const customerInfo = await Purchases.restorePurchases();
      return isPremiumOwnedByAppUser(customerInfo, linkedAppUserId);
    }
    throw error;
  }
}

export type RestorePurchasesResult =
  | { status: "restored"; originalAppUserId: string }
  | { status: "none" }
  | { status: "other_account" };

export async function restoreRevenueCatPurchases(): Promise<RestorePurchasesResult> {
  if (!isRevenueCatLinked() || !linkedAppUserId) return { status: "none" };

  const customerInfo = await Purchases.restorePurchases();
  if (!hasPremiumEntitlement(customerInfo)) {
    return { status: "none" };
  }

  if (!isPremiumOwnedByAppUser(customerInfo, linkedAppUserId)) {
    return { status: "other_account" };
  }

  return {
    status: "restored",
    originalAppUserId: customerInfo.originalAppUserId,
  };
}

/** Current offering with localized store prices (logged-in users only). */
export async function fetchPaywallOffering(): Promise<PurchasesOffering | null> {
  if (!isRevenueCatLinked()) return null;

  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function getRevenueCatOwnershipIds(): Promise<{
  appUserId: string;
  originalAppUserId: string;
} | null> {
  if (!isRevenueCatLinked() || !linkedAppUserId) return null;
  const customerInfo = await Purchases.getCustomerInfo();
  return {
    appUserId: linkedAppUserId,
    originalAppUserId: customerInfo.originalAppUserId,
  };
}

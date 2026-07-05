import * as Device from "expo-device";
import {
  fetchProducts,
  finishTransaction,
  hasActiveSubscriptions,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases,
  type ProductSubscription,
  type Purchase,
} from "expo-iap";
import { Platform } from "react-native";

import {
  ALL_PLAY_SUBSCRIPTION_SKUS,
  PLAY_SUBSCRIPTION_PRODUCT_IDS,
} from "@/constants/paywall/purchases";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";

let connectionPromise: Promise<boolean> | null = null;
let subscriptionCache: ProductSubscription[] | null = null;

function productIdForPlan(planId: PaywallPlanId): string {
  return PLAY_SUBSCRIPTION_PRODUCT_IDS[planId];
}

function isAndroidSubscription(
  product: ProductSubscription,
): product is ProductSubscription & { platform: "android" } {
  return product.platform === "android";
}

function resolveAndroidOffer(product: ProductSubscription): {
  sku: string;
  offerToken: string;
} {
  if (!isAndroidSubscription(product)) {
    throw new Error("Subscriptions are only configured for Android right now.");
  }

  const sku = product.id;
  const offerToken =
    product.subscriptionOffers.find((offer) => offer.offerTokenAndroid)?.offerTokenAndroid ??
    product.subscriptionOfferDetailsAndroid[0]?.offerToken;

  if (!offerToken) {
    throw new Error("This subscription is not available in Play Store yet.");
  }

  return { sku, offerToken };
}

function waitForSubscriptionPurchase(productId: string): Promise<Purchase> {
  return new Promise((resolve, reject) => {
    const successListener = purchaseUpdatedListener((purchase) => {
      if (purchase.productId !== productId) return;
      cleanup();
      resolve(purchase);
    });

    const errorListener = purchaseErrorListener((error) => {
      cleanup();
      reject(error);
    });

    const cleanup = () => {
      successListener.remove();
      errorListener.remove();
    };
  });
}

export async function ensurePlayBillingConnected(): Promise<boolean> {
  if (!Device.isDevice || Platform.OS !== "android") return false;

  if (!connectionPromise) {
    connectionPromise = initConnection().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}

export async function loadPlaySubscriptions(): Promise<ProductSubscription[]> {
  if (!(await ensurePlayBillingConnected())) return [];

  try {
    const products = await fetchProducts({
      skus: [...ALL_PLAY_SUBSCRIPTION_SKUS],
      type: "subs",
    });

    subscriptionCache = (products ?? []).filter(
      (product): product is ProductSubscription => product.type === "subs",
    );
    return subscriptionCache;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[billing] Could not load subscriptions:",
        error instanceof Error ? error.message : error,
      );
    }
    return [];
  }
}

export async function getPlaySubscriptionForPlan(
  planId: PaywallPlanId,
): Promise<ProductSubscription | null> {
  const productId = productIdForPlan(planId);
  const cached = subscriptionCache ?? (await loadPlaySubscriptions());
  return cached.find((product) => product.id === productId) ?? null;
}

export async function syncPremiumFromPlayStore(): Promise<boolean> {
  if (!(await ensurePlayBillingConnected())) return false;

  try {
    return hasActiveSubscriptions([...ALL_PLAY_SUBSCRIPTION_SKUS]);
  } catch {
    return false;
  }
}

export async function purchasePaywallPlan(planId: PaywallPlanId): Promise<boolean> {
  if (!(await ensurePlayBillingConnected())) {
    throw new Error("Google Play billing is only available on a physical Android device.");
  }

  const product = await getPlaySubscriptionForPlan(planId);
  if (!product) {
    throw new Error("This plan is not available yet. Check Play Console product ids.");
  }

  const { sku, offerToken } = resolveAndroidOffer(product);
  const purchasePromise = waitForSubscriptionPurchase(sku);

  await requestPurchase({
    type: "subs",
    request: {
      google: {
        skus: [sku],
        subscriptionOffers: [{ sku, offerToken }],
      },
    },
  });

  const purchase = await purchasePromise;
  await finishTransaction({ purchase, isConsumable: false });
  return true;
}

export async function restorePlayPurchases(): Promise<boolean> {
  if (!(await ensurePlayBillingConnected())) {
    throw new Error("Google Play billing is only available on a physical Android device.");
  }

  await restorePurchases();
  return syncPremiumFromPlayStore();
}

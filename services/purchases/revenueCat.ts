import Purchases, {
  PACKAGE_TYPE,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";

import { REVENUECAT_PREMIUM_ENTITLEMENT } from "@/constants/paywall/revenueCat";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";

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
  const customerInfo = await Purchases.getCustomerInfo();
  return hasPremiumEntitlement(customerInfo);
}

export async function purchasePaywallPlan(planId: PaywallPlanId): Promise<boolean> {
  const offerings = await Purchases.getOfferings();
  const selectedPackage = packageForPlan(offerings.current, planId);

  if (!selectedPackage) {
    throw new Error("This plan is not available yet. Check your RevenueCat offering.");
  }

  const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
  return hasPremiumEntitlement(customerInfo);
}

export async function restoreRevenueCatPurchases(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return hasPremiumEntitlement(customerInfo);
}

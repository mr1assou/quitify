import { useRevenueCatConfigure } from "@/hooks/purchases/useRevenueCatConfigure";
import { useRevenueCatSync } from "@/hooks/purchases/useRevenueCatSync";

/** Initializes RevenueCat and syncs premium entitlement at app startup. */
export function RevenueCatBridge() {
  useRevenueCatConfigure();
  useRevenueCatSync();
  return null;
}

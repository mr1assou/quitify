import { useRevenueCatConfigure } from "@/hooks/purchases/useRevenueCatConfigure";

/** Initializes RevenueCat once at app startup. */
export function RevenueCatBridge() {
  useRevenueCatConfigure();
  return null;
}

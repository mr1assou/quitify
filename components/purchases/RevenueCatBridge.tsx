import { useRevenueCatBootstrap } from "@/hooks/purchases/useRevenueCatBootstrap";

/** Initializes RevenueCat, links purchases, and syncs premium with subscription status. */
export function RevenueCatBridge() {
  useRevenueCatBootstrap();
  return null;
}

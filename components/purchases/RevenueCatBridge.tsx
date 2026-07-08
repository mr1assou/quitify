import { useRevenueCatConfigure } from "@/hooks/purchases/useRevenueCatConfigure";

/** Initializes RevenueCat for checkout and restore flows. */
export function RevenueCatBridge() {
  useRevenueCatConfigure();
  return null;
}

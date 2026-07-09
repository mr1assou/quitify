import { useRevenueCatBootstrap } from "@/hooks/purchases/useRevenueCatBootstrap";

/** Initializes RevenueCat and links purchases to the logged-in DB user. */
export function RevenueCatBridge() {
  useRevenueCatBootstrap();
  return null;
}

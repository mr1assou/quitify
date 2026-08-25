import type { PaywallSource } from "@/constants/analytics/paywall";
import { safeRouter } from "@/utils/app/safeRouter";

type OpenMode = "push" | "pushStack";

/** Opens paywall with a `source` query param (entry point). */
export function openPaywall(
  source: PaywallSource,
  mode: OpenMode = "push",
): void {
  const href = {
    pathname: "/paywall" as const,
    params: { source },
  };

  if (mode === "pushStack") {
    safeRouter.pushStack(href);
    return;
  }

  safeRouter.push(href);
}

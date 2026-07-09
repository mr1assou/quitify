import type { ReactNode } from "react";

import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { usePremiumRouteGuard } from "@/hooks/premium/usePremiumRouteGuard";

/** Renders children only for VIP users; otherwise opens the paywall. */
export function PremiumRoute({ children }: { children: ReactNode }) {
  const isPremium = useIsPremium();
  usePremiumRouteGuard();

  if (!isPremium) return null;
  return children;
}

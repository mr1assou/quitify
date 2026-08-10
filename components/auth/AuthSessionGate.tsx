import { useEffect } from "react";
import { useSegments } from "expo-router";

import { WELCOME_ROUTE } from "@/constants/app/routes";
import { useApp } from "@/context/AppContext";
import { resetToWelcome } from "@/utils/app/safeRouter";

/** Route groups / screens that stay reachable without a logged-in session. */
const PUBLIC_ROOT_SEGMENTS = new Set([
  "index",
  "onboarding",
  "intro",
  "signup",
  "signup-verify-otp",
  "login-email",
  "login-verify-otp",
  "oauth",
  "terms",
  "privacy",
]);

/**
 * After logout (or expired session), bounce any protected screen back to welcome
 * so Android back cannot reopen authenticated UI without data.
 */
export function AuthSessionGate() {
  const { state, isHydrated } = useApp();
  const segments = useSegments();

  useEffect(() => {
    if (!isHydrated) return;
    if (state.isOnboarded) return;

    const root = segments[0];
    if (!root || PUBLIC_ROOT_SEGMENTS.has(root)) return;

    resetToWelcome();
  }, [isHydrated, state.isOnboarded, segments]);

  return null;
}

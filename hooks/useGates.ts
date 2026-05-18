import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/useNow";
import type { Gates } from "@/types";

export type { Gates } from "@/types";

const ONE_DAY = 24 * 60 * 60 * 1000;
const PAYWALL_TRIGGER_DAYS = 5;

export function useGates(): Gates {
  const { state } = useApp();
  const now = useNow(60_000);

  const signedUp = !!state.account;
  const profile = state.profile;
  const flags = state.flags;

  const dayOne = profile ? now - profile.quitDate >= ONE_DAY : false;
  const shouldShowSignup =
    !signedUp &&
    !flags.hasSeenSignupPrompt &&
    (flags.hasLoggedFirstCraving || dayOne);

  const fiveDays = profile ? now - profile.quitDate >= PAYWALL_TRIGGER_DAYS * ONE_DAY : false;
  const shouldShowPaywall = !state.isPremium && !flags.hasSeenPaywall && fiveDays;

  return { shouldShowSignup, shouldShowPaywall };
}

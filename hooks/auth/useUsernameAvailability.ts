import { useEffect, useState } from "react";

import {
  isValidOnboardingUsername,
  normalizeOnboardingUsername,
} from "@/constants/onboarding/onboardingUsername";
import { useDebouncedValue } from "@/hooks/shared/useDebouncedValue";
import { checkUsernameAvailable } from "@/services/auth/usernameAvailabilityApi";

export const USERNAME_AVAILABILITY_DEBOUNCE_MS = 400;

export type UsernameAvailabilityState = {
  normalized: string;
  checking: boolean;
  /** True only when the settled check says the name is taken. */
  taken: boolean;
  /** Ready to save/continue: valid + not taken (or unchanged current). */
  canUse: boolean;
};

/**
 * Debounced uniqueness check.
 * Input `marwane` normalizes to `@marwane` before comparing with the DB.
 */
export function useUsernameAvailability(
  username: string,
  options?: {
    currentUsername?: string | null;
    excludeUserId?: number | null;
    enabled?: boolean;
  },
): UsernameAvailabilityState {
  const enabled = options?.enabled ?? true;
  const currentNormalized = normalizeOnboardingUsername(options?.currentUsername ?? "");
  const normalized = normalizeOnboardingUsername(username);
  const debounced = useDebouncedValue(normalized, USERNAME_AVAILABILITY_DEBOUNCE_MS);

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  const isOwn =
    Boolean(currentNormalized) &&
    normalized.length > 1 &&
    normalized === currentNormalized;

  const isValid = isValidOnboardingUsername(normalized);

  useEffect(() => {
    if (!enabled) {
      setChecking(false);
      setAvailable(null);
      return;
    }

    if (!isValidOnboardingUsername(debounced)) {
      setChecking(false);
      setAvailable(null);
      return;
    }

    if (currentNormalized && debounced === currentNormalized) {
      setChecking(false);
      setAvailable(true);
      return;
    }

    let cancelled = false;
    setChecking(true);

    void checkUsernameAvailable(debounced, options?.excludeUserId)
      .then((result) => {
        if (cancelled) return;
        setAvailable(result.available);
      })
      .catch(() => {
        if (cancelled) return;
        // Fail open for connectivity — save/onboarding still enforces uniqueness.
        setAvailable(true);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentNormalized, debounced, enabled, options?.excludeUserId]);

  const settledForCurrent =
    debounced === normalized && !checking && (isOwn || available !== null || !isValid);

  const taken = settledForCurrent && available === false && !isOwn;
  const canUse =
    isValid &&
    !checking &&
    debounced === normalized &&
    (isOwn || available === true);

  return {
    normalized,
    checking: enabled && isValid && !isOwn && (checking || debounced !== normalized),
    taken,
    canUse,
  };
}

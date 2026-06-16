import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  OnboardingContextValue,
  OnboardingDraft,
  UserProfile,
} from "@/types";
import { DEFAULT_CIGARETTES_PER_PACK } from "@/constants/onboarding/onboardingNicotineBands";
import { parseBirthYmd } from "@/utils/profile/birthdate";
import { startOfLocalDay } from "@/utils/shared/dates";

export type { OnboardingDraft, OnboardingContextValue } from "@/types";

const initial: OnboardingDraft = {
  username: "",
  quitReasonIds: [],
  primaryInterestIds: [],
  cigarettesPerDay: 0,
  cigarettesPerPack: 0,
  currency: "USD",
  quitStartPreset: "now",
  startTimestamp: startOfLocalDay(),
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(initial);

  const patch = useCallback((next: Partial<OnboardingDraft>) => {
    setDraft((d) => ({ ...d, ...next }));
  }, []);

  const reset = useCallback(() => setDraft(initial), []);

  const value = useMemo<OnboardingContextValue>(
    () => ({ draft, patch, reset }),
    [draft, patch, reset],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}

/* ----------------------------- buildProfile ----------------------------- */

/**
 * Convert the onboarding draft into the persisted `UserProfile`.
 */
export function buildProfile(draft: OnboardingDraft): UserProfile {
  const reasonIds = draft.quitReasonIds;
  const name = draft.username.trim();
  const birthDate =
    draft.birthYear != null && draft.birthMonth != null && draft.birthDay != null
      ? parseBirthYmd(draft.birthYear, draft.birthMonth, draft.birthDay)
      : null;

  return {
    name: name.length > 0 ? name : undefined,
    sex: draft.sex,
    birthDate: birthDate ?? undefined,
    quitDate: draft.startTimestamp,
    streakStart: draft.startTimestamp,
    currentAttemptNumber: 1,
    slipCigarettesTotal: 0,
    cigarettesPerDay: draft.cigarettesPerDay,
    cigarettesPerPack:
      draft.cigarettesPerPack > 0
        ? draft.cigarettesPerPack
        : DEFAULT_CIGARETTES_PER_PACK,
    packCost: draft.packCost ?? 0,
    countryCode: draft.countryCode,
    countryFlag: draft.countryFlag,
    currency: draft.currency,
    quitReasonIds: reasonIds.length > 0 ? [...reasonIds] : undefined,
    motivationLevel: draft.motivationLevel,
    priorQuitAttempts: draft.priorQuitAttempts,
    primaryInterests:
      draft.primaryInterestIds.length > 0 ? [...draft.primaryInterestIds] : undefined,
    nicotineConsumptionForm: "cigarettes",
    nicotineHabitYears: draft.nicotineHabitYears,
    quitMethod: draft.quitMethod,
  };
}

import {
  CIGARETTES_PER_DAY_BANDS,
  NICOTINE_HABIT_YEARS_BANDS,
} from "@/constants/onboarding/onboardingNicotineBands";
import { MOTIVATION_LEVEL_OPTIONS } from "@/constants/onboarding/onboardingMotivation";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import { PRIMARY_INTEREST_OPTIONS } from "@/constants/onboarding/onboardingPrimaryInterest";
import { PRIOR_QUIT_ATTEMPT_OPTIONS } from "@/constants/onboarding/onboardingPriorQuitAttempts";
import { QUIT_REASON_OPTIONS } from "@/constants/onboarding/onboardingReasons";
import { normalizeOnboardingUsername } from "@/constants/onboarding/onboardingUsername";
import { PROFILE_SEX_OPTIONS } from "@/constants/onboarding/onboardingSex";
import type { OnboardingDraft } from "@/types";
import type { OnboardingPayload } from "@/types/onboarding/onboardingPayload";
import { currencySymbol } from "@/utils/shared/format";
import { resolveQuitDatePayload } from "@/utils/onboarding/resolveQuitDatePayload";

type LabeledOption = { id: string; label: string };

function labelForId(
  options: readonly LabeledOption[],
  id: string | undefined,
): string | undefined {
  if (!id) return undefined;
  return options.find((o) => o.id === id)?.label;
}

function labelsForIds(
  options: readonly LabeledOption[],
  ids: readonly string[],
): string[] {
  return ids
    .map((id) => labelForId(options, id))
    .filter((label): label is string => label != null);
}

function resolveOtherText(
  selected: boolean,
  text: string | undefined,
): string | undefined {
  if (!selected) return undefined;
  const trimmed = text?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function resolvePackPriceText(draft: OnboardingDraft): string | undefined {
  const raw = draft.packCostInput?.trim();
  if (!raw) return undefined;
  if (
    !(
      typeof draft.packCost === "number" &&
      Number.isFinite(draft.packCost) &&
      draft.packCost > 0
    )
  ) {
    return undefined;
  }
  const symbol = currencySymbol(draft.currency).trim();
  if (symbol.length > 0 && symbol !== draft.currency) {
    return `${symbol}${raw}`;
  }
  return `${draft.currency} ${raw}`;
}

export function resolveOnboardingPayloadText(
  draft: OnboardingDraft,
  syncedAt = Date.now(),
): OnboardingPayload {
  const cigarettesBand = CIGARETTES_PER_DAY_BANDS.find(
    (b) => b.id === draft.cigarettesPerDayBand,
  );
  const yearsBand = NICOTINE_HABIT_YEARS_BANDS.find(
    (b) => b.id === draft.nicotineHabitYearsBand,
  );
  const quitPayload = resolveQuitDatePayload(draft, syncedAt);

  return {
    step1: {
      quitReasons: labelsForIds(QUIT_REASON_OPTIONS, draft.quitReasonIds),
      otherText: resolveOtherText(
        draft.quitReasonIds.includes(ONBOARDING_OTHER_ID),
        draft.quitReasonOtherText,
      ),
    },
    step2: {
      motivation: labelForId(MOTIVATION_LEVEL_OPTIONS, draft.motivationLevel),
      otherText: resolveOtherText(
        draft.motivationLevel === ONBOARDING_OTHER_ID,
        draft.motivationOtherText,
      ),
    },
    step3: {
      priorQuitAttempts: labelForId(
        PRIOR_QUIT_ATTEMPT_OPTIONS,
        draft.priorQuitAttempts,
      ),
      otherText: resolveOtherText(
        draft.priorQuitAttempts === ONBOARDING_OTHER_ID,
        draft.priorQuitAttemptsOtherText,
      ),
    },
    step4: {
      primaryInterests: labelsForIds(
        PRIMARY_INTEREST_OPTIONS,
        draft.primaryInterestIds,
      ),
      otherText: resolveOtherText(
        draft.primaryInterestIds.includes(ONBOARDING_OTHER_ID),
        draft.primaryInterestOtherText,
      ),
    },
    step5: {
      username: normalizeOnboardingUsername(draft.username),
      sex: labelForId(PROFILE_SEX_OPTIONS, draft.sex),
      country: draft.countryName,
      countryFlag: draft.countryFlag,
      currency: draft.currency,
      quitDatePreset: quitPayload?.quitDatePreset,
      quitDate: quitPayload?.quitDate,
    },
    step6: {
      cigarettesPerDay:
        draft.cigarettesPerDay >= 1
          ? draft.cigarettesPerDay
          : (cigarettesBand?.cigarettesPerDay ?? 0),
      cigarettesPerDayNote: cigarettesBand?.hint,
      packPrice: resolvePackPriceText(draft),
      yearsSmoking: yearsBand?.label,
      cigarettesPerPack: draft.cigarettesPerPack,
    },
  };
}

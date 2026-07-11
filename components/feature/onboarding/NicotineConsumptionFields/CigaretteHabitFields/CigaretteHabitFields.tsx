import { useMemo } from "react";
import { Text, View } from "react-native";

import { CigarettesPerPackField } from "@/components/feature/onboarding/NicotineConsumptionFields/CigarettesPerPackField";
import { PackCostField } from "@/components/feature/onboarding/NicotineConsumptionFields/PackCostField";
import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { SelectFieldString } from "@/components/ui/SelectFieldString";
import {
  CIGARETTES_PER_DAY_BANDS,
  CIGARETTES_PER_DAY_DROPDOWN_OPTIONS,
  NICOTINE_HABIT_YEARS_BANDS,
  NICOTINE_HABIT_YEARS_DROPDOWN_OPTIONS,
  type CigarettesPerDayBandId,
  type NicotineHabitYearsBandId,
} from "@/constants/onboarding/onboardingNicotineBands";
import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboarding/onboardingFlow";
import type { OnboardingDraft } from "@/types";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import {
  patchForCigarettesPerDayBand,
  patchForCigarettesPerPackInput,
  patchForNicotineHabitYearsBand,
  patchForPackCostInput,
} from "@/utils/onboarding/nicotineBands";
import { hasInvalidCigarettesPerPackInput } from "@/utils/onboarding/nicotineOnboarding";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
};

function isCigarettesPerDayBand(value: string): value is CigarettesPerDayBandId {
  return CIGARETTES_PER_DAY_DROPDOWN_OPTIONS.some((o) => o.value === value);
}

function isNicotineHabitYearsBand(value: string): value is NicotineHabitYearsBandId {
  return NICOTINE_HABIT_YEARS_DROPDOWN_OPTIONS.some((o) => o.value === value);
}

export function CigaretteHabitFields({ draft, patch }: Props) {
  const { t } = useTranslation();
  const { localize, label } = useLocalizedCatalog();

  const cigarettesPerDayOptions = useMemo(
    () =>
      localize(CIGARETTES_PER_DAY_BANDS, "onboarding.nicotine", ["label"]).map((band) => ({
        value: band.id,
        label: band.label,
      })),
    [localize],
  );

  const habitYearsOptions = useMemo(
    () =>
      localize(NICOTINE_HABIT_YEARS_BANDS, "onboarding.nicotine", ["label"]).map((band) => ({
        value: band.id,
        label: band.label,
      })),
    [localize],
  );

  const cigarettesHint = draft.cigarettesPerDayBand
    ? label("onboarding.nicotine", draft.cigarettesPerDayBand, "hint")
    : undefined;
  const packSizeError = hasInvalidCigarettesPerPackInput(draft);

  return (
    <View className="w-full gap-5">
      <View className="gap-2">
        <OnboardingFieldLabel>{t("onboarding.nicotine.cigsPerDay.label")}</OnboardingFieldLabel>
        <SelectFieldString
          fieldLabel={t("onboarding.nicotine.cigsPerDay.label")}
          showLabel={false}
          value={draft.cigarettesPerDayBand}
          placeholder={t("common.selectRange")}
          options={cigarettesPerDayOptions}
          allowClear={false}
          controlHeight={ONBOARDING_CONTROL_HEIGHT}
          onChange={(value) => {
            if (value && isCigarettesPerDayBand(value)) {
              patch(patchForCigarettesPerDayBand(value));
            }
          }}
        />
        {cigarettesHint ? (
          <Text className="text-sm text-muted-foreground dark:text-d-muted">
            {cigarettesHint}
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <OnboardingFieldLabel>{t("onboarding.nicotine.packSize.label")}</OnboardingFieldLabel>
        <CigarettesPerPackField
          value={draft.cigarettesPerPackInput}
          hasError={packSizeError}
          onChangeText={(raw) => patch(patchForCigarettesPerPackInput(raw))}
        />
        {packSizeError ? (
          <Text className="text-sm text-alert">
            Enter more than 0
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <OnboardingFieldLabel>{t("onboarding.nicotine.price.label")}</OnboardingFieldLabel>
        <PackCostField
          currency={draft.currency}
          value={draft.packCostInput}
          onChangeText={(raw) => patch(patchForPackCostInput(raw))}
        />
      </View>

      <View className="gap-2">
        <OnboardingFieldLabel>{t("onboarding.nicotine.habitYears.label")}</OnboardingFieldLabel>
        <SelectFieldString
          fieldLabel={t("onboarding.nicotine.habitYears.label")}
          showLabel={false}
          value={draft.nicotineHabitYearsBand}
          placeholder={t("common.selectRange")}
          options={habitYearsOptions}
          allowClear={false}
          controlHeight={ONBOARDING_CONTROL_HEIGHT}
          onChange={(value) => {
            if (value && isNicotineHabitYearsBand(value)) {
              patch(patchForNicotineHabitYearsBand(value));
            }
          }}
        />
      </View>
    </View>
  );
}

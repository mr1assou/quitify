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
import {
  hasInvalidCigarettesPerPackInput,
  type NicotineFieldErrors,
} from "@/utils/onboarding/nicotineOnboarding";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
  fieldErrors?: NicotineFieldErrors;
};

function isCigarettesPerDayBand(value: string): value is CigarettesPerDayBandId {
  return CIGARETTES_PER_DAY_DROPDOWN_OPTIONS.some((o) => o.value === value);
}

function isNicotineHabitYearsBand(value: string): value is NicotineHabitYearsBandId {
  return NICOTINE_HABIT_YEARS_DROPDOWN_OPTIONS.some((o) => o.value === value);
}

export function CigaretteHabitFields({ draft, patch, fieldErrors }: Props) {
  const { t } = useTranslation();
  const { localize } = useLocalizedCatalog();

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

  const packSizeInvalid =
    hasInvalidCigarettesPerPackInput(draft) || Boolean(fieldErrors?.packSizeInvalid);
  const packSizeMissing = Boolean(fieldErrors?.packSize);
  const packSizeHasError = packSizeInvalid || packSizeMissing;
  const priceHasError = Boolean(fieldErrors?.price);

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
        {fieldErrors?.cigsPerDay ? (
          <Text className="text-xs font-semibold text-alert">
            {t("onboarding.nicotine.cigsPerDay.required")}
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <OnboardingFieldLabel>{t("onboarding.nicotine.packSize.label")}</OnboardingFieldLabel>
        <CigarettesPerPackField
          value={draft.cigarettesPerPackInput}
          hasError={packSizeHasError}
          placeholder={t("onboarding.nicotine.packSize.placeholder")}
          onChangeText={(raw) => patch(patchForCigarettesPerPackInput(raw))}
        />
        {packSizeMissing ? (
          <Text className="text-xs font-semibold text-alert">
            {t("onboarding.nicotine.packSize.required")}
          </Text>
        ) : packSizeInvalid ? (
          <Text className="text-xs font-semibold text-alert">
            {t("onboarding.nicotine.packSize.invalid")}
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <OnboardingFieldLabel>{t("onboarding.nicotine.price.label")}</OnboardingFieldLabel>
        <PackCostField
          currency={draft.currency}
          value={draft.packCostInput}
          hasError={priceHasError}
          placeholder={t("onboarding.nicotine.price.placeholder")}
          onChangeText={(raw) => patch(patchForPackCostInput(raw))}
        />
        {priceHasError ? (
          <Text className="text-xs font-semibold text-alert">
            {t("onboarding.nicotine.price.required")}
          </Text>
        ) : null}
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
        {fieldErrors?.habitYears ? (
          <Text className="text-xs font-semibold text-alert">
            {t("onboarding.nicotine.habitYears.required")}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

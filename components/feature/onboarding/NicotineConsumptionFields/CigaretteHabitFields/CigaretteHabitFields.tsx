import { Text, View } from "react-native";

import { CigarettesPerPackField } from "@/components/feature/onboarding/NicotineConsumptionFields/CigarettesPerPackField";
import { PackCostField } from "@/components/feature/onboarding/NicotineConsumptionFields/PackCostField";
import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { SelectFieldString } from "@/components/ui/SelectFieldString";
import {
  CIGARETTES_PER_DAY_DROPDOWN_OPTIONS,
  NICOTINE_HABIT_YEARS_DROPDOWN_OPTIONS,
  cigarettesPerDayBandHint,
  type CigarettesPerDayBandId,
  type NicotineHabitYearsBandId,
} from "@/constants/onboardingNicotineBands";
import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboardingFlow";
import type { OnboardingDraft } from "@/types";
import {
  patchForCigarettesPerDayBand,
  patchForCigarettesPerPackInput,
  patchForNicotineHabitYearsBand,
  patchForPackCostInput,
} from "@/utils/nicotineBands";
import { hasInvalidCigarettesPerPackInput } from "@/utils/nicotineOnboarding";

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
  const cigarettesHint = cigarettesPerDayBandHint(draft.cigarettesPerDayBand);
  const packSizeError = hasInvalidCigarettesPerPackInput(draft);

  return (
    <View className="w-full gap-5">
      <View className="gap-2">
        <OnboardingFieldLabel>How many cigarettes do you smoke per day?</OnboardingFieldLabel>
        <SelectFieldString
          fieldLabel="How many cigarettes do you smoke per day?"
          showLabel={false}
          value={draft.cigarettesPerDayBand}
          placeholder="Select a range…"
          options={CIGARETTES_PER_DAY_DROPDOWN_OPTIONS}
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
        <OnboardingFieldLabel>How many cigarettes are in one pack?</OnboardingFieldLabel>
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
        <OnboardingFieldLabel>How much does one pack cost?</OnboardingFieldLabel>
        <PackCostField
          currency={draft.currency}
          value={draft.packCostInput}
          onChangeText={(raw) => patch(patchForPackCostInput(raw))}
        />
      </View>

      <View className="gap-2">
        <OnboardingFieldLabel>For how many years have you been smoking?</OnboardingFieldLabel>
        <SelectFieldString
          fieldLabel="For how many years have you been smoking?"
          showLabel={false}
          value={draft.nicotineHabitYearsBand}
          placeholder="Select a range…"
          options={NICOTINE_HABIT_YEARS_DROPDOWN_OPTIONS}
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

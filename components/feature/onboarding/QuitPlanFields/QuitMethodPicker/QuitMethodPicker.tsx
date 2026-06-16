import { Text, View } from "react-native";

import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { SelectFieldString } from "@/components/ui/SelectFieldString";
import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboarding/onboardingFlow";
import {
  QUIT_METHOD_DROPDOWN_OPTIONS,
  quitMethodHint,
} from "@/constants/onboarding/onboardingQuitPlan";
import type { QuitMethod } from "@/types/onboarding/onboarding";

type Props = {
  selected?: QuitMethod;
  onSelect: (method: QuitMethod) => void;
};

export function QuitMethodPicker({ selected, onSelect }: Props) {
  const hint = quitMethodHint(selected);

  return (
    <View className="gap-1.5">
      <OnboardingFieldLabel>How do you want to quit?</OnboardingFieldLabel>
      <SelectFieldString
        fieldLabel="How do you want to quit?"
        value={selected}
        placeholder="Select a method"
        options={QUIT_METHOD_DROPDOWN_OPTIONS}
        allowClear={false}
        showLabel={false}
        controlHeight={ONBOARDING_CONTROL_HEIGHT}
        onChange={(value) => {
          if (value === "cold_turkey" || value === "gradual") onSelect(value);
        }}
      />
      {hint ? (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

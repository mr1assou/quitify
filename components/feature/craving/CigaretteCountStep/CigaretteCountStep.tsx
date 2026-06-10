import { useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { SelectFieldString } from "@/components/ui/SelectFieldString";
import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboardingFlow";
import {
  SLIP_CIGARETTE_DROPDOWN_OPTIONS,
  isSlipCigaretteBand,
  slipCigarettesCountForBand,
  type SlipCigaretteBandId,
} from "@/constants/slipCigaretteCounts";

type Props = {
  onSelect: (count: number) => void;
  isSubmitting?: boolean;
};

export function CigaretteCountStep({ onSelect, isSubmitting }: Props) {
  const [selectedBand, setSelectedBand] = useState<SlipCigaretteBandId | undefined>();

  return (
    <View className="gap-4">
      <Animated.View entering={FadeInUp.duration(400)} className="items-center">
        <Text className="text-2xl font-bold text-foreground dark:text-d-text">
          About how many did you smoke?
        </Text>
        <Text className="mt-1 px-6 text-center text-sm text-muted-foreground dark:text-d-muted">
          Pick the range that best matches your relapse.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(120).duration(400)} className="w-full">
        <SelectFieldString
          fieldLabel="How many cigarettes?"
          showLabel={false}
          value={selectedBand}
          placeholder="Select a range…"
          options={SLIP_CIGARETTE_DROPDOWN_OPTIONS}
          allowClear={false}
          controlHeight={ONBOARDING_CONTROL_HEIGHT}
          loading={isSubmitting}
          disabled={isSubmitting}
          onChange={(value) => {
            if (isSubmitting || !value || !isSlipCigaretteBand(value)) return;
            setSelectedBand(value);
            onSelect(slipCigarettesCountForBand(value));
          }}
        />
      </Animated.View>
    </View>
  );
}

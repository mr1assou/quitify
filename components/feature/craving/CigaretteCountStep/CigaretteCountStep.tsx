import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboarding/onboardingFlow";
import {
  RELAPSE_MAX_CIGARETTE_COUNT,
  RELAPSE_MIN_CIGARETTE_COUNT,
  isValidRelapseCigaretteCount,
  parseRelapseCigaretteCount,
} from "@/constants/stats/slipCigaretteCounts";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onSelect: (count: number) => void;
  isSubmitting?: boolean;
};

export function CigaretteCountStep({ onSelect, isSubmitting }: Props) {
  const { colors } = useTheme();
  const [input, setInput] = useState("");

  const parsed = useMemo(() => parseRelapseCigaretteCount(input), [input]);
  const isValid = isValidRelapseCigaretteCount(parsed);
  const showError = input.trim().length > 0 && !isValid;

  const handleChange = (value: string) => {
    setInput(value.replace(/[^\d]/g, ""));
  };

  const handleContinue = () => {
    if (!isValid || isSubmitting) return;
    onSelect(parsed);
  };

  return (
    <View className="gap-4">
      <Animated.View entering={FadeInUp.duration(400)} className="items-center">
        <Text className="text-2xl font-bold text-foreground dark:text-d-text">
          About how many did you smoke?
        </Text>
        <Text className="mt-1 px-6 text-center text-sm text-muted-foreground dark:text-d-muted">
          Enter your best estimate (minimum {RELAPSE_MIN_CIGARETTE_COUNT} cigarettes).
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(120).duration(400)} className="w-full gap-2">
        <Text className="px-1 text-sm font-semibold text-foreground dark:text-d-text">
          Cigarettes smoked
        </Text>
        <View
          className="justify-center overflow-hidden rounded-2xl bg-section px-4 dark:bg-d-surface"
          style={{ minHeight: ONBOARDING_CONTROL_HEIGHT }}
        >
          <TextInput
            value={input}
            onChangeText={handleChange}
            placeholder={`e.g. ${RELAPSE_MIN_CIGARETTE_COUNT + 3}`}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            autoCorrect={false}
            autoComplete="off"
            editable={!isSubmitting}
            selectionColor={colors.primary}
            style={{
              color: colors.foreground,
              fontSize: 18,
              fontWeight: "600",
              paddingVertical: 12,
            }}
          />
        </View>

        {showError ? (
          <Text className="px-1 text-sm font-medium text-alert">
            Enter a whole number between {RELAPSE_MIN_CIGARETTE_COUNT} and{" "}
            {RELAPSE_MAX_CIGARETTE_COUNT}.
          </Text>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).duration(400)}>
        <Button
          label="Continue"
          size="lg"
          fullWidth
          disabled={!isValid}
          loading={isSubmitting}
          onPress={handleContinue}
        />
      </Animated.View>
    </View>
  );
}

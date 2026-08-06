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
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onSelect: (count: number) => void;
  isSubmitting?: boolean;
};

export function CigaretteCountStep({ onSelect, isSubmitting }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
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
          {t("craving.slipCountTitle")}
        </Text>
        <Text className="mt-1 px-6 text-center text-sm text-muted-foreground dark:text-d-muted">
          {t("craving.slipCountSubtitle", { min: RELAPSE_MIN_CIGARETTE_COUNT })}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(120).duration(400)} className="w-full gap-2">
        <Text className="px-1 text-sm font-semibold text-foreground dark:text-d-text">
          {t("craving.slipCountLabel")}
        </Text>
        <View
          className="justify-center overflow-hidden rounded-2xl bg-section px-4 dark:bg-d-surface"
          style={{ minHeight: ONBOARDING_CONTROL_HEIGHT }}
        >
          <TextInput
            value={input}
            onChangeText={handleChange}
            placeholder={`ex. ${RELAPSE_MIN_CIGARETTE_COUNT + 3}`}
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
            {t("craving.slipCountError", {
              min: RELAPSE_MIN_CIGARETTE_COUNT,
              max: RELAPSE_MAX_CIGARETTE_COUNT,
            })}
          </Text>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).duration(400)}>
        <Button
          label={t("common.continue")}
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

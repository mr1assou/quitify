import { Image, Text, View } from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { SlipKeepsRow } from "@/components/feature/craving/CravingResult/outcome/SlipKeepsRow";
import { SMOKED_RESULT_IMAGE } from "@/constants/app/assets";
import type { SlipOutcomeCopy } from "@/constants/stats/slipOutcomeCopy";
import { useTheme } from "@/context/ThemeContext";

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = SlipOutcomeCopy & {
  heroSize: number;
  onDone: () => void;
};

export function SlipOutcomeResult({
  heroSize,
  imageAccessibilityLabel,
  title,
  subtitle,
  buttonLabel,
  onDone,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="items-center gap-5">
      <AnimatedImage
        source={SMOKED_RESULT_IMAGE}
        accessibilityLabel={imageAccessibilityLabel}
        entering={ZoomIn.springify().damping(13).stiffness(110)}
        style={{ width: heroSize, height: heroSize }}
        resizeMode="contain"
      />

      <Animated.View entering={FadeInUp.delay(220).duration(420)} className="items-center">
        <Text className="text-center text-2xl font-bold leading-7 text-foreground dark:text-d-text">
          {title}
        </Text>
        <Text className="mt-2 max-w-[300px] text-center text-[15px] leading-5 text-muted-foreground dark:text-d-muted">
          {subtitle}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(380).duration(420)}
        className="w-full gap-2 rounded-3xl border border-section bg-section/40 p-4 dark:border-d-border dark:bg-d-surface"
      >
        <SlipKeepsRow icon="trophy" tint={colors.accent} label="Your Freedom Points" value="Kept" />
        <SlipKeepsRow icon="ribbon" tint={colors.primary} label="Your badges" value="Kept" />
        <SlipKeepsRow icon="trending-up" tint={colors.primary} label="Your rank" value="Kept" />
        <View className="h-px bg-section dark:bg-d-border" />
        <SlipKeepsRow
          icon="flame"
          tint={colors.alert}
          label="Smoke-free streak"
          value="Resets"
          valueTone="alert"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(540).duration(420)} className="w-full">
        <Button label={buttonLabel} size="lg" fullWidth onPress={onDone} />
      </Animated.View>
    </View>
  );
}

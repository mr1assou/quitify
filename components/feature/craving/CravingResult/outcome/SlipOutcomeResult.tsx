import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";

import { SlipKeepsRow } from "@/components/feature/craving/CravingResult/outcome/SlipKeepsRow";
import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Button } from "@/components/ui/Button";
import { SMOKED_RESULT_IMAGE } from "@/constants/app/assets";
import type { SlipOutcomeCopy } from "@/constants/stats/slipOutcomeCopy";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { useTheme } from "@/context/ThemeContext";
import { useProgress } from "@/hooks/progress/useProgress";
import { resolveHighestUnlockedBadgeId } from "@/utils/progress/badges";

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = SlipOutcomeCopy & {
  heroSize: number;
  onDone: () => void;
};

function BrandIcon({
  name,
  backgroundColor,
  iconColor,
}: {
  name: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconColor: string;
}) {
  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor }}
    >
      <Ionicons name={name} size={16} color={iconColor} />
    </View>
  );
}

export function SlipOutcomeResult({
  heroSize,
  imageAccessibilityLabel,
  title,
  subtitle,
  buttonLabel,
  onDone,
}: Props) {
  const { colors } = useTheme();
  const isPremium = useIsPremium();
  const progress = useProgress();
  const badgeId =
    (progress
      ? resolveHighestUnlockedBadgeId(progress.badges, isPremium)
      : null) ?? "first-step";

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
        <SlipKeepsRow
          leading={
            <BrandIcon
              name="flash"
              backgroundColor={colors.primary}
              iconColor={colors.white}
            />
          }
          label="Your Freedom Points"
          value="Kept"
        />
        <SlipKeepsRow
          leading={<BadgeArt badgeId={badgeId} size={36} />}
          label="Your badges"
          value="Kept"
        />
        <SlipKeepsRow
          leading={
            <BrandIcon
              name="globe"
              backgroundColor={colors.accent}
              iconColor={colors.white}
            />
          }
          label="Your rank"
          value="Kept"
        />
        <View className="h-px bg-section dark:bg-d-border" />
        <SlipKeepsRow
          leading={
            <BrandIcon
              name="flame"
              backgroundColor={colors.primary}
              iconColor={colors.white}
            />
          }
          label="Smoke-free streak"
          value="Resets"
          valueColor={colors.primary}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(540).duration(420)} className="w-full">
        <Button label={buttonLabel} size="lg" fullWidth onPress={onDone} />
      </Animated.View>
    </View>
  );
}

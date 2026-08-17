import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import {
  CIGARETTE_NINJA_DURATION_LABEL,
  CIGARETTE_NINJA_TARGET_SCORE,
} from "@/constants/craving/games/cigaretteNinja";
import { REFLEX_TAP_LOGO_IMAGE } from "@/constants/craving/games/cravingGameAssets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onStart: () => void;
};

export function ReflexIdleView({ onStart }: Props) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width - 60, 320);
  const logoHeight = logoWidth * 0.82;

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInDown.duration(420)}
        className="items-center gap-3 px-4"
      >
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {t("craving.ninjaTitle")}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {t("craving.ninjaIdleBody", {
            duration: CIGARETTE_NINJA_DURATION_LABEL,
            score: CIGARETTE_NINJA_TARGET_SCORE,
          })}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(150)
          .duration(500)
          .springify()
          .damping(14)
          .stiffness(140)}
      >
        <Image
          source={REFLEX_TAP_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
          accessibilityLabel={t("craving.ninjaA11y")}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        className="w-full"
      >
        <Button label={t("craving.startBattle")} size="lg" fullWidth onPress={onStart} />
      </Animated.View>
    </View>
  );
}

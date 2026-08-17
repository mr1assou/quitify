import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { MEMORY_MATCH_LOGO_IMAGE } from "@/constants/craving/games/cravingGameAssets";
import {
  MEMORY_MATCH_DURATION_SEC,
  MEMORY_MATCH_PAIR_COUNT,
  MEMORY_MATCH_PREVIEW_SEC,
} from "@/constants/craving/games/memoryMatch";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  onStart: () => void;
};

export function MemoryIdleView({ onStart }: Props) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width - 80, 280);
  const logoHeight = logoWidth * 0.78;

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInDown.duration(420)}
        className="items-center gap-3 px-4"
      >
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {t("craving.memoryMatchTitle")}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {t("craving.memoryIdleBody", {
            preview: MEMORY_MATCH_PREVIEW_SEC,
            pairs: MEMORY_MATCH_PAIR_COUNT,
            minutes: MEMORY_MATCH_DURATION_SEC / 60,
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
          source={MEMORY_MATCH_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
          accessibilityLabel={t("craving.memoryA11y")}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        className="w-full"
      >
        <Button label={t("craving.startGame")} size="lg" fullWidth onPress={onStart} />
      </Animated.View>
    </View>
  );
}

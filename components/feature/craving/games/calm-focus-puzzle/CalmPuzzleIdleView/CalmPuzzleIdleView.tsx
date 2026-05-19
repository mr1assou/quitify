import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { CALM_FOCUS_PUZZLE_LOGO_IMAGE } from "@/constants/cravingGameAssets";

type Props = {
  onStart: () => void;
};

export function CalmPuzzleIdleView({ onStart }: Props) {
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
          Calm focus puzzle
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Fit blocks into the grid. Tap a piece to rotate it. Complete rows
          or columns to clear them.
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
          source={CALM_FOCUS_PUZZLE_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
          accessibilityLabel="Calm focus puzzle game"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        className="w-full"
      >
        <Button label="Start game" size="lg" fullWidth onPress={onStart} />
      </Animated.View>
    </View>
  );
}

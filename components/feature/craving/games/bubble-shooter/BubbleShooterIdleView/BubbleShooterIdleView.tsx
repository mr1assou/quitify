import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { BUBBLE_SHOOTER_TOTAL_BUBBLES } from "@/constants/craving/games/bubbleShooter";
import { BUBBLE_SHOOTER_LOGO_IMAGE } from "@/constants/craving/games/cravingGameAssets";

type Props = {
  onStart: () => void;
};

export function BubbleShooterIdleView({ onStart }: Props) {
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
          Bubble Shooter
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Aim and shoot bubbles. Match 3 or more of the same color to pop them.
          Only a batch is on screen at a time pop all{" "}
          {BUBBLE_SHOOTER_TOTAL_BUBBLES.toLocaleString("en-US")} to win.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(150)
          .duration(500)
          .springify()
          .damping(14)
          .stiffness(140)}
        style={{
          width: logoWidth,
          height: logoHeight,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <Image
          source={BUBBLE_SHOOTER_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="cover"
          accessibilityLabel="Bubble Shooter game"
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

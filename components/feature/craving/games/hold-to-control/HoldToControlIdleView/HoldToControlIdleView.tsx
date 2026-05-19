import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { HOLD_TO_CONTROL_LOGO_IMAGE } from "@/constants/cravingGameAssets";
import { HOLD_TO_CONTROL_TOTAL_WAVES } from "@/constants/holdToControl";

type Props = {
  onStart: () => void;
};

export function HoldToControlIdleView({ onStart }: Props) {
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
          Hold to stay in control
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Complete {HOLD_TO_CONTROL_TOTAL_WAVES} steady holds. Breathe, press,
          and don&apos;t let go until each ring fills.
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
          source={HOLD_TO_CONTROL_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
          accessibilityLabel="Hold-to-control challenge"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        className="w-full"
      >
        <Button label="Start challenge" size="lg" fullWidth onPress={onStart} />
      </Animated.View>
    </View>
  );
}

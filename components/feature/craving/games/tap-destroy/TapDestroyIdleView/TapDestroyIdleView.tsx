import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { TAP_DESTROY_LOGO_IMAGE } from "@/constants/cravingGameAssets";
import { TAP_DESTROY_DURATION_SEC } from "@/hooks/useTapDestroyGame";

type Props = {
  onStart: () => void;
};

export function TapDestroyIdleView({ onStart }: Props) {
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width - 40, 360);
  const logoHeight = logoWidth * 0.78;

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInDown.duration(420)}
        className="items-center gap-3 px-4"
      >
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          Smash the cigarettes
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Tap every cigarette you see. You have {TAP_DESTROY_DURATION_SEC}{" "}
          seconds.
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
          source={TAP_DESTROY_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
          accessibilityLabel="Tap to destroy cigarettes"
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

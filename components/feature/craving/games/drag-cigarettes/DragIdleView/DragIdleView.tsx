import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { DRAG_CIGARETTES_TRASH_LOGO_IMAGE } from "@/constants/cravingGameAssets";
import { DRAG_CIGARETTES_DURATION_SEC } from "@/constants/dragCigarettes";

type Props = {
  onStart: () => void;
};

export function DragIdleView({ onStart }: Props) {
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
          Drag to trash
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Drag every cigarette into the trash. {DRAG_CIGARETTES_DURATION_SEC}{" "}
          seconds of pure control.
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
          source={DRAG_CIGARETTES_TRASH_LOGO_IMAGE}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
          accessibilityLabel="Drag cigarettes to trash game"
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

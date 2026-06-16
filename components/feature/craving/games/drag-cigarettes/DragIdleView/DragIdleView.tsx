import { Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { ColorSwitchLogo } from "@/components/feature/craving/games/drag-cigarettes/ColorSwitchLogo";
import { Button } from "@/components/ui/Button";

type Props = {
  onStart: () => void;
};

export function DragIdleView({ onStart }: Props) {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width - 80, 220);

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInDown.duration(420)}
        className="items-center gap-3 px-4"
      >
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          Color Switch
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Tap to fly up. Pass only through obstacles that match your ball color.
          Grab stars and color orbs along the way.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(150).duration(500).springify()}>
        <ColorSwitchLogo size={logoSize} />
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

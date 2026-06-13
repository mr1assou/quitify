import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { GREETING_IMAGE } from "@/constants/assets";

const IMAGE_SIZE = 280;
const FLOAT_DISTANCE = 8;

type Props = {
  participantName: string;
};

/** Empty chat state — greeting art with a gentle up/down float. */
export function ChatEmptyGreeting({ participantName }: Props) {
  const floatY = useSharedValue(-FLOAT_DISTANCE);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(FLOAT_DISTANCE, {
        duration: 2200,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [floatY]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View className="mt-8 items-center px-6">
      <Animated.Image
        source={GREETING_IMAGE}
        style={[{ width: IMAGE_SIZE, height: IMAGE_SIZE }, imageStyle]}
        resizeMode="contain"
        accessibilityLabel="Friendly greeting"
      />

      <Text className="mt-6 text-center text-lg font-semibold text-foreground dark:text-d-text">
        Say hi to {participantName}
      </Text>
      <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
        Be kind. We're all quitting together.
      </Text>
    </View>
  );
}

import { Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export function CravingSupportIntro() {
  return (
    <Animated.View entering={FadeInUp.duration(400)} className="items-center">
      <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
        Ride it out
      </Text>
      <Text className="mt-2 max-w-[320px] text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
        Most cravings fade in a few minutes. Use the timer and tools below — then log how it went.
      </Text>
    </Animated.View>
  );
}

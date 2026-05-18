import { Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Props = {
  /** Key change triggers the fade animation. */
  phaseId: string;
  label: string;
};

export function BreathingPhaseLabel({ phaseId, label }: Props) {
  return (
    <Animated.View
      key={phaseId}
      entering={FadeIn.duration(450)}
      exiting={FadeOut.duration(300)}
    >
      <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
        {label}
      </Text>
    </Animated.View>
  );
}

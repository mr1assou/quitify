import { Ionicons } from "@expo/vector-icons";
import { Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { MotivationQuoteCard } from "@/components/feature/craving/motivation-cards/MotivationQuoteCard";
import { Button } from "@/components/ui/Button";
import { MOTIVATION_QUOTES } from "@/constants/motivationQuotes";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onStartSession: () => void;
};

export function MotivationCardsIdleView({ onStartSession }: Props) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const previewWidth = Math.min(width * 0.7, 320);
  const previewHeight = Math.min(height * 0.5, 440);
  const preview = MOTIVATION_QUOTES[0];

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-2">
      <Animated.View
        entering={FadeInDown.duration(450)}
        className="items-center px-6"
      >
        <Ionicons name="sparkles" size={26} color={colors.accent} />
        <Text className="mt-3 text-center text-xl font-bold text-foreground dark:text-d-text">
          A few quotes to lift you up
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
          Swipe through them when you’re ready.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(150).duration(500).springify().damping(14).stiffness(140)}
        style={{ transform: [{ rotateZ: "-3deg" }] }}
      >
        <MotivationQuoteCard
          quote={preview}
          width={previewWidth}
          height={previewHeight}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(400)} className="w-full">
        <Button
          label="Start craving session"
          size="lg"
          fullWidth
          onPress={onStartSession}
        />
      </Animated.View>
    </View>
  );
}

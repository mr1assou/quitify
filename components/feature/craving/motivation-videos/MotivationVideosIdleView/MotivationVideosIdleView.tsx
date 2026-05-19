import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onStartSession: () => void;
};

export function MotivationVideosIdleView({ onStartSession }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-2">
      <Animated.View entering={FadeInDown.duration(450)} className="items-center px-6">
        <Ionicons name="play-circle" size={28} color={colors.accent} />
        <Text className="mt-3 text-center text-xl font-bold text-foreground dark:text-d-text">
          Watch a short video
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
          A few minutes of calm focus can help an urge pass.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(150).duration(500).springify().damping(14).stiffness(140)}
        style={{
          width: 220,
          height: 220,
          borderRadius: 110,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${colors.accent}26`,
        }}
      >
        <View
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 12 },
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Ionicons name="play" size={56} color={colors.white} />
        </View>
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

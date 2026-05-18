import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  message: string;
};

export function MotivationMessage({ message }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <Card variant="section" className="flex-row items-center">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-2xl bg-accent">
          <Ionicons name="sparkles" size={18} color={colors.white} />
        </View>
        <Text className="flex-1 text-sm font-semibold text-foreground dark:text-d-text">
          {message}
        </Text>
      </Card>
    </Animated.View>
  );
}

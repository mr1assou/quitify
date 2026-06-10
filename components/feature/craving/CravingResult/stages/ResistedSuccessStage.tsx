import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onDone: () => void;
};

export function ResistedSuccessStage({ onDone }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(400)} className="gap-4">
      <Card variant="section" className="items-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-accent">
          <Ionicons name="shield-checkmark" size={28} color={colors.white} />
        </View>
        <Text className="mt-3 text-center text-2xl font-bold text-foreground dark:text-d-text">
          You&apos;re stronger than the urge
        </Text>
        <Text className="mt-1 px-2 text-center text-sm text-muted-foreground dark:text-d-muted">
          Every win makes the next craving smaller.
        </Text>
      </Card>

      <Button label="Back to home" size="lg" fullWidth onPress={onDone} />
    </Animated.View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onResisted: () => void;
  onSmoked: () => void;
};

export function AskStage({ onResisted, onSmoked }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInUp.duration(400)} className="gap-4">
      <View className="items-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-accent-soft dark:bg-d-accent-soft">
          <Ionicons name="trophy" size={28} color={colors.accent} />
        </View>
        <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">
          You made it through
        </Text>
        <Text className="mt-1 px-6 text-center text-sm text-muted-foreground dark:text-d-muted">
          How did this one go? Be honest — there&apos;s no judgement here.
        </Text>
      </View>

      <View className="gap-3">
        <Button
          label="I resisted"
          variant="accent"
          size="lg"
          fullWidth
          leading={<Ionicons name="shield-checkmark" size={18} color={colors.white} />}
          onPress={onResisted}
        />
        <Button label="I smoked" variant="ghost" size="lg" fullWidth onPress={onSmoked} />
      </View>
    </Animated.View>
  );
}

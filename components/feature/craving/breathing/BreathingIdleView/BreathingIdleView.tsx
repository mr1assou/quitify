import { Text, View } from "react-native";

import { BreathingCircle } from "@/components/feature/craving/breathing/BreathingCircle";
import { Button } from "@/components/ui/Button";

type Props = {
  circleSize: number;
  onStartSession: () => void;
};

export function BreathingIdleView({ circleSize, onStartSession }: Props) {
  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <View className="h-12 items-center justify-center px-4">
        <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
          Take a moment. When you&apos;re ready, start your breathing session.
        </Text>
      </View>

      <BreathingCircle
        targetScale={0.55}
        durationMs={0}
        isRunning={false}
        size={circleSize}
      />

      <View className="w-full">
        <Button label="Start session" size="lg" fullWidth onPress={onStartSession} />
      </View>
    </View>
  );
}

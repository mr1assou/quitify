import { Text, View } from "react-native";

import { MotivationCardStack } from "@/components/feature/craving/motivation-cards/MotivationCardStack";
import { MotivationCardsSessionTimer } from "@/components/feature/craving/motivation-cards/MotivationCardsSessionTimer";
import { Button } from "@/components/ui/Button";
import type { MotivationQuote } from "@/constants/motivationQuotes";

type Props = {
  elapsedMs: number;
  quotes: readonly MotivationQuote[];
  currentIndex: number;
  onIndexChange: (next: number) => void;
  onFinish: () => void;
};

export function MotivationCardsSession({
  elapsedMs,
  quotes,
  currentIndex,
  onIndexChange,
  onFinish,
}: Props) {
  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-2">
      <View className="w-full items-center gap-2">
        <MotivationCardsSessionTimer elapsedMs={elapsedMs} />
        <Text className="text-xs text-muted-foreground dark:text-d-muted">
          Swipe to read another quote
        </Text>
      </View>

      <MotivationCardStack
        quotes={quotes}
        currentIndex={currentIndex}
        onIndexChange={onIndexChange}
      />

      <View className="w-full">
        <Button
          label="Stop craving session"
          variant="accent"
          size="lg"
          fullWidth
          onPress={onFinish}
        />
      </View>
    </View>
  );
}

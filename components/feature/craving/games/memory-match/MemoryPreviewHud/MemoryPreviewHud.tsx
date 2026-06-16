import { Text, View } from "react-native";

type Props = {
  secondsLeft: number;
};

export function MemoryPreviewHud({ secondsLeft }: Props) {
  return (
    <View className="items-center px-6 pb-3 pt-2">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        Memorize the cards
      </Text>
      <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
        Study the board — play starts when the timer hits zero.
      </Text>
      <Text className="mt-3 font-mono text-5xl font-bold tabular-nums text-accent">
        {secondsLeft}
      </Text>
    </View>
  );
}

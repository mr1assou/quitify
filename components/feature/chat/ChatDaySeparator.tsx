import { Text, View } from "react-native";

type Props = {
  label: string;
};

/** Centered day / month / year label between chat message blocks. */
export function ChatDaySeparator({ label }: Props) {
  return (
    <View className="my-3 items-center px-4" accessibilityRole="header">
      <Text className="text-center text-xs font-medium text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
    </View>
  );
}

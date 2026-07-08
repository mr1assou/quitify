import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  name?: string;
  isPremium: boolean;
};

export function ProfileHeader({ name, isPremium }: Props) {
  const { colors } = useTheme();

  return (
    <View className="items-center">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
        <Ionicons name="person" size={40} color={colors.white} />
      </View>
      <View className="mt-4 flex-row items-center">
        <Text className="text-xl font-bold text-foreground dark:text-d-text">{name ?? "Quitter"}</Text>
        <Ionicons
          name="pencil"
          size={14}
          color={colors.mutedForeground}
          style={{ marginLeft: 6 }}
        />
      </View>
      <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
        {isPremium ? "VIP member" : "Guest"}
      </Text>
    </View>
  );
}

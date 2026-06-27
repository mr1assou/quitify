import { ActivityIndicator, Text, View, type ActivityIndicatorProps } from "react-native";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  size?: ActivityIndicatorProps["size"];
  message?: string;
};

/** Full-screen loader on the app gradient canvas. */
export function ThemedLoadingScreen({ size = "large", message }: Props) {
  const { colors, resolved } = useTheme();
  const isDark = resolved === "dark";

  return (
    <View className="flex-1">
      <AppScreenBackground isDark={isDark} showOrbs={false} />
      <View className="flex-1 items-center justify-center gap-3 bg-transparent">
        <ActivityIndicator size={size} color={colors.primary} />
        {message ? (
          <Text className="text-sm text-muted-foreground dark:text-d-muted">{message}</Text>
        ) : null}
      </View>
    </View>
  );
}

import { ActivityIndicator, Text, View, type ActivityIndicatorProps } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  size?: ActivityIndicatorProps["size"];
  message?: string;
};

/** Full-screen loader with background and spinner colors from the active theme. */
export function ThemedLoadingScreen({ size = "large", message }: Props) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center gap-3"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator size={size} color={colors.primary} />
      {message ? (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">{message}</Text>
      ) : null}
    </View>
  );
}

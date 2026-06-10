import { ActivityIndicator, View, type ActivityIndicatorProps } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  size?: ActivityIndicatorProps["size"];
};

/** Full-screen loader with background and spinner colors from the active theme. */
export function ThemedLoadingScreen({ size = "large" }: Props) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

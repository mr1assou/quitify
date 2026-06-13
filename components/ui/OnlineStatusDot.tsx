import { View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

const ONLINE_COLOR = "#22C55E";

type Props = {
  isOnline: boolean;
  size?: number;
};

export function OnlineStatusDot({ isOnline, size = 11 }: Props) {
  const { colors } = useTheme();
  const ring = Math.max(2, Math.round(size * 0.2));

  return (
    <View
      style={{
        width: size + ring * 2,
        height: size + ring * 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isOnline ? ONLINE_COLOR : colors.mutedForeground,
          borderWidth: ring,
          borderColor: colors.background,
        }}
      />
    </View>
  );
}

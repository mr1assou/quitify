import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  source: ImageSourcePropType;
  duration: string;
  height: number;
};

/** Video thumbnail with play overlay + duration badge. */
export function MotivationVideoThumbnail({ source, duration, height }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ height, width: "100%", position: "relative" }}>
      <Image
        source={source}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />

      <View
        pointerEvents="none"
        style={{
          ...absoluteFill(),
          backgroundColor: "rgba(0,0,0,0.18)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "rgba(0,0,0,0.55)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="play" size={28} color={colors.white} />
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          backgroundColor: "rgba(0,0,0,0.7)",
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 6,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.3,
          }}
        >
          {duration}
        </Text>
      </View>
    </View>
  );
}

function absoluteFill() {
  return { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
}

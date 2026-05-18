import { useState } from "react";
import {
  Text,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";

import { EllipseBubbleShape } from "./EllipseBubbleShape";

const TEXT_PADDING_X = 28;
const TEXT_PADDING_Y = 18;
const TAIL_DROP = 22;
const SHADOW_OFFSET = { x: 2, y: 5 };

type Props = {
  message: string;
  /** Slight rotation for hand-drawn feel (degrees). */
  rotateDeg?: number;
  style?: ViewStyle;
};

export function MangaSpeechBubble({ message, rotateDeg = -2, style }: Props) {
  const { colors, resolved } = useTheme();
  const isDark = resolved === "dark";
  const fill = isDark ? colors.section : "#F4F4F4";
  const stroke = isDark ? colors.mutedForeground : "#8E8E8E";
  const shadow = isDark ? "#00000088" : "#0000002A";

  const [size, setSize] = useState({ width: 0, height: 0 });

  const onTextLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width + TEXT_PADDING_X * 2);
    const h = Math.round(e.nativeEvent.layout.height + TEXT_PADDING_Y * 2 + TAIL_DROP);
    if (w !== size.width || h !== size.height) setSize({ width: w, height: h });
  };

  return (
    <Animated.View
      entering={ZoomIn.delay(220).duration(420).springify().damping(13).stiffness(160)}
      style={[{ alignSelf: "center", transform: [{ rotate: `${rotateDeg}deg` }] }, style]}
      accessibilityRole="text"
    >
      <View style={{ position: "relative", alignSelf: "center" }}>
        {size.width > 0 && (
          <>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: SHADOW_OFFSET.y,
                left: SHADOW_OFFSET.x,
              }}
            >
              <EllipseBubbleShape
                width={size.width}
                height={size.height}
                stroke="transparent"
                fill={shadow}
              />
            </View>
            <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0 }}>
              <EllipseBubbleShape
                width={size.width}
                height={size.height}
                stroke={stroke}
                fill={fill}
              />
            </View>
          </>
        )}

        <View
          style={{
            paddingHorizontal: TEXT_PADDING_X,
            paddingTop: TEXT_PADDING_Y,
            paddingBottom: TEXT_PADDING_Y + TAIL_DROP,
            minWidth: 180,
            maxWidth: 280,
          }}
        >
          <View onLayout={onTextLayout}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 21,
                fontWeight: "700",
                textAlign: "center",
                color: colors.foreground,
                letterSpacing: 0.2,
              }}
            >
              {message}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

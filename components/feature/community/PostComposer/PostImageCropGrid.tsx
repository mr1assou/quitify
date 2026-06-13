import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  style?: ComponentProps<typeof Animated.View>["style"];
  shape?: "rectangle" | "circle";
  radius?: number;
};

/** Crop guide overlay — rule-of-thirds grid or circular profile ring. */
export function PostImageCropGrid({ style, shape = "rectangle", radius = 12 }: Props) {
  if (shape === "circle") {
    return (
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
        <View style={[styles.circleBorder, { borderRadius: radius }]} />
      </Animated.View>
    );
  }

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <View style={[styles.border, { borderRadius: radius }]} />
      <View style={[styles.lineH, { top: "33.33%" }]} />
      <View style={[styles.lineH, { top: "66.66%" }]} />
      <View style={[styles.lineV, { left: "33.33%" }]} />
      <View style={[styles.lineV, { left: "66.66%" }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },
  circleBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  lineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  lineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
});

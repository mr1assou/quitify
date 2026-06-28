import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { RTCView, type MediaStream } from "react-native-webrtc";

type Props = {
  stream: MediaStream | null;
  /** Mirror the feed (typically the front-facing local camera). */
  mirror?: boolean;
  objectFit?: "cover" | "contain";
  style?: StyleProp<ViewStyle>;
  zOrder?: number;
};

/** Renders a WebRTC media stream full-bleed inside its parent (parent must have size). */
export function CallVideoView({
  stream,
  mirror = false,
  objectFit = "cover",
  style,
  zOrder = 0,
}: Props) {
  if (!stream) return null;

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <RTCView
        streamURL={stream.toURL()}
        mirror={mirror}
        objectFit={objectFit}
        zOrder={zOrder}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";

type Props = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  trackColor?: string;
  fillColor?: string;
  height?: number;
};

export function SeekBar({
  value,
  max,
  onChange,
  trackColor = "rgba(255,255,255,0.25)",
  fillColor = "#FFFFFF",
  height = 6,
}: Props) {
  const widthRef = useRef(0);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const ratio =
    max > 0 ? Math.min(1, Math.max(0, (dragValue ?? value) / max)) : 0;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
  }, []);

  const seekAt = useCallback(
    (locationX: number) => {
      if (widthRef.current <= 0 || max <= 0) return;
      const next = Math.min(max, Math.max(0, (locationX / widthRef.current) * max));
      setDragValue(next);
      onChange(next);
    },
    [max, onChange],
  );

  return (
    <Pressable
      onLayout={handleLayout}
      onPress={(event) => seekAt(event.nativeEvent.locationX)}
      onPressOut={() => setDragValue(null)}
      style={{ justifyContent: "center", paddingVertical: 8 }}
    >
      <View
        style={{
          height,
          borderRadius: height,
          backgroundColor: trackColor,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            borderRadius: height,
            backgroundColor: fillColor,
          }}
        />
      </View>
    </Pressable>
  );
}

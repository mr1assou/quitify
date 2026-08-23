import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, View } from "react-native";

type Props = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  trackColor?: string;
  fillColor?: string;
  height?: number;
};

/** Incoming positions this close to the released target mean the player caught up. */
const SETTLE_TOLERANCE_MS = 600;
/** Stop holding the released position after this long (failed/slow seek). */
const SETTLE_TIMEOUT_MS = 2_000;

/**
 * Draggable seek bar: the fill follows the finger while dragging and the
 * actual seek happens on release. The released position is held until the
 * player reports a nearby position, so the bar never snaps back.
 */
export function SeekBar({
  value,
  max,
  onChange,
  trackColor = "rgba(255,255,255,0.25)",
  fillColor = "#FFFFFF",
  height = 6,
}: Props) {
  const widthRef = useRef(0);
  const trackLeftRef = useRef(0);
  const draggingRef = useRef(false);
  const releasedAtRef = useRef(0);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);
  const dragValueRef = useRef<number | null>(null);
  const [dragValue, setDragValue] = useState<number | null>(null);

  maxRef.current = max;
  onChangeRef.current = onChange;

  // Release the held position once the player catches up (or times out).
  useEffect(() => {
    const held = dragValueRef.current;
    if (held == null || draggingRef.current) return;
    const settled = Math.abs(value - held) <= SETTLE_TOLERANCE_MS;
    const expired = Date.now() - releasedAtRef.current > SETTLE_TIMEOUT_MS;
    if (settled || expired) {
      dragValueRef.current = null;
      setDragValue(null);
    }
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        draggingRef.current = true;
        // locationX is only reliable on the initial touch; from it derive the
        // track's absolute screen X so moves can use stable pageX coordinates.
        trackLeftRef.current =
          event.nativeEvent.pageX - event.nativeEvent.locationX;
        const next = valueFromX(
          event.nativeEvent.locationX,
          widthRef.current,
          maxRef.current,
        );
        dragValueRef.current = next;
        setDragValue(next);
      },
      onPanResponderMove: (_event, gestureState) => {
        const next = valueFromX(
          gestureState.moveX - trackLeftRef.current,
          widthRef.current,
          maxRef.current,
        );
        dragValueRef.current = next;
        setDragValue(next);
      },
      onPanResponderRelease: (event, gestureState) => {
        // moveX is 0 when the user tapped without dragging.
        const pageX =
          gestureState.moveX !== 0 ? gestureState.moveX : event.nativeEvent.pageX;
        const next = valueFromX(
          pageX - trackLeftRef.current,
          widthRef.current,
          maxRef.current,
        );
        dragValueRef.current = next;
        setDragValue(next);
        draggingRef.current = false;
        releasedAtRef.current = Date.now();
        onChangeRef.current(next);
      },
      onPanResponderTerminate: () => {
        draggingRef.current = false;
        releasedAtRef.current = Date.now();
        const held = dragValueRef.current;
        if (held != null) onChangeRef.current(held);
      },
    }),
  ).current;

  const ratio =
    max > 0 ? Math.min(1, Math.max(0, (dragValue ?? value) / max)) : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
  };

  return (
    <View
      onLayout={handleLayout}
      {...panResponder.panHandlers}
      style={{ justifyContent: "center", paddingVertical: 12 }}
      accessibilityLabel="Playback progress"
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
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: `${ratio * 100}%`,
          marginLeft: -7,
          height: 14,
          width: 14,
          borderRadius: 7,
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}

function valueFromX(x: number, width: number, max: number): number {
  if (width <= 0 || max <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, x / width));
  return Math.round(ratio * max);
}

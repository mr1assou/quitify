import * as Haptics from "expo-haptics";
import { memo, useCallback, useEffect, useState } from "react";
import { Image, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { TAP_DESTROY_CIGARETTE_IMAGE } from "@/constants/cravingGameAssets";
import {
  DRAG_CIGARETTES_SIZE_H,
  DRAG_CIGARETTES_SIZE_W,
  DRAG_CIGARETTES_TRASH_HIT_PADDING,
} from "@/constants/dragCigarettes";
import type { DragCigarette } from "@/hooks/useDragCigarettesGame";

type TrashZone = {
  centerX: number;
  centerY: number;
  radius: number;
};

type Props = {
  cigarette: DragCigarette;
  areaWidth: number;
  areaHeight: number;
  trashZone: TrashZone;
  onTrash: (id: string) => void;
  onHoverChange: (id: string, hovering: boolean) => void;
};

function DraggableCigaretteImpl({
  cigarette,
  areaWidth,
  areaHeight,
  trashZone,
  onTrash,
  onHoverChange,
}: Props) {
  const [done, setDone] = useState(false);

  const horizontalRange = Math.max(areaWidth - DRAG_CIGARETTES_SIZE_W, 0);
  const verticalRange = Math.max(areaHeight - DRAG_CIGARETTES_SIZE_H, 0);
  const baseX = cigarette.xRatio * horizontalRange;
  const baseY = cigarette.yRatio * verticalRange;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const hovering = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 160,
      easing: Easing.linear,
    });
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  }, [opacity, scale]);

  const distanceToTrash = (dx: number, dy: number) => {
    "worklet";
    const cx = baseX + DRAG_CIGARETTES_SIZE_W / 2 + dx;
    const cy = baseY + DRAG_CIGARETTES_SIZE_H / 2 + dy;
    const ddx = cx - trashZone.centerX;
    const ddy = cy - trashZone.centerY;
    return Math.sqrt(ddx * ddx + ddy * ddy);
  };

  // Smooth UI-thread hover detection.
  useAnimatedReaction(
    () => {
      const d = distanceToTrash(translateX.value, translateY.value);
      return d <= trashZone.radius + DRAG_CIGARETTES_TRASH_HIT_PADDING ? 1 : 0;
    },
    (current, prev) => {
      if (current === prev) return;
      hovering.value = current;
      runOnJS(onHoverChange)(cigarette.id, current === 1);
    },
  );

  const handleTrashJS = useCallback(() => {
    if (done) return;
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    onHoverChange(cigarette.id, false);
    onTrash(cigarette.id);
  }, [done, onTrash, onHoverChange, cigarette.id]);

  const animateIntoTrash = useCallback(() => {
    "worklet";
    const targetDx =
      trashZone.centerX - (baseX + DRAG_CIGARETTES_SIZE_W / 2);
    const targetDy =
      trashZone.centerY - (baseY + DRAG_CIGARETTES_SIZE_H / 2);
    translateX.value = withTiming(targetDx, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(targetDy, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(0.2, {
      duration: 220,
      easing: Easing.in(Easing.cubic),
    });
    opacity.value = withTiming(
      0,
      { duration: 240, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(handleTrashJS)();
      },
    );
  }, [
    trashZone.centerX,
    trashZone.centerY,
    baseX,
    baseY,
    translateX,
    translateY,
    scale,
    opacity,
    handleTrashJS,
  ]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (done) return;
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      if (done) return;
      const d = distanceToTrash(translateX.value, translateY.value);
      if (d <= trashZone.radius + DRAG_CIGARETTES_TRASH_HIT_PADDING) {
        animateIntoTrash();
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        runOnJS(onHoverChange)(cigarette.id, false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const hoverLift = hovering.value;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value * (1 + hoverLift * 0.06) },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      pointerEvents={done ? "none" : "auto"}
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      collapsable={false}
      style={[
        {
          position: "absolute",
          left: baseX,
          top: baseY,
          width: DRAG_CIGARETTES_SIZE_W,
          height: DRAG_CIGARETTES_SIZE_H,
        },
        animatedStyle,
      ]}
    >
      <GestureDetector gesture={pan}>
        <View
          style={{
            width: DRAG_CIGARETTES_SIZE_W,
            height: DRAG_CIGARETTES_SIZE_H,
            transform: [{ rotate: `${cigarette.rotation}deg` }],
          }}
        >
          <Image
            source={TAP_DESTROY_CIGARETTE_IMAGE}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

export const DraggableCigarette = memo(
  DraggableCigaretteImpl,
  (prev, next) =>
    prev.cigarette === next.cigarette &&
    prev.areaWidth === next.areaWidth &&
    prev.areaHeight === next.areaHeight &&
    prev.trashZone.centerX === next.trashZone.centerX &&
    prev.trashZone.centerY === next.trashZone.centerY &&
    prev.trashZone.radius === next.trashZone.radius &&
    prev.onTrash === next.onTrash &&
    prev.onHoverChange === next.onHoverChange,
);

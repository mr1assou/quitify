import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Pressable } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { CigaretteSprite } from "@/components/feature/craving/games/tap-destroy/CigaretteSprite";
import { TapDestroyExplosion } from "@/components/feature/craving/games/tap-destroy/TapDestroyExplosion";
import {
  TAP_DESTROY_CIGARETTE_HEIGHT,
  TAP_DESTROY_CIGARETTE_WIDTH,
} from "@/constants/craving/games/cravingGameAssets";
import type { TapDestroyCigarette as Cigarette } from "@/hooks/craving/games/useTapDestroyGame";

const SCALE = 1.75;
const EXPLOSION_SIZE = 72;

export type TapDestroyHitPosition = {
  x: number;
  y: number;
};

type Props = {
  cigarette: Cigarette;
  areaWidth: number;
  areaHeight: number;
  onDestroy: (id: string, position: TapDestroyHitPosition) => void;
};

export function TapDestroyCigarette({
  cigarette,
  areaWidth,
  areaHeight,
  onDestroy,
}: Props) {
  const [phase, setPhase] = useState<"idle" | "exploding">("idle");
  const spriteWidth = TAP_DESTROY_CIGARETTE_WIDTH * SCALE;
  const spriteHeight = TAP_DESTROY_CIGARETTE_HEIGHT * SCALE;

  const left = cigarette.x * Math.max(areaWidth - spriteWidth - 16, 0) + 8;
  const top = cigarette.y * Math.max(areaHeight - spriteHeight - 24, 0) + 12;
  const centerX = left + spriteWidth / 2;
  const centerY = top + spriteHeight / 2;

  const finishDestroy = useCallback(() => {
    onDestroy(cigarette.id, { x: centerX, y: centerY });
  }, [centerX, centerY, cigarette.id, onDestroy]);

  const handlePress = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("exploding");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, [phase]);

  if (phase === "exploding") {
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: centerX - EXPLOSION_SIZE / 2,
          top: centerY - EXPLOSION_SIZE / 2,
        }}
      >
        <TapDestroyExplosion size={EXPLOSION_SIZE} onComplete={finishDestroy} />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={ZoomIn.duration(160).springify().damping(12).stiffness(200)}
      style={{ position: "absolute", left, top }}
    >
      <Pressable
        onPress={handlePress}
        hitSlop={{ top: 16, bottom: 16, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Destroy cigarette"
      >
        <CigaretteSprite scale={SCALE} rotation={cigarette.rotation} />
      </Pressable>
    </Animated.View>
  );
}

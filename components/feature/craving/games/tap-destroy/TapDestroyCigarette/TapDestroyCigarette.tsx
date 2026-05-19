import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Pressable } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { CigaretteSprite } from "@/components/feature/craving/games/tap-destroy/CigaretteSprite";
import {
  TAP_DESTROY_CIGARETTE_HEIGHT,
  TAP_DESTROY_CIGARETTE_WIDTH,
} from "@/constants/cravingGameAssets";
import type { TapDestroyCigarette as Cigarette } from "@/hooks/useTapDestroyGame";

const SCALE = 1.75;

type Props = {
  cigarette: Cigarette;
  areaWidth: number;
  areaHeight: number;
  onDestroy: (id: string) => void;
};

export function TapDestroyCigarette({
  cigarette,
  areaWidth,
  areaHeight,
  onDestroy,
}: Props) {
  const [tapped, setTapped] = useState(false);
  const spriteWidth = TAP_DESTROY_CIGARETTE_WIDTH * SCALE;
  const spriteHeight = TAP_DESTROY_CIGARETTE_HEIGHT * SCALE;

  // Reserve margin so cigarettes don't get clipped at edges.
  const left = cigarette.x * Math.max(areaWidth - spriteWidth - 16, 0) + 8;
  const top = cigarette.y * Math.max(areaHeight - spriteHeight - 24, 0) + 12;

  const handlePress = useCallback(() => {
    if (tapped) return;
    setTapped(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onDestroy(cigarette.id);
  }, [tapped, onDestroy, cigarette.id]);

  return (
    <Animated.View
      entering={ZoomIn.duration(180).springify().damping(14).stiffness(180)}
      exiting={ZoomOut.duration(220)}
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

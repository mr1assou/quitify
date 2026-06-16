import { useCallback, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { TapDestroyCigarette } from "@/components/feature/craving/games/tap-destroy/TapDestroyCigarette";
import { TapDestroyHitPopup } from "@/components/feature/craving/games/tap-destroy/TapDestroyHitPopup";
import type {
  TapDestroyCigarette as Cigarette,
  TapDestroyDestroyResult,
} from "@/hooks/craving/games/useTapDestroyGame";

type HitEffect = TapDestroyDestroyResult & {
  id: string;
  x: number;
  y: number;
};

type Props = {
  cigarettes: readonly Cigarette[];
  onDestroy: (id: string) => TapDestroyDestroyResult | null;
};

export function TapDestroyPlayField({ cigarettes, onDestroy }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  const handleDestroy = useCallback(
    (id: string, position: { x: number; y: number }) => {
      const result = onDestroy(id);
      if (!result) return;
      setHitEffects((prev) => [
        ...prev,
        { id: `hit-${id}`, x: position.x, y: position.y, ...result },
      ]);
    },
    [onDestroy],
  );

  const removeHitEffect = useCallback((id: string) => {
    setHitEffects((prev) => prev.filter((effect) => effect.id !== id));
  }, []);

  return (
    <View
      onLayout={handleLayout}
      className="mx-4 mb-4 mt-2 flex-1 overflow-hidden"
    >
      {size.width > 0 && size.height > 0
        ? cigarettes.map((c) => (
            <TapDestroyCigarette
              key={c.id}
              cigarette={c}
              areaWidth={size.width}
              areaHeight={size.height}
              onDestroy={handleDestroy}
            />
          ))
        : null}
      {hitEffects.map((effect) => (
        <TapDestroyHitPopup
          key={effect.id}
          id={effect.id}
          x={effect.x}
          y={effect.y}
          scoreGain={effect.scoreGain}
          combo={effect.combo}
          onDone={removeHitEffect}
        />
      ))}
    </View>
  );
}

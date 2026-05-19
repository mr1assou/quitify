import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { TapDestroyCigarette } from "@/components/feature/craving/games/tap-destroy/TapDestroyCigarette";
import type { TapDestroyCigarette as Cigarette } from "@/hooks/useTapDestroyGame";

type Props = {
  cigarettes: readonly Cigarette[];
  onDestroy: (id: string) => void;
};

export function TapDestroyPlayField({ cigarettes, onDestroy }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

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
              onDestroy={onDestroy}
            />
          ))
        : null}
    </View>
  );
}

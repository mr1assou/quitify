import { memo, useCallback, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { ReflexTarget } from "@/components/feature/craving/games/reflex-tap/ReflexTarget";
import type { ReflexTarget as ReflexTargetType } from "@/hooks/craving/games/useReflexTapGame";

type Props = {
  targets: readonly ReflexTargetType[];
  onTap: (id: string, kind: "good" | "bad") => void;
};

function ReflexPlayFieldImpl({ targets, onTap }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (width !== size.width || height !== size.height) {
        setSize({ width, height });
      }
    },
    [size.width, size.height],
  );

  return (
    <View
      onLayout={handleLayout}
      className="mx-4 mb-4 mt-2 flex-1 overflow-hidden"
    >
      {size.width > 0 && size.height > 0
        ? targets.map((t) => (
            <ReflexTarget
              key={t.id}
              target={t}
              areaWidth={size.width}
              areaHeight={size.height}
              onTap={onTap}
            />
          ))
        : null}
    </View>
  );
}

export const ReflexPlayField = memo(ReflexPlayFieldImpl);

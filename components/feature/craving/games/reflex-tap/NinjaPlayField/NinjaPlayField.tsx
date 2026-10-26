import { useMemo } from "react";
import { PanResponder, View, type LayoutChangeEvent } from "react-native";
import Svg, { Polyline } from "react-native-svg";

import { NinjaFlyingObjectSprite } from "@/components/feature/craving/games/reflex-tap/NinjaFlyingObject";
import { NinjaSliceBurst } from "@/components/feature/craving/games/reflex-tap/NinjaSliceBurst";
import { useTheme } from "@/context/ThemeContext";
import type {
  NinjaSliceBurst as Burst,
  NinjaTrailPoint,
} from "@/hooks/craving/games/useCigaretteNinjaGame";
import type { NinjaFlyingObject } from "@/utils/craving/games/cigaretteNinjaMath";

type Props = {
  objects: readonly NinjaFlyingObject[];
  trail: readonly NinjaTrailPoint[];
  bursts: readonly Burst[];
  onLayoutField: (width: number, height: number) => void;
  onSwipePoint: (x: number, y: number) => void;
  onSwipeEnd: () => void;
  onBurstDone: (id: string) => void;
};

export function NinjaPlayField({
  objects,
  trail,
  bursts,
  onLayoutField,
  onSwipePoint,
  onSwipeEnd,
  onBurstDone,
}: Props) {
  const { colors } = useTheme();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          onSwipePoint(locationX, locationY);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          onSwipePoint(locationX, locationY);
        },
        onPanResponderRelease: () => onSwipeEnd(),
        onPanResponderTerminate: () => onSwipeEnd(),
      }),
    [onSwipeEnd, onSwipePoint],
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    onLayoutField(width, height);
  };

  const trailPoints = trail
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <View
      className="mx-2 flex-1 overflow-hidden rounded-3xl"
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      {objects.map((object) => (
        <NinjaFlyingObjectSprite key={object.id} object={object} />
      ))}

      {bursts.map((burst) => (
        <NinjaSliceBurst
          key={burst.id}
          id={burst.id}
          x={burst.x}
          y={burst.y}
          combo={burst.combo}
          onDone={onBurstDone}
        />
      ))}

      {trail.length >= 2 ? (
        <Svg
          style={{ position: "absolute", inset: 0 }}
          width="100%"
          height="100%"
        >
          <Polyline
            points={trailPoints}
            fill="none"
            stroke={colors.accent}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.9}
          />
        </Svg>
      ) : null}
    </View>
  );
}

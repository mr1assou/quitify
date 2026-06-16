import { useState } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";
import * as Haptics from "expo-haptics";

import { ColorSwitchBall } from "@/components/feature/craving/games/drag-cigarettes/ColorSwitchBall";
import { ColorSwitchObstacleSprite } from "@/components/feature/craving/games/drag-cigarettes/ColorSwitchObstacle";
import { ColorSwitchOrbSprite } from "@/components/feature/craving/games/drag-cigarettes/ColorSwitchOrb";
import { COLOR_SWITCH_BG } from "@/constants/craving/games/colorSwitch";
import type { ColorSwitchColor } from "@/constants/craving/games/colorSwitch";
import {
  anchorScreenY,
  ballScreenPosition,
  worldToScreenY,
  type ColorSwitchObstacle,
  type ColorSwitchOrb,
} from "@/utils/craving/games/colorSwitchMath";

type Props = {
  ballWorldY: number;
  cameraWorldY: number;
  ballColor: ColorSwitchColor;
  obstacles: readonly ColorSwitchObstacle[];
  orbs: readonly ColorSwitchOrb[];
  onLayoutField: (width: number, height: number) => void;
  onTap: () => void;
};

export function ColorSwitchPlayField({
  ballWorldY,
  cameraWorldY,
  ballColor,
  obstacles,
  orbs,
  onLayoutField,
  onTap,
}: Props) {
  const [field, setField] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setField({ width, height });
    onLayoutField(width, height);
  };

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onTap();
  };

  const ball =
    field.width > 0
      ? ballScreenPosition(field, ballWorldY, cameraWorldY)
      : { x: 0, y: 0 };
  const anchorY = field.width > 0 ? anchorScreenY(field) : 0;

  return (
    <Pressable
      className="mx-2 flex-1 overflow-hidden rounded-3xl"
      style={{ backgroundColor: COLOR_SWITCH_BG }}
      onLayout={handleLayout}
      onPress={handleTap}
    >
      {field.width > 0 ? (
        <>
          {obstacles.map((obstacle) => {
            const screenY = worldToScreenY(obstacle.worldY, cameraWorldY, anchorY);
            if (screenY < -140 || screenY > field.height + 140) return null;
            return (
              <ColorSwitchObstacleSprite
                key={obstacle.id}
                obstacle={obstacle}
                x={ball.x}
                y={screenY}
              />
            );
          })}

          {orbs.map((orb) => {
            if (orb.collected) return null;
            const screenY = worldToScreenY(orb.worldY, cameraWorldY, anchorY);
            if (screenY < -60 || screenY > field.height + 60) return null;
            return <ColorSwitchOrbSprite key={orb.id} x={ball.x} y={screenY} />;
          })}

          <ColorSwitchBall x={ball.x} y={ball.y} color={ballColor} />
        </>
      ) : null}
    </Pressable>
  );
}

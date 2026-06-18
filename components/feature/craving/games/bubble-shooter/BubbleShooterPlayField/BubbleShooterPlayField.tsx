import { useMemo } from "react";
import { PanResponder, View, type LayoutChangeEvent } from "react-native";
import Svg, { Line } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { BubbleShooterBubble } from "@/components/feature/craving/games/bubble-shooter/BubbleShooterBubble";
import { useTheme } from "@/context/ThemeContext";
import { BUBBLE_SHOOTER_DANGER_ROW } from "@/constants/craving/games/bubbleShooter";
import {
  bubbleCenter,
  dangerLineY,
  type BubbleGrid,
  type BubbleColor,
} from "@/utils/craving/games/bubbleShooterGrid";
import type { Projectile } from "@/utils/craving/games/bubbleShooterEngine";

type Props = {
  grid: BubbleGrid;
  projectile: Projectile | null;
  currentColor: BubbleColor;
  nextColor: BubbleColor;
  aimAngle: number;
  radius: number;
  originX: number;
  originY: number;
  shooterX: number;
  shooterY: number;
  fieldWidth: number;
  canShoot: boolean;
  onLayoutField: (width: number, height: number) => void;
  onAimAt: (x: number, y: number) => void;
  onShoot: () => void;
};

export function BubbleShooterPlayField({
  grid,
  projectile,
  currentColor,
  nextColor,
  aimAngle,
  radius,
  originX,
  originY,
  shooterX,
  shooterY,
  fieldWidth,
  canShoot,
  onLayoutField,
  onAimAt,
  onShoot,
}: Props) {
  const { colors } = useTheme();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          onAimAt(locationX, locationY);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          onAimAt(locationX, locationY);
        },
        onPanResponderRelease: () => {
          if (canShoot) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onShoot();
          }
        },
        onPanResponderTerminate: () => {
          if (canShoot) onShoot();
        },
      }),
    [canShoot, onAimAt, onShoot],
  );

  const aimEnd = {
    x: shooterX + Math.cos(aimAngle) * radius * 5,
    y: shooterY + Math.sin(aimAngle) * radius * 5,
  };

  const dangerY = dangerLineY(BUBBLE_SHOOTER_DANGER_ROW, radius, originY);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    onLayoutField(width, height);
  };

  return (
    <View className="flex-1 px-4 pb-2">
      <View
        className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-section dark:border-d-border dark:bg-d-elevated"
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <Svg
          style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
          width={fieldWidth || 1}
          height="100%"
        >
          <Line
            x1={originX}
            y1={dangerY}
            x2={(fieldWidth || 1) - originX}
            y2={dangerY}
            stroke={colors.alert}
            strokeWidth={2}
            strokeDasharray="6 6"
            opacity={0.55}
          />
          {canShoot ? (
            <Line
              x1={shooterX}
              y1={shooterY}
              x2={aimEnd.x}
              y2={aimEnd.y}
              stroke={colors.mutedForeground}
              strokeWidth={2}
              strokeDasharray="4 8"
              opacity={0.45}
            />
          ) : null}
        </Svg>

        {Object.values(grid).map((bubble) => {
          const center = bubbleCenter(
            bubble.row,
            bubble.col,
            radius,
            originX,
            originY,
          );
          return (
            <BubbleShooterBubble
              key={`${bubble.row}-${bubble.col}`}
              x={center.x}
              y={center.y}
              radius={radius}
              color={bubble.color}
            />
          );
        })}

        {projectile ? (
          <BubbleShooterBubble
            x={projectile.x}
            y={projectile.y}
            radius={radius}
            color={projectile.color}
          />
        ) : (
          <BubbleShooterBubble
            x={shooterX}
            y={shooterY}
            radius={radius}
            color={currentColor}
          />
        )}

        <BubbleShooterBubble
          x={shooterX + radius * 2.8}
          y={shooterY}
          radius={radius * 0.55}
          color={nextColor}
        />
      </View>
    </View>
  );
}

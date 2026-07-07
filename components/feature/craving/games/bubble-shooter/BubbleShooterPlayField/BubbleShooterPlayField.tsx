import { memo, useMemo } from "react";
import { PanResponder, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { BubbleShooterBubble } from "@/components/feature/craving/games/bubble-shooter/BubbleShooterBubble";
import {
  BUBBLE_SHOOTER_DANGER_ROW,
  BUBBLE_SHOOTER_PALETTE,
} from "@/constants/craving/games/bubbleShooter";
import { useTheme } from "@/context/ThemeContext";
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

const BubbleGridCanvas = memo(function BubbleGridCanvas({
  grid,
  radius,
  originX,
  originY,
  fieldWidth,
}: {
  grid: BubbleGrid;
  radius: number;
  originX: number;
  originY: number;
  fieldWidth: number;
}) {
  const strokeWidth = Math.max(1.25, radius * 0.07);
  const bubbles = useMemo(
    () =>
      Object.values(grid).map((bubble) => ({
        key: `${bubble.row}-${bubble.col}`,
        color: bubble.color,
        ...bubbleCenter(bubble.row, bubble.col, radius, originX, originY),
      })),
    [grid, radius, originX, originY],
  );

  return (
    <Svg
      style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
      width={fieldWidth || 1}
      height="100%"
      pointerEvents="none"
    >
      <Defs>
        {BUBBLE_SHOOTER_PALETTE.map((palette, i) => (
          <RadialGradient
            key={i}
            id={`grid-bubble-gradient-${i}`}
            cx="32%"
            cy="28%"
            rx="68%"
            ry="68%"
            fx="28%"
            fy="22%"
          >
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="18%" stopColor={palette.fill} stopOpacity="1" />
            <Stop offset="72%" stopColor={palette.fill} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.shade} stopOpacity="1" />
          </RadialGradient>
        ))}
      </Defs>

      {bubbles.map((bubble) => {
        const gradientId = `grid-bubble-gradient-${bubble.color}`;
        return (
          <Circle
            key={bubble.key}
            cx={bubble.x}
            cy={bubble.y}
            r={radius - strokeWidth / 2}
            fill={`url(#${gradientId})`}
            stroke={BUBBLE_SHOOTER_PALETTE[bubble.color].stroke}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </Svg>
  );
});

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
  const aimFarEnd = {
    x: shooterX + Math.cos(aimAngle) * radius * 8.5,
    y: shooterY + Math.sin(aimAngle) * radius * 8.5,
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
            y1={originY}
            x2={(fieldWidth || 1) - originX}
            y2={originY}
            stroke={colors.border}
            strokeWidth={1.5}
            opacity={0.45}
          />
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
            <>
              <Line
                x1={shooterX}
                y1={shooterY}
                x2={aimFarEnd.x}
                y2={aimFarEnd.y}
                stroke={colors.primary}
                strokeWidth={1.2}
                opacity={0.16}
              />
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
            </>
          ) : null}
        </Svg>

        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-0 h-20"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        />

        <BubbleGridCanvas
          grid={grid}
          radius={radius}
          originX={originX}
          originY={originY}
          fieldWidth={fieldWidth}
        />

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
        <View
          pointerEvents="none"
          className="absolute rounded-full border-2 border-border/50 dark:border-d-border/70"
          style={{
            left: shooterX - radius * 1.12,
            top: shooterY - radius * 1.12,
            width: radius * 2.24,
            height: radius * 2.24,
          }}
        />
      </View>
    </View>
  );
}

import Svg, { Path, Polygon } from "react-native-svg";

import {
  COLOR_SWITCH_PALETTE,
  COLOR_SWITCH_PLUS_ARM_HALF,
  COLOR_SWITCH_PLUS_ARM_LEN,
  COLOR_SWITCH_PLUS_INNER_GAP,
  COLOR_SWITCH_RING_INNER_R,
  COLOR_SWITCH_RING_OUTER_R,
  COLOR_SWITCH_RING_SEGMENT_GAP,
  COLOR_SWITCH_STAR_RADIUS,
  type ColorSwitchColor,
} from "@/constants/craving/games/colorSwitch";
import type { ColorSwitchObstacle } from "@/utils/craving/games/colorSwitchMath";

type Props = {
  obstacle: ColorSwitchObstacle;
  x: number;
  y: number;
};

function polar(cx: number, cy: number, radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + radius * Math.sin(rad),
    y: cy - radius * Math.cos(rad),
  };
}

function ringSegmentPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
): string {
  const oStart = polar(cx, cy, outerR, startDeg);
  const oEnd = polar(cx, cy, outerR, endDeg);
  const iEnd = polar(cx, cy, innerR, endDeg);
  const iStart = polar(cx, cy, innerR, startDeg);
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${iStart.x} ${iStart.y}`,
    "Z",
  ].join(" ");
}

function starPolygonPoints(cx: number, cy: number, outerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? outerR : outerR * 0.45;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(" ");
}

function rectPath(
  cx: number,
  cy: number,
  x: number,
  y: number,
  w: number,
  h: number,
): string {
  return `M ${cx + x} ${cy + y} H ${cx + x + w} V ${cy + y + h} H ${cx + x} Z`;
}

function RingObstacle({
  cx,
  cy,
  rotation,
  segments,
  starAngle,
  starCollected,
}: {
  cx: number;
  cy: number;
  rotation: number;
  segments: ColorSwitchObstacle["segments"];
  starAngle: number;
  starCollected: boolean;
}) {
  const midR = (COLOR_SWITCH_RING_INNER_R + COLOR_SWITCH_RING_OUTER_R) / 2;
  const star = polar(cx, cy, midR, rotation + starAngle);

  return (
    <>
      {segments.map((color, index) => {
        const halfGap = COLOR_SWITCH_RING_SEGMENT_GAP / 2;
        const start = rotation + index * 90 + halfGap;
        const end = rotation + (index + 1) * 90 - halfGap;
        return (
          <Path
            key={`${color}-${index}`}
            d={ringSegmentPath(
              cx,
              cy,
              COLOR_SWITCH_RING_INNER_R,
              COLOR_SWITCH_RING_OUTER_R,
              start,
              end,
            )}
            fill={COLOR_SWITCH_PALETTE[color]}
          />
        );
      })}
      {!starCollected ? (
        <Polygon
          points={starPolygonPoints(star.x, star.y, COLOR_SWITCH_STAR_RADIUS)}
          fill="#FFFFFF"
        />
      ) : null}
    </>
  );
}

function PlusObstacle({
  cx,
  cy,
  rotation,
  segments,
}: {
  cx: number;
  cy: number;
  rotation: number;
  segments: ColorSwitchObstacle["segments"];
}) {
  const half = COLOR_SWITCH_PLUS_ARM_HALF;
  const len = COLOR_SWITCH_PLUS_ARM_LEN;
  const gap = COLOR_SWITCH_PLUS_INNER_GAP;
  const arms: { color: ColorSwitchColor; d: string }[] = [
    { color: segments[0], d: rectPath(cx, cy, -half, -len, half * 2, len - gap) },
    { color: segments[1], d: rectPath(cx, cy, gap, -half, len - gap, half * 2) },
    { color: segments[2], d: rectPath(cx, cy, -half, gap, half * 2, len - gap) },
    { color: segments[3], d: rectPath(cx, cy, -len, -half, len - gap, half * 2) },
  ];

  return (
    <>
      {arms.map((arm, index) => (
        <Path
          key={index}
          d={arm.d}
          fill={COLOR_SWITCH_PALETTE[arm.color]}
          transform={`rotate(${rotation} ${cx} ${cy})`}
        />
      ))}
    </>
  );
}

export function ColorSwitchObstacleSprite({ obstacle, x, y }: Props) {
  const size = COLOR_SWITCH_RING_OUTER_R * 2 + 24;

  return (
    <Svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
      }}
    >
      {obstacle.kind === "ring" ? (
        <RingObstacle
          cx={size / 2}
          cy={size / 2}
          rotation={obstacle.rotation}
          segments={obstacle.segments}
          starAngle={obstacle.starAngle}
          starCollected={obstacle.starCollected}
        />
      ) : (
        <PlusObstacle
          cx={size / 2}
          cy={size / 2}
          rotation={obstacle.rotation}
          segments={obstacle.segments}
        />
      )}
    </Svg>
  );
}

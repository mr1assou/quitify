import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

export type LineChartPoint = {
  label: string;
  value: number;
};

type Props = {
  data: LineChartPoint[];
  height?: number;
  /** Stroke + fill base color. Defaults to theme primary. */
  color?: string;
  /** Optional Y-axis value formatter for the min/max labels. */
  formatValue?: (n: number) => string;
  /** When false, skips point dots (e.g. many points on narrow screens). */
  showDots?: boolean;
};

const PADDING_X = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

/**
 * Minimal SVG line chart. Renders a smooth (Catmull–Rom) line, area fill,
 * point dots, and a single row of X-axis labels. Self-sizes to the parent.
 */
export function LineChart({
  data,
  height = 180,
  color: colorProp,
  formatValue = (n) => String(Math.round(n)),
  showDots = true,
}: Props) {
  const { colors } = useTheme();
  const color = colorProp ?? colors.primary;

  const { values, max, min } = useMemo(() => {
    const v = data.map((d) => d.value);
    const lo = Math.min(0, ...v);
    const hi = Math.max(1, ...v);
    return { values: v, max: hi, min: lo };
  }, [data]);

  return (
    <View>
      <ChartSvg
        values={values}
        height={height}
        color={color}
        min={min}
        max={max}
        showDots={showDots}
      />
      <View className="mt-2 flex-row justify-between px-1">
        {data.map((d, i) => (
          <View key={`x-${i}`} className="min-w-0 flex-1 items-center">
            {d.label ? (
              <Text
                className="text-[10px] text-muted-foreground dark:text-d-muted"
                numberOfLines={1}
              >
                {d.label}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
      <View className="mt-1 flex-row justify-between px-1">
        <Text className="text-[10px] text-muted-foreground dark:text-d-muted">
          {formatValue(min)}
        </Text>
        <Text className="text-[10px] text-muted-foreground dark:text-d-muted">
          {formatValue(max)}
        </Text>
      </View>
    </View>
  );
}

function ChartSvg({
  values,
  height,
  color,
  min,
  max,
  showDots,
}: {
  values: number[];
  height: number;
  color: string;
  min: number;
  max: number;
  showDots: boolean;
}) {
  return (
    <View style={{ width: "100%", height }}>
      <ChartCanvas
        values={values}
        height={height}
        color={color}
        min={min}
        max={max}
        showDots={showDots}
      />
    </View>
  );
}

function ChartCanvas({
  values,
  height,
  color,
  min,
  max,
  showDots,
}: {
  values: number[];
  height: number;
  color: string;
  min: number;
  max: number;
  showDots: boolean;
}) {
  // Use viewBox so the chart adapts to whatever width its container provides.
  const VB_WIDTH = 320;
  const innerW = VB_WIDTH - PADDING_X * 2;
  const innerH = height - PADDING_TOP - PADDING_BOTTOM;
  const span = Math.max(1, max - min);
  const step = values.length > 1 ? innerW / (values.length - 1) : innerW;

  const points = values.map((v, i) => ({
    x: PADDING_X + i * step,
    y: PADDING_TOP + innerH - ((v - min) / span) * innerH,
  }));

  const linePath = smoothPath(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1]?.x ?? PADDING_X} ${PADDING_TOP + innerH}` +
    ` L ${points[0]?.x ?? PADDING_X} ${PADDING_TOP + innerH} Z`;

  return (
    <Svg
      viewBox={`0 0 ${VB_WIDTH} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id="lcFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.35} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {points.length > 0 ? (
        <>
          <Path d={areaPath} fill="url(#lcFill)" />
          <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {showDots
            ? points.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />)
            : null}
        </>
      ) : null}
    </Svg>
  );
}

/** Catmull–Rom → cubic Bezier path (smooth line). */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

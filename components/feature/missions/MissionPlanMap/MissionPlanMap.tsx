import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { MissionMapCurrentNode } from "@/components/feature/missions/MissionMapCurrentNode";
import { missionPlanLabel } from "@/constants/progress/plan";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useTheme } from "@/context/ThemeContext";
import type { MissionMapDay } from "@/hooks/progress/useMissionPlan";

type Props = {
  days: MissionMapDay[];
  currentDay: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onLockedDayPress?: (day: number) => void;
};

const NODE = 52;
const CURRENT_NODE = 76;
const ROW = 96;
const PAD_X = 28;

function columnForIndex(index: number): 0 | 1 | 2 {
  return (index % 3) as 0 | 1 | 2;
}

function nodeCenter(index: number, width: number, isCurrent: boolean): { x: number; y: number } {
  const col = columnForIndex(index);
  const size = isCurrent ? CURRENT_NODE : NODE;
  const x =
    col === 0
      ? PAD_X + size / 2
      : col === 1
        ? width / 2
        : width - PAD_X - size / 2;
  const y = index * ROW + size / 2 + 16;
  return { x, y };
}

function pathBetween(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

export function MissionPlanMap({
  days,
  currentDay,
  selectedDay,
  onSelectDay,
  onLockedDayPress,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const height = days.length * ROW + 24;

  const centers =
    width > 0
      ? days.map((day, i) => nodeCenter(i, width, day.day === currentDay))
      : [];

  return (
    <View
      className="mt-4"
      onLayout={(e) => {
        const w = Math.round(e.nativeEvent.layout.width);
        if (w > 0 && w !== width) setWidth(w);
      }}
    >
      {width > 0 ? (
        <View style={{ position: "absolute" }}>
          <Svg width={width} height={height}>
            {centers.slice(0, -1).map((from, i) => {
              const to = centers[i + 1];
              const locked = days[i + 1]?.status === "locked";
              return (
                <Path
                  key={`path-${i}`}
                  d={pathBetween(from, to)}
                  stroke={locked ? colors.mutedForeground : colors.primary}
                  strokeWidth={3}
                  strokeOpacity={locked ? 0.25 : 0.35}
                  fill="none"
                  strokeDasharray={locked ? "6 8" : undefined}
                />
              );
            })}
          </Svg>
        </View>
      ) : null}

      <View style={{ height }}>
        {days.map((day, index) => {
          const col = columnForIndex(index);
          const align =
            col === 0 ? "items-start" : col === 1 ? "items-center" : "items-end";
          const locked = day.status === "locked";
          const selected = day.day === selectedDay;
          const isCurrent = day.status === "current";
          const complete = day.status === "complete";

          const onPress = () => {
            if (locked) {
              onLockedDayPress?.(day.day);
              return;
            }
            onSelectDay(day.day);
          };

          const planLabel = missionPlanLabel(day.day, t);

          if (isCurrent) {
            return (
              <View
                key={day.day}
                className={`px-7 ${align}`}
                style={{ height: ROW, justifyContent: "center" }}
              >
                <MissionMapCurrentNode day={day.day} onPress={onPress} />
              </View>
            );
          }

          let bg = colors.section;
          let border = "transparent";
          let labelColor = colors.primary;
          let borderWidth = 0;

          if (locked) {
            bg = colors.section;
            labelColor = colors.mutedForeground;
          } else if (complete) {
            bg = colors.accent;
            labelColor = colors.white;
          } else {
            bg = colors.background;
            border = colors.primary;
          }

          if (selected && !locked) {
            border = colors.primary;
            borderWidth = 3;
          }

          return (
            <View
              key={day.day}
              className={`px-7 ${align}`}
              style={{ height: ROW, justifyContent: "center" }}
            >
              <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={planLabel}
                accessibilityState={{ selected, disabled: locked }}
                className="items-center active:opacity-80"
              >
                <View
                  style={{
                    width: NODE,
                    height: NODE,
                    borderRadius: NODE / 2,
                    backgroundColor: bg,
                    borderWidth,
                    borderColor: border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {locked ? (
                    <Ionicons name="lock-closed" size={20} color={colors.mutedForeground} />
                  ) : (
                    <Text className="text-base font-bold" style={{ color: labelColor }}>
                      {day.day}
                    </Text>
                  )}
                </View>
                {!locked ? (
                  <Text
                    numberOfLines={2}
                    className={`mt-1.5 max-w-[132px] text-center text-[10px] font-semibold leading-3 ${
                      selected
                        ? "text-foreground dark:text-d-text"
                        : "text-muted-foreground dark:text-d-muted"
                    }`}
                  >
                    {planLabel}
                  </Text>
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

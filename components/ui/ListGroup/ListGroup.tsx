import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { ListRow } from "@/types";

export type { ListRow } from "@/types";

type Props = {
  rows: ListRow[];
  className?: string;
};

export function ListGroup({ rows, className }: Props) {
  const { colors } = useTheme();
  const tint = (destructive?: boolean) =>
    destructive ? colors.alert : colors.primary;

  return (
    <View className={`overflow-hidden rounded-3xl bg-section dark:bg-d-surface ${className ?? ""}`}>
      {rows.map((row, idx) => {
        const iconTint = tint(row.destructive);
        const labelClass = row.destructive
          ? "text-alert"
          : "text-foreground dark:text-d-text";

        const Inner = (
          <View className="flex-row items-center px-4 py-4">
            <View
              className="h-9 w-9 items-center justify-center rounded-full bg-background dark:bg-d-elevated"
              style={{ borderColor: colors.section, borderWidth: 1 }}
            >
              <Ionicons name={row.icon} size={18} color={iconTint} />
            </View>

            <Text className={`ml-3 flex-1 text-base font-medium ${labelClass}`}>{row.label}</Text>

            {row.badge ? (
              <View className="mr-2 rounded-full bg-primary px-2 py-0.5">
                <Text className="text-[10px] font-bold uppercase text-white">{row.badge}</Text>
              </View>
            ) : null}

            {row.value ? (
              <Text className="text-sm text-muted-foreground dark:text-d-muted">{row.value}</Text>
            ) : null}

            {row.onPress ? (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedForeground}
                style={{ marginLeft: 6 }}
              />
            ) : null}
          </View>
        );

        return (
          <View key={row.id}>
            {idx > 0 ? (
              <View className="ml-16 h-px bg-background dark:bg-d-border" />
            ) : null}
            {row.onPress ? (
              <Pressable
                onPress={row.onPress}
                android_ripple={{ color: colors.background }}
              >
                {Inner}
              </Pressable>
            ) : (
              Inner
            )}
          </View>
        );
      })}
    </View>
  );
}

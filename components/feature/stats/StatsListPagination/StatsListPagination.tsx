import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function StatsListPagination({ page, totalPages, onPageChange }: Props) {
  const { colors } = useTheme();

  if (totalPages <= 1) return null;

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <View className="mt-3 flex-row items-center justify-between">
      <Pressable
        onPress={() => canGoBack && onPageChange(page - 1)}
        disabled={!canGoBack}
        className={`h-9 w-9 items-center justify-center rounded-xl bg-background dark:bg-d-elevated ${
          canGoBack ? "active:opacity-80" : "opacity-40"
        }`}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
      >
        <Ionicons name="chevron-back" size={18} color={colors.foreground} />
      </Pressable>

      <Text className="text-sm font-medium text-muted-foreground dark:text-d-muted">
        Page {page} of {totalPages}
      </Text>

      <Pressable
        onPress={() => canGoForward && onPageChange(page + 1)}
        disabled={!canGoForward}
        className={`h-9 w-9 items-center justify-center rounded-xl bg-background dark:bg-d-elevated ${
          canGoForward ? "active:opacity-80" : "opacity-40"
        }`}
        accessibilityRole="button"
        accessibilityLabel="Next page"
      >
        <Ionicons name="chevron-forward" size={18} color={colors.foreground} />
      </Pressable>
    </View>
  );
}

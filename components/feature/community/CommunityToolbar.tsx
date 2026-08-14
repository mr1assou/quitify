import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  communityFeedFilterSummary,
  isDefaultCommunityFeedFilter,
} from "@/constants/community/communityFeedFilter";
import { isSupportRole } from "@/constants/auth/userRoles";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { CommunityFeedFilter } from "@/types/community/communityFeedFilter";
import { safeRouter } from "@/utils/app/safeRouter";

import { CommunityFeedFilterModal } from "./CommunityFeedFilterModal";

type ToolbarAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  onPress: () => void;
};

type Props = {
  filter: CommunityFeedFilter;
  onFilterChange: (filter: CommunityFeedFilter) => void;
};

export function CommunityToolbar({ filter, onFilterChange }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { state: appState } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterActive = !isDefaultCommunityFeedFilter(filter.sort, filter.tagId);
  const isSupportStaff = isSupportRole(appState.account?.role);

  const actions: ToolbarAction[] = useMemo(
    () => [
      ...(isSupportStaff
        ? [
            {
              icon: "flag-outline",
              label: "Reported posts",
              onPress: () => safeRouter.push("/reported-posts"),
            } satisfies ToolbarAction,
          ]
        : []),
      {
        icon: "add-outline",
        label: t("common.post"),
        onPress: () => safeRouter.push("/post-composer"),
      },
      {
        icon: "search-outline",
        label: t("common.search"),
        onPress: () => safeRouter.push("/community-search"),
      },
    ],
    [isSupportStaff, t],
  );

  return (
    <>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-3">
        <Pressable
          onPress={() => setFilterOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t("community.filterPosts")}
          className="h-10 max-w-[52%] flex-row items-center rounded-full bg-section px-3 dark:bg-d-surface"
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={filterActive ? colors.primary : colors.mutedForeground}
          />
          <Text
            className="ml-1.5 flex-1 text-xs font-semibold"
            numberOfLines={1}
            style={{ color: filterActive ? colors.primary : colors.foreground }}
          >
            {communityFeedFilterSummary(filter.sort, filter.tagId, t)}
          </Text>
          {filterActive ? (
            <View
              className="ml-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          ) : null}
        </Pressable>

        <View className="flex-row items-center gap-1">
          {actions.map((action) => (
            <ToolbarIcon key={action.label} action={action} colors={colors} />
          ))}
        </View>
      </View>

      <CommunityFeedFilterModal
        visible={filterOpen}
        filter={filter}
        onApply={onFilterChange}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}

function ToolbarIcon({
  action,
  colors,
}: {
  action: ToolbarAction;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Pressable
      onPress={action.onPress}
      accessibilityRole="button"
      accessibilityLabel={action.label}
      className="relative h-10 w-10 items-center justify-center rounded-full active:opacity-80"
    >
      <Ionicons name={action.icon} size={22} color={colors.mutedForeground} />
      {action.badge != null && action.badge > 0 ? (
        <View
          className="absolute -right-1 -top-1 min-h-[16px] min-w-[16px] items-center justify-center rounded-full px-1"
          style={{ backgroundColor: colors.alert }}
        >
          <Text className="text-[10px] font-bold leading-none text-white">
            {action.badge > 9 ? "9+" : action.badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

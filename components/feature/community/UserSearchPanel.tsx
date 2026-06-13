import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { UserResultRow } from "@/components/feature/community/UserResultRow";
import { COMMUNITY_USERS } from "@/constants/communityUsers";
import { useTheme } from "@/context/ThemeContext";
import type { CommunityUser } from "@/types/community";
import { normalizeSearch } from "@/utils/community";

/**
 * Match community users by username (@handle), display name, or internal id.
 */
function searchUsersByUsername(rawQuery: string): CommunityUser[] {
  const needle = normalizeSearch(rawQuery.replace(/^@/, ""));
  if (!needle) return [];

  return COMMUNITY_USERS.filter((u) => {
    if (u.isCurrentUser) return false;
    return [u.handle, u.id, u.name]
      .map(normalizeSearch)
      .some((field) => field.includes(needle));
  });
}

export function UserSearchPanel() {
  const [query, setQuery] = useState("");
  const { colors } = useTheme();
  const trimmed = query.trim();

  const results = useMemo(() => searchUsersByUsername(trimmed), [trimmed]);

  return (
    <View className="px-6 pt-2">
      <View className="flex-row items-center rounded-xl bg-section px-3 py-2 dark:bg-d-surface">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Enter username"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ flex: 1, color: colors.foreground, fontSize: 14, paddingVertical: 4 }}
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <Ionicons
            name="close-circle"
            size={16}
            color={colors.mutedForeground}
            onPress={() => setQuery("")}
          />
        ) : null}
      </View>

      {!trimmed ? (
        <EmptyState icon="search" title="Find someone by username" />
      ) : results.length === 0 ? (
        <EmptyState
          icon="alert-circle-outline"
          title="No user found"
          subtitle={`Nothing matches “${trimmed}”. Double-check the username.`}
        />
      ) : (
        <View className="mt-4 gap-2">
          {results.map((user) => (
            <UserResultRow key={user.id} user={user} trailing="message" />
          ))}
        </View>
      )}
    </View>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View className="mt-10 items-center px-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-section dark:bg-d-surface">
        <Ionicons name={icon} size={24} color={colors.mutedForeground} />
      </View>
      <Text className="mt-3 text-base font-bold text-foreground dark:text-d-text">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

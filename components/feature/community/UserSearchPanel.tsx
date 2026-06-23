import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { SearchUserResultRow } from "@/components/feature/community/SearchUserResultRow";
import { useTheme } from "@/context/ThemeContext";
import { useUserSearch } from "@/hooks/community/useUserSearch";
import {
  sanitizeUsernameSearchInput,
  USERNAME_SEARCH_MIN_LENGTH,
} from "@/utils/community/usernameSearch";

export function UserSearchPanel() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const { debouncedQuery, users, loading, error, isQueryTooShort } = useUserSearch(query);

  const showHint = debouncedQuery.length === 0;
  const showTooShort = isQueryTooShort;
  const showLoading = !showHint && !showTooShort && loading;
  const showResults = !showHint && !showTooShort && !loading && !error && users.length > 0;
  const showEmpty =
    !showHint && !showTooShort && !loading && !error && users.length === 0;
  const showError = !showHint && !showTooShort && !loading && Boolean(error);

  return (
    <View className="px-6 pt-2">
      <View className="flex-row items-center rounded-xl bg-section px-3 py-2 dark:bg-d-surface">
        <TextInput
          value={query}
          onChangeText={(text) => setQuery(sanitizeUsernameSearchInput(text))}
          placeholder="Enter username"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ flex: 1, color: colors.foreground, fontSize: 14, paddingVertical: 4 }}
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      {showHint ? (
        <EmptyState icon="search" title="Find someone by username" />
      ) : null}

      {showTooShort ? (
        <EmptyState
          icon="text-outline"
          title={`Type at least ${USERNAME_SEARCH_MIN_LENGTH} characters`}
          subtitle="Usernames are lowercase."
        />
      ) : null}

      {showLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}

      {showError ? (
        <EmptyState icon="alert-circle-outline" title="Search failed" subtitle={error ?? undefined} />
      ) : null}

      {showEmpty ? (
        <EmptyState
          icon="alert-circle-outline"
          title="No user found"
          subtitle={`Nothing matches “${debouncedQuery}”. Double-check the username.`}
        />
      ) : null}

      {showResults ? (
        <View className="mt-4 gap-2">
          {users.map((user) => (
            <SearchUserResultRow key={user.id} user={user} />
          ))}
        </View>
      ) : null}
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

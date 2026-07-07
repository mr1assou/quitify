import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";
import {
  countryFlagForRank,
  resolveCountryFlagUrl,
} from "@/constants/leaderboard/leaderboardCountries";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { fetchChatThreadsPage } from "@/services/chat/chatApi";
import type { BackendChatThreadSummary } from "@/types/chat/chatApi";
import type { CommunityUser } from "@/types/community/community";
import { safeRouter } from "@/utils/app/safeRouter";
import { buildSharedPostChatMessage } from "@/utils/chat/sharedPostMessage";
import { mapBackendThreadSummary } from "@/utils/chat/mapBackendChat";
import { resolveChatParticipant } from "@/utils/chat/resolveChatParticipant";
import { parseDbUserId, resolveOnlineFromMap } from "@/utils/community/presence";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import { getBadgeName } from "@/utils/progress/badges";

const RECIPIENTS_PAGE_SIZE = 10;

function mapThreadRecipient(
  summary: BackendChatThreadSummary,
  currentUserId: number,
  authorsById: Record<string, CommunityUser>,
): CommunityUser {
  const mapped = mapBackendThreadSummary(summary, currentUserId);
  return (
    resolveChatParticipant(
      mapped.participant.id,
      authorsById,
      getLeaderboardCache(),
    ) ?? mapped.participant
  );
}

export default function SharePostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { state, sendMessage, share } = useCommunity();
  const currentUserId = appState.account?.userId ?? null;

  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);

  const post = useMemo(() => state.posts.find((item) => item.id === id), [id, state.posts]);
  const canSend = selectedUserIds.length > 0 && !sending;

  const loadRecipients = useCallback(
    async (reset: boolean) => {
      if (!currentUserId) {
        setUsers([]);
        hasMoreRef.current = false;
        return;
      }

      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
        hasMoreRef.current = false;
      } else {
        if (loadingMoreRef.current || !hasMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }

      setError(null);

      try {
        const page = await fetchChatThreadsPage(offsetRef.current, RECIPIENTS_PAGE_SIZE);
        const mapped = page.items.map((row) =>
          mapThreadRecipient(row, currentUserId, state.authorsById),
        );

        setUsers((current) => (reset ? mapped : [...current, ...mapped]));
        hasMoreRef.current = page.has_more;
        offsetRef.current += mapped.length;
      } catch {
        setError("Could not load people you have chatted with.");
        if (reset) setUsers([]);
      } finally {
        if (reset) setLoading(false);
        else {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        }
      }
    },
    [currentUserId, state.authorsById],
  );

  useFocusEffect(
    useCallback(() => {
      setSelectedUserIds([]);
      void loadRecipients(true);
    }, [loadRecipients]),
  );

  const toggleUser = (userId: string) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((idValue) => idValue !== userId)
        : [...current, userId],
    );
  };

  const handleSend = async () => {
    if (!canSend || !id) return;
    setSending(true);
    setError(null);
    const text = buildSharedPostChatMessage(id, post?.title, post?.text);

    try {
      await Promise.all(selectedUserIds.map((userId) => sendMessage(userId, text)));
      await share(id);
      safeRouter.backOr("/(tabs)/community");
    } catch {
      setError("Could not send post right now. Please try again.");
      setSending(false);
    }
  };

  const listBottomPadding = selectedUserIds.length > 0 ? 120 : 32;

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <StackScreenHeader title="Send post" />

      <View className="px-6 pt-2 pb-1">
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          People you have chatted with
        </Text>
      </View>

      {loading ? (
        <View className="mt-8 items-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: listBottomPadding,
          }}
          renderItem={({ item }) => (
            <ShareUserRow
              user={item}
              selected={selectedUserIds.includes(item.id)}
              onToggle={() => toggleUser(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          onEndReached={() => void loadRecipients(false)}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <View className="items-center py-4">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
        />
      ) : (
        <View className="mt-10 items-center px-6">
          <Ionicons name="chatbubbles-outline" size={40} color={colors.mutedForeground} />
          <Text className="mt-3 text-center text-base font-semibold text-foreground dark:text-d-text">
            No chats yet
          </Text>
          <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
            Start a conversation from Chats first, then you can send posts here.
          </Text>
        </View>
      )}

      {error ? (
        <View className="px-6 pb-2">
          <Text className="text-sm text-alert">{error}</Text>
        </View>
      ) : null}

      {selectedUserIds.length > 0 ? (
        <View className="border-t border-section px-6 pb-6 pt-3 dark:border-d-border">
          <Pressable
            accessibilityRole="button"
            disabled={!canSend}
            onPress={() => void handleSend()}
            className={`items-center rounded-2xl py-3.5 ${canSend ? "bg-primary" : "bg-muted opacity-60"}`}
          >
            <Text className="text-base font-bold text-white">
              {sending
                ? "Sending..."
                : `Send to ${selectedUserIds.length} ${selectedUserIds.length === 1 ? "person" : "people"}`}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScreenCanvas>
  );
}

function ShareUserRow({
  user,
  selected,
  onToggle,
}: {
  user: CommunityUser;
  selected: boolean;
  onToggle: () => void;
}) {
  const { colors } = useTheme();
  const { state: communityState } = useCommunity();
  const badgeName = getBadgeName(user.badgeId);
  const userId = parseDbUserId(user.id);
  const isOnlineResolved =
    (userId != null
      ? resolveOnlineFromMap(
          user.id,
          communityState.onlineByUserId,
          user.isOnline,
          communityState.presenceReady,
        )
      : user.isOnline) ?? false;
  const countryFlag =
    resolveCountryFlagUrl(user.countryFlag, user.countryCode) ??
    countryFlagForRank(user.avatarRank);
  const avatarRank = user.leaderboardRank || user.avatarRank || 1;

  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center rounded-2xl px-3 py-3 ${
        selected ? "bg-accent/10 dark:bg-primary/20" : "bg-section dark:bg-d-surface"
      }`}
    >
      <LeaderboardAvatar
        name={user.name}
        isCurrentUser={!!user.isCurrentUser}
        rank={avatarRank}
        countryFlag={countryFlag}
        imageUrl={user.avatarUrl}
        size={48}
        isOnline={isOnlineResolved}
      />
      <View className="ml-3 flex-1">
        <Text
          className="text-base font-bold text-foreground dark:text-d-text"
          numberOfLines={1}
        >
          {user.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <BadgeArt badgeId={user.badgeId} size={22} />
          <Text
            className="flex-1 text-xs font-semibold text-muted-foreground dark:text-d-muted"
            numberOfLines={1}
          >
            {badgeName}
          </Text>
        </View>
      </View>
      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={22}
        color={selected ? colors.accent : colors.mutedForeground}
      />
    </Pressable>
  );
}

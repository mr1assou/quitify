import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ChatHeader } from "@/components/feature/chat/ChatHeader";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { openChatAndNavigate } from "@/utils/chat/openChatNavigation";
import { resolveChatParticipant } from "@/utils/chat/resolveChatParticipant";
import { parseDbUserId } from "@/utils/community/presence";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import { safeRouter } from "@/utils/app/safeRouter";

function resolveRouteParam(raw: string | string[] | undefined): string | null {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && typeof raw[0] === "string" && raw[0].trim()) {
    return raw[0].trim();
  }
  return null;
}

function resolvePeerUserId(raw: string | string[] | undefined): number | null {
  const param = resolveRouteParam(raw);
  if (!param) return null;

  const fromDb = parseDbUserId(param);
  if (fromDb) return fromDb;

  const numeric = Number.parseInt(param, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

/**
 * Opens (or creates) a 1:1 chat thread for the given participant id,
 * then replaces with `/chat/<threadId>`.
 * Renders the same chrome as the chat room so navigation feels direct.
 */
export default function ChatByUserScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const peerUserId = resolvePeerUserId(params.id);
  const { colors } = useTheme();
  const { state, openChatThreadWithPeer, upsertAuthor } = useCommunity();
  const startedRef = useRef<number | null>(null);

  const participantId = peerUserId ? `db-${peerUserId}` : null;
  const participant = participantId
    ? resolveChatParticipant(
        participantId,
        state.authorsById,
        getLeaderboardCache(),
      ) ?? state.authorsById[participantId]
    : null;

  useEffect(() => {
    if (!peerUserId || !participantId) return;
    if (startedRef.current === peerUserId) return;
    startedRef.current = peerUserId;

    const resolved =
      resolveChatParticipant(
        participantId,
        state.authorsById,
        getLeaderboardCache(),
      ) ?? state.authorsById[participantId];
    if (resolved) upsertAuthor(resolved);

    void openChatAndNavigate(peerUserId, openChatThreadWithPeer, {
      mode: "replace",
      onFailure: () => {
        startedRef.current = null;
        safeRouter.backOr("/chats");
      },
    });
    // Intentionally run once per peer — do not re-open when authors update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerUserId, participantId, openChatThreadWithPeer, upsertAuthor]);

  return (
    <ScreenCanvas edges={["top"]}>
      {participant ? (
        <ChatHeader participant={participant} />
      ) : (
        <ChatHeaderPlaceholder />
      )}

      <View className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          Loading messages…
        </Text>
      </View>
    </ScreenCanvas>
  );
}

function ChatHeaderPlaceholder() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center border-b border-section py-3 pl-1 pr-4 dark:border-d-border">
      <Pressable
        hitSlop={10}
        onPress={() => safeRouter.backOr("/chats")}
        className="mr-0.5 w-7 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={20} color={colors.foreground} />
      </Pressable>
      <View className="ml-2 h-10 w-10 rounded-full bg-section dark:bg-d-surface" />
      <View className="ml-2.5 gap-1.5">
        <View className="h-3.5 w-28 rounded bg-section dark:bg-d-surface" />
        <View className="h-3 w-20 rounded bg-section dark:bg-d-surface" />
      </View>
    </View>
  );
}

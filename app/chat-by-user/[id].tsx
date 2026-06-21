import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";

import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useCommunity } from "@/context/CommunityContext";
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
 */
export default function ChatByUserScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const peerUserId = resolvePeerUserId(params.id);
  const { state, openChatThreadWithPeer, upsertAuthor } = useCommunity();
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!peerUserId) return;
    if (startedRef.current === peerUserId) return;
    startedRef.current = peerUserId;

    const participantId = `db-${peerUserId}`;
    const participant = resolveChatParticipant(
      participantId,
      state.authorsById,
      getLeaderboardCache(),
    );
    if (participant) upsertAuthor(participant);

    void openChatAndNavigate(peerUserId, openChatThreadWithPeer, {
      mode: "replace",
      onFailure: () => {
        startedRef.current = null;
        safeRouter.backOr("/chats");
      },
    });
  }, [peerUserId, openChatThreadWithPeer, state.authorsById, upsertAuthor]);

  return <ThemedLoadingScreen />;
}

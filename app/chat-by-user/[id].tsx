import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useCommunity } from "@/context/CommunityContext";
import { resolveChatParticipant } from "@/utils/chat/resolveChatParticipant";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";

/**
 * Opens (or creates) a 1:1 chat thread for the given participant id,
 * then replaces with `/chat/<threadId>`.
 */
export default function ChatByUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, openChatThread } = useCommunity();

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    const participant = resolveChatParticipant(
      id,
      state.authorsById,
      getLeaderboardCache(),
    );
    if (!participant) {
      router.back();
      return;
    }

    const threadId = openChatThread(id);
    router.replace(`/chat/${threadId}`);
  }, [id, openChatThread, state.authorsById]);

  return <ThemedLoadingScreen />;
}

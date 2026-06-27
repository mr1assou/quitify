import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import type { CommunityUser } from "@/types/community/community";
import { resolveChatParticipant } from "@/utils/chat/resolveChatParticipant";
import { buildCurrentUserCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";

export function useCallParticipants(participantId: string | undefined): {
  peer: CommunityUser | null;
  self: CommunityUser;
} {
  const { state } = useCommunity();
  const { state: appState } = useApp();
  const leaderboard = getLeaderboardCache();

  const peer = useMemo(() => {
    if (!participantId) return null;
    return (
      resolveChatParticipant(
        participantId,
        state.authorsById,
        leaderboard,
      ) ?? state.authorsById[participantId] ?? null
    );
  }, [participantId, state.authorsById, leaderboard]);

  const self = useMemo(
    () =>
      buildCurrentUserCommunityAuthor(
        appState.profile,
        appState.account?.name,
        appState.account?.userId,
      ),
    [appState.account?.name, appState.account?.userId, appState.profile],
  );

  return { peer, self };
}

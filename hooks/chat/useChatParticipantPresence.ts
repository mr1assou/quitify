import { useEffect, useMemo, useState } from "react";

import { useCommunity } from "@/context/CommunityContext";
import { fetchUserPresence } from "@/services/users/userProfileApi";
import type { CommunityUser } from "@/types/community/community";
import { parseDbUserId, resolveOnlineFromMap } from "@/utils/community/presence";

function parseLastOfflineAt(iso: string | null | undefined): number | undefined {
  if (!iso) return undefined;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : undefined;
}

/** Live online status + last seen for a chat participant (DB users fetch from API). */
export function useChatParticipantPresence(participant: CommunityUser) {
  const { state } = useCommunity();
  const userId = parseDbUserId(participant.id);
  const [lastSeenAt, setLastSeenAt] = useState<number | undefined>(participant.lastSeenAt);

  const isOnline = useMemo(() => {
    if (participant.isCurrentUser) return true;
    const live = resolveOnlineFromMap(
      participant.id,
      state.onlineByUserId,
      participant.isOnline,
      state.presenceReady,
    );
    return live ?? false;
  }, [
    participant.id,
    participant.isCurrentUser,
    participant.isOnline,
    state.onlineByUserId,
    state.presenceReady,
  ]);

  useEffect(() => {
    if (!userId) {
      setLastSeenAt(participant.lastSeenAt);
      return;
    }

    if (isOnline) {
      setLastSeenAt(undefined);
      return;
    }

    let cancelled = false;

    fetchUserPresence(userId)
      .then((presence) => {
        if (cancelled) return;
        setLastSeenAt(parseLastOfflineAt(presence.last_offline_at) ?? participant.lastSeenAt);
      })
      .catch(() => {
        if (!cancelled) setLastSeenAt(participant.lastSeenAt);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, isOnline, participant.lastSeenAt]);

  return { isOnline, lastSeenAt };
}

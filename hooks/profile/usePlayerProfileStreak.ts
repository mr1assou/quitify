import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/context/AppContext";
import { fetchUserStreak } from "@/services/users/userProfileApi";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { ProfileStreak } from "@/types/profile/profileStreak";
import { resolveProfileUserId } from "@/utils/profile/resolveProfileUserId";

function streakFromAppProfile(
  streakStart: number,
  attemptNumber: number,
): ProfileStreak {
  return { streakStart, attemptNumber };
}

function mapApiStreak(response: {
  streak_start: string | null;
  attempt_number: number;
  max_duration_ms: number;
}): ProfileStreak | undefined {
  if (!response.streak_start) return undefined;

  const streakStart = Date.parse(response.streak_start);
  if (!Number.isFinite(streakStart)) return undefined;

  return {
    streakStart,
    attemptNumber: response.attempt_number,
    maxDurationMs: response.max_duration_ms,
  };
}

/** Live streak stats for a player profile (current + best from quit attempts). */
export function usePlayerProfileStreak(
  profile: PlayerProfile | null | undefined,
): ProfileStreak | undefined {
  const { state } = useApp();
  const userId = resolveProfileUserId(profile, state.account?.userId);
  const [remoteStreak, setRemoteStreak] = useState<ProfileStreak | undefined>();

  const localStreak = useMemo(() => {
    if (!profile?.isCurrentUser || !state.profile) return undefined;
    return streakFromAppProfile(
      state.profile.streakStart,
      state.profile.currentAttemptNumber,
    );
  }, [profile?.isCurrentUser, state.profile]);

  useEffect(() => {
    if (!userId) {
      setRemoteStreak(undefined);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetchUserStreak(userId);
        if (cancelled) return;
        setRemoteStreak(mapApiStreak(response));
      } catch {
        if (!cancelled) setRemoteStreak(undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (remoteStreak) return remoteStreak;
  return localStreak;
}

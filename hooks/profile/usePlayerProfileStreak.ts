import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/context/AppContext";
import { fetchUserStreak } from "@/services/users/userProfileApi";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { ProfileStreak } from "@/types/profile/profileStreak";
import { resolveProfileUserId } from "@/utils/profile/resolveProfileUserId";

export type PlayerProfileStreakState = {
  streak?: ProfileStreak;
  memberSinceMs?: number;
};

function streakFromAppProfile(
  streakStart: number,
  attemptNumber: number,
): ProfileStreak {
  return { streakStart, attemptNumber };
}

function parseMemberSinceMs(memberSince?: string): number | undefined {
  if (!memberSince) return undefined;
  const parsed = Date.parse(memberSince);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function mapApiStreak(response: {
  streak_start: string | null;
  attempt_number: number;
  max_duration_ms: number;
  member_since?: string;
}): ProfileStreak | undefined {
  if (!response.streak_start) return undefined;

  const streakStart = Date.parse(response.streak_start);
  if (!Number.isFinite(streakStart)) return undefined;

  return {
    streakStart,
    attemptNumber: response.attempt_number,
    maxDurationMs: response.max_duration_ms,
    memberSinceMs: parseMemberSinceMs(response.member_since),
  };
}

/** Streak stats + member-since for a player profile. */
export function usePlayerProfileStreak(
  profile: PlayerProfile | null | undefined,
): PlayerProfileStreakState {
  const { state } = useApp();
  const userId = resolveProfileUserId(profile, state.account?.userId);
  const [remoteStreak, setRemoteStreak] = useState<ProfileStreak | undefined>();
  const [remoteMemberSinceMs, setRemoteMemberSinceMs] = useState<number | undefined>();

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
      setRemoteMemberSinceMs(undefined);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetchUserStreak(userId);
        if (cancelled) return;
        setRemoteStreak(mapApiStreak(response));
        setRemoteMemberSinceMs(parseMemberSinceMs(response.member_since));
      } catch {
        if (!cancelled) {
          setRemoteStreak(undefined);
          setRemoteMemberSinceMs(undefined);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const streak = useMemo((): ProfileStreak | undefined => {
    const base = remoteStreak ?? localStreak;
    if (!base) return undefined;

    // Home uses AppContext streakStart — keep profile in sync for the signed-in user.
    if (profile?.isCurrentUser && localStreak) {
      return {
        ...base,
        streakStart: localStreak.streakStart,
        attemptNumber: localStreak.attemptNumber,
      };
    }

    return base;
  }, [localStreak, profile?.isCurrentUser, remoteStreak]);
  const memberSinceMs =
    remoteMemberSinceMs ?? streak?.memberSinceMs ?? remoteStreak?.memberSinceMs;

  return { streak, memberSinceMs };
}

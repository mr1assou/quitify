import { getCommunityUser } from "@/constants/communityUsers";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard";
import type { CommunityUser } from "@/types/community";
import { dbAuthorId, parseDbUserId } from "@/utils/community/presence";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";
import { findLeaderboardEntryByUserId } from "@/utils/leaderboard/findLeaderboardEntry";

function mapLeaderboardEntryToCommunityUser(entry: LeaderboardEntry): CommunityUser {
  const id = entry.userId ? dbAuthorId(entry.userId) : `lb-${entry.rank}`;

  return {
    id,
    name: entry.name,
    handle: entry.name.trim().toLowerCase().replace(/\s+/g, "") || id,
    bio: "",
    smokeFreeDays: 0,
    badgeId: entry.badgeId,
    avatarUrl: entry.imageUrl,
    countryFlag: entry.countryFlag,
    avatarRank: entry.rank,
    leaderboardRank: entry.rank,
    isCurrentUser: entry.isCurrentUser,
    isOnline: entry.isOnline,
    location: entry.countryCode,
  };
}

export function resolveChatParticipant(
  participantId: string,
  authorsById: Record<string, CommunityUser>,
  leaderboardSnapshot?: LeaderboardSnapshot | null,
): CommunityUser | null {
  const fromAuthors = authorsById[participantId];
  if (fromAuthors) return withMockOnlineStatus(fromAuthors);

  const cached = getCommunityUser(participantId);
  if (cached) return withMockOnlineStatus(cached);

  const userId = parseDbUserId(participantId);
  if (userId && leaderboardSnapshot) {
    const entry = findLeaderboardEntryByUserId(leaderboardSnapshot, userId);
    if (entry) return withMockOnlineStatus(mapLeaderboardEntryToCommunityUser(entry));
  }

  return null;
}

import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import type { CommunityUser } from "@/types/community/community";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { safeRouter } from "@/utils/app/safeRouter";
import { dbAuthorId } from "@/utils/community/presence";
import { resolveProfileUserId } from "@/utils/profile/communityProfileLinks";

type Props = {
  profile: PlayerProfile;
};

function profileToCommunityUser(
  profile: PlayerProfile,
  peerUserId: number,
): CommunityUser {
  return {
    id: dbAuthorId(peerUserId),
    name: profile.name,
    handle: profile.name,
    bio: profile.bio,
    smokeFreeDays: profile.smokeFreeDays,
    badgeId: profile.badgeId,
    countryFlag: profile.countryFlag,
    avatarRank: profile.rank || 1,
    leaderboardRank: profile.rank,
    avatarUrl: profile.avatarUrl,
    isOnline: profile.isOnline,
  };
}

export function UserProfileActions({ profile }: Props) {
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { state, loadChatThreads, upsertAuthor } = useCommunity();

  // Prefetch threads so Message can jump straight to `/chat/<id>` like the chats list.
  useEffect(() => {
    if (profile.isCurrentUser) return;
    void loadChatThreads();
  }, [loadChatThreads, profile.isCurrentUser]);

  const onMessage = () => {
    if (profile.isCurrentUser) return;

    const peerUserId = resolveProfileUserId(profile, appState.account?.userId);
    if (!peerUserId) {
      Alert.alert(
        "Can't start chat",
        "This profile is not linked to a messaging account yet.",
      );
      return;
    }

    const participantId = dbAuthorId(peerUserId);
    upsertAuthor(profileToCommunityUser(profile, peerUserId));

    const existing = state.threads.find(
      (thread) => thread.participantId === participantId,
    );

    // Same as chats tab: navigate immediately — never wait on the button.
    if (existing) {
      safeRouter.pushStack(`/chat/${existing.id}`);
      return;
    }

    safeRouter.pushStack(`/chat-by-user/${peerUserId}`);
  };

  return (
    <View className="flex-row gap-3">
      <Pressable
        onPress={onMessage}
        className="flex-1 flex-row items-center justify-center rounded-full bg-primary py-3 active:opacity-80"
      >
        <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
        <Text className="ml-2 text-sm font-bold text-white">Message</Text>
      </Pressable>
    </View>
  );
}

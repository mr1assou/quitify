import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Share, Text, View } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { mapPlayerProfileToCommunityUser } from "@/utils/chat/mapPlayerProfileToCommunityUser";
import { navigateToChatThread, openChatAndNavigate } from "@/utils/chat/openChatNavigation";
import { dbAuthorId } from "@/utils/community/presence";
import { resolveProfileUserId } from "@/utils/profile/communityProfileLinks";

type Props = {
  profile: PlayerProfile;
};

export function UserProfileActions({ profile }: Props) {
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { upsertAuthor, openChatThreadWithPeer, state } = useCommunity();

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
    upsertAuthor(mapPlayerProfileToCommunityUser(profile, participantId));

    const existing = state.threads.find((thread) => thread.participantId === participantId);
    if (existing) {
      void navigateToChatThread(existing.id);
      return;
    }

    void openChatAndNavigate(peerUserId, openChatThreadWithPeer, {
      onFailure: () => {
        Alert.alert("Can't open chat", "Please try again.");
      },
    });
  };

  const onInvite = async () => {
    try {
      await Share.share({
        title: "Join me on Quitify",
        message: `${profile.name} invited you to join Quitify and quit smoking together!`,
      });
    } catch {
      Alert.alert("Invite", `Your invite to ${profile.name} is ready to share.`);
    }
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

      <Pressable
        onPress={() => void onInvite()}
        className="flex-1 flex-row items-center justify-center rounded-full border border-section py-3 active:opacity-80 dark:border-d-border"
      >
        <Ionicons name="person-add" size={18} color={colors.primary} />
        <Text className="ml-2 text-sm font-bold text-foreground dark:text-d-text">Invite</Text>
      </Pressable>
    </View>
  );
}

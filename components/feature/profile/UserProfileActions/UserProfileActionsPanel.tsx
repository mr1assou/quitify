import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { safeRouter } from "@/utils/app/safeRouter";
import { dbAuthorId } from "@/utils/community/presence";
import { resolveProfileUserId } from "@/utils/profile/communityProfileLinks";

type Props = {
  profile: PlayerProfile;
};

export function UserProfileActions({ profile }: Props) {
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { state } = useCommunity();

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

    // Navigate immediately. If we already have the thread, jump straight to it;
    // otherwise the bridge route opens/creates it and shows a themed loader.
    const participantId = dbAuthorId(peerUserId);
    const existing = state.threads.find(
      (thread) => thread.participantId === participantId,
    );
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

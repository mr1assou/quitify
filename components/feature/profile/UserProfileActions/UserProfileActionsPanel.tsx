import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Share, Text, View } from "react-native";

import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import type { PlayerProfile } from "@/types/playerProfile";
import { mapPlayerProfileToCommunityUser } from "@/utils/chat/mapPlayerProfileToCommunityUser";
import { resolveProfileCommunityUserId } from "@/utils/profile/communityProfileLinks";
import { safeRouter } from "@/utils/safeRouter";

type Props = {
  profile: PlayerProfile;
};

export function UserProfileActions({ profile }: Props) {
  const { colors } = useTheme();
  const { upsertAuthor } = useCommunity();

  const onMessage = () => {
    const participantId = resolveProfileCommunityUserId(profile);
    upsertAuthor(mapPlayerProfileToCommunityUser(profile, participantId));
    safeRouter.push(`/chat-by-user/${participantId}`);
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

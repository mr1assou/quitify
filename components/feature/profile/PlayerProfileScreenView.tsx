import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileScreenHeader } from "@/components/feature/profile/ProfileScreenHeader";
import { UserProfileContent } from "@/components/feature/profile/UserProfileContent";
import type { PlayerProfile } from "@/types/playerProfile";
import { safeRouter } from "@/utils/safeRouter";

type Props = {
  profile: PlayerProfile | null;
};

export function PlayerProfileScreen({ profile }: Props) {
  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
        <ProfileScreenHeader onClose={() => safeRouter.back()} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
            This profile is not available right now.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ProfileScreenHeader onClose={() => safeRouter.back()} />

        <View className="mt-2">
          <UserProfileContent profile={profile} showActions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

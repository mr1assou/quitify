import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileScreenHeader } from "@/components/feature/profile/ProfileScreenHeader";
import { SelfProfileSettings } from "@/components/feature/profile/SelfProfileSettings";
import { UserProfileContent } from "@/components/feature/profile/UserProfileContent";
import { useApp } from "@/context/AppContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { useSelfPlayerProfile } from "@/hooks/community/useSelfPlayerProfile";
import { useStats } from "@/hooks/stats/useStats";
import { navigateToSelfPlayerProfile } from "@/utils/profile/navigateToUserProfile";
import { safeRouter } from "@/utils/app/safeRouter";

export default function ProfileModal() {
  const { state, setPremium } = useApp();
  const signOut = useLogout();
  const stats = useStats();
  const playerProfile = useSelfPlayerProfile();
  const profile = state.profile;

  if (!profile || !playerProfile) return null;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ProfileScreenHeader
          title="Settings"
          variant="close"
          onClose={() => safeRouter.back()}
        />

        <View className="mt-2">
          <UserProfileContent
            profile={playerProfile}
            isPremium={state.isPremium}
            showActions={false}
            showStats={false}
            showActivity={false}
            heroVariant="menu"
            onHeroPress={() => navigateToSelfPlayerProfile(playerProfile.rank)}
          />
        </View>

        <View className="mt-8 gap-4 px-6">
          <SelfProfileSettings
            profile={profile}
            streakDays={stats?.streakDays ?? 0}
            isPremium={state.isPremium}
            accountEmail={state.account?.email}
            isSignedIn={!!state.account}
            onSignOut={() => void signOut()}
            onPremiumChange={setPremium}
          />
        </View>

        <Text className="mt-8 text-center text-xs text-muted-foreground dark:text-d-muted">
          Quit Smoking · v1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

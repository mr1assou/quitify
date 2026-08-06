import { ScrollView, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { ProfileScreenHeader } from "@/components/feature/profile/ProfileScreenHeader";
import { SelfProfileSettings } from "@/components/feature/profile/SelfProfileSettings";
import { UserProfileContent } from "@/components/feature/profile/UserProfileContent";
import { useApp } from "@/context/AppContext";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { useLogout } from "@/hooks/auth/useLogout";
import { useSelfPlayerProfile } from "@/hooks/community/useSelfPlayerProfile";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { navigateToSelfPlayerProfile } from "@/utils/profile/navigateToUserProfile";
import { safeRouter } from "@/utils/app/safeRouter";

export default function ProfileModal() {
  const { t } = useTranslation();
  const { state } = useApp();
  const isPremium = useIsPremium();
  const signOut = useLogout();
  const playerProfile = useSelfPlayerProfile();
  const profile = state.profile;

  if (!profile || !playerProfile) return null;

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ProfileScreenHeader
          title={t("profile.settings")}
          variant="close"
          onClose={() => safeRouter.back()}
        />

        <View className="mt-2">
          <UserProfileContent
            profile={playerProfile}
            isPremium={isPremium}
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
            isPremium={isPremium}
            accountEmail={state.account?.email}
            isSignedIn={!!state.account}
            onSignOut={() => void signOut()}
          />
        </View>
      </ScrollView>
    </ScreenCanvas>
  );
}

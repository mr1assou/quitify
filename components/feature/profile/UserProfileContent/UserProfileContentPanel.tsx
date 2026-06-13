import { View } from "react-native";

import { UserProfileActions } from "@/components/feature/profile/UserProfileActions";
import { UserProfileActivity } from "@/components/feature/profile/UserProfileActivity";
import { UserProfileHero } from "@/components/feature/profile/UserProfileHero";
import { UserProfileStatsGrid } from "@/components/feature/profile/UserProfileStatsGrid";
import type { PlayerProfile } from "@/types/playerProfile";
import type { ProfileStreak } from "@/types/profileStreak";

type Props = {
  profile: PlayerProfile;
  isPremium?: boolean;
  showActions?: boolean;
  showStats?: boolean;
  showActivity?: boolean;
  heroVariant?: "full" | "menu";
  onHeroPress?: () => void;
  onEditAvatarPress?: () => void;
  streak?: ProfileStreak;
};

export function UserProfileContent({
  profile,
  isPremium,
  showActions = true,
  showStats = true,
  showActivity = true,
  heroVariant = "full",
  onHeroPress,
  onEditAvatarPress,
  streak,
}: Props) {
  return (
    <View className="gap-4">
      <UserProfileHero
        profile={profile}
        isPremium={isPremium}
        variant={heroVariant}
        onProfilePress={onHeroPress}
        onEditAvatarPress={onEditAvatarPress}
      />

      {showActions && !profile.isCurrentUser ? (
        <View className="px-6">
          <UserProfileActions profile={profile} />
        </View>
      ) : null}

      {showStats ? (
        <View className="px-6">
          <UserProfileStatsGrid profile={profile} streak={streak} />
        </View>
      ) : null}

      {showActivity ? (
        <View className="px-6">
          <UserProfileActivity profile={profile} />
        </View>
      ) : null}
    </View>
  );
}

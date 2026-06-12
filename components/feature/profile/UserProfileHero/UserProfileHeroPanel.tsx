import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import type { PlayerProfile } from "@/types/playerProfile";
import { getBadgeName } from "@/utils/badges";

type Props = {
  profile: PlayerProfile;
  isPremium?: boolean;
  variant?: "full" | "menu";
  onProfilePress?: () => void;
};

export function UserProfileHero({
  profile,
  isPremium = false,
  variant = "full",
  onProfilePress,
}: Props) {
  const badgeName = getBadgeName(profile.badgeId);
  const avatarRank = profile.rank > 0 ? profile.rank : 1;

  if (variant === "menu") {
    return (
      <View className="items-center px-6">
        <Pressable
          onPress={onProfilePress}
          disabled={!onProfilePress}
          className="items-center active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={`View ${profile.name}'s profile`}
        >
          <LeaderboardAvatar
            name={profile.name}
            isCurrentUser={profile.isCurrentUser}
            rank={avatarRank}
            countryFlag={profile.countryFlag}
            size={96}
          />

          <Text className="mt-4 text-2xl font-bold text-foreground dark:text-d-text">
            {profile.name}
          </Text>
        </Pressable>

        <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">
          {profile.countryLabel}
          {` · ${isPremium ? "Premium member" : "Member"}`}
        </Text>
      </View>
    );
  }

  return (
    <View className="px-6">
      <View className="flex-row items-center gap-4">
        <LeaderboardAvatar
          name={profile.name}
          isCurrentUser={profile.isCurrentUser}
          rank={avatarRank}
          countryFlag={profile.countryFlag}
          size={88}
        />

        <View className="min-w-0 flex-1">
          <Text className="text-2xl font-bold text-foreground dark:text-d-text">
            {profile.name}
          </Text>

          <Text className="mt-0.5 text-sm text-muted-foreground dark:text-d-muted">
            {profile.countryLabel}
            {profile.isCurrentUser ? ` · ${isPremium ? "Premium member" : "Member"}` : ""}
          </Text>

          <View className="mt-3 flex-row items-center gap-2.5">
            <BadgeArt badgeId={profile.badgeId} size={44} />
            <View className="min-w-0 flex-1">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Current badge
              </Text>
              <Text className="text-base font-bold text-foreground dark:text-d-text">
                {badgeName}
              </Text>
              <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
                Member since {profile.memberSinceLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text className="mt-4 text-sm leading-5 text-foreground dark:text-d-text">
        {profile.bio}
      </Text>
    </View>
  );
}

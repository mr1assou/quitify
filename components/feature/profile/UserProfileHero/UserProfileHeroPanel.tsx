import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { PlayerProfile } from "@/types/playerProfile";
import { getBadgeName } from "@/utils/badges";

const ONLINE_COLOR = "#22C55E";

type Props = {
  profile: PlayerProfile;
  isPremium?: boolean;
  variant?: "full" | "menu";
  onProfilePress?: () => void;
  onEditAvatarPress?: () => void;
};

function presenceLabel(isOnline?: boolean): string | null {
  if (typeof isOnline !== "boolean") return null;
  return isOnline ? "Online" : "Offline";
}

function ProfileSubtitle({
  isOnline,
  suffix,
}: {
  isOnline?: boolean;
  suffix?: string;
}) {
  const { colors } = useTheme();
  const label = presenceLabel(isOnline);
  if (!label) return null;

  return (
    <Text className="text-sm">
      <Text style={{ color: isOnline ? ONLINE_COLOR : colors.mutedForeground }}>{label}</Text>
      {suffix ? (
        <Text className="text-muted-foreground dark:text-d-muted">{` · ${suffix}`}</Text>
      ) : null}
    </Text>
  );
}

export function UserProfileHero({
  profile,
  isPremium = false,
  variant = "full",
  onProfilePress,
  onEditAvatarPress,
}: Props) {
  const badgeName = getBadgeName(profile.badgeId);
  const avatarRank = profile.rank > 0 ? profile.rank : 1;
  const canEditAvatar = profile.isCurrentUser && Boolean(onEditAvatarPress);
  const showOnlineDot = typeof profile.isOnline === "boolean" && !canEditAvatar;

  const avatar = (
    <View>
      <LeaderboardAvatar
        name={profile.name}
        isCurrentUser={profile.isCurrentUser}
        rank={avatarRank}
        countryFlag={profile.countryFlag}
        imageUrl={profile.avatarUrl}
        size={variant === "menu" ? 96 : 88}
        isOnline={showOnlineDot ? profile.isOnline : undefined}
      />
      {canEditAvatar ? (
        <Pressable
          onPress={onEditAvatarPress}
          className="absolute bottom-0 right-0 z-10 h-8 w-8 items-center justify-center rounded-full bg-primary"
          accessibilityLabel="Change profile photo"
        >
          <Ionicons name="camera" size={16} color="#fff" />
        </Pressable>
      ) : null}
    </View>
  );

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
          {avatar}

          <Text className="mt-4 text-2xl font-bold text-foreground dark:text-d-text">
            {profile.name}
          </Text>
        </Pressable>

        <ProfileSubtitle
          isOnline={profile.isOnline}
          suffix={isPremium ? "Premium member" : "Member"}
        />
      </View>
    );
  }

  return (
    <View className="px-6">
      <View className="flex-row items-center gap-4">
        {avatar}

        <View className="min-w-0 flex-1">
          <Text className="text-2xl font-bold text-foreground dark:text-d-text">
            {profile.name}
          </Text>

          <ProfileSubtitle
            isOnline={profile.isOnline}
            suffix={
              profile.isCurrentUser ? (isPremium ? "Premium member" : "Member") : undefined
            }
          />

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

      {profile.bio ? (
        <Text className="mt-4 text-sm leading-5 text-foreground dark:text-d-text">
          {profile.bio}
        </Text>
      ) : null}
    </View>
  );
}

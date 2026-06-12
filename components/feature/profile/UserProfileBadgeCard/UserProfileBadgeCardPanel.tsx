import { Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import type { PlayerProfile } from "@/types/playerProfile";
import { getBadgeName } from "@/utils/badges";

type Props = {
  profile: PlayerProfile;
};

export function UserProfileBadgeCard({ profile }: Props) {
  const badgeName = getBadgeName(profile.badgeId);

  return (
    <Card variant="section">
      <View className="flex-row items-center">
        <BadgeArt badgeId={profile.badgeId} size={56} />
        <View className="ml-4 flex-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Highest badge
          </Text>
          <Text className="mt-0.5 text-lg font-bold text-foreground dark:text-d-text">
            {badgeName}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">
            Member since {profile.memberSinceLabel}
          </Text>
        </View>
      </View>
    </Card>
  );
}

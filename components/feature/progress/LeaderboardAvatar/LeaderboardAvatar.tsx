import { Image } from "expo-image";
import { View } from "react-native";

import { OnlineStatusDot } from "@/components/ui/OnlineStatusDot";
import { profileImageForRank } from "@/constants/leaderboard/leaderboardProfiles";
import {
  isDefaultProfileImagePath,
  resolveAvatarImageSource,
} from "@/utils/profile/resolveAvatarImageSource";

const DEFAULT_SIZE = 52;

type Props = {
  name: string;
  isCurrentUser: boolean;
  rank: number;
  countryFlag: string;
  size?: number;
  /** Custom uploaded avatar — falls back to rank-based placeholder. */
  imageUrl?: string | null;
  /** Horizontal offset for the country flag badge (default sits slightly outside bottom-left). */
  flagLeft?: number;
  /** UI-only online presence dot on the bottom-right of the avatar. */
  isOnline?: boolean;
};

function FlagBadge({ uri, size, label }: { uri: string; size: number; label: string }) {
  const inner = Math.max(14, size - 4);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri }}
          style={{ width: inner, height: inner * 0.7 }}
          contentFit="contain"
          contentPosition="center"
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

export function LeaderboardAvatar({
  name,
  isCurrentUser,
  rank,
  countryFlag,
  size = DEFAULT_SIZE,
  imageUrl,
  flagLeft = -1,
  isOnline,
}: Props) {
  const avatarSource = resolveAvatarImageSource(imageUrl);
  const source = avatarSource ?? profileImageForRank(rank);
  const usesRemoteImage = Boolean(
    imageUrl?.trim() && !isDefaultProfileImagePath(imageUrl),
  );
  const label = isCurrentUser ? "Your profile photo" : `${name} profile photo`;
  const flagSize = Math.round(size * 0.38);
  const statusDotSize = Math.max(9, Math.round(size * 0.26));

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
        }}
      >
        <Image
          source={source}
          style={{ width: size, height: size }}
          contentFit="cover"
          contentPosition={usesRemoteImage ? "center" : "top"}
          accessibilityLabel={label}
        />
      </View>

      <View style={{ position: "absolute", bottom: -1, left: flagLeft, zIndex: 1 }}>
        <FlagBadge uri={countryFlag} size={flagSize} label={`${name} country flag`} />
      </View>

      {typeof isOnline === "boolean" ? (
        <View style={{ position: "absolute", bottom: -1, right: -1, zIndex: 2 }}>
          <OnlineStatusDot isOnline={isOnline} size={statusDotSize} />
        </View>
      ) : null}
    </View>
  );
}

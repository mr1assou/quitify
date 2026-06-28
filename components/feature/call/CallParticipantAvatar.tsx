import { Image } from "expo-image";
import { View } from "react-native";

import { COMMUNITY_AVATAR_IMAGE, USER_AVATAR_IMAGE } from "@/constants/app/assets";
import {
  countryFlagForRank,
  resolveCountryFlagUrl,
} from "@/constants/leaderboard/leaderboardCountries";
import type { CommunityUser } from "@/types/community/community";
import { resolveAvatarImageSource } from "@/utils/profile/resolveAvatarImageSource";

type Props = {
  user: Pick<CommunityUser, "name" | "avatarUrl" | "isCurrentUser" | "countryFlag" | "location" | "avatarRank">;
  size: number;
  /** Soft brand ring around the avatar. */
  ring?: boolean;
  ringColor?: string;
  /** Show country flag badge on the avatar. */
  showFlag?: boolean;
};

function CountryFlagBadge({
  uri,
  size,
  label,
}: {
  uri: string;
  size: number;
  label: string;
}) {
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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

function resolveParticipantFlag(
  user: Pick<CommunityUser, "countryFlag" | "location" | "avatarRank">,
): string {
  return (
    resolveCountryFlagUrl(user.countryFlag, user.location) ??
    countryFlagForRank(user.avatarRank || 1)
  );
}

export function CallParticipantAvatar({
  user,
  size,
  ring = true,
  ringColor = "rgba(232, 93, 4, 0.55)",
  showFlag = false,
}: Props) {
  const source =
    resolveAvatarImageSource(user.avatarUrl) ??
    (user.isCurrentUser ? USER_AVATAR_IMAGE : COMMUNITY_AVATAR_IMAGE);

  const inner = ring ? size - 6 : size;
  const flagSize = Math.round(size * 0.34);
  const flagUri = resolveParticipantFlag(user);

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ring ? ringColor : "transparent",
          shadowColor: ringColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.45,
          shadowRadius: 18,
          elevation: 8,
        }}
      >
        <Image
          source={source}
          accessibilityLabel={`${user.name} profile photo`}
          style={{
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          contentFit="cover"
        />
      </View>

      {showFlag ? (
        <View style={{ position: "absolute", bottom: 0, left: 0, zIndex: 1 }}>
          <CountryFlagBadge
            uri={flagUri}
            size={flagSize}
            label={`${user.name} country flag`}
          />
        </View>
      ) : null}
    </View>
  );
}

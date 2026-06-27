import { Image } from "expo-image";
import { View } from "react-native";

import { COMMUNITY_AVATAR_IMAGE, USER_AVATAR_IMAGE } from "@/constants/app/assets";
import type { CommunityUser } from "@/types/community/community";
import { resolveAvatarImageSource } from "@/utils/profile/resolveAvatarImageSource";

type Props = {
  user: Pick<CommunityUser, "name" | "avatarUrl" | "isCurrentUser">;
  size: number;
  /** Soft brand ring around the avatar. */
  ring?: boolean;
  ringColor?: string;
};

export function CallParticipantAvatar({
  user,
  size,
  ring = true,
  ringColor = "rgba(232, 93, 4, 0.55)",
}: Props) {
  const source =
    resolveAvatarImageSource(user.avatarUrl) ??
    (user.isCurrentUser ? USER_AVATAR_IMAGE : COMMUNITY_AVATAR_IMAGE);

  const inner = ring ? size - 6 : size;

  return (
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
  );
}

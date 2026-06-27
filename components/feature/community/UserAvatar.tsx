import { Image } from "expo-image";
import { Image as RNImage, View } from "react-native";

import { OnlineStatusDot } from "@/components/ui/OnlineStatusDot";
import { COMMUNITY_AVATAR_IMAGE, USER_AVATAR_IMAGE } from "@/constants/app/assets";
import type { CommunityUser } from "@/types/community/community";
import { resolveAvatarImageSource } from "@/utils/profile/resolveAvatarImageSource";

type Props = {
  user: Pick<CommunityUser, "isCurrentUser" | "name" | "avatarUrl" | "isOnline">;
  size?: number;
  ringed?: boolean;
};

/** Round avatar — uses uploaded profile photo when available. */
export function UserAvatar({ user, size = 44, ringed = false }: Props) {
  const radius = size / 2;
  const ring = ringed ? 2 : 0;
  const inner = size - ring * 2;
  const innerRadius = inner / 2;
  const statusDotSize = Math.max(8, Math.round(size * 0.28));

  const imageStyle = {
    width: inner,
    height: inner,
    borderRadius: innerRadius,
    backgroundColor: "rgba(0,0,0,0.05)",
  } as const;

  const placeholderSource = user.isCurrentUser ? USER_AVATAR_IMAGE : COMMUNITY_AVATAR_IMAGE;
  const avatarSource = resolveAvatarImageSource(user.avatarUrl);

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          padding: ring,
          overflow: "hidden",
        }}
        className={ringed ? "bg-primary" : ""}
      >
        {avatarSource ? (
          <Image
            source={avatarSource}
            accessibilityLabel={`${user.name} avatar`}
            style={imageStyle}
            contentFit="cover"
          />
        ) : (
          <RNImage
            source={placeholderSource}
            accessibilityLabel={`${user.name} avatar`}
            style={imageStyle}
            resizeMode="cover"
          />
        )}
      </View>

      {typeof user.isOnline === "boolean" ? (
        <View style={{ position: "absolute", bottom: -1, right: -1, zIndex: 2 }}>
          <OnlineStatusDot isOnline={user.isOnline} size={statusDotSize} />
        </View>
      ) : null}
    </View>
  );
}

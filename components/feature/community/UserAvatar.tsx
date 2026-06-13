import { Image } from "expo-image";
import { Image as RNImage, View } from "react-native";

import { COMMUNITY_AVATAR_IMAGE, USER_AVATAR_IMAGE } from "@/constants/assets";
import type { CommunityUser } from "@/types/community";

type Props = {
  user: Pick<CommunityUser, "isCurrentUser" | "name" | "avatarUrl">;
  size?: number;
  ringed?: boolean;
};

/** Round avatar — uses uploaded profile photo when available. */
export function UserAvatar({ user, size = 44, ringed = false }: Props) {
  const radius = size / 2;
  const ring = ringed ? 2 : 0;
  const inner = size - ring * 2;
  const innerRadius = inner / 2;

  const imageStyle = {
    width: inner,
    height: inner,
    borderRadius: innerRadius,
    backgroundColor: "rgba(0,0,0,0.05)",
  } as const;

  const placeholderSource = user.isCurrentUser ? USER_AVATAR_IMAGE : COMMUNITY_AVATAR_IMAGE;

  return (
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
      {user.avatarUrl ? (
        <Image
          source={{ uri: user.avatarUrl }}
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
  );
}

import { Image, View } from "react-native";

import { COMMUNITY_AVATAR_IMAGE, USER_AVATAR_IMAGE } from "@/constants/assets";
import type { CommunityUser } from "@/types/community";

type Props = {
  user: Pick<CommunityUser, "isCurrentUser" | "name">;
  size?: number;
  ringed?: boolean;
};

/** Round avatar (yes.png for the current user, logo.png for everyone else). */
export function UserAvatar({ user, size = 44, ringed = false }: Props) {
  const source = user.isCurrentUser ? USER_AVATAR_IMAGE : COMMUNITY_AVATAR_IMAGE;
  const radius = size / 2;

  const ring = ringed ? 2 : 0;
  const inner = size - ring * 2;

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
      <Image
        source={source}
        accessibilityLabel={`${user.name} avatar`}
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          backgroundColor: "rgba(0,0,0,0.05)",
        }}
        resizeMode="cover"
      />
    </View>
  );
}

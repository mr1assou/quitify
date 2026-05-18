import { Image } from "react-native";

import { COMMUNITY_AVATAR_IMAGE, USER_AVATAR_IMAGE } from "@/constants/assets";

type Props = {
  name: string;
  isCurrentUser: boolean;
  size?: number;
};

export function LeaderboardAvatar({ name, isCurrentUser, size = 44 }: Props) {
  const source = isCurrentUser ? USER_AVATAR_IMAGE : COMMUNITY_AVATAR_IMAGE;
  const label = isCurrentUser ? "Your profile photo" : `${name} profile photo`;

  return (
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      accessibilityLabel={label}
    />
  );
}

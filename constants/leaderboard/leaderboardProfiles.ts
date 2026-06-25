import type { ImageSourcePropType } from "react-native";

/** Profile photos for synthetic global-rank players. */
export const LEADERBOARD_PROFILE_IMAGES: readonly ImageSourcePropType[] = [
  require("../../assets/images/profiles/profile1.webp"),
  require("../../assets/images/profiles/profile2.webp"),
];

export function profileImageForRank(rank: number): ImageSourcePropType {
  const index = Math.abs(rank - 1) % LEADERBOARD_PROFILE_IMAGES.length;
  return LEADERBOARD_PROFILE_IMAGES[index];
}

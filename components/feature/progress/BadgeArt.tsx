import { Image, View } from "react-native";

import { getBadgeImage } from "@/constants/progress/badgeImages";

type Props = {
  badgeId: string;
  size?: number;
};

/**
 * Uniform badge frame — assets may have different padding; we clip to a fixed
 * square so every badge reads at the same visual size.
 */
export function BadgeArt({ badgeId, size = 72 }: Props) {
  const source = getBadgeImage(badgeId);

  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="cover"
        accessibilityLabel={badgeId}
      />
    </View>
  );
}

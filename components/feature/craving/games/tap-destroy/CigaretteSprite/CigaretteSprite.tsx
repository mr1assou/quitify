import { Image, View } from "react-native";

import {
  TAP_DESTROY_CIGARETTE_HEIGHT,
  TAP_DESTROY_CIGARETTE_IMAGE,
  TAP_DESTROY_CIGARETTE_WIDTH,
} from "@/constants/craving/games/cravingGameAssets";

type Props = {
  /** Multiplier on the base display size. */
  scale?: number;
  rotation?: number;
};

export function CigaretteSprite({ scale = 1, rotation = 0 }: Props) {
  const width = TAP_DESTROY_CIGARETTE_WIDTH * scale;
  const height = TAP_DESTROY_CIGARETTE_HEIGHT * scale;

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Image
        source={TAP_DESTROY_CIGARETTE_IMAGE}
        style={{ width, height }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

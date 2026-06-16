import type { ImageSourcePropType } from "react-native";

import type { CigaretteNinjaObjectKind } from "@/constants/craving/games/cigaretteNinja";

/** Game 3 — Cigarette Ninja */
export const CIGARETTE_NINJA_LOGO_IMAGE: ImageSourcePropType = require(
  "../../../assets/images/games/3/logo.png",
);

export const CIGARETTE_NINJA_CIGARETTE_IMAGES: readonly ImageSourcePropType[] = [
  require("../../../assets/images/games/3/cigarette1.png"),
  require("../../../assets/images/games/3/pack1.png"),
  require("../../../assets/images/games/3/pack2.png"),
];

export const CIGARETTE_NINJA_VAPE_IMAGES: readonly ImageSourcePropType[] = [
  require("../../../assets/images/games/3/vape1.png"),
  require("../../../assets/images/games/3/vape2.png"),
];

/** Smoke targets alternate between cigar and lighter art. */
export const CIGARETTE_NINJA_SMOKE_IMAGES: readonly ImageSourcePropType[] = [
  require("../../../assets/images/games/3/cigar.png"),
  require("../../../assets/images/games/3/lighter.png"),
];

export const CIGARETTE_NINJA_GOLDEN_IMAGE: ImageSourcePropType = require(
  "../../../assets/images/games/3/gold.png",
);

export const CIGARETTE_NINJA_BOSS_IMAGE: ImageSourcePropType = require(
  "../../../assets/images/games/3/boss.png",
);

export function getCigaretteNinjaObjectImage(
  kind: CigaretteNinjaObjectKind,
  variant = 0,
): ImageSourcePropType {
  switch (kind) {
    case "cigarette":
      return CIGARETTE_NINJA_CIGARETTE_IMAGES[
        variant % CIGARETTE_NINJA_CIGARETTE_IMAGES.length
      ];
    case "vape":
      return CIGARETTE_NINJA_VAPE_IMAGES[variant % CIGARETTE_NINJA_VAPE_IMAGES.length];
    case "smoke":
      return CIGARETTE_NINJA_SMOKE_IMAGES[variant % CIGARETTE_NINJA_SMOKE_IMAGES.length];
    case "golden":
      return CIGARETTE_NINJA_GOLDEN_IMAGE;
    case "boss":
      return CIGARETTE_NINJA_BOSS_IMAGE;
    default:
      return CIGARETTE_NINJA_CIGARETTE_IMAGES[0];
  }
}

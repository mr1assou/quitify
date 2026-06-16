import { Image, View } from "react-native";

import { getCigaretteNinjaObjectImage } from "@/constants/craving/games/cigaretteNinjaAssets";
import { CIGARETTE_NINJA_OBJECT_CONFIG } from "@/constants/craving/games/cigaretteNinja";
import { useTheme } from "@/context/ThemeContext";
import type { NinjaFlyingObject } from "@/utils/craving/games/cigaretteNinjaMath";

type Props = {
  object: NinjaFlyingObject;
};

export function NinjaFlyingObjectSprite({ object }: Props) {
  const { resolved, colors } = useTheme();
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[object.kind];
  const size = config.size;
  const isBoss = object.kind === "boss";
  const imageSize = size * (isBoss ? 1 : 0.96);

  return (
    <View
      style={{
        position: "absolute",
        left: object.x - size / 2,
        top: object.y - size / 2,
        width: size,
        height: size,
        transform: [{ rotate: `${object.rotation}deg` }],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={getCigaretteNinjaObjectImage(object.kind, object.spriteVariant)}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {isBoss && object.health < object.maxHealth ? (
        <View
          style={{
            position: "absolute",
            bottom: -8,
            width: size * 0.8,
            height: 5,
            borderRadius: 3,
            backgroundColor: resolved === "dark" ? "#3A3A3A" : "#E8E0D8",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${(object.health / object.maxHealth) * 100}%`,
              height: "100%",
              backgroundColor: colors.accent,
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

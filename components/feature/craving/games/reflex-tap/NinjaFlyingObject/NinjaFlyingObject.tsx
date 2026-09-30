import { memo } from "react";
import { Image, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { getCigaretteNinjaObjectImage } from "@/constants/craving/games/cigaretteNinjaAssets";
import { CIGARETTE_NINJA_OBJECT_CONFIG } from "@/constants/craving/games/cigaretteNinja";
import { useTheme } from "@/context/ThemeContext";
import type { NinjaPhysicsMap } from "@/hooks/craving/games/useCigaretteNinjaGame";
import type { NinjaFlyingObject } from "@/utils/craving/games/cigaretteNinjaMath";

type Props = {
  object: NinjaFlyingObject;
  /** UI-thread positions keyed by object id. */
  physics: SharedValue<NinjaPhysicsMap>;
};

/**
 * Position/rotation come straight from the shared physics map on the UI thread,
 * so the sprite moves every frame without a React re-render.
 */
export const NinjaFlyingObjectSprite = memo(function NinjaFlyingObjectSprite({
  object,
  physics,
}: Props) {
  const { resolved, colors } = useTheme();
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[object.kind];
  const size = config.size;
  const isBoss = object.kind === "boss";
  const imageSize = size * (isBoss ? 1 : 0.96);
  const half = size / 2;
  const id = object.id;

  const motionStyle = useAnimatedStyle(() => {
    const p = physics.value[id];
    if (!p) {
      return { opacity: 0 };
    }
    return {
      opacity: 1,
      transform: [
        { translateX: p.x - half },
        { translateY: p.y - half },
        { rotate: `${p.rotation}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        motionStyle,
      ]}
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
    </Animated.View>
  );
});

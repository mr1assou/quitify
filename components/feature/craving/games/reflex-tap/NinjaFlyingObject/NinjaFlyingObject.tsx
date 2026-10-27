import { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getCigaretteNinjaObjectImage } from "@/constants/craving/games/cigaretteNinjaAssets";
import { CIGARETTE_NINJA_OBJECT_CONFIG } from "@/constants/craving/games/cigaretteNinja";
import { useTheme } from "@/context/ThemeContext";
import type { NinjaFlyingObject } from "@/utils/craving/games/cigaretteNinjaMath";

type Props = {
  object: NinjaFlyingObject;
  onHidden: (id: string) => void;
};

/** Still target. A slice removes it at once. A timeout fades it out. */
export function NinjaFlyingObjectSprite({ object, onHidden }: Props) {
  const { resolved, colors } = useTheme();
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[object.kind];
  const size = config.size;
  const isBoss = object.kind === "boss";
  const imageSize = size * (isBoss ? 1 : 0.96);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!object.leaving) return;
    opacity.value = withTiming(0, { duration: 450 }, (finished) => {
      if (finished) runOnJS(onHidden)(object.id);
    });
    return () => cancelAnimation(opacity);
  }, [object.id, object.leaving, onHidden, opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: object.x - size / 2,
          top: object.y - size / 2,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        fadeStyle,
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
}

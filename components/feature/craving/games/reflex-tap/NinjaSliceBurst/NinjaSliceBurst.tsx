import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { getCigaretteNinjaObjectImage } from "@/constants/craving/games/cigaretteNinjaAssets";
import { CIGARETTE_NINJA_OBJECT_CONFIG } from "@/constants/craving/games/cigaretteNinja";
import { useTheme } from "@/context/ThemeContext";
import type { NinjaSliceBurst as Burst } from "@/hooks/craving/games/useCigaretteNinjaGame";

type Props = {
  burst: Burst;
  onDone: (id: string) => void;
};

const SPLIT_MS = 320;
const DONE_MS = 420;

/** One half of a cut sprite. It slides away from the slash and fades. */
function SliceHalf({
  burst,
  side,
  size,
}: {
  burst: Burst;
  side: -1 | 1;
  size: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: SPLIT_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const nx = -Math.sin(burst.angle);
  const ny = Math.cos(burst.angle);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: nx * side * 34 * progress.value },
      { translateY: ny * side * 34 * progress.value },
    ],
  }));

  return (
    <Animated.View style={[{ position: "absolute", width: size, height: size }, style]}>
      <View style={{ width: size, height: size, transform: [{ rotate: `${burst.angle}rad` }] }}>
        <View
          collapsable={false}
          style={{
            width: size,
            height: size / 2,
            overflow: "hidden",
            marginTop: side < 0 ? 0 : size / 2,
          }}
        >
          <Image
            source={getCigaretteNinjaObjectImage(burst.kind, burst.spriteVariant)}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            style={{
              width: size,
              height: size,
              marginTop: side < 0 ? 0 : -size / 2,
              transform: [{ rotate: `${-burst.angle}rad` }],
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}

/** Bright line along the swipe, so the cut is obvious. */
function SlashLine({ size, angle, color }: { size: number; angle: number; color: string }) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) });
    opacity.value = withDelay(90, withTiming(0, { duration: 200 }));
  }, [opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${angle}rad` }, { scaleX: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: size * 0.06,
          top: size / 2 - 3,
          width: size * 0.88,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function SlicePoints({ points, combo }: { points: number; combo: number }) {
  const opacity = useSharedValue(1);
  const rise = useSharedValue(0);

  useEffect(() => {
    rise.value = withTiming(-36, { duration: 400, easing: Easing.out(Easing.cubic) });
    opacity.value = withDelay(160, withTiming(0, { duration: 220 }));
  }, [opacity, rise]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: rise.value }],
  }));

  return (
    <Animated.View style={[{ position: "absolute", top: -6, left: 0, right: 0, alignItems: "center" }, style]}>
      <Text className="text-base font-bold text-accent">+{points}</Text>
      {combo >= 2 ? <Text className="text-xs font-bold text-accent">x{combo}</Text> : null}
    </Animated.View>
  );
}

/** Cut feedback: halves separate, a slash flashes, and the points pop. */
export function NinjaSliceBurst({ burst, onDone }: Props) {
  const { colors } = useTheme();
  const size = CIGARETTE_NINJA_OBJECT_CONFIG[burst.kind].size;

  useEffect(() => {
    const timeoutId = setTimeout(() => onDone(burst.id), DONE_MS);
    return () => clearTimeout(timeoutId);
  }, [burst.id, onDone]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: burst.x - size / 2,
        top: burst.y - size / 2,
        width: size,
        height: size,
      }}
    >
      {burst.split ? (
        <>
          <SliceHalf burst={burst} side={-1} size={size} />
          <SliceHalf burst={burst} side={1} size={size} />
        </>
      ) : null}
      <SlashLine size={size} angle={burst.angle} color={colors.accent} />
      <SlicePoints points={burst.points} combo={burst.combo} />
    </View>
  );
}

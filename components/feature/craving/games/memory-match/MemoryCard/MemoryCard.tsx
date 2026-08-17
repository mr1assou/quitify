import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { MEMORY_SYMBOLS, type MemorySymbol } from "@/constants/craving/games/memoryMatch";
import type { MemoryCard as MemoryCardType } from "@/hooks/craving/games/useMemoryMatchGame";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  card: MemoryCardType;
  size: number;
  disabled?: boolean;
  onPress: () => void;
};

const FLIP_OPEN_MS = 140;
const FLIP_CLOSE_MS = 120;

function findSymbol(symbolId: string): MemorySymbol {
  return (
    MEMORY_SYMBOLS.find((s) => s.id === symbolId) ?? MEMORY_SYMBOLS[0]
  );
}

export function MemoryCard({ card, size, disabled = false, onPress }: Props) {
  const { t } = useTranslation();
  const { resolved } = useTheme();
  const symbol = findSymbol(card.symbolId);
  const iconColor = resolved === "dark" ? symbol.color.dark : symbol.color.light;

  const isRevealed = card.isFlipped || card.isMatched;
  const flip = useSharedValue(isRevealed ? 1 : 0);
  const matchGlow = useSharedValue(0);

  useEffect(() => {
    flip.value = withTiming(isRevealed ? 1 : 0, {
      duration: isRevealed ? FLIP_OPEN_MS : FLIP_CLOSE_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [isRevealed, flip]);

  useEffect(() => {
    if (!card.isMatched) return;
    matchGlow.value = withDelay(
      120,
      withSequence(
        withSpring(1, { damping: 8, stiffness: 140 }),
        withTiming(0.85, { duration: 360 }),
      ),
    );
  }, [card.isMatched, matchGlow]);

  const frontStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flip.value, [0, 1], [0, 180]);
    const opacity = flip.value < 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotate}deg` }],
      opacity,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flip.value, [0, 1], [180, 360]);
    const opacity = flip.value > 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotate}deg` }],
      opacity,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + matchGlow.value * 0.06 },
    ],
    shadowOpacity: card.isMatched ? 0.6 * matchGlow.value : 0,
    shadowRadius: card.isMatched ? 16 * matchGlow.value : 0,
  }));

  const handlePress = () => {
    if (disabled || card.isFlipped || card.isMatched) return;
    Haptics.selectionAsync().catch(() => {});
    flip.value = withTiming(1, {
      duration: FLIP_OPEN_MS,
      easing: Easing.out(Easing.cubic),
    });
    onPress();
  };

  const cardBg = resolved === "dark" ? "#1F1B26" : "#F4EFEA";
  const faceBg = resolved === "dark" ? "#2A2433" : "#FFFFFF";
  const matchedBg = resolved === "dark" ? "#2D2A37" : "#FFF8F1";
  const backFace = card.isMatched ? matchedBg : faceBg;

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          shadowColor: iconColor,
          shadowOffset: { width: 0, height: 0 },
        },
        containerStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={
          card.isMatched
            ? t("craving.memoryMatchedCard", { id: symbol.id })
            : card.isFlipped
              ? t("craving.memoryRevealedCard", { id: symbol.id })
              : t("craving.memoryHiddenCard")
        }
        accessibilityState={{ disabled }}
        style={{ width: size, height: size }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 16,
              backgroundColor: cardBg,
              alignItems: "center",
              justifyContent: "center",
              backfaceVisibility: "hidden",
            },
            frontStyle,
          ]}
        >
          <Ionicons
            name="help-outline"
            size={Math.round(size * 0.42)}
            color={resolved === "dark" ? "#5C5466" : "#B7AEA4"}
          />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 16,
              backgroundColor: backFace,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: card.isMatched ? 1.5 : 0,
              borderColor: card.isMatched ? iconColor : "transparent",
              backfaceVisibility: "hidden",
            },
            backStyle,
          ]}
        >
          <Ionicons
            name={symbol.icon}
            size={Math.round(size * 0.48)}
            color={iconColor}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

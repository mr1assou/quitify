import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { CravingGame } from "@/constants/craving/games/cravingGames";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  game: CravingGame;
  onPress: () => void;
};

export function GameCard({ game, onPress }: Props) {
  const { resolved } = useTheme();
  const palette = resolved === "dark" ? game.palette.dark : game.palette.light;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const disabled = !game.available;
  const hasLogo = !!game.logoImage;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`${game.title}, ${game.duration}. ${game.description}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={() => {
        if (disabled) return;
        scale.value = withSpring(0.97, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={() => {
        if (disabled) return;
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[
        {
          width: "100%",
          aspectRatio: 1,
          borderRadius: 22,
          padding: 10,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: hasLogo ? "transparent" : palette.background,
          opacity: disabled ? 0.55 : 1,
          ...(hasLogo
            ? {}
            : {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 10,
                elevation: 2,
              }),
        },
        animatedStyle,
      ]}
    >
      <View className="w-full flex-1 items-center justify-center overflow-hidden rounded-[18px]">
        {hasLogo ? (
          <Image
            source={game.logoImage}
            style={{ width: "108%", height: "108%" }}
            resizeMode={game.logoCardFit ?? "contain"}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.55)",
            }}
          >
            <Ionicons name={game.icon} size={30} color={palette.iconColor} />
          </View>
        )}
      </View>

      <View className="w-full items-center pb-1 pt-1">
        <Text
          style={{
            color: hasLogo
              ? resolved === "dark"
                ? "#FFFFFF"
                : palette.iconColor
              : palette.iconColor,
          }}
          className="text-center text-sm font-bold leading-tight"
          numberOfLines={2}
        >
          {game.title}
        </Text>

        {disabled ? (
          <Text
            style={{ color: palette.iconColor, opacity: 0.7 }}
            className="mt-1 text-[10px] font-semibold uppercase tracking-wide"
          >
            Coming soon
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

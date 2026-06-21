import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  relaxSoundCoverSource,
  type RelaxSound,
} from "@/constants/craving/relaxSounds";
import type { RelaxSoundProgress } from "@/hooks/craving/useRelaxSoundPlayer";
import { formatPlaybackTime } from "@/utils/craving/formatPlaybackTime";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  sound: RelaxSound;
  isActive: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  progress: RelaxSoundProgress | null;
  onPress: () => void;
};

export function RelaxSoundCard({
  sound,
  isActive,
  isPlaying,
  isLoading,
  progress,
  onPress,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ratio =
    progress && progress.durationMs > 0
      ? Math.min(1, progress.positionMs / progress.durationMs)
      : 0;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`${sound.label}. ${sound.description}`}
      accessibilityState={{ selected: isActive, busy: isLoading }}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[
        {
          width: "100%",
          aspectRatio: 1,
          borderRadius: 22,
          overflow: "hidden",
          borderWidth: isActive ? 3 : 0,
          borderColor: "#FFFFFF",
        },
        animatedStyle,
      ]}
    >
      <ImageBackground
        source={relaxSoundCoverSource(sound)}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 12,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-1">
              <Text className="text-sm font-bold text-white" numberOfLines={1}>
                {sound.label}
              </Text>
              <Text
                className="mt-0.5 text-[11px] text-white/80"
                numberOfLines={isActive ? 1 : 2}
              >
                {sound.description}
              </Text>
            </View>

            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons
                name={
                  isActive && isPlaying ? "pause-circle" : "play-circle"
                }
                size={34}
                color="#FFFFFF"
              />
            )}
          </View>

          {isActive && progress && progress.durationMs > 0 ? (
            <View className="mt-2.5">
              <View
                style={{
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${ratio * 100}%`,
                    height: "100%",
                    borderRadius: 999,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </View>
              <View className="mt-1 flex-row justify-between">
                <Text className="text-[10px] font-medium text-white/90">
                  {formatPlaybackTime(progress.positionMs)}
                </Text>
                <Text className="text-[10px] font-medium text-white/70">
                  {formatPlaybackTime(progress.durationMs)}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </AnimatedPressable>
  );
}

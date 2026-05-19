import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { MotivationVideo } from "@/constants/motivationVideos";

import { MotivationVideoThumbnail } from "./MotivationVideoThumbnail";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const THUMB_HEIGHT = 180;

type Props = {
  video: MotivationVideo;
  onPress: () => void;
};

export function MotivationVideoCard({ video, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`${video.title}, ${video.duration}, by ${video.author}`}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16, stiffness: 320 });
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
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
          elevation: 3,
        },
        animatedStyle,
      ]}
      className="bg-section dark:bg-d-surface"
    >
      <MotivationVideoThumbnail
        source={video.thumbnail}
        duration={video.duration}
        height={THUMB_HEIGHT}
      />

      <View className="px-4 py-3">
        <Text
          className="text-base font-bold text-foreground dark:text-d-text"
          numberOfLines={2}
        >
          {video.title}
        </Text>
        <Text
          className="mt-1 text-xs font-semibold text-muted-foreground dark:text-d-muted"
          numberOfLines={1}
        >
          {video.author}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

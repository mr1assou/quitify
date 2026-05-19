import { FlatList, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { MotivationVideoCard } from "@/components/feature/craving/motivation-videos/MotivationVideoCard";
import type { MotivationVideo } from "@/constants/motivationVideos";

type Props = {
  videos: readonly MotivationVideo[];
  onVideoPress: (video: MotivationVideo) => void;
};

export function MotivationVideoList({ videos, onVideoPress }: Props) {
  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInUp.delay(60 + index * 60).duration(400)}
        >
          <MotivationVideoCard video={item} onPress={() => onVideoPress(item)} />
        </Animated.View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

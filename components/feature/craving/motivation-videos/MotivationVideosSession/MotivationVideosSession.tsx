import { View } from "react-native";

import { MotivationVideoList } from "@/components/feature/craving/motivation-videos/MotivationVideoList";
import { MotivationVideosSessionTimer } from "@/components/feature/craving/motivation-videos/MotivationVideosSessionTimer";
import { Button } from "@/components/ui/Button";
import type { MotivationVideo } from "@/constants/motivationVideos";

type Props = {
  elapsedMs: number;
  videos: readonly MotivationVideo[];
  onVideoPress: (video: MotivationVideo) => void;
  onFinish: () => void;
};

export function MotivationVideosSession({
  elapsedMs,
  videos,
  onVideoPress,
  onFinish,
}: Props) {
  return (
    <View className="flex-1 px-6 pb-6 pt-2">
      <View className="items-center pb-3">
        <MotivationVideosSessionTimer elapsedMs={elapsedMs} />
      </View>

      <View className="flex-1">
        <MotivationVideoList videos={videos} onVideoPress={onVideoPress} />
      </View>

      <View className="pt-3">
        <Button
          label="Stop craving session"
          variant="accent"
          size="lg"
          fullWidth
          onPress={onFinish}
        />
      </View>
    </View>
  );
}

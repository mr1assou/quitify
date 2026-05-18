import { Ionicons } from "@expo/vector-icons";
import { Image, View, Text } from "react-native";

import { getPostImage } from "@/constants/postImages";
import type { PostMedia as PostMediaType } from "@/types/community";

type Props = {
  media: PostMediaType;
  height?: number;
};

/** Image / video preview that fills the post card width with a fixed height. */
export function PostMedia({ media, height = 240 }: Props) {
  const source = getPostImage(media.imageKey);
  const isVideo = media.kind === "video";

  return (
    <View
      className="overflow-hidden rounded-2xl bg-section dark:bg-d-surface"
      style={{ height }}
    >
      <Image source={source} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      {isVideo ? (
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
            <Ionicons name="play" size={24} color="white" />
          </View>
        </View>
      ) : null}
      {isVideo && media.durationLabel ? (
        <View className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5">
          <Text className="text-xs font-semibold text-white">{media.durationLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

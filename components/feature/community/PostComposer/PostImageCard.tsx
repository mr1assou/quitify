import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { forwardRef } from "react";
import { Pressable, Text, View } from "react-native";

import type { PostImageCrop, PostMediaFrame } from "@/types/community/community";
import type { PostDraftImage } from "@/utils/community/postDraft";
import { resolvePostMediaAspectRatio } from "@/utils/community/postMediaFrame";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

import { PostImageCropEditor, type PostImageCropEditorHandle } from "./PostImageCropEditor";
import { PostMediaFramePicker } from "./PostMediaFramePicker";

type Props = {
  image: PostDraftImage;
  onRemove: () => void;
  onFrameChange: (frame: PostMediaFrame) => void;
  onCropChange: (crop: PostImageCrop) => void;
};

export const PostImageCard = forwardRef<PostImageCropEditorHandle, Props>(
  function PostImageCard({ image, onRemove, onFrameChange, onCropChange }, ref) {
    const aspectRatio = resolvePostMediaAspectRatio({
      kind: image.kind,
      frame: image.frame,
    });
    const isVideo = image.kind === "video";

    return (
      <View className="mt-3">
        <PostMediaFramePicker value={image.frame} onChange={onFrameChange} />
        <View className="relative mt-3">
          {isVideo ? (
            <View
              className="w-full overflow-hidden rounded-2xl bg-section dark:bg-d-surface"
              style={{ aspectRatio }}
            >
              <Video
                source={{ uri: image.uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={ResizeMode.COVER}
                useNativeControls={false}
                isLooping={false}
              />
              <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
                  <Ionicons name="play" size={24} color="white" />
                </View>
              </View>
              {image.durationMs ? (
                <View className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5">
                  <Text className="text-xs font-semibold text-white">
                    {formatMediaDuration(image.durationMs)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <PostImageCropEditor
              ref={ref}
              uri={image.uri}
              aspectRatio={aspectRatio}
              crop={image.crop}
              onCropChange={onCropChange}
            />
          )}
          <Pressable
            onPress={onRemove}
            className="absolute right-2 top-2 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/60"
            accessibilityLabel="Remove media"
          >
            <Ionicons name="close" size={18} color="white" />
          </Pressable>
        </View>
      </View>
    );
  },
);

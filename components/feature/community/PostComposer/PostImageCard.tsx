import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { Pressable, View } from "react-native";

import type { PostImageCrop, PostMediaFrame } from "@/types/community/community";
import type { PostDraftImage } from "@/utils/community/postDraft";
import { resolvePostMediaAspectRatio } from "@/utils/community/postMediaFrame";

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
    const aspectRatio = resolvePostMediaAspectRatio({ kind: "image", frame: image.frame });

    return (
      <View className="mt-3">
        <PostMediaFramePicker value={image.frame} onChange={onFrameChange} />
        <View className="relative mt-3">
          <PostImageCropEditor
            ref={ref}
            uri={image.uri}
            aspectRatio={aspectRatio}
            crop={image.crop}
            onCropChange={onCropChange}
          />
          <Pressable
            onPress={onRemove}
            className="absolute right-2 top-2 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/60"
            accessibilityLabel="Remove image"
          >
            <Ionicons name="close" size={18} color="white" />
          </Pressable>
        </View>
      </View>
    );
  },
);

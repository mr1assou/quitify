import type { RefObject } from "react";
import { View } from "react-native";

import type { PostImageCrop, PostMediaFrame } from "@/types/community";
import type { PostDraftImage } from "@/utils/community/postDraft";

import type { PostImageCropEditorHandle } from "./PostImageCropEditor";
import { PostImageCard } from "./PostImageCard";

type Props = {
  images: PostDraftImage[];
  cropEditorRef?: RefObject<PostImageCropEditorHandle | null>;
  onRemoveImage: (id: string) => void;
  onFrameChange: (id: string, frame: PostMediaFrame) => void;
  onCropChange: (id: string, crop: PostImageCrop) => void;
};

export function PostImageSection({
  images,
  cropEditorRef,
  onRemoveImage,
  onFrameChange,
  onCropChange,
}: Props) {
  if (images.length === 0) return null;

  return (
    <View className="mx-5 mt-4">
      {images.map((image, index) => (
        <PostImageCard
          key={image.id}
          ref={index === 0 ? cropEditorRef : undefined}
          image={image}
          onRemove={() => onRemoveImage(image.id)}
          onFrameChange={(frame) => onFrameChange(image.id, frame)}
          onCropChange={(crop) => onCropChange(image.id, crop)}
        />
      ))}
    </View>
  );
}

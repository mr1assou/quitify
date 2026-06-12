import { useState } from "react";
import { ScrollView } from "react-native";

import type { PostTagId } from "@/constants/postTags";
import type { PostImageCrop, PostMediaFrame } from "@/types/community";
import type { PostDraft } from "@/utils/community/postDraft";

import { PostBodyEditor } from "./PostBodyEditor";
import { PostImageSection } from "./PostImageSection";
import { PostTagPickerModal } from "./PostTagPickerModal";
import { PostTagsChip } from "./PostTagsChip";
import { PostTitleField } from "./PostTitleField";

type Props = {
  draft: PostDraft;
  onUpdate: (patch: Partial<PostDraft>) => void;
  onPickImages: () => void;
  onRemoveImage: (id: string) => void;
  onFrameChange: (id: string, frame: PostMediaFrame) => void;
  onCropChange: (id: string, crop: PostImageCrop) => void;
};

export function PostComposerContent({
  draft,
  onUpdate,
  onPickImages,
  onRemoveImage,
  onFrameChange,
  onCropChange,
}: Props) {
  const [tagPickerOpen, setTagPickerOpen] = useState(false);

  const handleTagSelect = (tagId: PostTagId) => {
    onUpdate({ tagId });
  };

  return (
    <>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <PostTitleField
          value={draft.title}
          onChangeText={(title) => onUpdate({ title })}
        />
        <PostTagsChip
          selectedTagId={draft.tagId}
          onPress={() => setTagPickerOpen(true)}
          onClear={() => onUpdate({ tagId: null })}
        />
        <PostBodyEditor
          value={draft.body}
          onChangeText={(body) => onUpdate({ body })}
          onPickImages={onPickImages}
        />
        <PostImageSection
          images={draft.images}
          onRemoveImage={onRemoveImage}
          onFrameChange={onFrameChange}
          onCropChange={onCropChange}
        />
      </ScrollView>

      <PostTagPickerModal
        visible={tagPickerOpen}
        selectedTagId={draft.tagId}
        onSelect={handleTagSelect}
        onClose={() => setTagPickerOpen(false)}
      />
    </>
  );
}

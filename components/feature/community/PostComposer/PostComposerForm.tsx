import { KeyboardAvoidingView, Platform } from "react-native";

import { PostComposerContent } from "./PostComposerContent";
import { PostComposerFooter } from "./PostComposerFooter";
import { PostComposerHeader } from "./PostComposerHeader";
import { usePostComposer } from "./usePostComposer";

export function PostComposerForm() {
  const {
    draft,
    updateDraft,
    addImages,
    removeImage,
    updateImageFrame,
    updateImageCrop,
    canPost,
    onPost,
  } = usePostComposer();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <PostComposerHeader />
      <PostComposerContent
        draft={draft}
        onUpdate={updateDraft}
        onPickImages={addImages}
        onRemoveImage={removeImage}
        onFrameChange={updateImageFrame}
        onCropChange={updateImageCrop}
      />
      <PostComposerFooter canPost={canPost} onPost={onPost} />
    </KeyboardAvoidingView>
  );
}

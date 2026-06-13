import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostImageCropEditor, type PostImageCropEditorHandle } from "@/components/feature/community/PostComposer/PostImageCropEditor";
import { usePickPostImage } from "@/components/feature/community/PostComposer/usePickPostImage";
import { CURRENT_USER_ID } from "@/constants/communityUsers";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { updateProfileImage, uploadProfileImage } from "@/services/profile/profileImageApi";
import type { PostImageCrop } from "@/types/community";
import { DEFAULT_POST_IMAGE_CROP } from "@/utils/community/postImageCrop";
import { optimizeProfileImageForUpload } from "@/utils/profile/optimizeProfileImageForUpload";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileImageEditorModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { updateProfile } = useApp();
  const { patchAuthor } = useCommunity();
  const { pickImages } = usePickPostImage();
  const cropEditorRef = useRef<PostImageCropEditorHandle>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [crop, setCrop] = useState<PostImageCrop>(DEFAULT_POST_IMAGE_CROP);
  const [saving, setSaving] = useState(false);

  const reset = useCallback(() => {
    setUri(null);
    setCrop(DEFAULT_POST_IMAGE_CROP);
    setSaving(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handlePick = useCallback(async () => {
    const picked = await pickImages();
    if (picked.length === 0) return;
    setUri(picked[0].uri);
    setCrop(DEFAULT_POST_IMAGE_CROP);
  }, [pickImages]);

  const handleSave = useCallback(async () => {
    if (!uri) return;
    setSaving(true);
    try {
      const finalCrop = cropEditorRef.current?.flush() ?? crop;
      const optimized = await optimizeProfileImageForUpload(uri, finalCrop);
      const imageUrl = await uploadProfileImage(optimized.uri, optimized.contentType);
      await updateProfileImage(imageUrl);
      updateProfile({ imageUrl });
      patchAuthor(CURRENT_USER_ID, { avatarUrl: imageUrl });
      handleClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update profile photo";
      Alert.alert("Upload failed", message);
    } finally {
      setSaving(false);
    }
  }, [crop, handleClose, patchAuthor, updateProfile, uri]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-5 py-3">
            <Pressable onPress={handleClose} hitSlop={8}>
              <Text className="text-base font-semibold text-muted-foreground dark:text-d-muted">
                Cancel
              </Text>
            </Pressable>
            <Text className="text-base font-bold text-foreground dark:text-d-text">Profile photo</Text>
            <Pressable onPress={() => void handleSave()} disabled={!uri || saving} hitSlop={8}>
              {saving ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text
                  className="text-base font-bold"
                  style={{ color: uri ? colors.primary : colors.mutedForeground }}
                >
                  Save
                </Text>
              )}
            </Pressable>
          </View>

          <View className="flex-1 px-5">
            {uri ? (
              <View className="mt-4 flex-1">
                <View className="flex-1 justify-center">
                <View className="w-full max-w-[320px] self-center">
                  <PostImageCropEditor
                    ref={cropEditorRef}
                    uri={uri}
                    aspectRatio={1}
                    crop={crop}
                    onCropChange={setCrop}
                    maskShape="circle"
                  />
                </View>
                </View>
                <Pressable onPress={() => void handlePick()} className="mt-4 self-start pb-4">
                  <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                    Choose a different photo
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="mb-6 text-center text-sm text-muted-foreground dark:text-d-muted">
                  Pick a photo, then drag and pinch inside the circle to frame your profile picture.
                </Text>
                <Pressable
                  onPress={() => void handlePick()}
                  className="rounded-full bg-primary px-6 py-3"
                >
                  <Text className="text-sm font-bold text-white">Add photo</Text>
                </Pressable>
              </View>
            )}
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

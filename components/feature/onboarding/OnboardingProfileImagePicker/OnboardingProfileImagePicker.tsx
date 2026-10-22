import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PostImageCropEditor,
  type PostImageCropEditorHandle,
} from "@/components/feature/community/PostComposer/PostImageCropEditor";
import { usePickProfileImage } from "@/components/feature/profile/usePickProfileImage";
import { useTheme } from "@/context/ThemeContext";
import type { PostImageCrop } from "@/types/community/community";
import { DEFAULT_POST_IMAGE_CROP } from "@/utils/community/postImageCrop";
import { normalizeImageOrientation } from "@/utils/posts/optimizePostImage";
import { optimizeProfileImageForUpload } from "@/utils/profile/optimizeProfileImageForUpload";
import { resolveAvatarImageSource } from "@/utils/profile/resolveAvatarImageSource";

type Props = {
  /** The local image URI or R2 URL (if any). */
  imageUrl?: string;
  /** Called when the image is cropped and confirmed locally. */
  onImageUploaded: (localUri: string) => void;
  /** Validation error string from parent. */
  error?: string;
};

/**
 * Circular profile-photo picker for onboarding step 5.
 * Displays avatar placeholder with an attached '+' badge button.
 * Clicking opens a popup Modal to crop and choose which part of the photo to show.
 */
export function OnboardingProfileImagePicker({
  imageUrl,
  onImageUploaded,
  error,
}: Props) {
  const { colors } = useTheme();
  const { pickImages } = usePickProfileImage();
  const cropEditorRef = useRef<PostImageCropEditorHandle>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [crop, setCrop] = useState<PostImageCrop>(DEFAULT_POST_IMAGE_CROP);
  const [processing, setProcessing] = useState(false);

  const handlePick = useCallback(async () => {
    const picked = await pickImages();
    if (picked.length === 0) return;
    try {
      const normalized = await normalizeImageOrientation(picked[0].uri);
      setPickedUri(normalized.uri);
    } catch {
      setPickedUri(picked[0].uri);
    }
    setCrop(DEFAULT_POST_IMAGE_CROP);
    setModalVisible(true);
  }, [pickImages]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setPickedUri(null);
    setCrop(DEFAULT_POST_IMAGE_CROP);
    setProcessing(false);
  }, []);

  const handleConfirmCrop = useCallback(async () => {
    if (!pickedUri) return;
    setProcessing(true);
    try {
      const finalCrop = cropEditorRef.current?.flush() ?? crop;
      const optimized = await optimizeProfileImageForUpload(pickedUri, finalCrop);
      onImageUploaded(optimized.uri);
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not process photo";
      Alert.alert("Error", message);
      setProcessing(false);
    }
  }, [crop, handleCloseModal, onImageUploaded, pickedUri]);

  const avatarSource = resolveAvatarImageSource(imageUrl);

  return (
    <View className="w-full items-center">
      {/* Circular avatar with attached '+' badge */}
      <View className="items-center">
        <Pressable
          onPress={() => void handlePick()}
          className="relative"
          accessibilityRole="button"
          accessibilityLabel="Add profile photo"
        >
          <View
            className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-section dark:border-d-border dark:bg-d-surface"
            style={imageUrl ? { borderColor: colors.primary } : undefined}
          >
            {avatarSource ? (
              <Image
                source={avatarSource}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={48}
                color={colors.mutedForeground}
              />
            )}
          </View>

          {/* '+' / edit badge attached to photo */}
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-primary shadow-sm">
            <Ionicons
              name={imageUrl ? "camera" : "add"}
              size={18}
              color="#ffffff"
            />
          </View>
        </Pressable>

        {error ? (
          <Text className="mt-2 text-center text-xs font-semibold text-alert">
            {error}
          </Text>
        ) : null}
      </View>

      {/* Modal popup to frame / crop the image */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaView
            className="flex-1 bg-background dark:bg-d-bg"
            edges={["top", "bottom"]}
          >
            {/* Header with Cancel, Title, and Save/Done */}
            <View className="flex-row items-center justify-between px-5 py-3">
              <Pressable onPress={handleCloseModal} hitSlop={8}>
                <Text className="text-base font-semibold text-muted-foreground dark:text-d-muted">
                  Cancel
                </Text>
              </Pressable>
              <Text className="text-base font-bold text-foreground dark:text-d-text">
                Crop Photo
              </Text>
              <Pressable
                onPress={() => void handleConfirmCrop()}
                disabled={processing || !pickedUri}
                hitSlop={8}
              >
                {processing ? (
                  <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                  <Text
                    className="text-base font-bold"
                    style={{ color: colors.primary }}
                  >
                    Done
                  </Text>
                )}
              </Pressable>
            </View>

            {/* Circular Crop Workspace */}
            <View className="flex-1 px-5">
              {pickedUri ? (
                <View className="flex-1 justify-center">
                  <View className="w-full max-w-[320px] self-center">
                    <PostImageCropEditor
                      ref={cropEditorRef}
                      uri={pickedUri}
                      aspectRatio={1}
                      crop={crop}
                      onCropChange={setCrop}
                      maskShape="circle"
                    />
                  </View>
                  <Pressable
                    onPress={() => void handlePick()}
                    className="mt-6 self-center pb-4"
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: colors.primary }}
                    >
                      Choose a different photo
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

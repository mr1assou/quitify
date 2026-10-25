import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostImageCropEditor, type PostImageCropEditorHandle } from "@/components/feature/community/PostComposer/PostImageCropEditor";
import { usePickProfileImage } from "@/components/feature/profile/usePickProfileImage";
import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import {
  DEFAULT_PROFILE_IMAGE_PATHS,
  type DefaultProfileImagePath,
} from "@/constants/profile/defaultProfileImagePaths";
import {
  bundledProfileImageSource,
  isBundledProfileImagePath,
} from "@/constants/onboarding/defaultProfileImages";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { updateProfileImage, uploadProfileImage } from "@/services/profile/profileImageApi";
import type { PostImageCrop } from "@/types/community/community";
import { dbAuthorId } from "@/utils/community/presence";
import { DEFAULT_POST_IMAGE_CROP } from "@/utils/community/postImageCrop";
import { normalizeImageOrientation } from "@/utils/posts/optimizePostImage";
import { optimizeProfileImageForUpload } from "@/utils/profile/optimizeProfileImageForUpload";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileImageEditorModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { updateProfile, state: appState } = useApp();
  const { patchAuthor } = useCommunity();
  const { pickImages } = usePickProfileImage();
  const cropEditorRef = useRef<PostImageCropEditorHandle>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [crop, setCrop] = useState<PostImageCrop>(DEFAULT_POST_IMAGE_CROP);
  const [saving, setSaving] = useState(false);
  const currentImagePath =
    appState.profile?.imageUrl?.trim().split("/").pop()?.split("?")[0] ?? "";
  const selectedAvatar = isBundledProfileImagePath(currentImagePath)
    ? currentImagePath
    : null;

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
    try {
      // Flatten EXIF so the circle editor and the uploaded crop use the same pixels.
      const normalized = await normalizeImageOrientation(picked[0].uri);
      setUri(normalized.uri);
      setCrop(DEFAULT_POST_IMAGE_CROP);
    } catch {
      setUri(picked[0].uri);
      setCrop(DEFAULT_POST_IMAGE_CROP);
    }
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
      const userId = appState.account?.userId;
      if (userId) {
        patchAuthor(dbAuthorId(userId), { avatarUrl: imageUrl });
      }
      handleClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update profile photo";
      Alert.alert("Upload failed", message);
    } finally {
      setSaving(false);
    }
  }, [appState.account?.userId, crop, handleClose, patchAuthor, updateProfile, uri]);

  const handleSelectAvatar = useCallback(
    async (imagePath: DefaultProfileImagePath) => {
      if (saving) return;
      setSaving(true);
      try {
        await updateProfileImage(imagePath);
        updateProfile({ imageUrl: imagePath });
        patchAuthor(CURRENT_USER_ID, { avatarUrl: imagePath });
        const userId = appState.account?.userId;
        if (userId) {
          patchAuthor(dbAuthorId(userId), { avatarUrl: imagePath });
        }
        handleClose();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not update profile photo";
        Alert.alert("Update failed", message);
      } finally {
        setSaving(false);
      }
    },
    [appState.account?.userId, handleClose, patchAuthor, saving, updateProfile],
  );

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
                  Add a photo or choose one of the avatars below.
                </Text>
                <Pressable
                  onPress={() => void handlePick()}
                  disabled={saving}
                  className="rounded-full bg-primary px-6 py-3"
                >
                  <Text className="text-sm font-bold text-white">Add photo</Text>
                </Pressable>
              </View>
            )}

            <View className="border-t border-border pb-3 pt-4 dark:border-d-border">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-bold text-foreground dark:text-d-text">
                  Choose an avatar
                </Text>
              </View>
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 2 }}
              >
                {DEFAULT_PROFILE_IMAGE_PATHS.map((imagePath, index) => {
                  const selected = selectedAvatar === imagePath;
                  return (
                    <Pressable
                      key={imagePath}
                      onPress={() => void handleSelectAvatar(imagePath)}
                      disabled={saving}
                      accessibilityRole="button"
                      accessibilityLabel={`Choose avatar ${index + 1}`}
                      accessibilityState={{ selected, disabled: saving }}
                      className={`relative h-14 w-14 items-center justify-center rounded-full border-2 p-0.5 ${
                        selected ? "border-primary" : "border-border dark:border-d-border"
                      }`}
                    >
                      <Image
                        source={bundledProfileImageSource(imagePath)}
                        style={{ width: "100%", height: "100%", borderRadius: 999 }}
                        contentFit="cover"
                      />
                      {selected ? (
                        <View className="absolute bottom-0 right-0 h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Ionicons name="checkmark" size={12} color={colors.white} />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
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

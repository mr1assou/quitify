import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

import { useTranslation } from "@/hooks/i18n/useTranslation";
import { getLocalFileSizeBytes } from "@/utils/media/getLocalFileSizeBytes";
import {
  mediaLimitI18nKeys,
  sourceImageTooLarge,
} from "@/utils/media/validateMediaLimits";

export type PickedProfileImage = {
  uri: string;
  mimeType?: string | null;
};

/** Reject enormous source photos before the crop editor. */
const PROFILE_IMAGE_RAW_PICK_CEILING_BYTES = 40 * 1024 * 1024;

export function usePickProfileImage() {
  const { t } = useTranslation();

  const pickImages = useCallback(async (): Promise<PickedProfileImage[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to update your profile picture.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.85,
    });

    if (result.canceled) return [];
    const asset = result.assets[0];
    if (!asset?.uri) return [];

    const sizeBytes =
      asset.fileSize ?? (await getLocalFileSizeBytes(asset.uri)) ?? undefined;
    if (sizeBytes != null) {
      const tooLarge = sourceImageTooLarge(sizeBytes, PROFILE_IMAGE_RAW_PICK_CEILING_BYTES);
      if (tooLarge) {
        const keys = mediaLimitI18nKeys(tooLarge.code);
        Alert.alert(t(keys.titleKey), t(keys.messageKey));
        return [];
      }
    }

    return [{ uri: asset.uri, mimeType: asset.mimeType }];
  }, [t]);

  return { pickImages };
}

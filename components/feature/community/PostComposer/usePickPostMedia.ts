import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

import { POST_VIDEO_MAX_DURATION_SEC } from "@/constants/media/uploadLimits";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { getLocalFileSizeBytes } from "@/utils/media/getLocalFileSizeBytes";
import {
  mediaLimitI18nKeys,
  postVideoTooLarge,
  postVideoTooLong,
  sourceImageTooLarge,
} from "@/utils/media/validateMediaLimits";

export type PickedPostMedia = {
  uri: string;
  kind: "image" | "video";
  mimeType?: string | null;
  durationMs?: number;
  sizeBytes?: number;
};

/** Reject enormous source images before we even try to compress them. */
const POST_IMAGE_RAW_PICK_CEILING_BYTES = 40 * 1024 * 1024;

export function usePickPostMedia() {
  const { t } = useTranslation();

  const pickMedia = useCallback(async (): Promise<PickedPostMedia[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow media access to attach photos or videos to your post.",
      );
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: false,
      quality: 0.85,
      videoMaxDuration: POST_VIDEO_MAX_DURATION_SEC,
    });

    if (result.canceled) return [];
    const asset = result.assets[0];
    if (!asset?.uri) return [];

    const kind: "image" | "video" = asset.type === "video" ? "video" : "image";
    const sizeBytes =
      asset.fileSize ?? (await getLocalFileSizeBytes(asset.uri)) ?? undefined;
    const durationMs = asset.duration ?? undefined;

    const warn = (code: Parameters<typeof mediaLimitI18nKeys>[0]) => {
      const keys = mediaLimitI18nKeys(code);
      Alert.alert(t(keys.titleKey), t(keys.messageKey));
    };

    if (kind === "video") {
      const tooLong = postVideoTooLong(durationMs);
      if (tooLong) {
        warn(tooLong.code);
        return [];
      }
      if (sizeBytes != null) {
        const tooLarge = postVideoTooLarge(sizeBytes);
        if (tooLarge) {
          warn(tooLarge.code);
          return [];
        }
      }
    } else if (sizeBytes != null) {
      const tooLarge = sourceImageTooLarge(sizeBytes, POST_IMAGE_RAW_PICK_CEILING_BYTES);
      if (tooLarge) {
        warn(tooLarge.code);
        return [];
      }
    }

    return [
      {
        uri: asset.uri,
        kind,
        mimeType: asset.mimeType,
        durationMs,
        sizeBytes,
      },
    ];
  }, [t]);

  return { pickMedia };
}

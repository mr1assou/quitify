import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export type ChatMediaPick = {
  uri: string;
  kind: "image" | "video" | "audio";
  mimeType?: string;
  durationMs?: number;
  sizeBytes?: number;
};

export function usePickChatMedia() {
  const pickFromGallery = useCallback(async (): Promise<ChatMediaPick[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to send images and videos.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.85,
      videoMaxDuration: 60,
    });

    if (result.canceled) return [];

    const items: ChatMediaPick[] = [];
    for (const asset of result.assets) {
      if (!asset.uri) continue;
      items.push({
        uri: asset.uri,
        kind: asset.type === "video" ? "video" : "image",
        mimeType: asset.mimeType ?? undefined,
        durationMs: asset.duration ?? undefined,
        sizeBytes: asset.fileSize ?? undefined,
      });
    }
    return items;
  }, []);

  return { pickFromGallery };
}

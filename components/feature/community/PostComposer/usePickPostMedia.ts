import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export type PickedPostMedia = {
  uri: string;
  kind: "image" | "video";
  mimeType?: string | null;
  durationMs?: number;
};

export function usePickPostMedia() {
  const pickMedia = useCallback(async (): Promise<PickedPostMedia[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow media access to attach photos or videos to your post.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: false,
      quality: 0.85,
      videoMaxDuration: 60,
    });

    if (result.canceled) return [];
    const asset = result.assets[0];
    if (!asset?.uri) return [];

    return [
      {
        uri: asset.uri,
        kind: asset.type === "video" ? "video" : "image",
        mimeType: asset.mimeType,
        durationMs: asset.duration ?? undefined,
      },
    ];
  }, []);

  return { pickMedia };
}

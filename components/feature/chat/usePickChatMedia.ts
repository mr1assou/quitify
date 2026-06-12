import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export type ChatMediaPick = {
  uri: string;
  kind: "image" | "video";
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

    return result.assets
      .map((asset) => {
        const kind = asset.type === "video" ? "video" : "image";
        if (!asset.uri) return null;
        return { uri: asset.uri, kind } satisfies ChatMediaPick;
      })
      .filter((item): item is ChatMediaPick => item !== null);
  }, []);

  return { pickFromGallery };
}

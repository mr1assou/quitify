import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export type PickedPostImage = {
  uri: string;
  mimeType?: string | null;
};

export function usePickPostImage() {
  const pickImages = useCallback(async (): Promise<PickedPostImage[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach images to your post.");
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

    return [{ uri: asset.uri, mimeType: asset.mimeType }];
  }, []);

  return { pickImages };
}

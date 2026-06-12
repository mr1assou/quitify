import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export function usePickPostImage() {
  const pickImages = useCallback(async (): Promise<string[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach images to your post.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.85,
    });

    if (result.canceled) return [];
    return result.assets.map((asset) => asset.uri).filter(Boolean);
  }, []);

  return { pickImages };
}

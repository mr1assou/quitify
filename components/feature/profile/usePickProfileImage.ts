import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export type PickedProfileImage = {
  uri: string;
  mimeType?: string | null;
};

export function usePickProfileImage() {
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

    return [{ uri: asset.uri, mimeType: asset.mimeType }];
  }, []);

  return { pickImages };
}

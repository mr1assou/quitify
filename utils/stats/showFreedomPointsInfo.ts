import { Alert } from "react-native";

export function showFreedomPointsInfo(title: string, message: string) {
  Alert.alert(title, message);
}

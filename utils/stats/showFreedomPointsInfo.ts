import { Alert } from "react-native";

import { FREEDOM_POINTS_INFO } from "@/constants/stats/freedomPointsInfo";

export function showFreedomPointsInfo() {
  Alert.alert(FREEDOM_POINTS_INFO.title, FREEDOM_POINTS_INFO.message);
}

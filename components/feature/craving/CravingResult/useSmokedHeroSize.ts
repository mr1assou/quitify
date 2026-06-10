import { useWindowDimensions } from "react-native";

export function useSmokedHeroSize() {
  const { width } = useWindowDimensions();
  return Math.round(Math.min(width * 0.82, 360));
}

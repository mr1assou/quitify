import { useEffect } from "react";
import { Text, View } from "react-native";

type Props = {
  id: string;
  x: number;
  y: number;
  combo: number;
  onDone: (id: string) => void;
};

/** Short combo label. No scale or fade animation. */
export function NinjaSliceBurst({ id, x, y, combo, onDone }: Props) {
  useEffect(() => {
    const timeoutId = setTimeout(() => onDone(id), 400);
    return () => clearTimeout(timeoutId);
  }, [id, onDone]);

  if (combo < 2) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x - 18,
        top: y - 18,
      }}
    >
      <Text className="text-xs font-bold text-accent">x{combo}</Text>
    </View>
  );
}

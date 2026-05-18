import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  onPress: () => void;
};

/**
 * Round primary-tinted icon button used as the universal "open profile / menu"
 * affordance, mirroring the inspiration screens' top-right circle.
 */
export function HamburgerButton({ onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      className="h-11 w-11 items-center justify-center rounded-full bg-primary active:opacity-80"
    >
      <Ionicons name="menu" size={22} color={colors.white} />
    </Pressable>
  );
}

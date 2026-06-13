import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import type { MessageReadStatus } from "@/types/chat";

type Props = {
  status: MessageReadStatus;
  /** Bubbles sent by the current user sit on a colored background. */
  onPrimary?: boolean;
};

export function MessageReadTicks({ status, onPrimary = false }: Props) {
  const seen = status === "seen";
  const icon = seen ? "checkmark-done" : "checkmark";
  const color = onPrimary ? (seen ? "#B8E6FF" : "rgba(255,255,255,0.75)") : seen ? "#3B82F6" : "#9CA3AF";

  return (
    <View className="ml-0.5">
      <Ionicons name={icon} size={14} color={color} />
    </View>
  );
}

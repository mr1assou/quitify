import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import type { MessageReadStatus, MessageSyncStatus } from "@/types/chat/chat";

type Props = {
  status: MessageReadStatus;
  /** Local-first delivery state; overrides the ticks while not yet on the server. */
  syncStatus?: MessageSyncStatus;
  /** Bubbles sent by the current user sit on a colored background. */
  onPrimary?: boolean;
};

export function MessageReadTicks({ status, syncStatus, onPrimary = false }: Props) {
  if (syncStatus === "pending") {
    return (
      <View className="ml-0.5">
        <Ionicons name="time-outline" size={13} color={onPrimary ? "rgba(255,255,255,0.75)" : "#9CA3AF"} />
      </View>
    );
  }

  if (syncStatus === "failed") {
    return (
      <View className="ml-0.5">
        <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
      </View>
    );
  }

  const seen = status === "seen";
  const icon = seen ? "checkmark-done" : "checkmark";
  const color = onPrimary ? (seen ? "#B8E6FF" : "rgba(255,255,255,0.75)") : seen ? "#3B82F6" : "#9CA3AF";

  return (
    <View className="ml-0.5">
      <Ionicons name={icon} size={14} color={color} />
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ChatMessage } from "@/types/chat/chat";
import { formatMessageClockTime } from "@/utils/chat/formatMessageTime";
import {
  formatCallHistoryLabel,
  parseCallHistoryPayload,
} from "@/utils/call/callHistoryMessage";

type Props = {
  message: ChatMessage;
  fromMe: boolean;
  timeZone: string;
  showTimestamp?: boolean;
};

export function CallHistoryBubble({
  message,
  fromMe,
  timeZone,
  showTimestamp = true,
}: Props) {
  const payload = parseCallHistoryPayload(message.text);
  if (!payload) return null;

  const label = formatCallHistoryLabel(payload, fromMe);
  const icon =
    payload.status === "missed"
      ? "call-outline"
      : payload.callKind === "video"
        ? "videocam"
        : "call";
  const iconColor =
    payload.status === "missed" ? "#E85D04" : "rgba(245,240,235,0.85)";

  return (
    <View className="my-2 items-center">
      <View className="flex-row items-center gap-1.5 rounded-full bg-section px-3 py-1.5 dark:bg-d-surface">
        <Ionicons
          name={icon}
          size={14}
          color={iconColor}
          style={
            payload.status === "declined" && fromMe
              ? { transform: [{ rotate: "135deg" }] }
              : undefined
          }
        />
        <Text className="text-xs font-medium text-muted-foreground dark:text-d-muted">
          {label}
        </Text>
      </View>
      {showTimestamp ? (
        <Text className="mt-1 text-[10px] text-muted-foreground dark:text-d-muted">
          {formatMessageClockTime(message.createdAt, timeZone)}
        </Text>
      ) : null}
    </View>
  );
}

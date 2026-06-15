import { Text, View } from "react-native";

import { ChatMessageMedia } from "@/components/feature/chat/ChatMessageMedia";
import { MessageReadTicks } from "@/components/feature/chat/MessageReadTicks";
import type { ChatMessage, MessageReadStatus } from "@/types/chat";
import { formatMessageClockTime } from "@/utils/chat/formatMessageTime";

type Props = {
  message: ChatMessage;
  fromMe: boolean;
  readStatus?: MessageReadStatus;
  timeZone: string;
  /** Show timestamp under bubble — usually only on the last in a group. */
  showTimestamp?: boolean;
};

export function MessageBubble({
  message,
  fromMe,
  readStatus,
  timeZone,
  showTimestamp = true,
}: Props) {
  if (message.kind === "system") {
    return (
      <View className="my-1 items-center">
        <View className="rounded-full bg-section px-3 py-1 dark:bg-d-surface">
          <Text className="text-xs text-muted-foreground dark:text-d-muted">{message.text}</Text>
        </View>
      </View>
    );
  }

  const status = fromMe ? (readStatus ?? message.readStatus ?? "unseen") : undefined;
  const time = formatMessageClockTime(message.createdAt, timeZone);
  const isMedia = message.kind === "image" || message.kind === "video" || message.kind === "audio";
  const hasMedia = isMedia && Boolean(message.mediaUrl);

  return (
    <View className={`my-0.5 ${fromMe ? "items-end" : "items-start"}`}>
      <View
        className={[
          hasMedia ? "max-w-[82%] overflow-hidden p-1.5" : "max-w-[78%] px-4 py-2.5",
          "rounded-3xl bg-section dark:bg-d-surface",
          fromMe ? "rounded-tr-md" : "rounded-tl-md",
        ].join(" ")}
      >
        {hasMedia ? <ChatMessageMedia message={message} /> : null}

        {message.text ? (
          <Text
            className={`text-base leading-5 text-foreground dark:text-d-text ${
              hasMedia ? "px-2 pb-1 pt-2" : ""
            }`}
          >
            {message.text}
          </Text>
        ) : null}

        {!hasMedia && !message.text ? (
          <Text className="text-base leading-5 text-foreground dark:text-d-text">
            {message.kind === "image"
              ? "📷 Photo"
              : message.kind === "video"
                ? "🎥 Video"
                : "🎤 Voice message"}
          </Text>
        ) : null}

        {fromMe && status ? (
          <View className={`flex-row items-center justify-end gap-1 ${hasMedia ? "px-2 pb-1" : "mt-1"}`}>
            <Text className="text-[10px] text-muted-foreground dark:text-d-muted">{time}</Text>
            <MessageReadTicks status={status} />
          </View>
        ) : null}
      </View>

      {showTimestamp && !fromMe ? (
        <Text className="ml-2 mt-1 text-[10px] text-muted-foreground dark:text-d-muted">
          {time}
        </Text>
      ) : null}

      {showTimestamp && fromMe && !status ? (
        <Text className="mr-2 mt-1 text-[10px] text-muted-foreground dark:text-d-muted">
          {time}
        </Text>
      ) : null}
    </View>
  );
}

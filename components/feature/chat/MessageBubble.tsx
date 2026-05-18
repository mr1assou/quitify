import { Text, View } from "react-native";

import type { ChatMessage } from "@/types/chat";
import { formatClockTime } from "@/utils/community";

type Props = {
  message: ChatMessage;
  fromMe: boolean;
  /** Show timestamp under bubble — usually only on the last in a group. */
  showTimestamp?: boolean;
};

export function MessageBubble({ message, fromMe, showTimestamp = true }: Props) {
  if (message.kind === "system") {
    return (
      <View className="my-1 items-center">
        <View className="rounded-full bg-section px-3 py-1 dark:bg-d-surface">
          <Text className="text-xs text-muted-foreground dark:text-d-muted">{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`my-0.5 ${fromMe ? "items-end" : "items-start"}`}>
      <View
        className={[
          "max-w-[78%] rounded-3xl px-4 py-2.5",
          fromMe
            ? "bg-primary rounded-tr-md"
            : "bg-section rounded-tl-md dark:bg-d-surface",
        ].join(" ")}
      >
        <Text
          className={`text-base leading-5 ${
            fromMe ? "text-white" : "text-foreground dark:text-d-text"
          }`}
        >
          {message.text}
        </Text>
      </View>
      {showTimestamp ? (
        <Text className={`mt-1 text-[10px] text-muted-foreground dark:text-d-muted ${fromMe ? "mr-2" : "ml-2"}`}>
          {formatClockTime(message.createdAt)}
        </Text>
      ) : null}
    </View>
  );
}

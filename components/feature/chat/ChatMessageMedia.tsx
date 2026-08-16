import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ChatMessage } from "@/types/chat/chat";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

import { ChatAudioMessage } from "./ChatAudioMessage";
import { ChatImageLightbox } from "./ChatImageLightbox";

type Props = {
  message: ChatMessage;
};

const MEDIA_WIDTH = 220;
const MEDIA_HEIGHT = 160;

export function ChatMessageMedia({ message }: Props) {
  if (message.kind === "image" && message.mediaUrl) {
    return (
      <ChatImageMessage
        uri={message.mediaUrl}
        isGif={isGifMessage(message)}
      />
    );
  }

  if (message.kind === "video" && message.mediaUrl) {
    return <ChatVideoMessage uri={message.mediaUrl} durationMs={message.mediaDurationMs} />;
  }

  if (message.kind === "audio" && message.mediaUrl) {
    return <ChatAudioMessage uri={message.mediaUrl} durationMs={message.mediaDurationMs} />;
  }

  return null;
}

function isGifMessage(message: ChatMessage): boolean {
  const mime = message.mediaMimeType?.toLowerCase() ?? "";
  if (mime === "image/gif") return true;
  const url = message.mediaUrl?.toLowerCase() ?? "";
  return url.includes(".gif");
}

function ChatImageMessage({ uri, isGif }: { uri: string; isGif: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel={isGif ? "View GIF" : "View photo"}
      >
        <Image
          source={{ uri }}
          style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT, borderRadius: 16 }}
          contentFit="cover"
          accessibilityLabel={isGif ? "GIF message" : "Chat photo"}
        />
      </Pressable>

      <ChatImageLightbox
        uri={uri}
        visible={open}
        onClose={() => setOpen(false)}
        accessibilityLabel={isGif ? "GIF message" : "Chat photo"}
      />
    </>
  );
}

function ChatVideoMessage({ uri, durationMs }: { uri: string; durationMs?: number }) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const playerRef = useRef<Video>(null);

  const close = useCallback(async () => {
    try {
      await playerRef.current?.pauseAsync();
    } catch {
      // ignore
    }
    setOpen(false);
  }, []);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityLabel="Play video message">
        <View
          style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT, borderRadius: 16, overflow: "hidden" }}
        >
          <Video
            source={{ uri }}
            style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isMuted
            isLooping={false}
            pointerEvents="none"
          />
          <View className="absolute inset-0 items-center justify-center bg-black/25">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-black/60">
              <Ionicons name="play" size={22} color="white" />
            </View>
          </View>
          {durationMs ? (
            <View className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5">
              <Text className="text-xs font-semibold text-white">
                {formatMediaDuration(durationMs)}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      <Modal visible={open} animationType="fade" onRequestClose={() => void close()}>
        <View className="flex-1 bg-black">
          <Pressable
            onPress={() => void close()}
            className="absolute right-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            style={{ top: Math.max(insets.top, 12) + 8 }}
            accessibilityLabel="Close video"
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          <Video
            ref={playerRef}
            source={{ uri }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
          />
        </View>
      </Modal>
    </>
  );
}


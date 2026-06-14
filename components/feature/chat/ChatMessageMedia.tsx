import { Ionicons } from "@expo/vector-icons";
import { Audio, ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { ChatMessage } from "@/types/chat";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

type Props = {
  message: ChatMessage;
  fromMe: boolean;
};

const MEDIA_WIDTH = 220;
const MEDIA_HEIGHT = 160;

export function ChatMessageMedia({ message, fromMe }: Props) {
  if (message.kind === "image" && message.mediaUrl) {
    return (
      <Image
        source={{ uri: message.mediaUrl }}
        style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT, borderRadius: 16 }}
        contentFit="cover"
        accessibilityLabel="Chat photo"
      />
    );
  }

  if (message.kind === "video" && message.mediaUrl) {
    return <ChatVideoMessage uri={message.mediaUrl} durationMs={message.mediaDurationMs} />;
  }

  if (message.kind === "audio" && message.mediaUrl) {
    return (
      <ChatAudioMessage
        uri={message.mediaUrl}
        durationMs={message.mediaDurationMs}
        fromMe={fromMe}
      />
    );
  }

  return null;
}

function ChatVideoMessage({ uri, durationMs }: { uri: string; durationMs?: number }) {
  const [open, setOpen] = useState(false);

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

      <Modal visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-black">
          <Pressable
            onPress={() => setOpen(false)}
            className="absolute right-4 top-14 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            accessibilityLabel="Close video"
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          <Video
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

function ChatAudioMessage({
  uri,
  durationMs,
  fromMe,
}: {
  uri: string;
  durationMs?: number;
  fromMe: boolean;
}) {
  const { colors } = useTheme();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);

  const unload = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    if (!sound) return;
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      void unload();
    };
  }, [unload]);

  const togglePlay = async () => {
    try {
      if (playing && soundRef.current) {
        await soundRef.current.pauseAsync();
        setPlaying(false);
        return;
      }

      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) return;
            setPositionMs(status.positionMillis ?? 0);
            if (status.didJustFinish) {
              setPlaying(false);
              setPositionMs(0);
            }
          },
        );
        soundRef.current = sound;
        setPlaying(true);
        return;
      }

      await soundRef.current.playAsync();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const label = formatMediaDuration(playing ? positionMs : durationMs);

  return (
    <Pressable
      onPress={() => void togglePlay()}
      className="min-w-[180px] flex-row items-center gap-3"
      accessibilityLabel="Voice message"
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: fromMe ? "rgba(255,255,255,0.2)" : `${colors.primary}20` }}
      >
        <Ionicons
          name={playing ? "pause" : "play"}
          size={18}
          color={fromMe ? colors.white : colors.primary}
        />
      </View>
      <View className="flex-1 flex-row items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              height: 8 + (i % 3) * 6,
              backgroundColor: fromMe ? "rgba(255,255,255,0.85)" : colors.primary,
              opacity: playing ? 1 : 0.65,
            }}
          />
        ))}
      </View>
      <Text
        className={`text-xs font-medium ${fromMe ? "text-white/90" : "text-muted-foreground dark:text-d-muted"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { getCommunityUser } from "@/constants/community/communityUsers";
import { useTheme } from "@/context/ThemeContext";
import type { CallKind } from "@/types/chat/chat";

function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function CallScreen() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind: CallKind }>();
  const callKind: CallKind = kind === "video" ? "video" : "audio";
  const { colors } = useTheme();

  const participant = id ? getCommunityUser(id) : undefined;
  const [status, setStatus] = useState<"calling" | "ringing" | "in-call">("calling");
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(callKind === "video");
  const [cameraOn, setCameraOn] = useState(callKind === "video");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const r = setTimeout(() => setStatus("ringing"), 800);
    const c = setTimeout(() => {
      setStatus("in-call");
      setStartedAt(Date.now());
    }, 2400);
    return () => {
      clearTimeout(r);
      clearTimeout(c);
    };
  }, []);

  useEffect(() => {
    if (status !== "in-call") return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status]);

  if (!participant) {
    return (
      <SafeAreaView className="flex-1 bg-foreground">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-white">User not found.</Text>
          <Pressable onPress={() => router.back()} className="mt-3 rounded-full bg-white/15 px-5 py-2">
            <Text className="text-sm font-bold text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const statusLabel =
    status === "calling"
      ? "Calling…"
      : status === "ringing"
        ? "Ringing…"
        : startedAt
          ? formatDuration(now - startedAt)
          : "Connected";

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0F0B09" }}>
      <View className="flex-1 items-center pt-12">
        <Text className="text-xs font-bold uppercase tracking-widest text-white/60">
          {callKind === "video" ? "Video call" : "Voice call"}
        </Text>

        <View className="mt-12 items-center">
          <UserAvatar user={participant} size={140} ringed />
          <Text className="mt-5 text-3xl font-bold text-white">{participant.name}</Text>
          <Text className="mt-1 text-base text-white/70">{statusLabel}</Text>
        </View>

        {callKind === "video" && cameraOn ? (
          <View className="absolute bottom-44 right-6 h-32 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/5">
            <Ionicons name="person" size={36} color="rgba(255,255,255,0.75)" />
          </View>
        ) : null}
      </View>

      <View className="px-6 pb-8">
        <View className="mb-6 flex-row items-center justify-around">
          <RoundButton
            icon={muted ? "mic-off" : "mic"}
            active={!muted}
            label={muted ? "Unmute" : "Mute"}
            onPress={() => setMuted((m) => !m)}
          />
          {callKind === "video" ? (
            <RoundButton
              icon={cameraOn ? "videocam" : "videocam-off"}
              active={cameraOn}
              label={cameraOn ? "Camera" : "Camera off"}
              onPress={() => setCameraOn((c) => !c)}
            />
          ) : (
            <RoundButton
              icon={speaker ? "volume-high" : "volume-mute"}
              active={speaker}
              label="Speaker"
              onPress={() => setSpeaker((s) => !s)}
            />
          )}
          <RoundButton
            icon="chatbubble"
            active
            label="Chat"
            onPress={() => router.replace(`/chat-by-user/${participant.id}`)}
          />
        </View>

        <Pressable
          onPress={() => router.back()}
          className="mx-auto h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.alert }}
          accessibilityLabel="End call"
        >
          <Ionicons name="call" size={26} color="white" style={{ transform: [{ rotate: "135deg" }] }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function RoundButton({
  icon,
  active,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center">
      <View
        className="h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)" }}
      >
        <Ionicons name={icon} size={22} color="white" />
      </View>
      <Text className="mt-2 text-xs text-white/80">{label}</Text>
    </Pressable>
  );
}

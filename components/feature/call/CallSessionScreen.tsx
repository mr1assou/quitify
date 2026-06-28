import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { CallParticipantAvatar } from "@/components/feature/call/CallParticipantAvatar";
import { VideoCallStage } from "@/components/feature/call/VideoCallStage";
import { useWebRTCCall, type CallStatus } from "@/hooks/call/useWebRTCCall";
import type { CallKind, CallRole } from "@/types/call/signaling";
import type { CommunityUser } from "@/types/community/community";

type Props = {
  peer: CommunityUser;
  self: CommunityUser;
  kind: CallKind;
  callId: string;
  role: CallRole;
  peerUserId: number;
};

function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function statusLabel(status: CallStatus, durationMs: number): string {
  switch (status) {
    case "calling":
      return "Calling…";
    case "connected":
      return formatDuration(durationMs);
    case "ended":
      return "Call ended";
    default:
      return "Connecting…";
  }
}

export function CallSessionScreen({
  peer,
  self,
  kind,
  callId,
  role,
  peerUserId,
}: Props) {
  const { width, height } = useWindowDimensions();
  const {
    status,
    muted,
    speaker,
    cameraOn,
    localStream,
    remoteStream,
    durationMs,
    toggleMute,
    toggleSpeaker,
    toggleCamera,
    hangUp,
  } = useWebRTCCall({ callId, peerUserId, role, kind });

  const pulse = useSharedValue(1);
  const isConnected = status === "connected";

  useEffect(() => {
    if (status === "ended") {
      const timer = setTimeout(() => router.back(), 600);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (isConnected) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse, isConnected]);

  const label = statusLabel(status, durationMs);
  const isVideo = kind === "video";

  const peerPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isConnected ? 1 : pulse.value }],
  }));

  const endCall = () => hangUp();

  return (
    <View className="flex-1">
      <AppScreenBackground isDark showOrbs />

      <View
        pointerEvents="none"
        className="absolute inset-0 bg-black/35"
      />

      <SafeAreaView className="flex-1">
        <Animated.View entering={FadeIn.duration(400)} className="flex-1">
          <View className="flex-row items-center justify-between px-5 pt-2">
            <View className="rounded-full bg-d-surface/70 px-3 py-1.5">
              <Text className="text-xs font-bold uppercase tracking-widest text-d-muted">
                {isVideo ? "Video call" : "Voice call"}
              </Text>
            </View>
            <Pressable
              onPress={endCall}
              hitSlop={12}
              accessibilityLabel="Minimize call"
              className="h-10 w-10 items-center justify-center rounded-full bg-d-surface/70 active:opacity-70"
            >
              <Ionicons name="chevron-down" size={22} color="#F5F0EB" />
            </Pressable>
          </View>

          {isVideo ? (
            <VideoCallStage
              peer={peer}
              self={self}
              label={label}
              status={status}
              cameraOn={cameraOn}
              localStream={localStream}
              remoteStream={remoteStream}
              peerPulseStyle={peerPulseStyle}
              stageHeight={height * 0.68}
              stageWidth={width}
            />
          ) : (
            <VoiceCallStage
              peer={peer}
              self={self}
              label={label}
              peerPulseStyle={peerPulseStyle}
            />
          )}

          <Animated.View
            entering={FadeInDown.delay(200).duration(450)}
            className="mt-auto px-6 pb-6"
          >
            <View className="flex-row items-end justify-center gap-10">
              <CallControlButton
                icon={muted ? "mic-off" : "mic"}
                label={muted ? "Unmute" : "Mute"}
                active={!muted}
                onPress={toggleMute}
              />

              <Pressable
                onPress={endCall}
                accessibilityLabel="End call"
                className="items-center active:opacity-85"
              >
                <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
                  <Ionicons
                    name="call"
                    size={28}
                    color="#FFFFFF"
                    style={{ transform: [{ rotate: "135deg" }] }}
                  />
                </View>
                <Text className="mt-2 text-xs font-medium text-d-muted">End call</Text>
              </Pressable>

              {isVideo ? (
                <CallControlButton
                  icon={cameraOn ? "videocam" : "videocam-off"}
                  label={cameraOn ? "Camera" : "Camera off"}
                  active={cameraOn}
                  onPress={toggleCamera}
                />
              ) : (
                <CallControlButton
                  icon={speaker ? "volume-high" : "volume-mute"}
                  label="Speaker"
                  active={speaker}
                  onPress={toggleSpeaker}
                />
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function VoiceCallStage({
  peer,
  self,
  label,
  peerPulseStyle,
}: {
  peer: CommunityUser;
  self: CommunityUser;
  label: string;
  peerPulseStyle: ReturnType<typeof useAnimatedStyle>;
}) {
  return (
    <View className="flex-1 items-center justify-between px-6 py-6">
      <View className="items-center pt-4">
        <Animated.View style={peerPulseStyle}>
          <CallParticipantAvatar user={peer} size={132} showFlag />
        </Animated.View>
        <Text
          className="mt-4 max-w-[220px] text-center text-xl font-bold text-d-text"
          numberOfLines={1}
        >
          {peer.name}
        </Text>
        <Text className="mt-2 text-sm tabular-nums text-d-muted">{label}</Text>
      </View>

      <View className="items-center">
        <View className="h-10 w-px bg-d-border/60" />
        <Ionicons name="arrow-down" size={16} color="rgba(245,240,235,0.35)" />
        <View className="h-10 w-px bg-d-border/60" />
      </View>

      <View className="items-center pb-4">
        <CallParticipantAvatar
          user={self}
          size={104}
          ringColor="rgba(255,255,255,0.18)"
          showFlag
        />
        <Text className="mt-3 text-base font-semibold text-d-text">You</Text>
      </View>
    </View>
  );
}

function CallControlButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center active:opacity-75">
      <View
        className="h-14 w-14 items-center justify-center rounded-full"
        style={{
          backgroundColor: active ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
        }}
      >
        <Ionicons name={icon} size={22} color="#F5F0EB" />
      </View>
      <Text className="mt-2 text-xs font-medium text-d-muted">{label}</Text>
    </Pressable>
  );
}
